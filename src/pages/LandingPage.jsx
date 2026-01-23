import { Link } from 'react-router-dom';
import { 
  UtensilsCrossed, 
  BarChart3, 
  Target, 
  Lightbulb, 
  TrendingUp, 
  Bot,
  ArrowRight,
  Check,
  Upload,
  Sparkles,
  Leaf
} from 'lucide-react';
import { Card, Button } from '../components/ui';
import { features } from '../data/mockData';
import './LandingPage.css';

// Icon mapping for features
const featureIcons = {
  mealAnalysis: UtensilsCrossed,
  nutritionTracking: BarChart3,
  personalizedPlans: Target,
  healthInsights: Lightbulb,
  progressTracking: TrendingUp,
  aiAssistant: Bot
};

/**
 * Landing Page - Hero section with features showcase
 */
function LandingPage() {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background">
          <div className="hero-gradient"></div>
          <div className="hero-pattern"></div>
        </div>
        
        <div className="hero-content container">
          <div className="hero-text">
            <span className="hero-badge">
              <Sparkles size={16} />
              AI-Powered Nutrition
            </span>
            <h1 className="hero-title">
              Your Personal <span className="text-gradient">AI Nutritionist</span> for Healthier Living
            </h1>
            <p className="hero-description">
              Analyze Indian meals instantly, get personalized diet plans, track your nutrition journey, 
              and achieve your health goals with the power of artificial intelligence.
            </p>
            <div className="hero-buttons">
              <Link to="/signup">
                <Button variant="gradient" size="large" icon={<ArrowRight size={20} />} iconPosition="right">
                  Get Started Free
                </Button>
              </Link>
              <a href="#features">
                <Button variant="outline" size="large">
                  Explore Features
                </Button>
              </a>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">50K+</span>
                <span className="stat-label">Active Users</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">1M+</span>
                <span className="stat-label">Meals Analyzed</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">95%</span>
                <span className="stat-label">Accuracy Rate</span>
              </div>
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="hero-card animate-float">
              <div className="demo-screen">
                <div className="demo-header">
                  <span className="demo-dot red"></span>
                  <span className="demo-dot yellow"></span>
                  <span className="demo-dot green"></span>
                </div>
                <div className="demo-content">
                  <div className="demo-title">
                    <UtensilsCrossed size={20} />
                    Meal Analysis
                  </div>
                  <div className="demo-meal">Palak Paneer with Roti</div>
                  <div className="demo-nutrients">
                    <div className="nutrient">
                      <span className="nutrient-value">410</span>
                      <span className="nutrient-label">Calories</span>
                    </div>
                    <div className="nutrient">
                      <span className="nutrient-value">18g</span>
                      <span className="nutrient-label">Protein</span>
                    </div>
                    <div className="nutrient">
                      <span className="nutrient-value">32g</span>
                      <span className="nutrient-label">Carbs</span>
                    </div>
                  </div>
                  <div className="demo-score">
                    <span>Health Score:</span>
                    <span className="score-badge">84/100</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Features</span>
            <h2 className="section-title">Everything You Need for <span className="text-gradient">Healthy Living</span></h2>
            <p className="section-description">
              Powerful AI-driven tools to analyze, track, and optimize your nutrition journey with Indian foods.
            </p>
          </div>
          
          <div className="features-grid">
            {features.map((feature, index) => {
              const IconComponent = featureIcons[feature.id] || Leaf;
              return (
                <Card key={index} variant="glass" hover className="feature-card animate-fadeIn" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="feature-icon">
                    <IconComponent size={28} />
                  </div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">How It Works</span>
            <h2 className="section-title">Start Your Health Journey in <span className="text-gradient">3 Simple Steps</span></h2>
          </div>
          
          <div className="steps-container">
            <div className="step">
              <div className="step-number">
                <Upload size={24} />
              </div>
              <div className="step-content">
                <h3>Capture Your Meal</h3>
                <p>Take a photo of your Indian food or enter it manually. Our AI identifies ingredients instantly.</p>
              </div>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <div className="step-number">
                <Sparkles size={24} />
              </div>
              <div className="step-content">
                <h3>Get Instant Analysis</h3>
                <p>Receive detailed nutritional breakdown including calories, macros, vitamins, and health score.</p>
              </div>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <div className="step-number">
                <TrendingUp size={24} />
              </div>
              <div className="step-content">
                <h3>Track & Improve</h3>
                <p>Monitor your progress, get personalized recommendations, and achieve your health goals.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <Card variant="primary" className="cta-card">
            <div className="cta-content">
              <h2>Ready to Transform Your Health?</h2>
              <p>Join thousands of users who are already living healthier with NourishAI.</p>
              <Link to="/signup">
                <Button variant="secondary" size="large" icon={<ArrowRight size={20} />} iconPosition="right">
                  Start Your Free Trial
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
