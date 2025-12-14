import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { ScrapedData, AdScript } from '../types';

const FPS = 30;
const WIDTH = 1920;
const HEIGHT = 1080;
const VIDEO_DURATION = 30;

let ffmpegInstance: FFmpeg | null = null;

async function loadFFmpeg(onProgress: (progress: number) => void): Promise<FFmpeg> {
  if (ffmpegInstance) return ffmpegInstance;

  const ffmpeg = new FFmpeg();

  ffmpeg.on('progress', ({ progress }) => {
    onProgress(progress);
  });

  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
  });

  ffmpegInstance = ffmpeg;
  return ffmpeg;
}

export async function generateVideo(
  data: ScrapedData,
  script: AdScript,
  onProgress: (progress: number) => void
): Promise<Blob> {
  onProgress(0);

  const ffmpeg = await loadFFmpeg((p) => onProgress(p * 0.1));
  onProgress(0.1);

  const audioBuffers = await generateAudioSegments(script, (p) => onProgress(0.1 + p * 0.2));
  onProgress(0.3);

  const frames = await generateFrames(data, script, audioBuffers, (p) => onProgress(0.3 + p * 0.4));
  onProgress(0.7);

  const videoBlob = await encodeVideo(ffmpeg, frames, audioBuffers, (p) => onProgress(0.7 + p * 0.3));
  onProgress(1.0);

  return videoBlob;
}

async function generateAudioSegments(
  script: AdScript,
  onProgress: (progress: number) => void
): Promise<AudioBuffer[]> {
  const audioContext = new AudioContext();
  const buffers: AudioBuffer[] = [];

  for (let i = 0; i < script.segments.length; i++) {
    const segment = script.segments[i];
    try {
      const audioBuffer = await fetchTTS(segment.text, audioContext);
      buffers.push(audioBuffer);
    } catch (error) {
      console.warn('TTS failed, using silence:', error);
      const silenceBuffer = audioContext.createBuffer(2, audioContext.sampleRate * segment.duration, audioContext.sampleRate);
      buffers.push(silenceBuffer);
    }
    onProgress((i + 1) / script.segments.length);
  }

  return buffers;
}

