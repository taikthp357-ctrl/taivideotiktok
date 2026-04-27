import type { Platform, ResolveProvider } from './provider-types';
import { DouyinProvider } from './douyin-provider';
import { TikTokProvider } from './tiktok-provider';
import { YouTubeProvider } from './youtube-provider';

export const providers: ResolveProvider[] = [new TikTokProvider(), new DouyinProvider(), new YouTubeProvider()];

export function getProvider(platform: Platform): ResolveProvider | null {
  return providers.find((provider) => provider.canHandle(platform)) ?? null;
}
