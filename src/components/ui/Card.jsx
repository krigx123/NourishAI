import './Card.css';

/**
 * Reusable Card component with multiple variants
 */
function Card({ 
  children, 
  variant = 'default', 
  hover = true, 
  className = '',
  padding = 'medium',
  onClick
}) {
  const paddingClasses = {
    none: '',
    small: 'card-padding-sm',
    medium: 'card-padding-md',
    large: 'card-padding-lg'
  };

  return (
    <div 
      className={`card card-${variant} ${hover ? 'card-hover' : ''} ${paddingClasses[padding]} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}

export default Card;
