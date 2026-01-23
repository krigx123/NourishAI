import { useState, useEffect } from 'react';
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
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import './Profile.css';

/**
 * Profile Page - User settings with real data
 */
function Profile() {
  const { user, logout, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (user) {
      setUserData({
        name: user.name || '',
        email: user.email || '',
        age: user.age || '',
        weight: user.weight || '',
        height: user.height || '',
        gender: user.gender || 'female',
        dietType: user.dietType || 'Vegetarian',
        allergies: user.allergies || [],
        goals: user.goals || [],
        activityLevel: user.activityLevel || 'Moderate',
        joinedDate: user.joinedDate || new Date().toISOString()
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await userAPI.updateProfile({
        name: userData.name,
        age: parseInt(userData.age) || null,
        weight: parseFloat(userData.weight) || null,
        height: parseFloat(userData.height) || null,
        gender: userData.gender,
        dietType: userData.dietType,
        allergies: userData.allergies,
        goals: userData.goals,
        activityLevel: userData.activityLevel
      });

      updateUser({ 
        ...userData, 
        targetCalories: response.targetCalories 
      });
      
      setIsEditing(false);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportData = async () => {
    try {
      const data = await userAPI.exportData();
      
      // Create a simplified, human-readable export
      const simplifiedData = {
        exportedAt: new Date().toLocaleString(),
        userInfo: {
          name: data.user?.name,
          email: data.user?.email,
          memberSince: new Date(data.user?.created_at).toLocaleDateString()
        },
        profile: data.profile ? {
          age: data.profile.age,
          weight: data.profile.weight ? `${data.profile.weight} kg` : null,
          height: data.profile.height ? `${data.profile.height} cm` : null,
          gender: data.profile.gender,
          dietType: data.profile.diet_type,
          activityLevel: data.profile.activity_level,
          targetCalories: data.profile.target_calories,
          goals: data.profile.goals,
          allergies: data.profile.allergies
        } : null,
        mealsSummary: {
          totalMealsLogged: data.mealLogs?.length || 0,
          meals: data.mealLogs?.map(m => ({
            food: m.food_name,
            calories: m.calories,
            date: new Date(m.logged_at).toLocaleDateString()
          })) || []
        },
        favorites: data.favorites?.map(f => f.food_name) || []
      };
      
      const blob = new Blob([JSON.stringify(simplifiedData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nourishai-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setMessage({ type: 'success', text: 'Data exported successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to export data' });
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await userAPI.deleteAccount();
      logout();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete account' });
    }
  };

  if (!userData) {
    return (
      <div className="profile-page animate-fadeIn">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  const bmi = userData.weight && userData.height 
    ? (userData.weight / ((userData.height / 100) ** 2)).toFixed(1)
    : '--';

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
          loading={isSaving}
        >
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </Button>
      </header>

      {message.text && (
        <div className={`message-banner ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="profile-content">
        {/* Profile Header Card */}
        <Card className="profile-header-card">
          <div className="avatar-section">
            <div className="avatar-large">
              {userData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
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
              <span className="badge member">
                Member since {new Date(userData.joinedDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
              </span>
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
                  disabled={true}
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
                  <span className="stat-value">{userData.weight || '--'} kg</span>
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
                  <span className="stat-value">{userData.height || '--'} cm</span>
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
                  <span className="stat-value">{bmi}</span>
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
                  {userData.allergies?.length > 0 ? (
                    userData.allergies.map((allergy, index) => (
                      <span key={index} className="tag allergy">{allergy}</span>
                    ))
                  ) : (
                    <span className="tag none">None specified</span>
                  )}
                </div>
              </div>
              <div className="preference-item">
                <span className="preference-label">Health Goals</span>
                <div className="tags">
                  {userData.goals?.length > 0 ? (
                    userData.goals.map((goal, index) => (
                      <span key={index} className="tag goal">{goal}</span>
                    ))
                  ) : (
                    <span className="tag none">None specified</span>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Account Actions */}
          <Card className="actions-card">
            <h3>Account Actions</h3>
            <div className="actions-list">
              <Button variant="outline" fullWidth icon={<Download size={18} />} onClick={handleExportData}>
                Export My Data
              </Button>
              <Button variant="outline" fullWidth onClick={logout} icon={<LogOut size={18} />}>
                Sign Out
              </Button>
              <Button 
                variant="danger" 
                fullWidth 
                icon={<Trash2 size={18} />}
                onClick={() => setShowDeleteConfirm(true)}
              >
                Delete Account
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <Card className="confirm-modal">
            <h3>Delete Account?</h3>
            <p>This action cannot be undone. All your data will be permanently deleted.</p>
            <div className="modal-actions">
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDeleteAccount}>
                Delete Account
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

export default Profile;
