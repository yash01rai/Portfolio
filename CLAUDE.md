# Portfolio — CLAUDE.md

## Stack
- React 18 + TypeScript + Vite
- Tailwind CSS (custom tokens via CSS vars: `bg-bg`, `text-primary`, `stroke`, `muted`, `surface`)
- GSAP + ScrollTrigger for all scroll animations
- Framer Motion for simple `whileInView` transitions (non-scroll-pinned sections)
- Lucide React for icons

## Deployment — AUTOMATIC (Git-connected)

**This Vercel project IS connected to GitHub (as of 18 Aug 2026).** Pushing to
`main` triggers a production deploy to yashrai.in; opening a PR gets a preview
URL. Nothing manual is required.

`npx vercel --prod --yes` still works and is the fallback if the integration is
ever disconnected, but it is no longer the normal path.

Env vars (`NOTION_TOKEN`, `NOTION_DATABASE_ID`, `INGEST_SECRET`) live in Vercel
project settings and are injected into git-triggered builds automatically.

Deploys take ~20s. A push does not mean the change is live yet — confirm the
build finished before claiming it landed:

```bash
npx vercel ls portfolio   # top row should read ● Ready, not ● Building
```

Then verify the bytes by comparing the live `etag` (which is the file's MD5)
against the local file:

```bash
curl -sI https://yashrai.in/<file> | grep -i 'etag\|content-length'
md5 -q <local-file>
```

Note this only works for files copied verbatim out of `public/`. Vite rewrites
`index.html` and hashes JS/CSS at build time, so for those grep the live HTML
for the expected content instead of comparing hashes.

### Static assets
Only files under `public/` are copied into `dist/`. A file elsewhere in the repo
— including the repo root — is never served, no matter what it's named. The
resume ships as `public/YashRai_Resume.pdf` (→ `yashrai.in/YashRai_Resume.pdf`).

## Project Structure
```
src/
  App.tsx                  # Section order: Hero → SocialFeed → Experience → SelectedWorks → Explorations → Stats → Resume → Footer
  components/
    Explorations.tsx        # Visual Playground — GSAP pin + parallax (most complex)
    SelectedWorks.tsx       # Framer Motion whileInView only
    Experience.tsx
    SocialFeed.tsx
    Stats.tsx
    Resume.tsx
    Hero.tsx
    Footer.tsx
    Navbar.tsx
    LoadingScreen.tsx
    experiments/            # Canvas animation components (ParticleConstellation, FluidGradient, etc.)
    ui/
```

## Explorations (Visual Playground) — Architecture

The most complex component. Two layers:

**Layer 1 — Pinned title card (z-30)**
- `h-screen` div, pinned via `ScrollTrigger.create({ pin, pinSpacing: false })`
- Pin: `start: "top top"`, `end: "bottom top"` — covers the FULL section (280vh)
- Opacity controlled by a separate `onUpdate` ScrollTrigger (range: `"top center"` → `"bottom top"` = 330vh total)
- Uses `gsap.quickSetter` for frame-perfect opacity — NO scrub lag, NO y-transform, NO competing tweens
- Progress curve: invisible 0→0.15, fade-in 0.15→0.22, hold 0.22→0.88, fade-out 0.88→0.94, invisible 0.94→1.0

**Layer 2 — Parallax columns (z-10, behind title)**
- Two absolute-positioned columns, `start: "top bottom"`, `end: "bottom top"`, `scrub: true`
- Col1: `pt-[50vh] pb-[40vh] gap-32 md:gap-64`, `yPercent: -25`
- Col2: `pt-[110vh] pb-[40vh] gap-32 md:gap-64`, `yPercent: -10`
- Section: `min-h-[280vh]`

**Critical rules:**
- Always use `gsap.context()` with `ctx.revert()` cleanup in every `useEffect`
- Never use two separate scrub tweens animating the same property — use a single timeline or `onUpdate`
- Never animate `y` on a pinned element (`position: fixed` + transform causes visible jumps)
- `pinSpacing: false` means no extra scroll height is added; section height drives scroll distance
- `"bottom bottom"` ≠ `"bottom top"`: bottom-bottom fires 100vh before bottom-top — always pin to `"bottom top"` to cover the full section

## GSAP Conventions
- All scroll animations wrapped in `gsap.context(() => { ... }, ref)` inside `useEffect`
- `scrub: true` for parallax (instant, no lag)
- `onUpdate` + `gsap.quickSetter` for frame-sensitive single-property control
- `ScrollTrigger.create` for pin, separate `ScrollTrigger.create` for opacity tracking

## Tailwind Tokens
Defined as CSS variables in global CSS:
- `bg-bg` — page background
- `bg-surface` — card/surface background
- `text-primary` / `text-muted`
- `border-stroke` — default border color
- `accent-gradient` — gradient class for hover accents
- `font-display` — Instrument Serif italic (used for decorative headings)

## graphify

A knowledge graph of this codebase lives in `graphify-out/graph.json` (if it exists).

**Before answering questions about architecture, dependencies, or how components connect:** check the graph first with `/graphify query "<question>"`. It contains extracted relationships (calls, imports, references) and inferred connections that are faster to traverse than re-reading files.

**After making code changes:** if `graphify-out/graph.json` exists, rebuild it with `/graphify . --update` so the graph stays current. Code-only changes are free (AST only, no LLM).

**To build the graph for the first time:** run `/graphify .` from the project root.

Graph outputs:
- `graphify-out/graph.html` — interactive visualization, open in browser
- `graphify-out/GRAPH_REPORT.md` — audit report with god nodes, surprising connections, suggested questions
- `graphify-out/graph.json` — raw graph data for queries
