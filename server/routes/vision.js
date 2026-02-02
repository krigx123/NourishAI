import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// ====== INDIAN FOOD DETECTION - PRIORITY-BASED SYSTEM ======

// LEVEL 1: SPECIFIC INDIAN DISHES (highest priority - never downgrade)
// Generic category keywords (lowest priority)
const GENERIC_CURRY_KEYWORDS = ['curry', 'stew', 'gravy', 'masala'];
const GENERIC_DAL_KEYWORDS = ['dal', 'daal', 'lentil'];
const SKIP_LABELS = [
  'food', 'ingredient', 'recipe', 'dish', 'meal', 'cuisine', 'staple food', 
  'breakfast', 'lunch', 'dinner', 'cooking', 'tableware', 'dishware', 
  'plate', 'bowl', 'natural foods', 'comfort food', 'fast food', 
  'produce', 'vegetable', 'fruit', 'serveware', 'condiment', 'garnish',
  // Colors to skip
  'yellow', 'orange', 'red', 'green', 'blue', 'purple', 'black', 'white', 'brown', 'pink', 'color'
];

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
 * MAIN PROCESSING FUNCTION - AI Confidence Based Detection
 */
function processIndianMeal(labels) {
  // Filter out generic labels
  const relevantLabels = labels.filter(l => 
    !SKIP_LABELS.includes(l.name.toLowerCase())
  );
  
  // Indian bread types to detect
  const BREAD_KEYWORDS = ['puri', 'poori', 'roti', 'chapati', 'naan', 'paratha', 'bhature', 'kulcha', 'bhakri', 'jolada rotti'];
  
  // Curry/sabji types to detect  
  const CURRY_KEYWORDS = ['masala', 'curry', 'dal', 'sabji', 'sabzi', 'korma', 'paneer', 'biryani', 'pulao'];
  
  // Rice types
  const RICE_KEYWORDS = ['rice', 'biryani', 'pulao', 'khichdi', 'fried rice'];
  
  // Decision logic
  let primaryMeal = null;
  let alternatives = [];
  let detectionNote = '';
  let detectedItems = [];

  // Search ALL labels (not filtered) for curry/bread to be more inclusive
  // Find curry/main dish item
  const curryItem = labels.find(l => 
    CURRY_KEYWORDS.some(kw => l.name.toLowerCase().includes(kw))
  );
  
  // Find bread item - search all labels to catch Puri, Roti etc even if filtered
  const breadItem = labels.find(l => 
    BREAD_KEYWORDS.some(kw => l.name.toLowerCase().includes(kw))
  );
  
  // Find rice item
  const riceItem = labels.find(l => 
    RICE_KEYWORDS.some(kw => l.name.toLowerCase().includes(kw)) &&
    !l.name.toLowerCase().includes('masala')
  );
  
  console.log('📷 Multi-food detection:', { curry: curryItem?.name, bread: breadItem?.name, rice: riceItem?.name });

  // Check for Indian Context
  const hasIndianContext = labels.some(l => {
    const lower = l.name.toLowerCase();
    return lower.includes('indian') || lower.includes('punjabi') || 
           lower.includes('south indian') || lower.includes('north indian') ||
           lower.includes('masala') || lower.includes('curry');
  });

  const genericCurry = hasGenericCurry(relevantLabels);
  const dalPresent = hasDal(relevantLabels);

  // BUILD MULTI-ITEM PRIMARY MEAL
  if (curryItem) {
    let name = curryItem.name;
    // Rename generic labels to Dal for better UX (e.g. Curry + Chapati -> Dal + Chapati)
    const lowerName = name.toLowerCase();
    if (['curry', 'stew', 'gravy', 'legume'].includes(lowerName)) {
      name = 'Dal';
    }
    detectedItems.push(name);
  }
  if (breadItem && (!curryItem || breadItem.name.toLowerCase() !== curryItem?.name.toLowerCase())) {
    detectedItems.push(breadItem.name);
  }
  if (riceItem && detectedItems.length < 3) {
    detectedItems.push(riceItem.name);
  }

  // Combine detected items
  if (detectedItems.length >= 2) {
    // Multiple items detected - combine them
    primaryMeal = detectedItems.join(' + ');
    detectionNote = `Detected ${detectedItems.length} items: ${detectedItems.join(', ')}`;
  } else if (detectedItems.length === 1) {
    primaryMeal = detectedItems[0];
    detectionNote = `Detected ${detectedItems[0]}`;
  } else {
    // Fallback to best candidate
    const bestCandidate = relevantLabels.find(l => {
      const lower = l.name.toLowerCase();
      return !SKIP_LABELS.some(skip => lower === skip || lower.includes(`${skip} `));
    });
    
    if (bestCandidate) {
      primaryMeal = bestCandidate.name;
      detectionNote = `Detected ${bestCandidate.name} (${bestCandidate.confidence}% confidence)`;
    } else if (hasIndianContext) {
      primaryMeal = 'Indian Mixed Meal';
      detectionNote = 'Indian cuisine detected (specific dish unclear)';
    } else {
      primaryMeal = 'Mixed Meal';
      detectionNote = 'Cuisine unclear';
    }
  }

  // Add remaining items as alternatives
  relevantLabels
    .filter(l => !detectedItems.includes(l.name))
    .slice(0, 3)
    .forEach(l => {
      alternatives.push({ name: l.name, confidence: 'medium' });
    });
  
  return {
    primaryMeal,
    alternatives,
    detectionNote,
    specificDishes: detectedItems,
    breadType: breadItem?.name || null,
    hasGenericCurry: genericCurry,
    hasDal: dalPresent,
    isIndianMeal: hasIndianContext,
    multipleItems: detectedItems.length > 1,
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


