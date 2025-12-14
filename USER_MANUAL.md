# User Manual: CTV Ad Generator

**Version:** 2.0
**Updated:** December 13, 2024

---

## Quick Start

### 1. Open the Application
Visit: `https://your-netlify-domain.netlify.app`

### 2. Enter a Product URL
```
Example: https://www.amazon.com/dp/B0XXXXXXXXX
```

### 3. Click "Generate 30-s CTV Ad"
Watch the progress bar advance through 4 stages

### 4. Preview & Download
When complete, preview the video and download as MP4

---

## Detailed Guide

### Step 1: Finding the Right URL

**Best URLs for Ad Generation:**
- E-commerce product pages (Amazon, eBay, Shopify)
- Company landing pages
- App store pages
- News articles with images
- Blog posts

**Good Example:**
```
https://www.example.com/product/amazing-gadget
```

**What to Avoid:**
- URLs behind login (not publicly accessible)
- Pure text pages with no images
- Pages with no title/description
- URLs that don't load in your browser

### Step 2: Entering the URL

1. Click the input field
2. Type or paste the complete URL
3. Include `https://` or `http://`
4. Press Tab or click outside to validate

**Valid Format:**
```
https://example.com/page
```

**Invalid Format:**
```
example.com          ← Missing protocol
ftp://example.com    ← Wrong protocol
```

### Step 3: Starting Generation

Click the blue "Generate 30-s CTV Ad" button

**What Happens:**

| Stage | Duration | What It Does |
|-------|----------|--------------|
| Scraping (0-25%) | 3-5s | Fetches and analyzes the webpage |
| Script (25-40%) | 1-2s | Creates the 30-second narrative |
| Video (40-85%) | 25-40s | Generates frames and audio |
| Pack (85-100%) | 5-10s | Encodes final MP4 video |

### Step 4: Monitoring Progress

**Visual Indicators:**
- ✓ Green circles: Completed stages
- ◐ Blue animated circle: Current stage
- ◯ Gray circles: Upcoming stages
- Percentage display: Overall progress

**What Each Number Means:**
- 0%: Just started
- 25%: Webpage scraped successfully
- 40%: Script created and audio generation starting
- 85%: Video encoding in progress
- 100%: Ready for download

### Step 5: Preview Video

Once generation completes:
1. Video appears in player
2. Use player controls:
   - **Play/Pause:** Space bar or button
   - **Seek:** Drag timeline
   - **Volume:** Adjust volume slider
   - **Fullscreen:** Click fullscreen icon

**What to Look For:**
- ✓ Text readable and centered
- ✓ Images visible in background
- ✓ Smooth transitions between scenes
- ✓ Audio plays (if sound is on)
- ✓ 30 seconds total duration

### Step 6: Download

Click "Download MP4" button

**File Details:**
- **Filename:** `ctv-ad.mp4`
- **Format:** MPEG-4 video
- **Size:** Usually 8-25 MB
- **Playable:** Most video players

**After Download:**
- File saves to Downloads folder
- Ready to share or edit
- Can upload to social media

---

## Understanding What the App Does

### Scraping Stage
The app visits your URL and extracts:
- **Title:** Main heading or page title
- **Description:** First text/meta description
- **Images:** Product photos and graphics
- **Color:** Brand color for theme

### Script Generation
Creates a professional 30-second script:
```
0-3s:   "Discover [Product Name]"
3-8s:   "[Product Description]"
8-12s:  "Transform your experience"
12-16s: "Join thousands of users"
16-20s: "Premium quality, unbeatable value"
20-24s: "Limited time offer available"
24-28s: "Visit [website]"
28-30s: "Act now and get started"
```

### Video Creation
Each segment of script:
1. Gets text-to-speech audio
2. Shows related product images
3. Displays caption text
4. Transitions smoothly to next segment

### Output File
Professional MP4 video:
- 1280×720 resolution (HD)
- 24 frames per second
- 30 seconds total
- Ready for CTV/streaming platforms

---

## Tips for Best Results

### URL Selection
**What Works:**
- ✓ URLs you can open in your browser
- ✓ Public product pages
- ✓ Pages with clear titles
- ✓ Pages with good images
- ✓ E-commerce websites

