import { Client, isFullPage } from '@notionhq/client';
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import type { SocialFeedItem } from '../src/types/socialFeed';

const LINKEDIN_PROFILE_URL = 'https://www.linkedin.com/in/paintedincodebyyashrai/';

// Notion property names — must match your database exactly.
const PROP = {
  content: 'Content',     // Title field
  platform: 'Platform',   // Select: 'linkedin' | 'x'
  handle: 'Handle',       // Text (rich_text)
  postedAt: 'PostedAt',   // Date
  url: 'URL',             // URL
  likes: 'Likes',         // Number
  comments: 'Comments',   // Number
  shares: 'Shares',       // Number
  pinned: 'Pinned',       // Checkbox
  published: 'Published', // Checkbox — gate before items appear on site
} as const;

function extractProps(page: PageObjectResponse): SocialFeedItem | null {
  const p = page.properties;

  const contentProp = p[PROP.content];
  const content =
    contentProp?.type === 'title' ? contentProp.title.map((t) => t.plain_text).join('') : '';

  if (!content.trim()) return null;

  const handleProp = p[PROP.handle];
  const handle =
    handleProp?.type === 'rich_text'
      ? handleProp.rich_text.map((t) => t.plain_text).join('')
      : 'Yash Rai';

  const postedAtProp = p[PROP.postedAt];
  const publishedAt =
    postedAtProp?.type === 'date'
      ? (postedAtProp.date?.start ?? page.created_time)
      : page.created_time;

  const urlProp = p[PROP.url];
  const url = urlProp?.type === 'url' ? (urlProp.url ?? LINKEDIN_PROFILE_URL) : LINKEDIN_PROFILE_URL;

  const likesProp = p[PROP.likes];
  const commentsProp = p[PROP.comments];
  const sharesProp = p[PROP.shares];
  const pinnedProp = p[PROP.pinned];

  return {
    id: page.id,
    platform: 'linkedin',
    authorName: 'Yash Rai',
    handle,
    publishedAt,
    url,
    content,
    metrics: {
      likes: likesProp?.type === 'number' ? (likesProp.number ?? 0) : 0,
      comments: commentsProp?.type === 'number' ? (commentsProp.number ?? 0) : 0,
      shares: sharesProp?.type === 'number' ? (sharesProp.number ?? 0) : 0,
    },
    source: 'api',
    pinned: pinnedProp?.type === 'checkbox' ? pinnedProp.checkbox : false,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function handler(_req: any, res: any) {
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=3600');
  res.setHeader('Access-Control-Allow-Origin', '*');

  const token = process.env.NOTION_TOKEN;
  const databaseId = process.env.NOTION_DATABASE_ID;

  if (!token || !databaseId) {
    return res.status(200).json({ posts: [], source: 'unconfigured' });
  }

  try {
    const notion = new Client({ auth: token });

    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        and: [
          { property: PROP.published, checkbox: { equals: true } },
          { property: PROP.platform, select: { equals: 'linkedin' } },
        ],
      },
      sorts: [{ property: PROP.postedAt, direction: 'descending' }],
      page_size: 20,
    });

    const posts: SocialFeedItem[] = response.results
      .filter(isFullPage)
      .map(extractProps)
      .filter((post): post is SocialFeedItem => post !== null);

    return res.status(200).json({ posts });
  } catch (err) {
    console.error('[social-posts] Notion query failed:', err);
    return res.status(200).json({ posts: [], error: 'upstream_error' });
  }
}
