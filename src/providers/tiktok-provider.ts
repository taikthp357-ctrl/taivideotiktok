import type { ResolveInput, ResolveProvider, ResolveResult } from './provider-types';

function isResolveResult(value: unknown): value is ResolveResult {
  if (!value || typeof value !== 'object') return false;
  const data = value as Record<string, unknown>;
  return typeof data.status === 'string' && typeof data.platform === 'string';
}

export class TikTokProvider implements ResolveProvider {
  canHandle(platform: ResolveInput['platform']): boolean {
    return platform === 'tiktok';
  }

  async resolve(input: ResolveInput): Promise<ResolveResult> {
    if (import.meta.env.ENABLE_TIKTOK_DOWNLOAD !== 'true') {
      return {
        status: 'metadata_only',
        platform: 'tiktok',
        source_url: input.normalizedUrl,
        reason: 'TikTok download is disabled by default until a compliant provider is configured.'
      };
    }

    const baseUrl = import.meta.env.EXTERNAL_RESOLVER_BASE_URL;
    if (!baseUrl) {
      return {
        status: 'failed',
        platform: 'tiktok',
        reason: 'No external resolver configured for TikTok.'
      };
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
        body: JSON.stringify({ platform: 'tiktok', url: input.normalizedUrl, requestId: input.requestId }),
        signal: controller.signal
      });

      const json = await response.json();
      if (!isResolveResult(json)) {
        return { status: 'failed', platform: 'tiktok', reason: 'Provider returned an invalid payload.' };
      }

      return json;
    } catch {
      return { status: 'failed', platform: 'tiktok', reason: 'Failed to resolve TikTok URL safely.' };
    } finally {
      clearTimeout(timeout);
    }
  }
}
