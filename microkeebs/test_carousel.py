from playwright.sync_api import sync_playwright
import time
import os

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    
    # 1. Navigate to the specific build detail page
    url = "http://localhost:5173/microkeebs/#/builds/tgr-jane-v2-ce/XYydztEvHdk"
    print(f"Navigating to: {url}")
    page.goto(url)
    
    # 2. Wait for network idle to ensure JS execution
    print("Waiting for networkidle...")
    page.wait_for_load_state("networkidle")
    
    # 3. Take a screenshot to inspect the rendered state
    screenshot_path = os.path.join(os.getcwd(), "build_detail_screenshot.png")
    page.screenshot(path=screenshot_path, full_page=True)
    print(f"Screenshot saved to: {screenshot_path}")
    
    # 4. Inspect relevant elements (carousel container)
    carousel_content = page.content()
    
    # Check for presence of carousel elements (based on recent code changes)
    # We look for the 3D ring container and images
    is_carousel_present = page.locator("div[style*='preserve-3d']").count() > 0
    images_count = page.locator("div[style*='backgroundImage']").count()
    
    print(f"3D Carousel Container Present: {is_carousel_present}")
    print(f"Number of Carousel Images Found: {images_count}")

    browser.close()
