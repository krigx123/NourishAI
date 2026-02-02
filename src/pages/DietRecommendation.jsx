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
  RefreshCw,
  Loader,
  BookmarkCheck
} from 'lucide-react';
import { Card, Button } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { groqAPI, userAPI } from '../services/api';
import { dietPlans as staticDietPlans } from '../data/mockData';
import './DietRecommendation.css';

/**
 * Diet Recommendation Page - Personalized diet plans based on user data
 */
function DietRecommendation() {
  const { user } = useAuth();
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [isLoadingPlan, setIsLoadingPlan] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isPersonalized, setIsPersonalized] = useState(false);

  // Load cached plan on mount
  useEffect(() => {
    const loadCachedPlan = async () => {
      try {
        // Try to get cached diet plan
        const cached = await userAPI.getCachedAI('diet_plan');
        if (cached.cached && cached.data) {
          setCurrentPlan(cached.data.plan);
          setSelectedGoal(cached.data.goalId);
          setMessage({ type: 'info', text: '📋 Loaded your last generated plan' });
        }
      } catch (error) {
        console.log('No cached diet plan found');
      }
    };
    loadCachedPlan();
  }, []);

  // Auto-select goal based on user's saved goals
  useEffect(() => {
    if (user?.goals?.length > 0 && !currentPlan) {
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

  // Fetch AI-generated plan when goal changes
  const fetchAIPlan = async (goalId) => {
    setIsLoadingPlan(true);
    setMessage({ type: '', text: '' });
    
    try {
      const goalNames = {
        weightLoss: 'Weight Loss',
        muscleGain: 'Muscle Gain',
        healthyLiving: 'Healthy Living'
      };
      
      const result = await groqAPI.getDietPlan(goalNames[goalId], user);
      
      if (result.success && result.plan) {
        // Transform AI response to match expected format
        const aiPlan = {
          name: user?.name ? `${user.name.split(' ')[0]}'s ${goalNames[goalId]} Plan` : `${goalNames[goalId]} Plan`,
          description: result.plan.insight || `AI-generated ${goalNames[goalId]} diet plan`,
          calories: result.plan.totalCalories || 1800,
          meals: {
            breakfast: result.plan.breakfast || staticDietPlans[goalId]?.meals?.breakfast,
            lunch: result.plan.lunch || staticDietPlans[goalId]?.meals?.lunch,
            snack: result.plan.snack || staticDietPlans[goalId]?.meals?.snack,
            dinner: result.plan.dinner || staticDietPlans[goalId]?.meals?.dinner
          },
          tips: result.plan.tips || []
        };
        setCurrentPlan(aiPlan);
        setMessage({ type: 'success', text: '✨ AI-generated personalized plan ready!' });
      } else {
        throw new Error('AI plan generation failed');
      }
    } catch (error) {
      console.log('Using static diet plan (AI unavailable):', error.message);
      // Fallback to static plan
      const staticPlan = staticDietPlans[goalId];
      if (staticPlan) {
        setCurrentPlan({
          ...staticPlan,
          name: user?.name ? `${user.name.split(' ')[0]}'s ${staticPlan.name}` : staticPlan.name
        });
        setMessage({ type: 'info', text: '📋 Using recommended plan template' });
      }
    } finally {
      setIsLoadingPlan(false);
    }
  };

  // Handle goal selection
  const handleGoalSelect = async (goalId) => {
    setSelectedGoal(goalId);
    await fetchAIPlan(goalId);
  };

  const handleStartPlan = async () => {
    if (!currentPlan || !selectedGoal) return;
    
    try {
      await userAPI.saveDietPlan(currentPlan, selectedGoal, true);
      // Also cache it
      await userAPI.setCachedAI('diet_plan', { plan: currentPlan, goalId: selectedGoal }, null, 168); // 1 week
      setMessage({ type: 'success', text: '✓ Plan activated! Check your dashboard for daily tracking.' });
    } catch (error) {
      console.error('Error saving plan:', error);
      setMessage({ type: 'error', text: 'Failed to save plan. Please try again.' });
    }
  };

  const handleRegeneratePlan = () => {
    if (selectedGoal) {
      fetchAIPlan(selectedGoal);
    }
  };

  const handleSaveForLater = async () => {
    if (!currentPlan || !selectedGoal) return;
    
    try {
      await userAPI.saveDietPlan(currentPlan, selectedGoal, false);
      // Also cache it
      await userAPI.setCachedAI('diet_plan', { plan: currentPlan, goalId: selectedGoal }, null, 168);
      setMessage({ type: 'success', text: '✓ Plan saved! Access it anytime from your profile.' });
    } catch (error) {
      console.error('Error saving plan:', error);
      setMessage({ type: 'error', text: 'Failed to save plan. Please try again.' });
    }
  };


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
          <button onClick={() => { setSelectedGoal(null); setCurrentPlan(null); setIsPersonalized(false); }}>
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
                className={`goal-card ${selectedGoal === goal.id ? 'selected' : ''} ${isLoadingPlan ? 'loading' : ''}`}
                onClick={() => { handleGoalSelect(goal.id); setIsPersonalized(false); }}
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
              if (!meal) return null;
              const MealIcon = mealIcons[mealType.toLowerCase()] || Sun;
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
                      {(meal.items || meal.foods || []).map((item, index) => (
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
            <Button variant="outline" onClick={handleRegeneratePlan} icon={<RefreshCw size={16} />}>
              Regenerate with AI
            </Button>
            <Button variant="ghost" onClick={handleSaveForLater}>Save for Later</Button>
          </div>
        </section>
      )}

      {isLoadingPlan && (
        <div className="loading-state">
          <Loader size={32} className="spinner" />
          <h3>Generating your personalized plan...</h3>
          <p>Our AI is creating the perfect diet plan for you</p>
        </div>
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
