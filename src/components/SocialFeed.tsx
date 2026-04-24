import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionHeader } from './ui/SectionHeader';

const PLATFORMS = ["All", "LinkedIn", "X / Twitter"] as const;
type Platform = typeof PLATFORMS[number];

const HIGHLIGHTED_POSTS = [
  {
    platform: "linkedin",
    avatar: "YR",
    handle: "Yash Rai",
    time: "2 weeks ago",
    content: "Shipped something I'm genuinely proud of — we reduced production regressions by ~82% by re-architecting our core UI modules.\n\nThe secret? Treating frontend modules as system contracts, not just components.",
    likes: 214,
    comments: 31,
    shares: 18,
    pinned: true
  }
];

const FEED_POSTS = {
  "LinkedIn": [
    {
      avatar: "YR", handle: "Yash Rai", time: "3 days ago",
      content: "AI-assisted scaffolding with Claude + Copilot increased our feature delivery velocity by 70%. The future of frontend development is hybrid — human creativity + machine precision.",
      likes: 189, comments: 24, shares: 12
    },
    {
      avatar: "YR", handle: "Yash Rai", time: "1 week ago",
      content: "Micro Frontends via Webpack Module Federation are genuinely underrated for large teams.\n\nModule isolation, independent deployments, clean system contracts. Here's what I learned building them at Livspace 🧵",
      likes: 302, comments: 47, shares: 29
    },
    {
      avatar: "YR", handle: "Yash Rai", time: "2 weeks ago",
      content: "Performance isn't a feature. It's a promise.\n\nReduced API latency by 900ms through query optimization and async processing. Users don't notice fast apps — they notice slow ones.",
      likes: 156, comments: 19, shares: 8
    },
    {
      avatar: "YR", handle: "Yash Rai", time: "3 weeks ago",
      content: "Type-safe component libraries are worth the upfront investment. We cut feature development time by 50% once the system was in place. Build the platform, then build on the platform.",
      likes: 278, comments: 38, shares: 21
    }
  ],
  "X / Twitter": [
    {
      avatar: "YR", handle: "@herecomeyashrai", time: "2 days ago",
      content: "hot take: the best frontend engineers are actually systems thinkers who happen to write React",
      likes: 341, comments: 52, shares: 67
    },
    {
      avatar: "YR", handle: "@herecomeyashrai", time: "5 days ago",
      content: "just spent 3 hours debugging a race condition in a WebSocket handler\n\nturns out the fix was 2 lines\n\nthis is the job",
      likes: 891, comments: 134, shares: 201
    },
    {
      avatar: "YR", handle: "@herecomeyashrai", time: "1 week ago",
      content: "building with LLMs in 2025:\n- 70% faster scaffolding ✅\n- still writing the hard bits yourself ✅\n- occasionally arguing with the AI about architecture ✅",
      likes: 1204, comments: 189, shares: 312
    },
    {
      avatar: "YR", handle: "@herecomeyashrai", time: "2 weeks ago",
      content: "the best code review feedback i ever got: 'this works, but will the engineer at 2am reading this know why?'",
      likes: 2341, comments: 247, shares: 489
    }
  ]
};

