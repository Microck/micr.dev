# Visual Updates & Interactive Components Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix fade effect in LogoWall, add interactive components from NextBricks, and enhance build page visuals.

**Architecture:**
- **LogoWall Fade:** Override CSS variable handling for fade masks to ensure compatibility.
- **Interactive Divider:** Implement as a reusable component `src/components/InteractiveDivider.tsx` between sections.
- **LineSwap:** Implement as a utility component `src/components/LineSwap.tsx` for hover effects on text.

**Tech Stack:** React 19, Tailwind CSS, Framer Motion.

## Task 1: Fix LogoWall Fade Effect

**Files:**
- Modify: `src/components/LogoWall.tsx`

**Step 1: Update fade mask implementation**

Modify `src/components/LogoWall.tsx` to hardcode the fade percentage or fix the variable usage if it's broken.

*Current code uses CSS variables for fade stops which might not be resolving correctly in the mask-image property in some browsers/configurations.*

We will simplify the mask implementation to use direct values or ensure the variables are set correctly on the element.

```typescript
// In src/components/LogoWall.tsx

// Change lines 113-145 to use a simpler mask if variables aren't working
// Or ensure the style prop is passing valid CSS values.

// ... existing code ...
        .mask-horizontal {
          mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 20%, /* Hardcoded for now as requested "whatever value u feel like" */
            black 80%,
            transparent 100%
          );
          -webkit-mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 20%,
            black 80%,
            transparent 100%
          );
        }
// ...
```

**Step 2: Verify visually**

(Manual verification required after change)

## Task 2: Implement Interactive Divider

**Files:**
- Create: `src/components/InteractiveDivider.tsx`
- Modify: `src/App.tsx` (or wherever "Worked with" and "About me" meet)

**Step 1: Create InteractiveDivider component**

Create `src/components/InteractiveDivider.tsx` with the code from NextBricks (to be fetched/provided).

*Note: Since I don't have the exact code yet, I will use a placeholder structure based on the description, to be filled with the actual implementation.*

```tsx
import React, { useRef, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const InteractiveDivider = () => {
  const { isDark } = useTheme();
  const path = useRef<SVGPathElement>(null);
  const [width, setWidth] = useState(0);

  // ... implementation details ...
  // This will need the specific SVG path manipulation logic
  
  return (
    <div className="w-full h-12 relative">
      {/* SVG Canvas */}
    </div>
  );
};

export default InteractiveDivider;
```

**Step 2: Add to App layout**

Insert `<InteractiveDivider />` between the `LogoTicker` (Worked with) and `About` sections.

## Task 3: Implement LineSwap for Build Names & Rankings

**Files:**
- Create: `src/components/LineSwap.tsx`
- Modify: `src/components/BuildCard.tsx` (for build names)
- Modify: `src/components/Rankings.tsx` (for rankings)

**Step 1: Create LineSwap component**

Create `src/components/LineSwap.tsx`.

```tsx
import { motion } from 'motion/react';

interface LineSwapProps {
  text: string;
  className?: string;
}

export function LineSwap({ text, className = "" }: LineSwapProps) {
  return (
    <div className={`relative overflow-hidden cursor-pointer group ${className}`}>
      <motion.div
        initial={{ y: 0 }}
        whileHover={{ y: "-100%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="h-full">{text}</div>
        <div className="h-full absolute top-full left-0">{text}</div>
      </motion.div>
    </div>
  );
}
```

**Step 2: Apply to BuildCard**

Replace the build name text in `src/components/BuildCard.tsx` with `<LineSwap text={name} />`.

**Step 3: Apply to Rankings**

Replace the ranking item text in `src/components/Rankings.tsx` with `<LineSwap text={name} />`.

## Task 4: Cleanup & Verification

**Files:**
- Modify: `src/components/Lanyard/` (Verify no changes needed as requested "leave the lanyard like it is")

**Step 1: Manual Review**

Ensure all changes are visually correct and consistent with the dark/light theme.
