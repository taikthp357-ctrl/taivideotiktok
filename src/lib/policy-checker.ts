import type { Platform, ResolveResult } from '../providers/provider-types';

export function checkPolicy(input: { platform: Platform; acceptTerms: boolean }): ResolveResult | null {
  const { platform, acceptTerms } = input;

  if (acceptTerms !== true) {
    return { status: 'blocked', platform, reason: 'You must confirm content usage rights before continuing.' };
  }

  if (platform === 'unknown') {
    return { status: 'blocked', platform, reason: 'Unsupported URL. Please provide TikTok, Douyin, or YouTube links.' };
  }

  if (platform === 'youtube' && import.meta.env.ENABLE_YOUTUBE_DOWNLOAD !== 'true') {
    return {
      status: 'metadata_only',
      platform,
      reason: 'YouTube download is disabled by default. Metadata and embed are available.'
    };
  }

  if (platform === 'tiktok' && import.meta.env.ENABLE_TIKTOK_DOWNLOAD !== 'true') {
    return {
      status: 'metadata_only',
      platform,
      reason: 'TikTok direct download is currently disabled until a compliant provider is enabled.'
    };
  }

  if (platform === 'douyin' && import.meta.env.ENABLE_DOUYIN_DOWNLOAD !== 'true') {
    return {
      status: 'metadata_only',
      platform,
      reason: 'Douyin direct download is currently disabled until a compliant provider is enabled.'
    };
  }

  return null;
}
