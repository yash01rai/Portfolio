// Save to Portfolio — bookmarklet source (readable version)
//
// HOW TO USE:
//   1. Minify this file (see README.md for the one-liner).
//   2. Install the minified one-liner as a browser bookmark.
//   3. On LinkedIn: highlight the post text → click the bookmark → done.

(async () => {
  const BASE = 'https://portfolio-yash01rais-projects.vercel.app';

  const content = window.getSelection().toString().trim();
  if (!content) {
    alert('Highlight the post text first, then click the bookmark.');
    return;
  }

  const host = window.location.hostname;
  const platform =
    host.includes('linkedin') ? 'linkedin' :
    host.includes('x.com') || host.includes('twitter') ? 'x' :
    'linkedin';

  // Best-effort scrape of engagement counts from the LinkedIn DOM.
  // Searches all visible text nodes for a number followed by a keyword.
  function scrapeCount(keywords) {
    try {
      const candidates = document.querySelectorAll(
        'span.social-details-social-counts__reactions-count, ' +
        'button.social-details-social-counts__count-value, ' +
        '[aria-label], span, button'
      );
      for (const el of candidates) {
        const text = (el.getAttribute('aria-label') || el.innerText || '').trim().toLowerCase();
        if (!text || text.length > 80) continue;
        for (const kw of keywords) {
          if (text.includes(kw)) {
            const m = text.match(/([\d,]+)/);
            if (m) return parseInt(m[1].replace(/,/g, ''), 10);
          }
        }
      }
    } catch (_) {}
    return 0;
  }

  const likes    = scrapeCount(['reaction', 'like']);
  const comments = scrapeCount(['comment']);
  const shares   = scrapeCount(['repost', 'reshare', 'share']);

  const saveUrl = BASE + '/save.html'
    + '?c='  + encodeURIComponent(content)
    + '&u='  + encodeURIComponent(window.location.href)
    + '&p='  + platform
    + '&lk=' + likes
    + '&cm=' + comments
    + '&sh=' + shares;

  window.open(saveUrl, '_blank', 'width=420,height=280,noopener');
})();
