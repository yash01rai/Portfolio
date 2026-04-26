import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ExternalLink, Heart, MessageCircle, Repeat2 } from 'lucide-react';

import {
  CURATED_X_POSTS,
  LINKEDIN_EMBED_POSTS,
  LINKEDIN_PROFILE_URL,
  X_PROFILE_URL,
  X_USERNAME,
} from '../data/socialFeed';
import { useNotionLinkedInFeed } from '../hooks/useNotionFeed';
import type { SocialFeedItem } from '../types/socialFeed';
import { SectionHeader } from './ui/SectionHeader';

const PLATFORMS = ['All', 'LinkedIn', 'X / Twitter'] as const;
type Platform = (typeof PLATFORMS)[number];

interface TwitterWidgets {
  widgets?: {
    load: (element?: HTMLElement | null) => void;
    createTimeline: (
      timeline: { sourceType: 'profile'; screenName: string },
      element: HTMLElement,
      options?: Record<string, string | number | boolean>,
    ) => Promise<HTMLElement>;
  };
}

declare global {
  interface Window {
    twttr?: TwitterWidgets;
  }
}

const X_WIDGET_SCRIPT_ID = 'x-widgets-script';
let xWidgetsPromise: Promise<TwitterWidgets> | null = null;

function loadXWidgets() {
  if (typeof document === 'undefined') {
    return Promise.reject(new Error('Document is unavailable'));
  }

  if (window.twttr?.widgets) {
    return Promise.resolve(window.twttr);
  }

  if (xWidgetsPromise) return xWidgetsPromise;

  xWidgetsPromise = new Promise((resolve, reject) => {
    const existingScript = document.getElementById(X_WIDGET_SCRIPT_ID) as HTMLScriptElement | null;
    const script = existingScript || document.createElement('script');

    script.id = X_WIDGET_SCRIPT_ID;
    script.src = 'https://platform.twitter.com/widgets.js';
    script.async = true;
    script.charset = 'utf-8';
    script.onload = () => {
      if (window.twttr?.widgets) {
        resolve(window.twttr);
      } else {
        reject(new Error('X widgets loaded without widget API'));
      }
    };
    script.onerror = () => reject(new Error('Unable to load X widgets'));

    if (!existingScript) {
      document.body.appendChild(script);
    }
  });

  return xWidgetsPromise;
}

function formatRelativeTime(publishedAt: string) {
  const publishedTime = new Date(publishedAt).getTime();
  const diffMs = Date.now() - publishedTime;

  if (Number.isNaN(publishedTime) || diffMs < 0) {
    return 'Recently';
  }

  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 60) return `${Math.max(minutes, 1)}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}w ago`;

  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(publishedAt));
}

