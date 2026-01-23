import { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Flame,
  Dumbbell,
  Wheat,
  Droplet,
  Check
} from 'lucide-react';
import { Card, ProgressBar } from '../components/ui';
import { weeklyNutritionData, monthlyProgressData } from '../data/mockData';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import './NutritionTracker.css';

/**
 * Nutrition Tracker Page - Progress tracking with detailed charts
 */
function NutritionTracker() {
  const [timeRange, setTimeRange] = useState('week');

  // Daily nutrition progress
  const dailyNutrition = [
    { name: 'Calories', current: 1650, goal: 1800, icon: Flame, color: '#f59e0b' },
    { name: 'Protein', current: 52, goal: 60, icon: Dumbbell, color: '#10b981', unit: 'g' },
    { name: 'Carbohydrates', current: 228, goal: 250, icon: Wheat, color: '#3b82f6', unit: 'g' },
    { name: 'Fats', current: 48, goal: 55, icon: Droplet, color: '#f97316', unit: 'g' },
    { name: 'Fiber', current: 22, goal: 30, icon: Check, color: '#8b5cf6', unit: 'g' }
  ];

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
      </header>

      {/* Daily Progress */}
      <section className="daily-progress">
        <h2>
          <Calendar size={20} />
          Today's Progress
        </h2>
        <div className="progress-grid">
          {dailyNutrition.map((nutrient, index) => {
            const IconComponent = nutrient.icon;
            const percentage = Math.round((nutrient.current / nutrient.goal) * 100);
            return (
              <Card key={index} className="nutrient-card">
                <div className="nutrient-header">
                  <div className="nutrient-icon" style={{ color: nutrient.color, background: `${nutrient.color}15` }}>
                    <IconComponent size={20} />
                  </div>
                  <span className="nutrient-name">{nutrient.name}</span>
                </div>
                <div className="nutrient-values">
                  <span className="current">{nutrient.current}</span>
                  <span className="goal">/ {nutrient.goal}{nutrient.unit}</span>
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
                <BarChart data={weeklyNutritionData}>
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
                  <Bar dataKey="protein" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="carbs" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="fats" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Monthly Progress Chart */}
          <Card className="chart-card">
            <div className="chart-header">
              <h3>
                <TrendingUp size={18} />
                Monthly Progress
              </h3>
              <div className="chart-stats">
                <span className="stat success">
                  <TrendingDown size={14} />
                  -2 kg this month
                </span>
              </div>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={monthlyProgressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="week" stroke="#9ca3af" />
                  <YAxis yAxisId="left" stroke="#10b981" />
                  <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 5 }}
                    name="Weight (kg)"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="calories" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }}
                    name="Calories (avg)"
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
          <div className="stat-value positive">
            <TrendingDown size={32} />
            <span>2 kg</span>
          </div>
          <span className="stat-label">Weight Lost</span>
        </Card>
        <Card className="stat-card">
          <div className="stat-value">
            <Flame size={32} />
            <span>12,180</span>
          </div>
          <span className="stat-label">Calories This Week</span>
        </Card>
        <Card className="stat-card">
          <div className="stat-value positive">
            <TrendingUp size={32} />
            <span>85%</span>
          </div>
          <span className="stat-label">Goal Compliance</span>
        </Card>
        <Card className="stat-card">
          <div className="stat-value">
            <Calendar size={32} />
            <span>14</span>
          </div>
          <span className="stat-label">Days Tracked</span>
        </Card>
      </section>
    </div>
  );
}

export default NutritionTracker;
