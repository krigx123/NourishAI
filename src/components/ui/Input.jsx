import './Input.css';

/**
 * Reusable Input component with label and error states
 */
function Input({
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  error,
  helperText,
  icon,
  required = false,
  disabled = false,
  className = '',
  name,
  id
}) {
  const inputId = id || name || label?.toLowerCase().replace(/\s/g, '-');

  return (
    <div className={`input-wrapper ${error ? 'input-error' : ''} ${className}`}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      <div className="input-container">
        {icon && <span className="input-icon">{icon}</span>}
        <input
          type={type}
          id={inputId}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={icon ? 'has-icon' : ''}
        />
      </div>
      {(error || helperText) && (
        <span className={`input-helper ${error ? 'error' : ''}`}>
          {error || helperText}
        </span>
      )}
    </div>
  );
}

export default Input;
