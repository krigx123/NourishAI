import { useState, useEffect, useRef } from 'react';
import { 
  UtensilsCrossed, 
  Camera, 
  Edit3, 
  Check, 
  Sparkles,
  RotateCcw,
  Heart,
  Loader,
  Search,
  X,
  Image as ImageIcon,
  Brain,
  AlertCircle,
  Plus,
  Trash2,
  List
} from 'lucide-react';
import { Card, Button } from '../components/ui';
import { searchFoods, getRandomFoods, getAllCategories, getFoodsByCategory } from '../data/indianFoodDatabase';
import { mealsAPI, geminiAPI, visionAPI, groqAPI } from '../services/api';
import { detectIndianFood, createImage, loadModel, isModelLoaded } from '../services/indianFoodAI';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import './MealAnalysis.css';

/**
 * Meal Analysis Page - Local Indian Food AI
 * Uses MobileNet + Smart Mapping Layer to detect Indian foods offline
 */
function MealAnalysis() {
  const [analysisMode, setAnalysisMode] = useState('upload');
  const [foodInput, setFoodInput] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ type: '', text: '' });
  const [popularFoods, setPopularFoods] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFoodSelector, setShowFoodSelector] = useState(false);
  const [suggestedFoods, setSuggestedFoods] = useState([]);
  const [mealItems, setMealItems] = useState([]);
  const [showMealSummary, setShowMealSummary] = useState(false);
  const [aiStatus, setAiStatus] = useState('loading');
  const [servingMultiplier, setServingMultiplier] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const searchRef = useRef(null);
  const fileInputRef = useRef(null);

  const categories = ['All', ...getAllCategories()];

  // Load AI Model on mount
  useEffect(() => {
    setPopularFoods(getRandomFoods(8));
    loadModel().then(() => setAiStatus('ready')).catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (foodInput.length >= 2) {
      const results = searchFoods(foodInput);
      setSearchResults(results);
      setShowDropdown(results.length > 0);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  }, [foodInput]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFileName(file.name); // Capture filename for dataset optimization
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Drag and drop handlers for web images
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    // Check for dropped files first
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setSelectedFileName(file.name);
        const reader = new FileReader();
        reader.onloadend = () => setSelectedImage(reader.result);
        reader.readAsDataURL(file);
        return;
      }
    }
    
    // Check for image URL (dragged from web)
    const url = e.dataTransfer.getData('text/uri-list') || e.dataTransfer.getData('text/plain');
    if (url && (url.match(/\.(jpg|jpeg|png|gif|webp)$/i) || url.includes('image'))) {
      setSaveMessage({ type: 'info', text: '🔄 Loading image from web...' });
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          setSelectedImage(reader.result);
          setSelectedFileName('web-image.jpg');
          setSaveMessage({ type: 'success', text: '✅ Image loaded from web!' });
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error('Failed to load image from URL:', error);
        setSaveMessage({ type: 'error', text: 'Could not load image. Try downloading first.' });
      }
    }
  };

  const handleScanImage = async () => {
    if (!selectedImage) return;
    
    setIsAnalyzing(true);
    setAiStatus('analyzing');
    setSaveMessage({ type: '', text: '' });
    
    try {
      // Step 1: Detect food using Google Cloud Vision API
      console.log('Step 1: Sending image to Vision API...');
      setSaveMessage({ type: 'info', text: '🔍 Detecting food with Google Vision...' });
      
      const visionResult = await visionAPI.detectFood(selectedImage);
      console.log('Vision API detected:', visionResult);
      
      if (!visionResult.success || !visionResult.primaryMeal) {
        throw new Error('Could not detect food in image');
      }
      
      // Step 2: Get nutrition info from Groq LLM
      console.log('Step 2: Getting nutrition for:', visionResult.primaryMeal);
      setSaveMessage({ type: 'info', text: `🧠 Analyzing: ${visionResult.primaryMeal}...` });
      
      // Use raw labels for Groq, pass primary meal decision from Vision
      const rawLabels = visionResult.rawLabels?.map(l => l.name) || [visionResult.primaryMeal];
      const groqResult = await groqAPI.analyzeNutrition(rawLabels, {
        primaryMeal: visionResult.primaryMeal,
        alternatives: visionResult.alternatives,
        detectionNote: visionResult.detectionNote,
        isIndianMeal: visionResult.isIndianMeal
      });
      console.log('Groq nutrition analysis:', groqResult);
      
      if (!groqResult.success || !groqResult.nutrition) {
        throw new Error('Nutrition analysis failed');
      }
      
      const nutrition = groqResult.nutrition;
      // Alternatives come from Vision API, not Groq
      const alternatives = visionResult.alternatives || [];
      
      // Create result object matching existing structure
      const result = {
        foodName: nutrition.foodName,
        calories: nutrition.calories,
        protein: nutrition.protein,
        carbs: nutrition.carbs,
        fats: nutrition.fat,
        fiber: nutrition.fiber || 0,
        healthScore: nutrition.healthScore,
        verified: true,
        vitamins: nutrition.vitamins || ['Vitamin A', 'Vitamin C', 'Vitamin B6'],
        minerals: nutrition.minerals || ['Iron', 'Calcium', 'Potassium'],
        alternatives: alternatives,
        detectionNote: visionResult.detectionNote,
        suggestions: [
          nutrition.insight || 'Great choice! Balanced meal.',
          `Serving size: ${nutrition.serving || 'Standard portion'}`,
          alternatives.length > 0 ? `Alternatives: ${alternatives.map(a => a.name).join(', ')}` : '✅ Analyzed by Vision AI + Groq LLM'
        ]
      };
      
      setAnalysisResult(result);
      setShowResults(true);
      const altText = alternatives.length > 0 ? ` | Also: ${alternatives[0]?.name}` : '';
      setSaveMessage({ 
        type: 'success', 
        text: `✅ ${nutrition.foodName}${altText}` 
      });
      
    } catch (error) {
      console.error('Vision/Groq Error:', error.message);
      
      // Fallback to local AI if cloud APIs fail
      console.log('Falling back to Local AI...');
      setSaveMessage({ type: 'info', text: '🔄 Using local AI as fallback...' });
      
      try {
        const imgElement = await createImage(selectedImage);
        const aiPredictions = await detectIndianFood(imgElement, selectedFileName);
        console.log('Local AI Detected:', aiPredictions);
        
        let suggestions = [];
        for (const pred of aiPredictions) {
          const matches = searchFoods(pred.name);
          if (matches.length > 0) {
            suggestions.push({ ...matches[0], confidence: pred.confidence });
          }
        }
        
        suggestions = suggestions.filter((food, index, self) => 
          index === self.findIndex(f => f.name === food.name)
        ).slice(0, 6);
        
        if (suggestions.length > 0) {
          setSuggestedFoods(suggestions);
          setShowFoodSelector(true);
          setSaveMessage({ 
            type: 'success', 
            text: `🤖 Local AI: ${suggestions[0].name}${suggestions[1] ? ', ' + suggestions[1].name : ''}` 
          });
        } else {
          setSaveMessage({ type: 'error', text: 'Could not identify food. Please search manually.' });
        }
      } catch (fallbackError) {
        console.error('Local AI Fallback Error:', fallbackError);
        setSaveMessage({ type: 'error', text: 'AI Analysis failed. Try searching manually.' });
      }
    } finally {
      setIsAnalyzing(false);
      setAiStatus('ready');
    }
  };

  const handleSelectScannedFood = (food) => {
    setShowFoodSelector(false);
    analyzeFood(food);
  };

  const handleSelectFood = (food) => {
    setFoodInput(food.name);
    setShowDropdown(false);
    analyzeFood(food);
  };

  const analyzeFood = async (food) => {
    setIsAnalyzing(true);
    setSaveMessage({ type: '', text: '' });
    
    // Try to verify nutrition values with Gemini (expert nutritionist)
    let verifiedNutrition = null;
    let isVerified = false;
    
    try {
      console.log('Verifying nutrition with Gemini expert nutritionist...');
      const geminiResult = await geminiAPI.verifyNutrition(food.name);
      
      if (geminiResult.success && geminiResult.nutrition) {
        verifiedNutrition = geminiResult.nutrition;
        isVerified = true;
        console.log('Gemini verified nutrition:', verifiedNutrition);
      }
    } catch (error) {
      console.log('Gemini verification unavailable, using local data:', error.message);
    }
    
    // Use verified values if available, otherwise fall back to local database
    const nutrition = verifiedNutrition || food;
    
    const suggestions = [];
    const healthScore = nutrition.healthScore || food.healthScore;
    
    if (healthScore >= 80) {
      suggestions.push('Excellent healthy choice! 🌟');
    } else if (healthScore >= 60) {
      suggestions.push('Good nutritional balance');
    } else {
      suggestions.push('Consider balancing with more vegetables');
    }
    
    const protein = nutrition.protein || food.protein;
    if (protein >= 10) {
      suggestions.push('Great protein content for muscle building');
    } else {
      suggestions.push('Add paneer or dal for extra protein');
    }

    const fiber = nutrition.fiber || food.fiber;
    if (fiber >= 4) {
      suggestions.push('Excellent fiber for digestive health');
    }

    const fat = nutrition.fat || food.fat;
    if (fat > 15) {
      suggestions.push('High in fats - enjoy in moderation');
    }

    const serving = nutrition.serving || food.serving;
    suggestions.push(`Serving size: ${serving}`);
    
    if (isVerified) {
      suggestions.unshift('✅ Nutrition verified by AI Expert Nutritionist');
    }

    const result = {
      foodName: nutrition.name || food.name,
      calories: nutrition.calories || food.calories,
      protein: protein,
      carbs: nutrition.carbs || food.carbs,
      fats: fat,
      fiber: fiber,
      healthScore: healthScore,
      category: food.category,
      serving: serving,
      image: food.image,
      confidence: food.confidence,
      vitamins: getVitaminsForFood(food),
      minerals: getMineralsForFood(food),
      suggestions: suggestions,
      verified: isVerified
    };
    
    setIsAnalyzing(false);
    setAnalysisResult(result);
    setShowResults(true);
    
    if (isVerified) {
      setSaveMessage({ type: 'success', text: '✅ Nutrition verified by AI nutritionist!' });
    }
  };

  const getVitaminsForFood = (food) => {
    const vitaminMap = {
      'Breakfast': ['Vitamin B1', 'Vitamin B6', 'Folic Acid'],
      'Rice': ['Vitamin B1', 'Vitamin B6', 'Niacin'],
      'Bread': ['Vitamin B1', 'Vitamin B2', 'Iron'],
      'Dal': ['Vitamin B1', 'Folic Acid', 'Vitamin K'],
      'Paneer': ['Vitamin A', 'Vitamin D', 'Vitamin B12'],
      'Vegetable': ['Vitamin A', 'Vitamin C', 'Vitamin K'],
      'Non-Veg': ['Vitamin B12', 'Vitamin D', 'Vitamin B6'],
      'Snacks': ['Vitamin B1', 'Vitamin B6'],
      'Sweets': ['Vitamin A', 'Vitamin D'],
      'Beverages': ['Vitamin C', 'Vitamin B12']
    };
    return vitaminMap[food.category] || ['Vitamin A', 'Vitamin C', 'Vitamin B6'];
  };

  const getMineralsForFood = (food) => {
    const mineralMap = {
      'Breakfast': ['Iron', 'Calcium', 'Phosphorus'],
      'Rice': ['Iron', 'Magnesium', 'Selenium'],
      'Bread': ['Iron', 'Calcium', 'Zinc'],
      'Dal': ['Iron', 'Potassium', 'Magnesium'],
      'Paneer': ['Calcium', 'Phosphorus', 'Zinc'],
      'Vegetable': ['Potassium', 'Iron', 'Magnesium'],
      'Non-Veg': ['Iron', 'Zinc', 'Phosphorus'],
      'Snacks': ['Sodium', 'Potassium', 'Iron'],
      'Sweets': ['Calcium', 'Phosphorus'],
      'Beverages': ['Calcium', 'Potassium', 'Magnesium']
    };
    return mineralMap[food.category] || ['Iron', 'Calcium', 'Potassium'];
  };

  const handleAnalyze = async () => {
    const results = searchFoods(foodInput);
    if (results.length > 0) {
      analyzeFood(results[0]);
    } else {
      setSaveMessage({ type: 'error', text: `"${foodInput}" not found.` });
    }
  };

  const handleReset = () => {
    setShowResults(false);
    setSelectedImage(null);
    setSelectedFileName(''); // Clear cached filename
    setFoodInput('');
    setAnalysisResult(null);
    setSaveMessage({ type: '', text: '' });
    setShowFoodSelector(false);
    setPopularFoods(getRandomFoods(8));
  };

  const handleAddToMeal = () => {
    if (!analysisResult) return;
    setMealItems([...mealItems, { ...analysisResult, id: Date.now() }]);
    handleReset(); // Clear current scan to allow next one
    setSaveMessage({ type: 'success', text: 'Item added to meal! Scan next item.' });
  };

  const handleRemoveFromMeal = (id) => {
    setMealItems(mealItems.filter(item => item.id !== id));
  };

  const handleClearMeal = () => {
    setMealItems([]);
    setShowMealSummary(false);
    handleReset();
  };

  const getTotalNutrition = () => {
    return mealItems.reduce((acc, item) => ({
      calories: acc.calories + item.calories,
      protein: acc.protein + item.protein,
      carbs: acc.carbs + item.carbs,
      fats: acc.fats + item.fats,
      fiber: acc.fiber + item.fiber
    }), { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0 });
  };

  const handleLogWholeMeal = async () => {
    setIsSaving(true);
    setSaveMessage({ type: '', text: '' });
    try {
      // Combine all items into one meal entry
      const totals = getTotalNutrition();
      const combinedName = mealItems.map(item => item.foodName).join(' + ');
      
      await mealsAPI.logMeal({
        foodName: combinedName,
        calories: totals.calories,
        protein: totals.protein,
        carbs: totals.carbs,
        fats: totals.fats,
        fiber: totals.fiber,
        mealType: getMealType(),
        imageUrl: null
      });
      
      setSaveMessage({ type: 'success', text: '✓ Meal logged successfully!' });
      setTimeout(() => handleClearMeal(), 1500);
    } catch (error) {
      setSaveMessage({ type: 'error', text: 'Failed to log meal' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddToLog = async () => {
    if (!analysisResult) return;
    
    setIsSaving(true);
    setSaveMessage({ type: '', text: '' });

    try {
      await mealsAPI.logMeal({
        foodName: analysisResult.foodName,
        calories: analysisResult.calories,
        protein: analysisResult.protein,
        carbs: analysisResult.carbs,
        fats: analysisResult.fats,
        fiber: analysisResult.fiber,
        mealType: getMealType(),
        imageUrl: selectedImage || null
      });

      setSaveMessage({ type: 'success', text: '✓ Added to today\'s log!' });
    } catch (error) {
      setSaveMessage({ type: 'error', text: error.message || 'Failed to log meal' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveToFavorites = async () => {
    if (!analysisResult) return;
    
    setIsSaving(true);
    setSaveMessage({ type: '', text: '' });

    try {
      await mealsAPI.addFavorite(analysisResult.foodName, {
        calories: analysisResult.calories,
        protein: analysisResult.protein,
        carbs: analysisResult.carbs,
        fats: analysisResult.fats,
        fiber: analysisResult.fiber,
        healthScore: analysisResult.healthScore,
        vitamins: analysisResult.vitamins,
        minerals: analysisResult.minerals
      });

      setSaveMessage({ type: 'success', text: '♥ Saved to favorites!' });
    } catch (error) {
      setSaveMessage({ type: 'error', text: error.message || 'Failed to save favorite' });
    } finally {
      setIsSaving(false);
    }
  };

  const getMealType = () => {
    const hour = new Date().getHours();
    if (hour < 11) return 'breakfast';
    if (hour < 15) return 'lunch';
    if (hour < 18) return 'snack';
    return 'dinner';
  };

  const currentMacros = analysisResult ? [
    { name: 'Protein', value: Math.round(analysisResult.protein * servingMultiplier), color: '#10b981' },
    { name: 'Carbs', value: Math.round(analysisResult.carbs * servingMultiplier), color: '#3b82f6' },
    { name: 'Fats', value: Math.round(analysisResult.fats * servingMultiplier), color: '#f59e0b' },
    { name: 'Fiber', value: Math.round(analysisResult.fiber * servingMultiplier), color: '#8b5cf6' }
  ] : [];

  const getCategoryFoods = () => {
    if (selectedCategory === 'All') {
      return popularFoods;
    }
    return getFoodsByCategory(selectedCategory).slice(0, 8);
  };

  return (
    <div className="meal-analysis-page animate-fadeIn">
      <header className="page-header">
        <div>
          <h1>
            <UtensilsCrossed size={28} className="header-icon" />
            Meal Analysis
          </h1>
          <p>AI-powered Indian food recognition with nutritional analysis</p>
        </div>
        <div className={`ai-status ${aiStatus}`}>
          <Brain size={16} />
          {aiStatus === 'ready' && 'AI Ready'}
          {aiStatus === 'analyzing' && 'Analyzing...'}
        </div>
      </header>

      <div className="analysis-content">
        {showMealSummary ? (
          <div className="results-section animate-slideUp">
             <div className="results-header">
               <div>
                  <h2>Create Your Meal</h2>
                  <p>{mealItems.length} items selected</p>
               </div>
               <Button variant="outline" onClick={() => setShowMealSummary(false)} icon={<Plus size={18} />}>
                 Add More
               </Button>
            </div>
            
            <div className="results-grid">
               <Card className="calorie-card" style={{ gridColumn: '1 / -1' }}>
                 <div className="calorie-display" style={{ justifyContent: 'space-around', width: '100%' }}>
                   <div style={{ textAlign: 'center' }}>
                      <span className="calorie-value">{getTotalNutrition().calories}</span>
                      <span className="calorie-label">Total Calories</span>
                   </div>
                   <div style={{ textAlign: 'center' }}>
                      <span className="calorie-value" style={{ fontSize: '1.5rem', color: '#10b981' }}>{getTotalNutrition().protein}g</span>
                      <span className="calorie-label">Protein</span>
                   </div>
                   <div style={{ textAlign: 'center' }}>
                      <span className="calorie-value" style={{ fontSize: '1.5rem', color: '#3b82f6' }}>{getTotalNutrition().carbs}g</span>
                      <span className="calorie-label">Carbs</span>
                   </div>
                   <div style={{ textAlign: 'center' }}>
                      <span className="calorie-value" style={{ fontSize: '1.5rem', color: '#f59e0b' }}>{getTotalNutrition().fats}g</span>
                      <span className="calorie-label">Fats</span>
                   </div>
                 </div>
               </Card>
               
               <div className="meal-items-list">
                  {mealItems.map(item => (
                    <div key={item.id} className="meal-item-card">
                      <div className="meal-item-info">
                        <span className="meal-item-emoji">{item.image}</span>
                        <div className="meal-item-details">
                          <h4>{item.foodName}</h4>
                          <p>{item.calories} kcal • {item.protein}g P • {item.carbs}g C • {item.fats}g F</p>
                        </div>
                      </div>
                      <button 
                        className="meal-item-remove"
                        onClick={() => handleRemoveFromMeal(item.id)}
                      >
                        <Trash2 size={18}/>
                      </button>
                    </div>
                  ))}
               </div>
            </div>
            
            <div className="results-actions">
               <Button variant="primary" fullWidth onClick={handleLogWholeMeal} loading={isSaving}>Confirm & Log Entire Meal</Button>
               <Button variant="outline" fullWidth onClick={handleClearMeal} style={{ borderColor: '#ef4444', color: '#ef4444' }}>Clear Meal</Button>
            </div>
          </div>
        ) : !showResults ? (
          <div className="analysis-input-section">
            {mealItems.length > 0 && (
              <div 
                className="meal-cart-indicator animate-pulse" 
                style={{
                  background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
                  padding: '1rem',
                  borderRadius: '1rem',
                  color: 'white',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(255, 107, 107, 0.4)'
                }}
                onClick={() => setShowMealSummary(true)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.5rem', borderRadius: '50%' }}>
                    <List size={20} />
                  </div>
                  <div>
                    <strong style={{ display: 'block' }}>{mealItems.length} items in meal</strong>
                    <span style={{ fontSize: '0.85rem', opacity: 0.9 }}>Tap to complete order</span>
                  </div>
                </div>
                <Button size="sm" variant="secondary" style={{ background: 'white', color: '#FF6B6B', border: 'none' }}>View</Button>
              </div>
            )}
            <div className="mode-toggle">
              <button 
                className={`mode-btn ${analysisMode === 'upload' ? 'active' : ''}`}
                onClick={() => setAnalysisMode('upload')}
              >
                <Camera size={18} />
                Scan Food
              </button>
              <button 
                className={`mode-btn ${analysisMode === 'manual' ? 'active' : ''}`}
                onClick={() => setAnalysisMode('manual')}
              >
                <Edit3 size={18} />
                Search Food
              </button>
            </div>

            {analysisMode === 'upload' ? (
              <>
                <Card className="upload-card">
                  <div 
                    className={`upload-zone ${selectedImage ? 'has-image' : ''} ${isDragging ? 'dragover' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    {selectedImage ? (
                      <div className="preview-container">
                        <img 
                          src={selectedImage} 
                          alt="Selected food" 
                          className="food-preview" 
                        />
                        <button className="remove-image" onClick={() => setSelectedImage(null)}>
                          <X size={20} />
                        </button>
                      </div>
                    ) : (
                      <div className="upload-placeholder" onClick={() => fileInputRef.current?.click()}>
                        <div className="upload-icon">
                          <Camera size={48} />
                        </div>
                        <h3>{isDragging ? 'Drop Image Here' : 'Upload Food Image'}</h3>
                        <p>{isDragging ? 'Release to upload' : 'Take a photo, upload, or drag from web'}</p>
                        <div className="upload-hint">
                          <ImageIcon size={16} />
                          Supports drag & drop from browser
                        </div>
                      </div>
                    )}
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      accept="image/*" 
                      capture="environment"
                      onChange={handleImageUpload}
                      className="file-input"
                    />
                  </div>

                  {saveMessage.text && !showFoodSelector && (
                    <div className={`save-message ${saveMessage.type}`}>
                      {saveMessage.text}
                    </div>
                  )}

                  {selectedImage && !showFoodSelector && (
                    <Button 
                      variant="gradient" 
                      fullWidth 
                      onClick={handleScanImage}
                      loading={isAnalyzing}
                      icon={<Sparkles size={18} />}
                    >
                      {isAnalyzing ? 'AI Detecting Food...' : 'Detect Food with AI'}
                    </Button>
                  )}
                </Card>

                {showFoodSelector && (
                  <Card className="food-selector-card">
                    <div className="selector-header">
                      <h3>
                        <Sparkles size={20} />
                        AI Detection Results
                      </h3>
                      <p>Tap to select the correct food</p>
                    </div>
                    {saveMessage.text && (
                      <div className={`save-message ${saveMessage.type}`} style={{ marginBottom: '1rem' }}>
                        {saveMessage.text}
                      </div>
                    )}
                    <div className="selector-grid">
                      {suggestedFoods.map((food, index) => (
                        <div 
                          key={index} 
                          className="selector-item"
                          onClick={() => handleSelectScannedFood(food)}
                        >
                          <span className="selector-emoji">{food.image}</span>
                          <span className="selector-name">{food.name}</span>
                          <span className="selector-calories">{food.calories} kcal</span>
                          {food.confidence && (
                            <span className="selector-confidence">{food.confidence}%</span>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="selector-footer">
                      <p>Wrong detection? <button className="link-btn" onClick={() => setAnalysisMode('manual')}>Search manually</button></p>
                    </div>
                  </Card>
                )}
              </>
            ) : (
              <>
                <Card className="search-card">
                  <div className="search-header">
                    <h3>
                      <Search size={20} />
                      Search for Food
                    </h3>
                    <span className="food-count">100+ Indian dishes</span>
                  </div>
                  
                  <div className="search-container" ref={searchRef}>
                    <div className="search-input-wrapper">
                      <Search size={18} className="search-icon" />
                      <input
                        type="text"
                        placeholder="Type to search... (e.g., Paneer, Dosa)"
                        value={foodInput}
                        onChange={(e) => setFoodInput(e.target.value)}
                        className="search-input"
                        onFocus={() => foodInput.length >= 2 && setShowDropdown(true)}
                      />
                      {foodInput && (
                        <button className="clear-search" onClick={() => setFoodInput('')}>
                          <X size={16} />
                        </button>
                      )}
                    </div>
                    
                    {showDropdown && (
                      <div className="search-dropdown">
                        {searchResults.map((food, index) => (
                          <div 
                            key={index} 
                            className="search-result-item"
                            onClick={() => handleSelectFood(food)}
                          >
                            <span className="result-emoji">{food.image}</span>
                            <div className="result-info">
                              <span className="result-name">{food.name}</span>
                              <span className="result-details">{food.category} • {food.calories} kcal</span>
                            </div>
                            <span className="result-score" style={{ 
                              color: food.healthScore >= 70 ? '#10b981' : food.healthScore >= 50 ? '#f59e0b' : '#ef4444' 
                            }}>
                              {food.healthScore}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {saveMessage.text && !showResults && (
                    <div className={`save-message ${saveMessage.type}`}>
                      {saveMessage.text}
                    </div>
                  )}

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
                </Card>

                <div className="category-filter">
                  {categories.slice(0, 8).map(cat => (
                    <button
                      key={cat}
                      className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="popular-foods">
                  <h3>{selectedCategory === 'All' ? 'Popular Foods' : selectedCategory}</h3>
                  <div className="foods-grid">
                    {getCategoryFoods().map((food, index) => (
                      <Card 
                        key={index} 
                        className="food-card"
                        onClick={() => handleSelectFood(food)}
                      >
                        <span className="food-emoji">{food.image}</span>
                        <div className="food-info">
                          <span className="food-name">{food.name}</span>
                          <span className="food-calories">{food.calories} kcal</span>
                        </div>
                        <div className="food-score" style={{ 
                          background: food.healthScore >= 70 ? 'rgba(16, 185, 129, 0.1)' : 
                                      food.healthScore >= 50 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                          color: food.healthScore >= 70 ? '#10b981' : 
                                 food.healthScore >= 50 ? '#f59e0b' : '#ef4444'
                        }}>
                          {food.healthScore}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="results-section animate-slideUp">
            <div className="results-header">
              <div className="result-title">
                {selectedImage && (
                  <img src={selectedImage} alt="Scanned food" className="result-image-thumb" />
                )}
                {!selectedImage && <span className="result-emoji-large">{analysisResult.image}</span>}
                <div>
                  <h2>{analysisResult.foodName}</h2>
                  <p>
                    {analysisResult.category} • {analysisResult.serving}
                    {analysisResult.confidence && ` • ${analysisResult.confidence}% AI confidence`}
                  </p>
                </div>
              </div>
              <Button variant="outline" onClick={handleReset} icon={<RotateCcw size={18} />}>
                Analyze Another
              </Button>
            </div>

            {saveMessage.text && (
              <div className={`save-message ${saveMessage.type}`}>
                {saveMessage.text}
              </div>
            )}

            <div className="results-grid">
              <Card className="calorie-card">
                {/* Serving Size Selector */}
                <div className="serving-size-box">
                  <div className="serving-header">
                    <span>Serving Size</span>
                    <span className="serving-badge">{servingMultiplier}x</span>
                  </div>
                  <div className="serving-options">
                    {[0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4].map(size => (
                      <button 
                        key={size}
                        className={`serving-option ${servingMultiplier === size ? 'active' : ''}`}
                        onClick={() => setServingMultiplier(size)}
                      >
                        {size}x
                      </button>
                    ))}
                  </div>
                </div>
                <div className="calorie-display">
                  <span className="calorie-value">{Math.round(analysisResult.calories * servingMultiplier)}</span>
                  <span className="calorie-label">Calories</span>
                </div>
                <div className="health-score">
                  <div className="score-circle" style={{
                    background: analysisResult.healthScore >= 70 ? 'rgba(16, 185, 129, 0.3)' :
                                analysisResult.healthScore >= 50 ? 'rgba(245, 158, 11, 0.3)' : 'rgba(239, 68, 68, 0.3)'
                  }}>
                    <span className="score-value">{analysisResult.healthScore}</span>
                  </div>
                  <span className="score-label">Health Score</span>
                </div>
              </Card>

              <Card className="macros-card">
                <h3>Macronutrients</h3>
                <div className="macro-chart-center">
                  <ResponsiveContainer width={180} height={180}>
                    <PieChart>
                      <Pie
                        data={currentMacros}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {currentMacros.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="macros-detail">
                <h3>Nutritional Breakdown</h3>
                <div className="macro-list">
                  <div className="macro-item protein">
                    <span className="macro-name">Protein</span>
                    <span className="macro-value">{Math.round(analysisResult.protein * servingMultiplier)}g</span>
                    <div className="macro-bar" style={{ width: `${Math.min(analysisResult.protein * servingMultiplier * 2, 100)}%` }}></div>
                  </div>
                  <div className="macro-item carbs">
                    <span className="macro-name">Carbohydrates</span>
                    <span className="macro-value">{Math.round(analysisResult.carbs * servingMultiplier)}g</span>
                    <div className="macro-bar" style={{ width: `${Math.min(analysisResult.carbs * servingMultiplier, 100)}%` }}></div>
                  </div>
                  <div className="macro-item fats">
                    <span className="macro-name">Fats</span>
                    <span className="macro-value">{Math.round(analysisResult.fats * servingMultiplier)}g</span>
                    <div className="macro-bar" style={{ width: `${Math.min(analysisResult.fats * servingMultiplier * 2, 100)}%` }}></div>
                  </div>
                  <div className="macro-item fiber">
                    <span className="macro-name">Fiber</span>
                    <span className="macro-value">{Math.round(analysisResult.fiber * servingMultiplier)}g</span>
                    <div className="macro-bar" style={{ width: `${Math.min(analysisResult.fiber * servingMultiplier * 5, 100)}%` }}></div>
                  </div>
                </div>
              </Card>

              <Card className="suggestions-card">
                <h3>
                  <Sparkles size={18} />
                  AI Suggestions
                </h3>
                <div className="suggestions-list">
                  {analysisResult.suggestions.map((suggestion, index) => (
                    <div key={index} className="suggestion-item">
                      <Check size={16} className="suggestion-icon" />
                      <p>{suggestion}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="nutrients-card">
                <h3>Vitamins & Minerals</h3>
                <div className="nutrients-grid">
                  <div className="nutrient-group">
                    <h4>Vitamins</h4>
                    <div className="nutrient-tags">
                      {analysisResult.vitamins.map((vitamin, index) => (
                        <span key={index} className="nutrient-tag vitamin">{vitamin}</span>
                      ))}
                    </div>
                  </div>
                  <div className="nutrient-group">
                    <h4>Minerals</h4>
                    <div className="nutrient-tags">
                      {analysisResult.minerals.map((mineral, index) => (
                        <span key={index} className="nutrient-tag mineral">{mineral}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="results-actions">
              <Button 
                variant="outline" 
                onClick={handleAddToMeal}
                icon={<Plus size={18} />}
              >
                Add to Meal
              </Button>
              <Button 
                variant="primary" 
                onClick={handleAddToLog}
                loading={isSaving}
                icon={isSaving ? <Loader size={18} className="spin" /> : null}
              >
                Log Single Item
              </Button>
              <Button 
                variant="outline" 
                onClick={handleSaveToFavorites}
                icon={<Heart size={18} />}
              >
                Save
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MealAnalysis;
