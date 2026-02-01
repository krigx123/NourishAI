import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// ====== INDIAN FOOD DETECTION - PRIORITY-BASED SYSTEM ======

// LEVEL 1: SPECIFIC INDIAN DISHES (highest priority - never downgrade)
const SPECIFIC_DISHES = {
  // Curries with specific names
  'chana masala': { name: 'Chana Masala', type: 'CURRY', priority: 1 },
  'chole': { name: 'Chole', type: 'CURRY', priority: 1 },
  'rajma': { name: 'Rajma', type: 'CURRY', priority: 1 },
  'paneer butter masala': { name: 'Paneer Butter Masala', type: 'CURRY', priority: 1 },
  'butter chicken': { name: 'Butter Chicken', type: 'CURRY', priority: 1 },
  'dal makhani': { name: 'Dal Makhani', type: 'DAL', priority: 1 },
  'palak paneer': { name: 'Palak Paneer', type: 'CURRY', priority: 1 },
  'aloo gobi': { name: 'Aloo Gobi', type: 'CURRY', priority: 1 },
  'ghugni': { name: 'Ghugni', type: 'CURRY', priority: 1 },
  'malai kofta': { name: 'Malai Kofta', type: 'CURRY', priority: 1 },
  'kadai paneer': { name: 'Kadai Paneer', type: 'CURRY', priority: 1 },
  'shahi paneer': { name: 'Shahi Paneer', type: 'CURRY', priority: 1 },
  'matar paneer': { name: 'Matar Paneer', type: 'CURRY', priority: 1 },
  'baingan bharta': { name: 'Baingan Bharta', type: 'CURRY', priority: 1 },
  'sambar': { name: 'Sambar', type: 'CURRY', priority: 1 },
  'rasam': { name: 'Rasam', type: 'CURRY', priority: 1 },
  'korma': { name: 'Korma', type: 'CURRY', priority: 1 },
  'biryani': { name: 'Biryani', type: 'RICE_DISH', priority: 1 },
  'pulao': { name: 'Pulao', type: 'RICE_DISH', priority: 1 },
  // Specific breads
  'puri': { name: 'Puri', type: 'FRIED_BREAD', priority: 1 },
  'bhatura': { name: 'Bhatura', type: 'FRIED_BREAD', priority: 1 },
  'paratha': { name: 'Paratha', type: 'STUFFED_BREAD', priority: 1 },
  'aloo paratha': { name: 'Aloo Paratha', type: 'STUFFED_BREAD', priority: 1 },
  'naan': { name: 'Naan', type: 'BREAD', priority: 1 },
  // Snacks
  'dosa': { name: 'Dosa', type: 'SNACK', priority: 1 },
  'idli': { name: 'Idli', type: 'SNACK', priority: 1 },
  'vada': { name: 'Vada', type: 'SNACK', priority: 1 },
  'uttapam': { name: 'Uttapam', type: 'SNACK', priority: 1 }
};

// LEVEL 2: BREAD TYPES (with disambiguation)
const BREAD_TYPES = {
  'puri': { name: 'Puri', category: 'FRIED_BREAD' },
  'bhatura': { name: 'Bhatura', category: 'FRIED_BREAD' },
  'naan': { name: 'Naan', category: 'LEAVENED_BREAD' },
  'kulcha': { name: 'Kulcha', category: 'LEAVENED_BREAD' },
  'paratha': { name: 'Paratha', category: 'STUFFED_BREAD' },
  'roti': { name: 'Roti', category: 'FLAT_BREAD' },
  'chapati': { name: 'Roti', category: 'FLAT_BREAD' },
  'phulka': { name: 'Roti', category: 'FLAT_BREAD' },
  'flatbread': { name: 'Roti', category: 'FLAT_BREAD' },
  'jolada rotti': { name: 'Roti', category: 'FLAT_BREAD' },
  'bajra roti': { name: 'Bajra Roti', category: 'FLAT_BREAD' },
  'bhakri': { name: 'Bhakri', category: 'FLAT_BREAD' }
};

// Generic category keywords (lowest priority)
const GENERIC_CURRY_KEYWORDS = ['curry', 'stew', 'gravy', 'masala'];
const GENERIC_DAL_KEYWORDS = ['dal', 'daal', 'lentil'];
const SKIP_LABELS = ['food', 'ingredient', 'recipe', 'dish', 'meal', 'cuisine', 'staple food', 'breakfast', 'lunch', 'dinner'];

/**
 * Detect specific dishes from labels with confidence
 */
function detectSpecificDishes(labels) {
  const detected = [];
  
  for (const label of labels) {
    const lower = label.name.toLowerCase();
    
    // Check for specific dishes
    for (const [key, dish] of Object.entries(SPECIFIC_DISHES)) {
      if (lower.includes(key) || key.includes(lower)) {
        detected.push({
          ...dish,
          confidence: label.confidence,
          original: label.name
        });
      }
    }
  }
  
  // Sort by confidence
  return detected.sort((a, b) => b.confidence - a.confidence);
}

/**
 * Detect bread type from labels
 */
function detectBreadType(labels) {
  for (const label of labels) {
    const lower = label.name.toLowerCase();
    
    // Check specific bread types first
    for (const [key, bread] of Object.entries(BREAD_TYPES)) {
      if (lower === key || lower.includes(key)) {
        return { ...bread, confidence: label.confidence };
      }
    }
  }
  return null;
}

/**
 * Check if generic curry is present (but no specific dish)
 */
function hasGenericCurry(labels) {
  return labels.some(l => 
    GENERIC_CURRY_KEYWORDS.some(kw => l.name.toLowerCase().includes(kw))
  );
}

/**
 * Check if dal is present
 */
