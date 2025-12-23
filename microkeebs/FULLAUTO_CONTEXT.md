# FULLAUTO Context - Microkeebs Admin Panel

## Current Task
Implement password-protected admin panel at `/admin` to manage builds and rankings. Changes commit to GitHub repo, triggering auto-deploy.

## Architecture Overview (from plan)
- **Auth**: Single password, JWT session, rate limiting (5 attempts/15min)
- **Routes**: /admin (login), /admin/builds, /admin/builds/:id, /admin/rankings
- **Backend**: Netlify Functions (admin-auth, admin-builds, admin-rankings, admin-upload)
- **Frontend**: React components in src/components/admin/
- **Image Processing**: Sharp for webp conversion + thumbnails
- **Persistence**: Commit changes to GitHub via Octokit

## Key Data Structures

### Build (src/types/Build.ts)
```typescript
interface KeyboardBuild {
  id: string;
  title: string;
  youtubeTitle?: string;
  category: "MX" | "EC";
  timestamp: string;
  images: string[];
  youtubeUrl: string;
  specs: { [key: string]: string | undefined; };
}
```

### Rankings (src/data/rankings.json)
```json
{
  "all": ["id1", "id2", ...],
  "look": [...],
  "sound": [...],
  "feel": [...],
  "mechanical": [...],
  "electrocapacitive": [...]
}
```

## Current State
- No Netlify Functions directory exists yet
- No react-router installed (uses hash-based routing via window.location.hash)
- Stack: React 19 + Vite + TS + Tailwind + GSAP/Framer Motion
- Dependencies needed: @netlify/functions, bcryptjs, jsonwebtoken, @octokit/rest (sharp already installed)

## Completed
- [x] Read admin panel plan
- [x] Analyzed current codebase structure
- [x] Understood data structures

## In Progress
- [ ] Create Netlify Functions structure
- [ ] Implement auth system
- [ ] Build admin UI components
- [ ] GitHub integration for commits

## Key Files
- docs/plans/2025-12-23-admin-panel.md (full plan)
- src/App.tsx (main app with hash routing)
- src/data/builds.json (build data)
- src/data/rankings.json (rankings data)
- src/types/Build.ts (type definitions)

## Environment Variables Needed
- ADMIN_PASSWORD (hashed)
- GITHUB_TOKEN (repo scope)
- GITHUB_REPO (owner/repo)
