- Role
Act as a Senior Creative Frontend Engineer and Animation Specialist. You possess elite-level expertise in Next.js 14+ (App Router), TypeScript, Tailwind CSS, and advanced animation orchestration using Framer Motion and GSAP.

# Objective
Refactor the "Microkeebs" keyboard hobbyist portfolio to achieve an Awwwards-level user experience. The focus is on high-performance rendering, fluid state transitions, and specific visual redesigns based on provided references.

# Technical Stack & Constraints
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS + Shadcn UI
- **Package Manager:** pnpm
- **State/Animation:** `framer-motion` (Layout animations), `gsap` (Complex timelines/Scroll), `lenis` (Smooth scroll), `lucide-animated`.
- **Constraint:** Do not remove existing logic unless explicitly instructed. Ensure GSAP and Framer Motion contexts do not conflict.

# Tool Use & MCP Instructions
- **Browsing:** For every task containing a URL, use your browsing tool/MCP to read the documentation or component source code **before** implementation. Do not guess the implementation details.
- **File Access:** Analyze the current project structure before creating new files to ensure consistent naming conventions.

# Workflow (Strict Order)
This is a multi-phase refactor. **Do not implement everything at once.**
1. Acknowledge this prompt and summarize your understanding of Phase 1.
2. Wait for my confirmation to begin Phase 1.
3. Implement ONE item from the task list at a time.
4. After each item, confirm it is working and ask to proceed to the next.

---

# Task List

## Phase 1: Global UX & Navigation
1.  **Animated Icons (`lucide-animated`):**
    -   *Source:* [icons.pqoqubbw.dev](https://icons.pqoqubbw.dev) / [lucide-animated.com](https://lucide-animated.com/)
    -   *Requirement:* Replace static icons. Default state: Static. Hover state: Animate.
    -   *Fallback:* If an animated version is missing, use the standard Lucide static icon to maintain consistency.
2.  **Smooth Page Transitions:**
    -   *Reference:* [PlainEnglish - GSAP Router Events](https://plainenglish.io/blog/advanced-page-transitions-in-next-js-with-router-events-and-gsap-e8435d2410bb)
    -   *Requirement:* Implement GSAP transitions between major routes (Builds, Rankings, Contact). Logic must trigger *only* on tab switching.
3.  **Scroll Replacement:**
    -   *Library:* [Lenis GitHub](https://github.com/darkroomengineering/lenis)
    -   *Action:* Completely replace current GSAP smooth scrolling with Lenis for better performance.
4.  **Theme Toggle (Custom SVG):**
    -   *Reference:* [Theme Toggle](https://theme-toggle.rdsx.dev/)
    -   *Asset:* Use the SVG located at `./public/logo.svg` (Project Relative Path).
    -   *Logic:* Adapt the reference animation to use the Microkeebs logo instead of the default icon.
5.  **Custom Cursor (Target Lock):**
    -   *Reference:* [ReactBits Target Cursor](https://reactbits.dev/animations/target-cursor)
    -   *Configuration:* Spin duration: 2.7s. Hide default cursor.
    -   *Snapping Logic:* Cursor must snap/lock to: Build Images, Buttons, Leaderboard items, YouTube embeds.

## Phase 2: Main Page & Builds
6.  **Timeline Animation:**
    -   *Reference:* [UI Layouts Timeline](https://www.ui-layouts.com/components/timeline-animation)
    -   *Action:* Rebuild the main build page timeline using this component structure.
7.  **Expansion Animation (Layout Shift):**
    -   *Trigger:* Toggling "Show timestamps / Show builds".
    -   *Requirement:* Animate layout shifts. Text and items must animate opacity/transform smoothly. No instant snapping.
8.  **Randomized Text Effect:**
    -   *Reference:* [UI Layouts Text Effect](https://www.ui-layouts.com/components/randomized-text-effect)
    -   *Target:* Apply to Keyboard Names on the main page.
9.  **Conditional Carousel:**
    -   *Context:* Inside build pages (e.g., `/builds/f1-09`).
    -   *Mobile:* Implement [Framer Carousel](https://www.ui-layouts.com/components/framer-carousel).
    -   *Desktop:* Implement [Creative Ocean Style](https://codepen.io/creativeocean/pen/PoWGpWj).

## Phase 3: Rankings Page
10. **Horizontal Layout Conversion:**
    -   *Reference:* [UI Layouts Horizontal Scroll](https://www.ui-layouts.com/components/horizontal-scroll)
    -   *Action:* Convert vertical ranking list to horizontal scroll using GSAP or the reference component.
11. **Gradient Tiering (Visual Feedback):**
    -   Row 1: Fade to Gold/Yellow (Right side).
    -   Row 2: Fade to Silver/Grey (Right side).
    -   Row 3: Fade to Bronze/Orange (Right side).
12. **Auto-Update Label:**
    -   *Action:* Add "Last Updated: [Date]" label dynamically reflecting the `updatedAt` data prop.

*Phase 4 is strictly pending. Do not implement Phase 4 until further instructions are provided.*