import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';
import { ScrapedData, AdScript } from '../types';

const FPS = 24;
const WIDTH = 1280;
const HEIGHT = 720;
const VIDEO_DURATION = 30;
const MAX_FRAMES = FPS * VIDEO_DURATION;

let ffmpegInstance: FFmpeg | null = null;
let ffmpegLoading: Promise<FFmpeg> | null = null;

async function loadFFmpeg(onProgress: (progress: number) => void): Promise<FFmpeg> {
  if (ffmpegInstance?.isLoaded()) return ffmpegInstance;
  if (ffmpegLoading) return ffmpegLoading;

  ffmpegLoading = (async () => {
    try {
      const ffmpeg = new FFmpeg();

      ffmpeg.on('progress', ({ progress }) => {
        onProgress(Math.min(0.95, progress));
      });

      const baseURL = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/umd';

      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript'),
      });

      ffmpegInstance = ffmpeg;
      ffmpegLoading = null;
      return ffmpeg;
    } catch (error) {
      ffmpegLoading = null;
      throw new Error(`FFmpeg load failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  })();

  return ffmpegLoading;
}

export async function generateVideo(
  data: ScrapedData,
  script: AdScript,
  onProgress: (progress: number) => void
): Promise<Blob> {
  try {
    onProgress(0);

    const ffmpeg = await loadFFmpeg((p) => onProgress(Math.min(0.15, p * 0.15)));
    onProgress(0.15);

    const audioBlob = await generateAudio(script, (p) => onProgress(0.15 + p * 0.15));
    onProgress(0.30);

    const frameData = await generateFrames(data, script, (p) => onProgress(0.30 + p * 0.55));
    onProgress(0.85);

    const videoBlob = await encodeVideo(ffmpeg, frameData, audioBlob, (p) => onProgress(0.85 + p * 0.15));
    onProgress(1.0);

    return videoBlob;
  } catch (error) {
    throw new Error(`Video generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

async function generateAudio(
  script: AdScript,
  onProgress: (progress: number) => void
): Promise<Blob> {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const sampleRate = audioContext.sampleRate;
  const totalDuration = Math.min(script.totalDuration, VIDEO_DURATION);
  const totalSamples = Math.floor(sampleRate * totalDuration);

  const audioBuffer = audioContext.createBuffer(2, totalSamples, sampleRate);
  const leftChannel = audioBuffer.getChannelData(0);
  const rightChannel = audioBuffer.getChannelData(1);

  let currentSample = 0;

  for (let i = 0; i < script.segments.length; i++) {
    const segment = script.segments[i];
    const segmentSamples = Math.floor(sampleRate * segment.duration);

    try {
      const audio = await generateSegmentAudio(segment.text, sampleRate);
      const audioData = await audio.arrayBuffer();
      const view = new Uint8Array(audioData);

      let sampleIndex = 0;
      for (let j = 0; j < Math.min(view.length, segmentSamples * 2); j += 2) {
        if (currentSample >= totalSamples) break;

        const sample = (view[j] | (view[j + 1] << 8)) / 32768.0;
        leftChannel[currentSample] = sample;
        rightChannel[currentSample] = sample;
        currentSample++;
        sampleIndex++;
      }
    } catch (error) {
      console.warn(`TTS failed for segment ${i}, using silence`);
      currentSample += segmentSamples;
    }

    onProgress((i + 1) / script.segments.length);
  }

  return audioBufferToWav(audioBuffer);
}

async function generateSegmentAudio(text: string, sampleRate: number): Promise<Blob> {
  const cleanText = text.substring(0, 200);
  const urls = [
    `https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM?text=${encodeURIComponent(cleanText)}`,
    `https://tts.api.cloud.yandex.net/tts?text=${encodeURIComponent(cleanText)}&lang=en-US`,
    `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=en&q=${encodeURIComponent(cleanText)}`,
  ];

  for (const url of urls) {
    try {
      const response = await Promise.race([
        fetch(url),
        new Promise<Response>((_, reject) =>
          setTimeout(() => reject(new Error('TTS timeout')), 5000)
        ),
      ]);

      if (response.ok) {
        return await response.blob();
      }
    } catch (error) {
      console.warn(`TTS endpoint failed: ${url}`);
      continue;
    }
  }

  return new Blob([new Uint8Array(0)], { type: 'audio/wav' });
}

async function generateFrames(
  data: ScrapedData,
  script: AdScript,
  onProgress: (progress: number) => void
): Promise<Uint8ClampedArray[]> {
  const canvas = new OffscreenCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d')!;
  const frameArrays: Uint8ClampedArray[] = [];

  const images = await loadImages(data.images);
  if (images.length === 0) {
    console.warn('No images loaded, using solid color');
  }

  let currentSegmentIndex = 0;
  let currentSegmentStartFrame = 0;

  for (let frameNum = 0; frameNum < MAX_FRAMES; frameNum++) {
    let segment = script.segments[0];
    let imageIndex = 0;

    let frameInSegment = frameNum - currentSegmentStartFrame;
    while (
      currentSegmentIndex < script.segments.length &&
      frameInSegment >= script.segments[currentSegmentIndex].duration * FPS
    ) {
      frameInSegment -= script.segments[currentSegmentIndex].duration * FPS;
      currentSegmentStartFrame += script.segments[currentSegmentIndex].duration * FPS;
      currentSegmentIndex++;
    }

    if (currentSegmentIndex < script.segments.length) {
      segment = script.segments[currentSegmentIndex];
      imageIndex = currentSegmentIndex % Math.max(1, images.length);
    }

    ctx.fillStyle = data.primaryColor || '#3b82f6';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    if (images.length > imageIndex) {
      try {
        const img = images[imageIndex];
        const scale = Math.max(WIDTH / img.width, HEIGHT / img.height);
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;
        const x = (WIDTH - scaledWidth) / 2;
        const y = (HEIGHT - scaledHeight) / 2;

        ctx.globalAlpha = 0.5;
        ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
        ctx.globalAlpha = 1.0;
      } catch (error) {
        console.warn('Image draw failed');
      }
    }

    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, HEIGHT - 200, WIDTH, 200);

    ctx.fillStyle = 'white';
    ctx.font = 'bold 48px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 4;

    const lines = wrapText(ctx, segment.text, WIDTH - 40);
    const lineHeight = 56;
    const startY = HEIGHT - 100 - ((lines.length - 1) * lineHeight) / 2;

    lines.forEach((line, i) => {
      ctx.fillText(line, WIDTH / 2, Math.max(50, startY + i * lineHeight));
    });

    const imageData = ctx.getImageData(0, 0, WIDTH, HEIGHT);
    frameArrays.push(imageData.data);

    if (frameNum % 24 === 0) {
      onProgress(frameNum / MAX_FRAMES);
    }
  }

  onProgress(1.0);
  return frameArrays;
}

async function loadImages(imageUrls: string[]): Promise<HTMLImageElement[]> {
  const loadPromises = imageUrls.slice(0, 8).map(async (url) => {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.loading = 'eager';

      const loadPromise = new Promise<HTMLImageElement>((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Image load timeout')), 8000);

        img.onload = () => {
          clearTimeout(timeout);
          resolve(img);
        };

        img.onerror = () => {
          clearTimeout(timeout);
          reject(new Error('Image load failed'));
        };

        img.src = url;
      });

      return await loadPromise;
    } catch (error) {
      console.warn(`Failed to load image: ${url}`, error);
      return null;
    }
  });

  const results = await Promise.allSettled(loadPromises);
  return results
    .filter((r) => r.status === 'fulfilled' && r.value !== null)
    .map((r) => (r as PromiseFulfilledResult<HTMLImageElement | null>).value!)
    .filter((img): img is HTMLImageElement => img !== null);
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines.slice(0, 3);
}

async function encodeVideo(
  ffmpeg: FFmpeg,
  frameArrays: Uint8ClampedArray[],
  audioBlob: Blob,
  onProgress: (progress: number) => void
): Promise<Blob> {
  try {
    onProgress(0);

    for (let i = 0; i < frameArrays.length; i++) {
      const canvas = new OffscreenCanvas(WIDTH, HEIGHT);
      const ctx = canvas.getContext('2d')!;

      const imageData = new ImageData(frameArrays[i], WIDTH, HEIGHT);
      ctx.putImageData(imageData, 0, 0);

      const blob = await canvas.convertToBlob({ type: 'image/jpeg', quality: 0.8 });
      const buffer = await blob.arrayBuffer();
      const filename = `frame${String(i).padStart(5, '0')}.jpg`;

      await ffmpeg.writeFile(filename, new Uint8Array(buffer));

      if (i % 12 === 0) {
        onProgress(Math.min(0.6, (i / frameArrays.length) * 0.6));
      }
    }

    onProgress(0.65);

    const audioBuffer = await audioBlob.arrayBuffer();
    await ffmpeg.writeFile('audio.wav', new Uint8Array(audioBuffer));

    onProgress(0.70);

    const ffmpegArgs = [
      '-framerate', String(FPS),
      '-i', 'frame%05d.jpg',
      '-i', 'audio.wav',
      '-c:v', 'libx264',
      '-preset', 'veryfast',
      '-crf', '23',
      '-pix_fmt', 'yuv420p',
      '-c:a', 'libmp3lame',
      '-b:a', '128k',
      '-shortest',
      '-movflags', '+faststart',
      'output.mp4',
    ];

    await ffmpeg.exec(ffmpegArgs);

    onProgress(0.95);

    const data = await ffmpeg.readFile('output.mp4');
    const videoBlob = new Blob([data.buffer], { type: 'video/mp4' });

    for (let i = 0; i < frameArrays.length; i++) {
      const filename = `frame${String(i).padStart(5, '0')}.jpg`;
      await ffmpeg.deleteFile(filename).catch(() => {});
    }
    await ffmpeg.deleteFile('audio.wav').catch(() => {});
    await ffmpeg.deleteFile('output.mp4').catch(() => {});

    onProgress(1.0);
    return videoBlob;
  } catch (error) {
    throw new Error(`Video encoding failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

async function audioBufferToWav(audioBuffer: AudioBuffer): Promise<Blob> {
  const numberOfChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const bitDepth = 16;
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numberOfChannels * bytesPerSample;

  const audioData = new Float32Array(audioBuffer.length * numberOfChannels);
  for (let channel = 0; channel < numberOfChannels; channel++) {
    const channelData = audioBuffer.getChannelData(channel);
    for (let i = 0; i < audioBuffer.length; i++) {
      audioData[i * numberOfChannels + channel] = channelData[i];
    }
  }

  const dataLength = audioData.length * bytesPerSample;
  const headerLength = 44;
  const wavBuffer = new ArrayBuffer(headerLength + dataLength);
  const view = new DataView(wavBuffer);

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataLength, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numberOfChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(36, 'data');
  view.setUint32(40, dataLength, true);

  let index = headerLength;
  const volume = 0.8;

  for (let i = 0; i < audioData.length; i++) {
    const s = Math.max(-1, Math.min(1, audioData[i])) * volume;
    view.setInt16(index, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    index += 2;
  }

  return new Blob([wavBuffer], { type: 'audio/wav' });
}
