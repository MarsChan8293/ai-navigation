import * as cheerio from 'cheerio';

export interface MetadataResult {
  title?: string;
  description?: string;
  thumbnail?: string;
}

export class MetadataService {
  private static readonly USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
  private static readonly MAX_REDIRECTS = 5;
  private static readonly TIMEOUT = 10000;

  static async getMetadata(url: string): Promise<MetadataResult> {
    if (!url || !url.startsWith('http')) {
      throw new Error('Invalid URL');
    }

    try {
      const html = await this.fetchPageHtml(url);
      return this.parseMetadata(html, url);
    } catch (error) {
      console.error('Metadata fetch error:', error);
      throw error;
    }
  }

  private static async fetchPageHtml(url: string, redirectCount = 0): Promise<string> {
    if (redirectCount >= this.MAX_REDIRECTS) {
      throw new Error('Too many redirects');
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT);

      const response = await fetch(url, {
        headers: {
          'User-Agent': this.USER_AGENT,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('text/html')) {
        throw new Error('Not an HTML page');
      }

      const text = await response.text();

      if (response.redirected) {
        return this.fetchPageHtml(response.url, redirectCount + 1);
      }

      return text;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  private static parseMetadata(html: string, baseUrl: string): MetadataResult {
    const $ = cheerio.load(html);
    const result: MetadataResult = {};

    const metaTag = (property: string): string | undefined => {
      return $(`meta[property="${property}"]`).attr('content') ||
             $(`meta[name="${property}"]`).attr('content') ||
             undefined;
    };

    const ogTitle = metaTag('og:title');
    const pageTitle = $('title').text().trim();
    result.title = ogTitle || pageTitle || this.extractDomainFromUrl(baseUrl);

    const ogDescription = metaTag('og:description');
    const metaDescription = metaTag('description');
    result.description = ogDescription || metaDescription;

    const ogImage = metaTag('og:image');
    if (ogImage) {
      result.thumbnail = this.resolveUrl(ogImage, baseUrl);
    }

    return result;
  }

  private static resolveUrl(url: string, baseUrl: string): string {
    try {
      if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
      }

      if (url.startsWith('//')) {
        return `https:${url}`;
      }

      if (url.startsWith('/')) {
        const base = new URL(baseUrl);
        return `${base.protocol}//${base.host}${url}`;
      }

      const base = new URL(baseUrl);
      const baseWithoutPath = `${base.protocol}//${base.host}`;
      return `${baseWithoutPath}/${url.replace(/^\//, '')}`;
    } catch {
      return url;
    }
  }

  private static extractDomainFromUrl(url: string): string {
    try {
      const hostname = new URL(url).hostname;
      return hostname.replace(/^www\./, '');
    } catch {
      return url;
    }
  }
}
