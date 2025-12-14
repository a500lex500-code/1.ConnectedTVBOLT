import { ScrapedData } from '../types';

export async function scrapeUrl(url: string): Promise<ScrapedData> {
  try {
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl);

    if (!response.ok) {
      throw new Error('Failed to fetch URL');
    }

    const data = await response.json();
    const htmlContent = data.contents;

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');

    const title =
      doc.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
      doc.querySelector('title')?.textContent ||
      'Untitled';

    const description =
      doc.querySelector('meta[property="og:description"]')?.getAttribute('content') ||
      doc.querySelector('meta[name="description"]')?.getAttribute('content') ||
      'No description available';

    const images: string[] = [];
    const ogImage = doc.querySelector('meta[property="og:image"]')?.getAttribute('content');
    if (ogImage) {
      images.push(makeAbsoluteUrl(ogImage, url));
    }

    doc.querySelectorAll('img').forEach((img) => {
      const src = img.getAttribute('src');
      if (src && !src.startsWith('data:')) {
        images.push(makeAbsoluteUrl(src, url));
      }
    });

    const uniqueImages = Array.from(new Set(images)).slice(0, 5);

    const primaryColor = extractPrimaryColor(doc) || '#3b82f6';

    return {
      title: title.substring(0, 100),
      description: description.substring(0, 200),
      images: uniqueImages.length > 0 ? uniqueImages : [generatePlaceholderImage()],
      primaryColor,
      url,
    };
  } catch (error) {
    throw new Error(`Failed to scrape URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
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

function generatePlaceholderImage(): string {
  return 'data:image/svg+xml,' + encodeURIComponent(
    `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <rect width="1200" height="630" fill="#3b82f6"/>
      <text x="50%" y="50%" font-family="Arial" font-size="48" fill="white" text-anchor="middle" dy=".3em">
        No Image Available
      </text>
    </svg>`
  );
}
