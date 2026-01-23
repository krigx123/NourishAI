import { 
  Lightbulb, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Droplets, 
  Flame, 
  TrendingUp,
  Heart,
  Target,
  ArrowRight
} from 'lucide-react';
import { Card, Button } from '../components/ui';
import { healthInsights, healthTips } from '../data/mockData';
import './HealthInsights.css';

/**
 * Health Insights Page - AI-powered health recommendations
 */
function HealthInsights() {
  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning': return <AlertTriangle size={18} />;
      case 'success': return <CheckCircle size={18} />;
      case 'info': return <Info size={18} />;
      default: return <Info size={18} />;
    }
  };

  const getPriorityBadge = (priority) => {
    const classes = `priority-badge ${priority}`;
    return <span className={classes}>{priority}</span>;
  };

  // Weekly summary data
  const weeklySummary = [
    { label: 'Avg Calories', value: '1,720', icon: Flame, change: '-5%', positive: true },
    { label: 'Water Intake', value: '7.2L', icon: Droplets, change: '+12%', positive: true },
    { label: 'Protein Intake', value: '385g', icon: Target, change: '+8%', positive: true },
    { label: 'Health Score', value: '85', icon: Heart, change: '+3', positive: true }
  ];

  return (
    <div className="insights-page animate-fadeIn">
      <header className="page-header">
        <div>
          <h1>
            <Lightbulb size={28} className="header-icon" />
            Health Insights
          </h1>
          <p>AI-powered recommendations based on your nutrition data</p>
        </div>
      </header>

      {/* Alerts Section */}
      <section className="alerts-section">
        <h2>Important Alerts</h2>
        <div className="alerts-list">
          {healthInsights.map((insight) => (
            <Card key={insight.id} className={`alert-card ${insight.type}`}>
              <div className="alert-content">
                <div className="alert-icon">
                  {getAlertIcon(insight.type)}
                </div>
                <div className="alert-text">
                  <h3>{insight.title}</h3>
                  <p>{insight.message}</p>
                </div>
              </div>
              <div className="alert-actions">
                {getPriorityBadge(insight.priority)}
                <button className="action-btn">
                  <ArrowRight size={16} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Weekly Summary */}
      <section className="summary-section">
        <h2>Weekly Summary</h2>
        <div className="summary-grid">
          {weeklySummary.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <Card key={index} className="summary-card">
                <div className="summary-icon">
                  <IconComponent size={24} />
                </div>
                <div className="summary-info">
                  <span className="summary-value">{item.value}</span>
                  <span className="summary-label">{item.label}</span>
                </div>
                <span className={`summary-change ${item.positive ? 'positive' : 'negative'}`}>
                  <TrendingUp size={14} />
                  {item.change}
                </span>
              </Card>
            );
          })}
        </div>
      </section>

      {/* AI Health Tips */}
      <section className="tips-section">
        <div className="tips-header">
          <h2>
            <Lightbulb size={20} />
            AI Health Tips
          </h2>
          <Button variant="outline" size="small">Refresh Tips</Button>
        </div>
        <div className="tips-grid">
          {healthTips.map((tip, index) => (
            <Card key={index} className="tip-card" hover>
              <span className="tip-number">{index + 1}</span>
              <p>{tip}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Action Items */}
      <section className="actions-section">
        <h2>Recommended Actions</h2>
        <Card className="actions-card">
          <div className="action-item">
            <div className="action-check">
              <input type="checkbox" id="action1" />
              <label htmlFor="action1">Add paneer or dal to lunch for extra protein</label>
            </div>
          </div>
          <div className="action-item">
            <div className="action-check">
              <input type="checkbox" id="action2" />
              <label htmlFor="action2">Drink 2 more glasses of water today</label>
            </div>
          </div>
          <div className="action-item">
            <div className="action-check">
              <input type="checkbox" id="action3" />
              <label htmlFor="action3">Include more palak/methi for iron intake</label>
            </div>
          </div>
          <div className="action-item">
            <div className="action-check">
              <input type="checkbox" id="action4" />
              <label htmlFor="action4">Have buttermilk after meals for digestion</label>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}

export default HealthInsights;
