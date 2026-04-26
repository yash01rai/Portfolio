// Save to Portfolio — bookmarklet source (readable version)
//
// HOW TO USE:
//   1. Replace the two constants below with your real values.
//   2. Minify this file (see README.md for how).
//   3. Install the minified one-liner as a browser bookmark.
//   4. On LinkedIn: highlight the post text → click the bookmark → done.
//
// ⚠️  Keep the minified bookmark private — it contains your INGEST_SECRET.

(async () => {
  // Replace with your actual INGEST_SECRET from .env.local
  const SECRET = 'f4ae1531f9a6e6ad0783d3ade1f04361be5d246bcc998d2252d9714b09a81065';

  // Replace with your production domain if different
  const ENDPOINT = 'https://portfolio-9223syim9-yash01rais-projects.vercel.app/api/ingest';

  // Grab whatever text the user has highlighted on the page
  const content = window.getSelection().toString().trim();

  if (!content) {
    alert('Highlight the post text first, then click the bookmark.');
    return;
  }

  // Detect platform from the current tab's hostname
  const host = window.location.hostname;
  const platform =
    host.includes('linkedin') ? 'linkedin' :
    host.includes('x.com') || host.includes('twitter') ? 'x' :
    'linkedin'; // default to linkedin

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SECRET}`,
      },
      body: JSON.stringify({
        content,
        url: window.location.href,
        platform,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok && data.ok) {
      alert(`✓ Saved to portfolio!\n\n${content.length} chars captured.\nAppears on site within ~5 min.`);
    } else {
      alert(`✗ Save failed: ${data.error || `HTTP ${res.status}`}`);
    }
  } catch (err) {
    alert(`✗ Network error: ${err.message}\n\nMake sure you are connected and the portfolio is deployed.`);
  }
})();
