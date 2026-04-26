# Save to Portfolio — Bookmarklet

One click saves a LinkedIn post to Notion, which appears on your portfolio within ~5 minutes.

## How it works

1. You're on a LinkedIn post — highlight the post body text with your cursor
2. Click the **Save to Portfolio** bookmark in your browser bar
3. The bookmarklet POSTs the selected text + URL to `/api/ingest` on your portfolio
4. The endpoint writes a new row to your Notion database with `Published = true`
5. Next time `/api/social-posts` is called (cache expires every 5 min), the post appears live

---

## Install (one-time setup, ~2 minutes)

### Step 1 — Show your bookmarks bar

- **Chrome / Edge**: `Cmd+Shift+B` (Mac) or `Ctrl+Shift+B` (Windows)
- **Firefox**: `View → Toolbars → Bookmarks Toolbar`
- **Safari**: `View → Show Favorites Bar`

### Step 2 — Add the bookmark

Right-click the bookmarks bar → **Add page** (Chrome/Edge) or **New Bookmark** (Firefox/Safari).

Fill in:
- **Name**: `Save to Portfolio`
- **URL**: paste the entire one-liner below (starts with `javascript:`)

```
javascript:%28async%28%29%3D%3E%7Bconst%20S%3D%22f4ae1531f9a6e6ad0783d3ade1f04361be5d246bcc998d2252d9714b09a81065%22%2CE%3D%22https%3A%2F%2Fportfolio-yash01rais-projects.vercel.app%2Fapi%2Fingest%22%2Cc%3Dwindow.getSelection%28%29.toString%28%29.trim%28%29%3Bif%28%21c%29%7Balert%28%22Highlight%20the%20post%20text%20first%2C%20then%20click%20the%20bookmark.%22%29%3Breturn%3B%7Dconst%20h%3Dwindow.location.hostname%2Cp%3Dh.includes%28%22linkedin%22%29%3F%22linkedin%22%3A%28h.includes%28%22x.com%22%29%7C%7Ch.includes%28%22twitter%22%29%29%3F%22x%22%3A%22linkedin%22%3Btry%7Bconst%20r%3Dawait%20fetch%28E%2C%7Bmethod%3A%22POST%22%2Cmode%3A%22cors%22%2Cheaders%3A%7B%22Content-Type%22%3A%22application%2Fjson%22%2C%22Authorization%22%3A%22Bearer%20%22%2BS%7D%2Cbody%3AJSON.stringify%28%7Bcontent%3Ac%2Curl%3Awindow.location.href%2Cplatform%3Ap%7D%29%7D%29%3Bconst%20d%3Dawait%20r.json%28%29.catch%28%28%29%3D%3E%28%7B%7D%29%29%3Bif%28r.ok%26%26d.ok%29%7Balert%28%22Saved%20to%20portfolio%21%20%22%2Bc.length%2B%22%20chars.%20Appears%20in%20~5%20min.%22%29%3B%7Delse%7Balert%28%22Save%20failed%3A%20%22%2B%28d.error%7C%7C%22HTTP%20%22%2Br.status%29%29%3B%7D%7Dcatch%28e%29%7Balert%28%22Network%20error%3A%20%22%2Be.message%29%3B%7D%7D%29%28%29%3B
```

Click **Save**.

---

## Daily use

1. Open a LinkedIn post you want on your portfolio
2. **Highlight** the post text (click and drag)
3. Click **Save to Portfolio** in your bookmarks bar
4. You'll see an alert: `Saved to portfolio! N chars. Appears in ~5 min.`
5. Done — the post appears on your portfolio's LinkedIn tab within 5 minutes

Works on **X/Twitter** too — just highlight the tweet text and click the same bookmark.

---

## Troubleshooting

| Alert message | Cause | Fix |
|---|---|---|
| "Highlight the post text first" | Nothing selected | Highlight the post body text, then click |
| "Save failed: unauthorized" | Wrong secret in bookmark | Regenerate bookmark with correct `INGEST_SECRET` from `.env.local` |
| "Save failed: notion_not_configured" | Env vars missing | Check `NOTION_TOKEN` and `NOTION_DATABASE_ID` are set in Vercel |
| "Save failed: notion_error" | Notion API issue | Check Notion integration is connected to the database |
| "Network error" | Offline or site not deployed | Check your internet and that the portfolio is live on Vercel |
| Post doesn't appear after 5 min | Cache still warm | Hard-refresh (`Cmd+Shift+R`) or wait up to 5 min for cache expiry |

---

## Security

The bookmark URL contains your `INGEST_SECRET` in plain text. Anyone who reads your bookmarks can use it to POST to your Notion database.

- ✅ Safe on your personal device
- ❌ Do not sync this bookmark to work/shared browsers
- ❌ Do not commit the minified bookmark URL to a public repo

To rotate the secret: generate a new one (`openssl rand -hex 32`), update `.env.local`, run `vercel env add INGEST_SECRET production`, and re-install the bookmark.

---

## Re-generating the bookmark

If the secret rotates or the endpoint URL changes, edit `save-to-portfolio.js` with the new values, then run:

```bash
python3 -c "
import urllib.parse

secret = 'YOUR_NEW_SECRET_HERE'
endpoint = 'https://portfolio-yash01rais-projects.vercel.app/api/ingest'

code = '''(async()=>{const S=\"''' + secret + '''\",E=\"''' + endpoint + '''\",c=window.getSelection().toString().trim();if(!c){alert(\"Highlight the post text first, then click the bookmark.\");return;}const h=window.location.hostname,p=h.includes(\"linkedin\")?\"linkedin\":(h.includes(\"x.com\")||h.includes(\"twitter\"))?\"x\":\"linkedin\";try{const r=await fetch(E,{method:\"POST\",mode:\"cors\",headers:{\"Content-Type\":\"application/json\",\"Authorization\":\"Bearer \"+S},body:JSON.stringify({content:c,url:window.location.href,platform:p})});const d=await r.json().catch(()=>({}));if(r.ok&&d.ok){alert(\"Saved to portfolio! \"+c.length+\" chars. Appears in ~5 min.\");}else{alert(\"Save failed: \"+(d.error||\"HTTP \"+r.status));}}catch(e){alert(\"Network error: \"+e.message);}})();'''

print('javascript:' + urllib.parse.quote(code, safe=''))
"
```

Paste the output as the new bookmark URL.