**Example URLs That Work:**
```
✓ https://www.example.com/products/item123
✓ https://shop.example.com/item
✓ https://example.com/our-service
✓ https://blog.example.com/article-title
```

### Generating Multiple Ads
**Try Different URLs:**
1. Product page (best focus)
2. Category page (broader)
3. Brand homepage (brand focused)
4. News/review page (informative)

**Compare Results:**
- See which style you prefer
- Use best version in campaigns
- Create variations for A/B testing

### Editing After Generation
After downloading, you can:
1. Open in video editor (Adobe Premiere, DaVinci, etc.)
2. Add music or effects
3. Adjust colors or text
4. Change duration
5. Add watermark or logo

---

## Video Quality Settings

### Resolution Options
**1280×720 (HD)**
- Standard quality
- 24 FPS
- ~12-18 MB file
- Best for web/streaming

### Quality Factors

| Factor | Impact | Notes |
|--------|--------|-------|
| Source images | High | Better images = better video |
| Text length | Medium | Shorter text more readable |
| Product colors | High | Brand color sets tone |
| Website design | Low | Doesn't affect much |

### File Size
- **Typical:** 10-20 MB
- **Small URL:** 8-12 MB
- **Large URL:** 15-25 MB
- **Maximum:** ~50 MB

---

## Common Tasks

### Task: Generate Ad for Online Store
1. Find product URL: `shop.example.com/product/xyz`
2. Click input field, paste URL
3. Click "Generate 30-s CTV Ad"
4. Wait 45-60 seconds
5. Download MP4 file
6. Upload to advertising platform

### Task: A/B Test Different Products
1. Generate ad for Product A
2. Download as "product-a.mp4"
3. Generate ad for Product B
4. Download as "product-b.mp4"
5. Test both in campaigns
6. Use better performer

### Task: Create Social Media Content
1. Generate ad from your webpage
2. Download MP4
3. Edit in social media editor
4. Add captions/hashtags
5. Post to TikTok, Instagram, YouTube

### Task: Create CTV Campaign
1. Generate ads for 5 products
2. Download all 5 videos
3. Upload to CTV platform
4. Schedule rotation
5. Monitor performance

---

## Browser & Device Guide

### Best Experience
- **Browser:** Chrome or Edge
- **Device:** Desktop/Laptop
- **RAM:** 8 GB or more
- **Connection:** Wired internet (not WiFi)

### Acceptable
- **Browser:** Firefox or Safari
- **Device:** MacBook or newer laptop
- **RAM:** 4 GB
- **Connection:** Good WiFi

### Might Have Issues
- **Browser:** Old versions
- **Device:** Very old computers
- **RAM:** 2 GB or less
- **Connection:** Slow/unstable

### Won't Work
- **Browser:** Internet Explorer
- **Device:** Very old (pre-2015)
- **RAM:** Less than 1 GB
- **Connection:** None/offline

---

## Troubleshooting

### "System is loading FFmpeg..."
**This is normal!**
- First time takes 5-10 seconds
- Subsequent loads use cached version
- Do not refresh or close tab
- Just wait patiently

### Video generation stops at 40%
1. Refresh page (Ctrl+R or Cmd+R)
2. Close other tabs
3. Try a different URL
4. Restart browser
5. Try on different computer if persistent

### Video plays but no sound
1. Check volume (unmute)
2. Check browser volume (speaker icon in taskbar)
3. Try different video player
4. Re-generate video

### Downloaded file won't play
1. Use VLC Media Player (plays anything)
2. Try different video player
3. Try different device
4. Re-download file

### "Failed to scrape URL" error
1. Check URL is correct
2. Try in browser to verify it loads
3. Wait 30 seconds and retry
4. Try different URL on same website
5. Website might block scraping

---

## Video Use Cases

### CTV Advertising
- Pre-roll ads
- Programmatic buying
- Streaming platforms
- Connected TV networks

### Social Media
- Instagram Reels
- TikTok videos
- YouTube Shorts
- Facebook video ads

### Website
- Hero video on homepage
- Product page demonstrations
- Email marketing videos
- Blog post thumbnails

### Internal Use
- Training videos
- Product presentations
- Team communications
- Investor pitches

---

## Best Practices

### URL Selection
1. ✓ Use complete, public URLs
2. ✓ Choose pages with good images
3. ✓ Pick clear titles/descriptions
4. ✓ Verify in browser first
5. ✗ Don't use private/paywalled content

