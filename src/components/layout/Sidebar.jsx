import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  ClipboardList, 
  BarChart3, 
  Lightbulb, 
  User, 
  Settings,
  Leaf,
  History
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

/**
 * Sidebar navigation for dashboard pages
 * Admin Panel is only visible to admin users
 */
function Sidebar() {
  const { user } = useAuth();

  // Check if user is admin (email is admin@nourishai.com)
  const isAdmin = user?.email === 'admin@nourishai.com';

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/analysis', icon: UtensilsCrossed, label: 'Meal Analysis' },
    { path: '/diet', icon: ClipboardList, label: 'Diet Plans' },
    { path: '/history', icon: History, label: 'Meal History' },
    { path: '/tracker', icon: BarChart3, label: 'Nutrition Tracker' },
    { path: '/insights', icon: Lightbulb, label: 'Health Insights' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  // Add admin panel only for admin users
  if (isAdmin) {
    menuItems.push({ path: '/admin', icon: Settings, label: 'Admin Panel' });
  }

  // Get user initials for avatar
  const getInitials = () => {
    if (!user?.name) return 'U';
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo-icon">
          <Leaf size={28} />
        </div>
        <span className="sidebar-title">NourishAI</span>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <item.icon size={20} className="sidebar-icon" />
            <span className="sidebar-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="user-avatar">{getInitials()}</div>
          <div className="user-info">
            <span className="user-name">{user?.name || 'User'}</span>
            <span className="user-role">{isAdmin ? 'Admin' : 'Premium User'}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
