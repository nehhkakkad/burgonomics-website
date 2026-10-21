import re
from scrapling.fetchers import Fetcher

r = Fetcher().get("https://burgonomics.com/assets/Menu-Bx_oQEDW.js")
ctext = r.html_content or r.body.decode("utf-8", "ignore")
print(f"Menu-Bx_oQEDW.js ({len(ctext)//1024} KB)")
for marker in [
    "Kokum Iced Tea.webp",                 # new image ref
    "American Burger.webp",                # new image ref
    "Arrabiata.webp",                      # new separate pasta image
    "Onion Rings.webp",                    # new image ref
    "kadhai gravy",                        # new Excel description text
    "Pink and Arrabiata",                  # OLD image path
    "Desi spices meet juicy indulgence",   # OLD tagline
]:
    print(f"  {'FOUND' if marker in ctext else 'absent'}: {marker}")
