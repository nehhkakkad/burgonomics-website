import re
import pathlib

root = pathlib.Path(r"C:\Users\DELL\Desktop\BURGONOMICS WEBSITE\burgonomics final ebsite - Copy")
pub = root / "public"
data = (root / "src" / "components" / "Menu" / "menuData.js").read_text(encoding="utf-8")

paths = re.findall(r'"(/menu_images/[^"]+)"', data)
missing = [p for p in paths if not (pub / p.lstrip("/")).exists()]

items = re.findall(r'\{ name: "([^"]+)"', data)
dupes = {n for n in items if items.count(n) > 1}

favs = re.findall(r'^  "([^"]+)"', data[data.index("export const favourites"):], re.M)
fav_missing = [f for f in favs if f'{{ name: "{f}"' not in data]

# menu items WITHOUT an image
blocks = re.findall(r'\{ name: "([^"]+)".*?\},', data, re.S)
no_img = [m.group(1) for m in re.finditer(r'\{ name: "([^"]+)"[^}]*\}', data) if "image:" not in m.group(0)]

print(f"{len(paths)} image refs in menuData.js")
print("missing image files:", missing if missing else "none - all resolve")
print("duplicate item names:", dupes if dupes else "none")
print("favourites not in menuData:", fav_missing if fav_missing else "none")
print("items without image:", no_img)
