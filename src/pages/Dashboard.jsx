import { useState, useEffect } from 'react';
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
import { useAuth } from '../context/AuthContext';
import { userAPI, mealsAPI } from '../services/api';
import { healthTips } from '../data/mockData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

/**
 * Dashboard Page - Main overview with personalized data
 */
function Dashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [weeklyData, setWeeklyData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [dashboard, history] = await Promise.all([
          userAPI.getDashboard(),
          mealsAPI.getHistory()
        ]);
        
        setDashboardData(dashboard);
        
        // Transform history for chart
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const chartData = history.history?.map(item => ({
          day: days[new Date(item.date).getDay()],
          calories: parseInt(item.total_calories) || 0
        })).reverse() || [];
        
        // Fill with default data if no history
        if (chartData.length === 0) {
          const today = new Date();
          for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            chartData.push({
              day: days[d.getDay()],
              calories: 0
            });
          }
        }
        
        setWeeklyData(chartData);
      } catch (error) {
        console.error('Error fetching dashboard:', error);
        // Set default values on error
        setDashboardData({
          dailyCalories: { consumed: 0, goal: user?.targetCalories || 2000, percentage: 0 },
          nutritionScore: 50,
          healthStatus: 'Start Logging',
          waterIntake: { current: 0, goal: 8 },
          streak: 0
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getFirstName = () => {
    if (!user?.name) return 'there';
    return user.name.split(' ')[0];
  };

  const getHealthStatusColor = (status) => {
    switch (status) {
      case 'Excellent': return 'var(--success)';
      case 'Good': return 'var(--primary-500)';
      case 'Fair': return 'var(--warning)';
      default: return 'var(--neutral-500)';
    }
  };

  if (isLoading) {
    return (
      <div className="dashboard-page animate-fadeIn">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const { dailyCalories, nutritionScore, healthStatus, waterIntake, streak } = dashboardData || {};

  return (
    <div className="dashboard-page animate-fadeIn">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>{getGreeting()}, {getFirstName()}!</h1>
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
                <span className="value-main">{dailyCalories?.consumed || 0}</span>
                <span className="value-sub">/ {dailyCalories?.goal || user?.targetCalories || 2000} kcal</span>
              </div>
              <ProgressBar 
                value={dailyCalories?.consumed || 0} 
                max={dailyCalories?.goal || 2000} 
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
                <span className="value-main">{nutritionScore || 0}</span>
                <span className="value-sub">/ 100</span>
              </div>
              <div className="score-indicator">
                <span>{healthStatus || 'Log meals to start'}</span>
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
                  {healthStatus || 'Getting Started'}
                </span>
              </div>
              <div className="status-dots">
                <span className={`dot ${nutritionScore >= 25 ? 'active' : ''}`}></span>
                <span className={`dot ${nutritionScore >= 50 ? 'active' : ''}`}></span>
                <span className={`dot ${nutritionScore >= 75 ? 'active' : ''}`}></span>
                <span className={`dot ${nutritionScore >= 90 ? 'active' : ''}`}></span>
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
                <span className="value-main">{waterIntake?.current || 0}</span>
                <span className="value-sub">/ {waterIntake?.goal || 8} glasses</span>
              </div>
              <ProgressBar 
                value={waterIntake?.current || 0} 
                max={waterIntake?.goal || 8} 
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
                <span className="value-main">{streak || 0}</span>
                <span className="value-sub">days</span>
              </div>
              <div className="streak-badge">
                <TrendingUp size={14} />
                {streak > 0 ? 'Keep it up!' : 'Start logging!'}
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
                <AreaChart data={weeklyData}>
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
