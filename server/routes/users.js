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

// Get user profile
router.get('/profile', authenticate, async (req, res) => {
  try {
    const userResult = await pool.query(
      'SELECT id, name, email, created_at FROM users WHERE id = $1',
      [req.userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const profileResult = await pool.query(
      'SELECT * FROM user_profiles WHERE user_id = $1',
      [req.userId]
    );

    const user = userResult.rows[0];
    const profile = profileResult.rows[0] || {};

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      age: profile.age,
      weight: parseFloat(profile.weight) || null,
      height: parseFloat(profile.height) || null,
      gender: profile.gender,
      dietType: profile.diet_type,
      allergies: profile.allergies || [],
      goals: profile.goals || [],
      activityLevel: profile.activity_level,
      targetCalories: profile.target_calories,
      joinedDate: user.created_at
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user profile
router.put('/profile', authenticate, async (req, res) => {
  const { name, age, weight, height, gender, dietType, allergies, goals, activityLevel, targetCalories: explicitTargetCalories } = req.body;

  try {
    // Update user name if provided
    if (name) {
      await pool.query('UPDATE users SET name = $1 WHERE id = $2', [name, req.userId]);
    }

    // specific target calories logic
    let finalTargetCalories = explicitTargetCalories;

    // If no explicit target provided, try to calculate BMR if we have the data
    if (!finalTargetCalories && weight && height && age && gender) {
      let bmr;
      if (gender === 'male') {
        bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
      } else {
        bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
      }
      
      const activityMultipliers = {
        'Sedentary': 1.2,
        'Light': 1.375,
        'Moderate': 1.55,
        'Active': 1.725,
        'Very Active': 1.9
      };
      
      finalTargetCalories = Math.round(bmr * (activityMultipliers[activityLevel] || 1.55));
      
      if (goals && goals.includes('Weight Loss')) {
        finalTargetCalories -= 500;
      } else if (goals && goals.includes('Muscle Gain')) {
        finalTargetCalories += 300;
      }
    }

    // Get existing profile first to merge data for partial updates
    const currentProfileResult = await pool.query('SELECT * FROM user_profiles WHERE user_id = $1', [req.userId]);
    const currentProfile = currentProfileResult.rows[0] || {};

    // If we still don't have a new target calories, use the old one or default
    if (!finalTargetCalories) {
        finalTargetCalories = currentProfile.target_calories || 2000;
    }

    // Prepare values for update with fallbacks to current values
    const newAge = age !== undefined ? age : currentProfile.age;
    const newWeight = weight !== undefined ? weight : currentProfile.weight;
    const newHeight = height !== undefined ? height : currentProfile.height;
    const newGender = gender !== undefined ? gender : currentProfile.gender;
    const newDietType = dietType !== undefined ? dietType : currentProfile.diet_type;
    const newAllergies = allergies !== undefined ? allergies : currentProfile.allergies || [];
    const newGoals = goals !== undefined ? goals : currentProfile.goals || [];
    const newActivityLevel = activityLevel !== undefined ? activityLevel : currentProfile.activity_level;


    // Update or insert profile
    await pool.query(
      `INSERT INTO user_profiles (user_id, age, weight, height, gender, diet_type, allergies, goals, activity_level, target_calories, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_TIMESTAMP)
       ON CONFLICT (user_id) 
       DO UPDATE SET age = $2, weight = $3, height = $4, gender = $5, diet_type = $6, 
                     allergies = $7, goals = $8, activity_level = $9, target_calories = $10, updated_at = CURRENT_TIMESTAMP`,
      [req.userId, newAge, newWeight, newHeight, newGender, newDietType, newAllergies, newGoals, newActivityLevel, finalTargetCalories]
    );

    res.json({ message: 'Profile updated successfully', targetCalories: finalTargetCalories });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get dashboard summary (personalized based on user data)
router.get('/dashboard', authenticate, async (req, res) => {
  try {
    // Get user profile
    const profileResult = await pool.query(
      'SELECT * FROM user_profiles WHERE user_id = $1',
      [req.userId]
    );
    const profile = profileResult.rows[0] || { target_calories: 2000 };

    // Get today's meals
    const mealsResult = await pool.query(
      `SELECT COALESCE(SUM(calories), 0) as consumed_calories,
              COALESCE(SUM(protein), 0) as protein,
              COALESCE(SUM(carbs), 0) as carbs,
              COALESCE(SUM(fats), 0) as fats
       FROM meal_logs 
       WHERE user_id = $1 AND DATE(logged_at) = CURRENT_DATE`,
      [req.userId]
    );

    // Get today's water intake
    const waterResult = await pool.query(
      `SELECT COALESCE(SUM(glasses), 0) as glasses 
       FROM water_logs 
       WHERE user_id = $1 AND DATE(logged_at) = CURRENT_DATE`,
      [req.userId]
    );

    // Get streak (consecutive days with meals logged)
    const streakResult = await pool.query(
      `WITH daily_logs AS (
        SELECT DISTINCT DATE(logged_at) as log_date
        FROM meal_logs
        WHERE user_id = $1
        ORDER BY log_date DESC
      ),
      streak_calc AS (
        SELECT log_date,
               log_date - (ROW_NUMBER() OVER (ORDER BY log_date DESC))::int AS streak_group
        FROM daily_logs
      )
      SELECT COUNT(*) as streak
      FROM streak_calc
      WHERE streak_group = (SELECT streak_group FROM streak_calc WHERE log_date = CURRENT_DATE LIMIT 1)`,
      [req.userId]
    );

    const consumed = parseInt(mealsResult.rows[0].consumed_calories) || 0;
    const goal = profile.target_calories || 2000;
    const percentage = Math.round((consumed / goal) * 100);

    // Calculate nutrition score based on balance
    const protein = parseFloat(mealsResult.rows[0].protein) || 0;
    const carbs = parseFloat(mealsResult.rows[0].carbs) || 0;
    const fats = parseFloat(mealsResult.rows[0].fats) || 0;
    const total = protein + carbs + fats;
    
    let nutritionScore = 50;
    if (total > 0) {
      const proteinRatio = protein / total;
      const carbRatio = carbs / total;
      const fatRatio = fats / total;
      
      // Ideal ratios: 20-30% protein, 45-55% carbs, 20-35% fats
      const proteinScore = proteinRatio >= 0.15 && proteinRatio <= 0.35 ? 30 : 15;
      const carbScore = carbRatio >= 0.40 && carbRatio <= 0.60 ? 40 : 20;
      const fatScore = fatRatio >= 0.15 && fatRatio <= 0.40 ? 30 : 15;
      
      nutritionScore = Math.min(100, proteinScore + carbScore + fatScore);
    }

    // Determine health status
    let healthStatus = 'Good';
    if (nutritionScore >= 80) healthStatus = 'Excellent';
    else if (nutritionScore >= 60) healthStatus = 'Good';
    else if (nutritionScore >= 40) healthStatus = 'Fair';
    else healthStatus = 'Needs Improvement';

    res.json({
      dailyCalories: {
        consumed,
        goal,
        percentage
      },
      nutritionScore,
      healthStatus,
      waterIntake: {
        current: parseInt(waterResult.rows[0].glasses) || 0,
        goal: 8
      },
      streak: parseInt(streakResult.rows[0]?.streak) || 0,
      macros: {
        protein,
        carbs,
        fats
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Delete account
router.delete('/account', authenticate, async (req, res) => {
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [req.userId]);
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

// Export user data
router.get('/export', authenticate, async (req, res) => {
  try {
    const userResult = await pool.query('SELECT name, email, created_at FROM users WHERE id = $1', [req.userId]);
    const profileResult = await pool.query('SELECT * FROM user_profiles WHERE user_id = $1', [req.userId]);
    const mealsResult = await pool.query('SELECT * FROM meal_logs WHERE user_id = $1', [req.userId]);
    const favoritesResult = await pool.query('SELECT * FROM favorites WHERE user_id = $1', [req.userId]);

    const exportData = {
      user: userResult.rows[0],
      profile: profileResult.rows[0],
      mealLogs: mealsResult.rows,
      favorites: favoritesResult.rows,
      exportedAt: new Date().toISOString()
    };

    res.json(exportData);
  } catch (error) {
    console.error('Error exporting data:', error);
    res.status(500).json({ error: 'Failed to export data' });
  }
});

// ========== DIET PLAN ENDPOINTS ==========

// Save diet plan (start or save for later)
router.post('/diet-plan', authenticate, async (req, res) => {
  const { plan, planType, isActive } = req.body;
  
  try {
    // If activating, deactivate other plans first
    if (isActive) {
      await pool.query(
        'UPDATE user_diet_plans SET is_active = false WHERE user_id = $1',
        [req.userId]
      );
    }
    
    const result = await pool.query(
      `INSERT INTO user_diet_plans (user_id, plan_type, plan_data, is_active, created_at)
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
       RETURNING *`,
      [req.userId, planType, JSON.stringify(plan), isActive || false]
    );
    
    res.json({ 
      success: true, 
      message: isActive ? 'Plan activated!' : 'Plan saved for later',
      plan: result.rows[0]
    });
  } catch (error) {
    console.error('Error saving diet plan:', error);
    res.status(500).json({ error: 'Failed to save diet plan' });
  }
});

// Get user's saved diet plans
router.get('/diet-plans', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM user_diet_plans 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [req.userId]
    );
    
    res.json({ 
      success: true, 
      plans: result.rows,
      activePlan: result.rows.find(p => p.is_active) || null
    });
  } catch (error) {
    console.error('Error fetching diet plans:', error);
    res.status(500).json({ error: 'Failed to fetch diet plans' });
  }
});

// Get active diet plan
router.get('/diet-plan/active', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM user_diet_plans 
       WHERE user_id = $1 AND is_active = true
       LIMIT 1`,
      [req.userId]
    );
    
    res.json({ 
      success: true, 
      plan: result.rows[0] || null
    });
  } catch (error) {
    console.error('Error fetching active plan:', error);
    res.status(500).json({ error: 'Failed to fetch active plan' });
  }
});

// ========== AI CACHE ENDPOINTS ==========

// Get cached AI response
router.get('/ai-cache/:type', authenticate, async (req, res) => {
  const { type } = req.params;
  const { key } = req.query;
  
  try {
    const result = await pool.query(
      `SELECT cache_data, created_at FROM ai_cache 
       WHERE user_id = $1 AND cache_type = $2 AND (cache_key = $3 OR cache_key IS NULL)
       AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)
       ORDER BY created_at DESC
       LIMIT 1`,
      [req.userId, type, key || null]
    );
    
    if (result.rows.length > 0) {
      res.json({ 
        success: true, 
        cached: true,
        data: result.rows[0].cache_data,
        cachedAt: result.rows[0].created_at
      });
    } else {
      res.json({ success: true, cached: false, data: null });
    }
  } catch (error) {
    console.error('Error fetching AI cache:', error);
    res.status(500).json({ error: 'Failed to fetch cached data' });
  }
});

// Save to AI cache
router.post('/ai-cache', authenticate, async (req, res) => {
  const { type, key, data, expiresInHours } = req.body;
  
  try {
    const expiresAt = expiresInHours 
      ? new Date(Date.now() + expiresInHours * 60 * 60 * 1000)
      : null;
    
    await pool.query(
      `INSERT INTO ai_cache (user_id, cache_type, cache_key, cache_data, expires_at, created_at)
       VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
       ON CONFLICT (user_id, cache_type, cache_key) 
       DO UPDATE SET cache_data = $4, expires_at = $5, created_at = CURRENT_TIMESTAMP`,
      [req.userId, type, key || null, JSON.stringify(data), expiresAt]
    );
    
    res.json({ success: true, message: 'Cached successfully' });
  } catch (error) {
    console.error('Error saving to AI cache:', error);
    res.status(500).json({ error: 'Failed to cache data' });
  }
});

export default router;
