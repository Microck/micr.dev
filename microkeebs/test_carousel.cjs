const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  await page.goto('http://localhost:5173');
  await page.waitForLoadState('networkidle');
  
  console.log('Page loaded:', await page.title());
  
  const buildCard = await page.locator('.gallery-media__image').first();
  if (await buildCard.isVisible()) {
    await buildCard.click();
    await page.waitForTimeout(3000);
    
    const allElements = await page.evaluate(() => {
      const carousel = document.querySelector('[class*="h-\\[500px\\]"]') || document.querySelector('.relative.overflow-hidden');
      if (!carousel) return { found: false, html: 'No carousel container found' };
      
      const ring = carousel.querySelector('[style*="preserve-3d"]');
      const children = ring ? ring.children : [];
      
      return {
        found: true,
        carouselHTML: carousel.outerHTML.substring(0, 500),
        ringExists: !!ring,
        childCount: children.length,
        firstChildStyle: children[0] ? {
          backgroundImage: getComputedStyle(children[0]).backgroundImage,
          transform: getComputedStyle(children[0]).transform,
          width: getComputedStyle(children[0]).width,
          height: getComputedStyle(children[0]).height,
          opacity: getComputedStyle(children[0]).opacity
        } : null
      };
    });
    
    console.log('Carousel analysis:', JSON.stringify(allElements, null, 2));
    
    await page.screenshot({ path: 'screenshot_detail.png', fullPage: true });
    console.log('Screenshot saved');
  }
  
  await page.waitForTimeout(2000);
  await browser.close();
})();
