import time
from playwright.sync_api import sync_playwright

with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.goto("http://localhost:4173/menu", wait_until="networkidle", timeout=60000)
    time.sleep(2)

    page.screenshot(path=r"C:\Users\DELL\AppData\Local\Temp\opencode\menu_top.png")

    # favourites cards
    page.evaluate("document.querySelectorAll('.featured-grid')[0].scrollIntoView({block:'start'})")
    time.sleep(2)
    page.screenshot(path=r"C:\Users\DELL\AppData\Local\Temp\opencode\menu_favs.png")

    # big bang section in full menu (was text-only before the fix)
    page.evaluate("document.querySelectorAll('.subsection-title')[0].scrollIntoView({block:'start'})")
    time.sleep(2)
    page.screenshot(path=r"C:\Users\DELL\AppData\Local\Temp\opencode\menu_bigbang.png")

    # sides section (Dirty Fries photo in full menu)
    page.evaluate('document.getElementById("sides").scrollIntoView({block:"start"})')
    time.sleep(2)
    page.screenshot(path=r"C:\Users\DELL\AppData\Local\Temp\opencode\menu_sides.png")

    broken = page.evaluate("""
      [...document.querySelectorAll('img')]
        .filter(i => i.complete && i.naturalWidth === 0)
        .map(i => i.getAttribute('src'))
    """)
    thumbs = page.evaluate("document.querySelectorAll('.product-image-sleek').length")
    featured = page.evaluate("document.querySelectorAll('.featured-card-img').length")
    print("broken images:", broken)
    print("menu thumbnails rendered:", thumbs)
    print("favourites photos rendered:", featured)
    browser.close()
