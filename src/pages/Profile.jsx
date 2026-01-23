import { useState } from 'react';
import { 
  User, 
  Mail, 
  Calendar, 
  Activity, 
  Target, 
  Save,
  LogOut,
  Download,
  Trash2,
  Edit2,
  Scale,
  Ruler
} from 'lucide-react';
import { Card, Button, Input } from '../components/ui';
import { mockUser } from '../data/mockData';
import './Profile.css';

/**
 * Profile Page - User settings and preferences
 */
function Profile({ onLogout }) {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(mockUser);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // In a real app, this would save to backend
  };

  const goals = ['Weight Loss', 'Muscle Gain', 'Better Digestion', 'Heart Health', 'Energy Boost'];

  return (
    <div className="profile-page animate-fadeIn">
      <header className="page-header">
        <div>
          <h1>
            <User size={28} className="header-icon" />
            Profile Settings
          </h1>
          <p>Manage your account and preferences</p>
        </div>
        <Button 
          variant={isEditing ? 'primary' : 'outline'} 
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          icon={isEditing ? <Save size={18} /> : <Edit2 size={18} />}
        >
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </Button>
      </header>

      <div className="profile-content">
        {/* Profile Header Card */}
        <Card className="profile-header-card">
          <div className="avatar-section">
            <div className="avatar-large">
              {userData.name.split(' ').map(n => n[0]).join('')}
            </div>
            {isEditing && (
              <button className="avatar-upload">Change Photo</button>
            )}
          </div>
          <div className="profile-info">
            <h2>{userData.name}</h2>
            <p className="profile-email">{userData.email}</p>
            <div className="profile-badges">
              <span className="badge premium">Premium User</span>
              <span className="badge member">Member since {new Date(userData.joinedDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
            </div>
          </div>
        </Card>

        <div className="profile-grid">
          {/* Personal Information */}
          <Card className="info-card">
            <h3>
              <User size={18} />
              Personal Information
            </h3>
            <div className="info-fields">
              <div className="field-row">
                <Input
                  label="Full Name"
                  name="name"
                  value={userData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  icon={<User size={18} />}
                />
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={userData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  icon={<Mail size={18} />}
                />
              </div>
              <div className="field-row">
                <Input
                  label="Age"
                  name="age"
                  type="number"
                  value={userData.age}
                  onChange={handleChange}
                  disabled={!isEditing}
                  icon={<Calendar size={18} />}
                />
                <Input
                  label="Activity Level"
                  name="activityLevel"
                  value={userData.activityLevel}
                  onChange={handleChange}
                  disabled={!isEditing}
                  icon={<Activity size={18} />}
                />
              </div>
            </div>
          </Card>

          {/* Physical Stats */}
          <Card className="stats-card">
            <h3>
              <Scale size={18} />
              Physical Stats
            </h3>
            <div className="stats-grid">
              <div className="stat-item">
                <Scale size={24} />
                <div className="stat-info">
                  <span className="stat-value">{userData.weight} kg</span>
                  <span className="stat-label">Weight</span>
                </div>
                {isEditing && (
                  <input 
                    type="number" 
                    name="weight"
                    value={userData.weight}
                    onChange={handleChange}
                    className="stat-input"
                  />
                )}
              </div>
              <div className="stat-item">
                <Ruler size={24} />
                <div className="stat-info">
                  <span className="stat-value">{userData.height} cm</span>
                  <span className="stat-label">Height</span>
                </div>
                {isEditing && (
                  <input 
                    type="number" 
                    name="height"
                    value={userData.height}
                    onChange={handleChange}
                    className="stat-input"
                  />
                )}
              </div>
              <div className="stat-item calculated">
                <Activity size={24} />
                <div className="stat-info">
                  <span className="stat-value">
                    {(userData.weight / ((userData.height / 100) ** 2)).toFixed(1)}
                  </span>
                  <span className="stat-label">BMI</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Dietary Preferences */}
          <Card className="preferences-card">
            <h3>
              <Target size={18} />
              Dietary Preferences
            </h3>
            <div className="preferences-content">
              <div className="preference-item">
                <span className="preference-label">Diet Type</span>
                <span className="preference-value">{userData.dietType}</span>
              </div>
              <div className="preference-item">
                <span className="preference-label">Allergies</span>
                <div className="tags">
                  {userData.allergies.map((allergy, index) => (
                    <span key={index} className="tag allergy">{allergy}</span>
                  ))}
                  {userData.allergies.length === 0 && (
                    <span className="tag none">None specified</span>
                  )}
                </div>
              </div>
              <div className="preference-item">
                <span className="preference-label">Health Goals</span>
                <div className="tags">
                  {userData.goals.map((goal, index) => (
                    <span key={index} className="tag goal">{goal}</span>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Account Actions */}
          <Card className="actions-card">
            <h3>Account Actions</h3>
            <div className="actions-list">
              <Button variant="outline" fullWidth icon={<Download size={18} />}>
                Export My Data
              </Button>
              <Button variant="outline" fullWidth onClick={onLogout} icon={<LogOut size={18} />}>
                Sign Out
              </Button>
              <Button variant="danger" fullWidth icon={<Trash2 size={18} />}>
                Delete Account
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Profile;