function PostCard({ post, delay = 0, highlighted = false }: { post: any; delay?: number; highlighted?: boolean }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={`relative overflow-hidden rounded-2xl p-5 ${highlighted ? 'bg-surface' : 'bg-surface'}`}
      style={{
        border: `1px solid ${highlighted ? "rgba(78, 133, 191, 0.2)" : "var(--stroke)"}`,
        boxShadow: highlighted ? "0 0 40px rgba(78, 133, 191, 0.04), 0 0 0 0.5px rgba(78, 133, 191, 0.13)" : "none",
      }}
    >
      {highlighted && (
        <div 
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(137, 170, 204, 0.4), transparent)" }} 
        />
      )}
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-3.5">
        <div className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-[11px] font-bold text-white tracking-[0.05em] bg-gradient-to-br from-[#89AACC] to-[#4E85BF]">
          {post.avatar}
        </div>
        <div className="flex-1">
          <div className="text-[13px] font-semibold text-text-primary">{post.handle}</div>
          <div className="text-[11px] text-muted">{post.time}</div>
        </div>
        {highlighted && (
          <span className="text-[10px] px-2.5 py-1 rounded-full border tracking-[0.1em] uppercase bg-[#89AACC]/10 border-[#89AACC]/20 text-[#89AACC]">
            Highlighted
          </span>
        )}
      </div>

      {/* Content */}
      <p className="text-[13.5px] text-muted leading-[1.7] mb-4 whitespace-pre-line">
        {post.content}
      </p>

      {/* Engagement */}
      <div className="flex gap-5 border-t border-stroke pt-3 mt-auto">
        {[
          { icon: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
          ), val: post.likes },
          { icon: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          ), val: post.comments },
          { icon: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
          ), val: post.shares }
        ].map(({ icon, val }, i) => (
          <span key={i} className="text-xs text-muted flex items-center gap-1.5 hover:text-text-primary transition-colors cursor-pointer">
            <span className="opacity-50">{icon}</span>
            {val.toLocaleString()}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export default function SocialFeed() {
  const [platform, setPlatform] = useState<Platform>("All");
  const showHighlighted = HIGHLIGHTED_POSTS.length > 0;

  const getAllPosts = () => {
    const linkedIn = FEED_POSTS["LinkedIn"].map(p => ({ ...p, _src: "linkedin" }));
    const twitter = FEED_POSTS["X / Twitter"].map(p => ({ ...p, _src: "x" }));
    
    // Interleave them for a better "All" feed look
    const all = [];
    const maxLength = Math.max(linkedIn.length, twitter.length);
    for (let i = 0; i < maxLength; i++) {
      if (linkedIn[i]) all.push(linkedIn[i]);
      if (twitter[i]) all.push(twitter[i]);
    }
    return all;
  };

  const displayPosts = platform === "All" 
    ? getAllPosts() 
    : FEED_POSTS[platform as "LinkedIn" | "X / Twitter"] || [];

  return (
    <section id="social" className="bg-bg py-24 border-t border-white/5 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[900px] mx-auto px-6 relative z-10">
        <SectionHeader
          eyebrow="Journal"
          heading="Recent"
          italic="thoughts"
          sub="Thoughts on frontend architecture, AI-augmented development, and engineering craft."
        />

        {/* Platform switcher */}
        <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2 scrollbar-hide">
          {PLATFORMS.map(p => (
            <button 
              key={p} 
              onClick={() => setPlatform(p)} 
              className={`px-4 py-2 rounded-full text-xs cursor-pointer transition-all duration-300 tracking-[0.05em] whitespace-nowrap border ${
                platform === p 
                  ? "bg-surface border-white/20 text-text-primary shadow-sm" 
                  : "bg-transparent border-stroke text-muted hover:border-white/10 hover:text-text-primary"
              }`}
            >
              {p === "LinkedIn" ? (
                <span className="flex items-center gap-1.5">
                  <svg className="w-3 h-3 text-[#0A66C2]" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  {p}
                </span>
              ) : p === "X / Twitter" ? (
                <span className="flex items-center gap-1.5">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  {p}
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <svg className="w-3 h-3 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
                  {p}
                </span>
              )}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-1.5 pl-4">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
            <span className="text-[11px] text-muted tracking-[0.1em] uppercase hidden sm:block">Live updates</span>
          </div>
        </div>

        {/* Highlighted post */}
        <AnimatePresence mode="wait">
          {showHighlighted && platform === "All" && (
            <motion.div 
              key="highlighted"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-gradient-to-r from-stroke to-transparent" />
                <span className="text-[10px] text-muted uppercase tracking-[0.3em]">Pinned</span>
                <div className="flex-1 h-px bg-gradient-to-l from-stroke to-transparent" />
              </div>
              {HIGHLIGHTED_POSTS.map((post, i) => (
                <PostCard key={`highlighted-${i}`} post={post} highlighted={true} delay={0} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Feed grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <AnimatePresence>
            {displayPosts.map((post, i) => (
              <motion.div
                key={`${platform}-${i}-${post.content.slice(0, 10)}`}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
              >
                <PostCard post={post} delay={i * 0.05} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Load more */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 flex justify-center"
        >
          <button className="group relative inline-flex items-center justify-center rounded-full text-[13px] transition-transform duration-200 hover:scale-[1.03]">
            <span className="absolute inset-[-2px] rounded-full bg-gradient-to-r from-[#89AACC] to-[#4E85BF] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <span className="relative flex items-center gap-2 px-6 py-2.5 rounded-full bg-surface border border-stroke text-text-primary backdrop-blur-md transition-colors duration-300 group-hover:bg-bg group-hover:border-transparent">
              View all posts on {platform} <span className="opacity-50 transition-transform duration-300 group-hover:translate-x-1">→</span>
            </span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
