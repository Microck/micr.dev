# Logging Quality Audit Report

**Date:** 2026-02-23
**Repository:** Microck/micr.dev
**Branch:** logging-audit

## Executive Summary

This audit identified significant logging issues across the codebase. With **990 total console statements**, the codebase contains excessive debug logging, improper error handling, and development artifacts that should be cleaned up before production deployment.

## Findings

### 1. Excessive console.log Statements (695 occurrences)

**Severity:** High
**Impact:** Performance degradation, cluttered console, exposes internal state

#### Critical Files

| File | Issue | Recommendation |
|------|-------|----------------|
| `run.js` | ASCII animation debug output | Remove or make optional via debug flag |
| `crt-effect.js:50` | Startup message: "🖥️ CRT Effect enabled" | Remove production noise |
| `quarzite/js/run.js:11` | Debug logging with styled output | Remove |
| `quarzite/js/debug.js:149` | CSS logging | Remove |
| `quarzite/js/notepad.js:102` | Version selection logging | Remove or make debug-only |

**Details:**

The `run.js` file contains an ASCII animation Easter egg that extensively uses `console.log` to render frames. While intentional, this should be:
- Made opt-in (only trigger on explicit user action)
- Documented clearly as an Easter egg
- Consider if this belongs in production code

### 2. Empty Catch Blocks (20+ occurrences)

**Severity:** Critical
**Impact:** Errors are silently swallowed, making debugging impossible

#### Problematic Patterns

```javascript
// quarzite/js/app.js:21
try {
  W98?.play("microsoft");
} catch {}  // ⚠️ Error silently ignored

// quarzite/js/mobile-tabs.js:8
} catch (_) {}  // ⚠️ Error swallowed

// quarzite/js/res-warning.js:11,18,48
} catch (_) {}  // ⚠️ Multiple silent failures

// quarzite/js/debug.js:110,148,174
} catch (err) { }  // ⚠️ Error variable not used

// quarzite/js/sounds.js:17
a.play().catch(() => {});  // ⚠️ Audio failures silently ignored
```

**Recommendations:**

1. **Always log errors in catch blocks:**
   ```javascript
   } catch (err) {
     console.error('Audio play failed:', err);
   }
   ```

2. **Consider if silent failure is acceptable:**
   - For non-critical features (audio, Easter eggs), logging with lower severity is acceptable
   - For critical paths (data loading, user actions), errors must be logged

### 3. Commented Console Statements (14 occurrences)

**Severity:** Low
**Impact:** Code noise, maintenance burden

#### Files with Commented Logging

- `quarzite/jspaint/localization/parse-rc-file.js:57-59`
- `quarzite/jspaint/src/discord-activity-client.js:122,195,203`
- `quarzite/jspaint/src/speech-recognition.js:1740,1744`
- `quarzite/jspaint/src/functions.js:597,604,2435,2817,4141`
- `quarzite/jspaint/src/app.js:171`
- `quarzite/jspaint/src/$FontBox.js:146,149`
- `quarzite/jspaint/src/sessions.js:1040`
- `quarzite/jspaint/src/edit-colors.js:69,219,224`

**Recommendation:** Remove all commented console statements. If they were useful for debugging, they should be re-implemented with proper logging infrastructure.

### 4. Missing Error Context

**Severity:** Medium
**Impact:** Insufficient information for debugging

#### Examples

```javascript
// quarzite/js/gallery.js:319-321
} catch (e) {
  console.error("Failed to load gallery.json", e);
  // ✅ Good - includes error object

// quarzite/js/clippy.js (line unknown from grep)
console.error("Clippy: #text element not found!");
// ⚠️ No stack trace or context
```

### 5. console.info Usage (4 occurrences)

**Severity:** Low
**Impact:** Minimal

Used sparingly in:
- `quarzite/jspaint/localization/preprocess.js` - Language info
- `quarzite/jspaint/src/help.js` - Debug info

**Recommendation:** Consider if these should be console.debug or removed.

### 6. console.error Usage (169 occurrences)

**Severity:** Mixed
**Impact:** Generally good error handling, but inconsistent

**Positive Examples:**
- `quarzite/js/gallery.js:320` - Proper error context
- `quarzite/js/notepad.js:110` - Error with context

**Areas for Improvement:**
Some error logs could include more context (what file, what operation, expected vs actual).

### 7. console.warn Usage (168 occurrences)

**Severity:** Low
**Impact:** Generally appropriate for warnings

Good usage for non-critical issues that don't warrant errors.

## Logging Statistics

| Type | Count | Percentage |
|------|-------|------------|
| console.log | 695 | 70.2% |
| console.error | 169 | 17.1% |
| console.warn | 168 | 17.0% |
| console.info | 4 | 0.4% |
| console.debug | 0 | 0% |
| **Total** | **1036** | **100%** |

Note: Additional console statements found beyond initial count.

## Prioritized Recommendations

### Immediate (Critical)

1. **Remove or guard Easter egg ASCII logging** in `run.js`
   - Make it opt-in via explicit function call
   - Already partially done with `makeLove()` function
   - Consider if initial `intro()` logging should be removed

2. **Fix empty catch blocks** with at least basic error logging:
   - `quarzite/js/app.js:21`
   - `quarzite/js/mobile-tabs.js:8`
   - `quarzite/js/res-warning.js:11,18,48`
   - `quarzite/js/debug.js:110,148,174`
   - `quarzite/js/sounds.js:17`
   - `quarzite/js/mobile-sounds.js:18`
   - `quarzite/js/mobile-viewer.js:8`
   - `quarzite/js/mobile-gallery.js:8,58`

3. **Remove startup console.log** from `crt-effect.js:50`

### Short-term (High)

4. **Remove commented console statements** (14 occurrences)
5. **Evaluate debug logging** in quarzite components:
   - `quarzite/js/debug.js`
   - `quarzite/js/notepad.js`
   - `quarzite/js/run.js`

### Medium-term (Medium)

6. **Establish logging policy**:
   - When to use console.log vs console.debug vs console.error
   - Minimum required context in error logs
   - Production vs development logging strategy

7. **Consider logging library** for better control:
   - Ability to disable debug logs in production
   - Structured logging
   - Log levels (debug, info, warn, error)

### Long-term (Low)

8. **Add telemetry/error tracking** for production:
   - Sentry or similar service
   - Capture unhandled errors
   - Performance monitoring

## Good Practices Observed

1. **Proper error logging** in gallery JSON loading (`quarzite/js/gallery.js:319-321`)
2. **Consistent use of console.error** for actual errors
3. **Appropriate use of console.warn** for non-critical issues
4. **Easter egg is intentionally triggered** via function call

## Production Readiness Assessment

| Criteria | Status | Notes |
|----------|--------|-------|
| No debug logging in production | ❌ Fail | 695 console.log statements |
| All errors logged | ❌ Fail | 20+ empty catch blocks |
| Consistent error context | ⚠️ Partial | Some errors lack context |
| Clean codebase | ⚠️ Partial | 14 commented console statements |
| **Overall** | **❌ Not Ready** | **Critical issues present** |

## Next Steps

1. Review this report with team
2. Prioritize fixes based on severity
3. Implement critical fixes immediately
4. Establish logging guidelines
5. Consider adding pre-commit hooks to catch new console.log additions

---

**Generated by:** OpenCode Logging Auditor
**Task ID:** logging-audit:github:Microck/micr.dev
