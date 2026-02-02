import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

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
 * Analyze nutrition from food labels using Groq LLM
 * Model: llama-3.3-70b-versatile
 */
router.post('/analyze', authenticate, async (req, res) => {
  const { foodLabels } = req.body;
  console.log('🧠 Groq API: Received request with labels:', foodLabels);

  if (!foodLabels || !foodLabels.length) {
    console.log('🧠 Groq API: No food labels provided');
    return res.status(400).json({ error: 'No food labels provided' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.log('🧠 Groq API: API key not configured');
    return res.status(500).json({ error: 'Groq API key not configured' });
  }

  try {
    // Extract pre-processed data from Vision API
    const primaryMeal = req.body.primaryMeal || foodLabels.join(' + ');
    const alternatives = req.body.alternatives || [];
    const detectionNote = req.body.detectionNote || '';
    const isIndianMeal = req.body.isIndianMeal || false;
    
    console.log('🧠 Groq API: Analyzing meal:', primaryMeal, 'Indian:', isIndianMeal);
    
    const systemPrompt = `You are a JSON-only nutrition API. Return ONLY valid JSON, no text.
IMPORTANT: Do NOT use "Indian Meal" as a fallback. Use neutral names like "Mixed Meal" when uncertain.`;
    
    const cuisineHint = isIndianMeal ? 'This appears to be Indian food.' : 'Cuisine type is uncertain.';
    
    const userPrompt = `Provide nutrition data for this meal in JSON format.

MEAL: ${primaryMeal}
RAW LABELS: ${foodLabels.join(', ')}
${detectionNote ? `CONTEXT: ${detectionNote}` : ''}
${cuisineHint}

CRITICAL: Use the EXACT meal name "${primaryMeal}" as foodName. Do NOT change it to "Indian Meal".
Estimate realistic nutritional values for a standard serving size. Do not use example values.
(Replace <placeholders> with actual estimated numbers)

Return JSON Structure:
{"foodName":"${primaryMeal}","calories":<estimated_calories>,"protein":<grams>,"carbs":<grams>,"fat":<grams>,"fiber":<grams>,"serving":"1 serving","healthScore":<0-100>,"insight":"brief nutritional insight","vitamins":["Vitamin A","Vitamin C"],"minerals":["Iron","Calcium"]}`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.2,
        max_tokens: 400,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Groq API error:', error);
      return res.status(500).json({ error: 'Groq analysis failed' });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return res.status(500).json({ error: 'No response from Groq' });
    }

    // Parse JSON from response (handle potential markdown blocks)
    let nutrition;
    try {
      const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      nutrition = JSON.parse(cleaned);
      console.log('🧠 Groq API: Parsed response:', nutrition);
    } catch (parseError) {
      console.error('Failed to parse Groq response:', content);
      return res.status(500).json({ error: 'Failed to parse nutrition data' });
    }

    // Handle response - Groq now returns nutrition directly
    const nutritionData = nutrition.primaryMeal || nutrition;

    res.json({
      success: true,
      nutrition: nutritionData,
      alternatives: alternatives,
      detectionNote: detectionNote,
      source: 'groq'
    });

  } catch (error) {
    console.error('Groq analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze nutrition' });
  }
});

/**
 * Search for food and get nutrition data using Groq LLM
 * Model: llama-3.3-70b-versatile
 * POST /api/groq/search
 */
