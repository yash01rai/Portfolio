import { Client } from '@notionhq/client';

const NOTION_PROP = {
  content: 'Content',
  platform: 'Platform',
  handle: 'Handle',
  postedAt: 'PostedAt',
  url: 'URL',
  likes: 'Likes',
  comments: 'Comments',
  shares: 'Shares',
  pinned: 'Pinned',
  published: 'Published',
} as const;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

function setCors(res: any) {
  for (const [key, value] of Object.entries(CORS_HEADERS)) {
    res.setHeader(key, value);
  }
}

// Constant-time string compare to prevent timing attacks on the secret.
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function handler(req: any, res: any) {
  setCors(res);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  // Validate bearer secret
  const secret = process.env.INGEST_SECRET;
  const authHeader: string = req.headers['authorization'] ?? '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

  if (!secret || !token || !safeEqual(token, secret)) {
    return res.status(401).json({ ok: false, error: 'unauthorized' });
  }

  // Parse body
  let body: Record<string, unknown>;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body ?? {};
  } catch {
    return res.status(400).json({ ok: false, error: 'invalid_body' });
  }

  const content = typeof body.content === 'string' ? body.content.trim() : '';
  if (!content) {
    return res.status(200).json({ ok: false, error: 'missing_content' });
  }

  const platform = typeof body.platform === 'string' ? body.platform : 'linkedin';
  const handle =
    typeof body.handle === 'string'
      ? body.handle
      : platform === 'x'
        ? '@herecomeyashrai'
        : 'Yash Rai';
  const url      = typeof body.url === 'string' ? body.url : '';
  const likes    = typeof body.likes    === 'number' ? body.likes    : 0;
  const comments = typeof body.comments === 'number' ? body.comments : 0;
  const shares   = typeof body.shares   === 'number' ? body.shares   : 0;
  const postedAt =
    typeof body.postedAt === 'string'
      ? body.postedAt
      : new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  // Notion title field has a 2000-char limit
  const truncatedContent = content.slice(0, 2000);

  const notionToken = process.env.NOTION_TOKEN;
  const databaseId = process.env.NOTION_DATABASE_ID;

  if (!notionToken || !databaseId) {
    return res.status(200).json({ ok: false, error: 'notion_not_configured' });
  }

  try {
    const notion = new Client({ auth: notionToken });

    const page = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        [NOTION_PROP.content]: {
          title: [{ text: { content: truncatedContent } }],
        },
        [NOTION_PROP.platform]: {
          select: { name: platform },
        },
        [NOTION_PROP.handle]: {
          rich_text: [{ text: { content: handle } }],
        },
        [NOTION_PROP.postedAt]: {
          date: { start: postedAt },
        },
        [NOTION_PROP.url]: {
          url: url || null,
        },
        [NOTION_PROP.likes]: { number: likes },
        [NOTION_PROP.comments]: { number: comments },
        [NOTION_PROP.shares]: { number: shares },
        [NOTION_PROP.pinned]: { checkbox: false },
        [NOTION_PROP.published]: { checkbox: true },
      },
    });

    return res.status(200).json({ ok: true, id: page.id });
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    console.error('[ingest] Notion create failed:', detail);
    return res.status(200).json({ ok: false, error: 'notion_error', detail });
  }
}
