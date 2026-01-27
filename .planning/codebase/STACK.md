# Technology Stack

**Analysis Date:** 2026-01-26

## Languages

**Primary:**
- TypeScript 5.x - Used in `anonq/`, `microkeebs/`, and `netlify/functions/`
- HTML/CSS - Used in static sites (`quarzite/`, `resume/`, `about/`)

**Secondary:**
- JavaScript - Legacy scripts in `resume/` (e.g., `resume/run.js`)

## Runtime

**Environment:**
- Node.js - Required for building Next.js/Vite apps and running Netlify Functions
- Browser - Runtime for all frontend apps (Static, Next.js, React SPA)

**Package Manager:**
- npm - Used in `anonq/`, `microkeebs/`, and `netlify/functions/`
- No workspaces configured (multiple independent `package.json` files)

## Frameworks

**Core:**
- Next.js 15.5.9 - `anonq/` (App Router)
- React 18.3.1 - `anonq/`
- React 19.0.0 - `microkeebs/` (via Vite)
- Vite 5.4.2 - `microkeebs/` build tool
- Netlify Functions - Serverless backend logic

**Testing:**
- Playwright 1.57.0 - Installed in `microkeebs/` (devDependencies), but no scripts configured
- No testing framework detected for `anonq/` or `netlify/functions/`

**Build/Dev:**
- Tailwind CSS 4.x - `anonq/`
- Tailwind CSS 3.4 - `microkeebs/`
- ESLint 9.x - Linting in `anonq/` and `microkeebs/`

## Key Dependencies

**Critical:**
- `@supabase/supabase-js` - `anonq/` database client
- `@auth0/nextjs-auth0` - `anonq/` authentication
- `three` / `@react-three/fiber` - `microkeebs/` 3D rendering
- `spline-runtime` - `resume/` 3D scene (loaded via script)

**Infrastructure:**
- `@netlify/functions` - Serverless handler definitions
- `googleapis` - Used in `microkeebs/` (likely for spreadsheet/data integration)
- `@octokit/rest` - Used in `microkeebs/` and `netlify/functions/` (GitHub integration)

## Configuration

**Environment:**
- `.env` files implied (referenced in code/deps)
- `netlify.toml` - Global deployment configuration, redirects, and headers

**Build:**
- `next.config.js` - `anonq/` configuration
- `vite.config.ts` - `microkeebs/` configuration
- `tsconfig.json` - Present in each TypeScript project root

## Platform Requirements

**Development:**
- Node.js (Latest LTS recommended)
- npm

**Production:**
- Netlify - Primary hosting platform (configured via `netlify.toml`)
- Vercel - Referenced in redirects (e.g., `dialoguegen.vercel.app`) but not primary host for this repo
