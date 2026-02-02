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

Return JSON:
{"foodName":"${primaryMeal}","calories":400,"protein":12,"carbs":60,"fat":10,"fiber":6,"serving":"1 serving","healthScore":70,"insight":"balanced meal","vitamins":["B6","C"],"minerals":["Iron","Potassium"]}`;

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
        temperature: 0.0,
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

Return JSON array:
[{"name":"Food Name","calories":200,"protein":10,"carbs":30,"fat":8,"fiber":4,"serving":"1 cup (150g)","healthScore":75}]

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

export default router;
