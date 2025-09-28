import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import apiService from '../services/api';

const EggProduction = () => {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    totalEggs: 0,
    averageProduction: 0,
    eggsSold: 0,
    eggsInStock: 0
  });
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Load data from backend
  useEffect(() => {
    fetchRecords();
    fetchSummary();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const data = await apiService.getEggProductionRecords();
      if (data.success) {
        setRecords(data.data);
        setFilteredRecords(data.data);
      }
    } catch (error) {
      console.error('Error fetching records:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      // Fetch both egg production and sales data
      const [eggData, salesData] = await Promise.all([
        apiService.getEggProductionSummary(),
        apiService.getSalesSummary()
      ]);
      
      if (eggData.success) {
        const totalEggs = eggData.data.totalEggs || 0;
        const totalDamagedEggs = eggData.data.totalDamagedEggs || 0;
        const effectiveEggs = totalEggs - totalDamagedEggs;
        
        // Calculate actual eggs sold from sales data
        let eggsSold = 0;
        if (salesData.success && salesData.data.topProducts) {
          eggsSold = salesData.data.topProducts.reduce((total, product) => {
            return total + (product.totalQuantity || 0);
          }, 0);
        }
        
        // Calculate eggs in stock (effective eggs minus sold eggs)
        const eggsInStock = Math.max(0, effectiveEggs - eggsSold);
        
        setSummary({
          totalEggs: totalEggs,
          averageProduction: eggData.data.averageProductionRate || 0,
          eggsSold: eggsSold,
          eggsInStock: eggsInStock
        });
      }
    } catch (error) {
      console.error('Error fetching summary:', error);
      // Fallback to basic calculation if sales data fails
      try {
        const data = await apiService.getEggProductionSummary();
        if (data.success) {
          setSummary({
            totalEggs: data.data.totalEggs || 0,
            averageProduction: data.data.averageProductionRate || 0,
            eggsSold: 0, // Show 0 instead of false assumption
            eggsInStock: (data.data.totalEggs || 0) - (data.data.totalDamagedEggs || 0)
          });
        }
      } catch (fallbackError) {
        console.error('Error with fallback summary:', fallbackError);
      }
    }
  };

  // Filter records by batch
  useEffect(() => {
    let filtered = records;
    if (selectedBatch !== 'all') {
      filtered = records.filter(record => record.batchNumber === selectedBatch);
    }
    
    // Apply sorting
    if (sortConfig.key) {
      filtered = [...filtered].sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        
        // Handle numeric fields
        if (['birds', 'eggsCollected', 'damagedEggs'].includes(sortConfig.key)) {
          aValue = Number(aValue) || 0;
          bValue = Number(bValue) || 0;
        }
        
        // Handle calculated usable eggs
        if (sortConfig.key === 'usableEggs') {
          aValue = (Number(a.eggsCollected) || 0) - (Number(a.damagedEggs) || 0);
          bValue = (Number(b.eggsCollected) || 0) - (Number(b.damagedEggs) || 0);
        }
        
        // Handle date fields
        if (sortConfig.key === 'date') {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }
        
        if (sortConfig.direction === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }
    
    setFilteredRecords(filtered);
  }, [records, selectedBatch, sortConfig]);

  // Get unique batch numbers for dropdown
  const uniqueBatches = [...new Set(records.map(record => record.batchNumber))];

  // Handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Handle batch filter change
  const handleBatchFilterChange = (e) => {
    setSelectedBatch(e.target.value);
  };

  // Generate next batch number
  const generateNextBatchNumber = () => {
    if (records.length === 0) {
      return 'Batch-001';
    }
    
    // Extract batch numbers and find the highest
    const batchNumbers = records
      .map(record => record.batchNumber)
      .filter(batch => batch && batch.startsWith('Batch-'))
      .map(batch => {
        const num = batch.split('-')[1];
        return parseInt(num, 10) || 0;
      });
    
    const maxBatch = Math.max(...batchNumbers, 0);
    const nextBatch = maxBatch + 1;
    return `Batch-${nextBatch.toString().padStart(3, '0')}`;
  };

  // Format date for input (YYYY-MM-DD format)
  const formatDateForInput = (date) => {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().split('T')[0];
  };

  // Format date for display (DD/MM/YYYY format)
  const formatDateForDisplay = (date) => {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('en-GB'); // DD/MM/YYYY format
  };

  // Get sort icon for column
  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    
    if (sortConfig.direction === 'asc') {
      return (
        <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      );
    } else {
      return (
        <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      );
    }
  };

  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsRecord, setDetailsRecord] = useState(null);
  const [editingRecord, setEditingRecord] = useState(null);
  const [formData, setFormData] = useState({
    date: '',
    batchNumber: '',
    birds: '',
    eggsCollected: '',
    damagedEggs: ''
  });
  const [guidance, setGuidance] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);

  const handleCreate = () => {
    setEditingRecord(null);
    const today = new Date();
    const nextBatch = generateNextBatchNumber();
    setFormData({ 
      date: formatDateForInput(today), 
      batchNumber: nextBatch, 
      birds: '', 
      eggsCollected: '', 
      damagedEggs: '' 
    });
    setShowModal(true);
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setFormData({
      ...record,
      date: formatDateForInput(record.date)
    });
    setShowModal(true);
  };

  const handleViewDetails = (record) => {
    setDetailsRecord(record);
    setShowDetailsModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        const data = await apiService.deleteEggProductionRecord(id);
        if (data.success) {
          await fetchRecords(); // Refresh data
          await fetchSummary(); // Refresh summary
        }
      } catch (error) {
        console.error('Error deleting record:', error);
        alert('Error deleting record: ' + error.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Format the data for submission
      const submissionData = {
        ...formData,
        date: formatDateForDisplay(formData.date) // Convert back to DD/MM/YYYY for backend
      };

      let data;
      if (editingRecord) {
        // Update existing record
        data = await apiService.updateEggProductionRecord(editingRecord._id, submissionData);
      } else {
        // Create new record
        data = await apiService.createEggProductionRecord(submissionData);
      }
      
      if (data.success) {
        await fetchRecords(); // Refresh data
        await fetchSummary(); // Refresh summary
        setShowModal(false);
        setFormData({
          date: '',
          batchNumber: '',
          birds: '',
          eggsCollected: '',
          damagedEggs: ''
        });
        setValidationErrors([]);
        setGuidance(null);
      } else {
        // Handle validation errors from backend
        if (data.errors) {
          setValidationErrors(data.errors);
        }
        if (data.guidance) {
          setGuidance({ suggestions: data.guidance });
        }
      }
    } catch (error) {
      console.error('Error saving record:', error);
      alert('Error saving record: ' + error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Fetch guidance when birds count changes
    if (name === 'birds' && value && !isNaN(value) && value > 0) {
      fetchGuidance(value);
    }
    
    // Clear validation errors when user starts typing
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  const fetchGuidance = async (birds) => {
    try {
      const response = await fetch(`http://localhost:5000/api/egg-production/guidance?birds=${birds}`);
      const data = await response.json();
      if (data.success) {
        setGuidance(data.data);
      }
    } catch (error) {
      console.error('Error fetching guidance:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-lg min-h-screen">
          <div className="p-6">
            <nav className="space-y-3">
              <Link to="/egg-production" className="w-full text-left px-4 py-3 bg-orange-100 text-orange-700 rounded-lg font-semibold hover:bg-orange-200 transition-colors shadow-sm block">
                Egg Production Management
              </Link>
              <Link to="/sales-order" className="w-full text-left px-4 py-3 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors shadow-sm block">
                Sales and Order Management
              </Link>
                          <Link to="/feed-inventory" className="w-full text-left px-4 py-3 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors shadow-sm block">
                            Feed & Inventory Management
                          </Link>
                          <Link to="/task-scheduling" className="w-full text-left px-4 py-3 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors shadow-sm block">
                            Task Scheduling
                          </Link>
                          <Link to="/financial-management" className="w-full text-left px-4 py-3 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors shadow-sm block">
                            Financial Management
                          </Link>
                          <Link to="/user-management" className="w-full text-left px-4 py-3 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors shadow-sm block">
                            User Management
                          </Link>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Page Title */}
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5zM8 15V9h4v6H8z" clipRule="evenodd" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">EGG PRODUCTION MANAGEMENT</h1>
            </div>
          </div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Total EGGS Produced</h3>
              <p className="text-3xl font-bold text-orange-500">
                {summary.totalEggs.toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Average Production Rate</h3>
              <p className="text-3xl font-bold text-orange-500">
                {summary.averageProduction}%
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Eggs SOLD</h3>
              <p className="text-3xl font-bold text-orange-500">
                {Math.round(summary.eggsSold).toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Eggs in Stock</h3>
              <p className="text-3xl font-bold text-orange-500">
                {Math.round(summary.eggsInStock).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Action Buttons and Filter */}
          <div className="flex gap-4 mb-8 items-center">
            <button 
              onClick={handleCreate}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              ADD NEW RECORD
            </button>
            
            {/* Batch Filter Dropdown */}
            <div className="flex items-center gap-2">
              <label htmlFor="batchFilter" className="text-sm font-medium text-gray-700">
                Filter by Batch:
              </label>
              <select
                id="batchFilter"
                value={selectedBatch}
                onChange={handleBatchFilterChange}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
              >
                <option value="all">All Batches</option>
                {uniqueBatches.map(batch => (
                  <option key={batch} value={batch}>
                    {batch}
                  </option>
                ))}
              </select>
            </div>
            
            {selectedBatch !== 'all' && (
              <span className="text-sm text-gray-600 bg-orange-100 px-3 py-1 rounded-full">
                Showing {filteredRecords.length} record(s) for batch {selectedBatch}
              </span>
            )}
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                      onClick={() => handleSort('date')}
                    >
                      <div className="flex items-center gap-1">
                        Date
                        {getSortIcon('date')}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                      onClick={() => handleSort('batchNumber')}
                    >
                      <div className="flex items-center gap-1">
                        Batch Number
                        {getSortIcon('batchNumber')}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                      onClick={() => handleSort('birds')}
                    >
                      <div className="flex items-center gap-1">
                        Number of Birds
                        {getSortIcon('birds')}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                      onClick={() => handleSort('usableEggs')}
                    >
                      <div className="flex items-center gap-1">
                        Usable Eggs
                        {getSortIcon('usableEggs')}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-orange-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                        Loading...
                      </td>
                    </tr>
                  ) : filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                        {records.length === 0 ? "No records found" : `No records found for batch ${selectedBatch}`}
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((record) => {
                      const usableEggs = (Number(record.eggsCollected) || 0) - (Number(record.damagedEggs) || 0);
                      return (
                        <tr key={record._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                              {record.batchNumber}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{record.birds}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-semibold text-green-600">{usableEggs}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => handleViewDetails(record)}
                                className="text-indigo-600 hover:text-indigo-900"
                                title="View Details"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </button>
                              <button 
                                onClick={() => handleEdit(record)}
                                className="text-blue-600 hover:text-blue-900"
                                title="Edit Record"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button 
                                onClick={() => handleDelete(record._id)}
                                className="text-red-600 hover:text-red-900"
                                title="Delete Record"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Modal for Create/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingRecord ? 'Edit Production Record' : 'Add New Production Record'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                {validationErrors.length > 0 && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                    <h4 className="text-sm font-medium text-red-800 mb-2">⚠️ Validation Errors</h4>
                    <ul className="text-sm text-red-700 space-y-1">
                      {validationErrors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                    {guidance && guidance.suggestions && (
                      <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                        <h5 className="text-sm font-medium text-yellow-800 mb-1">💡 Suggested Values</h5>
                        <div className="text-xs text-yellow-700">
                          <p><strong>Realistic Production Rate:</strong> {guidance.suggestions.realisticProductionRate}</p>
                          <p><strong>Suggested Eggs Collected:</strong> {guidance.suggestions.suggestedEggsCollected}</p>
                          <p><strong>Typical Damage Rate:</strong> {guidance.suggestions.typicalDamageRate}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Batch Number</label>
                  {editingRecord ? (
                    <input
                      type="text"
                      name="batchNumber"
                      value={formData.batchNumber}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                      required
                    />
                  ) : (
                    <div className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm bg-gray-50 text-gray-700">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{formData.batchNumber}</span>
                        <span className="text-xs text-gray-500 bg-green-100 px-2 py-1 rounded-full">
                          Auto-generated
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        New batches are automatically numbered in sequence
                      </p>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Number of Birds</label>
                  <input
                    type="number"
                    name="birds"
                    value={formData.birds}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                  {guidance && guidance.suggestions && (
                    <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <h4 className="text-sm font-medium text-blue-800 mb-2">💡 Realistic Production Guidance</h4>
                      <div className="text-xs text-blue-700 space-y-1">
                        <p><strong>Excellent (95%):</strong> {guidance.suggestions.realisticEggsCollected?.excellent || 'N/A'} eggs</p>
                        <p><strong>Good (85%):</strong> {guidance.suggestions.realisticEggsCollected?.good || 'N/A'} eggs</p>
                        <p><strong>Average (75%):</strong> {guidance.suggestions.realisticEggsCollected?.average || 'N/A'} eggs</p>
                        <p><strong>Poor (65%):</strong> {guidance.suggestions.realisticEggsCollected?.poor || 'N/A'} eggs</p>
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Eggs Collected</label>
                  <input
                    type="number"
                    name="eggsCollected"
                    value={formData.eggsCollected}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Damaged Eggs</label>
                  <input
                    type="number"
                    name="damagedEggs"
                    value={formData.damagedEggs}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-md"
                  >
                    {editingRecord ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && detailsRecord && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-6 border w-96 shadow-lg rounded-lg bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Production Details</h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Batch Info */}
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-medium text-orange-900 mb-2">Batch Information</h4>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Batch:</span>
                    <span className="font-medium text-orange-700">{detailsRecord.batchNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{detailsRecord.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Number of Birds:</span>
                    <span className="font-medium">{detailsRecord.birds}</span>
                  </div>
                </div>
              </div>

              {/* Eggs Data */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Egg Production Data</h4>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Eggs Collected:</span>
                    <span className="font-medium text-blue-600">{detailsRecord.eggsCollected}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Damaged Eggs:</span>
                    <span className="font-medium text-red-600">{detailsRecord.damagedEggs || 0}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-600 font-medium">Usable Eggs:</span>
                    <span className="font-bold text-green-600">
                      {(Number(detailsRecord.eggsCollected) || 0) - (Number(detailsRecord.damagedEggs) || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Production Rate:</span>
                    <span className="font-medium text-purple-600">
                      {detailsRecord.eggProductionRate || 0}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Performance Metrics</h4>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Eggs per Bird:</span>
                    <span className="font-medium">
                      {detailsRecord.birds > 0 ? ((detailsRecord.eggsCollected || 0) / detailsRecord.birds).toFixed(2) : '0.00'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Damage Rate:</span>
                    <span className="font-medium text-red-600">
                      {detailsRecord.eggsCollected > 0 ? (((detailsRecord.damagedEggs || 0) / detailsRecord.eggsCollected) * 100).toFixed(1) : '0.0'}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quality Rate:</span>
                    <span className="font-medium text-green-600">
                      {detailsRecord.eggsCollected > 0 ? (100 - (((detailsRecord.damagedEggs || 0) / detailsRecord.eggsCollected) * 100)).toFixed(1) : '100.0'}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {detailsRecord.notes && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
                  <p className="text-sm text-gray-700">{detailsRecord.notes}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    handleEdit(detailsRecord);
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-md"
                >
                  Edit Record
                </button>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600 mb-2">Copyright © 2024 Abeyrathne Enterprises All Rights Reserved.</p>
            <div className="text-sm text-gray-500 space-y-1">
              <p>No,222,Glahitiyawa,Kuliyapitiya</p>
              <p>Abeyrathne Enterprises</p>
              <p>Abeyrathne Enterprises@gmail.com</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EggProduction;
