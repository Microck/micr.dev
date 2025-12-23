# Image Optimization & Automation Design

## Goal
Improve gallery page performance by loading optimized, smaller thumbnails (`_sm.webp`) instead of full-resolution images. Automate the entire content pipeline (fetching new builds from YouTube + optimizing images) via GitHub Actions.

## Strategy

### 1. Image Optimization Script (`src/data/optimize_images.js`)
A new Node.js script that:
- Scans `public/images/**/*.webp` (and `.jpg`)
- Identifies images missing a `_sm` counterpart
- Generates a resized `_sm.webp` version (400px width) using `sharp`
- Skips already optimized images (incremental build)

### 2. Frontend Updates
- Update `BuildCard.tsx` to prefer `_sm.webp` images for the cover
- Implement fallback logic: if `_sm` fails to load, try original
- Keep `BuildDetail.tsx` using high-quality originals

### 3. GitHub Actions Workflow (`.github/workflows/update-builds.yml`)
A workflow that runs on schedule (e.g., daily) or manually:
- Checks out code
- Sets up Node.js
- Runs `npm ci`
- Runs `node src/data/extract.js` (fetches new YouTube builds)
- Runs `node src/data/optimize_images.js` (generates thumbnails)
- Commits and pushes changes back to `main` if any new files were created

## Implementation Steps

1.  **Dependencies**: Install `sharp` (for image resizing)
2.  **Script**: Create `src/data/optimize_images.js`
3.  **Frontend**: Modify `BuildCard.tsx` to use optimized images
4.  **Workflow**: Create `.github/workflows/update-builds.yml`
5.  **Docs**: Update `AGENTS.md` with new workflow info

## Validation
- [ ] Script generates `_sm.webp` files locally
- [ ] Gallery loads significantly faster (network tab check)
- [ ] Build detail still loads high-res
- [ ] GitHub Action runs successfully (simulated/verified)
