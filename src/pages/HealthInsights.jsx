import { useState, useEffect } from 'react';
import { 
  Lightbulb, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Droplets, 
  Flame, 
  TrendingUp,
  Heart,
  Target,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { Card, Button } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { userAPI, mealsAPI } from '../services/api';
import './HealthInsights.css';

// All possible tips pool - will be filtered based on user data
const allTips = [
  { text: "Start your day with warm lemon water to boost metabolism", category: "hydration" },
  { text: "Include more fiber-rich foods like oats and vegetables", category: "fiber" },
  { text: "Try to eat your dinner before 8 PM for better digestion", category: "timing" },
  { text: "Add more leafy greens like spinach and methi to your diet", category: "iron" },
  { text: "Choose whole grains over refined carbs when possible", category: "carbs" },
  { text: "Incorporate buttermilk or curd for better gut health", category: "probiotics" },
  { text: "Have a handful of nuts as a healthy snack", category: "protein" },
  { text: "Include daal or paneer for vegetarian protein sources", category: "protein" },
  { text: "Try intermittent fasting by skipping late-night snacks", category: "weight_loss" },
  { text: "Use minimal oil while cooking - try grilling or steaming", category: "weight_loss" },
  { text: "Include eggs or sprouts for muscle-building protein", category: "muscle_gain" },
  { text: "Drink coconut water for natural electrolyte replenishment", category: "hydration" },
  { text: "Season your food with turmeric and ginger for anti-inflammatory benefits", category: "health" },
  { text: "Avoid sugary drinks and opt for fresh lime water instead", category: "hydration" },
  { text: "Eat fruits like papaya and guava for vitamin C", category: "vitamins" }
];

/**
 * Health Insights Page - Personalized AI-powered health recommendations
 */
function HealthInsights() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [tips, setTips] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [completedActions, setCompletedActions] = useState({});

  useEffect(() => {
    fetchData();
    refreshTips();
  }, []);

  const fetchData = async () => {
    try {
      const data = await userAPI.getDashboard();
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const refreshTips = () => {
    setIsRefreshing(true);
    
    // Filter tips based on user goals and shuffle
    let relevantTips = [...allTips];
    
    // Prioritize tips based on user goals
    const userGoals = user?.goals || [];
    if (userGoals.includes('weight_loss')) {
      relevantTips = relevantTips.sort((a, b) => 
        (a.category === 'weight_loss' ? -1 : 1) - (b.category === 'weight_loss' ? -1 : 1)
      );
    }
    if (userGoals.includes('muscle_gain')) {
      relevantTips = relevantTips.sort((a, b) => 
        (a.category === 'protein' || a.category === 'muscle_gain' ? -1 : 1) - 
        (b.category === 'protein' || b.category === 'muscle_gain' ? -1 : 1)
      );
    }
    
    // Shuffle and pick 5
    const shuffled = relevantTips.sort(() => Math.random() - 0.5);
    setTips(shuffled.slice(0, 5));
    
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const toggleAction = (id) => {
    setCompletedActions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning': return <AlertTriangle size={18} />;
      case 'success': return <CheckCircle size={18} />;
      case 'info': return <Info size={18} />;
      default: return <Info size={18} />;
    }
  };

  // Generate personalized insights based on actual data
  const getHealthInsights = () => {
    const insights = [];
    
    if (dashboardData) {
      const { dailyCalories, waterIntake, nutritionScore } = dashboardData;
      
      // Calorie insights
      if (dailyCalories?.consumed < dailyCalories?.goal * 0.5) {
        insights.push({
          id: 1,
          type: 'warning',
          title: 'Low Calorie Intake',
          message: `You've only consumed ${dailyCalories?.consumed || 0} calories. Aim for at least ${dailyCalories?.goal || 1800} kcal daily.`,
          priority: 'high'
        });
      } else if (dailyCalories?.consumed > dailyCalories?.goal) {
        insights.push({
          id: 2,
          type: 'warning',
          title: 'Calorie Goal Exceeded',
          message: `You've exceeded your daily calorie goal by ${dailyCalories.consumed - dailyCalories.goal} kcal.`,
          priority: 'medium'
        });
      } else {
        insights.push({
          id: 3,
          type: 'success',
          title: 'Great Calorie Balance',
          message: 'You are on track with your calorie goals today!',
          priority: 'low'
        });
      }
      
      // Water insights
      if (waterIntake?.current < waterIntake?.goal / 2) {
        insights.push({
          id: 4,
          type: 'warning',
          title: 'Stay Hydrated',
          message: `Drink more water! You've had only ${waterIntake?.current || 0} of ${waterIntake?.goal || 8} glasses.`,
          priority: 'high'
        });
      } else if (waterIntake?.current >= waterIntake?.goal) {
        insights.push({
          id: 5,
          type: 'success',
          title: 'Hydration Goal Met!',
          message: 'Excellent! You have met your daily water intake goal.',
          priority: 'low'
        });
      }
      
      // Nutrition score insights
      if (nutritionScore >= 80) {
        insights.push({
          id: 6,
          type: 'success',
          title: 'Excellent Nutrition',
          message: `Your nutrition score of ${nutritionScore} is excellent! Keep it up!`,
          priority: 'low'
        });
      } else if (nutritionScore < 50) {
        insights.push({
          id: 7,
          type: 'info',
          title: 'Room for Improvement',
          message: 'Try adding more variety to your meals for a better nutrition score.',
          priority: 'medium'
        });
      }
    }
    
    // Default insight if no data
    if (insights.length === 0) {
      insights.push({
        id: 0,
        type: 'info',
        title: 'Start Logging Meals',
        message: 'Log your meals to get personalized health insights!',
        priority: 'medium'
      });
    }
    
    return insights;
  };

  const healthInsights = getHealthInsights();

  // Weekly summary based on real data or defaults
  const weeklySummary = [
    { 
      label: 'Avg Calories', 
      value: dashboardData?.dailyCalories?.consumed ? `${dashboardData.dailyCalories.consumed}` : '—', 
      icon: Flame, 
      change: 'Today', 
      positive: true 
    },
    { 
      label: 'Water Intake', 
      value: dashboardData?.waterIntake?.current ? `${dashboardData.waterIntake.current}/${dashboardData.waterIntake.goal}` : '0/8', 
      icon: Droplets, 
      change: 'glasses', 
      positive: (dashboardData?.waterIntake?.current || 0) >= 4 
    },
    { 
      label: 'Target Calories', 
      value: user?.targetCalories || '2000', 
      icon: Target, 
      change: 'kcal/day', 
      positive: true 
    },
    { 
      label: 'Health Score', 
      value: dashboardData?.nutritionScore || '—', 
      icon: Heart, 
      change: '/100', 
      positive: (dashboardData?.nutritionScore || 0) >= 50 
    }
  ];

  // Personalized action items based on user goals
  const getActionItems = () => {
    const actions = [];
    const goals = user?.goals || [];
    
    if (goals.includes('weight_loss')) {
      actions.push({ id: 'a1', text: 'Avoid fried foods and opt for grilled/steamed options' });
      actions.push({ id: 'a2', text: 'Take a 15-minute walk after dinner' });
    }
    if (goals.includes('muscle_gain')) {
      actions.push({ id: 'a3', text: 'Include paneer or eggs in at least one meal' });
      actions.push({ id: 'a4', text: 'Have a protein-rich snack post-workout' });
    }
    if (goals.includes('healthy_lifestyle')) {
      actions.push({ id: 'a5', text: 'Include more colorful vegetables in your meals' });
      actions.push({ id: 'a6', text: 'Limit processed foods and added sugars' });
    }
    
    // Default actions
    if (actions.length === 0) {
      actions.push({ id: 'd1', text: 'Drink at least 8 glasses of water today' });
      actions.push({ id: 'd2', text: 'Include a serving of fresh fruits' });
      actions.push({ id: 'd3', text: 'Have a balanced meal with protein, carbs, and veggies' });
    }
    
    return actions.slice(0, 4);
  };

  const actionItems = getActionItems();

  return (
    <div className="insights-page animate-fadeIn">
      <header className="page-header">
        <div>
          <h1>
            <Lightbulb size={28} className="header-icon" />
            Health Insights
          </h1>
          <p>Personalized recommendations based on your nutrition data</p>
        </div>
      </header>

      {/* Alerts Section */}
      <section className="alerts-section">
        <h2>Your Health Alerts</h2>
        <div className="alerts-list">
          {healthInsights.map((insight) => (
            <Card key={insight.id} className={`alert-card ${insight.type}`}>
              <div className="alert-content">
                <div className="alert-icon">
                  {getAlertIcon(insight.type)}
                </div>
                <div className="alert-text">
                  <h3>{insight.title}</h3>
                  <p>{insight.message}</p>
                </div>
              </div>
              <div className="alert-actions">
                <span className={`priority-badge ${insight.priority}`}>{insight.priority}</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Weekly Summary */}
      <section className="summary-section">
        <h2>Your Statistics</h2>
        <div className="summary-grid">
          {weeklySummary.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <Card key={index} className="summary-card">
                <div className="summary-icon">
                  <IconComponent size={24} />
                </div>
                <div className="summary-info">
                  <span className="summary-value">{item.value}</span>
                  <span className="summary-label">{item.label}</span>
                </div>
                <span className={`summary-change ${item.positive ? 'positive' : 'negative'}`}>
                  {item.change}
                </span>
              </Card>
            );
          })}
        </div>
      </section>

      {/* AI Health Tips */}
      <section className="tips-section">
        <div className="tips-header">
          <h2>
            <Lightbulb size={20} />
            Personalized Tips
          </h2>
          <Button 
            variant="outline" 
            size="small" 
            onClick={refreshTips}
            icon={<RefreshCw size={16} className={isRefreshing ? 'spin' : ''} />}
            disabled={isRefreshing}
          >
            Refresh Tips
          </Button>
        </div>
        <div className="tips-grid">
          {tips.map((tip, index) => (
            <Card key={index} className="tip-card" hover>
              <span className="tip-number">{index + 1}</span>
              <p>{tip.text}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Action Items */}
      <section className="actions-section">
        <h2>Recommended Actions</h2>
        <Card className="actions-card">
          {actionItems.map((action) => (
            <div key={action.id} className="action-item">
              <div className="action-check">
                <input 
                  type="checkbox" 
                  id={action.id}
                  checked={completedActions[action.id] || false}
                  onChange={() => toggleAction(action.id)}
                />
                <label 
                  htmlFor={action.id}
                  className={completedActions[action.id] ? 'completed' : ''}
                >
                  {action.text}
                </label>
              </div>
            </div>
          ))}
        </Card>
      </section>
    </div>
  );
}

export default HealthInsights;
