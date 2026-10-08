export const menuData = [
  // BIG BANG BURGERS
  { name: "American Burger", category: "Burgers", subcategory: "Big Bang Burgers", price: 159 },
  { name: "Great Indian Burger", category: "Burgers", subcategory: "Big Bang Burgers", price: 169, image: "/menu_images/Big Bang/Great Indian.jpg" },
  { name: "Gochuchang Burger", category: "Burgers", subcategory: "Big Bang Burgers", price: 179 },
  { name: "Cheese Burst Burger", category: "Burgers", subcategory: "Big Bang Burgers", price: 199, image: "/menu_images/Big Bang/Cheese burst.jpg" },
  { name: "Tandoori Paneer Burger", category: "Burgers", subcategory: "Big Bang Burgers", price: 209, image: "/menu_images/Big Bang/tandoori paneer.jpg" },
  { name: "Super Hero Burger", category: "Burgers", subcategory: "Big Bang Burgers", price: 219, image: "/menu_images/Big Bang/Super Hero.jpg" },

  // CLASSIC BURGERS
  { name: "Jr. Hero Burger", category: "Burgers", subcategory: "Classic Burgers", price: 59 },
  { name: "Korean Kimchi Burger", category: "Burgers", subcategory: "Classic Burgers", price: 89 },
  { name: "Mexican Mafia Burger", category: "Burgers", subcategory: "Classic Burgers", price: 99 },
  { name: "Hero Burger", category: "Burgers", subcategory: "Classic Burgers", price: 109 },
  { name: "Veggie Loaded Burger", category: "Burgers", subcategory: "Classic Burgers", price: 109 },
  { name: "Kurkure Momos Burger", category: "Burgers", subcategory: "Classic Burgers", price: 119 },
  { name: "Cheese Jalapeño Burger", category: "Burgers", subcategory: "Classic Burgers", price: 149 },

  // SIZZLING BURGERS
  { name: "Veg Sizzling Burger", category: "Sizzling", price: 249 },
  { name: "Cheese Supreme Burger", category: "Sizzling", price: 349 },
  { name: "Paneer Supreme Burger", category: "Sizzling", price: 349 },

  // SYDNEY'S VIRAL BURGER
  { name: "Classic Dipper Burger", category: "Sydney's Viral", price: 249 },
  { name: "Cheese Dipper Burger", category: "Sydney's Viral", price: 299 },

  // UFO BURGERS
  { name: "Galaxy Seal Hero Burger", category: "UFO Burgers", price: 199 },
  { name: "Orbit X Paneer Burger", category: "UFO Burgers", price: 249 },
  { name: "Cosmic Lava Cheese Burger", category: "UFO Burgers", price: 249 },

  // COMBOS
  { name: "2 Jr. Hero Burger", category: "Combos", price: 109 },
  { name: "Jr Hero Burger Meal", category: "Combos", price: 149, description: "Jr Hero Burger + Fries + Coke" },
  { name: "Any Classic Burger Meal", category: "Combos", price: 199, description: "Classic Burger + Fries + Coke" },
  { name: "Any Big Bang Burger Meal", category: "Combos", price: 299, description: "Big Bang Burger + Fries + Coke" },

  // ADD-ONS
  { name: "Cheese Slice", category: "Add-Ons", price: 25 },
  { name: "Peri Peri", category: "Add-Ons", price: 25 },
  { name: "Make It A Meal", category: "Add-Ons", price: 119, description: "Fries + Coke" },

  // SIDES
  { name: "Classic Salted Fries", category: "Sides", price: 119 },
  { name: "Peri Peri Fries", category: "Sides", price: 139 },
  { name: "Onion Rings (5 pcs.)", category: "Sides", price: 139 },
  { name: "Mint Fries", category: "Sides", price: 139 },
  { name: "Peri Peri Cheese Fries", category: "Sides", price: 149 },
  { name: "Dirty Fries", category: "Sides", price: 169, image: "/menu_images/Fries/Dirty fries.jpg" },

  // PIZZA
  { name: "Margherita Pizza", category: "Pizza", price: 219 },
  { name: "Tandoori Paneer Pizza", category: "Pizza", price: 249 },
  { name: "The Veg Overload Pizza", category: "Pizza", price: 249 },
  { name: "Cheese Heaven Pizza", category: "Pizza", price: 249, image: "/menu_images/Pizza/4 cheese.png" },

  // PASTA
  { name: "White Sauce Pasta", category: "Pasta", price: 199 },
  { name: "Pink Sauce Pasta", category: "Pasta", price: 199 },
  { name: "Arrabiata Pasta", category: "Pasta", price: 199 },

  // MOMOS
  { name: "Veg Momos", category: "Momos", steamPrice: 119, friedPrice: 129 },
  { name: "Veg Cheese Momos", category: "Momos", steamPrice: 139, friedPrice: 159 },
  { name: "Kurkure Momos", category: "Momos", friedPrice: 159 },

  // COOLERS
  { name: "Lemon Iced Tea", category: "Coolers", price: 99 },
  { name: "Peach Iced Tea", category: "Coolers", price: 99 },
  { name: "Masala Coke", category: "Coolers", price: 99 },
  { name: "Kokum Iced Tea", category: "Coolers", price: 99 },

  // SHAKES
  { name: "Oreo Shake", category: "Shakes", price: 149 },
  { name: "Chocolate Shake", category: "Shakes", price: 149 },
  { name: "BlueBerry Shake", category: "Shakes", price: 179 },
  { name: "Strawberry Oreo Shake", category: "Shakes", price: 179 },

  // COLD COFFEE
  { name: "Classic Cold Coffee", category: "Cold Coffee", price: 99 },
  { name: "Hazlenut Cold Coffee", category: "Cold Coffee", price: 129 },
  { name: "Irish Cold Coffee", category: "Cold Coffee", price: 129 },

  // DESSERTS
  { name: "Chocolate Brownie", category: "Desserts", price: 99 },
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