### Timing
1. ✓ Generate during off-peak hours
2. ✓ Use when device isn't busy
3. ✓ Ensure stable connection
4. ✓ Don't run other heavy apps
5. ✗ Don't expect instant results

### Results
1. ✓ Preview before using
2. ✓ Download immediately after generation
3. ✓ Keep backup copies
4. ✓ Test on platforms before publishing
5. ✗ Don't expect professional quality

### Batch Processing
1. ✓ Generate 1-2 at a time
2. ✓ Download each before starting new
3. ✓ Restart browser between sessions
4. ✓ Take breaks to let system cool
5. ✗ Don't queue multiple generations

---

## Performance Tips

### Speed Up Generation
1. Close unnecessary browser tabs
2. Close other applications
3. Use wired internet if possible
4. Restart browser before starting
5. Use faster computer if available

### Improve Quality
1. Choose URLs with clear images
2. Pick sites with good titles
3. Use sites with brand colors
4. Select pages with descriptions
5. Verify images load in browser first

### Maximize Success
1. Verify URL works in browser
2. Check for stable internet
3. Ensure device has 4GB+ RAM free
4. Use modern browser (Chrome/Edge)
5. Try a different URL if it fails

---

## Limitations & Workarounds

| Issue | Why | Workaround |
|-------|-----|-----------|
| Takes 45-60s | Browser processing | Use fast computer, restart browser |
| File is 10-20MB | Video compression | Use recommended settings |
| Some images fail | CORS restrictions | Try different website |
| Audio sounds robotic | TTS quality | Use for mockups, upgrade later |
| Resolution 1280×720 | Performance | Good for web, adequate for CTV |

---

## Getting Help

### Self-Help
1. Check Troubleshooting section
2. Read FAQ in this manual
3. Review browser console (F12)
4. Try different URL
5. Restart browser and device

### When Seeking Support
Provide:
- Browser name and version
- Device type and OS
- URL you're trying
- Screenshot of error
- Steps you already tried

---

## FAQ

**Q: Can I use videos commercially?**
A: Yes, but verify you have rights to the content on the URL.

**Q: Can I edit the generated video?**
A: Yes, import into any video editor (Adobe, DaVinci, etc.).

**Q: How long can the video be?**
A: Fixed at 30 seconds for CTV format.

**Q: Can I change the script?**
A: Not in the app. Edit video in post-production editor.

**Q: What resolution is the video?**
A: 1280×720 (HD), optimized for web and CTV.

**Q: Can I add my logo?**
A: Not in app. Add during video editing after download.

**Q: Can I use this offline?**
A: No, requires internet for URL scraping and APIs.

**Q: Is my data private?**
A: Yes, all processing happens in your browser only.

**Q: What's the cost?**
A: Free! No registration, no limits.

**Q: Does it work on mobile?**
A: Limited - works on iPad, may struggle on phones.

---

## Version History

### v2.0 (Current) - December 2024
- ✓ Fixed 40% hanging issue
- ✓ Multi-fallback TTS system
- ✓ Optimized memory usage
- ✓ Improved image scraping
- ✓ Better error handling

### v1.0 - Initial Release
- ✓ Basic video generation
- ✓ Single TTS provider
- ✓ Frame generation

---

## Contact & Support

**For technical issues:**
1. Check Troubleshooting Guide
2. Review TECHNICAL_REPORT.md
3. Check browser console errors (F12)

**For feature requests:**
1. Describe use case clearly
2. Explain expected behavior
3. Provide example URLs

**Reporting bugs:**
1. Reproduce the issue
2. Record steps taken
3. Include browser info
4. Provide screenshots
5. Share error messages

---

## Conclusion

The CTV Ad Generator makes professional video ad creation accessible to everyone. With just a URL, you can generate 30-second advertisements ready for Connected TV platforms, social media, or your website.

**Key Points:**
- ✓ Simple 3-step process
- ✓ Works with any public URL
- ✓ Generates professional videos
- ✓ No technical skills required
- ✓ Completely free

**Get Started:**
1. Visit the application
2. Paste a product URL
3. Click generate
4. Download your ad!

**For more help:** See TROUBLESHOOTING.md and TECHNICAL_REPORT.md
