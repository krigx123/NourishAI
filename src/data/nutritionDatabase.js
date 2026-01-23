/**
 * Indian Food Nutrition Database
 * Accurate nutritional data per 100g serving (unless specified)
 * Data sourced from IFCT (Indian Food Composition Tables) and USDA
 */

// ============================================
// MAIN DISHES
// ============================================
export const mainDishes = {
  dalTadka: {
    name: 'Dal Tadka',
    nameHindi: 'दाल तड़का',
    category: 'Main Course',
    servingSize: '1 bowl (150g)',
    calories: 150,
    protein: 9,
    carbs: 20,
    fats: 4,
    fiber: 5,
    sodium: 380,
    vitamins: ['Vitamin B1', 'Vitamin B6', 'Folate'],
    minerals: ['Iron', 'Potassium', 'Magnesium'],
    healthScore: 88,
    isVegetarian: true,
    allergens: []
  },
  rajmaChawal: {
    name: 'Rajma Chawal',
    nameHindi: 'राजमा चावल',
    category: 'Main Course',
    servingSize: '1 plate (300g)',
    calories: 420,
    protein: 15,
    carbs: 72,
    fats: 8,
    fiber: 12,
    sodium: 450,
    vitamins: ['Vitamin B1', 'Vitamin K', 'Folate'],
    minerals: ['Iron', 'Zinc', 'Phosphorus'],
    healthScore: 82,
    isVegetarian: true,
    allergens: []
  },
  cholaeBhature: {
    name: 'Chole Bhature',
    nameHindi: 'छोले भटूरे',
    category: 'Main Course',
    servingSize: '1 plate (350g)',
    calories: 580,
    protein: 16,
    carbs: 78,
    fats: 22,
    fiber: 10,
    sodium: 620,
    vitamins: ['Vitamin B6', 'Vitamin C', 'Folate'],
    minerals: ['Iron', 'Manganese', 'Copper'],
    healthScore: 65,
    isVegetarian: true,
    allergens: ['Gluten']
  },
  butterChicken: {
    name: 'Butter Chicken',
    nameHindi: 'बटर चिकन',
    category: 'Main Course',
    servingSize: '1 bowl (200g)',
    calories: 438,
    protein: 28,
    carbs: 12,
    fats: 32,
    fiber: 2,
    sodium: 720,
    vitamins: ['Vitamin A', 'Vitamin B12', 'Vitamin D'],
    minerals: ['Phosphorus', 'Selenium', 'Zinc'],
    healthScore: 72,
    isVegetarian: false,
    allergens: ['Dairy']
  },
  palakPaneer: {
    name: 'Palak Paneer',
    nameHindi: 'पालक पनीर',
    category: 'Main Course',
    servingSize: '1 bowl (200g)',
    calories: 290,
    protein: 14,
    carbs: 10,
    fats: 22,
    fiber: 4,
    sodium: 480,
    vitamins: ['Vitamin A', 'Vitamin K', 'Vitamin C'],
    minerals: ['Calcium', 'Iron', 'Magnesium'],
    healthScore: 85,
    isVegetarian: true,
    allergens: ['Dairy']
  },
  biryani: {
    name: 'Chicken Biryani',
    nameHindi: 'चिकन बिरयानी',
    category: 'Main Course',
    servingSize: '1 plate (350g)',
    calories: 490,
    protein: 24,
    carbs: 58,
    fats: 18,
    fiber: 3,
    sodium: 680,
    vitamins: ['Vitamin B3', 'Vitamin B6', 'Vitamin B12'],
    minerals: ['Iron', 'Zinc', 'Phosphorus'],
    healthScore: 75,
    isVegetarian: false,
    allergens: []
  },
  vegBiryani: {
    name: 'Vegetable Biryani',
    nameHindi: 'वेज बिरयानी',
    category: 'Main Course',
    servingSize: '1 plate (350g)',
    calories: 380,
    protein: 10,
    carbs: 65,
    fats: 10,
    fiber: 6,
    sodium: 520,
    vitamins: ['Vitamin A', 'Vitamin B1', 'Vitamin C'],
    minerals: ['Potassium', 'Magnesium', 'Iron'],
    healthScore: 80,
    isVegetarian: true,
    allergens: []
  },
  aalooGobi: {
    name: 'Aloo Gobi',
    nameHindi: 'आलू गोभी',
    category: 'Main Course',
    servingSize: '1 bowl (200g)',
    calories: 180,
    protein: 5,
    carbs: 25,
    fats: 8,
    fiber: 5,
    sodium: 380,
    vitamins: ['Vitamin C', 'Vitamin K', 'Vitamin B6'],
    minerals: ['Potassium', 'Manganese', 'Phosphorus'],
    healthScore: 82,
    isVegetarian: true,
    allergens: []
  },
  malaiKofta: {
    name: 'Malai Kofta',
    nameHindi: 'मलाई कोफ्ता',
    category: 'Main Course',
    servingSize: '1 bowl (200g)',
    calories: 380,
    protein: 10,
    carbs: 28,
    fats: 26,
    fiber: 3,
    sodium: 550,
    vitamins: ['Vitamin A', 'Vitamin B2', 'Vitamin E'],
    minerals: ['Calcium', 'Phosphorus', 'Zinc'],
    healthScore: 68,
    isVegetarian: true,
    allergens: ['Dairy', 'Nuts']
  },
  fishCurry: {
    name: 'Fish Curry',
    nameHindi: 'मछली करी',
    category: 'Main Course',
    servingSize: '1 bowl (200g)',
    calories: 245,
    protein: 22,
    carbs: 8,
    fats: 14,
    fiber: 2,
    sodium: 520,
    vitamins: ['Vitamin D', 'Vitamin B12', 'Vitamin A'],
    minerals: ['Selenium', 'Iodine', 'Phosphorus'],
    healthScore: 86,
    isVegetarian: false,
    allergens: ['Fish']
  }
};