function hasDal(labels) {
  return labels.some(l => 
    GENERIC_DAL_KEYWORDS.some(kw => l.name.toLowerCase().includes(kw))
  );
}

/**
 * MAIN PROCESSING FUNCTION - Priority-based detection
 */
function processIndianMeal(labels) {
  // Filter out generic labels
  const relevantLabels = labels.filter(l => 
    !SKIP_LABELS.includes(l.name.toLowerCase())
  );
  
  // Step 1: Detect SPECIFIC dishes (Level 1 - highest priority)
  const specificDishes = detectSpecificDishes(relevantLabels);
  
  // Step 2: Detect bread type
  const breadType = detectBreadType(relevantLabels);
  
  // Step 3: Check for generic curry/dal
  const genericCurry = hasGenericCurry(relevantLabels);
  const dalPresent = hasDal(relevantLabels);
  
  // Decision logic
  let primaryMeal = null;
  let alternatives = [];
  let detectionNote = '';
  
  if (specificDishes.length > 0) {
    // LEVEL 1: Specific dish detected - use it!
    const mainDish = specificDishes[0];
    
    if (breadType && mainDish.type === 'CURRY') {
      primaryMeal = `${mainDish.name} + ${breadType.name}`;
      alternatives.push({ name: mainDish.name, confidence: 'high' });
      detectionNote = `Detected ${mainDish.original} with ${breadType.name}`;
    } else if (mainDish.type === 'RICE_DISH') {
      primaryMeal = mainDish.name;
      detectionNote = `Detected ${mainDish.original}`;
    } else {
      primaryMeal = mainDish.name;
      if (breadType) {
        primaryMeal = `${mainDish.name} + ${breadType.name}`;
      }
      detectionNote = `Detected ${mainDish.original}`;
    }
    
    // Add other specific dishes as alternatives
    specificDishes.slice(1, 3).forEach(d => {
      alternatives.push({ name: d.name, confidence: d.confidence > 80 ? 'high' : 'medium' });
    });
    
  } else if (breadType && (genericCurry || dalPresent)) {
    // LEVEL 2: Generic combination - bread + curry/dal
    if (dalPresent && !genericCurry) {
      primaryMeal = `Dal + ${breadType.name}`;
      alternatives.push({ name: `Sabzi + ${breadType.name}`, confidence: 'medium' });
    } else {
      primaryMeal = `Sabzi + ${breadType.name}`;
      alternatives.push({ name: `Dal + ${breadType.name}`, confidence: 'medium' });
    }
    detectionNote = `Detected ${breadType.name} with curry/dal`;
    
  } else if (breadType) {
    // Just bread detected
    primaryMeal = breadType.name;
    detectionNote = `Detected ${breadType.name}`;
    
  } else if (genericCurry || dalPresent) {
    // Just curry/dal detected
    primaryMeal = dalPresent ? 'Dal' : 'Sabzi';
    detectionNote = 'Detected curry/dal without bread';
    
  } else {
    // LEVEL 3: Neutral fallback - check for Indian context as qualifier
    const hasIndianContext = labels.some(l => {
      const lower = l.name.toLowerCase();
      return lower.includes('indian') || lower.includes('punjabi') || 
             lower.includes('south indian') || lower.includes('north indian');
    });
    
    // Neutral primary meal, Indian only as qualifier
    if (hasIndianContext) {
      primaryMeal = 'Mixed Meal';
      detectionNote = 'Indian-style cuisine detected';
      alternatives.push({ name: 'Home-style Meal', confidence: 'low' });
    } else {
      primaryMeal = 'Mixed Meal';
      detectionNote = 'Cuisine unclear';
      alternatives.push({ name: 'Prepared Food', confidence: 'low' });
    }
  }
  
  // Determine if we have strong Indian indicators
  const hasStrongIndianSignal = specificDishes.length > 0 || 
    (breadType && ['Roti', 'Naan', 'Paratha', 'Puri'].includes(breadType.name)) ||
    dalPresent;
  
  return {
    primaryMeal,
    alternatives,
    detectionNote,
    specificDishes: specificDishes.map(d => d.name),
    breadType: breadType?.name || null,
    hasGenericCurry: genericCurry,
    hasDal: dalPresent,
    isIndianMeal: hasStrongIndianSignal,
    processedLabels: relevantLabels.map(l => ({
      original: l.name,
      confidence: l.confidence
    }))
  };
}

// Middleware to verify JWT
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

/**
 * Detect food labels from image using Google Cloud Vision API
 */
router.post('/detect', authenticate, async (req, res) => {
  const { imageBase64 } = req.body;

  if (!imageBase64) {
    return res.status(400).json({ error: 'No image provided' });
  }

  const apiKey = process.env.GOOGLE_VISION_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Vision API key not configured' });
  }

  try {
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    console.log('📷 Vision API: Processing image...');

    const response = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requests: [{
            image: { content: base64Data },
            features: [{ type: 'LABEL_DETECTION', maxResults: 15 }]
          }]
        })
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ Vision API error:', error);
      return res.status(500).json({ error: 'Vision API request failed' });
    }

    const data = await response.json();
    const labels = data.responses?.[0]?.labelAnnotations || [];

    const foodLabels = labels
      .filter(l => l.score > 0.65)
      .map(l => ({
        name: l.description,
        confidence: Math.round(l.score * 100)
      }));

    if (foodLabels.length === 0) {
      return res.status(400).json({ 
        error: 'Could not detect food in image.' 
      });
    }

    // Apply priority-based Indian food detection
    const processed = processIndianMeal(foodLabels);
    console.log('📷 Detected:', processed);

    res.json({
      success: true,
      ...processed,
      rawLabels: foodLabels
    });

  } catch (error) {
    console.error('Vision detection error:', error);
    res.status(500).json({ error: 'Failed to detect food' });
  }
});

export default router;


