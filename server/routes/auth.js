import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../database.js';

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  const { name, email, password, age, weight, height, gender, dietType, allergies, goals, activityLevel } = req.body;

  try {
    // Check if user already exists
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const userResult = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
      [name, email, passwordHash]
    );

    const user = userResult.rows[0];

    // Calculate target calories based on user data (Harris-Benedict equation)
    let targetCalories = 2000; // default
    if (weight && height && age && gender) {
      let bmr;
      if (gender === 'male') {
        bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
      } else {
        bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
      }
      
      // Activity multiplier
      const activityMultipliers = {
        'Sedentary': 1.2,
        'Light': 1.375,
        'Moderate': 1.55,
        'Active': 1.725,
        'Very Active': 1.9
      };
      
      targetCalories = Math.round(bmr * (activityMultipliers[activityLevel] || 1.55));
      
      // Adjust for goals
      if (goals && goals.includes('Weight Loss')) {
        targetCalories -= 500;
      } else if (goals && goals.includes('Muscle Gain')) {
        targetCalories += 300;
      }
    }

    // Create user profile with collected data
    await pool.query(
      `INSERT INTO user_profiles (user_id, age, weight, height, gender, diet_type, allergies, goals, activity_level, target_calories)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [user.id, age || null, weight || null, height || null, gender || null, 
       dietType || 'Vegetarian', allergies || [], goals || [], activityLevel || 'Moderate', targetCalories]
    );

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        targetCalories
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const user = userResult.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Generate token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Get user profile
    const profileResult = await pool.query('SELECT * FROM user_profiles WHERE user_id = $1', [user.id]);
    const profile = profileResult.rows[0] || {};

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        age: profile.age,
        weight: profile.weight,
        height: profile.height,
        gender: profile.gender,
        dietType: profile.diet_type,
        allergies: profile.allergies,
        goals: profile.goals,
        activityLevel: profile.activity_level,
        targetCalories: profile.target_calories,
        joinedDate: user.created_at
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Get current user (requires auth)
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const userResult = await pool.query('SELECT id, name, email, created_at FROM users WHERE id = $1', [decoded.userId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];
    const profileResult = await pool.query('SELECT * FROM user_profiles WHERE user_id = $1', [user.id]);
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
    console.error('Get user error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Seed admin account (one-time setup)
router.post('/seed-admin', async (req, res) => {
  try {
    // Check if admin already exists
    const existingAdmin = await pool.query('SELECT id FROM users WHERE email = $1', ['admin@nourishai.com']);
    if (existingAdmin.rows.length > 0) {
      return res.json({ message: 'Admin account already exists' });
    }

    // Create admin account with password 'admin'
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('admin', salt);

    await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3)',
      ['Admin', 'admin@nourishai.com', passwordHash]
    );

    res.json({ message: 'Admin account created successfully. Login with admin@nourishai.com / admin' });
  } catch (error) {
    console.error('Seed admin error:', error);
    res.status(500).json({ error: 'Failed to create admin account' });
  }
});

export default router;
