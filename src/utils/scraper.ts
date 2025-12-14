import { ScrapedData } from '../types';

export async function scrapeUrl(url: string): Promise<ScrapedData> {
  try {
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    let response: Response;
    try {
      response = await fetch(proxyUrl, { signal: controller.signal });
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to fetch URL`);
    }

    const data = await response.json();
    const htmlContent = data.contents;

    if (!htmlContent) {
      throw new Error('No HTML content received');
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');

    const title =
      doc.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
      doc.querySelector('meta[name="title"]')?.getAttribute('content') ||
      doc.querySelector('title')?.textContent ||
      'Product';

    const description =
      doc.querySelector('meta[property="og:description"]')?.getAttribute('content') ||
      doc.querySelector('meta[name="description"]')?.getAttribute('content') ||
      doc.querySelector('meta[name="og:description"]')?.getAttribute('content') ||
      'Discover amazing products';

    const images = extractImages(doc, url);
    const primaryColor = extractPrimaryColor(doc) || '#3b82f6';

    return {
      title: sanitizeText(title.substring(0, 100)),
      description: sanitizeText(description.substring(0, 200)),
      images: images.length > 0 ? images : [generatePlaceholderImage(title)],
      primaryColor,
      url,
    };
  } catch (error) {
    throw new Error(`Failed to scrape URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function extractImages(doc: Document, baseUrl: string): string[] {
  const images: Set<string> = new Set();

  const ogImage = doc.querySelector('meta[property="og:image"]')?.getAttribute('content');
  if (ogImage) {
    images.add(makeAbsoluteUrl(ogImage, baseUrl));
  }

  const twitterImage = doc.querySelector('meta[name="twitter:image"]')?.getAttribute('content');
  if (twitterImage) {
    images.add(makeAbsoluteUrl(twitterImage, baseUrl));
  }

  doc.querySelectorAll('img[src]:not([src^="data:"])').forEach((img) => {
    const src = img.getAttribute('src');
    const alt = img.getAttribute('alt') || '';
    const width = img.getAttribute('width');
    const height = img.getAttribute('height');

    if (src && src.length > 10) {
      const isProductImage =
        alt.toLowerCase().includes('product') ||
        alt.toLowerCase().includes('item') ||
        alt.length > 5 ||
        (width && parseInt(width) > 100) ||
        (height && parseInt(height) > 100);

      if (isProductImage || images.size < 3) {
        images.add(makeAbsoluteUrl(src, baseUrl));
      }
    }
  });

  doc.querySelectorAll('[style*="background-image"]').forEach((el) => {
    const style = el.getAttribute('style') || '';
    const match = style.match(/background-image:\s*url\(['"]?([^'")]+)['"]?\)/);
    if (match && match[1]) {
      images.add(makeAbsoluteUrl(match[1], baseUrl));
    }
  });

  doc.querySelectorAll('picture > img').forEach((img) => {
    const src = img.getAttribute('src');
    if (src && !src.startsWith('data:')) {
      images.add(makeAbsoluteUrl(src, baseUrl));
    }
  });

  return Array.from(images)
    .filter((url) => isValidImageUrl(url))
    .slice(0, 8);
}

function isValidImageUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname.toLowerCase();
    return /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(pathname) || url.includes('image') || url.includes('product');
  } catch {
    return false;
  }
}

function makeAbsoluteUrl(urlString: string, baseUrl: string): string {
  try {
    if (urlString.startsWith('http://') || urlString.startsWith('https://')) {
      return urlString;
    }
    const base = new URL(baseUrl);
    return new URL(urlString, base.origin).href;
  } catch {
    return urlString;
  }
}

function extractPrimaryColor(doc: Document): string | null {
  const themeColor = doc.querySelector('meta[name="theme-color"]')?.getAttribute('content');
  if (themeColor && isValidColor(themeColor)) {
    return themeColor;
  }
  return null;
}

function isValidColor(color: string): boolean {
  return /^#[0-9A-F]{6}$/i.test(color);
}

function generatePlaceholderImage(text: string = 'Product'): string {
  const cleanText = text.substring(0, 30).replace(/"/g, '');
  return 'data:image/svg+xml,' + encodeURIComponent(
    `<svg width="1280" height="720" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1e40af;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="1280" height="720" fill="url(#grad)"/>
      <text x="640" y="360" font-family="Arial, sans-serif" font-size="72" font-weight="bold" fill="white" text-anchor="middle" dy=".3em">
        ${cleanText}
      </text>
    </svg>`
  );
}

function sanitizeText(text: string): string {
  return text
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[<>]/g, '');
}
