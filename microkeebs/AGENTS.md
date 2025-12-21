# AGENTS.md - Microkeebs

## Commands
- `npm run dev` - Start Vite dev server
- `npm run build` - Production build
- `npm run lint` - ESLint check
- No test framework configured

## Stack
React 19 + Vite + TypeScript + Tailwind CSS. Animations: GSAP, Framer Motion, Lenis.

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
