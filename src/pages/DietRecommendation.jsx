import { useState, useEffect } from 'react';
import { 
  ClipboardList, 
  Scale, 
  Dumbbell, 
  Heart,
  Check,
  Sunrise,
  Sun,
  Apple,
  Moon,
  Flame,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { Card, Button } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { dietPlans } from '../data/mockData';
import './DietRecommendation.css';

/**
 * Diet Recommendation Page - Personalized diet plans based on user data
 */
function DietRecommendation() {
  const { user } = useAuth();
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [customCalories, setCustomCalories] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isPersonalized, setIsPersonalized] = useState(false);

  // Auto-select goal based on user's saved goals
  useEffect(() => {
    if (user?.goals?.length > 0) {
      const goalMap = {
        'Weight Loss': 'weightLoss',
        'Muscle Gain': 'muscleGain',
        'Healthy Living': 'healthyLiving',
        'Better Digestion': 'healthyLiving',
        'Heart Health': 'healthyLiving',
        'Energy Boost': 'muscleGain'
      };
      const firstGoal = user.goals[0];
      if (goalMap[firstGoal]) {
        setSelectedGoal(goalMap[firstGoal]);
        setIsPersonalized(true);
      }
    }
  }, [user]);

  const goals = [
    { id: 'weightLoss', name: 'Weight Loss', icon: Scale, color: '#ef4444', description: 'Calorie deficit with high protein' },
    { id: 'muscleGain', name: 'Muscle Gain', icon: Dumbbell, color: '#3b82f6', description: 'High protein for muscle building' },
    { id: 'healthyLiving', name: 'Healthy Living', icon: Heart, color: '#10b981', description: 'Balanced nutrition for wellness' }
  ];

  const mealIcons = {
    breakfast: Sunrise,
    lunch: Sun,
    snack: Apple,
    dinner: Moon
  };

  // Calculate personalized calories
  const getPersonalizedCalories = () => {
    if (customCalories) return customCalories;
    if (!user?.targetCalories) {
      return dietPlans[selectedGoal]?.calories || 1800;
    }
    
    // Adjust based on goal
    const base = user.targetCalories;
    if (selectedGoal === 'weightLoss') return base - 300;
    if (selectedGoal === 'muscleGain') return base + 200;
    return base;
  };

  // Generate personalized meal plan
  const getPersonalizedPlan = () => {
    if (!selectedGoal) return null;
    
    const basePlan = dietPlans[selectedGoal];
    if (!basePlan) return null;

    const personalizedCalories = getPersonalizedCalories();
    const calorieRatio = personalizedCalories / basePlan.calories;

    // Scale the meals proportionally
    const scaledMeals = {};
    Object.entries(basePlan.meals).forEach(([mealType, meal]) => {
      scaledMeals[mealType] = {
        ...meal,
        calories: Math.round(meal.calories * calorieRatio),
        protein: Math.round(meal.protein * calorieRatio),
        carbs: Math.round(meal.carbs * calorieRatio)
      };
    });

    return {
      ...basePlan,
      name: user?.name ? `${user.name.split(' ')[0]}'s ${basePlan.name}` : basePlan.name,
      calories: personalizedCalories,
      description: `Personalized ${basePlan.description.toLowerCase()} based on your profile`,
      meals: scaledMeals
    };
  };

  const handleStartPlan = () => {
    setMessage({ type: 'success', text: '✓ Plan activated! Check your dashboard for daily tracking.' });
    // In a real app, this would save to the backend
  };

  const handleCustomizePlan = () => {
    const newCalories = prompt('Enter your target daily calories:', getPersonalizedCalories());
    if (newCalories && !isNaN(newCalories)) {
      setCustomCalories(parseInt(newCalories));
      setMessage({ type: 'success', text: `✓ Calories updated to ${newCalories} kcal/day` });
    }
  };

  const handleSaveForLater = () => {
    setMessage({ type: 'success', text: '✓ Plan saved! Access it anytime from your profile.' });
  };

  const currentPlan = selectedGoal ? getPersonalizedPlan() : null;

  return (
    <div className="diet-page animate-fadeIn">
      <header className="page-header">
        <div>
          <h1>
            <ClipboardList size={28} className="header-icon" />
            Diet Recommendations
          </h1>
          <p>
            {user?.name 
              ? `Personalized AI-generated Indian diet plans for you, ${user.name.split(' ')[0]}`
              : 'Choose your goal and get a personalized AI-generated Indian diet plan'
            }
          </p>
        </div>
        {user?.targetCalories && (
          <div className="user-info-badge">
            <Sparkles size={16} />
            <span>Your target: {user.targetCalories} kcal/day</span>
          </div>
        )}
      </header>

      {isPersonalized && selectedGoal && (
        <div className="personalized-banner">
          <Sparkles size={18} />
          <span>Based on your goal: <strong>{user?.goals?.[0]}</strong></span>
          <button onClick={() => { setSelectedGoal(null); setIsPersonalized(false); }}>
            <RefreshCw size={14} /> Change
          </button>
        </div>
      )}

      {message.text && (
        <div className={`action-message ${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Goal Selection */}
      <section className="goals-section">
        <h2>Select Your Goal</h2>
        <div className="goals-grid">
          {goals.map((goal) => {
            const IconComponent = goal.icon;
            return (
              <Card 
                key={goal.id}
                className={`goal-card ${selectedGoal === goal.id ? 'selected' : ''}`}
                onClick={() => { setSelectedGoal(goal.id); setIsPersonalized(false); setMessage({ type: '', text: '' }); }}
              >
                <div className="goal-icon" style={{ background: `${goal.color}15`, color: goal.color }}>
                  <IconComponent size={32} />
                </div>
                <h3>{goal.name}</h3>
                <p className="goal-description">{goal.description}</p>
                <div className="goal-check">
                  {selectedGoal === goal.id && <Check size={16} />}
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Diet Plan Display */}
      {currentPlan && (
        <section className="plan-section animate-slideUp">
          <div className="plan-header">
            <div className="plan-info">
              <h2>{currentPlan.name}</h2>
              <p>{currentPlan.description}</p>
            </div>
            <Card className="plan-calories" variant="primary" hover={false}>
              <Flame size={24} />
              <div className="calories-info">
                <span className="calories-value">{currentPlan.calories}</span>
                <span className="calories-label">Daily Calories</span>
              </div>
            </Card>
          </div>

          <div className="meals-grid">
            {Object.entries(currentPlan.meals).map(([mealType, meal]) => {
              const MealIcon = mealIcons[mealType];
              return (
                <Card key={mealType} className={`meal-card ${mealType}`}>
                  <div className="meal-header">
                    <div className="meal-icon-wrapper">
                      <MealIcon size={24} />
                    </div>
                    <div>
                      <span className="meal-time">{meal.time}</span>
                      <h3>{mealType.charAt(0).toUpperCase() + mealType.slice(1)}</h3>
                    </div>
                  </div>
                  <div className="meal-content">
                    <h4>{meal.name}</h4>
                    <div className="meal-macros">
                      <span className="macro">
                        <strong>{meal.calories}</strong> kcal
                      </span>
                      <span className="macro">
                        <strong>{meal.protein}g</strong> protein
                      </span>
                      <span className="macro">
                        <strong>{meal.carbs}g</strong> carbs
                      </span>
                    </div>
                    <div className="meal-items">
                      {meal.items.map((item, index) => (
                        <span key={index} className="meal-item">{item}</span>
                      ))}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="plan-actions">
            <Button variant="gradient" onClick={handleStartPlan}>Start This Plan</Button>
            <Button variant="outline" onClick={handleCustomizePlan}>Customize Calories</Button>
            <Button variant="ghost" onClick={handleSaveForLater}>Save for Later</Button>
          </div>
        </section>
      )}

      {!selectedGoal && (
        <div className="empty-state">
          <div className="empty-icon">
            <ClipboardList size={48} />
          </div>
          <h3>Select a goal above</h3>
          <p>Choose your health goal to see a personalized Indian diet plan</p>
        </div>
      )}
    </div>
  );
}

export default DietRecommendation;
