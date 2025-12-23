# Admin Panel Design

## Goal
Create a password-protected admin panel at `/admin` to manage builds and rankings without touching code directly. Changes commit to GitHub repo, triggering auto-deploy.

## Requirements Summary
- **Access**: Hidden route `/admin`, single password auth
- **Security**: Rate limiting, brute-force protection
- **Editable content**: 
  - Builds (images + metadata: title, specs, etc.)
  - Rankings
- **Image handling**: Upload/paste images, optimize on upload (sharp), rename by order (`thumbnail.webp`, `1.webp`, `2.webp`, etc.)
- **Persistence**: Commit changes to GitHub repo via API

## Architecture

### Authentication
- Password stored as env var `ADMIN_PASSWORD`
- Rate limiting: 5 attempts per 15 minutes per IP
- Lockout after failed attempts
- Session token (JWT or simple signed cookie) after successful login

### Routes
```
/admin              → Login page (if not authenticated)
/admin/builds       → List all builds, click to edit
/admin/builds/:id   → Edit single build (metadata + images)
/admin/rankings     → Edit rankings.json
```

### Tech Stack
- React components in `src/components/admin/`
- API routes via Netlify Functions (`netlify/functions/`)
  - `admin-auth.ts` — Login, verify session
  - `admin-builds.ts` — CRUD for builds.json
  - `admin-rankings.ts` — CRUD for rankings.json
  - `admin-upload.ts` — Image upload, optimize, commit to GitHub

### Image Upload Flow
1. User uploads/pastes image
2. Client sends to `admin-upload` function
3. Function:
   - Validates image
   - Resizes/converts to webp via sharp
   - Generates `_sm.webp` thumbnail
   - Commits both to GitHub repo (`public/images/{buildId}/`)
   - Returns new image path
4. Client updates build's images array
5. On save, commits updated `builds.json`

### Image Naming Convention
- First image: `thumbnail.webp` + `thumbnail_sm.webp`
- Additional: `1.webp` + `1_sm.webp`, `2.webp` + `2_sm.webp`, etc.
- Reordering renames files accordingly

### Security Measures
- Rate limiting on login endpoint (5 attempts / 15 min)
- Password hashed comparison (bcrypt)
- CORS restricted to same origin
- GitHub token scoped to repo only
- Input sanitization on all fields
- Max file size limit (10MB)

### Environment Variables (Netlify)
```
ADMIN_PASSWORD=<hashed-password>
GITHUB_TOKEN=<personal-access-token-with-repo-scope>
GITHUB_REPO=<owner/repo>
```

## UI Components

### Login Page
- Simple password input
- Rate limit warning after 3 failed attempts
- Error messages for invalid password

### Builds List
- Grid/list of all builds
- Search/filter by title
- Click to edit

### Build Editor
- Title input
- Category dropdown (MX/EC)
- Specs key-value editor (add/remove/edit)
- Image gallery:
  - Drag to reorder
  - Click to delete
  - Upload button / paste support
  - Preview with thumbnail

### Rankings Editor
- Editable list matching `rankings.json` structure

## Implementation Steps

1. **Setup Netlify Functions**
   - Install dependencies: `@netlify/functions`, `bcryptjs`, `jsonwebtoken`, `sharp`, `@octokit/rest`
   - Create function stubs

2. **Auth System**
   - Login function with rate limiting
   - Session verification middleware
   - Protected route wrapper component

3. **Admin UI**
   - Login page
   - Builds list page
   - Build editor page
   - Rankings editor page

4. **GitHub Integration**
   - Octokit setup for commits
   - Image upload + commit flow
   - JSON file update + commit flow

5. **Image Processing**
   - Sharp integration in serverless function
   - Optimize + generate thumbnails
   - Handle reordering/renaming

6. **Testing & Security Audit**
   - Test rate limiting
   - Test auth bypass attempts
   - Verify GitHub commits work

## Files to Create
```
netlify/functions/
  admin-auth.ts
  admin-builds.ts
  admin-rankings.ts
  admin-upload.ts
  lib/
    auth.ts         (rate limiting, session management)
    github.ts       (Octokit wrapper)
    image.ts        (sharp processing)

src/components/admin/
  AdminLogin.tsx
  AdminLayout.tsx
  BuildsList.tsx
  BuildEditor.tsx
  RankingsEditor.tsx
  ImageUploader.tsx
  ImageGallery.tsx

src/pages/
  Admin.tsx         (router for admin routes)
```

## Open Questions
- Should rankings have a specific structure to follow? Need to check `rankings.json` format.
- Max number of images per build?
- Should deleted images be removed from GitHub or just from builds.json?
