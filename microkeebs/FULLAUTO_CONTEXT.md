# FULLAUTO Context - Microkeebs (Keyboard Gallery)

## Current Task
Replace 3D Carousel with responsive ImageCarousel:
- Mobile (<768px): Drag/Slide/Scroll carousel (Framer Motion)
- Desktop (>=768px): Creative Ocean style 3D ring carousel (GSAP)

## Completed
- [x] Removed old `Carousel3D.tsx`
- [x] Implemented `ImageCarousel.tsx` with conditional rendering
- [x] Updated `BuildDetail.tsx` to use new carousel
- [x] Fixed GSAP/Draggable import issues (using `gsap/all`)
- [x] Verified build passes

## In Progress
- [ ] Confirm visual behavior (Oracle validation)
- [ ] Next major phase planning

## Key Files
- `src/components/ImageCarousel.tsx` (New component)
- `src/components/BuildDetail.tsx` (Consumer)
