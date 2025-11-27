# Animated Icons Guide

## Overview

Microkeebs now uses a custom `AnimatedIcon` component instead of lucide-react for all icon needs. The component provides smooth, theme-aware animations with accessibility features including reduced-motion support.

## Usage

```tsx
import { AnimatedIcon } from './icons';

<AnimatedIcon 
  name="icon-name" 
  size={24} 
  className="text-[#a7a495]"
  animated={true} // optional, defaults to true
/>
```

## Available Icons

### Navigation & UI
- `arrow-left` - Back navigation arrows (animated slide)
- `chevron-left` - Carousel left navigation (animated slide)
- `chevron-right` - Carousel right navigation (animated slide)
- `close` - Close/dismiss buttons (animated draw)
- `search` - Search functionality (rotating circle with animated dash)

### Social Media
- `youtube` - YouTube social links (pulsing glow)
- `instagram` - Instagram social links (pulsing rings)
- `tiktok` - TikTok social links (gentle bounce)

### Category & Ranking Icons
- `trophy` - All rankings category (shine sweep effect)
- `eye` - Look rankings category (scale pulse with iris)
- `volume` - Sound rankings category (animated sound waves)
- `hand` - Feel rankings category (waving hand)

### Theme & System
- `sun` - Light theme icon (rotating rays)
- `moon` - Dark theme icon (glowing moon)
- `monitor` - Desktop recommendation icon (glowing pulse)

## Icon Mapping by Component

### BuildDetail.tsx
- **Back Button**: `arrow-left` (replaces lucide's `ArrowLeft`)

### BuildGallery.tsx
- **Search Icon**: `search` (replaces lucide's `Search`)

### Contact.tsx & Header.tsx
- **YouTube Link**: `youtube` (replaces lucide's `Youtube`)
- **Instagram Link**: `instagram` (replaces lucide's `Instagram`)
- **TikTok Link**: `tiktok` (custom, previously inline SVG)

### ImageCarousel.tsx
- **Previous Button**: `chevron-left` (replaces lucide's `ChevronLeft`)
- **Next Button**: `chevron-right` (replaces lucide's `ChevronRight`)

### Rankings.tsx
- **All Category**: `trophy` (replaces lucide's `Trophy`)
- **Look Category**: `eye` (replaces lucide's `Eye`)
- **Sound Category**: `volume` (replaces lucide's `Volume2`)
- **Feel Category**: `hand` (replaces lucide's `Hand`)

### MobilePopup.tsx
- **Desktop Icon**: `monitor` (replaces lucide's `Monitor`)
- **Close Button**: `close` (replaces lucide's `X`)

### ThemeToggle.tsx
- **Light Mode**: `sun` (replaces lucide's `Sun`)
- **Dark Mode**: `moon` (replaces lucide's `Moon`)

## Animation Details

All animations are carefully designed to be smooth and fluid, respecting user preferences:

### Animation Types
1. **Slide Animations** - Arrows and chevrons slide back and forth
2. **Pulse/Glow** - Social media icons pulse with subtle glow effects
3. **Rotation** - Search and sun icons rotate slowly
4. **Scale Pulse** - Eye and monitor icons scale gently
5. **Wave** - Sound waves and hand waving motions
6. **Draw** - Close icon draws its lines sequentially

### Reduced Motion Support
The component automatically detects `prefers-reduced-motion` browser settings and disables animations when users prefer reduced motion, making the site fully accessible.

## Customization

### Size
Control icon size with the `size` prop (default: 24):
```tsx
<AnimatedIcon name="youtube" size={48} />
```

### Color
Icons inherit the current text color via `currentColor`, so use className to control color:
```tsx
<AnimatedIcon 
  name="instagram" 
  className="text-[#a7a495]" 
/>
```

### Disable Animation
Optionally disable animation for specific instances:
```tsx
<AnimatedIcon 
  name="trophy" 
  animated={false} 
/>
```

## CSS Animations

All animation keyframes are defined in `/src/index.css` with timing functions that match the user's animation preferences (ease/ease-out per design guidelines).

The animations automatically pause when users have `prefers-reduced-motion` enabled, ensuring accessibility compliance.

## Adding New Icons

To add a new icon:

1. Open `/src/components/icons/AnimatedIcon.tsx`
2. Add a new case in the `getIconPath` switch statement
3. Define the SVG path with optional animation classes
4. Add corresponding animation keyframes to `/src/index.css` if needed
5. Update this documentation with the new icon name and usage

## Benefits Over Lucide React

1. **Smaller Bundle Size** - No external icon library dependency
2. **Custom Animations** - Tailored animations for Microkeebs brand
3. **Theme Integration** - Seamless integration with light/dark themes
4. **Performance** - Optimized SVG animations with CSS
5. **Consistency** - All icons follow the same animation patterns
6. **Accessibility** - Built-in reduced-motion support

## Migration Complete

All lucide-react imports have been successfully replaced with AnimatedIcon throughout:
- BuildDetail.tsx ✅
- BuildGallery.tsx ✅
- Contact.tsx ✅
- Header.tsx ✅
- ImageCarousel.tsx ✅
- Rankings.tsx ✅
- MobilePopup.tsx ✅
- ThemeToggle.tsx ✅

The lucide-react dependency has been removed from package.json.
