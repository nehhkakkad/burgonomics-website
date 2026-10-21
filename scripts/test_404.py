import time
from playwright.sync_api import sync_playwright

with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.goto("http://localhost:4173/no-such-page", wait_until="networkidle", timeout=60000)
    time.sleep(2)
    page.screenshot(path=r"C:\Users\DELL\AppData\Local\Temp\opencode\404_desktop.png")

    title = page.title()
    noindex = page.evaluate("document.querySelector('meta[name=robots]')?.content")
    h1 = page.evaluate("document.querySelector('h1')?.innerText")
    # CTA link works?
    print("title:", title)
    print("noindex:", noindex)
    print("h1:", h1)

    # click "See the full menu"
    page.click("text=See the full menu")
    time.sleep(2)
    print("after CTA click url:", page.url, "| h1:", page.evaluate("document.querySelector('h1')?.innerText"))

    # mobile viewport
    m = browser.new_page(viewport={"width": 390, "height": 844})
    m.goto("http://localhost:4173/no-such-page", wait_until="networkidle", timeout=60000)
    time.sleep(2)
    m.screenshot(path=r"C:\Users\DELL\AppData\Local\Temp\opencode\404_mobile.png", full_page=True)

    # known routes still fine
    for p in ["/", "/menu", "/about"]:
        pg = browser.new_page(viewport={"width": 1440, "height": 900})
        pg.goto(f"http://localhost:4173{p}", wait_until="networkidle", timeout=60000)
        time.sleep(1)
        print(f"{p} -> h1:", pg.evaluate("document.querySelector('h1')?.innerText")[:40].replace(chr(10), ' '))
        pg.close()
    browser.close()
