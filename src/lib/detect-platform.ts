import type { Platform } from '../providers/provider-types';

export function detectPlatform(normalizedUrl: string): Platform {
  try {
    const host = new URL(normalizedUrl).hostname.toLowerCase();

    if (host === 'tiktok.com' || host.endsWith('.tiktok.com') || host === 'vm.tiktok.com' || host === 'vt.tiktok.com') {
      return 'tiktok';
    }

    if (host === 'douyin.com' || host.endsWith('.douyin.com') || host === 'v.douyin.com') {
      return 'douyin';
    }

    if (host === 'youtube.com' || host.endsWith('.youtube.com') || host === 'youtu.be') {
      return 'youtube';
    }

    return 'unknown';
  } catch {
    return 'unknown';
  }
}
