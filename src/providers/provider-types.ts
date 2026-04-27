export type Platform = 'tiktok' | 'douyin' | 'youtube' | 'unknown';

export type ResolveStatus = 'ready' | 'metadata_only' | 'blocked' | 'failed';

export type DownloadItem = {
  label: string;
  quality: string;
  format: 'mp4' | 'webm' | 'mp3' | 'jpg' | 'png' | 'unknown';
  size?: number | null;
  download_url?: string;
  expires_in?: number | null;
};

export type ResolveInput = {
  url: string;
  normalizedUrl: string;
  platform: Platform;
  acceptTerms: boolean;
  requestId: string;
};

export type ResolveResult = {
  status: ResolveStatus;
  platform: Platform;
  title?: string;
  thumbnail?: string;
  author?: string;
  duration?: number | null;
  source_url?: string;
  embed_url?: string;
  items?: DownloadItem[];
  reason?: string;
};

export interface ResolveProvider {
  canHandle(platform: Platform): boolean;
  resolve(input: ResolveInput): Promise<ResolveResult>;
}
