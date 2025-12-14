# Features & Technical Details

## Core Features

### 1. URL Scraping
**Technology**: AllOrigins CORS Proxy + DOMParser

The app fetches any URL through a CORS proxy and extracts:
- **Page Title**: From `<title>` or Open Graph tags
- **Description**: From meta descriptions or Open Graph
- **Images**: From Open Graph images and `<img>` tags
- **Brand Color**: From theme-color meta tag
- **Fallbacks**: Generates placeholder content if data is missing

**Implementation**:
```typescript
const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
const response = await fetch(proxyUrl);
const data = await response.json();
const htmlContent = data.contents;
```

### 2. Script Generation
**Technology**: Template-based generation

Creates a 30-second narrative with multiple segments:
- Introduction (3s)
- Description (5s)
- Value propositions (3-4s each)
- Call to action (3s)

Each segment is timed to fit exactly 30 seconds total.

### 3. Text-to-Speech
**Technology**: Google Translate TTS API

Converts script segments to audio:
- **Endpoint**: `translate.google.com/translate_tts`
- **Format**: MP3 audio
- **Language**: English (en)
- **Free**: No API key required

**Implementation**:
```typescript
const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=en&q=${encodeURIComponent(text)}`;
const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
```

### 4. Video Frame Generation
**Technology**: OffscreenCanvas API

Creates 900 high-quality frames (30 FPS × 30 seconds):

**Frame Composition**:
1. **Background**: Extracted brand color or default blue
2. **Image Layer**: Scraped images, scaled and centered
3. **Overlay**: Semi-transparent black gradient at bottom
4. **Text**: White captions with automatic line wrapping
5. **Typography**: Bold 64px Arial for maximum readability

**Resolution**: 1920×1080 (Full HD)

### 5. Video Encoding
**Technology**: FFmpeg.wasm

Combines frames and audio into MP4:
- **Video Codec**: H.264 (libx264)
- **Audio Codec**: AAC at 192 kbps
- **Preset**: ultrafast (for speed)
- **Pixel Format**: yuv420p (universal compatibility)
- **Duration**: Exactly 30 seconds

**FFmpeg Command**:
```bash
ffmpeg -framerate 30 -i frame%04d.png -i audio.wav \
  -c:v libx264 -preset ultrafast -pix_fmt yuv420p \
  -c:a aac -b:a 192k -shortest -t 30 output.mp4
```

### 6. Progress Tracking
**Technology**: React State Management

Real-time progress through 4 stages:
1. **Scraping** (0-25%): Fetch and parse URL
2. **Script** (25-40%): Generate narrative
3. **Video** (40-90%): Create frames and encode
4. **Pack** (90-100%): Finalize and prepare download

Visual indicators:
- Step-by-step progress bar
- Animated step badges
- Percentage display

## Technical Architecture

### Frontend Stack
- **React 18**: UI framework with hooks
- **TypeScript**: Type-safe development
- **Vite**: Lightning-fast build tool
- **Tailwind CSS**: Utility-first styling

### Video Processing Stack
- **Canvas API**: Frame rendering
- **Web Audio API**: Audio processing
- **FFmpeg.wasm**: Video encoding
- **WebAssembly**: High-performance execution

### APIs & Services
- **AllOrigins**: CORS proxy (free)
- **Google Translate TTS**: Voice generation (free)
- **FFmpeg CDN**: WebAssembly modules

## Performance Optimizations

### 1. Efficient Frame Generation
- Uses OffscreenCanvas for background processing
- Batch processing of frames
- Progress updates every 30 frames

### 2. Memory Management
- Frames generated sequentially
- Audio buffers combined efficiently
- Automatic cleanup of temporary files

### 3. Video Compression
- H.264 with optimized settings
- Target file size: Under 50MB
- Balanced quality/size ratio

### 4. Loading Strategy
- FFmpeg loaded once and cached
- Lazy loading of heavy components
- Progressive enhancement

## Browser Compatibility

### Required Features
- **WebAssembly**: For FFmpeg.wasm
- **SharedArrayBuffer**: For multi-threading
- **Canvas API**: For frame rendering
- **Web Audio API**: For audio processing
- **Fetch API**: For network requests

### Security Requirements
- **HTTPS**: Required for SharedArrayBuffer
- **CORS Headers**:
  - `Cross-Origin-Opener-Policy: same-origin`
  - `Cross-Origin-Embedder-Policy: require-corp`

### Minimum Browser Versions
- Chrome 94+ (Oct 2021)
- Firefox 95+ (Dec 2021)
- Safari 15.2+ (Jan 2022)
- Edge 94+ (Oct 2021)

## File Structure

```
src/
├── App.tsx                 # Main UI component
├── main.tsx               # App entry point
├── types.ts               # TypeScript interfaces
└── utils/
    ├── scraper.ts         # URL fetching & parsing
    ├── scriptGenerator.ts # Script creation
    └── videoGenerator.ts  # Video encoding pipeline
```

## Video Specifications

### Output Format
- **Container**: MP4
- **Video Codec**: H.264 (AVC)
- **Audio Codec**: AAC
- **Resolution**: 1920×1080 (16:9)
- **Frame Rate**: 30 FPS
- **Duration**: 30 seconds
- **File Size**: 10-30 MB (typically)

### Quality Settings
- **Video Bitrate**: Auto (based on preset)
- **Audio Bitrate**: 192 kbps
- **Encoding Preset**: ultrafast
- **Profile**: High
- **Level**: 4.0

## Limitations & Trade-offs

### Known Limitations
1. **TTS Quality**: Depends on Google TTS availability
2. **Image CORS**: Some images may not load due to CORS
3. **Processing Time**: 30-60 seconds on average hardware
4. **Browser RAM**: Requires ~500MB-1GB free memory
5. **No IE Support**: Modern browsers only

### Design Choices
1. **Ultrafast Preset**: Speed over max quality
2. **Fixed Duration**: Simplifies encoding
3. **Template Script**: No AI to keep it free
4. **PNG Frames**: Better quality than JPEG
5. **Single Pass**: Faster than multi-pass encoding

## Future Enhancements

Potential improvements:
- Custom script editing
- Multiple template styles
- Background music
- Logo overlay
- Export to different formats
- Batch processing
- Cloud rendering option