// ============================================
// BREAKFAST ITEMS
// ============================================
export const breakfastItems = {
  idliSambar: {
    name: 'Idli Sambar',
    nameHindi: 'इडली सांभर',
    category: 'Breakfast',
    servingSize: '4 idlis with sambar (300g)',
    calories: 280,
    protein: 10,
    carbs: 52,
    fats: 4,
    fiber: 6,
    sodium: 450,
    vitamins: ['Vitamin B1', 'Vitamin B2', 'Folate'],
    minerals: ['Iron', 'Calcium', 'Potassium'],
    healthScore: 90,
    isVegetarian: true,
    allergens: []
  },
  masalaDosa: {
    name: 'Masala Dosa',
    nameHindi: 'मसाला डोसा',
    category: 'Breakfast',
    servingSize: '1 dosa with chutney (200g)',
    calories: 320,
    protein: 8,
    carbs: 48,
    fats: 12,
    fiber: 4,
    sodium: 380,
    vitamins: ['Vitamin B1', 'Vitamin B6', 'Vitamin C'],
    minerals: ['Potassium', 'Iron', 'Phosphorus'],
    healthScore: 78,
    isVegetarian: true,
    allergens: []
  },
  pohaJalebi: {
    name: 'Poha',
    nameHindi: 'पोहा',
    category: 'Breakfast',
    servingSize: '1 plate (200g)',
    calories: 250,
    protein: 6,
    carbs: 42,
    fats: 8,
    fiber: 3,
    sodium: 320,
    vitamins: ['Vitamin B1', 'Vitamin B6', 'Folate'],
    minerals: ['Iron', 'Potassium', 'Magnesium'],
    healthScore: 82,
    isVegetarian: true,
    allergens: []
  },
  paratha: {
    name: 'Aloo Paratha',
    nameHindi: 'आलू पराठा',
    category: 'Breakfast',
    servingSize: '2 parathas with curd (250g)',
    calories: 450,
    protein: 12,
    carbs: 58,
    fats: 20,
    fiber: 4,
    sodium: 480,
    vitamins: ['Vitamin B1', 'Vitamin B6', 'Vitamin A'],
    minerals: ['Calcium', 'Iron', 'Phosphorus'],
    healthScore: 72,
    isVegetarian: true,
    allergens: ['Gluten', 'Dairy']
  },
  upma: {
    name: 'Upma',
    nameHindi: 'उपमा',
    category: 'Breakfast',
    servingSize: '1 bowl (200g)',
    calories: 220,
    protein: 6,
    carbs: 38,
    fats: 6,
    fiber: 3,
    sodium: 340,
    vitamins: ['Vitamin B1', 'Vitamin B3', 'Folate'],
    minerals: ['Iron', 'Magnesium', 'Zinc'],
    healthScore: 80,
    isVegetarian: true,
    allergens: ['Gluten']
  },
  besan_chilla: {
    name: 'Besan Chilla',
    nameHindi: 'बेसन चीला',
    category: 'Breakfast',
    servingSize: '2 chillas (150g)',
    calories: 200,
    protein: 10,
    carbs: 24,
    fats: 8,
    fiber: 4,
    sodium: 280,
    vitamins: ['Vitamin B6', 'Folate', 'Vitamin K'],
    minerals: ['Iron', 'Magnesium', 'Zinc'],
    healthScore: 88,
    isVegetarian: true,
    allergens: []
  },
  moongDalChilla: {
    name: 'Moong Dal Chilla',
    nameHindi: 'मूंग दाल चीला',
    category: 'Breakfast',
    servingSize: '2 chillas (150g)',
    calories: 180,
    protein: 12,
    carbs: 22,
    fats: 6,
    fiber: 5,
    sodium: 260,
    vitamins: ['Vitamin B1', 'Folate', 'Vitamin C'],
    minerals: ['Iron', 'Potassium', 'Phosphorus'],
    healthScore: 92,
    isVegetarian: true,
    allergens: []
  }
};

