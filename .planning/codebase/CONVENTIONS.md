# Coding Conventions

**Analysis Date:** 2026-01-26

## Naming Patterns

**Files:**
- **React Components:** `PascalCase.tsx` (standard React convention).
- **Utilities/Functions:** `kebab-case.ts` (e.g., `admin-auth.ts`, `image.ts`).
- **Config:** `kebab-case.config.js` or `ts` (e.g., `vite.config.ts`, `next.config.js`).

**Directories:**
- **Projects:** `kebab-case` (short, lowercase names like `anonq`, `microkeebs`).
- **Standard structures:** `src/`, `app/`, `lib/`, `components/`, `assets/`.

## Code Style

**Formatting:**
- **Prettier:** Used in `anonq` and `microkeebs` (`eslint-plugin-prettier` implied or configured).
- **Indentation:** 2 spaces (standard JS/TS).
- **Semicolons:** Required (standard).

**Linting:**
- **ESLint:** Configured in `anonq` (`eslint-config-next`) and `microkeebs`.
- **Rules:** Likely standard React/Next.js recommended presets.

## Import Organization

**Patterns:**
- Imports likely grouped by External -> Internal -> Relative.
- Path aliases:
  - `@/*` commonly used in Next.js (`anonq`) and Vite (`microkeebs`) to map to `src/` or `app/`.

## CSS / Styling

**Tailwind CSS:**
- Dominant styling strategy.
- `anonq` uses Tailwind v4.
- `microkeebs` uses Tailwind v3.
- Class sorting via `prettier-plugin-tailwindcss` (common, though not explicitly verified in `package.json`).

## Module Design

**Functions:**
- `netlify/functions` uses modular `lib/` structure (`auth.ts`, `github.ts`) to keep handler files clean.
- Named exports preferred for utilities.
- Default exports for React components and Next.js pages.
