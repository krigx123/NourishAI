/**
 * Mock Data for NourishAI Demo
 * Updated with Indian foods and accurate nutritional data
 */

// Mock User Data
export const mockUser = {
  id: 1,
  name: 'Priya Sharma',
  email: 'priya@example.com',
  avatar: null,
  dietType: 'Vegetarian',
  allergies: ['Nuts'],
  goals: ['Weight Loss', 'Better Digestion'],
  age: 26,
  weight: 62,
  height: 160,
  activityLevel: 'Moderate',
  joinedDate: '2024-01-15'
};

// Dashboard Summary Data
export const dashboardSummary = {
  dailyCalories: {
    consumed: 1650,
    goal: 1800,
    percentage: 92
  },
  nutritionScore: 85,
  healthStatus: 'Excellent',
  waterIntake: {
    current: 7,
    goal: 8
  },
  streak: 14
};

// Weekly Nutrition Data for Charts
export const weeklyNutritionData = [
  { day: 'Mon', calories: 1780, protein: 58, carbs: 245, fats: 52 },
  { day: 'Tue', calories: 1650, protein: 52, carbs: 228, fats: 48 },
  { day: 'Wed', calories: 1820, protein: 62, carbs: 252, fats: 55 },
  { day: 'Thu', calories: 1580, protein: 48, carbs: 218, fats: 45 },
  { day: 'Fri', calories: 1750, protein: 55, carbs: 242, fats: 51 },
  { day: 'Sat', calories: 1920, protein: 65, carbs: 265, fats: 58 },
  { day: 'Sun', calories: 1680, protein: 52, carbs: 232, fats: 49 }
];

// Monthly Progress Data
export const monthlyProgressData = [
  { week: 'Week 1', weight: 64, calories: 12600 },
  { week: 'Week 2', weight: 63.2, calories: 12200 },
  { week: 'Week 3', weight: 62.5, calories: 11800 },
  { week: 'Week 4', weight: 62, calories: 11500 }
];

// Sample Meal Analysis Results (Indian Food)
export const mealAnalysisResults = {
  foodName: 'Palak Paneer with Roti',
  calories: 410,
  protein: 18,
  carbs: 32,
  fats: 24,
  fiber: 7,
  healthScore: 84,
  vitamins: ['Vitamin A', 'Vitamin K', 'Vitamin C', 'Vitamin B12'],
  minerals: ['Calcium', 'Iron', 'Magnesium'],
  suggestions: [
    'Excellent source of calcium and iron',
    'Rich in antioxidants from spinach',
    'Consider using low-fat paneer to reduce calories'
  ]
};

// Macro Distribution for Pie Chart
export const macroDistribution = [
  { name: 'Protein', value: 18, color: '#10b981' },
  { name: 'Carbs', value: 32, color: '#3b82f6' },
  { name: 'Fats', value: 24, color: '#f59e0b' },
  { name: 'Fiber', value: 7, color: '#8b5cf6' }
];

