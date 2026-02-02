import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

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
import MealLogs from './pages/MealLogs';
import ChatInterface from './components/ChatInterface';

// Protected Route wrapper
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
}

// Admin-only Route wrapper
function AdminRoute({ children }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }
  
  // Check if user is admin (admin@nourishai.com)
  const isAdmin = user?.email === 'admin@nourishai.com';
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
}

// Main App content (need to be inside AuthProvider to use useAuth)
function AppContent() {
  const { isAuthenticated, logout, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={
            <>
              <Navbar isAuthenticated={isAuthenticated} onLogout={logout} />
              <LandingPage />
              <Footer />
            </>
          } />
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/dashboard" /> : 
            <>
              <Login />
            </>
          } />
          <Route path="/signup" element={
            isAuthenticated ? <Navigate to="/dashboard" /> : 
            <>
              <Signup />
            </>
          } />
          
          {/* Protected Dashboard Routes */}
          <Route element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analysis" element={<MealAnalysis />} />
            <Route path="/diet" element={<DietRecommendation />} />
            <Route path="/tracker" element={<NutritionTracker />} />
            <Route path="/insights" element={<HealthInsights />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/history" element={<MealLogs />} />
            <Route path="/admin" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <ChatInterface />
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
