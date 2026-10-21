from scrapling.fetchers import Fetcher
from playwright.sync_api import sync_playwright
import time

base = "https://burgonomics.com"
imgs = [
    "/menu_images/Fries/Onion Rings.webp",
    "/menu_images/Big Bang/American Burger.webp",
    "/menu_images/Classic Burgers/Kurkure Momos Burger.webp",
    "/menu_images/Beverages/Kokum Iced Tea.webp",
    "/menu_images/Meals/2 Jr Hero.webp",
    "/menu_images/Momos/Veg Momos.webp",
    "/menu_images/Pasta/Pink Sauce.webp",
    "/menu_images/Big Bang/tandoori paneer.webp",
]
print("live image checks:")
for i in imgs:
    p = Fetcher().get(base + i.replace(" ", "%20"))
    print(f"  {p.status}  {i}")

with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.goto(base + "/menu", wait_until="networkidle", timeout=60000)
    time.sleep(2)
    page.evaluate("document.querySelectorAll('.subsection-title')[0].scrollIntoView({block:'start'})")
    time.sleep(2)
    page.screenshot(path=r"C:\Users\DELL\AppData\Local\Temp\opencode\live_menu_bigbang.png")
    broken = page.evaluate("""
      [...document.querySelectorAll('img')]
        .filter(i => i.complete && i.naturalWidth === 0)
        .map(i => i.getAttribute('src'))
    """)
    thumbs = page.evaluate("document.querySelectorAll('.product-image-sleek').length")
    print("broken images on live:", broken)
    print("thumbnails on live:", thumbs)
    browser.close()
