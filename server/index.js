import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool, { initializeDatabase } from './database.js';
import authRoutes from './routes/auth.js';
import mealsRoutes from './routes/meals.js';
import usersRoutes from './routes/users.js';
import adminRoutes from './routes/admin.js';
import foodRoutes from './routes/food.js';
import geminiRoutes from './routes/gemini.js';
import visionRoutes from './routes/vision.js';
import groqRoutes from './routes/groq.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5174'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/meals', mealsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/gemini', geminiRoutes);
app.use('/api/vision', visionRoutes);
app.use('/api/groq', groqRoutes);

// Initialize database and start server
async function startServer() {
  try {
    await initializeDatabase();
    console.log('✅ Connected to Neon PostgreSQL database');
    
    app.listen(PORT, () => {
      console.log(`🚀 NourishAI Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
