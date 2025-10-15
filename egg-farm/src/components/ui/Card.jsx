import React from 'react';

// Base Card Component
const Card = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`bg-white rounded-xl shadow-md border border-gray-200 p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// Metric Card Component
const MetricCard = ({ 
  title, 
  value, 
  icon, 
  color = 'blue', 
  trend, 
  className = '',
  ...props 
}) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-100',
      icon: 'text-blue-600',
      border: 'border-blue-500'
    },
    green: {
      bg: 'bg-green-100',
      icon: 'text-green-600',
      border: 'border-green-500'
    },
    red: {
      bg: 'bg-red-100',
      icon: 'text-red-600',
      border: 'border-red-500'
    },
    orange: {
      bg: 'bg-orange-100',
      icon: 'text-orange-600',
      border: 'border-orange-500'
    },
    purple: {
      bg: 'bg-purple-100',
      icon: 'text-purple-600',
      border: 'border-purple-500'
    }
  };

  const trendIcon = trend?.direction === 'up' ? (
    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ) : trend?.direction === 'down' ? (
    <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
    </svg>
  ) : (
    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
    </svg>
  );

  return (
    <div 
      className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${colorClasses[color].border} ${className}`}
      {...props}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${colorClasses[color].bg} rounded-xl flex items-center justify-center`}>
          {icon}
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <div className="text-3xl font-bold text-gray-900">
            {value}
          </div>
        </div>
      </div>
      {trend && (
        <div className="flex items-center text-sm text-gray-600">
          {trendIcon}
          <span className="ml-1">{trend.label}</span>
        </div>
      )}
    </div>
  );
};

// Stats Card Component
const StatsCard = ({ 
  title, 
  subtitle, 
  icon, 
  stats = [], 
  children,
  className = '',
  ...props 
}) => {
  return (
    <div 
      className={`bg-white rounded-xl shadow-md border border-gray-200 p-6 ${className}`}
      {...props}
    >
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
          {icon}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          {subtitle && <p className="text-gray-600">{subtitle}</p>}
        </div>
      </div>
      
      {stats.length > 0 && (
        <div className="space-y-4 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className={`p-4 rounded-lg bg-gradient-to-r ${stat.bgColor}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className={`w-8 h-8 ${stat.iconBg} rounded-lg flex items-center justify-center mr-3`}>
                    {stat.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{stat.title}</h3>
                    <p className="text-sm text-gray-600">{stat.subtitle}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${stat.textColor}`}>
                    {stat.value}
                  </div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${stat.progressColor}`}
                  style={{ width: `${stat.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {children}
    </div>
  );
};

export { Card, MetricCard, StatsCard };
export default Card;



