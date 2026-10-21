import time
from playwright.sync_api import sync_playwright

BASE = "http://localhost:4173"
PAGES = ["/", "/menu", "/locations", "/franchise", "/about", "/burger/xyz"]

with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True)
    for path in PAGES:
        p = browser.new_page(viewport={"width": 320, "height": 568}, is_mobile=True, has_touch=True)
        p.goto(BASE + path, wait_until="networkidle", timeout=60000)
        time.sleep(1.5)
        p.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        time.sleep(1.2)
        overflow = p.evaluate("document.documentElement.scrollWidth - document.documentElement.clientWidth")
        name = path.strip("/").replace("/", "_") or "home"
        print(f"{name:12} overflow_px={overflow}")
        p.close()
    browser.close()
