import React from 'react';
import { components } from '../../styles/designSystem';

// Spinner Component
export const Spinner = ({ 
  size = 'md', 
  color = 'orange', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const colorClasses = {
    orange: 'border-orange-500',
    blue: 'border-blue-500',
    green: 'border-green-500',
    red: 'border-red-500',
    gray: 'border-gray-500',
  };

  return (
    <div 
      className={`
        ${components.loading.spinner}
        ${sizeClasses[size]}
        ${colorClasses[color]}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    />
  );
};

// Dots Loading Component
export const DotsLoading = ({ 
  size = 'md', 
  color = 'orange', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-1 h-1',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
  };

  const colorClasses = {
    orange: 'bg-orange-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    gray: 'bg-gray-500',
  };

  return (
    <div className={`${components.loading.dots} ${className}`}>
      <div className={`${components.loading.dot} ${sizeClasses[size]} ${colorClasses[color]}`}></div>
      <div className={`${components.loading.dot} ${sizeClasses[size]} ${colorClasses[color]}`} style={{ animationDelay: '0.1s' }}></div>
      <div className={`${components.loading.dot} ${sizeClasses[size]} ${colorClasses[color]}`} style={{ animationDelay: '0.2s' }}></div>
    </div>
  );
};

// Skeleton Loader Component
export const Skeleton = ({ 
  width = 'w-full', 
  height = 'h-4', 
  className = '' 
}) => {
  return (
    <div 
      className={`
        ${components.loading.skeleton}
        ${width}
        ${height}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    />
  );
};

// Card Skeleton Component
export const CardSkeleton = ({ className = '' }) => {
  return (
    <div className={`bg-white rounded-2xl shadow-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Skeleton width="w-12" height="h-12" className="rounded-xl mr-4" />
          <div>
            <Skeleton width="w-24" height="h-4" className="mb-2" />
            <Skeleton width="w-32" height="h-3" />
          </div>
        </div>
        <Skeleton width="w-16" height="h-8" />
      </div>
      <div className="space-y-3">
        <Skeleton width="w-full" height="h-3" />
        <Skeleton width="w-3/4" height="h-3" />
        <Skeleton width="w-1/2" height="h-3" />
      </div>
    </div>
  );
};

// Table Skeleton Component
export const TableSkeleton = ({ rows = 5, columns = 4, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {Array.from({ length: columns }).map((_, index) => (
                <th key={index} className="px-6 py-3 text-left">
                  <Skeleton width="w-20" height="h-4" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <td key={colIndex} className="px-6 py-4">
                    <Skeleton width="w-16" height="h-4" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Metric Card Skeleton Component
export const MetricCardSkeleton = ({ className = '' }) => {
  return (
    <div className={`bg-white rounded-2xl shadow-lg p-6 border-l-4 border-gray-300 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
        <div className="text-right">
          <Skeleton width="w-20" height="h-3" className="mb-1" />
          <Skeleton width="w-16" height="h-8" />
        </div>
      </div>
      <div className="flex items-center text-sm">
        <Skeleton width="w-4" height="h-4" className="mr-1 rounded-full" />
        <Skeleton width="w-20" height="h-3" />
      </div>
    </div>
  );
};

// Loading Overlay Component
export const LoadingOverlay = ({ 
  isLoading, 
  children, 
  message = 'Loading...',
  className = '' 
}) => {
  if (!isLoading) return children;

  return (
    <div className={`relative ${className}`}>
      {children}
      <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600 font-medium">{message}</p>
        </div>
      </div>
    </div>
  );
};

// Page Loading Component
export const PageLoading = ({ message = 'Loading page...' }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Spinner size="xl" className="mx-auto mb-4" />
        <p className="text-gray-600 font-medium text-lg">{message}</p>
      </div>
    </div>
  );
};

// Inline Loading Component
export const InlineLoading = ({ message = 'Loading...', size = 'sm' }) => {
  return (
    <div className="flex items-center justify-center py-4">
      <Spinner size={size} className="mr-2" />
      <span className="text-gray-600">{message}</span>
    </div>
  );
};

export default {
  Spinner,
  DotsLoading,
  Skeleton,
  CardSkeleton,
  TableSkeleton,
  MetricCardSkeleton,
  LoadingOverlay,
  PageLoading,
  InlineLoading,
};
