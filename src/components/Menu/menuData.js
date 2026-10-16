export const menuData = [
  // BIG BANG BURGERS
  { name: "American Burger", category: "Burgers", subcategory: "Big Bang Burgers", price: 159, description: "Big, bold, and unapologetically American." },
  { name: "Great Indian Burger", category: "Burgers", subcategory: "Big Bang Burgers", price: 169, image: "/menu_images/Big Bang/Great Indian.webp", description: "Desi spices meet juicy indulgence." },
  { name: "Gochuchang Burger", category: "Burgers", subcategory: "Big Bang Burgers", price: 179, description: "Korean gochujang heat in every bite." },
  { name: "Cheese Burst Burger", category: "Burgers", subcategory: "Big Bang Burgers", price: 199, image: "/menu_images/Big Bang/Cheese burst.webp", description: "Whole cheese patty." },
  { name: "Tandoori Paneer Burger", category: "Burgers", subcategory: "Big Bang Burgers", price: 209, image: "/menu_images/Big Bang/tandoori paneer.webp", description: "Double layered paneer patty burger." },
  { name: "Super Hero Burger", category: "Burgers", subcategory: "Big Bang Burgers", price: 219, image: "/menu_images/Big Bang/Super Hero.webp", description: "Double patty (Veggie Aloo + Cheese)." },

  // CLASSIC BURGERS
  { name: "Jr. Hero Burger", category: "Burgers", subcategory: "Classic Burgers", price: 59, image: "/menu_images/Classic Burgers/Jr. Hero.webp", description: "A small bite, big on taste." },
  { name: "Korean Kimchi Burger", category: "Burgers", subcategory: "Classic Burgers", price: 89, image: "/menu_images/Classic Burgers/Korean Kimchi.webp", description: "Bold Korean flavors with a spicy twist." },
  { name: "Mexican Mafia Burger", category: "Burgers", subcategory: "Classic Burgers", price: 99, image: "/menu_images/Classic Burgers/Mexican.webp", description: "Zesty mild & totally gangster." },
  { name: "Hero Burger", category: "Burgers", subcategory: "Classic Burgers", price: 109, image: "/menu_images/Classic Burgers/Hero burgr.webp", description: "The classic hero that never disappoints." },
  { name: "Veggie Loaded Burger", category: "Burgers", subcategory: "Classic Burgers", price: 109, image: "/menu_images/Classic Burgers/Veggie loaded.webp", description: "Packed with fresh, crunchy veggies." },
  { name: "Kurkure Momos Burger", category: "Burgers", subcategory: "Classic Burgers", price: 119, description: "Crunchy momos twist, stacked in a bun." },
  { name: "Cheese Jalapeño Burger", category: "Burgers", subcategory: "Classic Burgers", price: 149, description: "Cheesy with a fiery jalapeño kick." },

  // SIZZLING BURGERS
  { name: "Veg Sizzling Burger", category: "Sizzling", price: 249, description: "Sizzles with every crunchy bite." },
  { name: "Cheese Supreme Burger", category: "Sizzling", price: 349, description: "Extra cheese, extra wow." },
  { name: "Paneer Supreme Burger", category: "Sizzling", price: 349, description: "Paneer meets spice on a sizzling plate." },

  // SYDNEY'S VIRAL BURGER
  { name: "Classic Dipper Burger", category: "Sydney's Viral", price: 249, image: "/menu_images/Sydneys Viral/dipper burger.webp", description: "Sydney's viral dip-worthy classic." },
  { name: "Cheese Dipper Burger", category: "Sydney's Viral", price: 299, image: "/menu_images/Sydneys Viral/dipper burger.webp", description: "Dip it, bite it, cheese it." },

  // UFO BURGERS
  { name: "Galaxy Seal Hero Burger", category: "UFO Burgers", price: 199, image: "/menu_images/UFO Burgers/ufo.webp", description: "The hero, sealed galaxy-style." },
  { name: "Orbit X Paneer Burger", category: "UFO Burgers", price: 249, image: "/menu_images/UFO Burgers/ufo.webp", description: "Paneer in orbit with a crispy X-factor." },
  { name: "Cosmic Lava Cheese Burger", category: "UFO Burgers", price: 249, image: "/menu_images/UFO Burgers/ufo.webp", description: "Molten cheese with cosmic heat." },

  // COMBOS
  { name: "2 Jr. Hero Burger", category: "Combos", price: 109, description: "Twin Jr. Heroes. Twice the joy." },
  { name: "Jr Hero Burger Meal", category: "Combos", price: 149, description: "Jr Hero Burger + Fries + Coke" },
  { name: "Any Classic Burger Meal", category: "Combos", price: 199, description: "Classic Burger + Fries + Coke" },
  { name: "Any Big Bang Burger Meal", category: "Combos", price: 299, description: "Big Bang Burger + Fries + Coke" },

  // ADD-ONS
  { name: "Cheese Slice", category: "Add-Ons", price: 25, description: "Extra cheese, extra love." },
  { name: "Peri Peri", category: "Add-Ons", price: 25, description: "A spicy peri-peri sprinkle." },
  { name: "Make It A Meal", category: "Add-Ons", price: 119, description: "Fries + Coke" },

  // SIDES
  { name: "Classic Salted Fries", category: "Sides", price: 119, image: "/menu_images/Fries/Salted fries.webp", description: "The classic salted crunch." },
  { name: "Peri Peri Fries", category: "Sides", price: 139, image: "/menu_images/Fries/Peri peri fries.webp", description: "Crispy fries dusted with spicy magic." },
  { name: "Onion Rings (5 pcs.)", category: "Sides", price: 139, description: "Golden, crunchy, and totally snackable." },
  { name: "Mint Fries", category: "Sides", price: 139, description: "Crispy fries with a cool minty twist." },
  { name: "Peri Peri Cheese Fries", category: "Sides", price: 149, image: "/menu_images/Fries/Peri Peri Cheesy.webp", description: "Double fun with spice and cheese." },
  { name: "Dirty Fries", category: "Sides", price: 169, image: "/menu_images/Fries/Dirty fries.webp", description: "Messy, loaded, and absolutely worth it." },

  // PIZZA
  { name: "Margherita Pizza", category: "Pizza", price: 219, image: "/menu_images/Pizza/margherita pizza.webp", description: "Timeless, cheesy perfection." },
  { name: "Tandoori Paneer Pizza", category: "Pizza", price: 249, image: "/menu_images/Pizza/Tandoori paneer pizza.webp", description: "Smoky tandoori paneer on a cheesy base." },
  { name: "The Veg Overload Pizza", category: "Pizza", price: 249, image: "/menu_images/Pizza/veggie loaded pizza.webp", description: "A veggie party on a crispy base." },
  { name: "Cheese Heaven Pizza", category: "Pizza", price: 249, image: "/menu_images/Pizza/4 cheese.webp", description: "Because too much cheese is never enough." },

  // PASTA
  { name: "White Sauce Pasta", category: "Pasta", price: 199, image: "/menu_images/Pasta/White Sauce.webp", description: "Creamy, dreamy, and cheesy." },
  { name: "Pink Sauce Pasta", category: "Pasta", price: 199, image: "/menu_images/Pasta/Pink and Arrabiata.webp", description: "The perfect balance of creamy & spicy." },
  { name: "Arrabiata Pasta", category: "Pasta", price: 199, image: "/menu_images/Pasta/Pink and Arrabiata.webp", description: "Tangy, spicy, and full of zing." },

  // MOMOS
  { name: "Veg Momos", category: "Momos", steamPrice: 119, friedPrice: 129, description: "Simple, soft, and soul-satisfying." },
  { name: "Veg Cheese Momos", category: "Momos", steamPrice: 139, friedPrice: 159, description: "Melty cheese wrapped in goodness." },
  { name: "Kurkure Momos", category: "Momos", friedPrice: 159, description: "Crunchy outside, juicy inside." },

  // COOLERS
  { name: "Lemon Iced Tea", category: "Coolers", price: 99, image: "/menu_images/Beverages/Lemon Iced Tea.webp", description: "Chilled, zesty, and refreshing." },
  { name: "Peach Iced Tea", category: "Coolers", price: 99, image: "/menu_images/Beverages/Peach.webp", description: "Sweet peach, served ice-cold." },
  { name: "Masala Coke", category: "Coolers", price: 99, description: "Spicy, fizzy, totally desi." },
  { name: "Kokum Iced Tea", category: "Coolers", price: 99, description: "Tangy kokum in a chilled cooler." },

  // SHAKES
  { name: "Oreo Shake", category: "Shakes", price: 149, image: "/menu_images/Shakes/Oreo.webp", description: "Cookies & cream, blended thick." },
  { name: "Chocolate Shake", category: "Shakes", price: 149, image: "/menu_images/Shakes/Chocolate.webp", description: "Rich chocolate, extra thick." },
  { name: "BlueBerry Shake", category: "Shakes", price: 179, description: "Berry-loaded and deliciously thick." },
  { name: "Strawberry Oreo Shake", category: "Shakes", price: 179, image: "/menu_images/Shakes/Strawberry Shake.webp", description: "Strawberry meets Oreo, extra dreamy." },

  // COLD COFFEE
  { name: "Classic Cold Coffee", category: "Cold Coffee", price: 99, description: "Chilled coffee, the classic way." },
  { name: "Hazlenut Cold Coffee", category: "Cold Coffee", price: 129, image: "/menu_images/Cold Coffee/Hazelnut.webp", description: "Nutty hazelnut twist on cold coffee." },
  { name: "Irish Cold Coffee", category: "Cold Coffee", price: 129, image: "/menu_images/Cold Coffee/Irish.webp", description: "Creamy Irish-style cold coffee." },

  // DESSERTS
  { name: "Chocolate Brownie", category: "Desserts", price: 99, image: "/menu_images/Brownie/Chocolate Brownie.webp", description: "Warm, gooey, chocolate heaven." },
];

export const menuCategories = [
  "ALL",
  "BURGERS",
  "SIZZLING",
  "SYDNEY'S VIRAL",
  "UFO BURGERS",
  "COMBOS",
  "SIDES",
  "PIZZA",
  "PASTA",
  "MOMOS",
  "COOLERS",
  "SHAKES",
  "COLD COFFEE",
  "DESSERTS"
];

export const favourites = [
  "Great Indian Burger",
  "Cheese Burst Burger",
  "Tandoori Paneer Burger",
  "Super Hero Burger",
  "Dirty Fries",
  "Cheese Heaven Pizza"
];
