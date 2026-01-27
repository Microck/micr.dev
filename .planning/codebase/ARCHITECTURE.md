# Architecture

**Analysis Date:** 2026-01-26

## Pattern Overview

**Overall:** Monorepo of independent frontend applications
**Type:** Multi-App Static & Serverless Hybrid

**Key Characteristics:**
- **Routing-driven:** `netlify.toml` acts as the API Gateway/Router, directing traffic to different sub-projects based on URL paths.
- **Heterogeneous:** Mix of Static HTML, Next.js (SSR/ISR), and Vite (SPA) architectures.
- **Serverless Backend:** Shared logic lives in `netlify/functions/`, decoupled from frontend apps.

## Layers

**Edge Layer (Netlify):**
- Purpose: Routing, Redirects, Security Headers
- Config: `netlify.toml`
- Responsibilities: 
  - Routing `/anonq` -> Next.js app
  - Routing `/microkeebs` -> Vite app
  - Serving static assets for `quarzite`, `resume`
  - Enforcing CSP and HSTS headers

**Application Layer:**
- **AnonQ (`anonq/`):** Next.js App Router application. Server-side rendering and API routes.
- **Microkeebs (`microkeebs/`):** Vite-based React SPA. Client-side rendering.
- **Static Sites (`quarzite/`, `resume/`, `about/`):** Plain HTML/CSS/JS served directly.

**Service Layer (`netlify/functions/`):**
- Purpose: Admin functionality and secure operations
- Contains: `admin-auth.ts`, `admin-builds.ts`, `admin-rankings.ts`
- capabilities: Auth verification, data manipulation, external API proxying

## Data Flow

**AnonQ Request:**
1. User hits `/anonq`
2. Netlify rewrites to `anonqmicr.netlify.app` (proxy)
3. Next.js handles request, connects to Supabase/Auth0
4. Content returned to user

**Microkeebs Request:**
1. User hits `/microkeebs`
2. Netlify serves `microkeebs/dist/index.html`
3. React app hydrates, fetches data from `googleapis` or Netlify Functions
4. 3D content rendered via Three.js

**Admin Actions:**
1. Admin triggers function (e.g., `/api/admin-builds`)
2. Netlify Function executes (`netlify/functions/admin-builds.ts`)
3. Function verifies JWT/Auth
4. Function calls GitHub API or Database
5. JSON response returned

## Key Abstractions

**Projects:**
- Each directory in root is effectively an isolated project with its own build chain.
- No shared UI library (Tailwind used independently).

**Redirects:**
- Heavy use of `[[redirects]]` in `netlify.toml` to map "virtual" paths to external URLs (socials) or internal apps.

## Entry Points

**Global Entry:**
- `netlify.toml` - The router for the entire domain.

**App Entries:**
- `anonq/package.json` (`next start`)
- `microkeebs/package.json` (`vite`)
- `netlify/functions/package.json` (Serverless functions)

## Error Handling

**Strategy:** Decentralized. Each app handles its own errors.
- `anonq`: Next.js error boundaries.
- `microkeebs`: React error boundaries (implied).
- `netlify/functions`: Try/catch blocks returning HTTP error codes.

## Cross-Cutting Concerns

**Deployment:**
- Unified via Netlify. `netlify.toml` defines the build command sequence: `cd netlify/functions && npm install && cd ../../microkeebs && npm install && npm run build`.

**Security:**
- Global headers defined in `netlify.toml` (CSP, X-Frame-Options).
- Independent auth implementations (Auth0 for AnonQ, Custom JWT for Admin functions).
