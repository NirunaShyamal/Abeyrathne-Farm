import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';

const ConnectionTest = () => {
  const { user } = useAuth();
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setTestResult(null);

    try {
      console.log('Testing connection...');
      const result = await apiService.healthCheck();
      setTestResult({ success: true, data: result });
    } catch (error) {
      console.error('Connection test failed:', error);
      setTestResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testCreateRecord = async () => {
    setLoading(true);
    setTestResult(null);

    try {
      console.log('Testing create record...');
      const testData = {
        date: new Date().toISOString().split('T')[0],
        batchNumber: `TEST-${Date.now()}`,
        birds: 100,
        eggsCollected: 85,
        damagedEggs: 2,
        notes: 'Connection test record'
      };
      
      const result = await apiService.createEggProductionRecord(testData);
      setTestResult({ success: true, data: result });
    } catch (error) {
      console.error('Create record test failed:', error);
      setTestResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  // Only show connection test for admin users
  if (user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md border-l-4 border-red-500">
      <div className="flex items-center mb-4">
        <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center mr-3">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Admin Connection Test</h3>
        <span className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Admin Only</span>
      </div>
      
      <div className="space-y-4">
        <div className="flex space-x-4">
          <button
            onClick={testConnection}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Test Health Check
          </button>
          
          <button
            onClick={testCreateRecord}
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Test Create Record
          </button>
        </div>

        {loading && (
          <div className="text-blue-600">Testing connection...</div>
        )}

        {testResult && (
          <div className={`p-4 rounded ${
            testResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            <h4 className="font-semibold">
              {testResult.success ? '✅ Success!' : '❌ Failed'}
            </h4>
            {testResult.success ? (
              <pre className="mt-2 text-sm overflow-auto">
                {JSON.stringify(testResult.data, null, 2)}
              </pre>
            ) : (
              <p className="mt-2">Error: {testResult.error}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectionTest;

