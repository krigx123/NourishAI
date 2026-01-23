import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Hugging Face Indian Food Model - using NEW router URL
const HF_MODEL_ID = 'dima806/indian_food_image_detection';
const HF_INFERENCE_URL = `https://router.huggingface.co/hf-inference/models/${HF_MODEL_ID}`;

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
 * Recognize Indian food from image
 * Uses dima806/indian_food_image_detection model from Hugging Face
 * POST /api/food/recognize
 */
router.post('/recognize', authenticate, async (req, res) => {
  try {
    const { imageBase64 } = req.body;
    
    if (!imageBase64) {
      return res.status(400).json({ error: 'No image provided' });
    }

    // Remove data URL prefix if present
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');

    console.log('Calling Indian Food Detection Model...');

    // Get HF token from env
    const hfToken = process.env.HF_API_TOKEN;
    
    if (!hfToken) {
      console.log('No HF_API_TOKEN found, using fallback');
      return res.json({ 
        success: false, 
        useFallback: true,
        error: 'HF_API_TOKEN not configured'
      });
    }

    console.log('Using URL:', HF_INFERENCE_URL);

    // Call Hugging Face Inference API with new router URL
    const response = await fetch(HF_INFERENCE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${hfToken}`,
        'Content-Type': 'application/octet-stream'
      },
      body: imageBuffer
    });

    const responseText = await response.text();
    console.log('HF Response status:', response.status);
    console.log('HF Response:', responseText.substring(0, 500));

    if (!response.ok) {
      // Check for common errors
      if (response.status === 503) {
        // Model is loading
        try {
          const errorData = JSON.parse(responseText);
          const estimatedTime = errorData.estimated_time || 20;
          return res.json({ 
            success: false, 
            modelLoading: true,
            error: `Model is loading. Please wait ${Math.ceil(estimatedTime)} seconds.`,
            estimatedTime
          });
        } catch {
          return res.json({ 
            success: false, 
            modelLoading: true,
            error: 'Model is loading. Please try again in 20 seconds.'
          });
        }
      }
      
      if (response.status === 401) {
        console.error('Authentication error - check HF_API_TOKEN permissions');
        return res.json({ 
          success: false, 
          useFallback: true,
          error: 'Token authentication failed. Check token permissions.'
        });
      }
      
      console.error('HF API error:', response.status);
      return res.json({ 
        success: false, 
        useFallback: true,
        error: `API error: ${response.status}`
      });
    }

    // Parse response
    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      console.error('Failed to parse response');
      return res.json({ success: false, useFallback: true, error: 'Invalid response' });
    }
    
    console.log('Parsed response:', JSON.stringify(data, null, 2));
    
    // Format response - HF returns array of { label, score }
    const foods = Array.isArray(data) ? data.map(item => ({
      name: formatFoodName(item.label),
      confidence: Math.round((item.score || 0) * 100),
      rawLabel: item.label
    })).slice(0, 6) : [];

    if (foods.length === 0) {
      return res.json({
        success: false,
        useFallback: true,
        error: 'No food detected'
      });
    }

    console.log('Detected Indian foods:', foods);

    res.json({
      success: true,
      foods: foods
    });

  } catch (error) {
    console.error('Recognition error:', error);
    res.json({ 
      success: false, 
      useFallback: true,
      error: error.message
    });
  }
});

/**
 * Format food name from model output
 * e.g., "dal_makhani" -> "Dal Makhani"
 */
function formatFoodName(label) {
  if (!label) return 'Unknown Food';
  return label
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export default router;
