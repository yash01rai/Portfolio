# Graph Report - .  (2026-04-28)

## Corpus Check
- Corpus is ~49,727 words - fits in a single context window. You may not need a graph.

## Summary
- 127 nodes · 107 edges · 14 communities detected
- Extraction: 87% EXTRACTED · 13% INFERRED · 0% AMBIGUOUS · INFERRED: 14 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Portfolio App Shell|Portfolio App Shell]]
- [[_COMMUNITY_Career Experience & Skills|Career Experience & Skills]]
- [[_COMMUNITY_UI Tech Stack|UI Tech Stack]]
- [[_COMMUNITY_Social Feed API & CMS|Social Feed API & CMS]]
- [[_COMMUNITY_Portfolio Projects & Identity|Portfolio Projects & Identity]]
- [[_COMMUNITY_Bookmarklet Scraper|Bookmarklet Scraper]]
- [[_COMMUNITY_App Entry & Fonts|App Entry & Fonts]]
- [[_COMMUNITY_GSAP Scroll Animations|GSAP Scroll Animations]]
- [[_COMMUNITY_Ingest API Handler|Ingest API Handler]]
- [[_COMMUNITY_Notion Feed Hooks|Notion Feed Hooks]]
- [[_COMMUNITY_Visual Brand Assets|Visual Brand Assets]]
- [[_COMMUNITY_Tech Stack Logos|Tech Stack Logos]]
- [[_COMMUNITY_Graphify Rules (AGENTS.md)|Graphify Rules (AGENTS.md)]]
- [[_COMMUNITY_Resume Section Prototype|Resume Section Prototype]]

