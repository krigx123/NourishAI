import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Flame,
  Dumbbell,
  Wheat,
  Droplet,
  Check,
  Settings
} from 'lucide-react';
import { Card, ProgressBar, Button } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { userAPI, mealsAPI } from '../services/api';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import './NutritionTracker.css';

/**
 * Nutrition Tracker Page - Progress tracking with detailed charts
 */
function NutritionTracker() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('today');
  const [dashboardData, setDashboardData] = useState(null);
  const [weeklyData, setWeeklyData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showLimitsModal, setShowLimitsModal] = useState(false);
  const [customLimits, setCustomLimits] = useState({
    calories: 2000,
    protein: 60,
    carbs: 250,
    fats: 55,
    fiber: 30
  });

  useEffect(() => {
    fetchData();
    // Load custom limits from localStorage
    const savedLimits = localStorage.getItem('nutritionLimits');
    if (savedLimits) {
      setCustomLimits(JSON.parse(savedLimits));
    } else if (user?.targetCalories) {
      setCustomLimits(prev => ({ ...prev, calories: user.targetCalories }));
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const [dashboard, history] = await Promise.all([
        userAPI.getDashboard(),
        mealsAPI.getHistory()
      ]);
      setDashboardData(dashboard);
      
      // Transform history for weekly chart
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const chartData = history.history?.map(item => ({
        day: days[new Date(item.date).getDay()],
        calories: parseInt(item.total_calories) || 0,
        protein: Math.round((parseInt(item.total_calories) || 0) * 0.15 / 4), // Estimated
        carbs: Math.round((parseInt(item.total_calories) || 0) * 0.5 / 4),
        fats: Math.round((parseInt(item.total_calories) || 0) * 0.35 / 9)
      })).reverse() || [];
      
      // Fill missing days with 0
      if (chartData.length < 7) {
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
          const d = new Date(today);
          d.setDate(d.getDate() - i);
          const dayName = days[d.getDay()];
          if (!chartData.find(c => c.day === dayName)) {
            chartData.push({ day: dayName, calories: 0, protein: 0, carbs: 0, fats: 0 });
          }
        }
        chartData.sort((a, b) => days.indexOf(a.day) - days.indexOf(b.day));
      }
      
      setWeeklyData(chartData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveLimits = () => {
    localStorage.setItem('nutritionLimits', JSON.stringify(customLimits));
    setShowLimitsModal(false);
  };

  // Calculate data based on time range
  const getNutritionData = () => {
    const defaults = {
      calories: { current: 0, goal: customLimits.calories },
      protein: { current: 0, goal: customLimits.protein },
      carbs: { current: 0, goal: customLimits.carbs },
      fats: { current: 0, goal: customLimits.fats },
      fiber: { current: 0, goal: customLimits.fiber }
    };

    if (!dashboardData) return defaults;

    const todayCalories = dashboardData.dailyCalories?.consumed || 0;
    
    if (timeRange === 'today') {
      // Estimate macros from calories (rough estimation)
      return {
        calories: { current: todayCalories, goal: customLimits.calories },
        protein: { current: Math.round(todayCalories * 0.15 / 4), goal: customLimits.protein },
        carbs: { current: Math.round(todayCalories * 0.5 / 4), goal: customLimits.carbs },
        fats: { current: Math.round(todayCalories * 0.35 / 9), goal: customLimits.fats },
        fiber: { current: Math.round(todayCalories / 100), goal: customLimits.fiber }
      };
    } else if (timeRange === 'week') {
      const weekTotal = weeklyData.reduce((sum, d) => sum + d.calories, 0);
      return {
        calories: { current: weekTotal, goal: customLimits.calories * 7 },
        protein: { current: Math.round(weekTotal * 0.15 / 4), goal: customLimits.protein * 7 },
        carbs: { current: Math.round(weekTotal * 0.5 / 4), goal: customLimits.carbs * 7 },
        fats: { current: Math.round(weekTotal * 0.35 / 9), goal: customLimits.fats * 7 },
        fiber: { current: Math.round(weekTotal / 100), goal: customLimits.fiber * 7 }
      };
    } else {
      // Month estimate (4 weeks)
      const weekTotal = weeklyData.reduce((sum, d) => sum + d.calories, 0);
      return {
        calories: { current: weekTotal * 4, goal: customLimits.calories * 30 },
        protein: { current: Math.round(weekTotal * 4 * 0.15 / 4), goal: customLimits.protein * 30 },
        carbs: { current: Math.round(weekTotal * 4 * 0.5 / 4), goal: customLimits.carbs * 30 },
        fats: { current: Math.round(weekTotal * 4 * 0.35 / 9), goal: customLimits.fats * 30 },
        fiber: { current: Math.round(weekTotal * 4 / 100), goal: customLimits.fiber * 30 }
      };
    }
  };

  const nutritionData = getNutritionData();

  // Daily nutrition items
  const dailyNutrition = [
    { name: 'Calories', ...nutritionData.calories, icon: Flame, color: '#f59e0b', unit: 'kcal' },
    { name: 'Protein', ...nutritionData.protein, icon: Dumbbell, color: '#10b981', unit: 'g' },
    { name: 'Carbohydrates', ...nutritionData.carbs, icon: Wheat, color: '#3b82f6', unit: 'g' },
    { name: 'Fats', ...nutritionData.fats, icon: Droplet, color: '#f97316', unit: 'g' },
    { name: 'Fiber', ...nutritionData.fiber, icon: Check, color: '#8b5cf6', unit: 'g' }
  ];

  // Calculate summary stats
  const getWeeklyStats = () => {
    const totalCalories = weeklyData.reduce((sum, d) => sum + d.calories, 0);
    const avgCalories = Math.round(totalCalories / 7);
    const daysLogged = weeklyData.filter(d => d.calories > 0).length;
    const goalCompliance = Math.round((daysLogged / 7) * 100);
    
    return { totalCalories, avgCalories, daysLogged, goalCompliance };
  };

  const weeklyStats = getWeeklyStats();

  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case 'today': return "Today's Progress";
      case 'week': return "This Week's Progress";
      case 'month': return "This Month's Progress";
      default: return "Progress";
    }
  };

  if (isLoading) {
    return (
      <div className="tracker-page animate-fadeIn">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your nutrition data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tracker-page animate-fadeIn">
      <header className="page-header">
        <div>
          <h1>
            <BarChart3 size={28} className="header-icon" />
            Nutrition Tracker
          </h1>
          <p>Monitor your daily and weekly nutrition progress</p>
        </div>
        <div className="header-actions">
          <div className="time-toggle">
            <button 
              className={`toggle-btn ${timeRange === 'today' ? 'active' : ''}`}
              onClick={() => setTimeRange('today')}
            >
              Today
            </button>
            <button 
              className={`toggle-btn ${timeRange === 'week' ? 'active' : ''}`}
              onClick={() => setTimeRange('week')}
            >
              Week
            </button>
            <button 
              className={`toggle-btn ${timeRange === 'month' ? 'active' : ''}`}
              onClick={() => setTimeRange('month')}
            >
              Month
            </button>
          </div>
          <Button 
            variant="outline" 
            size="small"
            icon={<Settings size={16} />}
            onClick={() => setShowLimitsModal(true)}
          >
            Set Limits
          </Button>
        </div>
      </header>

      {/* Set Limits Modal */}
      {showLimitsModal && (
        <div className="modal-overlay" onClick={() => setShowLimitsModal(false)}>
          <Card className="limits-modal" onClick={e => e.stopPropagation()}>
            <h3>Set Daily Nutrition Limits</h3>
            <div className="limits-form">
              <div className="limit-input">
                <label>Calories (kcal)</label>
                <input 
                  type="number" 
                  value={customLimits.calories}
                  onChange={e => setCustomLimits({...customLimits, calories: parseInt(e.target.value) || 0})}
                />
              </div>
              <div className="limit-input">
                <label>Protein (g)</label>
                <input 
                  type="number" 
                  value={customLimits.protein}
                  onChange={e => setCustomLimits({...customLimits, protein: parseInt(e.target.value) || 0})}
                />
              </div>
              <div className="limit-input">
                <label>Carbohydrates (g)</label>
                <input 
                  type="number" 
                  value={customLimits.carbs}
                  onChange={e => setCustomLimits({...customLimits, carbs: parseInt(e.target.value) || 0})}
                />
              </div>
              <div className="limit-input">
                <label>Fats (g)</label>
                <input 
                  type="number" 
                  value={customLimits.fats}
                  onChange={e => setCustomLimits({...customLimits, fats: parseInt(e.target.value) || 0})}
                />
              </div>
              <div className="limit-input">
                <label>Fiber (g)</label>
                <input 
                  type="number" 
                  value={customLimits.fiber}
                  onChange={e => setCustomLimits({...customLimits, fiber: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>
            <div className="modal-actions">
              <Button variant="outline" onClick={() => setShowLimitsModal(false)}>Cancel</Button>
              <Button variant="primary" onClick={saveLimits}>Save Limits</Button>
            </div>
          </Card>
        </div>
      )}

      {/* Daily Progress */}
      <section className="daily-progress">
        <h2>
          <Calendar size={20} />
          {getTimeRangeLabel()}
        </h2>
        <div className="progress-grid">
          {dailyNutrition.map((nutrient, index) => {
            const IconComponent = nutrient.icon;
            const percentage = nutrient.goal > 0 ? Math.round((nutrient.current / nutrient.goal) * 100) : 0;
            return (
              <Card key={index} className="nutrient-card">
                <div className="nutrient-header">
                  <div className="nutrient-icon" style={{ color: nutrient.color, background: `${nutrient.color}15` }}>
                    <IconComponent size={20} />
                  </div>
                  <span className="nutrient-name">{nutrient.name}</span>
                </div>
                <div className="nutrient-values">
                  <span className="current">{nutrient.current.toLocaleString()}</span>
                  <span className="goal">/ {nutrient.goal.toLocaleString()} {nutrient.unit}</span>
                </div>
                <ProgressBar 
                  value={nutrient.current} 
                  max={nutrient.goal} 
                  variant="gradient"
                  size="medium"
                  showPercentage={true}
                />
              </Card>
            );
          })}
        </div>
      </section>

      {/* Charts Section */}
      <section className="charts-section">
        <div className="charts-grid">
          {/* Weekly Nutrition Chart */}
          <Card className="chart-card">
            <div className="chart-header">
              <h3>
                <BarChart3 size={18} />
                Weekly Nutrition Overview
              </h3>
              <div className="chart-legend">
                <span className="legend-item protein">Protein</span>
                <span className="legend-item carbs">Carbs</span>
                <span className="legend-item fats">Fats</span>
              </div>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="day" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="protein" fill="#10b981" radius={[4, 4, 0, 0]} name="Protein (g)" />
                  <Bar dataKey="carbs" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Carbs (g)" />
                  <Bar dataKey="fats" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Fats (g)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Calorie Trend Chart */}
          <Card className="chart-card">
            <div className="chart-header">
              <h3>
                <TrendingUp size={18} />
                Calorie Trend
              </h3>
              <div className="chart-stats">
                <span className="stat">
                  Avg: {weeklyStats.avgCalories} kcal/day
                </span>
              </div>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="day" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="calories" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 5 }}
                    name="Calories"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </section>

      {/* Summary Stats */}
      <section className="summary-stats">
        <Card className="stat-card">
          <div className="stat-value">
            <TrendingUp size={32} />
            <span>{weeklyStats.totalCalories.toLocaleString()}</span>
          </div>
          <span className="stat-label">Total Calories This Week</span>
        </Card>
        <Card className="stat-card">
          <div className="stat-value">
            <Flame size={32} />
            <span>{weeklyStats.avgCalories.toLocaleString()}</span>
          </div>
          <span className="stat-label">Average Per Day</span>
        </Card>
        <Card className="stat-card">
          <div className="stat-value positive">
            <TrendingUp size={32} />
            <span>{weeklyStats.goalCompliance}%</span>
          </div>
          <span className="stat-label">Goal Compliance</span>
        </Card>
        <Card className="stat-card">
          <div className="stat-value">
            <Calendar size={32} />
            <span>{weeklyStats.daysLogged}</span>
          </div>
          <span className="stat-label">Days Logged</span>
        </Card>
      </section>
    </div>
  );
}

export default NutritionTracker;
