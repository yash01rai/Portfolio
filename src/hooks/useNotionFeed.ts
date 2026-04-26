import { useEffect, useState } from 'react';
import { CURATED_LINKEDIN_POSTS } from '../data/socialFeed';
import type { SocialFeedItem } from '../types/socialFeed';

interface NotionFeedState {
  posts: SocialFeedItem[];
  loading: boolean;
  isLive: boolean;
}

export function useNotionLinkedInFeed(): NotionFeedState {
  const [state, setState] = useState<NotionFeedState>({
    posts: CURATED_LINKEDIN_POSTS,
    loading: true,
    isLive: false,
  });

  useEffect(() => {
    let cancelled = false;

    fetch('/api/social-posts')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<{ posts: SocialFeedItem[]; error?: string; source?: string }>;
      })
      .then((data) => {
        if (cancelled) return;
        if (data.posts.length > 0) {
          setState({ posts: data.posts, loading: false, isLive: true });
        } else {
          setState({ posts: CURATED_LINKEDIN_POSTS, loading: false, isLive: false });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setState({ posts: CURATED_LINKEDIN_POSTS, loading: false, isLive: false });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