// Indian Diet Plans
export const dietPlans = {
  weightLoss: {
    name: 'Weight Loss Plan',
    calories: 1600,
    description: 'A balanced Indian vegetarian diet for sustainable weight loss with high protein and fiber',
    meals: {
      breakfast: {
        name: 'Moong Dal Chilla with Mint Chutney',
        calories: 280,
        items: ['Moong Dal Chilla (2 pcs)', 'Mint Chutney', 'Green Tea'],
        time: '8:00 AM',
        protein: 14,
        carbs: 32,
        fats: 8
      },
      lunch: {
        name: 'Dal Tadka with Brown Rice & Salad',
        calories: 420,
        items: ['Dal Tadka (1 bowl)', 'Brown Rice (1 katori)', 'Cucumber Raita', 'Mixed Salad'],
        time: '1:00 PM',
        protein: 16,
        carbs: 62,
        fats: 10
      },
      snack: {
        name: 'Sprouts Chaat & Chaach',
        calories: 165,
        items: ['Sprouts Chaat (1 bowl)', 'Masala Chaach (1 glass)'],
        time: '4:30 PM',
        protein: 11,
        carbs: 24,
        fats: 3
      },
      dinner: {
        name: 'Palak Paneer with Multigrain Roti',
        calories: 380,
        items: ['Palak Paneer (1 bowl)', 'Multigrain Roti (2 pcs)', 'Onion Salad'],
        time: '7:30 PM',
        protein: 16,
        carbs: 35,
        fats: 18
      }
    }
  },
  muscleGain: {
    name: 'Muscle Gain Plan',
    calories: 2400,
    description: 'High protein Indian diet plan for muscle building and strength',
    meals: {
      breakfast: {
        name: 'Paneer Bhurji with Paratha',
        calories: 550,
        items: ['Paneer Bhurji (150g)', 'Aloo Paratha (2 pcs)', 'Curd (1 katori)', 'Banana'],
        time: '7:30 AM',
        protein: 28,
        carbs: 58,
        fats: 22
      },
      lunch: {
        name: 'Rajma Chawal with Raita',
        calories: 620,
        items: ['Rajma (1.5 bowls)', 'Basmati Rice (1.5 katori)', 'Boondi Raita', 'Papad'],
        time: '12:30 PM',
        protein: 22,
        carbs: 85,
        fats: 18
      },
      snack: {
        name: 'Protein Lassi & Roasted Chana',
        calories: 320,
        items: ['Sweet Lassi (1 large)', 'Roasted Chana (50g)', 'Dates (4 pcs)'],
        time: '4:00 PM',
        protein: 18,
        carbs: 42,
        fats: 8
      },
      dinner: {
        name: 'Chole with Bhature & Salad',
        calories: 680,
        items: ['Chole (2 bowls)', 'Bhature (2 pcs)', 'Onion with Lemon', 'Pickle'],
        time: '8:00 PM',
        protein: 24,
        carbs: 92,
        fats: 24
      }
    }
  },
  healthyLiving: {
    name: 'Healthy Living Plan',
    calories: 1800,
    description: 'Balanced nutrition for overall wellness with traditional Indian superfoods',
    meals: {
      breakfast: {
        name: 'Idli Sambar with Coconut Chutney',
        calories: 350,
        items: ['Idli (4 pcs)', 'Sambar (1 bowl)', 'Coconut Chutney', 'Filter Coffee'],
        time: '8:00 AM',
        protein: 12,
        carbs: 58,
        fats: 8
      },
      lunch: {
        name: 'Vegetable Khichdi & Kadhi',
        calories: 420,
        items: ['Moong Dal Khichdi (1.5 katori)', 'Kadhi (1 bowl)', 'Papad', 'Pickle'],
        time: '1:00 PM',
        protein: 16,
        carbs: 62,
        fats: 12
      },
      snack: {
        name: 'Roasted Makhana & Green Tea',
        calories: 150,
        items: ['Roasted Makhana (30g)', 'Mixed Dry Fruits (15g)', 'Green Tea'],
        time: '5:00 PM',
        protein: 6,
        carbs: 22,
        fats: 4
      },
      dinner: {
        name: 'Mix Vegetable Curry with Bajra Roti',
        calories: 380,
        items: ['Mix Veg Curry (1 bowl)', 'Bajra Roti (2 pcs)', 'Curd Rice (small)'],
        time: '7:30 PM',
        protein: 12,
        carbs: 52,
        fats: 14
      }
    }
  }
};