function sortByRecent(items: SocialFeedItem[]) {
  return [...items].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

function platformMatches(item: SocialFeedItem, platform: Platform) {
  if (platform === 'All') return true;
  if (platform === 'LinkedIn') return item.platform === 'linkedin';
  return item.platform === 'x';
}

function getPostsForPlatform(platform: Platform, linkedInPosts: SocialFeedItem[]) {
  if (platform === 'LinkedIn') return linkedInPosts;
  if (platform === 'X / Twitter') return CURATED_X_POSTS;
  return [...linkedInPosts, ...CURATED_X_POSTS];
}

function getProfileLink(platform: Platform) {
  if (platform === 'LinkedIn') {
    return { href: LINKEDIN_PROFILE_URL, label: 'View all posts on LinkedIn' };
  }

  if (platform === 'X / Twitter') {
    return { href: X_PROFILE_URL, label: 'Open profile on X' };
  }

  return { href: X_PROFILE_URL, label: 'View latest on X' };
}

function PostCard({
  post,
  delay = 0,
  highlighted = false,
}: {
  post: SocialFeedItem;
  delay?: number;
  highlighted?: boolean;
}) {
  const metrics = [
    { label: 'likes', icon: Heart, value: post.metrics.likes },
    { label: 'comments', icon: MessageCircle, value: post.metrics.comments },
    { label: 'shares', icon: Repeat2, value: post.metrics.shares },
  ];

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative overflow-hidden rounded-2xl bg-surface p-5"
      style={{
        border: `1px solid ${highlighted ? 'rgba(78, 133, 191, 0.2)' : 'var(--stroke)'}`,
        boxShadow: highlighted ? '0 0 40px rgba(78, 133, 191, 0.04), 0 0 0 0.5px rgba(78, 133, 191, 0.13)' : 'none',
      }}
    >
      {highlighted && (
        <div
          className="absolute left-0 right-0 top-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(137, 170, 204, 0.4), transparent)' }}
        />
      )}

      <div className="mb-3.5 flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#89AACC] to-[#4E85BF] text-[11px] font-bold tracking-[0.05em] text-white">
          YR
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[13px] font-semibold text-text-primary">{post.authorName}</div>
          <div className="truncate text-[11px] text-muted">
            {post.handle} · {formatRelativeTime(post.publishedAt)}
          </div>
        </div>
        {highlighted ? (
          <span className="rounded-full border border-[#89AACC]/20 bg-[#89AACC]/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.1em] text-[#89AACC]">
            Highlighted
          </span>
        ) : (
          <span className="rounded-full border border-stroke px-2.5 py-1 text-[10px] uppercase tracking-[0.1em] text-muted">
            {post.platform === 'linkedin' ? 'LinkedIn' : 'X'}
          </span>
        )}
      </div>

      <p className="mb-4 whitespace-pre-line text-[13.5px] leading-[1.7] text-muted">{post.content}</p>

      <div className="mt-auto flex items-center gap-5 border-t border-stroke pt-3">
        {metrics.map(({ label, icon: Icon, value }) => (
          <span key={label} className="flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-text-primary">
            <Icon className="h-3.5 w-3.5 opacity-50" />
            {value.toLocaleString()}
          </span>
        ))}
        <a
          href={post.url}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-text-primary"
          aria-label={`Open ${post.platform === 'linkedin' ? 'LinkedIn' : 'X'} post`}
        >
          <ExternalLink className="h-3.5 w-3.5 opacity-50" />
          Open
        </a>
      </div>
    </motion.article>
  );
}

