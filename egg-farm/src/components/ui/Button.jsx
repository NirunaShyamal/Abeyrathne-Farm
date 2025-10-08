import React from 'react';
import { components } from '../../styles/designSystem';

const Button = ({ 
  children, 
  variant = 'primary',
  size = 'md',
  icon = null,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  ...props 
}) => {
  const baseClasses = components.button.base;
  const variantClasses = components.button[variant] || components.button.primary;
  const sizeClasses = components.button.size[size] || components.button.size.md;
  
  const isDisabled = disabled || loading;
  
  const buttonClasses = `
    ${baseClasses}
    ${variantClasses}
    ${sizeClasses}
    ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const handleClick = (e) => {
    if (!isDisabled && onClick) {
      onClick(e);
    }
  };

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={handleClick}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      
      {!loading && icon && iconPosition === 'left' && (
        <span className="mr-2">{icon}</span>
      )}
      
      {children}
      
      {!loading && icon && iconPosition === 'right' && (
        <span className="ml-2">{icon}</span>
      )}
    </button>
  );
};

// Icon Button Component
export const IconButton = ({ 
  icon, 
  variant = 'ghost',
  size = 'md',
  className = '',
  ...props 
}) => {
  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3',
    xl: 'p-4',
  };

  return (
    <Button
      variant={variant}
      className={`${sizeClasses[size]} ${className}`}
      {...props}
    >
      {icon}
    </Button>
  );
};

// Button Group Component
export const ButtonGroup = ({ 
  children, 
  orientation = 'horizontal',
  className = '',
  ...props 
}) => {
  const orientationClasses = orientation === 'vertical' ? 'flex-col space-y-2' : 'flex-row space-x-2';
  
  return (
    <div className={`flex ${orientationClasses} ${className}`} {...props}>
      {children}
    </div>
  );
};

// Floating Action Button
export const FloatingActionButton = ({ 
  icon, 
  onClick,
  className = '',
  ...props 
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-orange-500 to-orange-600 
        hover:from-orange-600 hover:to-orange-700 text-white rounded-full shadow-lg 
        hover:shadow-xl transition-all duration-300 flex items-center justify-center
        hover:scale-110 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      {...props}
    >
      {icon}
    </button>
  );
};

export default Button;
