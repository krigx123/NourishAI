import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Create connection pool to Neon PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Initialize database tables
export async function initializeDatabase() {
  const client = await pool.connect();
  
  try {
    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // User profiles table (for personalization)
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_profiles (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        age INTEGER,
        weight DECIMAL(5,2),
        height DECIMAL(5,2),
        gender VARCHAR(20),
        diet_type VARCHAR(50) DEFAULT 'Vegetarian',
        allergies TEXT[] DEFAULT '{}',
        goals TEXT[] DEFAULT '{}',
        activity_level VARCHAR(50) DEFAULT 'Moderate',
        target_calories INTEGER,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id)
      )
    `);

    // Meal logs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS meal_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        food_name VARCHAR(255) NOT NULL,
        calories INTEGER,
        protein DECIMAL(5,2),
        carbs DECIMAL(5,2),
        fats DECIMAL(5,2),
        fiber DECIMAL(5,2),
        meal_type VARCHAR(50),
        image_url TEXT,
        logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // User diet plans table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_diet_plans (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        plan_type VARCHAR(50) NOT NULL,
        plan_data JSONB NOT NULL,
        is_active BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Water intake tracking
    await client.query(`
      CREATE TABLE IF NOT EXISTS water_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        glasses INTEGER DEFAULT 1,
        logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Favorites table
    await client.query(`
      CREATE TABLE IF NOT EXISTS favorites (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        food_name VARCHAR(255) NOT NULL,
        nutrition_data JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // AI response cache table (for health tips, diet plans etc.)
    await client.query(`
      CREATE TABLE IF NOT EXISTS ai_cache (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        cache_type VARCHAR(50) NOT NULL,
        cache_key VARCHAR(255),
        cache_data JSONB NOT NULL,
        expires_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, cache_type, cache_key)
      )
    `);

    console.log('✅ Database tables initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  } finally {
    client.release();
  }
}

export default pool;
