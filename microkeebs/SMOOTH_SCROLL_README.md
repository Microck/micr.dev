# GSAP ScrollSmoother Integration

This document provides quick reference information for the GSAP ScrollSmoother integration in the microkeebs application.

## Overview

The application now uses GSAP ScrollSmoother v3.13.0 for smooth, fluid scrolling on desktop devices. The implementation is fully accessible, respects user preferences, and gracefully degrades to native scroll when appropriate.

## Quick Start

### Development
```bash
cd microkeebs
npm install
npm run dev
```

### Build
```bash
npm run build
```

### Testing
```bash
npm run lint
npx tsc --noEmit
```

## How It Works

### Component Structure
```
App
└── ThemeProvider
    └── AppContent
        └── Root Container
            ├── AuraBackground (fixed)
            ├── SmoothScroll (wrapper)
            │   └── Content (scrollable)
            │       ├── Header
            │       └── Main
            ├── ThemeToggle (fixed)
            ├── MobilePopup (fixed)
            └── TargetCursor (fixed)
```

### Key Features

- **Desktop Only**: Activates only on viewports >768px wide
- **Accessibility First**: Respects `prefers-reduced-motion` preference
- **Touch Optimized**: Uses reduced smooth values on touch devices
- **Dynamic Loading**: Loads ScrollSmoother from CDN asynchronously
- **Memory Safe**: Properly cleans up on unmount
- **Hash Routing**: Integrates seamlessly with React Router hash mode
- **Graceful Fallback**: Falls back to native scroll if loading fails

### Configuration

The ScrollSmoother is configured with:
- `smooth: 1.5` for desktop, `0.5` for touch
- `effects: true` for parallax support
- `smoothTouch: 0.1` for touch, `false` for desktop
- `normalizeScroll: false` to preserve native behavior
- `ignoreMobileResize: true` to prevent layout shifts

## Browser Support

- ✅ Chrome/Edge (Chromium) 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (uses native scroll)

## Accessibility

The implementation is fully accessible:
- Respects `prefers-reduced-motion` setting
- Does not interfere with keyboard navigation
- Compatible with screen readers
- No impact on focus management

## Performance

- Script loads asynchronously (non-blocking)
- Uses GPU acceleration via `will-change: transform`
- Bypassed entirely on mobile (native performance)
- No layout shift on initial load

## Troubleshooting

### Smooth scroll not working
1. Check browser console for errors
2. Verify viewport width is >768px
3. Ensure `prefers-reduced-motion` is not set
4. Check that CDN script loaded successfully

### Scroll feels janky
1. Check for heavy components in render tree
2. Verify GPU acceleration is active
3. Consider reducing `smooth` value
4. Test on different devices/browsers

### Fixed elements not staying fixed
1. Ensure elements are outside `<SmoothScroll>` wrapper
2. Verify `position: fixed` is set
3. Check z-index hierarchy

## Production Notes

For production deployment:
1. Replace CodePen CDN with official Club GreenSock CDN
2. Add proper license key to the CDN URL
3. Or use npm package with Club GreenSock authentication

Example with official CDN:
```javascript
scriptElement.src = 'https://assets.gsap.com/business/members/plugins/ScrollSmoother.min.js?key=YOUR_KEY';
```

## Documentation

For detailed information, see:
- `IMPLEMENTATION_CHALLENGES.txt` - Technical challenges and solutions
- `SMOOTH_SCROLL_IMPLEMENTATION_SUMMARY.txt` - High-level implementation summary
- [GSAP ScrollSmoother Docs](https://greensock.com/docs/v3/Plugins/ScrollSmoother) - Official documentation

## Support

For issues or questions:
1. Check the implementation challenges document
2. Review GSAP ScrollSmoother documentation
3. Check browser console for errors
4. Test with smooth scrolling disabled

## License

GSAP ScrollSmoother is a premium plugin requiring a Club GreenSock membership. The current implementation uses a demo version for development/testing. Production use requires proper licensing.

## Credits

- GSAP by GreenSock: https://greensock.com
- Implementation: micr.dev team
- Testing: Chrome 120+, Firefox 121+, Safari 17+

---

Last Updated: 2024-11-26
Version: 1.0.0