// ============================================
// SNACKS
// ============================================
export const snacks = {
  samosa: {
    name: 'Samosa',
    nameHindi: 'समोसा',
    category: 'Snack',
    servingSize: '2 pieces (100g)',
    calories: 308,
    protein: 5,
    carbs: 32,
    fats: 18,
    fiber: 3,
    sodium: 420,
    vitamins: ['Vitamin B1', 'Vitamin B6', 'Vitamin C'],
    minerals: ['Potassium', 'Iron', 'Manganese'],
    healthScore: 45,
    isVegetarian: true,
    allergens: ['Gluten']
  },
  dhokla: {
    name: 'Dhokla',
    nameHindi: 'ढोकला',
    category: 'Snack',
    servingSize: '4 pieces (120g)',
    calories: 160,
    protein: 8,
    carbs: 28,
    fats: 3,
    fiber: 2,
    sodium: 380,
    vitamins: ['Vitamin B1', 'Vitamin B2', 'Folate'],
    minerals: ['Iron', 'Magnesium', 'Phosphorus'],
    healthScore: 82,
    isVegetarian: true,
    allergens: []
  },
  pakora: {
    name: 'Mix Veg Pakora',
    nameHindi: 'पकोड़ा',
    category: 'Snack',
    servingSize: '6 pieces (100g)',
    calories: 280,
    protein: 6,
    carbs: 28,
    fats: 16,
    fiber: 3,
    sodium: 380,
    vitamins: ['Vitamin C', 'Vitamin A', 'Vitamin B6'],
    minerals: ['Iron', 'Potassium', 'Calcium'],
    healthScore: 50,
    isVegetarian: true,
    allergens: []
  },
  kachori: {
    name: 'Kachori',
    nameHindi: 'कचौड़ी',
    category: 'Snack',
    servingSize: '2 pieces (100g)',
    calories: 340,
    protein: 7,
    carbs: 38,
    fats: 18,
    fiber: 4,
    sodium: 450,
    vitamins: ['Vitamin B1', 'Vitamin B6', 'Folate'],
    minerals: ['Iron', 'Magnesium', 'Phosphorus'],
    healthScore: 42,
    isVegetarian: true,
    allergens: ['Gluten']
  },
  sproutsSalad: {
    name: 'Sprouts Chaat',
    nameHindi: 'स्प्राउट्स चाट',
    category: 'Snack',
    servingSize: '1 bowl (150g)',
    calories: 120,
    protein: 8,
    carbs: 18,
    fats: 2,
    fiber: 6,
    sodium: 180,
    vitamins: ['Vitamin C', 'Vitamin K', 'Folate'],
    minerals: ['Iron', 'Manganese', 'Copper'],
    healthScore: 95,
    isVegetarian: true,
    allergens: []
  },
  roastedChana: {
    name: 'Roasted Chana',
    nameHindi: 'भुना चना',
    category: 'Snack',
    servingSize: '50g',
    calories: 180,
    protein: 10,
    carbs: 28,
    fats: 3,
    fiber: 8,
    sodium: 12,
    vitamins: ['Vitamin B6', 'Folate', 'Vitamin K'],
    minerals: ['Iron', 'Phosphorus', 'Manganese'],
    healthScore: 90,
    isVegetarian: true,
    allergens: []
  },
  makhana: {
    name: 'Roasted Makhana',
    nameHindi: 'मखाना',
    category: 'Snack',
    servingSize: '30g',
    calories: 110,
    protein: 4,
    carbs: 20,
    fats: 1,
    fiber: 2,
    sodium: 5,
    vitamins: ['Vitamin B1', 'Vitamin B6'],
    minerals: ['Potassium', 'Phosphorus', 'Magnesium'],
    healthScore: 94,
    isVegetarian: true,
    allergens: []
  }
};

