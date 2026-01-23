import express from 'express';
import pool from '../database.js';

const router = express.Router();

// Get admin stats
router.get('/stats', async (req, res) => {
  try {
    // Get total users count
    const usersResult = await pool.query('SELECT COUNT(*) as count FROM users');
    const totalUsers = parseInt(usersResult.rows[0].count);

    // Get today's active users (users who logged meals today)
    const activeResult = await pool.query(
      `SELECT COUNT(DISTINCT user_id) as count FROM meal_logs 
       WHERE DATE(logged_at) = CURRENT_DATE`
    );
    const activeToday = parseInt(activeResult.rows[0].count) || totalUsers; // If no meals logged, assume all active

    // Get total meals logged
    const mealsResult = await pool.query('SELECT COUNT(*) as count FROM meal_logs');
    const mealsLogged = parseInt(mealsResult.rows[0].count);

    // Get average health score (placeholder - would be calculated from nutrition data)
    const averageScore = mealsLogged > 0 ? 72 : 0;

    // Get recent users
    const recentUsersResult = await pool.query(
      `SELECT u.id, u.name, u.email, u.created_at, 
              COALESCE(p.goals[1], 'Healthy Living') as goal
       FROM users u
       LEFT JOIN user_profiles p ON u.id = p.user_id
       ORDER BY u.created_at DESC
       LIMIT 10`
    );

    res.json({
      stats: {
        totalUsers,
        activeToday,
        mealsLogged,
        averageScore
      },
      recentUsers: recentUsersResult.rows
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ error: 'Failed to fetch admin stats' });
  }
});

export default router;
