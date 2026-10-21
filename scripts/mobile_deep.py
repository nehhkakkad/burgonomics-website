import time
from playwright.sync_api import sync_playwright

BASE = "http://localhost:4173"

with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True)
    p = browser.new_page(viewport={"width": 390, "height": 844}, device_scale_factor=2, is_mobile=True, has_touch=True)
    p.goto(BASE + "/menu", wait_until="networkidle", timeout=60000)
    time.sleep(2)
    p.evaluate("window.scrollTo(0,0)")
    time.sleep(1)
    p.click(".mobile-menu-btn")
    time.sleep(1.2)
    p.screenshot(path=r"C:\Users\DELL\AppData\Local\Temp\opencode\mob_hamburger.png")
    p.click(".mobile-menu a[href='/locations']")
    time.sleep(2)
    print("hamburger nav ->", p.url)
    browser.close()
print("done")
