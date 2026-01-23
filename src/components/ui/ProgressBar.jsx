import './ProgressBar.css';

/**
 * Reusable ProgressBar component for tracking progress
 */
function ProgressBar({ 
  value = 0, 
  max = 100, 
  label,
  showPercentage = true,
  variant = 'primary',
  size = 'medium',
  animated = true
}) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className="progress-wrapper">
      {(label || showPercentage) && (
        <div className="progress-header">
          {label && <span className="progress-label">{label}</span>}
          {showPercentage && <span className="progress-percentage">{Math.round(percentage)}%</span>}
        </div>
      )}
      <div className={`progress-track progress-${size}`}>
        <div 
          className={`progress-bar progress-${variant} ${animated ? 'progress-animated' : ''}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
