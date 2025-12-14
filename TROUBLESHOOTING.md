# Troubleshooting Guide

## Common Issues & Solutions

### 1. Video Generation Hangs at 40%

**Symptoms:**
- Progress bar stops at 40%
- Browser tab becomes unresponsive
- Video never completes

**Root Causes:**
- FFmpeg.wasm not loading correctly
- Memory overflow during frame generation
- Audio processing timeout
- Browser tab becomes inactive

**Solutions:**
1. **Clear browser cache:**
   - DevTools → Application → Clear Storage
   - Then refresh the page

2. **Reduce resolution:**
   - Currently set to 1280×720
   - System will auto-downscale if needed

3. **Close other tabs:**
   - Each tab consumes RAM
   - Free up at least 500MB RAM

4. **Use different browser:**
   - Try Chrome instead of Firefox
   - Update browser to latest version

5. **Check browser console:**
   - F12 → Console
   - Look for error messages
   - Screenshot errors for debugging

### 2. "Failed to Scrape URL"

**Symptoms:**
- Error message appears immediately
- No progress bar starts

**Causes:**
- Invalid URL format
- Website blocks scraping
- CORS proxy is down
- Network timeout

**Solutions:**
```
✓ Use complete URLs: https://example.com/page
✗ Don't use: example.com or http://

✓ Test websites first in browser
✗ Don't try private/paywalled content

✓ Try alternative CORS proxy if fails
✗ Don't assume scraper is broken
```

**Test URLs that work:**
- `https://www.wikipedia.org`
- `https://www.github.com`
- `https://news.ycombinator.com`

### 3. No Images in Video

**Symptoms:**
- Video only shows solid blue background
- No product images visible
- Console shows image load warnings

**Causes:**
- Images blocked by CORS
- Images hosted on CDN with restrictions
- Images too large to load
- Timeout during image loading

**Solutions:**
1. **Check browser console:**
   - Look for CORS errors
   - Check image URLs being attempted

2. **Website requirements:**
   - Use websites with public images
   - E-commerce sites usually work better
   - News sites work well too

3. **Test different websites:**
   - Try a different product page
   - Try multiple product URLs
   - Some sites have CORS restrictions

### 4. Audio Not Working (Silent Video)

**Symptoms:**
- Video plays with no sound
- Console shows TTS warnings

**Causes:**
- Google Translate TTS blocked/rate limited
- Network connectivity issue
- Audio codec not supported

**Solutions:**
1. **Check network:**
   - Ensure stable internet
   - Try again after 30 seconds

2. **Multiple TTS fallbacks:**
   - App tries 3 different TTS services
   - Waits for first that responds
   - Falls back to silence if all fail

3. **Volume check:**
   - Check browser volume
   - Unmute video player
   - Check system volume

### 5. "FFmpeg Load Failed"

**Symptoms:**
- Error during progress (0-15%)
- Can't proceed past FFmpeg loading

**Causes:**
- CDN unavailable
- Browser security restrictions
- Network firewall blocks CDN
- Insufficient RAM

**Solutions:**
1. **Wait and retry:**
   - CDN servers might be temporarily down
   - Wait 5 minutes and try again

2. **Check firewall:**
   - Network might block CDN
   - Try different network (mobile hotspot)
   - Contact network administrator

3. **Browser security:**
   - Some browsers have stricter policies
   - Try incognito/private mode
   - Update browser

4. **Check memory:**
   - Close unused applications
   - Restart browser
   - Restart computer if needed

### 6. Browser Crashes

**Symptoms:**
- Tab closes unexpectedly
- "Out of Memory" error
- Browser becomes unresponsive

**Causes:**
- Insufficient RAM
- Browser memory leak
- Processing too heavy for device

**Solutions:**
1. **Restart browser:**
   - Close and reopen
   - Clear cache and cookies

2. **Reduce workload:**
   - Close other tabs
   - Close other applications
   - Don't run other intensive tasks

3. **Use different device:**
   - Try on computer with more RAM
   - Try on newer browser version
   - Mobile browsers may not work

### 7. Video Plays But Quality is Poor

**Symptoms:**
- Video very pixelated
- Text hard to read
- Colors washed out

**This is normal.** Video is compressed for web delivery:
- Reduced resolution (1280×720 instead of 4K)
- JPEG compression for speed
- MP3 audio codec
- Optimized for streaming

**Trade-off:** Quality vs speed. Choose one:
- Fast generation (current)
- Higher quality (slower processing)

### 8. Video File Won't Play

**Symptoms:**
- Download completes but video won't play
- "Unsupported format" error
- Video player shows black screen

**Solutions:**
1. **Try different player:**
   - Use VLC (works with almost all formats)
   - Try online video player
   - Try browser built-in player

2. **Check file size:**
   - File should be 5-30 MB
   - If less than 1 MB, likely corrupted

3. **Re-generate video:**
   - Try same URL again
   - Or try different URL
   - Video might be damaged

### 9. Script Generation Fails

