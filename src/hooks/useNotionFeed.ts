import { useEffect, useState } from 'react';
import { CURATED_LINKEDIN_POSTS, CURATED_X_POSTS } from '../data/socialFeed';
import type { SocialFeedItem } from '../types/socialFeed';

interface NotionFeedState {
  posts: SocialFeedItem[];
  loading: boolean;
  isLive: boolean;
}

export function useNotionFeed(platform: 'linkedin' | 'x'): NotionFeedState {
  const fallback = platform === 'x' ? CURATED_X_POSTS : CURATED_LINKEDIN_POSTS;

  const [state, setState] = useState<NotionFeedState>({
    posts: fallback,
    loading: true,
    isLive: false,
  });

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/social-posts?platform=${platform}`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<{ posts: SocialFeedItem[]; error?: string; source?: string }>;
      })
      .then((data) => {
        if (cancelled) return;
        if (data.posts.length > 0) {
          setState({ posts: data.posts, loading: false, isLive: true });
        } else {
          setState({ posts: fallback, loading: false, isLive: false });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setState({ posts: fallback, loading: false, isLive: false });
        }
      });

    return () => {
      cancelled = true;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [platform]);

  return state;
}

export const useNotionLinkedInFeed = () => useNotionFeed('linkedin');
export const useNotionXFeed = () => useNotionFeed('x');