// Health Insights
export const healthInsights = [
  {
    id: 1,
    type: 'warning',
    title: 'Low Protein Intake',
    message: 'Your protein intake was 18% below target yesterday. Consider adding paneer, dal, or sprouts to your meals.',
    priority: 'medium'
  },
  {
    id: 2,
    type: 'success',
    title: 'Hydration Goal Met',
    message: 'Excellent! You\'ve met your water intake goal for 7 consecutive days.',
    priority: 'low'
  },
  {
    id: 3,
    type: 'info',
    title: 'Iron Boost Needed',
    message: 'Adding palak, methi or beetroot to your diet can help improve iron levels.',
    priority: 'low'
  },
  {
    id: 4,
    type: 'warning',
    title: 'High Oil Consumption',
    message: 'Yesterday\'s oil intake was above recommended levels. Try steaming or grilling instead.',
    priority: 'high'
  },
  {
    id: 5,
    type: 'success',
    title: 'Fiber Goal Achieved',
    message: 'Your fiber intake from vegetables and whole grains has been consistent this week.',
    priority: 'low'
  }
];

// AI Health Tips (Indian context)
export const healthTips = [
  'Start your day with warm lemon water to boost metabolism and digestion.',
  'Include a variety of dals in your diet for complete protein intake.',
  'Buttermilk (chaach) after meals aids digestion and provides probiotics.',
  'Seasonal fruits like papaya and guava are excellent for vitamin C.',
  'Reduce refined sugar - use jaggery or natural sweeteners in moderation.',
  'Include haldi (turmeric) milk before bed for better immunity and sleep.'
];

// Admin Dashboard Stats
export const adminStats = {
  totalUsers: 15842,
  activeToday: 4256,
  mealsLogged: 52340,
  averageScore: 76,
  newUsersThisWeek: 428,
  retention: 87
};

// User Activity Data for Admin
export const userActivityData = [
  { month: 'Jan', users: 9800, meals: 38000 },
  { month: 'Feb', users: 10500, meals: 42000 },
  { month: 'Mar', users: 11800, meals: 46500 },
  { month: 'Apr', users: 13200, meals: 49000 },
  { month: 'May', users: 14500, meals: 51000 },
  { month: 'Jun', users: 15842, meals: 52340 }
];

// Feature Cards for Landing Page (without emojis - use icons in component)
export const features = [
  {
    id: 'mealAnalysis',
    title: 'Meal Analysis',
    description: 'Capture food photos or enter meals manually to get instant AI-powered nutritional breakdown for Indian cuisine.'
  },
  {
    id: 'nutritionTracking',
    title: 'Nutrition Tracking',
    description: 'Track daily and weekly nutrition with beautiful charts and progress indicators tailored to Indian dietary patterns.'
  },
  {
    id: 'personalizedPlans',
    title: 'Personalized Plans',
    description: 'Get AI-generated diet plans with Indian foods tailored to your goals - weight loss, muscle gain, or wellness.'
  },
  {
    id: 'healthInsights',
    title: 'Health Insights',
    description: 'Receive personalized tips based on Ayurvedic principles and modern nutrition science.'
  },
  {
    id: 'progressTracking',
    title: 'Progress Tracking',
    description: 'Monitor your journey with detailed analytics and celebrate your health achievements.'
  },
  {
    id: 'aiAssistant',
    title: 'AI Assistant',
    description: 'Get instant answers to nutrition questions about Indian foods from our intelligent AI assistant.'
  }
];

// Sample Indian Foods for Meal Analysis Demo
export const sampleFoods = [
  { name: 'Idli Sambar', calories: 280, protein: 10, carbs: 52, fats: 4 },
  { name: 'Masala Dosa', calories: 320, protein: 8, carbs: 48, fats: 12 },
  { name: 'Dal Tadka', calories: 150, protein: 9, carbs: 20, fats: 4 },
  { name: 'Palak Paneer', calories: 290, protein: 14, carbs: 10, fats: 22 },
  { name: 'Rajma Chawal', calories: 420, protein: 15, carbs: 72, fats: 8 },
  { name: 'Curd Rice', calories: 280, protein: 8, carbs: 48, fats: 6 }
];
