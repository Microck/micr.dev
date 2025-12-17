# AGENTS.md

## Commands
- `npm run dev` - Start development server
- `npm run build` - Production build
- `npm run start` - Start production server
- No test framework configured

## Stack
Next.js 15, React 18, TypeScript (strict), Tailwind CSS, base-ui-components

## Code Style
- KISS, YAGNI, DRY. No emojis.
- Imports: Use `@/` alias for project imports (maps to root)
- Types: Explicit interfaces in `lib/types.ts`, strict mode enabled
- Components: Client components use `'use client'` directive at top
- Naming: PascalCase components, camelCase functions/variables
- Error handling: Try/catch with typed responses, empty catch blocks OK for optional operations
- UI: Use existing components from `components/ui/`, cn() for class merging

## Patterns
- API routes in `app/api/` using NextRequest/NextResponse
- Client components in `components/` with `*Client.tsx` suffix for pages
- Services in `lib/services/`, data access in `lib/data/`
- Use cva() for component variants (class-variance-authority)

## Rules from CLAUDE.md
- Batch related edits together
- Delegate shell commands, web search, browser automation, security audits, code review via gemini CLI
