# Website Launch Checklist

## Basics
- [x] Favicon (Consistent across all directories)
- [x] Web app manifest (Added for `/microkeebs`, exists in Root and `/anonq`)
- [x] Theme color meta tag (Added to `/microkeebs`, `/about`, `/resume`)
- [x] robots.txt
- [x] sitemap.xml
- [x] humans.txt (Created)
- [x] .well-known/security.txt (Created)

## Performance
- [x] Loading skeletons or spinners (Implemented in root 3D loader)
- [x] Lazy loading for images/iframes (Detected in `/quarzite`, native lazy loading in `tree/index.html` not explicitly checked but improved alt tags)
- [x] Code splitting (Handled by Next.js in `/anonq` and Vite in `/microkeebs`)
- [x] Minified CSS/JS (Handled by build pipelines)
- [ ] Gzip/Brotli compression (Check Netlify dashboard settings)
- [ ] CDN for static assets (Check Netlify dashboard settings)
- [ ] Cache headers (Cache-Control, ETag) (Security headers added, but asset caching needs dashboard config)
- [x] Preload critical resources (Detected in `/about` and `/tree`)
- [ ] DNS prefetch/preconnect
- [ ] Image optimization (WebP, srcset) (Detected script in `/microkeebs`, needs review elsewhere)
- [x] Font loading strategy (Preloading in `/about` and `/tree`)
- [ ] Critical CSS inlined

## SEO
- [x] Unique title tags per page (Verified in Root, `/about`, `/quarzite`, `/tree`)
- [x] Meta description (Verified in Root, `/about`, `/quarzite`)
- [x] Canonical URLs (Verified in Root)
- [x] Open Graph tags (Verified in Root)
- [x] Twitter Card tags (Verified in Root)
- [x] Structured data (JSON-LD) (Verified in Root)
- [x] Semantic HTML (Verified in Root and `/quarzite`)
- [x] Alt text for images (Improved in `/tree`, exists in `/about` and `/quarzite`)
- [ ] Hreflang for multilingual (N/A - English only)

## Accessibility
- [x] ARIA labels and roles (Strong in `/quarzite`, present in `/about`)
- [ ] Keyboard navigation support
- [ ] Visible focus indicators
- [ ] Color contrast (WCAG AA+)
- [ ] Screen reader testing
- [ ] Skip links
- [ ] Associated form labels
- [ ] ARIA-live for dynamic errors

## Security
- [x] HTTPS enforced (Managed by Netlify)
- [x] HSTS header (Added to `netlify.toml`)
- [x] Content Security Policy (Added to `netlify.toml`)
- [x] X-Frame-Options / frame-ancestors (Added to `netlify.toml`)
- [x] X-Content-Type-Options (Added to `netlify.toml`)
- [x] Referrer-Policy (Added to `netlify.toml`)
- [x] Permissions-Policy (Added to `netlify.toml`)
- [ ] Secure cookies (HttpOnly, SameSite) (Verify in `/anonq` Auth0/Supabase)
- [ ] CSRF tokens (Verify in `/anonq`)
- [ ] Rate limiting (Verify in `/anonq` API routes)
- [ ] Input validation/sanitization (Verify in `/anonq`)

## UI/UX
- [x] Responsive design (Verified in `/anonq`, `/microkeebs`, `/quarzite`. Note: `/about` blocks mobile)
- [ ] Touch targets ≥44×44 px
- [x] Loading states (Verified in Root and `/microkeebs`)
- [ ] Custom 404/500 pages (Detected `/anonq/app/not-found.tsx`, Root is index-only)
- [ ] Offline page (if PWA)
- [ ] Print styles
- [ ] Dark mode support (Detected in `/microkeebs`)
- [x] Consistent navigation
- [ ] Breadcrumbs (N/A)
- [ ] Back-to-top button

## Legal & Privacy
- [x] Privacy policy (Detected in `/quarzite/jspaint/privacy.html`)
- [ ] Terms of service
- [ ] Cookie consent banner (Required for `/anonq`)
- [ ] GDPR/CCPA compliance
- [ ] Data deletion process (Required for `/anonq`)
- [ ] Contact information
- [x] Copyright notice (Verified in Root and README)

## Development & Deployment
- [x] Environment variables documented (Verified in `/anonq/.env.example`)
- [x] CI/CD pipeline (Verified in `.github/workflows/update-builds.yml` and Netlify integration)
- [ ] Automated tests (unit, e2e) (Detected Playwright in `/microkeebs` but no tests found)
- [x] Linting (ESLint, Prettier) (Verified in `/anonq` and `/microkeebs`)
- [x] Build pipeline (Vite/Next.js/Netlify)
- [x] Source maps (development)
- [ ] Error tracking (e.g., Sentry)
- [ ] Analytics (privacy-friendly if required)
- [ ] Uptime monitoring
- [ ] Backup strategy
- [ ] Rollback plan
