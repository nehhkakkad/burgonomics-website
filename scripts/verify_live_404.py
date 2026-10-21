import time
from playwright.sync_api import sync_playwright
from scrapling.fetchers import Fetcher

# NotFound chunk reachable?
r = Fetcher().get("https://burgonomics.com/assets/NotFound-DFRFTv1E.js")
print("NotFound chunk HTTP:", r.status)

with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.goto("https://burgonomics.com/some-bad-link", wait_until="networkidle", timeout=60000)
    time.sleep(2)
    print("url still /some-bad-link:", page.url.endswith("/some-bad-link"))
    print("h1:", page.evaluate("document.querySelector('h1')?.innerText"))
    print("title:", page.title())
    print("noindex:", page.evaluate("document.querySelector('meta[name=robots]')?.content"))
    page.screenshot(path=r"C:\Users\DELL\AppData\Local\Temp\opencode\live_404.png")

    # real routes still intact + no console errors on any page
    for path in ["/", "/menu", "/locations", "/franchise", "/about"]:
        errs = []
        jq = "document.querySelector('h1')?.innerText || ''"
        p = browser.new_page(viewport={"width": 1440, "height": 900})
        p.on("console", lambda m, errs=errs: errs.append(m.text) if m.type == "error" else None)
        p.goto("https://burgonomics.com" + path, wait_until="networkidle", timeout=60000)
        time.sleep(1)
        h1 = p.evaluate(jq).replace("\n", " ")
        print(f"{path}: h1={h1[:40]!r} console_errors={errs or 'none'}")
        p.close()
    browser.close()
