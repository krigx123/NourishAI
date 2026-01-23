import { useState, useEffect } from 'react';
import { 
  History,
  Calendar,
  Flame,
  Clock,
  ChevronLeft,
  Search,
  Filter
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, Button, Input } from '../components/ui';
import { mealsAPI } from '../services/api';
import './MealLogs.css';

/**
 * Meal Logs Page - Detailed history of all logged meals
 */
function MealLogs() {
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    try {
      const data = await mealsAPI.getRecentMeals();
      setMeals(data.meals || []);
    } catch (error) {
      console.error('Error fetching meals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getMealIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'breakfast': return '🍳';
      case 'lunch': return '🥗';
      case 'dinner': return '🍲';
      case 'snack': return '🥪';
      default: return '🍽️';
    }
  };

  const filteredMeals = meals.filter(meal => {
    const matchesSearch = meal.food_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filter === 'all' || meal.meal_type?.toLowerCase() === filter.toLowerCase();
    return matchesSearch && matchesType;
  });

  if (isLoading) {
    return (
      <div className="logs-page animate-fadeIn">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading meal history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="logs-page animate-fadeIn">
      <header className="page-header">
        <div className="header-content">
          <Link to="/profile" className="back-link">
            <ChevronLeft size={20} />
            Back to Profile
          </Link>
          <h1>
            <History size={28} className="header-icon" />
            Meal History
          </h1>
          <p>View your 50 most recent meal logs</p>
        </div>
      </header>

      <div className="logs-content">
        <Card className="filter-card">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search meals..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-tabs">
            {['All', 'Breakfast', 'Lunch', 'Dinner', 'Snack'].map(type => (
              <button
                key={type}
                className={`filter-tab ${filter === type.toLowerCase() ? 'active' : ''}`}
                onClick={() => setFilter(type.toLowerCase())}
              >
                {type}
              </button>
            ))}
          </div>
        </Card>

        <div className="logs-grid">
          {filteredMeals.length > 0 ? (
            filteredMeals.map((meal) => (
              <Card key={meal.id} className="log-card">
                <div className="log-icon">
                  {getMealIcon(meal.meal_type)}
                </div>
                <div className="log-details">
                  <div className="log-header">
                    <h3>{meal.food_name}</h3>
                    <span className="log-time">
                      <Clock size={14} />
                      {new Date(meal.logged_at).toLocaleDateString()} • {new Date(meal.logged_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="log-macros">
                    <span className="macro calorie">
                      <Flame size={14} />
                      {meal.calories} kcal
                    </span>
                    <span className="macro">P: {meal.protein}g</span>
                    <span className="macro">C: {meal.carbs}g</span>
                    <span className="macro">F: {meal.fats}g</span>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="empty-state">
              <p>No meals found matching your criteria.</p>
              {searchTerm && <Button variant="outline" onClick={() => {setSearchTerm(''); setFilter('all');}}>Clear Filters</Button>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MealLogs;
