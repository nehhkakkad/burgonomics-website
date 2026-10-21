import time
from playwright.sync_api import sync_playwright

with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True)
    for path in ["/", "/menu", "/locations", "/franchise", "/about", "/burger/xyz"]:
        errs = []
        p = browser.new_page(viewport={"width": 1440, "height": 900})
        p.on("console", lambda m, errs=errs: errs.append(m.text) if m.type == "error" else None)
        try:
            p.goto("https://burgonomics.com" + path, wait_until="networkidle", timeout=60000)
            time.sleep(1)
            h1 = (p.evaluate("document.querySelector('h1')?.innerText || ''")).replace("\n", " ")
            print(f"{path}: h1={h1[:44]!r} console_errors={errs or 'none'}")
        except Exception as e:
            print(f"{path}: nav error -> retry")
            time.sleep(4)
            p.goto("https://burgonomics.com" + path, wait_until="networkidle", timeout=60000)
            time.sleep(1)
            h1 = (p.evaluate("document.querySelector('h1')?.innerText || ''")).replace("\n", " ")
            print(f"{path} (retry): h1={h1[:44]!r} console_errors={errs or 'none'}")
        p.close()
    browser.close()
