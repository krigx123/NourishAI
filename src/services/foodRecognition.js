/**
 * Browser-based Food Recognition using TensorFlow.js
 * Uses MobileNet model - runs completely offline, no API needed!
 */

import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

let model = null;
let isLoading = false;

// Food-related labels in MobileNet (ImageNet classes)
const FOOD_KEYWORDS = [
  'pizza', 'burger', 'bread', 'rice', 'soup', 'salad', 'cake', 'ice cream', 
  'french fries', 'hot dog', 'sandwich', 'taco', 'burrito', 'pasta', 'noodle',
  'egg', 'meat', 'chicken', 'fish', 'vegetable', 'fruit', 'apple', 'banana',
  'orange', 'grapes', 'strawberry', 'coffee', 'tea', 'milk', 'juice',
  'cheese', 'butter', 'yogurt', 'chocolate', 'candy', 'cookie', 'donut',
  'muffin', 'croissant', 'pretzel', 'pancake', 'waffle', 'cereal', 'oatmeal',
  'corn', 'potato', 'tomato', 'carrot', 'broccoli', 'cucumber', 'lettuce',
  'onion', 'garlic', 'mushroom', 'pepper', 'bean', 'pea', 'lentil',
  'curry', 'biryani', 'naan', 'roti', 'dosa', 'idli', 'samosa', 'pakora',
  'gulab', 'lassi', 'chai', 'chutney', 'paneer', 'masala', 'tandoori',
  'food', 'dish', 'meal', 'plate', 'bowl', 'cup', 'glass'
];

/**
 * Load the MobileNet model
 * First call takes 2-5 seconds, subsequent calls are instant
 */
export async function loadModel() {
  if (model) return model;
  if (isLoading) {
    // Wait for existing load to complete
    while (isLoading) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return model;
  }
  
  try {
    isLoading = true;
    console.log('Loading MobileNet model...');
    
    // Load MobileNet v2 (lightweight and fast)
    model = await mobilenet.load({
      version: 2,
      alpha: 1.0
    });
    
    console.log('MobileNet model loaded successfully!');
    return model;
  } catch (error) {
    console.error('Error loading model:', error);
    throw error;
  } finally {
    isLoading = false;
  }
}

/**
 * Recognize food in an image
 * @param {HTMLImageElement} imageElement - The image to analyze
 * @returns {Promise<Array>} - Array of predictions with {className, probability}
 */
export async function recognizeFood(imageElement) {
  try {
    const loadedModel = await loadModel();
    
    // Get predictions from MobileNet
    const predictions = await loadedModel.classify(imageElement, 10);
    
    console.log('Raw predictions:', predictions);
    
    // Filter and enhance predictions
    const foodPredictions = predictions
      .map(pred => ({
        name: formatPredictionName(pred.className),
        confidence: Math.round(pred.probability * 100),
        rawLabel: pred.className,
        isFood: isFoodRelated(pred.className)
      }))
      .filter(pred => pred.isFood || pred.confidence > 10)
      .slice(0, 6);
    
    return foodPredictions;
  } catch (error) {
    console.error('Recognition error:', error);
    throw error;
  }
}

/**
 * Check if a label is food-related
 */
function isFoodRelated(label) {
  const lowerLabel = label.toLowerCase();
  return FOOD_KEYWORDS.some(keyword => lowerLabel.includes(keyword));
}

/**
 * Format prediction name to be more readable
 */
function formatPredictionName(className) {
  // MobileNet returns formats like "pizza, pizza_pie" or "cheeseburger"
  // Clean up and format nicely
  return className
    .split(',')[0]  // Take first part
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Create an image element from a base64 string
 */
export function createImageFromBase64(base64String) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = base64String;
  });
}

/**
 * Analyze food from base64 image
 * Main function to use from components
 */
export async function analyzeImageFromBase64(base64String) {
  const imageElement = await createImageFromBase64(base64String);
  return recognizeFood(imageElement);
}

// Export model loading status
export function isModelLoaded() {
  return model !== null;
}

export function isModelLoading() {
  return isLoading;
}
