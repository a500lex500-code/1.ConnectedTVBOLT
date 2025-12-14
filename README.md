# CTV Ad Generator

A browser-based tool that generates professional 30-second Connected TV advertisements from any URL.

## Features

- **URL Scraping**: Automatically extracts title, description, images, and brand colors
- **AI Script Generation**: Creates engaging 30-second ad scripts
- **Video Generation**: Produces 1920×1080, 30fps MP4 videos
- **Text-to-Speech**: Adds professional voiceover using Google Translate TTS
- **Caption Burning**: Overlays synchronized captions on video
- **100% Browser-Based**: No backend required, runs entirely in your browser
- **Free**: Uses only free APIs and services

## Tech Stack

- **React + TypeScript**: Modern UI framework
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first styling
- **FFmpeg.wasm**: In-browser video encoding
- **Canvas API**: Frame generation and text rendering
- **Web Audio API**: Audio processing

## Quick Start

### Development

```bash
npm install
npm run dev
```

### Build

```bash
npm run build
```

### Deploy to Netlify

1. Push this repository to GitHub
2. Connect your GitHub repo to Netlify
3. Netlify will auto-detect the build settings from `netlify.toml`
4. Deploy with one click!

Or use Netlify CLI:

```bash
npm install -g netlify-cli
netlify deploy --prod
```

## How It Works

1. **Scraping**: Uses AllOrigins CORS proxy to fetch and parse webpage content
2. **Script Generation**: Creates a 30-second narrative from scraped data
3. **TTS**: Fetches audio from Google Translate TTS API
4. **Frame Generation**: Uses Canvas to create 900 frames (30 FPS × 30 seconds)
5. **Encoding**: FFmpeg.wasm combines frames and audio into MP4
6. **Download**: Video is packaged and ready for download

## Browser Requirements

- Modern browser with WebAssembly support
- Chrome 94+, Firefox 95+, Safari 15.2+, or Edge 94+
- Minimum 4GB RAM recommended
- Good internet connection for loading FFmpeg.wasm

## API Usage

### CORS Proxy
- **Service**: AllOrigins (https://api.allorigins.win)
- **Purpose**: Bypass CORS restrictions for URL scraping
- **Free**: No API key required

### Text-to-Speech
- **Service**: Google Translate TTS
- **Purpose**: Generate voiceover audio
- **Free**: No API key required
- **Note**: Limited to short text segments

## File Size

The generated MP4 video is optimized to stay under 50MB while maintaining:
- Resolution: 1920×1080
- Frame Rate: 30 FPS
- Duration: 30 seconds
- Video Codec: H.264
- Audio Codec: AAC 192kbps

## Limitations

- TTS quality depends on Google Translate TTS availability
- Image loading requires CORS-friendly sources
- Video generation may take 30-60 seconds depending on device
- Browser must support SharedArrayBuffer (requires secure context)

## License

MIT License - Feel free to use and modify!
