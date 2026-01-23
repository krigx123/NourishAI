import { Link, useLocation } from 'react-router-dom';
import { Leaf, Menu, X, LogOut, User } from 'lucide-react';
import { useState } from 'react';
import './Navbar.css';

/**
 * Main navigation bar component
 */
function Navbar({ isAuthenticated, onLogout }) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <div className="logo-icon-wrapper">
            <Leaf size={24} />
          </div>
          <span className="logo-text">NourishAI</span>
        </Link>

        {/* Navigation Links */}
        <div className={`navbar-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          {isAuthenticated ? (
            <>
              <Link 
                to="/dashboard" 
                className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
              >
                Dashboard
              </Link>
              <Link 
                to="/analysis" 
                className={`nav-link ${isActive('/analysis') ? 'active' : ''}`}
              >
                Meal Analysis
              </Link>
              <Link 
                to="/diet" 
                className={`nav-link ${isActive('/diet') ? 'active' : ''}`}
              >
                Diet Plans
              </Link>
              <Link 
                to="/tracker" 
                className={`nav-link ${isActive('/tracker') ? 'active' : ''}`}
              >
                Tracker
              </Link>
              <Link 
                to="/insights" 
                className={`nav-link ${isActive('/insights') ? 'active' : ''}`}
              >
                Insights
              </Link>
            </>
          ) : (
            <>
              <a href="#features" className="nav-link">Features</a>
              <a href="#about" className="nav-link">About</a>
            </>
          )}
        </div>

        {/* Auth Buttons */}
        <div className="navbar-auth">
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="nav-profile">
                <User size={18} />
                <span className="profile-name">Priya</span>
              </Link>
              <button onClick={onLogout} className="nav-logout">
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/signup" className="nav-btn-primary">Get Started</Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="navbar-mobile-toggle" 
          aria-label="Toggle menu"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
