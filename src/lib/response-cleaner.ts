import type { DownloadItem, ResolveResult } from '../providers/provider-types';

function sanitizeItem(item: DownloadItem): DownloadItem {
  const cleaned: DownloadItem = {
    label: item.label,
    quality: item.quality,
    format: item.format,
    size: item.size ?? null,
    expires_in: item.expires_in ?? null
  };

  if (item.download_url && /^https:\/\//i.test(item.download_url)) {
    cleaned.download_url = item.download_url;
  }

  return cleaned;
}

export function cleanResolveResult(result: ResolveResult): ResolveResult {
  return {
    status: result.status,
    platform: result.platform,
    title: result.title,
    thumbnail: result.thumbnail,
    author: result.author,
    duration: result.duration ?? null,
    source_url: result.source_url,
    embed_url: result.embed_url,
    items: result.items?.map(sanitizeItem),
    reason: result.reason
  };
}
