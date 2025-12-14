# Deployment Guide

This app is ready to deploy to Netlify with zero configuration required!

## Option 1: Deploy via Netlify Dashboard (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com) and sign in
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub and select your repository
   - Netlify will auto-detect settings from `netlify.toml`
   - Click "Deploy site"

3. **Done!**
   - Your site will be live at `your-site-name.netlify.app`
   - Automatic deployments on every git push

## Option 2: Deploy via Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Deploy**
   ```bash
   npm run build
   netlify deploy --prod
   ```

4. **Follow prompts**
   - Create a new site or link to existing
   - Set publish directory to `dist`
   - Confirm deployment

## Option 3: Drag & Drop Deploy

1. **Build locally**
   ```bash
   npm run build
   ```

2. **Visit Netlify**
   - Go to [app.netlify.com/drop](https://app.netlify.com/drop)
   - Drag and drop the `dist` folder
   - Your site is live instantly!

   **Note**: For drag & drop, you'll need to manually configure headers in Netlify UI:
   - Go to Site settings → Build & deploy → Headers
   - Add these headers for `/*`:
     - `Cross-Origin-Opener-Policy: same-origin`
     - `Cross-Origin-Embedder-Policy: require-corp`

## Important: Required Headers

The app requires these headers to work (already configured in `netlify.toml`):
- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Embedder-Policy: require-corp`

These headers are necessary for FFmpeg.wasm to use SharedArrayBuffer.

## Build Settings

The `netlify.toml` file configures:
- Build command: `npm run build`
- Publish directory: `dist`
- Required security headers for SharedArrayBuffer

## Custom Domain (Optional)

After deployment, you can add a custom domain:
1. Go to Site settings → Domain management
2. Click "Add custom domain"
3. Follow the DNS configuration instructions

## Environment Variables

No environment variables are required! The app uses:
- AllOrigins CORS proxy (free, no API key)
- Google Translate TTS (free, no API key)
- FFmpeg.wasm (loaded from CDN)

## Troubleshooting

### Video generation fails
- Check browser console for errors
- Ensure you're using a modern browser (Chrome 94+, Firefox 95+)
- Check that headers are properly configured

### SharedArrayBuffer errors
- Verify the security headers are set correctly
- Site must be served over HTTPS (Netlify does this automatically)

### Build fails
- Run `npm install` to ensure all dependencies are installed
- Run `npm run build` locally to test
- Check Node.js version (16+ recommended)

## Performance

- Initial load: ~3-5 seconds (FFmpeg.wasm download)
- Video generation: ~30-60 seconds depending on device
- Final video size: ~10-30 MB

## Browser Support

- Chrome 94+
- Firefox 95+
- Safari 15.2+
- Edge 94+

## Cost

Completely free! Netlify's free tier includes:
- 100GB bandwidth/month
- Automatic HTTPS
- Continuous deployment
- No credit card required
