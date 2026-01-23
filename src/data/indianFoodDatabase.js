/**
 * Comprehensive Indian Food Database
 * Contains 100+ popular Indian foods matching the Custom Image Dataset
 * Values are calibrated averages based on standard Indian recipes and ICMR data.
 */

export const indianFoodDatabase = [
  // --- FROM DATASET (Hardcoded Matches) ---
  
  // MAIN COURSES & CURRIES
  { name: "Aloo Gobi", category: "Vegetable", calories: 180, protein: 4, carbs: 25, fat: 8, fiber: 5, serving: "1 cup (150g)", healthScore: 75, image: "🥦" },
  { name: "Aloo Matar", category: "Vegetable", calories: 200, protein: 6, carbs: 28, fat: 8, fiber: 5, serving: "1 cup (150g)", healthScore: 72, image: "🥘" },
  { name: "Aloo Methi", category: "Vegetable", calories: 170, protein: 4, carbs: 22, fat: 8, fiber: 5, serving: "1 cup (150g)", healthScore: 80, image: "🌿" },
  { name: "Aloo Shimla Mirch", category: "Vegetable", calories: 180, protein: 4, carbs: 24, fat: 8, fiber: 4, serving: "1 cup (150g)", healthScore: 78, image: "🫑" },
  { name: "Aloo Tikki", category: "Snacks", calories: 280, protein: 5, carbs: 35, fat: 14, fiber: 3, serving: "2 pieces", healthScore: 40, image: "🥔" }, 
  { name: "Bhindi Masala", category: "Vegetable", calories: 140, protein: 4, carbs: 16, fat: 8, fiber: 5, serving: "1 cup (150g)", healthScore: 82, image: "🥬" },
  { name: "Butter Chicken", category: "Non-Veg", calories: 450, protein: 25, carbs: 12, fat: 35, fiber: 2, serving: "1 cup (200g)", healthScore: 50, image: "🍗" },
  { name: "Chana Masala", category: "Vegetable", calories: 280, protein: 12, carbs: 40, fat: 9, fiber: 10, serving: "1 cup (200g)", healthScore: 80, image: "🍲" },
  { name: "Chicken Razala", category: "Non-Veg", calories: 340, protein: 28, carbs: 10, fat: 20, fiber: 1, serving: "1 cup (200g)", healthScore: 65, image: "🍗" },
  { name: "Chicken Tikka", category: "Non-Veg", calories: 280, protein: 35, carbs: 5, fat: 12, fiber: 1, serving: "6 pieces", healthScore: 75, image: "🍢" },
  { name: "Chicken Tikka Masala", category: "Non-Veg", calories: 380, protein: 28, carbs: 14, fat: 25, fiber: 2, serving: "1 cup (200g)", healthScore: 62, image: "🍗" },
  { name: "Daal Baati Churma", category: "Meal", calories: 900, protein: 22, carbs: 110, fat: 45, fiber: 12, serving: "1 full plate", healthScore: 40, image: "🍛" },
  { name: "Daal Puri", category: "Bread", calories: 300, protein: 8, carbs: 40, fat: 12, fiber: 4, serving: "2 puris", healthScore: 55, image: "🫓" },
  { name: "Dal Makhani", category: "Dal", calories: 350, protein: 12, carbs: 35, fat: 18, fiber: 8, serving: "1 cup (200g)", healthScore: 60, image: "🍲" },
  { name: "Dal Tadka", category: "Dal", calories: 220, protein: 10, carbs: 28, fat: 8, fiber: 7, serving: "1 cup (200g)", healthScore: 85, image: "🥣" },
  { name: "Dum Aloo", category: "Vegetable", calories: 300, protein: 5, carbs: 35, fat: 16, fiber: 4, serving: "1 cup (200g)", healthScore: 60, image: "🥔" },
  { name: "Kadai Paneer", category: "Paneer", calories: 360, protein: 16, carbs: 12, fat: 28, fiber: 3, serving: "1 cup (200g)", healthScore: 65, image: "🧀" },
  { name: "Kadhi Pakoda", category: "Dal", calories: 280, protein: 8, carbs: 25, fat: 16, fiber: 2, serving: "1 cup (200g)", healthScore: 60, image: "🥣" },
  { name: "Karela Bharta", category: "Vegetable", calories: 160, protein: 4, carbs: 20, fat: 8, fiber: 6, serving: "1 cup", healthScore: 85, image: "🥗" },
  { name: "Litti Chokha", category: "Meal", calories: 550, protein: 16, carbs: 85, fat: 18, fiber: 10, serving: "2 pieces + chokha", healthScore: 70, image: "🍘" },
  { name: "Maach Jhol", category: "Non-Veg", calories: 250, protein: 24, carbs: 8, fat: 14, fiber: 1, serving: "1 cup (200g)", healthScore: 80, image: "🐟" },
  { name: "Makki Di Roti Sarson Da Saag", category: "Meal", calories: 550, protein: 14, carbs: 65, fat: 28, fiber: 9, serving: "1 plate", healthScore: 70, image: "🥬" },
  { name: "Navrattan Korma", category: "Vegetable", calories: 320, protein: 8, carbs: 30, fat: 20, fiber: 5, serving: "1 cup (200g)", healthScore: 60, image: "🥘" },
  { name: "Palak Paneer", category: "Paneer", calories: 300, protein: 16, carbs: 10, fat: 22, fiber: 6, serving: "1 cup (200g)", healthScore: 75, image: "🧀" },
  { name: "Paneer Sabzi", category: "Paneer", calories: 290, protein: 15, carbs: 12, fat: 20, fiber: 2, serving: "1 cup (200g)", healthScore: 70, image: "🧀" },
  { name: "Chole Bhature", category: "Meal", calories: 850, protein: 22, carbs: 100, fat: 42, fiber: 12, serving: "2 bhature + chole", healthScore: 30, image: "🫓" },
  { name: "Dal", category: "Dal", calories: 180, protein: 9, carbs: 25, fat: 5, fiber: 6, serving: "1 cup (200g)", healthScore: 88, image: "🍲" },
  { name: "Kofta", category: "Vegetable", calories: 350, protein: 8, carbs: 28, fat: 24, fiber: 4, serving: "2 koftas + gravy", healthScore: 50, image: "🧆" },
  
  // BREADS / RICE
  { name: "Bhatura", category: "Bread", calories: 290, protein: 7, carbs: 45, fat: 11, fiber: 2, serving: "1 piece", healthScore: 40, image: "🫓" },
  { name: "Biryani", category: "Rice", calories: 450, protein: 18, carbs: 55, fat: 18, fiber: 4, serving: "1.5 cups (300g)", healthScore: 55, image: "🍛" },
  { name: "Butter Naan", category: "Bread", calories: 340, protein: 9, carbs: 50, fat: 12, fiber: 3, serving: "1 naan", healthScore: 50, image: "🫓" },
  { name: "Chapati", category: "Bread", calories: 104, protein: 3, carbs: 20, fat: 1, fiber: 3, serving: "1 roti (medium)", healthScore: 85, image: "🫓" },
  { name: "Dosa", category: "Breakfast", calories: 220, protein: 5, carbs: 38, fat: 6, fiber: 2, serving: "1 plain dosa", healthScore: 70, image: "🥞" },
  { name: "Misi Roti", category: "Bread", calories: 180, protein: 6, carbs: 30, fat: 5, fiber: 4, serving: "1 roti", healthScore: 80, image: "🫓" },
  { name: "Pizza", category: "Snacks", calories: 300, protein: 12, carbs: 35, fat: 12, fiber: 3, serving: "1 slice", healthScore: 40, image: "🍕" },
  
  // SNACKS
  { name: "Dabeli", category: "Snacks", calories: 300, protein: 6, carbs: 45, fat: 12, fiber: 4, serving: "1 piece", healthScore: 50, image: "🍔" },
  { name: "Dhokla", category: "Snacks", calories: 160, protein: 6, carbs: 25, fat: 4, fiber: 3, serving: "4 pieces", healthScore: 80, image: "🧊" },
  { name: "Kathi", category: "Snacks", calories: 450, protein: 18, carbs: 40, fat: 22, fiber: 3, serving: "1 roll", healthScore: 50, image: "🌯" },
  { name: "Kuzhi Paniyaram", category: "Snacks", calories: 200, protein: 5, carbs: 32, fat: 6, fiber: 2, serving: "5 pieces", healthScore: 75, image: "⚪" },
  { name: "Momos", category: "Snacks", calories: 250, protein: 8, carbs: 40, fat: 6, fiber: 2, serving: "6 pieces (steamed)", healthScore: 65, image: "🥟" },
  { name: "Pakora", category: "Snacks", calories: 300, protein: 6, carbs: 25, fat: 20, fiber: 3, serving: "6 pieces", healthScore: 40, image: "🧆" },
  { name: "Pani Puri", category: "Snacks", calories: 220, protein: 4, carbs: 42, fat: 6, fiber: 3, serving: "6 pieces", healthScore: 60, image: "🟢" },
  { name: "Pav Bhaji", category: "Snacks", calories: 600, protein: 14, carbs: 80, fat: 22, fiber: 8, serving: "2 pav + bhaji", healthScore: 50, image: "🍞" },
  { name: "Samosa", category: "Snacks", calories: 260, protein: 4, carbs: 25, fat: 16, fiber: 2, serving: "1 piece (large)", healthScore: 35, image: "🔺" },
  { name: "Vada Pav", category: "Snacks", calories: 350, protein: 9, carbs: 50, fat: 14, fiber: 4, serving: "1 piece", healthScore: 45, image: "🍔" },

  // SWEETS
  { name: "Adhirasam", category: "Sweets", calories: 250, protein: 2, carbs: 40, fat: 10, fiber: 1, serving: "1 piece", healthScore: 30, image: "🍩" },
  { name: "Anarsa", category: "Sweets", calories: 200, protein: 2, carbs: 30, fat: 8, fiber: 0, serving: "1 piece", healthScore: 35, image: "🍪" },
  { name: "Ariselu", category: "Sweets", calories: 220, protein: 2, carbs: 35, fat: 9, fiber: 0, serving: "1 piece", healthScore: 35, image: "🍪" },
  { name: "Bandar Laddu", category: "Sweets", calories: 220, protein: 3, carbs: 35, fat: 10, fiber: 1, serving: "1 laddu", healthScore: 30, image: "🟡" },
  { name: "Basundi", category: "Sweets", calories: 350, protein: 10, carbs: 40, fat: 18, fiber: 0, serving: "1 cup", healthScore: 40, image: "🥣" },
  { name: "Boondi", category: "Sweets", calories: 300, protein: 3, carbs: 35, fat: 18, fiber: 1, serving: "1 cup", healthScore: 25, image: "🟡" },
  { name: "Chak Hao Kheer", category: "Sweets", calories: 280, protein: 6, carbs: 45, fat: 8, fiber: 2, serving: "1 cup", healthScore: 55, image: "🍚" },
  { name: "Cham Cham", category: "Sweets", calories: 210, protein: 5, carbs: 35, fat: 6, fiber: 0, serving: "1 piece", healthScore: 35, image: "🍬" },
  { name: "Chhena Kheeri", category: "Sweets", calories: 250, protein: 8, carbs: 35, fat: 9, fiber: 0, serving: "1 cup", healthScore: 50, image: "🥣" },
  { name: "Chikki", category: "Sweets", calories: 150, protein: 4, carbs: 20, fat: 8, fiber: 2, serving: "1 piece", healthScore: 60, image: "🥜" },
  { name: "Dharwad Pedha", category: "Sweets", calories: 190, protein: 4, carbs: 28, fat: 8, fiber: 0, serving: "1 piece", healthScore: 35, image: "🟤" },
  { name: "Doodhpak", category: "Sweets", calories: 300, protein: 8, carbs: 40, fat: 12, fiber: 0, serving: "1 cup", healthScore: 45, image: "🥣" },
  { name: "Double Ka Meetha", category: "Sweets", calories: 450, protein: 6, carbs: 65, fat: 20, fiber: 2, serving: "1 cup", healthScore: 15, image: "🍞" },
  { name: "Gajar Ka Halwa", category: "Sweets", calories: 350, protein: 5, carbs: 50, fat: 16, fiber: 4, serving: "1 cup", healthScore: 45, image: "🥕" },
  { name: "Gavvalu", category: "Sweets", calories: 200, protein: 2, carbs: 30, fat: 8, fiber: 0, serving: "4 pieces", healthScore: 35, image: "🐚" },
  { name: "Ghevar", category: "Sweets", calories: 450, protein: 5, carbs: 55, fat: 25, fiber: 0, serving: "1 piece (medium)", healthScore: 15, image: "🍩" },
  { name: "Gulab Jamun", category: "Sweets", calories: 300, protein: 4, carbs: 45, fat: 12, fiber: 1, serving: "2 pieces", healthScore: 25, image: "🟤" },
  { name: "Imarti", category: "Sweets", calories: 250, protein: 2, carbs: 45, fat: 8, fiber: 0, serving: "1 piece", healthScore: 25, image: "🥨" },
  { name: "Jalebi", category: "Sweets", calories: 300, protein: 2, carbs: 50, fat: 12, fiber: 0, serving: "3 pieces", healthScore: 20, image: "🥨" },
  { name: "Kachori", category: "Snacks", calories: 320, protein: 6, carbs: 35, fat: 18, fiber: 3, serving: "1 piece", healthScore: 35, image: "🥟" },
  { name: "Kajjikaya", category: "Sweets", calories: 250, protein: 3, carbs: 38, fat: 10, fiber: 2, serving: "1 piece", healthScore: 40, image: "🥟" },
  { name: "Kakinada Khaja", category: "Sweets", calories: 300, protein: 2, carbs: 45, fat: 14, fiber: 0, serving: "1 piece", healthScore: 20, image: "🥨" },
  { name: "Kalakand", category: "Sweets", calories: 220, protein: 6, carbs: 28, fat: 10, fiber: 0, serving: "1 piece", healthScore: 40, image: "⬜" },
  { name: "Lassi", category: "Beverages", calories: 250, protein: 8, carbs: 35, fat: 10, fiber: 0, serving: "1 glass (sweet)", healthScore: 55, image: "🥛" },
  { name: "Ledikeni", category: "Sweets", calories: 200, protein: 4, carbs: 30, fat: 8, fiber: 0, serving: "1 piece", healthScore: 30, image: "🟤" },
  { name: "Lyangcha", category: "Sweets", calories: 220, protein: 4, carbs: 32, fat: 9, fiber: 0, serving: "1 piece", healthScore: 30, image: "🌭" },
  { name: "Malapua", category: "Sweets", calories: 280, protein: 4, carbs: 40, fat: 12, fiber: 0, serving: "1 piece", healthScore: 25, image: "🥞" },
  { name: "Misti Doi", category: "Sweets", calories: 220, protein: 7, carbs: 30, fat: 8, fiber: 0, serving: "1 cup (small)", healthScore: 60, image: "🍯" },
  { name: "Modak", category: "Sweets", calories: 180, protein: 3, carbs: 28, fat: 6, fiber: 1, serving: "1 piece", healthScore: 50, image: "🥟" },
  { name: "Mysore Pak", category: "Sweets", calories: 350, protein: 2, carbs: 35, fat: 24, fiber: 0, serving: "1 piece", healthScore: 20, image: "🟨" },
  { name: "Phirni", category: "Sweets", calories: 250, protein: 6, carbs: 35, fat: 10, fiber: 1, serving: "1 cup", healthScore: 50, image: "🍚" },
  { name: "Pithe", category: "Sweets", calories: 180, protein: 3, carbs: 32, fat: 5, fiber: 1, serving: "1 piece", healthScore: 50, image: "🥟" },
  { name: "Poornalu", category: "Sweets", calories: 220, protein: 4, carbs: 35, fat: 8, fiber: 2, serving: "1 piece", healthScore: 45, image: "🟡" },
  { name: "Pootharekulu", category: "Sweets", calories: 180, protein: 2, carbs: 35, fat: 5, fiber: 0, serving: "1 piece", healthScore: 50, image: "📜" },
  { name: "Qubani Ka Meetha", category: "Sweets", calories: 280, protein: 3, carbs: 55, fat: 6, fiber: 4, serving: "1 cup", healthScore: 55, image: "🍑" },
  { name: "Rabri", category: "Sweets", calories: 380, protein: 10, carbs: 40, fat: 20, fiber: 0, serving: "1 cup", healthScore: 35, image: "🥣" },
  { name: "Ras Malai", category: "Sweets", calories: 250, protein: 8, carbs: 30, fat: 12, fiber: 0, serving: "2 pieces", healthScore: 45, image: "🥣" },
  { name: "Rasgulla", category: "Sweets", calories: 180, protein: 4, carbs: 35, fat: 2, fiber: 0, serving: "2 pieces", healthScore: 55, image: "⚪" },
  { name: "Sandesh", category: "Sweets", calories: 160, protein: 5, carbs: 22, fat: 5, fiber: 0, serving: "1 piece", healthScore: 60, image: "⬜" },
  { name: "Shankarpali", category: "Snacks", calories: 200, protein: 2, carbs: 28, fat: 9, fiber: 0, serving: "10 pieces", healthScore: 40, image: "🔶" },
  { name: "Sheer Korma", category: "Sweets", calories: 300, protein: 7, carbs: 40, fat: 14, fiber: 1, serving: "1 cup", healthScore: 45, image: "🍜" },
  { name: "Sheera", category: "Sweets", calories: 320, protein: 4, carbs: 45, fat: 15, fiber: 2, serving: "1 cup", healthScore: 35, image: "🍮" },
  { name: "Shrikhand", category: "Sweets", calories: 300, protein: 7, carbs: 40, fat: 14, fiber: 0, serving: "1 cup", healthScore: 50, image: "🥣" },
  { name: "Sohan Halwa", category: "Sweets", calories: 380, protein: 4, carbs: 50, fat: 20, fiber: 1, serving: "1 piece", healthScore: 20, image: "🟤" },
  { name: "Sohan Papdi", category: "Sweets", calories: 260, protein: 3, carbs: 38, fat: 12, fiber: 1, serving: "1 piece", healthScore: 30, image: "🧊" },
  { name: "Sutar Feni", category: "Sweets", calories: 220, protein: 2, carbs: 32, fat: 10, fiber: 0, serving: "1 serving", healthScore: 30, image: "🧶" },
  { name: "Tea", category: "Beverages", calories: 60, protein: 1, carbs: 10, fat: 2, fiber: 0, serving: "1 cup (milk tea)", healthScore: 70, image: "☕" },
  { name: "Unni Appam", category: "Sweets", calories: 180, protein: 2, carbs: 30, fat: 6, fiber: 1, serving: "2 pieces", healthScore: 50, image: "🍩" },
];

export function searchFoods(query) {
  if (!query || query.length < 2) return [];
  
  const normalizedQuery = query.toLowerCase().trim().replace(/_/g, ' ');
  
  return indianFoodDatabase
    .filter(food => 
      food.name.toLowerCase().includes(normalizedQuery) ||
      food.category.toLowerCase().includes(normalizedQuery)
    )
    .slice(0, 10);
}

export function getFoodByName(name) {
  const target = name.toLowerCase().replace(/_/g, ' ');
  return indianFoodDatabase.find(
    food => food.name.toLowerCase().replace(/_/g, ' ') === target
  );
}

export function getFoodsByCategory(category) {
  return indianFoodDatabase.filter(
    food => food.category.toLowerCase() === category.toLowerCase()
  );
}

export function getAllCategories() {
  return [...new Set(indianFoodDatabase.map(food => food.category))];
}

export function getRandomFoods(count = 5) {
  const shuffled = [...indianFoodDatabase].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export default indianFoodDatabase;