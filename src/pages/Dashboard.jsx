import { Link } from 'react-router-dom';
import { 
  Flame, 
  Activity, 
  Heart, 
  Droplets, 
  Zap,
  Camera,
  ClipboardList,
  BarChart3,
  Lightbulb,
  Plus,
  TrendingUp
} from 'lucide-react';
import { Card, Button, ProgressBar } from '../components/ui';
import { dashboardSummary, weeklyNutritionData, healthTips } from '../data/mockData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

/**
 * Dashboard Page - Main overview with summary cards
 */
function Dashboard() {
  const { dailyCalories, nutritionScore, healthStatus, waterIntake, streak } = dashboardSummary;

  const getHealthStatusColor = (status) => {
    switch (status) {
      case 'Excellent': return 'var(--success)';
      case 'Good': return 'var(--primary-500)';
      case 'Fair': return 'var(--warning)';
      default: return 'var(--error)';
    }
  };

  return (
    <div className="dashboard-page animate-fadeIn">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Good Morning, Priya!</h1>
          <p>Here's your nutrition overview for today</p>
        </div>
        <div className="header-actions">
          <Link to="/analysis">
            <Button variant="gradient" icon={<Plus size={18} />}>
              Log Meal
            </Button>
          </Link>
        </div>
      </header>

      {/* Summary Cards */}
      <section className="summary-section">
        <div className="summary-cards">
          <Card className="summary-card calories">
            <div className="card-icon">
              <Flame size={24} />
            </div>
            <div className="card-info">
              <span className="card-label">Calories Today</span>
              <div className="card-value">
                <span className="value-main">{dailyCalories.consumed}</span>
                <span className="value-sub">/ {dailyCalories.goal} kcal</span>
              </div>
              <ProgressBar 
                value={dailyCalories.consumed} 
                max={dailyCalories.goal} 
                variant="primary"
                size="small"
                showPercentage={false}
              />
            </div>
          </Card>

          <Card className="summary-card score">
            <div className="card-icon">
              <Activity size={24} />
            </div>
            <div className="card-info">
              <span className="card-label">Nutrition Score</span>
              <div className="card-value">
                <span className="value-main">{nutritionScore}</span>
                <span className="value-sub">/ 100</span>
              </div>
              <div className="score-indicator">
                <span>Excellent</span>
              </div>
            </div>
          </Card>

          <Card className="summary-card health">
            <div className="card-icon">
              <Heart size={24} />
            </div>
            <div className="card-info">
              <span className="card-label">Health Status</span>
              <div className="card-value">
                <span className="value-main" style={{ color: getHealthStatusColor(healthStatus) }}>
                  {healthStatus}
                </span>
              </div>
              <div className="status-dots">
                <span className="dot active"></span>
                <span className="dot active"></span>
                <span className="dot active"></span>
                <span className="dot"></span>
              </div>
            </div>
          </Card>

          <Card className="summary-card water">
            <div className="card-icon">
              <Droplets size={24} />
            </div>
            <div className="card-info">
              <span className="card-label">Water Intake</span>
              <div className="card-value">
                <span className="value-main">{waterIntake.current}</span>
                <span className="value-sub">/ {waterIntake.goal} glasses</span>
              </div>
              <ProgressBar 
                value={waterIntake.current} 
                max={waterIntake.goal} 
                variant="secondary"
                size="small"
                showPercentage={false}
              />
            </div>
          </Card>

          <Card className="summary-card streak">
            <div className="card-icon">
              <Zap size={24} />
            </div>
            <div className="card-info">
              <span className="card-label">Current Streak</span>
              <div className="card-value">
                <span className="value-main">{streak}</span>
                <span className="value-sub">days</span>
              </div>
              <div className="streak-badge">
                <TrendingUp size={14} />
                Keep it up!
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Charts Section */}
      <section className="charts-section">
        <div className="charts-grid">
          <Card className="chart-card">
            <div className="chart-header">
              <h3>Weekly Calorie Trend</h3>
              <span className="chart-badge">This Week</span>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={weeklyNutritionData}>
                  <defs>
                    <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
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
                  <Area 
                    type="monotone" 
                    dataKey="calories" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorCalories)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="tips-card">
            <div className="tips-header">
              <Lightbulb size={20} />
              <h3>Today's Health Tips</h3>
            </div>
            <div className="tips-list">
              {healthTips.slice(0, 4).map((tip, index) => (
                <div key={index} className="tip-item">
                  <span className="tip-number">{index + 1}</span>
                  <p>{tip}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="actions-grid">
          <Link to="/analysis" className="action-card">
            <div className="action-icon">
              <Camera size={24} />
            </div>
            <span className="action-label">Scan Meal</span>
          </Link>
          <Link to="/diet" className="action-card">
            <div className="action-icon">
              <ClipboardList size={24} />
            </div>
            <span className="action-label">Diet Plans</span>
          </Link>
          <Link to="/tracker" className="action-card">
            <div className="action-icon">
              <BarChart3 size={24} />
            </div>
            <span className="action-label">Track Progress</span>
          </Link>
          <Link to="/insights" className="action-card">
            <div className="action-icon">
              <Lightbulb size={24} />
            </div>
            <span className="action-label">Get Insights</span>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
