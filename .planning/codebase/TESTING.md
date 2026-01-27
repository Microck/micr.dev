# Testing Patterns

**Analysis Date:** 2026-01-26

## Test Framework

**Status:** Minimal / Non-existent.

**Runners:**
- **Playwright:** Listed in `microkeebs/package.json` (`devDependencies`), but no `test` script is configured.
- **None:** No test runner found for `anonq` or `netlify/functions`.

**Run Commands:**
- `anonq`: `npm run test` echoes error and exits.
- `microkeebs`: No `test` script.

## Test File Organization

**Missing:**
- No `__tests__` directories found in top-level scan.
- No `*.test.ts` or `*.spec.ts` files prominent in file listings.

## Coverage

**Current State:**
- 0% coverage enforcement.
- Testing appears to be manual verification.

## Recommendations

1.  **Initialize Testing:**
    - Add `vitest` for unit testing logic in `netlify/functions` and `microkeebs`.
    - Configure `playwright` scripts in `microkeebs` since the dependency exists.
    - Add `jest` or `vitest` for `anonq`.

2.  **CI Integration:**
    - Add `npm test` step to Netlify build pipeline (currently skips testing).
