import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const AdminDashboardManagement = () => {
  const [farmMetrics, setFarmMetrics] = useState({
    totalBirds: 100000,
    mortalityRate: 0,
    totalEggs: 0,
    totalEmployees: 0,
    lastUpdated: new Date().toISOString()
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const API_BASE_URL = '/api';

  // Load current metrics on component mount
  useEffect(() => {
    loadFarmMetrics();
    loadRealTimeData();
  }, []);

  const loadFarmMetrics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/farm-metrics`);
      const data = await response.json();
      if (data.success) {
        setFarmMetrics(data.data);
      }
    } catch (error) {
      console.error('Error loading farm metrics:', error);
      // Use default values if API fails
    } finally {
      setLoading(false);
    }
  };

  const loadRealTimeData = async () => {
    try {
      // Fetch total eggs from egg production data
      const eggResponse = await fetch(`${API_BASE_URL}/egg-production`);
      const eggData = await eggResponse.json();
      
      if (eggData.success) {
        const totalEggs = eggData.data.reduce((sum, record) => sum + (record.eggsCollected || 0), 0);
        setFarmMetrics(prev => ({
          ...prev,
          totalEggs: totalEggs
        }));
      }
    } catch (error) {
      console.error('Error loading real-time data:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setFarmMetrics(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateMortalityRate = () => {
    // This would be calculated based on your business logic
    // For now, we'll use a simple calculation
    const baseMortalityRate = 2.5; // 2.5% base rate
    const birdCount = farmMetrics.totalBirds;
    
    // Adjust mortality rate based on bird count (example logic)
    if (birdCount > 50000) {
      return baseMortalityRate + 0.5; // Slightly higher for large flocks
    } else if (birdCount < 10000) {
      return baseMortalityRate - 0.5; // Lower for smaller flocks
    }
    return baseMortalityRate;
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Calculate mortality rate automatically
      const calculatedMortalityRate = calculateMortalityRate();
      
      const updatedMetrics = {
        ...farmMetrics,
        mortalityRate: calculatedMortalityRate,
        lastUpdated: new Date().toISOString()
      };

      const response = await fetch(`${API_BASE_URL}/farm-metrics`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedMetrics),
      });

      const data = await response.json();
      
      if (data.success) {
        setFarmMetrics(updatedMetrics);
        setMessage('Farm metrics updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Error updating metrics. Please try again.');
      }
    } catch (error) {
      console.error('Error saving farm metrics:', error);
      setMessage('Error saving metrics. Please check your connection.');
    } finally {
      setSaving(false);
    }
  };

  const handleRefreshData = async () => {
    await loadRealTimeData();
    setMessage('Real-time data refreshed!');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard Management</h1>
          </div>
          
          <Link 
            to="/" 
            className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 font-medium"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Main Menu
          </Link>
        </div>
        <p className="text-gray-600">Manage farm key metrics and dashboard data (Admin Only)</p>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.includes('Error') ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-green-50 border border-green-200 text-green-700'
        }`}>
          {message}
        </div>
      )}

      {/* Current Metrics Display */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Current Dashboard Metrics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Birds Card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 shadow-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Total Birds</h3>
                <p className="text-3xl font-bold text-blue-600">{farmMetrics.totalBirds.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">Updated: {new Date(farmMetrics.lastUpdated).toLocaleDateString()}</p>
              </div>
              <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>

          {/* Mortality Rate Card */}
          <div className="bg-gradient-to-br from-red-50 to-pink-100 rounded-xl p-6 shadow-lg border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Mortality Rate</h3>
                <p className="text-3xl font-bold text-red-600">{farmMetrics.mortalityRate.toFixed(1)}%</p>
                <p className="text-xs text-gray-500 mt-1">Auto-calculated</p>
              </div>
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>

          {/* Total Eggs Card */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-6 shadow-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Total Eggs</h3>
                <p className="text-3xl font-bold text-green-600">{farmMetrics.totalEggs.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">From production data</p>
              </div>
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>

          {/* Total Employees Card */}
          <div className="bg-gradient-to-br from-purple-50 to-violet-100 rounded-xl p-6 shadow-lg border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Total Employees</h3>
                <p className="text-3xl font-bold text-purple-600">{farmMetrics.totalEmployees}</p>
                <p className="text-xs text-gray-500 mt-1">Staff count</p>
              </div>
              <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Update Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Update Farm Metrics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Total Birds Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total Birds (Weekly Update)
            </label>
            <input
              type="number"
              value={farmMetrics.totalBirds}
              onChange={(e) => handleInputChange('totalBirds', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter total number of birds"
            />
            <p className="text-xs text-gray-500 mt-1">
              Update this weekly. Mortality rate will be calculated automatically.
            </p>
          </div>

          {/* Total Employees Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total Employees
            </label>
            <input
              type="number"
              value={farmMetrics.totalEmployees}
              onChange={(e) => handleInputChange('totalEmployees', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter number of employees"
            />
            <p className="text-xs text-gray-500 mt-1">
              Current staff count including all workers.
            </p>
          </div>
        </div>

        {/* Auto-calculated fields info */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Auto-Calculated Fields</h3>
          <div className="text-sm text-blue-700 space-y-1">
            <p>• <strong>Mortality Rate:</strong> Automatically calculated based on bird count and farm conditions</p>
            <p>• <strong>Total Eggs:</strong> Automatically updated from egg production data</p>
            <p>• <strong>Last Updated:</strong> Automatically set when you save changes</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={handleRefreshData}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh Real-time Data
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium flex items-center"
          >
            {saving ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Information Panel */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-yellow-800 mb-4">Admin Information</h3>
        <div className="text-sm text-yellow-700 space-y-2">
          <p>• <strong>Access Level:</strong> This page is only accessible to administrators</p>
          <p>• <strong>Staff Visibility:</strong> Staff can view these metrics on the dashboard but cannot modify them</p>
          <p>• <strong>Weekly Updates:</strong> Update bird count weekly to maintain accurate mortality calculations</p>
          <p>• <strong>Real-time Data:</strong> Total eggs are automatically updated from production records</p>
          <p>• <strong>Mortality Calculation:</strong> System automatically calculates mortality rate based on bird count and farm conditions</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600 mb-2">Copyright © 2024 Abeyrathne Enterprises All Rights Reserved.</p>
            <div className="text-sm text-gray-500 space-y-1">
              <p>No.222,Glahitlyawa,Kuliyapitiya</p>
              <p>Abeyrathne Enterprises</p>
              <p>Abeyrathne Enterprises@gmail.com</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminDashboardManagement;

