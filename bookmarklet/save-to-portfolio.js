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

  const saveUrl = BASE + '/save.html'
    + '?c=' + encodeURIComponent(content)
    + '&u=' + encodeURIComponent(window.location.href)
    + '&p=' + platform;

  window.open(saveUrl, '_blank', 'width=420,height=280,noopener');
})();
