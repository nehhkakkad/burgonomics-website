"""Live-site health check: visit every page on burgonomics.com, capture
console errors, failed requests, and broken images."""
import time
from playwright.sync_api import sync_playwright

BASE = "https://burgonomics.com"
PAGES = ["/", "/menu", "/locations", "/franchise", "/about", "/no-such-page-404"]

with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})

    console_errors, failed_requests = [], []

    page.on("console", lambda m: console_errors.append(f"{m.text[:160]}") if m.type == "error" else None)
    page.on("requestfailed", lambda r: failed_requests.append(f"{r.url[:120]} :: {r.failure}"))
    page.on("response", lambda r: failed_requests.append(f"HTTP {r.status} {r.url[:120]}") if r.status >= 400 else None)

    for path in PAGES:
        console_errors.clear(); failed_requests.clear()
        try:
            page.goto(BASE + path, wait_until="networkidle", timeout=60000)
            time.sleep(2)
            # scroll through the page to trigger lazy loads and reveals
            page.evaluate("window.scrollTo(0, document.body.scrollHeight/2)")
            time.sleep(1.5)
            page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
            time.sleep(1.5)
            broken = page.evaluate(
                "[...document.querySelectorAll('img')].filter(i => i.complete && i.naturalWidth === 0).map(i => i.getAttribute('src'))"
            )
            h1 = page.evaluate("document.querySelector('h1') ? document.querySelector('h1').innerText.trim() : '(no h1)'")
            print(f"\n=== {path}  ->  h1: {h1!r}")
            print(f"  broken imgs: {broken if broken else 'none'}")
            if console_errors:
                print(f"  console errors ({len(console_errors)}):")
                for e in console_errors[:5]:
                    print(f"    - {e}")
            else:
                print("  console errors: none")
            if failed_requests:
                print(f"  failed requests ({len(failed_requests)}):")
                for f in failed_requests[:5]:
                    print(f"    - {f}")
            else:
                print("  failed requests: none")
        except Exception as exc:
            print(f"\n=== {path}  ->  EXCEPTION: {str(exc)[:200]}")
    browser.close()
