import React from 'react';

// Metric Card Skeleton
const MetricCardSkeleton = ({ className = '' }) => (
  <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 border-gray-300 h-40 flex flex-col justify-between ${className}`}>
    <div className="flex items-center justify-between mb-4">
      <div className="w-12 h-12 bg-gray-200 rounded-xl animate-pulse"></div>
      <div className="text-right">
        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
        <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
  </div>
);

// Table Skeleton
const TableSkeleton = ({ rows = 5, columns = 4, className = '' }) => (
  <div className={`bg-white rounded-lg shadow-md border border-gray-200 ${className}`}>
    <div className="p-6 border-b border-gray-200">
      <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
    </div>
    <div className="p-6">
      <div className="space-y-4">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex space-x-4">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div 
                key={colIndex} 
                className={`h-4 bg-gray-200 rounded animate-pulse ${
                  colIndex === 0 ? 'w-32' : 
                  colIndex === 1 ? 'w-24' : 
                  colIndex === 2 ? 'w-20' : 'w-16'
                }`}
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Inline Loading
const InlineLoading = ({ text = 'Loading...', className = '' }) => (
  <div className={`flex items-center justify-center py-4 ${className}`}>
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <span className="text-gray-600">{text}</span>
  </div>
);

// Page Loading
const PageLoading = ({ className = '' }) => (
  <div className={`min-h-screen bg-gray-50 flex items-center justify-center ${className}`}>
    <div className="text-center">
      <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="animate-spin h-8 w-8 text-white" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading...</h2>
      <p className="text-gray-600">Please wait while we fetch your data</p>
    </div>
  </div>
);

// Card Loading
const CardLoading = ({ className = '' }) => (
  <div className={`bg-white rounded-lg shadow-md p-6 border border-gray-200 ${className}`}>
    <div className="animate-pulse">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-gray-200 rounded-xl mr-4"></div>
        <div>
          <div className="h-6 w-32 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  </div>
);

// Button Loading
const ButtonLoading = ({ className = '' }) => (
  <div className={`inline-flex items-center justify-center px-4 py-2 bg-gray-200 rounded-lg animate-pulse ${className}`}>
    <div className="w-4 h-4 bg-gray-300 rounded mr-2"></div>
    <div className="w-16 h-4 bg-gray-300 rounded"></div>
  </div>
);

export { 
  MetricCardSkeleton, 
  TableSkeleton, 
  InlineLoading, 
  PageLoading, 
  CardLoading, 
  ButtonLoading 
};
export default InlineLoading;

