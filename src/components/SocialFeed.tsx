import { useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ExternalLink, Globe2, Heart, MessageCircle, MessageSquare, Repeat2, Send, ThumbsUp } from 'lucide-react';
import { Tweet } from 'react-tweet';

import {
  CURATED_X_POSTS,
  LINKEDIN_EMBED_POSTS,
  LINKEDIN_PROFILE_URL,
  X_PROFILE_URL,
} from '../data/socialFeed';
import { useNotionLinkedInFeed, useNotionXFeed } from '../hooks/useNotionFeed';
import type { SocialFeedItem } from '../types/socialFeed';
import { SectionHeader } from './ui/SectionHeader';
import { FloatingSocialIcons } from './social/FloatingSocialIcons';

const PLATFORMS = ['All', 'LinkedIn', 'X / Twitter'] as const;
type Platform = (typeof PLATFORMS)[number];

function extractTweetId(url: string): string | null {
  const m = url.match(/(?:x\.com|twitter\.com)\/[^/]+\/status\/(\d+)/);
  return m ? m[1] : null;
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

function formatCount(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
  return String(n);
}

function sortByRecent(items: SocialFeedItem[]) {
  return [...items].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

function platformMatches(item: SocialFeedItem, platform: Platform) {
  if (platform === 'All') return true;
  if (platform === 'LinkedIn') return item.platform === 'linkedin';
  return item.platform === 'x';
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

function LinkedInAvatar({ className }: { className?: string }) {
  const [imgFailed, setImgFailed] = useState(false);

  if (!imgFailed) {
    return (
      <img
        src="/avatar.jpg"
        alt="Yash Rai"
        className={className}
        onError={() => setImgFailed(true)}
      />
    );
  }

  return (
    <div className={`flex items-center justify-center bg-gradient-to-br from-[#89AACC] to-[#4E85BF] text-[11px] font-bold tracking-[0.05em] text-white ${className ?? ''}`}>
      YR
    </div>
  );
}

const LI_ACTIONS = [
  { label: 'Like', icon: ThumbsUp },
  { label: 'Comment', icon: MessageSquare },
  { label: 'Repost', icon: Repeat2 },
  { label: 'Send', icon: Send },
] as const;

function LinkedInPostCard({
  post,
  delay = 0,
  highlighted = false,
}: {
  post: SocialFeedItem;
  delay?: number;
  highlighted?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const { likes, comments, shares } = post.metrics;

  const TRUNCATE_AT = 320;
  const truncatable = post.content.length > TRUNCATE_AT;
  const displayContent =
    expanded || !truncatable ? post.content : post.content.slice(0, TRUNCATE_AT).trimEnd();

  const reactionParts: string[] = [];
  if (comments > 0) reactionParts.push(`${formatCount(comments)} comment${comments === 1 ? '' : 's'}`);
  if (shares > 0) reactionParts.push(`${formatCount(shares)} repost${shares === 1 ? '' : 's'}`);

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className="group relative cursor-pointer overflow-hidden rounded-xl transition-shadow duration-300"
      style={{
        background: '#1D2226',
        border: highlighted ? '1px solid rgba(10,102,194,0.35)' : '1px solid rgba(255,255,255,0.1)',
        boxShadow: highlighted
          ? '0 0 0 1px rgba(10,102,194,0.15), 0 4px 24px rgba(0,0,0,0.4)'
          : '0 2px 12px rgba(0,0,0,0.3)',
      }}
      onClick={() => window.open(post.url, '_blank', 'noopener,noreferrer')}
    >
      {/* LinkedIn blue top stripe */}
      <div
        className="absolute left-0 right-0 top-0 h-[2px]"
        style={{ background: highlighted ? 'linear-gradient(90deg, #0A66C2, #70B5F9, #0A66C2)' : '#0A66C2' }}
      />

      {/* LinkedIn logo badge — absolute top-right */}
      <div className="absolute right-4 top-4">
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-label="LinkedIn">
          <rect width="24" height="24" rx="4" fill="#0A66C2" />
          <path
            fill="white"
            d="M6.94 5a2 2 0 1 1-4-.002 2 2 0 0 1 4 .002zM7 8.48H3V21h4V8.48zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91l.04-1.68z"
          />
        </svg>
      </div>

      {/* Header */}
      <div className="flex items-start gap-3 px-4 pb-3 pt-5">
        <div className="relative shrink-0">
          <LinkedInAvatar className="h-12 w-12 rounded-full ring-2 ring-[#0A66C2]/50" />
        </div>

        <div className="min-w-0 flex-1 pr-8">
          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
            <span className="text-[15px] font-semibold leading-tight text-white">
              {post.authorName}
            </span>
            <span className="text-[13px] font-normal text-[#70B5F9]">· 1st</span>
            {highlighted && (
              <span className="rounded-full border border-[#70B5F9]/30 bg-[#0A66C2]/15 px-2 py-0.5 text-[10px] uppercase tracking-[0.1em] text-[#70B5F9]">
                Pinned
              </span>
            )}
          </div>
          <div className="mt-0.5 line-clamp-1 text-[12px] leading-snug text-white/50">{post.handle}</div>
          <div className="mt-1.5 flex items-center gap-2">
            <div className="flex items-center gap-1 text-[11px] text-white/40">
              <span>{formatRelativeTime(post.publishedAt)}</span>
              <span aria-hidden>·</span>
              <Globe2 className="h-3 w-3" />
            </div>
            <a
              href={LINKEDIN_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="rounded-full border border-[#70B5F9]/50 px-2.5 py-0.5 text-[11px] font-semibold text-[#70B5F9] transition-colors hover:bg-[#70B5F9]/10"
            >
              + Follow
            </a>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-4">
        <p className="whitespace-pre-line text-[14px] leading-[1.65] text-white/90">
          {displayContent}
          {truncatable && !expanded && '…'}
        </p>
        {truncatable && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setExpanded((v) => !v); }}
            className="mt-1 text-[13px] font-semibold text-[#70B5F9] transition-opacity hover:underline"
          >
            {expanded ? 'see less' : 'see more'}
          </button>
        )}
      </div>

      {/* Reaction summary */}
      {(likes > 0 || reactionParts.length > 0) && (
        <div className="flex items-center justify-between px-4 py-2">
          {likes > 0 && (
            <div className="flex items-center gap-1.5">
              <div className="flex -space-x-1">
                {['👍', '❤️', '🎉'].map((emoji) => (
                  <span
                    key={emoji}
                    className="flex h-[20px] w-[20px] items-center justify-center rounded-full text-[11px]"
                    style={{ background: '#1D2226', boxShadow: '0 0 0 1.5px rgba(255,255,255,0.12)' }}
                  >
                    {emoji}
                  </span>
                ))}
              </div>
              <span className="text-[13px] text-white/50 hover:text-white/80 hover:underline">{formatCount(likes)}</span>
            </div>
          )}
          {reactionParts.length > 0 && (
            <span className="ml-auto text-[12px] text-white/40">{reactionParts.join(' · ')}</span>
          )}
        </div>
      )}

      {/* Divider */}
      <div className="mx-4 border-t border-white/10" />

      {/* Action bar */}
      <div className="flex pb-1">
        {LI_ACTIONS.map(({ label, icon: Icon }) => (
          <a
            key={label}
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            aria-label={`${label} on LinkedIn`}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg py-3 text-[13px] font-semibold text-white/50 transition-colors hover:bg-white/5 hover:text-white"
          >
            <Icon className="h-[18px] w-[18px]" />
            <span className="hidden sm:inline">{label}</span>
          </a>
        ))}
      </div>
    </motion.article>
  );
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
  if (post.platform === 'linkedin') {
    return <LinkedInPostCard post={post} delay={delay} highlighted={highlighted} />;
  }

  const { likes, comments, shares } = post.metrics;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative cursor-pointer overflow-hidden rounded-2xl bg-surface p-5 transition-opacity hover:opacity-80"
      style={{
        border: `1px solid ${highlighted ? 'rgba(78, 133, 191, 0.2)' : 'var(--stroke)'}`,
        boxShadow: highlighted ? '0 0 40px rgba(78, 133, 191, 0.04), 0 0 0 0.5px rgba(78, 133, 191, 0.13)' : 'none',
      }}
      onClick={() => window.open(post.url, '_blank', 'noopener,noreferrer')}
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
        <span className="shrink-0 rounded-full border border-stroke px-2.5 py-1 text-[10px] uppercase tracking-[0.1em] text-muted">
          X
        </span>
      </div>

      <p className="mb-4 line-clamp-6 whitespace-pre-line text-[13.5px] leading-[1.7] text-muted">
        {post.content}
      </p>

      <div className="mt-auto flex items-center gap-5 border-t border-stroke pt-3">
        {[
          { label: 'likes', icon: Heart, value: likes },
          { label: 'comments', icon: MessageCircle, value: comments },
          { label: 'shares', icon: Repeat2, value: shares },
        ].map(({ label, icon: Icon, value }) => (
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
          aria-label="Open X post"
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink className="h-3.5 w-3.5 opacity-50" />
          Open
        </a>
      </div>
    </motion.article>
  );
}

function XFeed({ posts }: { posts: SocialFeedItem[] }) {
  if (posts.length === 0) {
    return (
      <div className="columns-1 gap-4 md:columns-2 [column-fill:_balance]">
        {sortByRecent(CURATED_X_POSTS).map((post, index) => (
          <div key={post.id} className="mb-4 break-inside-avoid">
            <PostCard post={post} delay={index * 0.05} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="columns-1 gap-4 md:columns-2 [column-fill:_balance] [&_.react-tweet-theme]:!my-0">
      {sortByRecent(posts).map((post) => {
        const tweetId = post.url ? extractTweetId(post.url) : null;
        return (
          <motion.div
            key={post.id}
            className="mb-4 break-inside-avoid"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            {tweetId ? (
              <div data-theme="dark">
                <Tweet id={tweetId} />
              </div>
            ) : <PostCard post={post} />}
          </motion.div>
        );
      })}
    </div>
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

      <div className="columns-1 gap-4 md:columns-2 [column-fill:_balance]">
        <AnimatePresence>
          {displayPosts.map((post, index) => (
            <motion.div
              key={`linkedin-${post.id}`}
              className="mb-4 break-inside-avoid"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
            >
              <PostCard post={post} delay={index * 0.05} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function SocialFeed() {
  const sectionRef = useRef<HTMLElement>(null);
  const [platform, setPlatform] = useState<Platform>('All');
  const { posts: linkedInPosts, isLive: linkedInLive } = useNotionLinkedInFeed();
  const { posts: xPosts, isLive: xLive } = useNotionXFeed();

  const FEED_LIMIT_TAB = 6;
  const FEED_LIMIT_ALL = 8;

  const highlightedPosts = useMemo(() => linkedInPosts.filter((post) => post.pinned), [linkedInPosts]);
  const displayPosts = useMemo(() => {
    const pool = platform === 'X / Twitter'
      ? xPosts
      : platform === 'LinkedIn'
        ? linkedInPosts
        : [...linkedInPosts, ...xPosts];

    const filtered = pool.filter((p) => platformMatches(p, platform) && !p.pinned);
    const featured = filtered.filter((p) => p.featured);
    const rest = filtered.filter((p) => !p.featured);

    const budget = platform === 'All' ? FEED_LIMIT_ALL : FEED_LIMIT_TAB;
    const room = Math.max(0, budget - featured.length);

    return sortByRecent([...featured, ...rest.slice(0, room)]);
  }, [platform, linkedInPosts, xPosts]);

  const showHighlighted = platform === 'All' && highlightedPosts.length > 0;
  const profileLink = getProfileLink(platform);
  const isLive = platform === 'X / Twitter' ? xLive : linkedInLive;
  const statusLabel =
    LINKEDIN_EMBED_POSTS.length > 0
      ? 'Embedded'
      : isLive
        ? 'Live'
        : 'Curated';

  return (
    <section ref={sectionRef} id="social" className="relative overflow-hidden border-t border-white/5 bg-bg py-24">
      <FloatingSocialIcons containerRef={sectionRef} />
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
            <XFeed key="x-feed" posts={displayPosts} />
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

              <div className="columns-1 gap-4 md:columns-2 [column-fill:_balance] [&_.react-tweet-theme]:!my-0">
                <AnimatePresence>
                  {displayPosts.map((post, index) => {
                    const tweetId = post.platform === 'x' && post.url ? extractTweetId(post.url) : null;
                    return (
                      <motion.div
                        key={`${platform}-${post.id}`}
                        className="mb-4 break-inside-avoid"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4 }}
                      >
                        {tweetId ? (
                          <div data-theme="dark">
                            <Tweet id={tweetId} />
                          </div>
                        ) : (
                          <PostCard post={post} delay={index * 0.05} />
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <AnimatePresence mode="wait">
            {platform === 'All' ? (
              <motion.div
                key="all-links"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.25 }}
                className="flex flex-wrap items-center justify-center gap-3"
              >
                {/* LinkedIn */}
                <a
                  href={LINKEDIN_PROFILE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center justify-center rounded-full text-[13px] transition-transform duration-200 hover:scale-[1.03]"
                >
                  <span className="absolute inset-[-2px] rounded-full bg-[#0A66C2] opacity-0 transition-opacity duration-300 group-hover:opacity-20" />
                  <span className="relative flex items-center gap-2.5 rounded-full border border-stroke bg-surface px-5 py-2.5 text-text-primary backdrop-blur-md transition-colors duration-300 group-hover:border-[#0A66C2]/40">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden>
                      <rect width="24" height="24" rx="4" fill="#0A66C2" />
                      <path fill="white" d="M6.94 5a2 2 0 1 1-4-.002 2 2 0 0 1 4 .002zM7 8.48H3V21h4V8.48zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91l.04-1.68z" />
                    </svg>
                    View on LinkedIn
                    <ExternalLink className="h-3.5 w-3.5 opacity-40 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </span>
                </a>

                {/* X / Twitter */}
                <a
                  href={X_PROFILE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center justify-center rounded-full text-[13px] transition-transform duration-200 hover:scale-[1.03]"
                >
                  <span className="absolute inset-[-2px] rounded-full bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-5" />
                  <span className="relative flex items-center gap-2.5 rounded-full border border-stroke bg-surface px-5 py-2.5 text-text-primary backdrop-blur-md transition-colors duration-300 group-hover:border-white/20">
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0 fill-current" aria-hidden>
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    View on X
                    <ExternalLink className="h-3.5 w-3.5 opacity-40 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </span>
                </a>
              </motion.div>
            ) : (
              <motion.a
                key={platform}
                href={profileLink.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.25 }}
                className="group relative inline-flex items-center justify-center rounded-full text-[13px] transition-transform duration-200 hover:scale-[1.03]"
              >
                <span className="absolute inset-[-2px] rounded-full bg-gradient-to-r from-[#89AACC] to-[#4E85BF] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="relative flex items-center gap-2 rounded-full border border-stroke bg-surface px-6 py-2.5 text-text-primary backdrop-blur-md transition-colors duration-300 group-hover:border-transparent group-hover:bg-bg">
                  {profileLink.label}
                  <ExternalLink className="h-3.5 w-3.5 opacity-50 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </motion.a>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