## God Nodes (most connected - your core abstractions)
1. `App.tsx — Section Order` - 8 edges
2. `Portfolio Tech Stack` - 7 edges
3. `Yash Rai — Resume / Identity` - 5 edges
4. `Bookmarklet README — Save to Portfolio` - 5 edges
5. `index.html — App Entry Point` - 4 edges
6. `Livspace — SDE 2 Role` - 4 edges
7. `public/save.html — Popup Relay Page` - 4 edges
8. `ExperienceSection Component (Prototype)` - 4 edges
9. `Yash Rai LinkedIn Profile Photo` - 4 edges
10. `handler()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `useReveal Hook (IntersectionObserver)` --semantically_similar_to--> `Framer Motion`  [INFERRED] [semantically similar]
  Portfolio New Sections Suggestion.html → CLAUDE.md
- `Portfolio Avatar Photo` --semantically_similar_to--> `Yash Rai LinkedIn Profile Photo`  [INFERRED] [semantically similar]
  public/avatar.jpg → Yash Rai LinkedinPhoto.jpeg
- `Yash Rai LinkedIn Profile Photo` --semantically_similar_to--> `Yash Rai Casual Photo (Reading)`  [INFERRED] [semantically similar]
  Yash Rai LinkedinPhoto.jpeg → Yash Rai Photo.jpg
- `Portfolio Avatar Photo` --semantically_similar_to--> `Yash Rai Casual Photo (Reading)`  [INFERRED] [semantically similar]
  public/avatar.jpg → Yash Rai Photo.jpg
- `Portfolio Favicon — Purple Lightning-bolt / Stack Icon` --semantically_similar_to--> `Hero Section Decorative Illustration — Isometric Layered Panels`  [INFERRED] [semantically similar]
  public/favicon.svg → src/assets/hero.png

## Hyperedges (group relationships)
- **Dynamic Social Feed Ingestion Pipeline** — bookmarklet_api_ingest, bookmarklet_notion_db, bookmarklet_api_social_posts, claude_md_social_feed [EXTRACTED 0.95]
- **Explorations Visual Playground GSAP Architecture** — claude_md_explorations, claude_md_gsap_pin_layer, claude_md_gsap_parallax_layer, claude_md_quick_setter [EXTRACTED 1.00]
- **Portfolio Section Component Hierarchy** — claude_md_app_tsx, claude_md_hero, claude_md_social_feed, claude_md_explorations, claude_md_footer [EXTRACTED 1.00]
- **Yash Rai Personal Identity Visual Assets** — yash_linkedin_photo, yash_casual_photo, public_avatar_jpg [INFERRED 0.92]
- **Portfolio Project Showcase Screenshots** — promptu_screenshot, tourwithyash_screenshot, hero_png [INFERRED 0.80]
- **Portfolio Tech Stack Brand Assets** — vite_svg, react_svg, public_favicon_svg [INFERRED 0.82]

## Communities

### Community 0 - "Portfolio App Shell"
Cohesion: 0.18
Nodes (11): App.tsx — Section Order, Footer.tsx Component, Framer Motion, Hero.tsx Component, LoadingScreen.tsx Component, Navbar.tsx Component, SelectedWorks.tsx Component, SocialFeed.tsx Component (+3 more)

### Community 1 - "Career Experience & Skills"
Cohesion: 0.39
Nodes (9): ExperienceSection Component (Prototype), Aionos (Indigo) — Software Engineer Role, Livspace — SDE 2 Role, LLM-Augmented Development Workflows, Micro Frontends (Module Federation), Skillgigs — Software Developer Role, Frontend Architecture Skills, Wipro — Software Developer Role (+1 more)

### Community 2 - "UI Tech Stack"
Cohesion: 0.32
Nodes (8): Lucide React Icons, React 18, Portfolio Tech Stack, Tailwind CSS (custom tokens), Tailwind CSS Custom Tokens, TypeScript, Vite Build Tool, README — React + TypeScript + Vite Template

### Community 4 - "Social Feed API & CMS"
Cohesion: 0.48
Nodes (7): /api/ingest Endpoint, /api/social-posts Endpoint (5min cache), INGEST_SECRET Auth Token, Notion Database (CMS Backend), Bookmarklet README — Save to Portfolio, Save Page Query Params (c, u, p, lk, cm, sh, at), public/save.html — Popup Relay Page

### Community 5 - "Portfolio Projects & Identity"
Cohesion: 0.33
Nodes (7): Promptu — Chrome Extension for AI Prompt Management, Promptu Chrome Extension — Chrome Web Store Screenshot, Portfolio Avatar Photo, TourWithYash — Tour Booking Web Application, TourWithYash Web App — Tour Listing UI Screenshot, Yash Rai Casual Photo (Reading), Yash Rai LinkedIn Profile Photo

### Community 6 - "Bookmarklet Scraper"
Cohesion: 0.6
Nodes (4): parseCount(), relativeToDate(), scrapeCount(), scrapePostedAt()

### Community 7 - "App Entry & Fonts"
Cohesion: 0.4
Nodes (5): index.html — App Entry Point, Instrument Serif Font (Google Fonts), Inter Font (Google Fonts), src/main.tsx Module Entry, #root Mount Point

### Community 8 - "GSAP Scroll Animations"
Cohesion: 0.5
Nodes (5): Explorations.tsx — Visual Playground, GSAP + ScrollTrigger, GSAP Parallax Columns (Layer 2), GSAP Pinned Title Card (Layer 1), gsap.quickSetter Pattern

### Community 9 - "Ingest API Handler"
Cohesion: 0.83
Nodes (3): handler(), safeEqual(), setCors()

### Community 10 - "Notion Feed Hooks"
Cohesion: 0.83
Nodes (3): useNotionFeed(), useNotionLinkedInFeed(), useNotionXFeed()

### Community 12 - "Visual Brand Assets"
Cohesion: 0.67
Nodes (3): Hero Section Decorative Illustration — Isometric Layered Panels, Portfolio Favicon — Purple Lightning-bolt / Stack Icon, Social & UI Icon Sprite (Bluesky, Discord, GitHub, X, Social, Documentation)

### Community 29 - "Tech Stack Logos"
Cohesion: 1.0
Nodes (2): React Logo SVG (framework brand asset), Vite Logo SVG (build tool brand asset)

### Community 43 - "Graphify Rules (AGENTS.md)"
Cohesion: 1.0
Nodes (1): AGENTS.md — Graphify Knowledge Graph Rules

### Community 44 - "Resume Section Prototype"
Cohesion: 1.0
Nodes (1): ResumeSection Component (Prototype)

## Knowledge Gaps
- **21 isolated node(s):** `#root Mount Point`, `src/main.tsx Module Entry`, `Inter Font (Google Fonts)`, `Lucide React Icons`, `Hero.tsx Component` (+16 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Tech Stack Logos`** (2 nodes): `React Logo SVG (framework brand asset)`, `Vite Logo SVG (build tool brand asset)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Graphify Rules (AGENTS.md)`** (1 nodes): `AGENTS.md — Graphify Knowledge Graph Rules`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Resume Section Prototype`** (1 nodes): `ResumeSection Component (Prototype)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `App.tsx — Section Order` connect `Portfolio App Shell` to `GSAP Scroll Animations`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Why does `Portfolio Tech Stack` connect `UI Tech Stack` to `GSAP Scroll Animations`, `Portfolio App Shell`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **Why does `Framer Motion` connect `Portfolio App Shell` to `UI Tech Stack`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **What connects `#root Mount Point`, `src/main.tsx Module Entry`, `Inter Font (Google Fonts)` to the rest of the system?**
  _21 weakly-connected nodes found - possible documentation gaps or missing edges._