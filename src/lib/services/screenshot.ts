const MICROLINK_ENDPOINT = process.env.MICROLINK_ENDPOINT || 'https://api.microlink.io';
const MICROLINK_API_KEY = process.env.MICROLINK_API_KEY || '';

export interface MicrolinkResponse {
  status: string;
  data: {
    title?: string;
    description?: string;
    screenshot?: {
      url: string;
      width?: number;
      height?: number;
    };
  };
}

export class ScreenshotService {
  static async captureScreenshot(url: string): Promise<{
    thumbnail: string;
    title?: string;
    description?: string;
  }> {
    if (!url || !url.startsWith('http')) {
      throw new Error('Invalid URL');
    }

    try {
      const apiUrl = new URL(MICROLINK_ENDPOINT);
      apiUrl.searchParams.append('url', url);
      apiUrl.searchParams.append('screenshot', 'true');
      apiUrl.searchParams.append('meta', 'true');
      apiUrl.searchParams.append('viewport[width]', '1200');
      apiUrl.searchParams.append('viewport[height]', '800');

      const headers: Record<string, string> = {
        'Accept': 'application/json',
      };

      if (MICROLINK_API_KEY) {
        headers['x-api-key'] = MICROLINK_API_KEY;
      }

      const response = await fetch(apiUrl.toString(), {
        headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Microlink API error: ${response.status} ${errorText}`);
      }

      const data: MicrolinkResponse = await response.json();

      if (data.status !== 'success' || !data.data) {
        throw new Error('Failed to fetch screenshot from Microlink');
      }

      if (!data.data.screenshot?.url) {
        throw new Error('No screenshot URL in response');
      }

      return {
        thumbnail: data.data.screenshot.url,
        title: data.data.title,
        description: data.data.description,
      };
    } catch (error) {
      console.error('Screenshot capture error:', error);
      throw error;
    }
  }
}