// ============================================
// BEVERAGES
// ============================================
export const beverages = {
  masalaChai: {
    name: 'Masala Chai',
    nameHindi: 'मसाला चाय',
    category: 'Beverage',
    servingSize: '1 cup (150ml)',
    calories: 80,
    protein: 2,
    carbs: 12,
    fats: 3,
    fiber: 0,
    sodium: 40,
    vitamins: ['Vitamin B2', 'Vitamin B12'],
    minerals: ['Calcium', 'Potassium'],
    healthScore: 70,
    isVegetarian: true,
    allergens: ['Dairy']
  },
  lassi: {
    name: 'Sweet Lassi',
    nameHindi: 'मीठी लस्सी',
    category: 'Beverage',
    servingSize: '1 glass (250ml)',
    calories: 180,
    protein: 6,
    carbs: 28,
    fats: 5,
    fiber: 0,
    sodium: 90,
    vitamins: ['Vitamin B12', 'Vitamin B2', 'Vitamin D'],
    minerals: ['Calcium', 'Phosphorus', 'Potassium'],
    healthScore: 75,
    isVegetarian: true,
    allergens: ['Dairy']
  },
  chaach: {
    name: 'Chaach (Buttermilk)',
    nameHindi: 'छाछ',
    category: 'Beverage',
    servingSize: '1 glass (250ml)',
    calories: 45,
    protein: 3,
    carbs: 6,
    fats: 1,
    fiber: 0,
    sodium: 180,
    vitamins: ['Vitamin B12', 'Vitamin B2'],
    minerals: ['Calcium', 'Potassium', 'Phosphorus'],
    healthScore: 88,
    isVegetarian: true,
    allergens: ['Dairy']
  },
  nimbuPani: {
    name: 'Nimbu Pani',
    nameHindi: 'नींबू पानी',
    category: 'Beverage',
    servingSize: '1 glass (250ml)',
    calories: 40,
    protein: 0,
    carbs: 10,
    fats: 0,
    fiber: 0,
    sodium: 200,
    vitamins: ['Vitamin C'],
    minerals: ['Potassium', 'Sodium'],
    healthScore: 85,
    isVegetarian: true,
    allergens: []
  },
  jaljeera: {
    name: 'Jal Jeera',
    nameHindi: 'जल जीरा',
    category: 'Beverage',
    servingSize: '1 glass (250ml)',
    calories: 25,
    protein: 1,
    carbs: 5,
    fats: 0,
    fiber: 1,
    sodium: 280,
    vitamins: ['Vitamin C', 'Vitamin A'],
    minerals: ['Iron', 'Manganese', 'Copper'],
    healthScore: 82,
    isVegetarian: true,
    allergens: []
  },
  coconutWater: {
    name: 'Coconut Water',
    nameHindi: 'नारियल पानी',
    category: 'Beverage',
    servingSize: '1 glass (250ml)',
    calories: 46,
    protein: 2,
    carbs: 9,
    fats: 0,
    fiber: 3,
    sodium: 252,
    vitamins: ['Vitamin C', 'Vitamin B6'],
    minerals: ['Potassium', 'Magnesium', 'Manganese'],
    healthScore: 92,
    isVegetarian: true,
    allergens: []
  }
};

