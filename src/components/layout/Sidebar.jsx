import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  ClipboardList, 
  BarChart3, 
  Lightbulb, 
  User, 
  Settings,
  Leaf
} from 'lucide-react';
import './Sidebar.css';

/**
 * Sidebar navigation for dashboard pages
 */
function Sidebar() {
  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/analysis', icon: UtensilsCrossed, label: 'Meal Analysis' },
    { path: '/diet', icon: ClipboardList, label: 'Diet Plans' },
    { path: '/tracker', icon: BarChart3, label: 'Nutrition Tracker' },
    { path: '/insights', icon: Lightbulb, label: 'Health Insights' },
    { path: '/profile', icon: User, label: 'Profile' },
    { path: '/admin', icon: Settings, label: 'Admin Panel' },
  ];

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
          <div className="user-avatar">PS</div>
          <div className="user-info">
            <span className="user-name">Priya Sharma</span>
            <span className="user-role">Premium User</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
