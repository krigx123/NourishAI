import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Leaf } from 'lucide-react';
import { Card, Button, Input } from '../components/ui';
import './Auth.css';

/**
 * Login Page - Form with validation and simulated auth
 */
function Login({ onLogin }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
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
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <Card className="auth-card" hover={false}>
          <div className="auth-header">
            <div className="auth-icon">
              <Leaf size={32} />
            </div>
            <h1>Welcome Back</h1>
            <p>Sign in to continue your health journey</p>
          </div>

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

            <Input
              type="password"
              name="password"
              label="Password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              icon={<Lock size={18} />}
              required
            />

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
            >
              Sign In
            </Button>
          </form>

          <div className="auth-divider">
            <span>or continue with</span>
          </div>

          <div className="social-buttons">
            <Button variant="outline" className="social-btn">
              Google
            </Button>
            <Button variant="outline" className="social-btn">
              Apple
            </Button>
          </div>

          <p className="auth-footer">
            Don't have an account? <Link to="/signup">Sign up free</Link>
          </p>
        </Card>
      </div>
    </div>
  );
}

export default Login;