// ============================================
// ROTI / BREAD
// ============================================
export const breads = {
  roti: {
    name: 'Wheat Roti',
    nameHindi: 'रोटी',
    category: 'Bread',
    servingSize: '1 piece (40g)',
    calories: 120,
    protein: 4,
    carbs: 22,
    fats: 2,
    fiber: 3,
    sodium: 180,
    vitamins: ['Vitamin B1', 'Vitamin B3', 'Folate'],
    minerals: ['Iron', 'Magnesium', 'Phosphorus'],
    healthScore: 85,
    isVegetarian: true,
    allergens: ['Gluten']
  },
  naan: {
    name: 'Butter Naan',
    nameHindi: 'नान',
    category: 'Bread',
    servingSize: '1 piece (80g)',
    calories: 260,
    protein: 7,
    carbs: 40,
    fats: 8,
    fiber: 2,
    sodium: 420,
    vitamins: ['Vitamin B1', 'Vitamin B2', 'Folate'],
    minerals: ['Iron', 'Calcium', 'Selenium'],
    healthScore: 62,
    isVegetarian: true,
    allergens: ['Gluten', 'Dairy']
  },
  missiRoti: {
    name: 'Missi Roti',
    nameHindi: 'मिस्सी रोटी',
    category: 'Bread',
    servingSize: '1 piece (50g)',
    calories: 140,
    protein: 6,
    carbs: 22,
    fats: 4,
    fiber: 4,
    sodium: 200,
    vitamins: ['Vitamin B1', 'Vitamin B6', 'Folate'],
    minerals: ['Iron', 'Zinc', 'Magnesium'],
    healthScore: 88,
    isVegetarian: true,
    allergens: ['Gluten']
  },
  bajraRoti: {
    name: 'Bajra Roti',
    nameHindi: 'बाजरा रोटी',
    category: 'Bread',
    servingSize: '1 piece (50g)',
    calories: 130,
    protein: 4,
    carbs: 24,
    fats: 2,
    fiber: 4,
    sodium: 10,
    vitamins: ['Vitamin B1', 'Vitamin B3', 'Vitamin B6'],
    minerals: ['Iron', 'Magnesium', 'Phosphorus'],
    healthScore: 90,
    isVegetarian: true,
    allergens: []
  }
};

// ============================================
// RICE DISHES
// ============================================
export const riceDishes = {
  jeera_rice: {
    name: 'Jeera Rice',
    nameHindi: 'जीरा राइस',
    category: 'Rice',
    servingSize: '1 bowl (180g)',
    calories: 220,
    protein: 5,
    carbs: 42,
    fats: 4,
    fiber: 1,
    sodium: 280,
    vitamins: ['Vitamin B1', 'Vitamin B3', 'Folate'],
    minerals: ['Iron', 'Manganese', 'Selenium'],
    healthScore: 75,
    isVegetarian: true,
    allergens: []
  },
  lemon_rice: {
    name: 'Lemon Rice',
    nameHindi: 'नींबू चावल',
    category: 'Rice',
    servingSize: '1 bowl (200g)',
    calories: 240,
    protein: 5,
    carbs: 45,
    fats: 5,
    fiber: 2,
    sodium: 320,
    vitamins: ['Vitamin C', 'Vitamin B1', 'Vitamin B6'],
    minerals: ['Iron', 'Potassium', 'Magnesium'],
    healthScore: 78,
    isVegetarian: true,
    allergens: []
  },
  curd_rice: {
    name: 'Curd Rice',
    nameHindi: 'दही चावल',
    category: 'Rice',
    servingSize: '1 bowl (250g)',
    calories: 280,
    protein: 8,
    carbs: 48,
    fats: 6,
    fiber: 1,
    sodium: 180,
    vitamins: ['Vitamin B12', 'Vitamin B2', 'Vitamin D'],
    minerals: ['Calcium', 'Phosphorus', 'Potassium'],
    healthScore: 82,
    isVegetarian: true,
    allergens: ['Dairy']
  },
  pulao: {
    name: 'Vegetable Pulao',
    nameHindi: 'वेज पुलाव',
    category: 'Rice',
    servingSize: '1 plate (280g)',
    calories: 340,
    protein: 8,
    carbs: 55,
    fats: 10,
    fiber: 4,
    sodium: 420,
    vitamins: ['Vitamin A', 'Vitamin B1', 'Vitamin C'],
    minerals: ['Potassium', 'Iron', 'Magnesium'],
    healthScore: 78,
    isVegetarian: true,
    allergens: []
  },
  khichdi: {
    name: 'Moong Dal Khichdi',
    nameHindi: 'मूंग दाल खिचड़ी',
    category: 'Rice',
    servingSize: '1 bowl (250g)',
    calories: 280,
    protein: 12,
    carbs: 48,
    fats: 5,
    fiber: 6,
    sodium: 380,
    vitamins: ['Vitamin B1', 'Vitamin B6', 'Folate'],
    minerals: ['Iron', 'Potassium', 'Magnesium'],
    healthScore: 90,
    isVegetarian: true,
    allergens: []
  }
};

