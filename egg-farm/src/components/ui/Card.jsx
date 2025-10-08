import React from 'react';
import { components } from '../../styles/designSystem';

const Card = ({ 
  children, 
  className = '', 
  hover = true, 
  padding = 'default',
  height = 'auto',
  gradient = false,
  border = false,
  ...props 
}) => {
  const baseClasses = components.card.base;
  const hoverClasses = hover ? components.card.hover : '';
  const paddingClasses = padding === 'none' ? '' : components.card.padding;
  
  // Height classes
  const heightClasses = height !== 'auto' ? `h-${height}` : '';
  
  // Gradient classes
  const gradientClasses = gradient ? `bg-gradient-to-br ${gradient}` : '';
  
  // Border classes
  const borderClasses = border ? `border-l-4 border-${border}-500` : '';
  
  const cardClasses = `
    ${baseClasses}
    ${hoverClasses}
    ${paddingClasses}
    ${heightClasses}
    ${gradientClasses}
    ${borderClasses}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
};

// Card Header Component
export const CardHeader = ({ children, className = '', ...props }) => {
  const headerClasses = `${components.card.header} ${className}`.trim();
  
  return (
    <div className={headerClasses} {...props}>
      {children}
    </div>
  );
};

// Card Body Component
export const CardBody = ({ children, className = '', ...props }) => {
  const bodyClasses = `${components.card.body} ${className}`.trim();
  
  return (
    <div className={bodyClasses} {...props}>
      {children}
    </div>
  );
};

// Card Footer Component
export const CardFooter = ({ children, className = '', ...props }) => {
  const footerClasses = `${components.card.footer} ${className}`.trim();
  
  return (
    <div className={footerClasses} {...props}>
      {children}
    </div>
  );
};

// Metric Card Component
export const MetricCard = ({ 
  title, 
  value, 
  icon, 
  color = 'orange',
  trend = null,
  loading = false,
  className = '',
  ...props 
}) => {
  const colorClasses = {
    orange: 'border-orange-500 text-orange-600',
    blue: 'border-blue-500 text-blue-600',
    green: 'border-green-500 text-green-600',
    red: 'border-red-500 text-red-600',
    purple: 'border-purple-500 text-purple-600',
  };

  const iconBgClasses = {
    orange: 'bg-orange-100',
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    red: 'bg-red-100',
    purple: 'bg-purple-100',
  };

  const trendClasses = {
    up: 'text-green-500',
    down: 'text-red-500',
    neutral: 'text-gray-500',
  };

  return (
    <Card 
      className={`${colorClasses[color]} ${className}`}
      border={color}
      {...props}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${iconBgClasses[color]} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <div className="text-3xl font-bold">
            {loading ? (
              <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
            ) : (
              value
            )}
          </div>
        </div>
      </div>
      
      {trend && (
        <div className="flex items-center text-sm text-gray-600">
          <svg 
            className={`w-4 h-4 mr-1 ${trendClasses[trend.direction]}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d={trend.direction === 'up' ? 
                "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" : 
                "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
              } 
            />
          </svg>
          <span>{trend.label}</span>
        </div>
      )}
    </Card>
  );
};

// Stats Card Component
export const StatsCard = ({ 
  title, 
  subtitle, 
  icon, 
  stats = [],
  className = '',
  ...props 
}) => {
  return (
    <Card className={className} {...props}>
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mr-4">
          {icon}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="text-gray-600">{subtitle}</p>
        </div>
      </div>
      
      <div className="space-y-6">
        {stats.map((stat, index) => (
          <div key={index} className={`bg-gradient-to-r ${stat.bgColor} rounded-xl p-4`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className={`w-8 h-8 ${stat.iconBg} rounded-lg flex items-center justify-center mr-3`}>
                  {stat.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{stat.title}</h3>
                  <p className="text-sm text-gray-600">{stat.subtitle}</p>
                </div>
              </div>
              <span className={`text-2xl font-bold ${stat.textColor}`}>
                {stat.value}
              </span>
            </div>
            {stat.progress && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${stat.progressColor}`}
                  style={{ width: `${stat.progress}%` }}
                ></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default Card;
