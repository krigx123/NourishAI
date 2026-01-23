import { useState } from 'react';
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
  Flame
} from 'lucide-react';
import { Card, Button } from '../components/ui';
import { dietPlans } from '../data/mockData';
import './DietRecommendation.css';

/**
 * Diet Recommendation Page - Goal selection and Indian meal plans
 */
function DietRecommendation() {
  const [selectedGoal, setSelectedGoal] = useState(null);

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

  const currentPlan = selectedGoal ? dietPlans[selectedGoal] : null;

  return (
    <div className="diet-page animate-fadeIn">
      <header className="page-header">
        <div>
          <h1>
            <ClipboardList size={28} className="header-icon" />
            Diet Recommendations
          </h1>
          <p>Choose your goal and get a personalized AI-generated Indian diet plan</p>
        </div>
      </header>

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
                onClick={() => setSelectedGoal(goal.id)}
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
            <Button variant="gradient">Start This Plan</Button>
            <Button variant="outline">Customize Plan</Button>
            <Button variant="ghost">Save for Later</Button>
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