async function fetchTTS(text: string, audioContext: AudioContext): Promise<AudioBuffer> {
  const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=en&q=${encodeURIComponent(text)}`;

  const response = await fetch(ttsUrl);
  if (!response.ok) throw new Error('TTS fetch failed');

  const arrayBuffer = await response.arrayBuffer();
  return await audioContext.decodeAudioData(arrayBuffer);
}

async function generateFrames(
  data: ScrapedData,
  script: AdScript,
  audioBuffers: AudioBuffer[],
  onProgress: (progress: number) => void
): Promise<ImageData[]> {
  const canvas = new OffscreenCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d')!;
  const frames: ImageData[] = [];

  const images = await loadImages(data.images);

  let currentTime = 0;
  let segmentIndex = 0;
  let segmentStartTime = 0;

  const totalFrames = FPS * VIDEO_DURATION;

  for (let frameNum = 0; frameNum < totalFrames; frameNum++) {
    currentTime = frameNum / FPS;

    while (segmentIndex < script.segments.length && currentTime >= segmentStartTime + script.segments[segmentIndex].duration) {
      segmentStartTime += script.segments[segmentIndex].duration;
      segmentIndex++;
    }

    if (segmentIndex >= script.segments.length) {
      segmentIndex = script.segments.length - 1;
    }

    const segment = script.segments[segmentIndex];
    const imageIndex = segmentIndex % images.length;

    ctx.fillStyle = data.primaryColor;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    if (images[imageIndex]) {
      const img = images[imageIndex];
      const scale = Math.max(WIDTH / img.width, HEIGHT / img.height);
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;
      const x = (WIDTH - scaledWidth) / 2;
      const y = (HEIGHT - scaledHeight) / 2;

      ctx.globalAlpha = 0.4;
      ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
      ctx.globalAlpha = 1.0;
    }

    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(0, HEIGHT - 250, WIDTH, 250);

    ctx.fillStyle = 'white';
    ctx.font = 'bold 64px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const lines = wrapText(ctx, segment.text, WIDTH - 100);
    const lineHeight = 80;
    const startY = HEIGHT - 125 - ((lines.length - 1) * lineHeight) / 2;

    lines.forEach((line, i) => {
      ctx.fillText(line, WIDTH / 2, startY + i * lineHeight);
    });

    const imageData = ctx.getImageData(0, 0, WIDTH, HEIGHT);
    frames.push(imageData);

    if (frameNum % 30 === 0) {
      onProgress(frameNum / totalFrames);
    }
  }

  onProgress(1.0);
  return frames;
}

async function loadImages(imageUrls: string[]): Promise<HTMLImageElement[]> {
  const promises = imageUrls.map(async (url) => {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = url;
      });
      return img;
    } catch {
      return null;
    }
  });

  const results = await Promise.all(promises);
  return results.filter((img): img is HTMLImageElement => img !== null);
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

  return lines;
}

async function encodeVideo(
  ffmpeg: FFmpeg,
  frames: ImageData[],
  audioBuffers: AudioBuffer[],
  onProgress: (progress: number) => void
): Promise<Blob> {
  onProgress(0);

  for (let i = 0; i < frames.length; i++) {
    const imageData = frames[i];
    const canvas = new OffscreenCanvas(WIDTH, HEIGHT);
    const ctx = canvas.getContext('2d')!;
    ctx.putImageData(imageData, 0, 0);

    const blob = await canvas.convertToBlob({ type: 'image/png' });
    const buffer = await blob.arrayBuffer();
    const filename = `frame${String(i).padStart(4, '0')}.png`;
    await ffmpeg.writeFile(filename, new Uint8Array(buffer));

    if (i % 30 === 0) {
      onProgress(i / frames.length * 0.5);
    }
  }

  onProgress(0.5);

  const combinedAudio = await combineAudioBuffers(audioBuffers);
  const audioBlob = await audioBufferToWav(combinedAudio);
  const audioBuffer = await audioBlob.arrayBuffer();
  await ffmpeg.writeFile('audio.wav', new Uint8Array(audioBuffer));

  onProgress(0.6);

  await ffmpeg.exec([
    '-framerate', String(FPS),
    '-i', 'frame%04d.png',
    '-i', 'audio.wav',
    '-c:v', 'libx264',
    '-preset', 'ultrafast',
    '-pix_fmt', 'yuv420p',
    '-c:a', 'aac',
    '-b:a', '192k',
    '-shortest',
    '-t', String(VIDEO_DURATION),
    'output.mp4'
  ]);

  onProgress(0.9);

  const data = await ffmpeg.readFile('output.mp4');
  const videoBlob = new Blob([data], { type: 'video/mp4' });

  onProgress(1.0);
  return videoBlob;
}

function combineAudioBuffers(buffers: AudioBuffer[]): AudioBuffer {
  if (buffers.length === 0) {
    const audioContext = new AudioContext();
    return audioContext.createBuffer(2, audioContext.sampleRate * VIDEO_DURATION, audioContext.sampleRate);
  }

  const sampleRate = buffers[0].sampleRate;
  const totalLength = Math.min(
    buffers.reduce((sum, buffer) => sum + buffer.length, 0),
    sampleRate * VIDEO_DURATION
  );

  const audioContext = new AudioContext();
  const combined = audioContext.createBuffer(2, totalLength, sampleRate);

  let offset = 0;
  for (const buffer of buffers) {
    if (offset >= totalLength) break;

    for (let channel = 0; channel < Math.min(2, buffer.numberOfChannels); channel++) {
      const sourceData = buffer.getChannelData(channel);
      const targetData = combined.getChannelData(channel);
      const copyLength = Math.min(sourceData.length, totalLength - offset);

      for (let i = 0; i < copyLength; i++) {
        targetData[offset + i] = sourceData[i];
      }
    }
    offset += buffer.length;
  }

  return combined;
}

function audioBufferToWav(audioBuffer: AudioBuffer): Promise<Blob> {
  const numberOfChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const format = 1;
  const bitDepth = 16;

  const bytesPerSample = bitDepth / 8;
  const blockAlign = numberOfChannels * bytesPerSample;

  const data = new Float32Array(audioBuffer.length * numberOfChannels);
  for (let channel = 0; channel < numberOfChannels; channel++) {
    const channelData = audioBuffer.getChannelData(channel);
    for (let i = 0; i < audioBuffer.length; i++) {
      data[i * numberOfChannels + channel] = channelData[i];
    }
  }

  const dataLength = data.length * bytesPerSample;
  const buffer = new ArrayBuffer(44 + dataLength);
  const view = new DataView(buffer);

  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataLength, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numberOfChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(36, 'data');
  view.setUint32(40, dataLength, true);

  const volume = 0.8;
  let offset = 44;
  for (let i = 0; i < data.length; i++) {
    const sample = Math.max(-1, Math.min(1, data[i]));
    view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF * volume, true);
    offset += 2;
  }

  return Promise.resolve(new Blob([buffer], { type: 'audio/wav' }));
}
