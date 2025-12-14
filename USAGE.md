# Usage Guide

## Getting Started

### Step 1: Enter a URL
1. Type or paste any valid URL into the input field
2. Examples that work well:
   - Product pages (e.g., Amazon, Shopify stores)
   - Landing pages (e.g., SaaS products, apps)
   - Blog posts with good images
   - News articles
   - Company homepages

**Best Results**:
- Pages with Open Graph images
- Pages with clear titles and descriptions
- Pages with theme colors defined
- HTTPS URLs (more likely to have CORS-friendly images)

### Step 2: Click "Generate 30-s CTV Ad"
The app will start processing immediately. You'll see:
- Progress through 4 stages
- Percentage completion
- Current stage highlighted

**Processing Stages**:
1. **Scraping** (~5-10 seconds)
   - Fetches the webpage
   - Extracts title, description, images
   - Identifies brand colors

2. **Script** (~1 second)
   - Generates 30-second narrative
   - Creates timed segments
   - Prepares text for TTS

3. **Video** (~20-40 seconds)
   - Generates TTS audio
   - Creates 900 video frames
   - Encodes with FFmpeg

4. **Pack** (~2-5 seconds)
   - Finalizes MP4 file
   - Prepares for download

### Step 3: Preview the Video
Once complete, you'll see:
- Video player with your generated ad
- Download button below the player

**Preview Controls**:
- Play/pause
- Seek through timeline
- Volume control
- Fullscreen option

### Step 4: Download
Click the "Download MP4" button to save the video to your device.

**Default Filename**: `ctv-ad.mp4`

## Tips for Best Results

### Choosing URLs

**Good URLs**:
- E-commerce product pages
- SaaS landing pages
- Marketing websites
- Portfolio sites
- News articles with images

**Avoid**:
- Pages behind login walls
- Pages with no images
- Pure text pages
- Single-page apps with dynamic content
- Pages that block scrapers

### Understanding the Output

Your 30-second ad will include:
1. **Opening** (0-3s): Product/page title
2. **Description** (3-8s): Main description
3. **Benefits** (8-24s): Value propositions
4. **Call to Action** (24-30s): Domain name and CTA

**Visual Elements**:
- Background: Extracted brand color or blue
- Images: Rotating through scraped images
- Captions: White text on dark overlay
- Typography: Bold, clean, readable

## Troubleshooting

### "Failed to scrape URL"
**Causes**:
- Invalid URL format
- Website blocks CORS proxy
- Network issues

**Solutions**:
- Check URL is complete (includes https://)
- Try a different URL
- Check internet connection

### "Failed to fetch URL"
**Causes**:
- Website is down
- URL doesn't exist
- Firewall blocking

**Solutions**:
- Verify URL in browser first
- Try again after a moment
- Use a different page

### Video generation is slow
**This is normal!** Video generation takes time:
- 30-60 seconds on modern laptops
- 60-120 seconds on older devices
- First load takes longer (FFmpeg download)

**Be patient**:
- Don't close the tab
- Don't refresh the page
- The app is working hard!

### Video won't play
**Causes**:
- Browser doesn't support H.264
- Corrupted video file

**Solutions**:
- Try downloading and playing in VLC
- Use a different browser
- Try generating again

### Out of memory errors
**Causes**:
- Too many tabs open
- Limited device RAM
- Other heavy apps running

**Solutions**:
- Close other tabs
- Close other applications
- Try on a device with more RAM

## FAQ

### Q: How long does it take?
**A**: 30-60 seconds on average, depending on:
- Your device speed
- Internet connection
- Number of images on the page

### Q: Can I edit the script?
**A**: Not currently. The script is generated automatically based on the scraped content.

### Q: Can I use my own images?
**A**: Not directly. The app uses images from the URL you provide.

### Q: What if a page has no images?
**A**: The app will generate a placeholder image with the title text.

### Q: Is there a limit to how many ads I can create?
**A**: No! Generate as many as you want, completely free.

### Q: Can I use these ads commercially?
**A**: You're responsible for ensuring you have rights to the content. The app itself is free to use.

### Q: Why does the app need those special headers?
**A**: FFmpeg.wasm requires SharedArrayBuffer, which needs specific security headers for browser permission.

### Q: Can I run this offline?
**A**: No, it needs internet for:
- Fetching URLs
- Loading FFmpeg
- Downloading TTS audio

### Q: What happens to my data?
**A**: Everything processes in your browser. No data is sent to any server except:
- URL to AllOrigins proxy (for CORS)
- Text to Google TTS (for voice)

## Examples

### Example 1: Product Ad
**Input**: `https://www.apple.com/iphone-15`
**Result**: 30-second ad featuring iPhone images, specs, and CTA

### Example 2: SaaS Ad
**Input**: `https://www.notion.so`
**Result**: Ad showcasing Notion features with branded colors

### Example 3: Blog Post Ad
**Input**: A blog post URL with images
**Result**: Article summary with key images and excerpt

## Performance Tips

### For Faster Generation
1. **Use Fast URLs**: Simple pages process faster
2. **Close Other Tabs**: Free up memory
3. **Good Internet**: Faster image/TTS downloads
4. **Modern Device**: Newer computers encode faster

### For Better Quality
1. **Choose URLs with**:
   - High-quality images
   - Clear, concise titles
   - Good descriptions
   - Defined brand colors

2. **Avoid URLs with**:
   - Tiny images
   - Generic stock photos
   - No meta descriptions
   - Poor formatting

## Advanced Usage

### Testing Different URLs
Try the same brand's different pages to see which generates the best ad:
- Homepage
- Product page
- About page
- Landing page

### Video Editing
After downloading, you can:
- Trim in video editors
- Add music
- Adjust colors
- Add graphics
- Re-encode for different platforms

### Batch Creation
Want multiple ads?
1. Open multiple browser tabs
2. Generate different URLs simultaneously
3. Download all when complete

**Note**: Each tab uses significant RAM

## Best Practices

1. **URL Selection**: Choose pages with good visual content
2. **Patience**: Don't interrupt the process
3. **Preview**: Always preview before downloading
4. **Save**: Download immediately (browser may clear cache)
5. **Test**: Try different URLs to find best results

## Support

For issues or questions:
- Check browser console for errors
- Verify browser compatibility
- Ensure stable internet connection
- Try a different URL
- Restart browser if needed
