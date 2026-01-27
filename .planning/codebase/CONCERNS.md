# Codebase Concerns

**Analysis Date:** 2026-01-26

## Tech Debt

**Monorepo Management:**
- **Issue:** Multiple independent `package.json` files without workspaces.
- **Why:** Organic growth of separate projects.
- **Impact:** `node_modules` duplication consumes disk space/bandwidth. No shared dependency versioning (React 18 vs 19). Harder to run "lint all" or "test all".
- **Fix approach:** Migrate to npm/yarn/pnpm workspaces or use Turborepo.

**Inconsistent Stack Versions:**
- **Issue:** `anonq` uses React 18 / Tailwind 4. `microkeebs` uses React 19 / Tailwind 3.
- **Impact:** Context switching friction for developers. Potential incompatibilities if code sharing is attempted.
- **Fix approach:** Align major versions where possible (e.g., upgrade `microkeebs` to TW4 or `anonq` to React 19).

## Performance Bottlenecks

**Large Asset in Repo:**
- **File:** `resume/scene.splinecode`
- **Size:** ~83MB
- **Problem:** Slow clones, bloats git history. Slow load time for users on `resume/` site.
- **Improvement path:** Move to external CDN (Netlify Large Media, AWS S3) or use Git LFS. Optimize 3D asset if possible.

## Known Bugs / Gaps

**Mobile Experience:**
- **Issue:** `/about` and `/resume` explicitly block mobile users with a "come back on desktop" message.
- **Impact:** Poor UX, SEO penalty (mobile-first indexing).
- **Fix:** Implement fallback content (started in `website-checklist` work but reverted).

## Dependencies at Risk

**React 19 vs Helmet:**
- **Issue:** `react-helmet-async` had peer dependency conflicts with React 19 in `microkeebs`.
- **Impact:** Blocked SEO improvements for `microkeebs`.
- **Fix:** Wait for library update or use alternative head management compatible with React 19.

## Test Coverage Gaps

**Critical Missing Tests:**
- **Admin Functions:** `netlify/functions/admin-*.ts` handle sensitive logic (auth, data) but have no automated tests.
- **Frontend Logic:** No unit tests for `anonq` or `microkeebs` logic.
- **Risk:** High risk of regression during refactoring or updates.
