import { useState } from 'react';
import { 
  UtensilsCrossed, 
  Camera, 
  Edit3, 
  Check, 
  Sparkles, 
  Apple,
  Beef,
  Egg,
  Salad,
  RotateCcw
} from 'lucide-react';
import { Card, Button, Input } from '../components/ui';
import { mealAnalysisResults, macroDistribution, sampleFoods } from '../data/mockData';
import { indianFoodDatabase, searchFood } from '../data/nutritionDatabase';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import './MealAnalysis.css';

/**
 * Meal Analysis Page - Image upload and food analysis with Indian foods
 */
function MealAnalysis() {
  const [analysisMode, setAnalysisMode] = useState('upload');
  const [foodInput, setFoodInput] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    
    // Search in database for matching food
    let result = mealAnalysisResults;
    if (foodInput) {
      const searchResults = searchFood(foodInput);
      if (searchResults.length > 0) {
        const food = searchResults[0];
        result = {
          foodName: food.name,
          calories: food.calories,
          protein: food.protein,
          carbs: food.carbs,
          fats: food.fats,
          fiber: food.fiber,
          healthScore: food.healthScore,
          vitamins: food.vitamins,
          minerals: food.minerals,
          suggestions: [
            `${food.isVegetarian ? 'Vegetarian' : 'Non-vegetarian'} option`,
            food.healthScore >= 80 ? 'Great healthy choice!' : 'Consider balancing with more vegetables',
            `Serving size: ${food.servingSize}`
          ]
        };
      }
    }
    
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisResult(result);
      setShowResults(true);
    }, 2000);
  };

  const handleReset = () => {
    setShowResults(false);
    setSelectedImage(null);
    setFoodInput('');
    setAnalysisResult(null);
  };

  const currentResult = analysisResult || mealAnalysisResults;
  const currentMacros = [
    { name: 'Protein', value: currentResult.protein, color: '#10b981' },
    { name: 'Carbs', value: currentResult.carbs, color: '#3b82f6' },
    { name: 'Fats', value: currentResult.fats, color: '#f59e0b' },
    { name: 'Fiber', value: currentResult.fiber, color: '#8b5cf6' }
  ];

  return (
    <div className="meal-analysis-page animate-fadeIn">
      <header className="page-header">
        <div>
          <h1>
            <UtensilsCrossed size={28} className="header-icon" />
            Meal Analysis
          </h1>
          <p>Analyze your Indian meals using AI to get detailed nutritional information</p>
        </div>
      </header>

      <div className="analysis-content">
        {!showResults ? (
          <div className="analysis-input-section">
            {/* Mode Toggle */}
            <div className="mode-toggle">
              <button 
                className={`mode-btn ${analysisMode === 'upload' ? 'active' : ''}`}
                onClick={() => setAnalysisMode('upload')}
              >
                <Camera size={18} />
                Upload Image
              </button>
              <button 
                className={`mode-btn ${analysisMode === 'manual' ? 'active' : ''}`}
                onClick={() => setAnalysisMode('manual')}
              >
                <Edit3 size={18} />
                Enter Manually
              </button>
            </div>

            <Card className="input-card">
              {analysisMode === 'upload' ? (
                <div className="upload-section">
                  <div className={`upload-zone ${selectedImage ? 'has-image' : ''}`}>
                    {selectedImage ? (
                      <div className="preview-container">
                        <img src={selectedImage} alt="Selected food" className="food-preview" />
                        <button className="remove-image" onClick={() => setSelectedImage(null)}>×</button>
                      </div>
                    ) : (
                      <>
                        <div className="upload-icon">
                          <Camera size={48} />
                        </div>
                        <h3>Drop your food image here</h3>
                        <p>or click to browse</p>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleImageUpload}
                          className="file-input"
                        />
                      </>
                    )}
                  </div>
                  {selectedImage && (
                    <Button 
                      variant="gradient" 
                      fullWidth 
                      onClick={handleAnalyze}
                      loading={isAnalyzing}
                      icon={<Sparkles size={18} />}
                    >
                      {isAnalyzing ? 'Analyzing...' : 'Analyze Meal'}
                    </Button>
                  )}
                </div>
              ) : (
                <div className="manual-section">
                  <Input
                    label="Food Name"
                    placeholder="e.g., Palak Paneer, Idli Sambar"
                    value={foodInput}
                    onChange={(e) => setFoodInput(e.target.value)}
                    icon={<UtensilsCrossed size={18} />}
                  />
                  <div className="quick-select">
                    <span>Popular Indian dishes:</span>
                    <div className="quick-options">
                      {sampleFoods.slice(0, 6).map((food, index) => (
                        <button 
                          key={index}
                          className="quick-btn"
                          onClick={() => setFoodInput(food.name)}
                        >
                          {food.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <Button 
                    variant="gradient" 
                    fullWidth 
                    onClick={handleAnalyze}
                    loading={isAnalyzing}
                    disabled={!foodInput}
                    icon={<Sparkles size={18} />}
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Analyze Food'}
                  </Button>
                </div>
              )}
            </Card>
          </div>
        ) : (
          <div className="results-section animate-slideUp">
            <div className="results-header">
              <div>
                <h2>{currentResult.foodName}</h2>
                <p>AI-powered nutritional analysis</p>
              </div>
              <Button variant="outline" onClick={handleReset} icon={<RotateCcw size={18} />}>
                Analyze Another
              </Button>
            </div>

            <div className="results-grid">
              {/* Main Stats */}
              <Card className="calorie-card">
                <div className="calorie-display">
                  <span className="calorie-value">{currentResult.calories}</span>
                  <span className="calorie-label">Calories</span>
                </div>
                <div className="health-score">
                  <div className="score-circle">
                    <span className="score-value">{currentResult.healthScore}</span>
                  </div>
                  <span className="score-label">Health Score</span>
                </div>
              </Card>

              {/* Macros Chart */}
              <Card className="macros-card">
                <h3>Macronutrients</h3>
                <div className="macro-chart">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={currentMacros}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {currentMacros.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Detailed Macros */}
              <Card className="macros-detail">
                <h3>Nutritional Breakdown</h3>
                <div className="macro-list">
                  <div className="macro-item protein">
                    <span className="macro-name">Protein</span>
                    <span className="macro-value">{currentResult.protein}g</span>
                    <div className="macro-bar" style={{ width: `${Math.min(currentResult.protein * 2, 100)}%` }}></div>
                  </div>
                  <div className="macro-item carbs">
                    <span className="macro-name">Carbohydrates</span>
                    <span className="macro-value">{currentResult.carbs}g</span>
                    <div className="macro-bar" style={{ width: `${Math.min(currentResult.carbs, 100)}%` }}></div>
                  </div>
                  <div className="macro-item fats">
                    <span className="macro-name">Fats</span>
                    <span className="macro-value">{currentResult.fats}g</span>
                    <div className="macro-bar" style={{ width: `${Math.min(currentResult.fats * 2, 100)}%` }}></div>
                  </div>
                  <div className="macro-item fiber">
                    <span className="macro-name">Fiber</span>
                    <span className="macro-value">{currentResult.fiber}g</span>
                    <div className="macro-bar" style={{ width: `${Math.min(currentResult.fiber * 5, 100)}%` }}></div>
                  </div>
                </div>
              </Card>

              {/* AI Suggestions */}
              <Card className="suggestions-card">
                <h3>
                  <Sparkles size={18} />
                  AI Suggestions
                </h3>
                <div className="suggestions-list">
                  {currentResult.suggestions.map((suggestion, index) => (
                    <div key={index} className="suggestion-item">
                      <Check size={16} className="suggestion-icon" />
                      <p>{suggestion}</p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Vitamins & Minerals */}
              <Card className="nutrients-card">
                <h3>Vitamins & Minerals</h3>
                <div className="nutrients-grid">
                  <div className="nutrient-group">
                    <h4>Vitamins</h4>
                    <div className="nutrient-tags">
                      {currentResult.vitamins.map((vitamin, index) => (
                        <span key={index} className="nutrient-tag vitamin">{vitamin}</span>
                      ))}
                    </div>
                  </div>
                  <div className="nutrient-group">
                    <h4>Minerals</h4>
                    <div className="nutrient-tags">
                      {currentResult.minerals.map((mineral, index) => (
                        <span key={index} className="nutrient-tag mineral">{mineral}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="results-actions">
              <Button variant="primary">Add to Today's Log</Button>
              <Button variant="outline">Save to Favorites</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MealAnalysis;
