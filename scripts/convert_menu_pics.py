"""Convert ULTRA FINAL MENU PICS (RAR extract) into optimized WebP assets.

Source : C:\\Users\\DELL\\AppData\\Local\\Temp\\opencode\\menu-pics\\ULTRA FINAL MENU PICS\\<Folder>\\<file>
Output : public/menu_images/<Folder>/<output-name>.webp  (max 1400px, quality 82)
"""
from pathlib import Path
from PIL import Image

SRC = Path(r"C:\Users\DELL\AppData\Local\Temp\opencode\menu-pics\ULTRA FINAL MENU PICS")
DST = Path(r"C:\Users\DELL\Desktop\BURGONOMICS WEBSITE\burgonomics final ebsite - Copy\public\menu_images")

MAX_DIM = 1400
QUALITY = 82

# (source subfolder, source filename, destination subfolder, destination filename)
MAPPING = [
    # Big Bang Burgers
    ("Big Bang", "American Burger.jpg", "Big Bang", "American Burger"),
    ("Big Bang", "Cheese burst.jpg", "Big Bang", "Cheese burst"),
    ("Big Bang", "Gochuchang Burger.jpeg", "Big Bang", "Gochuchang Burger"),
    ("Big Bang", "Great Indian.jpg", "Big Bang", "Great Indian"),
    ("Big Bang", "Super Hero.jpg", "Big Bang", "Super Hero"),
    ("Big Bang", "tandoori paneer.jpg", "Big Bang", "tandoori paneer"),
    # Classic Burgers
    ("Classic Burgers", "Cheese jelepeno burger.jpg", "Classic Burgers", "Cheese Jalapeno"),
    ("Classic Burgers", "Hero burgr.jpg", "Classic Burgers", "Hero burgr"),
    ("Classic Burgers", "Jr. Hero.jpeg", "Classic Burgers", "Jr. Hero"),
    ("Classic Burgers", "Korean Kimchi.JPG", "Classic Burgers", "Korean Kimchi"),
    ("Classic Burgers", "Kurkure Momos Burger.png", "Classic Burgers", "Kurkure Momos Burger"),
    ("Classic Burgers", "Mexican.jpg", "Classic Burgers", "Mexican"),
    ("Classic Burgers", "Veggie loaded.jpg", "Classic Burgers", "Veggie loaded"),
    # Sides / Fries
    ("Fries", "Salted fries.jpg", "Fries", "Salted fries"),
    ("Fries", "Peri peri fries.JPG", "Fries", "Peri peri fries"),
    ("Fries", "Onion Rings.png", "Fries", "Onion Rings"),
    ("Fries", "Mint fries.png", "Fries", "Mint fries"),
    ("Fries", "Peri Peri Cheesy.jpeg", "Fries", "Peri Peri Cheesy"),
    ("Fries", "Dirty fries.jpg", "Fries", "Dirty fries"),
    # Pizza
    ("Pizza", "Cheese margherita pizza.png", "Pizza", "margherita pizza"),
    ("Pizza", "Tandoori paneer pizza.png", "Pizza", "Tandoori paneer pizza"),
    ("Pizza", "veg overloaded pizza.jpg", "Pizza", "veggie loaded pizza"),
    ("Pizza", "cheesey heaven.png", "Pizza", "4 cheese"),
    # Pasta
    ("Pasta", "Alfredo Cheese.png", "Pasta", "White Sauce"),
    ("Pasta", "Pink Sauce pasta.JPG", "Pasta", "Pink Sauce"),
    ("Pasta", "Arrabiata Pasta.JPG", "Pasta", "Arrabiata"),
    # Momos
    ("Momos", "VEG MOMOS.JPG", "Momos", "Veg Momos"),
    ("Momos", "Veg Cheese Momos.JPG", "Momos", "Veg Cheese Momos"),
    # Coolers / Beverages
    ("Beverages", "Lemon Iced Tea.jpg", "Beverages", "Lemon Iced Tea"),
    ("Beverages", "Peach.jpg", "Beverages", "Peach"),
    ("Beverages", "Masala coke.jpg", "Beverages", "Masala coke"),
    ("Beverages", "Kokum iced tea.jpg", "Beverages", "Kokum Iced Tea"),
    # Shakes
    ("Shakes", "Oreo.JPG", "Shakes", "Oreo"),
    ("Shakes", "Chocolate.JPG", "Shakes", "Chocolate"),
    ("Shakes", "Blueberry  Shake.png", "Shakes", "BlueBerry"),
    ("Shakes", "Strawberry Shake.png", "Shakes", "Strawberry Shake"),
    # Cold Coffee
    ("Cold Coffee", "Classic cold coffee.jpg", "Cold Coffee", "Classic"),
    ("Cold Coffee", "Hazelnut cold coffee.jpg", "Cold Coffee", "Hazelnut"),
    ("Cold Coffee", "Irish cold coffee.jpg", "Cold Coffee", "Irish"),
    # Desserts
    ("Brownie", "Chocolate Brownie.png", "Brownie", "Chocolate Brownie"),
    # Combos / Meals
    ("Meals", "2 Jr. Hero burger.png", "Meals", "2 Jr Hero"),
    ("Meals", "Jr. Hero Burger.JPG", "Meals", "jr hero meal"),
    ("Meals", "any classic hero meal.JPG", "Meals", "any classic meal"),
    ("Meals", "big bang meal.JPG", "Meals", "big bang meal"),
]


def convert(src_path: Path, out_path: Path) -> int:
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(src_path) as im:
        im = im.convert("RGB")
        w, h = im.size
        scale = min(1.0, MAX_DIM / max(w, h))
        if scale < 1.0:
            im = im.resize((round(w * scale), round(h * scale)), Image.LANCZOS)
        # flatten onto white to avoid dark PNG alpha edges
        thumb = Image.new("RGB", im.size, (255, 255, 255))
        thumb.paste(im)
        thumb.save(out_path, "WEBP", quality=QUALITY, method=6)
        return out_path.stat().st_size


def main() -> None:
    total_in = total_out = 0
    for src_dir, src_name, dst_dir, dst_name in MAPPING:
        src = SRC / src_dir / src_name
        out = DST / dst_dir / f"{dst_name}.webp"
        if not src.exists():
            print(f"MISSING SRC: {src}")
            continue
        size = convert(src, out)
        total_in += src.stat().st_size
        total_out += size
        print(f"OK {dst_dir}/{dst_name}.webp  {src.stat().st_size/1024:8.0f} KB -> {size/1024:6.0f} KB")
    print(f"\nTOTAL: {total_in/1024/1024:.1f} MB -> {total_out/1024/1024:.1f} MB")


if __name__ == "__main__":
    main()
