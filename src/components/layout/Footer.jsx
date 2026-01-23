import { Link } from 'react-router-dom';
import { Leaf, Github, Mail, MapPin } from 'lucide-react';
import './Footer.css';

/**
 * Footer component with project info
 */
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-content">
          {/* Brand Section */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <div className="logo-icon-wrapper">
                <Leaf size={24} />
              </div>
              <span className="logo-text">NourishAI</span>
            </Link>
            <p className="footer-description">
              Your AI-powered nutrition assistant for healthier living. Analyze Indian meals, 
              track nutrition, and achieve your health goals with personalized recommendations.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-links">
            <h4>Quick Links</h4>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/analysis">Meal Analysis</Link>
            <Link to="/diet">Diet Plans</Link>
            <Link to="/tracker">Nutrition Tracker</Link>
          </div>

          {/* Features */}
          <div className="footer-links">
            <h4>Features</h4>
            <Link to="/analysis">AI Food Recognition</Link>
            <Link to="/insights">Health Insights</Link>
            <Link to="/tracker">Progress Tracking</Link>
            <Link to="/diet">Personalized Plans</Link>
          </div>

          {/* Project Info */}
          <div className="footer-links">
            <h4>Project Info</h4>
            <span className="footer-info-item">
              <MapPin size={14} />
              DTL Project 2024-25
            </span>
            <span className="footer-info-item">3rd Semester</span>
            <span className="footer-info-item">Computer Science</span>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-credits">
            <p>© 2025 NourishAI. A college project showcasing AI-powered nutrition assistance.</p>
          </div>
          <div className="footer-tech">
            <span className="tech-badge">React + Vite</span>
            <span className="tech-badge">Recharts</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
