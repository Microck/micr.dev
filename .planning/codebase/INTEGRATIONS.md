# External Integrations

**Analysis Date:** 2026-01-26

## APIs & External Services

**Authentication:**
- **Auth0:** Used in `anonq/` via `@auth0/nextjs-auth0`. Handles user login for the Q&A platform.
- **Custom JWT:** Used in `netlify/functions/` via `jsonwebtoken` and `bcryptjs`. Likely for an admin panel or secured endpoints.

**Database & Backend:**
- **Supabase:** Used in `anonq/` via `@supabase/supabase-js`. Provides database and potentially realtime features.
- **Google APIs:** Used in `microkeebs/` via `googleapis`. Likely for fetching data from Google Sheets (common for keyboard build logs).
- **GitHub API:** Used in `microkeebs/` and `netlify/functions/` via `@octokit/rest`.

**Deployment & Infrastructure:**
- **Netlify:** Primary hosting provider. Manages redirects, SSL, and serverless functions.
- **Vercel:** Referenced in redirects (e.g., `dialoguegen.vercel.app`), possibly hosting micro-services or older projects.

## Data Storage

**Databases:**
- **Supabase (PostgreSQL):** Primary relational store for `anonq`.

**File Storage:**
- **Local Assets:** `quarzite/assets`, `microkeebs/public`.
- **Large Assets:** `resume/scene.splinecode` (83MB) hosted directly in repo (Git LFS recommended but not confirmed).

## Webhooks & Callbacks

**Incoming:**
- Not explicitly detected in file scan, but likely present in `anonq/app/api/` or `netlify/functions/` if integrating with external triggers.

## Environment Configuration

**Development:**
- `.env` files required for:
  - `anonq` (Supabase keys, Auth0 secrets)
  - `microkeebs` (Google API keys)
  - `netlify/functions` (Admin secrets, GitHub tokens)

**Production:**
- Secrets managed via Netlify Dashboard Environment Variables.
