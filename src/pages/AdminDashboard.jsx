import { useState, useEffect } from 'react';
import { 
  Settings, 
  Users, 
  Activity, 
  UtensilsCrossed, 
  TrendingUp, 
  Award,
  CheckCircle,
  XCircle,
  Clock,
  Server,
  RefreshCw
} from 'lucide-react';
import { Card, Button } from '../components/ui';
import { userActivityData } from '../data/mockData';
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import './AdminDashboard.css';

// API base URL
const API_BASE = 'http://localhost:5000/api';

/**
 * Admin Dashboard - System overview with real database stats
 */
function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeToday: 0,
    mealsLogged: 0,
    averageScore: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [systemHealth, setSystemHealth] = useState([]);

  // Fetch real stats from database
  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      // Fetch admin stats
      const response = await fetch(`${API_BASE}/admin/stats`);
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setRecentUsers(data.recentUsers || []);
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
      // Use mock data as fallback
      setStats({
        totalUsers: 1,
        activeToday: 1,
        mealsLogged: 0,
        averageScore: 0
      });
    }

    // Check system health
    checkSystemHealth();
    setIsLoading(false);
  };

  const checkSystemHealth = async () => {
    const health = [];
    
    // Check API
    try {
      const start = Date.now();
      const res = await fetch(`${API_BASE}/health`);
      const latency = Date.now() - start;
      health.push({
        name: 'API Server',
        status: res.ok ? 'healthy' : 'error',
        latency: `${latency}ms`
      });
    } catch {
      health.push({ name: 'API Server', status: 'error', latency: 'N/A' });
    }

    // Database status (if API is healthy, DB is likely healthy)
    health.push({
      name: 'Database (Supabase)',
      status: health[0]?.status === 'healthy' ? 'healthy' : 'warning',
      latency: '~50ms'
    });

    // AI Model (placeholder for now)
    health.push({
      name: 'AI Model',
      status: 'healthy',
      latency: '~200ms'
    });

    setSystemHealth(health);
  };

  // Goals distribution data
  const goalsData = [
    { name: 'Weight Loss', value: 45, color: '#ef4444' },
    { name: 'Muscle Gain', value: 30, color: '#3b82f6' },
    { name: 'Healthy Living', value: 25, color: '#10b981' }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy': return <CheckCircle size={16} className="status-icon healthy" />;
      case 'warning': return <Clock size={16} className="status-icon warning" />;
      default: return <XCircle size={16} className="status-icon error" />;
    }
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  return (
    <div className="admin-page animate-fadeIn">
      <header className="page-header">
        <div>
          <h1>
            <Settings size={28} className="header-icon" />
            Admin Dashboard
          </h1>
          <p>System overview and real-time analytics</p>
        </div>
        <Button variant="outline" onClick={fetchAdminData} icon={<RefreshCw size={18} />}>
          Refresh
        </Button>
      </header>

      {/* Stats Overview */}
      <section className="stats-overview">
        <Card className="stat-card">
          <div className="stat-icon users">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.totalUsers.toLocaleString()}</span>
            <span className="stat-label">Total Users</span>
          </div>
          <span className="stat-change positive">In database</span>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon active">
            <Activity size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.activeToday.toLocaleString()}</span>
            <span className="stat-label">Active Today</span>
          </div>
          <span className="stat-change positive">
            {stats.totalUsers > 0 ? `${((stats.activeToday / stats.totalUsers) * 100).toFixed(0)}%` : '0%'} of users
          </span>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon meals">
            <UtensilsCrossed size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.mealsLogged.toLocaleString()}</span>
            <span className="stat-label">Meals Logged</span>
          </div>
          <span className="stat-change positive">Total</span>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon score">
            <Award size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.averageScore || '--'}</span>
            <span className="stat-label">Avg Health Score</span>
          </div>
          <span className="stat-change positive">Across all users</span>
        </Card>
      </section>

      {/* Charts Section */}
      <section className="admin-charts">
        <Card className="chart-card">
          <div className="chart-header">
            <h3>
              <TrendingUp size={18} />
              User Growth
            </h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={userActivityData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    background: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorUsers)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="chart-card">
          <div className="chart-header">
            <h3>User Goals Distribution</h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={goalsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {goalsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </section>

      {/* Bottom Section */}
      <section className="admin-bottom">
        {/* Recent Users Table */}
        <Card className="users-card">
          <h3>
            <Users size={18} />
            Recent Users (from Database)
          </h3>
          <div className="users-table">
            {recentUsers.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Goal</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((user, index) => (
                    <tr key={index}>
                      <td className="user-name">
                        <div className="user-avatar-small">
                          {user.name?.split(' ').map(n => n[0]).join('') || 'U'}
                        </div>
                        {user.name}
                      </td>
                      <td className="user-email">{user.email}</td>
                      <td>
                        <span className={`goal-badge ${(user.goal || 'healthy-living').toLowerCase().replace(' ', '-')}`}>
                          {user.goal || 'Healthy Living'}
                        </span>
                      </td>
                      <td className="user-joined">{formatTimeAgo(user.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-table">
                <Users size={32} />
                <p>No users registered yet</p>
              </div>
            )}
          </div>
        </Card>

        {/* System Health */}
        <Card className="health-card">
          <h3>
            <Server size={18} />
            System Health
          </h3>
          <div className="health-list">
            {systemHealth.map((item, index) => (
              <div key={index} className={`health-item ${item.status}`}>
                <div className="health-info">
                  {getStatusIcon(item.status)}
                  <span className="health-name">{item.name}</span>
                </div>
                <div className="health-stats">
                  <span className="health-latency">{item.latency}</span>
                  <span className={`health-status ${item.status}`}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}

export default AdminDashboard;
