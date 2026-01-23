import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';

// Layout Components
import { Navbar, Footer, DashboardLayout } from './components/layout';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import MealAnalysis from './pages/MealAnalysis';
import DietRecommendation from './pages/DietRecommendation';
import NutritionTracker from './pages/NutritionTracker';
import HealthInsights from './pages/HealthInsights';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  // Simulated auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="app">
        {/* Show navbar only on public pages */}
        <Routes>
          <Route path="/" element={
            <>
              <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
              <LandingPage />
              <Footer />
            </>
          } />
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/dashboard" /> : 
            <>
              <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
              <Login onLogin={handleLogin} />
              <Footer />
            </>
          } />
          <Route path="/signup" element={
            isAuthenticated ? <Navigate to="/dashboard" /> : 
            <>
              <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
              <Signup onLogin={handleLogin} />
              <Footer />
            </>
          } />
          
          {/* Protected Dashboard Routes */}
          <Route element={
            isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" />
          }>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analysis" element={<MealAnalysis />} />
            <Route path="/diet" element={<DietRecommendation />} />
            <Route path="/tracker" element={<NutritionTracker />} />
            <Route path="/insights" element={<HealthInsights />} />
            <Route path="/profile" element={<Profile onLogout={handleLogout} />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
