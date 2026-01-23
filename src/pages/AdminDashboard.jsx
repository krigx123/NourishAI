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
  Server
} from 'lucide-react';
import { Card } from '../components/ui';
import { adminStats, userActivityData } from '../data/mockData';
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import './AdminDashboard.css';

/**
 * Admin Dashboard - System overview and analytics
 */
function AdminDashboard() {
  // Goals distribution data
  const goalsData = [
    { name: 'Weight Loss', value: 45, color: '#ef4444' },
    { name: 'Muscle Gain', value: 30, color: '#3b82f6' },
    { name: 'Healthy Living', value: 25, color: '#10b981' }
  ];

  // Recent users (mock data)
  const recentUsers = [
    { name: 'Priya Sharma', email: 'priya@example.com', goal: 'Weight Loss', joined: '2 hours ago' },
    { name: 'Rahul Verma', email: 'rahul@example.com', goal: 'Muscle Gain', joined: '5 hours ago' },
    { name: 'Anjali Patel', email: 'anjali@example.com', goal: 'Healthy Living', joined: '1 day ago' },
    { name: 'Vikram Singh', email: 'vikram@example.com', goal: 'Weight Loss', joined: '1 day ago' },
    { name: 'Meera Reddy', email: 'meera@example.com', goal: 'Healthy Living', joined: '2 days ago' }
  ];

  // System health checks
  const systemHealth = [
    { name: 'API Server', status: 'healthy', latency: '45ms' },
    { name: 'Database', status: 'healthy', latency: '12ms' },
    { name: 'AI Model', status: 'healthy', latency: '230ms' },
    { name: 'Storage', status: 'warning', latency: '156ms' }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy': return <CheckCircle size={16} className="status-icon healthy" />;
      case 'warning': return <Clock size={16} className="status-icon warning" />;
      default: return <XCircle size={16} className="status-icon error" />;
    }
  };

  return (
    <div className="admin-page animate-fadeIn">
      <header className="page-header">
        <div>
          <h1>
            <Settings size={28} className="header-icon" />
            Admin Dashboard
          </h1>
          <p>System overview and analytics</p>
        </div>
      </header>

      {/* Stats Overview */}
      <section className="stats-overview">
        <Card className="stat-card">
          <div className="stat-icon users">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{adminStats.totalUsers.toLocaleString()}</span>
            <span className="stat-label">Total Users</span>
          </div>
          <span className="stat-change positive">+{adminStats.newUsersThisWeek} this week</span>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon active">
            <Activity size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{adminStats.activeToday.toLocaleString()}</span>
            <span className="stat-label">Active Today</span>
          </div>
          <span className="stat-change positive">{((adminStats.activeToday / adminStats.totalUsers) * 100).toFixed(1)}% of users</span>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon meals">
            <UtensilsCrossed size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{adminStats.mealsLogged.toLocaleString()}</span>
            <span className="stat-label">Meals Logged</span>
          </div>
          <span className="stat-change positive">This month</span>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon score">
            <Award size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{adminStats.averageScore}</span>
            <span className="stat-label">Avg Health Score</span>
          </div>
          <span className="stat-change positive">+4 from last month</span>
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
            Recent Users
          </h3>
          <div className="users-table">
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
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      {user.name}
                    </td>
                    <td className="user-email">{user.email}</td>
                    <td>
                      <span className={`goal-badge ${user.goal.toLowerCase().replace(' ', '-')}`}>
                        {user.goal}
                      </span>
                    </td>
                    <td className="user-joined">{user.joined}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
