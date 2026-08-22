# DECK-PLAN.md — deck app build reference

**Scope:** how the deck at `deck/` works and how to change it. The *content* (framing, narration,
claims) lives in [`PITCH.md`](PITCH.md) — this file is mechanics and design language only.

## Where things are

- App: `deck/` — Next.js 16, Tailwind 4, `motion`, `@number-flow/react`. No cloud calls.
- Slides render at `/` (arrow keys / space advance; `#n` deep-links). Narration UI at `/script`.
- Narration source of truth: `deck/src/lib/slides.ts` — the `/script` page renders it; never
  hand-edit the page.
- Scenes: `deck/src/components/deck/` — `deck.tsx` (shell + scene groups), `primitives.tsx`
  (EASE, useStages, useTypewriter, GiantWord, Panel), `marks.tsx` (Callout chips, crosshairs,
  rulers, reg marks), `act1–4.tsx` (scenes).

## Design language — "SLEEPER" (GRMNT reference)

- Warm paper `#E9E7E2`, ink `#141412`, hairlines; static grain + vignette (no motion in the canvas).
- Display: Anton. Labels: Space Grotesk. Annotation/mono: IBM Plex Mono (`mark-label` utility).
- **Tan `#A9683C` is reserved for human action only** — the color rule is the Art 18(3) argument.
- Annotation chips (dark, typed-on, leader lines with square terminals), instrument marks,
  registration corners.
- Giant act-words behind subjects exist behind a flag — `SHOW_ACT_WORDS` in `primitives.tsx`,
  currently **off** (Victor: too distracting).
- One easing everywhere: `[0.19, 1, 0.22, 1]`. Builds share a scene group — a keypress changes a
  prop, never remounts (see `GROUP` in `deck.tsx`).

## Deploy

- Public URL (BuilderBase submission): **https://zhangv25.github.io/gb10hack/** (+ `/script/`).
- GitHub Pages from the `gh-pages` branch. Redeploy:
  ```bash
  cd deck && PAGES_BASE=/gb10hack npm run build && touch out/.nojekyll
  # push out/ to gh-pages (orphan commit, force push)
  ```
- Local: `cd deck && npm run build && npx next start -p 3999` (plain build, no PAGES_BASE).
- Pages CDN caches ~10 min; verify with a `?v=` cache-buster.
- Headless screenshots on this Mac: use Playwright with `--no-proxy-server` and `127.0.0.1`
  (Zscaler intercepts localhost in headless Chrome).