function XTimeline() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const container = timelineRef.current;

    if (!container) return;

    container.innerHTML = '';
    setIsBlocked(false);

    const visibilityTimeout = window.setTimeout(() => {
      if (cancelled) return;

      const frame = container.querySelector('iframe');
      const frameStyle = frame ? window.getComputedStyle(frame) : null;
      const isVisible =
        frame &&
        frameStyle?.visibility !== 'hidden' &&
        frameStyle?.display !== 'none' &&
        frame.getBoundingClientRect().height > 0;

      setIsBlocked(!isVisible);
    }, 5000);

    loadXWidgets()
      .then((twitter) =>
        twitter.widgets?.createTimeline(
          { sourceType: 'profile', screenName: X_USERNAME },
          container,
          {
            chrome: 'noheader nofooter transparent',
            height: 620,
            theme: 'dark',
          },
        ),
      )
      .then((timeline) => {
        if (!timeline || cancelled) {
          setIsBlocked(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setIsBlocked(true);
        }
      });

    return () => {
      cancelled = true;
      window.clearTimeout(visibilityTimeout);
    };
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isBlocked ? (
        <motion.div key="x-fallback" layout className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {sortByRecent(CURATED_X_POSTS).map((post, index) => (
            <motion.div
              key={post.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
            >
              <PostCard post={post} delay={index * 0.05} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          key="x-embed"
          id="x-timeline-container"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 18 }}
          transition={{ duration: 0.45 }}
          className="mx-auto max-w-[560px] overflow-hidden rounded-2xl border border-stroke bg-surface p-3"
        >
          <div ref={timelineRef} className="min-h-[420px]" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function LinkedInFeed({
  highlightedPosts,
  displayPosts,
}: {
  highlightedPosts: SocialFeedItem[];
  displayPosts: SocialFeedItem[];
}) {
  if (LINKEDIN_EMBED_POSTS.length > 0) {
    return (
      <motion.div key="linkedin-embeds" layout className="mx-auto grid max-w-[760px] grid-cols-1 gap-5">
        {LINKEDIN_EMBED_POSTS.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.45, delay: index * 0.05 }}
            className="overflow-hidden rounded-2xl border border-stroke bg-surface p-2"
          >
            <iframe
              src={post.src}
              title={post.title}
              className="min-h-[420px] w-full rounded-xl bg-white"
              allowFullScreen
            />
          </motion.div>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div key="linkedin-curated" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <AnimatePresence mode="wait">
        {highlightedPosts.length > 0 && (
          <motion.div
            key="highlighted"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-stroke to-transparent" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-muted">Pinned</span>
              <div className="h-px flex-1 bg-gradient-to-l from-stroke to-transparent" />
            </div>
            {highlightedPosts.map((post) => (
              <PostCard key={post.id} post={post} highlighted />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div layout className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <AnimatePresence>
          {displayPosts.map((post, index) => (
            <motion.div
              key={`linkedin-${post.id}`}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
            >
              <PostCard post={post} delay={index * 0.05} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export default function SocialFeed() {
  const [platform, setPlatform] = useState<Platform>('All');
  const { posts: linkedInPosts, isLive } = useNotionLinkedInFeed();

  const highlightedPosts = useMemo(() => linkedInPosts.filter((post) => post.pinned), [linkedInPosts]);
  const displayPosts = useMemo(() => {
    const posts = getPostsForPlatform(platform, linkedInPosts).filter((post) => platformMatches(post, platform));
    const visiblePosts = platform === 'All' ? posts.filter((post) => !post.pinned) : posts;
    return sortByRecent(visiblePosts);
  }, [platform, linkedInPosts]);

  const showHighlighted = platform === 'All' && highlightedPosts.length > 0;
  const profileLink = getProfileLink(platform);
  const statusLabel =
    platform === 'X / Twitter' || LINKEDIN_EMBED_POSTS.length > 0
      ? 'Embedded'
      : isLive
        ? 'Live'
        : 'Curated';

  return (
    <section id="social" className="relative overflow-hidden border-t border-white/5 bg-bg py-24">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/5 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-[900px] px-6">
        <SectionHeader
          eyebrow="Journal"
          heading="Recent"
          italic="thoughts"
          sub="Thoughts on frontend architecture, AI-augmented development, and engineering craft."
        />

        <div className="mb-10 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {PLATFORMS.map((tab) => (
            <button
              key={tab}
              onClick={() => setPlatform(tab)}
              className={`cursor-pointer whitespace-nowrap rounded-full border px-4 py-2 text-xs tracking-[0.05em] transition-all duration-300 ${
                platform === tab
                  ? 'border-white/20 bg-surface text-text-primary shadow-sm'
                  : 'border-stroke bg-transparent text-muted hover:border-white/10 hover:text-text-primary'
              }`}
            >
              {tab}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-1.5 pl-4">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
            <span className="hidden text-[11px] uppercase tracking-[0.1em] text-muted sm:block">{statusLabel}</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {platform === 'X / Twitter' ? (
            <XTimeline key="x-timeline" />
          ) : platform === 'LinkedIn' ? (
            <LinkedInFeed key="linkedin-feed" highlightedPosts={[]} displayPosts={displayPosts} />
          ) : (
            <motion.div key={platform} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <AnimatePresence mode="wait">
                {showHighlighted && (
                  <motion.div
                    key="highlighted"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-8"
                  >
                    <div className="mb-4 flex items-center gap-3">
                      <div className="h-px flex-1 bg-gradient-to-r from-stroke to-transparent" />
                      <span className="text-[10px] uppercase tracking-[0.3em] text-muted">Pinned</span>
                      <div className="h-px flex-1 bg-gradient-to-l from-stroke to-transparent" />
                    </div>
                    {highlightedPosts.map((post) => (
                      <PostCard key={post.id} post={post} highlighted />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div layout className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <AnimatePresence>
                  {displayPosts.map((post, index) => (
                    <motion.div
                      key={`${platform}-${post.id}`}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4 }}
                    >
                      <PostCard post={post} delay={index * 0.05} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-10 flex justify-center">
          <a
            href={profileLink.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center justify-center rounded-full text-[13px] transition-transform duration-200 hover:scale-[1.03]"
          >
            <span className="absolute inset-[-2px] rounded-full bg-gradient-to-r from-[#89AACC] to-[#4E85BF] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <span className="relative flex items-center gap-2 rounded-full border border-stroke bg-surface px-6 py-2.5 text-text-primary backdrop-blur-md transition-colors duration-300 group-hover:border-transparent group-hover:bg-bg">
              {profileLink.label}
              <ExternalLink className="h-3.5 w-3.5 opacity-50 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
