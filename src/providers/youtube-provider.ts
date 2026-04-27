import type { ResolveInput, ResolveProvider, ResolveResult } from './provider-types';

function getYouTubeId(urlString: string): string | null {
  try {
    const url = new URL(urlString);
    if (url.hostname === 'youtu.be') {
      return url.pathname.replace('/', '') || null;
    }

    if (url.pathname === '/watch') {
      return url.searchParams.get('v');
    }

    const shortPath = url.pathname.match(/^\/shorts\/([^/]+)/);
    return shortPath?.[1] ?? null;
  } catch {
    return null;
  }
}

function isResolveResult(value: unknown): value is ResolveResult {
  if (!value || typeof value !== 'object') return false;
  const data = value as Record<string, unknown>;
  return typeof data.status === 'string' && typeof data.platform === 'string';
}

export class YouTubeProvider implements ResolveProvider {
  canHandle(platform: ResolveInput['platform']): boolean {
    return platform === 'youtube';
  }

  async resolve(input: ResolveInput): Promise<ResolveResult> {
    const id = getYouTubeId(input.normalizedUrl);

    if (import.meta.env.ENABLE_YOUTUBE_DOWNLOAD !== 'true') {
      return {
        status: 'metadata_only',
        platform: 'youtube',
        source_url: input.normalizedUrl,
        thumbnail: id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : undefined,
        embed_url: id ? `https://www.youtube.com/embed/${id}` : undefined,
        reason: 'YouTube download is disabled by default. Metadata and embed are available.'
      };
    }

    const baseUrl = import.meta.env.EXTERNAL_RESOLVER_BASE_URL;
    if (!baseUrl) {
      return { status: 'metadata_only', platform: 'youtube', reason: 'No compliant external resolver is configured.' };
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);

    try {
      const response = await fetch(`${baseUrl}/resolve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.EXTERNAL_RESOLVER_API_KEY ?? ''}`
        },
        body: JSON.stringify({ platform: 'youtube', url: input.normalizedUrl, requestId: input.requestId }),
        signal: controller.signal
      });

      const json = await response.json();
      if (!isResolveResult(json)) {
        return { status: 'failed', platform: 'youtube', reason: 'Provider returned an invalid payload.' };
      }

      return json;
    } catch {
      return { status: 'failed', platform: 'youtube', reason: 'Failed to resolve YouTube URL safely.' };
    } finally {
      clearTimeout(timeout);
    }
  }
}
