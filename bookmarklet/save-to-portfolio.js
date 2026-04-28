// Save to Portfolio — bookmarklet source (readable version)
//
// HOW TO USE:
//   1. Minify this file (see README.md for the one-liner).
//   2. Install the minified one-liner as a browser bookmark.
//   3. On LinkedIn: highlight the post text → click the bookmark → done.
//   4. On X: open the tweet permalink (/status/<id>), then click the bookmark.

(async () => {
  const BASE = 'https://portfolio-yash01rais-projects.vercel.app';

  const host = window.location.hostname;
  const platform =
    host.includes('linkedin') ? 'linkedin' :
    (host.includes('x.com') || host.includes('twitter')) ? 'x' :
    'linkedin';

  // X: must be on a tweet permalink, not the home feed
  if (platform === 'x' && !/\/status\/\d+/.test(window.location.href)) {
    alert('Open the tweet itself first (URL must contain /status/<id>), then click the bookmark.');
    return;
  }

  let content = window.getSelection().toString().trim();

  // X: no selection needed — scrape text from the tweet article
  if (!content && platform === 'x') {
    try {
      const article = document.querySelector('article[data-testid="tweet"]');
      const textNode = article && article.querySelector('[data-testid="tweetText"]');
      content = (textNode && textNode.innerText && textNode.innerText.trim()) || '(tweet)';
    } catch (_) {
      content = '(tweet)';
    }
  }

  if (!content) {
    alert('Highlight the post text first, then click the bookmark.');
    return;
  }

  // Parse "1,234" / "1.2K" / "2.5M" → integer
  function parseCount(raw) {
    const s = raw.replace(/,/g, '').trim().toUpperCase();
    const n = parseFloat(s);
    if (s.endsWith('M')) return Math.round(n * 1_000_000);
    if (s.endsWith('K')) return Math.round(n * 1_000);
    return isNaN(n) ? 0 : Math.round(n);
  }

  // Scan aria-labels and inner text for a count matching any keyword.
  function scrapeCount(keywords) {
    try {
      const els = document.querySelectorAll('[aria-label], span, button');
      for (const el of els) {
        const text = (el.getAttribute('aria-label') || el.innerText || '').trim().toLowerCase();
        if (!text || text.length > 120) continue;
        for (const kw of keywords) {
          if (text.includes(kw)) {
            const m = text.match(/([\d,.]+\s*[km]?)/i);
            if (m) return parseCount(m[1]);
          }
        }
      }
    } catch (_) {}
    return 0;
  }

  // Parse LinkedIn relative timestamps → YYYY-MM-DD
  // Formats: "2h", "3d", "1w", "2mo", "1yr", also "3d • 🌐" or "Edited • 3d"
  function scrapePostedAt() {
    try {
      // Prefer <time datetime="..."> — exact ISO date when present
      const timeEl = document.querySelector('time[datetime]');
      if (timeEl) {
        const dt = timeEl.getAttribute('datetime');
        if (dt) return dt.split('T')[0];
      }

      // Look for LinkedIn's actor sub-description span which holds the relative time
      const candidates = [
        ...document.querySelectorAll(
          'span.update-components-actor__sub-description,' +
          'span[class*="sub-description"],' +
          'a[href*="activity"] span,' +
          'span.feed-shared-actor__sub-description'
        ),
      ];

      for (const el of candidates) {
        const text = el.innerText || '';
        const parsed = relativeToDate(text);
        if (parsed) return parsed;
      }

      // Broader fallback: any short span whose text looks like a relative time
      const spans = document.querySelectorAll('span, a');
      for (const el of spans) {
        const text = (el.innerText || '').trim();
        if (text.length > 20) continue;
        const parsed = relativeToDate(text);
        if (parsed) return parsed;
      }
    } catch (_) {}
    return new Date().toISOString().split('T')[0];
  }

  function relativeToDate(raw) {
    // LinkedIn shows "Author • 1w • 🌐" — check every segment separated by • or newlines
    const segments = raw.split(/[•\n]+/).map(s => s.replace(/edited/i, '').trim().toLowerCase()).filter(Boolean);
    const now = new Date();
    const clone = (offset) => { const d = new Date(now); d.setDate(d.getDate() + offset); return d.toISOString().split('T')[0]; };

    for (const text of segments) {
      if (/^\d+[mh]$/.test(text)) return clone(0);
      const d = text.match(/^(\d+)d$/);   if (d)  return clone(-parseInt(d[1]));
      const w = text.match(/^(\d+)w$/);   if (w)  return clone(-parseInt(w[1]) * 7);
      const mo = text.match(/^(\d+)mo$/); if (mo) { const dt = new Date(now); dt.setMonth(dt.getMonth() - parseInt(mo[1])); return dt.toISOString().split('T')[0]; }
      const yr = text.match(/^(\d+)yr$/); if (yr) { const dt = new Date(now); dt.setFullYear(dt.getFullYear() - parseInt(yr[1])); return dt.toISOString().split('T')[0]; }
    }
    return null;
  }

  // X embed shows live counts — skip scraping for x posts
  const likes    = platform === 'x' ? 0 : scrapeCount(['reaction', 'like']);
  const comments = platform === 'x' ? 0 : scrapeCount(['comment']);
  const shares   = platform === 'x' ? 0 : scrapeCount(['repost', 'reshare']);
  const postedAt = platform === 'x' ? new Date().toISOString().split('T')[0] : scrapePostedAt();

  const saveUrl = BASE + '/save.html'
    + '?c='  + encodeURIComponent(content)
    + '&u='  + encodeURIComponent(window.location.href)
    + '&p='  + platform
    + '&lk=' + likes
    + '&cm=' + comments
    + '&sh=' + shares
    + '&at=' + encodeURIComponent(postedAt);

  window.open(saveUrl, '_blank', 'width=420,height=300,noopener');
})();
