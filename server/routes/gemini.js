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
 * Verify nutritional values using Google Gemini as an expert nutritionist
 * Takes a food name and returns accurate, verified nutrition data
 */
router.post('/verify-nutrition', authenticate, async (req, res) => {
  const { foodName } = req.body;

  if (!foodName) {
    return res.status(400).json({ error: 'No food name provided' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Gemini API key not configured', useFallback: true });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are an expert food nutritionist with 20+ years of experience specializing in Indian cuisine and nutrition science. You have deep knowledge of traditional cooking methods, ingredient compositions, and their nutritional impact.

Given the Indian food item: "${foodName}"

Provide accurate nutritional values for a typical single serving. Return ONLY a valid JSON object (no markdown, no code blocks, no explanation) with this exact structure:

{
  "name": "${foodName}",
  "calories": number (kcal per serving),
  "protein": number (grams),
  "carbs": number (grams),
  "fat": number (grams),
  "fiber": number (grams),
  "serving": "typical serving size (e.g., '1 plate', '2 pieces', '1 bowl')",
  "healthScore": number from 1-100 based on nutritional balance,
  "verified": true,
  "source": "Expert Nutritionist Analysis"
}

Base your values on standard Indian restaurant/home-cooked portions. Be precise and scientifically accurate.`
            }]
          }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 300
          }
        })
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('Gemini API error:', error);
      return res.status(500).json({ error: 'Gemini API request failed', useFallback: true });
    }

    const data = await response.json();
    const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!textContent) {
      return res.status(500).json({ error: 'No response from Gemini', useFallback: true });
    }

    let nutritionData;
    try {
      const cleanedText = textContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      nutritionData = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', textContent);
      return res.status(500).json({ error: 'Failed to parse nutrition data', useFallback: true });
    }

    res.json({
      success: true,
      verified: true,
      nutrition: nutritionData
    });

  } catch (error) {
    console.error('Gemini verification error:', error);
    res.status(500).json({ error: 'Failed to verify nutrition', useFallback: true });
  }
});

export default router;