**Symptoms:**
- Hangs at "Script" stage
- Sudden error popup

**Causes:**
- URL has no title/description
- Script generation timeout
- Browser memory issue

**Solutions:**
1. **Use better URLs:**
   - Sites with clear titles
   - Sites with descriptions
   - Product pages work best

2. **Check page content:**
   - Verify page loads in browser
   - Ensure page has text/title
   - Try different page on same site

### 10. Performance Issues

**Times are slow:**
- FFmpeg load: 5-10 seconds (first time)
- URL scraping: 3-5 seconds
- Audio generation: 5-10 seconds
- Frame generation: 15-30 seconds
- Video encoding: 10-20 seconds
- **Total: 1-2 minutes is normal**

**Optimization tips:**
- Use computer with SSD
- Use wired internet (not WiFi)
- Close background applications
- Don't run antivirus scan during

## Browser Compatibility

| Browser | Supported | Notes |
|---------|-----------|-------|
| Chrome 94+ | ✓ | Best performance |
| Firefox 95+ | ✓ | Slightly slower |
| Safari 15.2+ | ✓ | Works well |
| Edge 94+ | ✓ | Same as Chrome |
| Opera 80+ | ✓ | Similar to Chrome |
| IE 11 | ✗ | Not supported |
| Mobile Chrome | ~ | May run out of memory |
| Mobile Safari | ~ | Works on iPad Air+ |

## Console Error Reference

### "SharedArrayBuffer is not defined"
- **Cause:** Headers not configured correctly
- **Solution:** Deployed on unsecured HTTP
- **Fix:** Use HTTPS only

### "Script error: timeout"
- **Cause:** TTS service timeout
- **Solution:** Network too slow
- **Fix:** Retry with better connection

### "Invalid image data"
- **Cause:** Image format unsupported
- **Solution:** Website using exotic format
- **Fix:** Try different website

### "Memory allocation failed"
- **Cause:** Not enough RAM
- **Solution:** Device has insufficient memory
- **Fix:** Close other apps or use different device

## Advanced Diagnostics

### Check Browser Console
```javascript
// Check available memory
console.log(performance.memory);

// Check FFmpeg status
console.log('FFmpeg loaded:', ffmpegInstance?.isLoaded());

// Monitor memory during generation
setInterval(() => {
  console.log('Memory:', Math.round(performance.memory.usedJSHeapSize / 1048576), 'MB');
}, 1000);
```

### Collect Debug Information
1. Open DevTools (F12)
2. Go to Console tab
3. Right-click → Save as HTML
4. Share when reporting issues

### Contact Support
When reporting issues, include:
- Browser name and version
- Operating system
- RAM available
- Error messages from console
- URL you're trying to generate
- Screenshots of errors

## Network Diagnostics

**Check if API endpoints are reachable:**
```
API Endpoints Status:
✓ AllOrigins CORS: https://api.allorigins.win
✓ FFmpeg CDN: https://cdn.jsdelivr.net
✓ Google TTS: https://translate.google.com
```

**If services are down:**
- Try again after a few minutes
- Use different URL/website
- Services might have temporary outages

## Memory Management

**RAM Requirements:**
- Minimum: 2 GB
- Recommended: 4 GB
- Ideal: 8+ GB

**Memory Usage by Phase:**
1. FFmpeg load: ~100 MB
2. URL scraping: ~50 MB
3. Audio generation: ~150 MB
4. Frame generation: ~500 MB (peaks)
5. Video encoding: ~300 MB

**Tips to reduce memory:**
- Close browser extensions
- Disable hardware acceleration
- Restart browser periodically
- Use browser in private mode

## Performance Benchmarks

### On Different Systems:

**High-end laptop (i7, 16GB RAM):**
- Total time: 45-60 seconds
- Video size: 15-20 MB
- Quality: Excellent

**Mid-range laptop (i5, 8GB RAM):**
- Total time: 60-90 seconds
- Video size: 10-15 MB
- Quality: Good

**Budget device (i3, 4GB RAM):**
- Total time: 120-180 seconds
- Video size: 8-12 MB
- Quality: Fair

**Mobile (iPad/tablet):**
- May fail or timeout
- Use computer instead
- Tablets with 6GB+ RAM might work

## When to Restart vs Retry

**Restart browser if:**
- Multiple failed attempts
- Tab becomes unresponsive
- Memory usage very high
- Getting out of memory errors

**Just retry if:**
- Single failed attempt
- Network timeout (try again)
- TTS service temporarily unavailable
- First time FFmpeg loading

## Getting Help

1. **Check this guide first**
2. **Check browser console (F12)**
3. **Try troubleshooting steps above**
4. **Restart browser and device**
5. **Try on different device/network**
6. **Report issue with debug info**

## Success Indicators

Video generation is working if you see:
- ✓ Progress bar smoothly advancing
- ✓ All 4 stages completing in order
- ✓ Video player appears after 100%
- ✓ Download button is enabled
- ✓ File is 5-50 MB

If all these happen, your ad is ready!
