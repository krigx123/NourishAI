import express from 'express';
import jwt from 'jsonwebtoken';
import pool from '../database.js';

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

// Log a meal
router.post('/log', authenticate, async (req, res) => {
  const { foodName, calories, protein, carbs, fats, fiber, mealType, imageUrl } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO meal_logs (user_id, food_name, calories, protein, carbs, fats, fiber, meal_type, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [req.userId, foodName, calories, protein, carbs, fats, fiber, mealType || 'other', imageUrl]
    );

    res.status(201).json({
      message: 'Meal logged successfully',
      meal: result.rows[0]
    });
  } catch (error) {
    console.error('Error logging meal:', error);
    res.status(500).json({ error: 'Failed to log meal' });
  }
});

// Get today's meals
router.get('/today', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM meal_logs 
       WHERE user_id = $1 AND DATE(logged_at) = CURRENT_DATE
       ORDER BY logged_at DESC`,
      [req.userId]
    );

    // Calculate today's totals
    const totals = result.rows.reduce((acc, meal) => ({
      calories: acc.calories + (meal.calories || 0),
      protein: acc.protein + parseFloat(meal.protein || 0),
      carbs: acc.carbs + parseFloat(meal.carbs || 0),
      fats: acc.fats + parseFloat(meal.fats || 0),
      fiber: acc.fiber + parseFloat(meal.fiber || 0)
    }), { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0 });

    res.json({
      meals: result.rows,
      totals
    });
  } catch (error) {
    console.error('Error fetching today meals:', error);
    res.status(500).json({ error: 'Failed to fetch meals' });
  }
});

// Get meal history (last 7 days)
router.get('/history', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT DATE(logged_at) as date, 
              SUM(calories) as total_calories,
              SUM(protein) as total_protein,
              SUM(carbs) as total_carbs,
              SUM(fats) as total_fats
       FROM meal_logs 
       WHERE user_id = $1 AND logged_at >= CURRENT_DATE - INTERVAL '7 days'
       GROUP BY DATE(logged_at)
       ORDER BY date DESC`,
      [req.userId]
    );

    res.json({ history: result.rows });
  } catch (error) {
    console.error('Error fetching meal history:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// Add to favorites
router.post('/favorites', authenticate, async (req, res) => {
  const { foodName, nutritionData } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO favorites (user_id, food_name, nutrition_data)
       VALUES ($1, $2, $3) RETURNING *`,
      [req.userId, foodName, JSON.stringify(nutritionData)]
    );

    res.status(201).json({
      message: 'Added to favorites',
      favorite: result.rows[0]
    });
  } catch (error) {
    console.error('Error adding favorite:', error);
    res.status(500).json({ error: 'Failed to add favorite' });
  }
});

// Get favorites
router.get('/favorites', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM favorites WHERE user_id = $1 ORDER BY created_at DESC',
      [req.userId]
    );

    res.json({ favorites: result.rows });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

// Log water intake
router.post('/water', authenticate, async (req, res) => {
  const { glasses } = req.body;

  try {
    await pool.query(
      'INSERT INTO water_logs (user_id, glasses) VALUES ($1, $2)',
      [req.userId, glasses || 1]
    );

    // Get today's total
    const totalResult = await pool.query(
      `SELECT COALESCE(SUM(glasses), 0) as total 
       FROM water_logs 
       WHERE user_id = $1 AND DATE(logged_at) = CURRENT_DATE`,
      [req.userId]
    );

    res.json({
      message: 'Water logged',
      todayTotal: parseInt(totalResult.rows[0].total)
    });
  } catch (error) {
    console.error('Error logging water:', error);
    res.status(500).json({ error: 'Failed to log water' });
  }
});

// Get today's water intake
router.get('/water/today', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT COALESCE(SUM(glasses), 0) as total 
       FROM water_logs 
       WHERE user_id = $1 AND DATE(logged_at) = CURRENT_DATE`,
      [req.userId]
    );

    res.json({ glasses: parseInt(result.rows[0].total) });
  } catch (error) {
    console.error('Error fetching water intake:', error);
    res.status(500).json({ error: 'Failed to fetch water intake' });
  }
});

export default router;
