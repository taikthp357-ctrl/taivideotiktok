const TRACKING_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'fbclid', 'gclid'];

const ALLOWED_HOSTS = ['tiktok.com', 'vm.tiktok.com', 'vt.tiktok.com', 'douyin.com', 'v.douyin.com', 'youtube.com', 'youtu.be'];

function hasSupportedHost(value: string) {
  return ALLOWED_HOSTS.some((host) => value === host || value.endsWith(`.${host}`));
}

export function normalizeUrl(input: string): { ok: boolean; normalizedUrl?: string; error?: string } {
  const trimmed = input.trim();
  if (!trimmed) return { ok: false, error: 'URL is required.' };

  let candidate = trimmed;
  if (!/^https?:\/\//i.test(candidate)) {
    const maybeHost = candidate.split('/')[0].toLowerCase();
    if (hasSupportedHost(maybeHost)) {
      candidate = `https://${candidate}`;
    }
  }

  try {
    const url = new URL(candidate);
    if (!['http:', 'https:'].includes(url.protocol)) {
      return { ok: false, error: 'Only HTTP(S) URLs are supported.' };
    }

    TRACKING_PARAMS.forEach((param) => url.searchParams.delete(param));
    url.hash = '';

    return { ok: true, normalizedUrl: url.toString() };
  } catch {
    return { ok: false, error: 'Invalid URL format.' };
  }
}
