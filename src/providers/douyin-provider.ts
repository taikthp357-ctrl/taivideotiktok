import type { ResolveInput, ResolveProvider, ResolveResult } from './provider-types';

function isResolveResult(value: unknown): value is ResolveResult {
  if (!value || typeof value !== 'object') return false;
  const data = value as Record<string, unknown>;
  return typeof data.status === 'string' && typeof data.platform === 'string';
}

export class DouyinProvider implements ResolveProvider {
  canHandle(platform: ResolveInput['platform']): boolean {
    return platform === 'douyin';
  }

  async resolve(input: ResolveInput): Promise<ResolveResult> {
    if (import.meta.env.ENABLE_DOUYIN_DOWNLOAD !== 'true') {
      return {
        status: 'metadata_only',
        platform: 'douyin',
        source_url: input.normalizedUrl,
        reason: 'Douyin download is disabled by default. Douyin behavior may change and availability depends on compliant providers.'
      };
    }

    const baseUrl = import.meta.env.EXTERNAL_RESOLVER_BASE_URL;
    if (!baseUrl) {
      return {
        status: 'failed',
        platform: 'douyin',
        reason: 'No external resolver configured for Douyin.'
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
        body: JSON.stringify({ platform: 'douyin', url: input.normalizedUrl, requestId: input.requestId }),
        signal: controller.signal
      });

      const json = await response.json();
      if (!isResolveResult(json)) {
        return { status: 'failed', platform: 'douyin', reason: 'Provider returned an invalid payload.' };
      }

      return json;
    } catch {
      return { status: 'failed', platform: 'douyin', reason: 'Failed to resolve Douyin URL safely.' };
    } finally {
      clearTimeout(timeout);
    }
  }
}
