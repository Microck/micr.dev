# AGENTS.md - Microkeebs

## Commands
- `npm run dev` - Start Vite dev server
- `npm run build` - Production build
- `npm run lint` - ESLint check
- `node src/data/extract.js` - Fetch new builds from YouTube
- `node src/data/optimize_images.js` - Generate optimized thumbnails (`_sm.webp`)
- No test framework configured

## Workflows
- **Update Builds**: Runs daily via GitHub Actions (`.github/workflows/update-builds.yml`) to fetch new content and optimize images automatically. Requires `YOUTUBE_API_KEY`, `YOUTUBE_MX_PLAYLIST_ID`, `YOUTUBE_EC_PLAYLIST_ID` secrets.

## Stack
React 19 + Vite + TypeScript + Tailwind CSS. Animations: GSAP (ScrollSmoother, ScrollTrigger), motion/react (Framer Motion).

## Code Style
- **Imports**: Named exports preferred. Path alias `@/*` → `./src/*`
- **Components**: PascalCase files in `src/components/`. Functional components only.
- **Types**: Strict TS. No `as any`, `@ts-ignore`. Types in `src/types/`
- **Styling**: Tailwind + `cn()` utility from `src/lib/utils.ts`
- **State**: React hooks + Context API (`src/contexts/`)

## Constraints (from CLAUDE.md)
- Do not remove existing logic unless instructed
- GSAP and Framer Motion must not conflict
- Browse URLs before implementing referenced components
- Implement ONE task at a time, confirm before next
- Frontend work should be delegated to `frontend-ui-ux-engineer` agent