router.post('/search', authenticate, async (req, res) => {
  const { query } = req.body;
  console.log('🔍 Groq Search: Query received:', query);

  if (!query || query.length < 2) {
    return res.status(400).json({ error: 'Query too short' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.log('🔍 Groq Search: API key not configured');
    return res.status(500).json({ error: 'Groq API key not configured' });
  }

  try {
    const systemPrompt = `You are a nutrition database API. Return ONLY valid JSON array with food items matching the query.
Each item must have: name, calories, protein, carbs, fat, fiber, serving, healthScore (0-100).
Return 3-5 relevant food items. For Indian foods, use standard serving sizes.
If query is vague, suggest common foods that match.`;

    const userPrompt = `Search foods matching: "${query}"

Return JSON array (Replace placeholders with estimated values):
[{"name":"Similar Food","calories":<calories>,"protein":<grams>,"carbs":<grams>,"fat":<grams>,"fiber":<grams>,"serving":"1 cup","healthScore":<0-100>}]

IMPORTANT: Return ONLY the JSON array, no explanation.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 800,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Groq Search API error:', error);
      return res.status(500).json({ error: 'Groq search failed', useFallback: true });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return res.status(500).json({ error: 'No response from Groq', useFallback: true });
    }

    // Parse JSON from response
    let foods;
    try {
      const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(cleaned);
      // Handle both array and object with foods property
      foods = Array.isArray(parsed) ? parsed : (parsed.foods || parsed.items || [parsed]);
      console.log('🔍 Groq Search: Found', foods.length, 'foods');
    } catch (parseError) {
      console.error('Failed to parse Groq search response:', content);
      return res.status(500).json({ error: 'Failed to parse results', useFallback: true });
    }

    // Normalize and add source
    const results = foods.map(food => ({
      name: food.name || food.foodName || 'Unknown',
      calories: food.calories || 0,
      protein: food.protein || 0,
      carbs: food.carbs || 0,
      fat: food.fat || food.fats || 0,
      fiber: food.fiber || 0,
      serving: food.serving || '1 serving',
      healthScore: food.healthScore || 60,
      source: 'groq',
      image: '🍽️'
    }));

    res.json({
      success: true,
      foods: results,
      source: 'groq'
    });

  } catch (error) {
    console.error('Groq search error:', error);
    res.status(500).json({ error: 'Search failed', useFallback: true });
  }
});

/**
 * Generate personalized health tips using Groq LLM
 * POST /api/groq/health-tips
 */
router.post('/health-tips', authenticate, async (req, res) => {
  const { userProfile } = req.body;
  console.log('💡 Groq Health Tips: Generating for user');

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Groq API key not configured' });
  }

  try {
    const profileContext = userProfile ? 
      `User Profile: Age ${userProfile.age || 'unknown'}, Goal: ${userProfile.goal || 'general health'}, Diet: ${userProfile.dietType || 'mixed'}` :
      'General user seeking health advice';

    const userPrompt = `${profileContext}

Generate 4-6 personalized, actionable health tips for this user focusing on Indian foods and lifestyle.
Each tip should be specific to their goals and preferences.

Return JSON array (example structure):
["Tip 1 specific to user", "Tip 2 specific to user", "Tip 3 specific to user", "Tip 4 specific to user"]

IMPORTANT: Make tips personalized based on user profile. Return ONLY the JSON array.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'You are a nutrition expert. Return ONLY valid JSON arrays.' },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error('Groq API request failed');
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '[]';
    
    let tips = [];
    try {
      const cleaned = content.replace(/```json\n?|\n?```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      tips = Array.isArray(parsed) ? parsed : (parsed.tips || parsed.healthTips || []);
      console.log('💡 Groq Health Tips: Generated', tips.length, 'tips');
    } catch (parseError) {
      console.error('Failed to parse Groq health tips response:', content);
      return res.status(500).json({ error: 'Failed to parse health tips' });
    }

    res.json({
      success: true,
      tips: tips,
      source: 'groq'
    });

  } catch (error) {
    console.error('Groq health tips error:', error);
    res.status(500).json({ error: 'Failed to generate health tips' });
  }
});

/**
 * Generate personalized diet plan using Groq LLM
 * POST /api/groq/diet-plan
 */
router.post('/diet-plan', authenticate, async (req, res) => {
  const { goal, userProfile } = req.body;
  console.log('🍽️ Groq Diet Plan: Generating for goal:', goal);

  if (!goal) {
    return res.status(400).json({ error: 'Goal is required' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Groq API key not configured' });
  }

  try {
    const profileContext = userProfile ? 
      `User: Age ${userProfile.age || 'adult'}, Diet preference: ${userProfile.dietType || 'mixed'}, Activity: ${userProfile.activityLevel || 'moderate'}` :
      'Average adult user';

    const userPrompt = `Create a personalized Indian diet plan for: ${goal}
${profileContext}

Generate a complete day's meal plan with breakfast, lunch, snack, and dinner.
Use authentic Indian foods appropriate for the goal.

Return JSON:
{
  "breakfast": {"name": "Meal name", "description": "Brief description", "calories": 300, "items": ["item1", "item2"]},
  "lunch": {"name": "Meal name", "description": "Brief description", "calories": 500, "items": ["item1", "item2"]},
  "snack": {"name": "Meal name", "description": "Brief description", "calories": 150, "items": ["item1"]},
  "dinner": {"name": "Meal name", "description": "Brief description", "calories": 450, "items": ["item1", "item2"]},
  "totalCalories": 1400,
  "tips": ["Tip 1", "Tip 2"]
}

IMPORTANT: Use realistic calorie values. Return ONLY valid JSON.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'You are a nutrition expert specializing in Indian cuisine. Return ONLY valid JSON.' },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error('Groq API request failed');
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '{}';
    
    let plan = null;
    try {
      const cleaned = content.replace(/```json\n?|\n?```/g, '').trim();
      plan = JSON.parse(cleaned);
      console.log('🍽️ Groq Diet Plan: Generated plan with', plan.totalCalories, 'calories');
    } catch (parseError) {
      console.error('Failed to parse Groq diet plan response:', content);
      return res.status(500).json({ error: 'Failed to parse diet plan' });
    }

    res.json({
      success: true,
      plan: plan,
      goal: goal,
      source: 'groq'
    });

  } catch (error) {
    console.error('Groq diet plan error:', error);
    res.status(500).json({ error: 'Failed to generate diet plan' });
  }
});

export default router;
