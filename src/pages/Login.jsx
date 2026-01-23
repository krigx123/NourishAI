import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Leaf, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Button, Input } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

/**
 * Login Page - Split screen with image and form
 */
function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setApiError('');
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setApiError('');

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (error) {
      setApiError(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left Side - Image */}
      <div className="auth-image-section">
        <div className="auth-image-overlay">
          <div className="auth-image-content">
            <div className="auth-logo">
              <Leaf size={48} />
              <span>NourishAI</span>
            </div>
            <h2>Welcome Back!</h2>
            <p>Your personal AI nutritionist is ready to help you continue your health journey.</p>
            <div className="auth-image-features">
              <div className="feature-item">
                <span className="feature-icon">🍽️</span>
                <span>Track your meals with AI</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📊</span>
                <span>Get personalized insights</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🎯</span>
                <span>Achieve your health goals</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="auth-form-section">
        <div className="auth-form-container">
          <div className="auth-header">
            <h1>Sign In</h1>
            <p>Enter your credentials to access your account</p>
          </div>

          {apiError && (
            <div className="auth-error-banner">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
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
                placeholder="Enter your password"
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

            <div className="auth-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <a href="#" className="forgot-password">Forgot password?</a>
            </div>

            <Button 
              type="submit" 
              variant="gradient" 
              fullWidth 
              loading={isLoading}
              icon={<ArrowRight size={18} />}
              iconPosition="right"
            >
              Sign In
            </Button>
          </form>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <p className="auth-footer">
            Don't have an account? <Link to="/signup">Create one for free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
