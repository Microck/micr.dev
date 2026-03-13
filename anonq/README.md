# AnonQ

Anonymous Q&A platform. Visitors ask questions anonymously, admin answers publicly.

## Stack

Next.js 15, React 18, TypeScript, Tailwind CSS, Auth0, Supabase

## Setup

```bash
npm install
cp .env.example .env
# Configure .env with Auth0 credentials
npm run dev
```

## Auth0 Configuration

Create an Auth0 application, then set:

| Field | Value |
|-------|-------|
| Allowed Callback URLs | `https://anonq.micr.dev/api/auth/callback` |
| Allowed Logout URLs | `https://anonq.micr.dev` |
| Allowed Web Origins | `https://anonq.micr.dev` |
| Application Login URI | `https://anonq.micr.dev` |

For local dev, add `http://localhost:3000` equivalents.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `AUTH0_SECRET` | Yes | `openssl rand -hex 32` |
| `AUTH0_DOMAIN` | Yes | Auth0 tenant domain |
| `AUTH0_CLIENT_ID` | Yes | Auth0 app client ID |
| `AUTH0_CLIENT_SECRET` | Yes | Auth0 app client secret |
| `APP_BASE_URL` | Yes | App URL (e.g., `https://anonq.micr.dev`) |
| `NEXT_PUBLIC_SITE_URL` | No | Public canonical site URL for metadata (defaults to `APP_BASE_URL`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon/public key |
| `ALLOWED_ADMIN_EMAILS` | No | Comma-separated admin emails |
| `OPENAI_API_KEY` | No | For grammar correction |
| `NTFY_URL` | No | Push notifications |

## Scripts

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run start` - Production server
