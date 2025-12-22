# Parallax Background Logic Implementation Plan

> **For OpenCode:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Reconstruct and implement the specific "slideImgUpdate" parallax logic from Tom Miller's CodePen `PoWGpWj` into `ImageCarousel.tsx`, using `getBoundingClientRect` and `gsap.utils.mapRange` to drive `backgroundPosition`.

**Architecture:** 
We will replace the current approximate `updateBgPos` function with a precise `slideImgUpdate` function. This function will calculate the horizontal position of each slide relative to the viewport and map that position to a `backgroundPosition` value, creating a depth/parallax effect as the carousel rotates.

**Tech Stack:** React, GSAP (Core, Draggable, Utils).

### Task 1: Implement `slideImgUpdate` logic

**Files:**
- Modify: `src/components/ImageCarousel.tsx`

**Step 1: Analyze current implementation**
Read `src/components/ImageCarousel.tsx` to identify the exact location of `updateBgPos` and how it's currently called (lines 61-72, 87, 92).

**Step 2: Create `slideImgUpdate` function**
We will replace `updateBgPos` with the new logic.

*Draft Logic:*
```typescript
const slideImgUpdate = () => {
  const imagesArray = imagesRef.current.filter(Boolean); // Ensure valid refs
  
  imagesArray.forEach((img) => {
    if (!img) return;
    
    const rect = img.getBoundingClientRect();
    // Map x position from [-width, windowWidth] -> [0, 1]
    // Note: rect.width might need to be dynamic or fixed based on the component (500px in code)
    const prog = gsap.utils.mapRange(-rect.width, window.innerWidth, 0, 1, rect.x);
    
    // Clamp values to ensure we don't go out of bounds (optional but good for safety)
    const val = gsap.utils.clamp(0, 1, prog);
    
    // Interpolate to backgroundPosition
    // Logic: 0 -> 1 maps to a percentage range for background-position-x.
    // Standard parallax often moves from 0% to 100% or vice versa depending on direction.
    // If mimicking "xPercent: -50" (modern) which moves image LEFT, we might want background moving right?
    // Let's start with a standard 0% to 100% (or 100% to 0%) sweep.
    // Legacy CodePen `PoWGpWj` often used pixel values, but percentage is more responsive.
    // We will use a standard parallax mapping first: `gsap.utils.interpolate("100% 50%", "0% 50%", val)`
    
    gsap.set(img, { 
      backgroundPosition: gsap.utils.interpolate("0% 50%", "100% 50%", val) 
    });
  });
};
```

**Step 3: Integrate into GSAP Draggable**
Update the `Draggable.create` configuration to call `slideImgUpdate` instead of `updateBgPos` in `onDrag` and `onThrowUpdate`. Also call it once initially or on animation frames if needed, but the current code calls it in the drag handlers.

**Step 4: Verify**
Run `npm run dev` and check the visual effect. The background should move smoothly relative to the container's movement across the screen.

**Step 5: Commit**
```bash
git add src/components/ImageCarousel.tsx
git commit -m "feat: implement GSAP mapRange parallax logic for carousel backgrounds"
```