// ============================================
// DESSERTS
// ============================================
export const desserts = {
  gulab_jamun: {
    name: 'Gulab Jamun',
    nameHindi: 'गुलाब जामुन',
    category: 'Dessert',
    servingSize: '2 pieces (80g)',
    calories: 320,
    protein: 4,
    carbs: 52,
    fats: 12,
    fiber: 0,
    sodium: 80,
    vitamins: ['Vitamin A', 'Vitamin B2'],
    minerals: ['Calcium', 'Phosphorus'],
    healthScore: 35,
    isVegetarian: true,
    allergens: ['Dairy', 'Gluten']
  },
  kheer: {
    name: 'Rice Kheer',
    nameHindi: 'खीर',
    category: 'Dessert',
    servingSize: '1 bowl (150g)',
    calories: 240,
    protein: 6,
    carbs: 38,
    fats: 8,
    fiber: 1,
    sodium: 60,
    vitamins: ['Vitamin A', 'Vitamin B2', 'Vitamin D'],
    minerals: ['Calcium', 'Phosphorus', 'Potassium'],
    healthScore: 55,
    isVegetarian: true,
    allergens: ['Dairy', 'Nuts']
  },
  rasgulla: {
    name: 'Rasgulla',
    nameHindi: 'रसगुल्ला',
    category: 'Dessert',
    servingSize: '2 pieces (100g)',
    calories: 186,
    protein: 5,
    carbs: 38,
    fats: 2,
    fiber: 0,
    sodium: 40,
    vitamins: ['Vitamin B2', 'Vitamin B12'],
    minerals: ['Calcium', 'Phosphorus'],
    healthScore: 48,
    isVegetarian: true,
    allergens: ['Dairy']
  },
  jalebi: {
    name: 'Jalebi',
    nameHindi: 'जलेबी',
    category: 'Dessert',
    servingSize: '2 pieces (60g)',
    calories: 280,
    protein: 2,
    carbs: 58,
    fats: 6,
    fiber: 0,
    sodium: 20,
    vitamins: ['Vitamin B1'],
    minerals: ['Iron'],
    healthScore: 25,
    isVegetarian: true,
    allergens: ['Gluten']
  },
  gajar_halwa: {
    name: 'Gajar Halwa',
    nameHindi: 'गाजर का हलवा',
    category: 'Dessert',
    servingSize: '1 bowl (150g)',
    calories: 340,
    protein: 6,
    carbs: 42,
    fats: 16,
    fiber: 3,
    sodium: 100,
    vitamins: ['Vitamin A', 'Vitamin D', 'Vitamin E'],
    minerals: ['Calcium', 'Potassium', 'Iron'],
    healthScore: 52,
    isVegetarian: true,
    allergens: ['Dairy', 'Nuts']
  }
};

// ============================================
// COMPLETE DATABASE EXPORT
// ============================================
export const indianFoodDatabase = {
  ...mainDishes,
  ...breakfastItems,
  ...snacks,
  ...beverages,
  ...breads,
  ...riceDishes,
  ...desserts
};

// Get all foods as array
export const getAllFoods = () => Object.values(indianFoodDatabase);

// Search foods by name
export const searchFood = (query) => {
  const lowerQuery = query.toLowerCase();
  return getAllFoods().filter(food => 
    food.name.toLowerCase().includes(lowerQuery) ||
    food.nameHindi.includes(query)
  );
};

// Get foods by category
export const getFoodsByCategory = (category) => {
  return getAllFoods().filter(food => food.category === category);
};

// Get vegetarian foods only
export const getVegetarianFoods = () => {
  return getAllFoods().filter(food => food.isVegetarian);
};

// Get high protein foods (>10g per serving)
export const getHighProteinFoods = () => {
  return getAllFoods().filter(food => food.protein >= 10);
};

// Get healthy foods (health score >= 80)
export const getHealthyFoods = () => {
  return getAllFoods().filter(food => food.healthScore >= 80);
};

// Calculate nutrition for quantity
export const calculateNutrition = (foodId, quantity = 1) => {
  const food = indianFoodDatabase[foodId];
  if (!food) return null;
  
  return {
    ...food,
    calories: Math.round(food.calories * quantity),
    protein: Math.round(food.protein * quantity * 10) / 10,
    carbs: Math.round(food.carbs * quantity * 10) / 10,
    fats: Math.round(food.fats * quantity * 10) / 10,
    fiber: Math.round(food.fiber * quantity * 10) / 10
  };
};
