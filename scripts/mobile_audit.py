"""Mobile audit: screenshot every route at iPhone-size viewport and report
horizontal overflow, console errors, tiny tap targets."""
import time
from playwright.sync_api import sync_playwright

BASE = "http://localhost:4173"
PAGES = ["/", "/menu", "/locations", "/franchise", "/about", "/burger/xyz"]

with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True)
    for path in PAGES:
        errs = []
        p = browser.new_page(viewport={"width": 390, "height": 844}, device_scale_factor=2, is_mobile=True, has_touch=True)
        p.on("console", lambda m, errs=errs: errs.append(m.text[:140]) if m.type == "error" else None)
        p.goto(BASE + path, wait_until="networkidle", timeout=60000)
        time.sleep(2)
        p.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        time.sleep(1.5)

        overflow = p.evaluate("""
        (() => {
          const doc = document.documentElement;
          const out = [];
          if (doc.scrollWidth > doc.clientWidth + 1) {
            out.push(`PAGE scrollWidth ${doc.scrollWidth} > client ${doc.clientWidth}`);
            const els = [...document.querySelectorAll('body *')].filter(e => {
              const r = e.getBoundingClientRect();
              return r.right > doc.clientWidth + 2 || r.left < -2;
            }).slice(0, 6);
            for (const e of els) {
              const r = e.getBoundingClientRect();
              out.push(`  ${e.tagName}.${[...e.classList].join('.') || '-'} right=${Math.round(r.right)} w=${Math.round(r.width)}`);
            }
          }
          return out;
        })()
        """)

        name = path.strip("/").replace("/", "_") or "home"
        shot = rf"C:\Users\DELL\AppData\Local\Temp\opencode\mob_{name}.png"
        p.screenshot(path=shot)
        print(f"\n=== {path}")
        print(f"  overflow: {overflow if overflow else 'none'}")
        print(f"  console errors: {errs if errs else 'none'}")
        p.close()
    browser.close()
