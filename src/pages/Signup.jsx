import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Leaf, Eye, EyeOff, ArrowRight, Scale, Ruler, Activity } from 'lucide-react';
import { Button, Input } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

/**
 * Signup Page - Split screen with comprehensive onboarding
 */
function Signup() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    weight: '',
    height: '',
    gender: 'female',
    dietType: 'Vegetarian',
    activityLevel: 'Moderate',
    goals: []
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState('');

  const goalOptions = ['Weight Loss', 'Muscle Gain', 'Better Digestion', 'Heart Health', 'Energy Boost', 'Healthy Living'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setApiError('');
  };

  const handleGoalToggle = (goal) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    return newErrors;
  };

  const handleNextStep = () => {
    const validationErrors = validateStep1();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setApiError('');

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        age: parseInt(formData.age) || null,
        weight: parseFloat(formData.weight) || null,
        height: parseFloat(formData.height) || null,
        gender: formData.gender,
        dietType: formData.dietType,
        activityLevel: formData.activityLevel,
        goals: formData.goals
      });
      navigate('/dashboard');
    } catch (error) {
      setApiError(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left Side - Image */}
      <div className="auth-image-section signup">
        <div className="auth-image-overlay">
          <div className="auth-image-content">
            <div className="auth-logo">
              <Leaf size={48} />
              <span>NourishAI</span>
            </div>
            <h2>Start Your Journey</h2>
            <p>Join thousands of users achieving their health goals with AI-powered nutrition guidance.</p>
            <div className="auth-image-stats">
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
                <span className="stat-label">Success Rate</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="auth-form-section">
        <div className="auth-form-container">
          <div className="auth-header">
            <h1>{step === 1 ? 'Create Account' : 'Tell Us About You'}</h1>
            <p>{step === 1 ? 'Enter your details to get started' : 'Help us personalize your experience'}</p>
            <div className="step-indicator">
              <div className={`step ${step >= 1 ? 'active' : ''}`}>1</div>
              <div className="step-line"></div>
              <div className={`step ${step >= 2 ? 'active' : ''}`}>2</div>
            </div>
          </div>

          {apiError && (
            <div className="auth-error-banner">
              {apiError}
            </div>
          )}

          <form onSubmit={step === 2 ? handleSubmit : (e) => { e.preventDefault(); handleNextStep(); }} className="auth-form">
            {step === 1 ? (
              <>
                <Input
                  type="text"
                  name="name"
                  label="Full Name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  icon={<User size={18} />}
                  required
                />

                <Input
                  type="email"
                  name="email"
                  label="Email Address"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  icon={<Mail size={18} />}
                  required
                />

                <div className="password-field">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    label="Password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                    icon={<Lock size={18} />}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <Input
                  type="password"
                  name="confirmPassword"
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  icon={<Lock size={18} />}
                  required
                />

                <Button 
                  type="submit" 
                  variant="gradient" 
                  fullWidth
                  icon={<ArrowRight size={18} />}
                  iconPosition="right"
                >
                  Continue
                </Button>
              </>
            ) : (
              <>
                <div className="form-row">
                  <Input
                    type="number"
                    name="age"
                    label="Age"
                    placeholder="25"
                    value={formData.age}
                    onChange={handleChange}
                    icon={<User size={18} />}
                  />
                  <div className="select-field">
                    <label>Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleChange}>
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <Input
                    type="number"
                    name="weight"
                    label="Weight (kg)"
                    placeholder="65"
                    value={formData.weight}
                    onChange={handleChange}
                    icon={<Scale size={18} />}
                  />
                  <Input
                    type="number"
                    name="height"
                    label="Height (cm)"
                    placeholder="165"
                    value={formData.height}
                    onChange={handleChange}
                    icon={<Ruler size={18} />}
                  />
                </div>

                <div className="form-row">
                  <div className="select-field">
                    <label>Diet Type</label>
                    <select name="dietType" value={formData.dietType} onChange={handleChange}>
                      <option value="Vegetarian">Vegetarian</option>
                      <option value="Non-Vegetarian">Non-Vegetarian</option>
                      <option value="Vegan">Vegan</option>
                      <option value="Eggetarian">Eggetarian</option>
                    </select>
                  </div>
                  <div className="select-field">
                    <label>Activity Level</label>
                    <select name="activityLevel" value={formData.activityLevel} onChange={handleChange}>
                      <option value="Sedentary">Sedentary</option>
                      <option value="Light">Light</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Active">Active</option>
                      <option value="Very Active">Very Active</option>
                    </select>
                  </div>
                </div>

                <div className="goals-selection">
                  <label>Health Goals (select all that apply)</label>
                  <div className="goals-grid">
                    {goalOptions.map((goal) => (
                      <button
                        key={goal}
                        type="button"
                        className={`goal-chip ${formData.goals.includes(goal) ? 'selected' : ''}`}
                        onClick={() => handleGoalToggle(goal)}
                      >
                        {goal}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-buttons">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    variant="gradient"
                    loading={isLoading}
                    icon={<ArrowRight size={18} />}
                    iconPosition="right"
                  >
                    Create Account
                  </Button>
                </div>
              </>
            )}
          </form>

          {step === 1 && (
            <>
              <div className="auth-divider">
                <span>or</span>
              </div>

              <p className="auth-footer">
                Already have an account? <Link to="/login">Sign in</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Signup;
