export type SocialPlatform = 'linkedin' | 'x';

export interface SocialMetrics {
  likes: number;
  comments: number;
  shares: number;
}

export interface SocialFeedItem {
  id: string;
  platform: SocialPlatform;
  authorName: string;
  handle: string;
  url: string;
  publishedAt: string;
  content: string;
  metrics: SocialMetrics;
  source: 'api' | 'curated' | 'fallback';
  pinned?: boolean;
}
