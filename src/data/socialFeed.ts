import type { SocialFeedItem } from '../types/socialFeed';

export const X_USERNAME = 'herecomeyashrai';
export const X_PROFILE_URL = `https://x.com/${X_USERNAME}`;
export const X_TIMELINE_EMBED_URL = `https://twitter.com/${X_USERNAME}`;
export const LINKEDIN_PROFILE_URL = 'https://www.linkedin.com/in/paintedincodebyyashrai/';

export interface LinkedInEmbedPost {
  id: string;
  src: string;
  title: string;
}

export const LINKEDIN_EMBED_POSTS: LinkedInEmbedPost[] = [
  // Paste official LinkedIn embed iframe src values here.
  // Example:
  // {
  //   id: 'linkedin-post-1',
  //   src: 'https://www.linkedin.com/embed/feed/update/urn:li:share:1234567890',
  //   title: 'LinkedIn post by Yash Rai',
  // },
];

export const CURATED_LINKEDIN_POSTS: SocialFeedItem[] = [
  {
    id: 'linkedin-highlight-ui-contracts',
    platform: 'linkedin',
    authorName: 'Yash Rai',
    handle: 'Yash Rai',
    publishedAt: '2026-04-10T10:00:00.000Z',
    url: LINKEDIN_PROFILE_URL,
    content:
      "Shipped something I'm genuinely proud of - we reduced production regressions by ~82% by re-architecting our core UI modules.\n\nThe secret? Treating frontend modules as system contracts, not just components.",
    metrics: { likes: 214, comments: 31, shares: 18 },
    source: 'curated',
    pinned: true,
  },
  {
    id: 'linkedin-ai-scaffolding',
    platform: 'linkedin',
    authorName: 'Yash Rai',
    handle: 'Yash Rai',
    publishedAt: '2026-04-21T10:00:00.000Z',
    url: LINKEDIN_PROFILE_URL,
    content:
      'AI-assisted scaffolding with Claude + Copilot increased our feature delivery velocity by 70%. The future of frontend development is hybrid - human creativity + machine precision.',
    metrics: { likes: 189, comments: 24, shares: 12 },
    source: 'curated',
  },
  {
    id: 'linkedin-module-federation',
    platform: 'linkedin',
    authorName: 'Yash Rai',
    handle: 'Yash Rai',
    publishedAt: '2026-04-17T10:00:00.000Z',
    url: LINKEDIN_PROFILE_URL,
    content:
      "Micro Frontends via Webpack Module Federation are genuinely underrated for large teams.\n\nModule isolation, independent deployments, clean system contracts. Here's what I learned building them at Livspace.",
    metrics: { likes: 302, comments: 47, shares: 29 },
    source: 'curated',
  },
  {
    id: 'linkedin-performance-promise',
    platform: 'linkedin',
    authorName: 'Yash Rai',
    handle: 'Yash Rai',
    publishedAt: '2026-04-10T10:00:00.000Z',
    url: LINKEDIN_PROFILE_URL,
    content:
      "Performance isn't a feature. It's a promise.\n\nReduced API latency by 900ms through query optimization and async processing. Users don't notice fast apps - they notice slow ones.",
    metrics: { likes: 156, comments: 19, shares: 8 },
    source: 'curated',
  },
];

export const CURATED_X_POSTS: SocialFeedItem[] = [
  {
    id: 'x-systems-thinker',
    platform: 'x',
    authorName: 'Yash Rai',
    handle: `@${X_USERNAME}`,
    publishedAt: '2026-04-22T10:00:00.000Z',
    url: X_PROFILE_URL,
    content: 'hot take: the best frontend engineers are actually systems thinkers who happen to write React',
    metrics: { likes: 341, comments: 52, shares: 67 },
    source: 'fallback',
  },
  {
    id: 'x-websocket-race',
    platform: 'x',
    authorName: 'Yash Rai',
    handle: `@${X_USERNAME}`,
    publishedAt: '2026-04-19T10:00:00.000Z',
    url: X_PROFILE_URL,
    content: 'just spent 3 hours debugging a race condition in a WebSocket handler\n\nturns out the fix was 2 lines\n\nthis is the job',
    metrics: { likes: 891, comments: 134, shares: 201 },
    source: 'fallback',
  },
  {
    id: 'x-llms-2025',
    platform: 'x',
    authorName: 'Yash Rai',
    handle: `@${X_USERNAME}`,
    publishedAt: '2026-04-17T10:00:00.000Z',
    url: X_PROFILE_URL,
    content: 'building with LLMs in 2025:\n- 70% faster scaffolding\n- still writing the hard bits yourself\n- occasionally arguing with the AI about architecture',
    metrics: { likes: 1204, comments: 189, shares: 312 },
    source: 'fallback',
  },
  {
    id: 'x-code-review',
    platform: 'x',
    authorName: 'Yash Rai',
    handle: `@${X_USERNAME}`,
    publishedAt: '2026-04-10T10:00:00.000Z',
    url: X_PROFILE_URL,
    content: "the best code review feedback i ever got: 'this works, but will the engineer at 2am reading this know why?'",
    metrics: { likes: 2341, comments: 247, shares: 489 },
    source: 'fallback',
  },
];
