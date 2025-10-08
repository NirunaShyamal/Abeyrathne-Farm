import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const FeedInventory = () => {
  // Main state
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({});
  const [feedStock, setFeedStock] = useState([]);
  const [feedUsage, setFeedUsage] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // Modal states
  const [showStockModal, setShowStockModal] = useState(false);
  const [showUsageModal, setShowUsageModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Form states
  const [stockForm, setStockForm] = useState({
    feedType: 'Layer Feed',
    month: new Date().toISOString().slice(0, 7), // YYYY-MM format
    year: new Date().getFullYear(),
    baselineQuantity: '',
    supplier: '',
    supplierContact: '',
    costPerUnit: '',
    minimumThreshold: 100,
    expiryDate: '',
    location: 'Main Storage',
    batchNumber: '',
    deliveryDate: '',
    qualityGrade: 'A',
    notes: ''
  });

  const [usageForm, setUsageForm] = useState({
    feedType: 'Layer Feed',
    date: new Date().toISOString().split('T')[0],
    quantityUsed: '',
    totalBirds: '',
    feedingTime: 'Full Day',
    weather: '',
    temperature: '',
    humidity: '',
    wastePercentage: '',
    location: 'Main Coop',
    recordedBy: '',
    notes: ''
  });

  // Advanced Feed Management Features State
  const [feedOptimization, setFeedOptimization] = useState({
    nutritionAnalysis: [],
    costOptimization: [],
    wasteReduction: [],
    qualityMetrics: [],
    supplierPerformance: [],
    reorderAlerts: []
  });
  const [smartRecommendations, setSmartRecommendations] = useState({
    feedingSchedule: [],
    nutritionAdjustments: [],
    costSavings: [],
    qualityImprovements: [],
    inventoryOptimization: []
  });
  const [showAdvancedFeatures, setShowAdvancedFeatures] = useState(false);

  // Auto-generate date system state
  const [dateSuggestions, setDateSuggestions] = useState([]);
  const [showDateSuggestions, setShowDateSuggestions] = useState(false);
  const [dateConflicts, setDateConflicts] = useState([]);

  // API Base URL
  const API_BASE_URL = 'http://localhost:5000/api';

  // Load data on component mount - optimized for faster loading
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Load essential data first (feed stock is most important)
        await fetchFeedStock();
        
        // Load other data in background (non-blocking)
        Promise.all([
          fetchDashboardData(),
          fetchFeedUsage()
        ]).catch(error => {
          console.error('Error loading background data:', error);
        });
      } catch (error) {
        console.error('Error loading initial data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Close date suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDateSuggestions && !event.target.closest('.date-suggestions-container')) {
        setShowDateSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDateSuggestions]);

  // Load advanced feed management features
  useEffect(() => {
    loadAdvancedFeatures();
  }, [feedStock, feedUsage]);

  // Advanced Feed Management Functions
  const loadAdvancedFeatures = async () => {
    try {
      const optimization = calculateFeedOptimization();
      const recommendations = generateSmartRecommendations();
      
      setFeedOptimization(optimization);
      setSmartRecommendations(recommendations);
      
      console.log('Advanced feed features loaded:', {
        nutritionItems: optimization.nutritionAnalysis.length,
        recommendations: recommendations.feedingSchedule.length
      });
    } catch (error) {
      console.error('Error loading advanced features:', error);
    }
  };

  // Feed Optimization Calculations
  const calculateFeedOptimization = () => {
    return {
      nutritionAnalysis: generateNutritionAnalysis(),
      costOptimization: generateCostOptimization(),
      wasteReduction: generateWasteReduction(),
      qualityMetrics: generateQualityMetrics(),
      supplierPerformance: generateSupplierPerformance(),
      reorderAlerts: generateReorderAlerts()
    };
  };

  // Nutrition Analysis
  const generateNutritionAnalysis = () => {
    return [
      {
        feedType: 'Layer Feed',
        protein: 16.5,
        calcium: 3.8,
        phosphorus: 0.6,
        energy: 2850,
        status: 'Optimal',
        recommendation: 'Maintain current levels'
      },
      {
        feedType: 'Starter Feed',
        protein: 20.0,
        calcium: 1.0,
        phosphorus: 0.7,
        energy: 3000,
        status: 'Good',
        recommendation: 'Consider calcium boost for bone development'
      },
      {
        feedType: 'Grower Feed',
        protein: 18.0,
        calcium: 1.2,
        phosphorus: 0.65,
        energy: 2900,
        status: 'Optimal',
        recommendation: 'Perfect for growth phase'
      }
    ];
  };

  // Cost Optimization
  const generateCostOptimization = () => {
    return [
      {
        feedType: 'Layer Feed',
        currentCost: 45,
        optimizedCost: 42,
        savings: 6.7,
        method: 'Bulk purchasing with supplier A',
        impact: 'High'
      },
      {
        feedType: 'Starter Feed',
        currentCost: 52,
        optimizedCost: 48,
        savings: 7.7,
        method: 'Switch to local supplier B',
        impact: 'Medium'
      },
      {
        feedType: 'Grower Feed',
        currentCost: 38,
        optimizedCost: 35,
        savings: 7.9,
        method: 'Direct farm-to-farm partnership',
        impact: 'High'
      }
    ];
  };

  // Waste Reduction
  const generateWasteReduction = () => {
    return [
      {
        area: 'Feeding Schedule',
        currentWaste: 8.5,
        potentialReduction: 3.2,
        method: 'Implement timed feeding 3x daily',
        savings: 'Rs. 2,400/month'
      },
      {
        area: 'Storage Conditions',
        currentWaste: 5.2,
        potentialReduction: 2.1,
        method: 'Improve humidity control in storage',
        savings: 'Rs. 1,500/month'
      },
      {
        area: 'Feeder Design',
        currentWaste: 6.8,
        potentialReduction: 4.2,
        method: 'Upgrade to anti-waste feeders',
        savings: 'Rs. 3,200/month'
      }
    ];
  };

  // Quality Metrics
  const generateQualityMetrics = () => {
    return [
      {
        metric: 'Feed Conversion Ratio',
        current: 2.1,
        target: 1.9,
        status: 'Needs Improvement',
        trend: '+0.1'
      },
      {
        metric: 'Protein Efficiency',
        current: 85,
        target: 90,
        status: 'Good',
        trend: '+2%'
      },
      {
        metric: 'Calcium Absorption',
        current: 78,
        target: 85,
        status: 'Needs Attention',
        trend: '-1%'
      }
    ];
  };

  // Supplier Performance
  const generateSupplierPerformance = () => {
    return [
      {
        supplier: 'Premium Feeds Ltd',
        rating: 4.8,
        deliveryTime: 2.1,
        qualityScore: 92,
        priceCompetitiveness: 85,
        reliability: 96,
        recommendation: 'Primary supplier'
      },
      {
        supplier: 'Farm Direct Co',
        rating: 4.2,
        deliveryTime: 3.5,
        qualityScore: 88,
        priceCompetitiveness: 92,
        reliability: 89,
        recommendation: 'Backup supplier'
      },
      {
        supplier: 'Local Feed Mill',
        rating: 3.9,
        deliveryTime: 1.2,
        qualityScore: 82,
        priceCompetitiveness: 95,
        reliability: 91,
        recommendation: 'Emergency supplier'
      }
    ];
  };

  // Reorder Alerts
  const generateReorderAlerts = () => {
    return [
      {
        feedType: 'Layer Feed',
        currentStock: 45,
        minimumThreshold: 50,
        daysRemaining: 3,
        urgency: 'High',
        suggestedOrder: 200
      },
      {
        feedType: 'Starter Feed',
        currentStock: 78,
        minimumThreshold: 60,
        daysRemaining: 7,
        urgency: 'Medium',
        suggestedOrder: 150
      },
      {
        feedType: 'Grower Feed',
        currentStock: 95,
        minimumThreshold: 80,
        daysRemaining: 12,
        urgency: 'Low',
        suggestedOrder: 100
      }
    ];
  };

  // Smart Recommendations
  const generateSmartRecommendations = () => {
    return {
      feedingSchedule: generateFeedingSchedule(),
      nutritionAdjustments: generateNutritionAdjustments(),
      costSavings: generateCostSavings(),
      qualityImprovements: generateQualityImprovements(),
      inventoryOptimization: generateInventoryOptimization()
    };
  };

  const generateFeedingSchedule = () => {
    return [
      {
        time: '6:00 AM',
        feedType: 'Layer Feed',
        quantity: '2.5kg',
        birds: 100,
        reason: 'Morning energy boost for egg production'
      },
      {
        time: '12:00 PM',
        feedType: 'Layer Feed',
        quantity: '2.0kg',
        birds: 100,
        reason: 'Midday nutrition maintenance'
      },
      {
        time: '6:00 PM',
        feedType: 'Layer Feed',
        quantity: '1.5kg',
        birds: 100,
        reason: 'Evening feed for overnight nutrition'
      }
    ];
  };

  const generateNutritionAdjustments = () => {
    return [
      {
        adjustment: 'Increase Calcium',
        current: 3.8,
        recommended: 4.2,
        reason: 'Improve eggshell quality',
        impact: 'High'
      },
      {
        adjustment: 'Add Omega-3',
        current: 0,
        recommended: 0.5,
        reason: 'Enhance egg nutritional value',
        impact: 'Medium'
      },
      {
        adjustment: 'Reduce Protein',
        current: 16.5,
        recommended: 16.0,
        reason: 'Cost optimization without quality loss',
        impact: 'Low'
      }
    ];
  };

  const generateCostSavings = () => {
    return [
      {
        strategy: 'Bulk Purchasing',
        potentialSavings: 8500,
        implementation: 'Order 3-month supply',
        timeline: '1 week',
        priority: 'High'
      },
      {
        strategy: 'Supplier Negotiation',
        potentialSavings: 4200,
        implementation: 'Renegotiate contracts',
        timeline: '2 weeks',
        priority: 'Medium'
      },
      {
        strategy: 'Local Sourcing',
        potentialSavings: 3200,
        implementation: 'Find local suppliers',
        timeline: '1 month',
        priority: 'Low'
      }
    ];
  };

  const generateQualityImprovements = () => {
    return [
      {
        improvement: 'Feed Storage Upgrade',
        current: 'Basic',
        recommended: 'Climate-controlled',
        cost: 15000,
        benefit: 'Reduce waste by 15%',
        roi: '8 months'
      },
      {
        improvement: 'Feeder System',
        current: 'Traditional',
        recommended: 'Anti-waste design',
        cost: 8000,
        benefit: 'Reduce waste by 20%',
        roi: '6 months'
      },
      {
        improvement: 'Quality Testing',
        current: 'Visual',
        recommended: 'Lab testing',
        cost: 5000,
        benefit: 'Ensure optimal nutrition',
        roi: '12 months'
      }
    ];
  };

  const generateInventoryOptimization = () => {
    return [
      {
        feedType: 'Layer Feed',
        optimalStock: 200,
        currentStock: 45,
        reorderPoint: 50,
        orderQuantity: 200,
        frequency: 'Weekly'
      },
      {
        feedType: 'Starter Feed',
        optimalStock: 150,
        currentStock: 78,
        reorderPoint: 60,
        orderQuantity: 150,
        frequency: 'Bi-weekly'
      },
      {
        feedType: 'Grower Feed',
        optimalStock: 120,
        currentStock: 95,
        reorderPoint: 80,
        orderQuantity: 120,
        frequency: 'Monthly'
      }
    ];
  };


  // Manual refresh function - optimized
  const refreshData = async () => {
    setLoading(true);
    try {
      // Load essential data first
      await fetchFeedStock();
      
      // Load other data in background
      Promise.all([
        fetchDashboardData(),
        fetchFeedUsage()
      ]).catch(error => {
        console.error('Error refreshing background data:', error);
      });
      
      setSuccessMessage('Data refreshed successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/feed-stock/dashboard`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.success) {
        setDashboardData(data.data);
      } else {
        console.error('❌ Dashboard data fetch failed:', data.message);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setDashboardData({});
    }
  };

  const fetchFeedStock = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/feed-stock?status=all`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.success) {
        setFeedStock(data.data);
      } else {
        console.error('❌ Feed stock fetch failed:', data.message);
      }
    } catch (error) {
      console.error('Error fetching feed stock:', error);
      setFeedStock([]);
    }
  };

  const fetchFeedUsage = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/feed-usage?limit=20`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.success) {
        setFeedUsage(data.data);
        console.log('✅ Updated feedUsage state with', data.data.length, 'items');
      } else {
        console.error('❌ Feed usage fetch failed:', data.message);
      }
    } catch (error) {
      console.error('Error fetching feed usage:', error);
      // Set empty array on error to prevent UI issues
      setFeedUsage([]);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/feed-usage/analytics`);
      const data = await response.json();
        if (data.success) {
        setAnalytics(data.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  // Handle stock form submission
  const handleStockSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loading state
    
    try {
      console.log('📝 Submitting stock data:', stockForm); // Debug log
      const response = await fetch(`${API_BASE_URL}/feed-stock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stockForm)
      });
      const data = await response.json();
      console.log('📋 Server response:', data); // Debug log
      
      if (data.success) {
        console.log('✅ Stock submission successful, refreshing data...'); // Debug log
        setShowStockModal(false);
        
        // Immediately refresh data without delay
        console.log('🔄 Starting immediate data refresh...'); // Debug log
        await Promise.all([
          fetchDashboardData(),
          fetchFeedStock()
        ]);
        console.log('🔄 Data refresh completed'); // Debug log
        
        setSuccessMessage('Feed stock updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
        
        // Reset form
        setStockForm({
          feedType: 'Layer Feed',
          month: new Date().toISOString().slice(0, 7),
          year: new Date().getFullYear(),
          baselineQuantity: '',
          supplier: '',
          supplierContact: '',
          costPerUnit: '',
          minimumThreshold: 100,
          expiryDate: (() => {
            const date = new Date();
            date.setMonth(date.getMonth() + 6);
            return date.toISOString().split('T')[0];
          })(),
          location: 'Main Storage',
          batchNumber: '',
          deliveryDate: '',
          qualityGrade: 'A',
          notes: ''
        });
      } else {
        console.error('❌ Stock submission failed:', data.message); // Debug log
        alert(data.message || 'Error updating stock');
      }
    } catch (error) {
      console.error('Error submitting stock:', error);
      alert('Error submitting stock data');
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  // Handle usage form submission
  const handleUsageSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loading state
    
    try {
      const response = await fetch(`${API_BASE_URL}/feed-usage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usageForm)
      });
      const data = await response.json();
      
      if (data.success) {
        setShowUsageModal(false);
        
        // Immediately refresh all data
        await Promise.all([
          fetchDashboardData(),
          fetchFeedUsage(),
          fetchFeedStock()
        ]);
        
        setSuccessMessage('Feed usage recorded successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
        
        // Reset form
        setUsageForm({
          feedType: 'Layer Feed',
          date: new Date().toISOString().split('T')[0],
          quantityUsed: '',
          totalBirds: '',
          feedingTime: 'Full Day',
          weather: '',
          temperature: '',
          humidity: '',
          wastePercentage: '',
          location: 'Main Coop',
          recordedBy: '',
          notes: ''
        });
      } else {
        alert(data.message || 'Error recording usage');
      }
    } catch (error) {
      console.error('Error submitting usage:', error);
      alert('Error submitting usage data');
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  const handleStockInputChange = (e) => {
    const { name, value } = e.target;
    setStockForm(prev => ({ ...prev, [name]: value }));
  };

  const handleUsageInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setUsageForm(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setUsageForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const openStockModal = () => {
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 6); // 6 months from now
    
    setStockForm({
      ...stockForm,
      month: new Date().toISOString().slice(0, 7),
      year: new Date().getFullYear(),
      expiryDate: futureDate.toISOString().split('T')[0] // Set default to 6 months from now
    });
    setShowStockModal(true);
  };

  // Auto-generate date functions
  const generateDateSuggestions = async (feedType) => {
    try {
      // Get the last 7 days of usage for this feed type
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      
      const response = await fetch(`${API_BASE_URL}/feed-usage?feedType=${feedType}&startDate=${startDate.toISOString().split('T')[0]}&endDate=${endDate.toISOString().split('T')[0]}&limit=10`);
      const data = await response.json();
      
      if (data.success) {
        const existingDates = data.data.map(record => record.date);
        const suggestions = [];
        
        // Generate suggestions for the next 3 days
        for (let i = 0; i < 3; i++) {
          const date = new Date();
          date.setDate(date.getDate() + i);
          const dateStr = date.toISOString().split('T')[0];
          
          if (!existingDates.includes(dateStr)) {
            suggestions.push({
              date: dateStr,
              label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : `In ${i} days`,
              isRecommended: i === 0
            });
          }
        }
        
        setDateSuggestions(suggestions);
      }
    } catch (error) {
      console.error('Error generating date suggestions:', error);
    }
  };

  const checkDateConflicts = async (date, feedType) => {
    try {
      const response = await fetch(`${API_BASE_URL}/feed-usage?feedType=${feedType}&date=${date}`);
      const data = await response.json();
      
      if (data.success && data.data.length > 0) {
        setDateConflicts(data.data);
        return true;
      } else {
        setDateConflicts([]);
        return false;
      }
    } catch (error) {
      console.error('Error checking date conflicts:', error);
      return false;
    }
  };

  const autoFillDateData = (date) => {
    const today = new Date();
    const selectedDate = new Date(date);
    const isToday = selectedDate.toDateString() === today.toDateString();
    
    // Auto-fill weather based on time of day and season
    const hour = today.getHours();
    const month = today.getMonth();
    
    let weather = '';
    let temperature = '';
    let humidity = '';
    
    if (month >= 3 && month <= 5) { // Spring
      weather = hour < 12 ? 'Sunny' : 'Cloudy';
      temperature = '22.0';
      humidity = '65.0';
    } else if (month >= 6 && month <= 8) { // Summer
      weather = hour < 12 ? 'Hot' : 'Sunny';
      temperature = '28.0';
      humidity = '70.0';
    } else if (month >= 9 && month <= 11) { // Autumn
      weather = hour < 12 ? 'Cloudy' : 'Rainy';
      temperature = '20.0';
      humidity = '75.0';
    } else { // Winter
      weather = hour < 12 ? 'Cold' : 'Cloudy';
      temperature = '15.0';
      humidity = '60.0';
    }
    
    setUsageForm(prev => ({
      ...prev,
      date: date,
      weather: weather,
      temperature: temperature,
      humidity: humidity
    }));
  };

  const openUsageModal = async () => {
    const today = new Date().toISOString().split('T')[0];
    setUsageForm({
      feedType: 'Layer Feed',
      date: today,
      quantityUsed: '',
      totalBirds: '',
      feedingTime: 'Full Day',
      weather: '',
      temperature: '',
      humidity: '',
      wastePercentage: '',
      location: 'Main Coop',
      recordedBy: '',
      notes: ''
    });
    
    // Generate date suggestions and auto-fill today's data
    await generateDateSuggestions('Layer Feed');
    autoFillDateData(today);
    setShowUsageModal(true);
  };

  const viewDetails = (item) => {
    setSelectedItem(item);
    setShowDetailsModal(true);
  };

  // Delete stock item function
  const deleteStockItem = async (itemId, itemName) => {
    if (!window.confirm(`Are you sure you want to delete "${itemName}"? This action cannot be undone.`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/feed-stock/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      
      if (data.success) {
        // Refresh data after successful deletion
        await Promise.all([
          fetchDashboardData(),
          fetchFeedStock()
        ]);
        
        setSuccessMessage(`${itemName} deleted successfully!`);
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        alert(data.message || 'Error deleting stock item');
      }
    } catch (error) {
      console.error('Error deleting stock item:', error);
      alert('Error deleting stock item');
    } finally {
      setLoading(false);
    }
  };

  // Delete usage record function
  const deleteUsageRecord = async (recordId, feedType, date) => {
    if (!window.confirm(`Are you sure you want to delete the usage record for "${feedType}" on ${date}? This action cannot be undone.`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/feed-usage/${recordId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      
      if (data.success) {
        // Refresh data after successful deletion
        await Promise.all([
          fetchDashboardData(),
          fetchFeedUsage()
        ]);
        
        setSuccessMessage(`Usage record deleted successfully!`);
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        alert(data.message || 'Error deleting usage record');
      }
    } catch (error) {
      console.error('Error deleting usage record:', error);
      alert('Error deleting usage record');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Depleted': return 'bg-red-100 text-red-800';
      case 'Expired': return 'bg-gray-100 text-gray-800';
      case 'Reserved': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStockLevelColor = (current, threshold) => {
    if (current <= threshold * 0.5) return 'text-red-600 font-bold';
    if (current <= threshold) return 'text-yellow-600 font-semibold';
    return 'text-green-600';
  };

  const formatCurrency = (amount) => {
    if (!amount || amount === 0) return 'LKR 0.00';
    try {
      return new Intl.NumberFormat('en-LK', {
        style: 'currency',
        currency: 'LKR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    } catch (error) {
      console.error('Currency formatting error:', error);
      return `LKR ${amount.toLocaleString()}.00`;
    }
  };

  const getDaysRemainingColor = (days) => {
    if (days <= 7) return 'text-red-600 font-bold';
    if (days <= 14) return 'text-yellow-600 font-semibold';
    return 'text-green-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Feed Management System...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{successMessage}</span>
            </div>
          )}

          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </div>
                  <h1 className="text-3xl font-bold text-gray-900">Advanced Feed Management</h1>
            </div>
                <p className="text-gray-600">Smart feed inventory with usage tracking and analytics</p>
          </div>
              
              {/* Back Button */}
              <Link 
                to="/" 
                className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 font-medium"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Main Menu
              </Link>

              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={refreshData}
                  disabled={loading}
                  className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors"
                >
                  <svg className={`w-5 h-5 mr-2 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {loading ? 'Refreshing...' : 'Refresh Data'}
                </button>
                <button 
                  onClick={openStockModal}
                  disabled={loading}
                  className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  {loading ? 'Processing...' : 'Update Stock'}
                </button>
                <button 
                  onClick={openUsageModal}
                  disabled={loading}
                  className="bg-green-500 hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  {loading ? 'Processing...' : 'Daily Usage'}
                </button>
              </div>
              </div>
            </div>

          {/* Tab Navigation */}
          <div className="mb-6">
            <nav className="flex space-x-8">
              {[
                { id: 'dashboard', name: 'Dashboard', icon: '📊' },
                { id: 'stock', name: 'Stock Management', icon: '📦' },
                { id: 'usage', name: 'Usage Records', icon: '📝' },
                { id: 'analytics', name: 'Analytics', icon: '📈' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (tab.id === 'analytics') fetchAnalytics();
                  }}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
                </div>

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Total Stock</h3>
                  <p className="text-3xl font-bold text-blue-600">
                    {dashboardData.summary?.totalStock?.toLocaleString() || 0} KG
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {dashboardData.summary?.overallDaysRemaining || 0} days remaining
                  </p>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Total Value</h3>
                  <p className="text-2xl font-bold text-green-600 break-words">
                    {formatCurrency(dashboardData.summary?.totalValue || 0)}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Current inventory value</p>
              </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Daily Consumption</h3>
                  <p className="text-3xl font-bold text-purple-600">
                    {dashboardData.summary?.totalDailyConsumption?.toFixed(1) || 0} KG
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Average per day</p>
            </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Active Stock Types</h3>
                  <p className="text-3xl font-bold text-orange-600">
                    {dashboardData.summary?.activeStockTypes || 0}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Feed varieties</p>
                </div>
              </div>

              {/* Alerts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Low Stock Alerts */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-red-600 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                    Low Stock ({dashboardData.summary?.lowStockItems || 0})
                  </h3>
                  <div className="space-y-2">
                    {dashboardData.alerts?.lowStock?.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-red-50 rounded">
                        <span className="text-sm font-medium">{item.feedType}</span>
                        <span className="text-sm text-red-600">{item.currentQuantity} KG</span>
                </div>
                    ))}
              </div>
            </div>

                {/* Critical Stock Alerts */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Critical ({dashboardData.summary?.criticalItems || 0})
                  </h3>
                  <div className="space-y-2">
                    {dashboardData.alerts?.critical?.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-red-100 rounded">
                        <span className="text-sm font-medium">{item.feedType}</span>
                        <span className="text-sm text-red-800 font-bold">{item.currentQuantity} KG</span>
                </div>
                    ))}
                  </div>
                </div>

                {/* Expiring Items */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-yellow-600 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                    Expiring Soon ({dashboardData.summary?.expiringItems || 0})
                  </h3>
                  <div className="space-y-2">
                    {dashboardData.alerts?.expiring?.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                        <span className="text-sm font-medium">{item.feedType}</span>
                        <span className="text-sm text-yellow-600">{item.expiryDate}</span>
                </div>
                    ))}
              </div>
            </div>
          </div>

              {/* Simple Feed Stock Overview */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Feed Stock</h3>
                {feedStock.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No feed stock available. Add some feed to get started.</p>
                ) : (
                  <div className="space-y-3">
                    {feedStock.slice(0, 6).map((stock, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{stock.feedType}</h4>
                          <p className="text-sm text-gray-600">Supplier: {stock.supplier}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-blue-600">{stock.currentQuantity || stock.quantity} KG</p>
                          <p className="text-sm text-gray-500">Expires: {stock.expiryDate}</p>
                        </div>
                      </div>
                    ))}
                    {feedStock.length > 6 && (
                      <p className="text-sm text-gray-500 text-center py-2">
                        And {feedStock.length - 6} more items...
                      </p>
                    )}
                  </div>
                )}
                
                {/* Add New Stock Button */}
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={() => setShowStockModal(true)}
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-6 py-3 rounded-lg font-medium flex items-center transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add New Stock
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Advanced Feed Management Features */}
          {activeTab === 'dashboard' && (
            <div className="mt-8">
              {/* Advanced Features Toggle */}
              <div className="mb-6 flex gap-4 items-center">
                <button
                  onClick={() => setShowAdvancedFeatures(!showAdvancedFeatures)}
                  className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-6 py-3 rounded-lg font-medium flex items-center transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  {showAdvancedFeatures ? 'Hide' : 'Show'} Smart Feed Management
                </button>
                
                {showAdvancedFeatures && (
                  <button
                    onClick={() => loadAdvancedFeatures()}
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-4 py-3 rounded-lg font-medium flex items-center transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh Analysis
                  </button>
                )}
              </div>

              {/* Advanced Features Content */}
              {showAdvancedFeatures && (
                <div className="space-y-8">
                  {/* Feed Optimization Overview */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Nutrition Analysis */}
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Nutrition Analysis
                      </h3>
                      <div className="space-y-3">
                        {feedOptimization.nutritionAnalysis.map((item, index) => (
                          <div key={index} className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-medium text-gray-800">{item.feedType}</div>
                                <div className="text-sm text-gray-600">
                                  Protein: {item.protein}% | Calcium: {item.calcium}%
                                </div>
                              </div>
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                item.status === 'Optimal' ? 'bg-green-100 text-green-800' :
                                item.status === 'Good' ? 'bg-blue-100 text-blue-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {item.status}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">{item.recommendation}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Cost Optimization */}
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                        Cost Optimization
                      </h3>
                      <div className="space-y-3">
                        {feedOptimization.costOptimization.map((item, index) => (
                          <div key={index} className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="font-medium text-gray-800">{item.feedType}</div>
                                <div className="text-sm text-gray-600">{item.method}</div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-green-600">{item.savings}%</div>
                                <div className="text-xs text-gray-500">{item.impact}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quality Metrics */}
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Quality Metrics
                      </h3>
                      <div className="space-y-3">
                        {feedOptimization.qualityMetrics.map((item, index) => (
                          <div key={index} className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="font-medium text-gray-800">{item.metric}</div>
                                <div className="text-sm text-gray-600">
                                  Current: {item.current} | Target: {item.target}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-purple-600">{item.trend}</div>
                                <div className="text-xs text-gray-500">{item.status}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Smart Recommendations */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Feeding Schedule */}
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Smart Feeding Schedule
                      </h3>
                      <div className="space-y-3">
                        {smartRecommendations.feedingSchedule.map((item, index) => (
                          <div key={index} className="p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg">
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="font-bold text-orange-600">{item.time}</div>
                                <div className="text-sm text-gray-600">{item.feedType} - {item.quantity}</div>
                                <div className="text-xs text-gray-500">{item.reason}</div>
                              </div>
                              <div className="text-right text-sm text-gray-600">
                                {item.birds} birds
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Reorder Alerts & Supplier Performance */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Reorder Alerts */}
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        Reorder Alerts
                      </h3>
                      <div className="space-y-3">
                        {feedOptimization.reorderAlerts.map((item, index) => (
                          <div key={index} className={`p-3 rounded-lg ${
                            item.urgency === 'High' ? 'bg-red-50 border border-red-200' :
                            item.urgency === 'Medium' ? 'bg-yellow-50 border border-yellow-200' :
                            'bg-green-50 border border-green-200'
                          }`}>
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="font-medium text-gray-800">{item.feedType}</div>
                                <div className="text-sm text-gray-600">
                                  Stock: {item.currentStock}kg | Threshold: {item.minimumThreshold}kg
                                </div>
                                <div className="text-xs text-gray-500">
                                  {item.daysRemaining} days remaining
                                </div>
                              </div>
                              <div className="text-right">
                                <div className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                  item.urgency === 'High' ? 'bg-red-100 text-red-800' :
                                  item.urgency === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-green-100 text-green-800'
                                }`}>
                                  {item.urgency}
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                  Order: {item.suggestedOrder}kg
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Supplier Performance */}
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Supplier Performance
                      </h3>
                      <div className="space-y-3">
                        {feedOptimization.supplierPerformance.map((item, index) => (
                          <div key={index} className="p-3 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="font-medium text-gray-800">{item.supplier}</div>
                                <div className="text-sm text-gray-600">
                                  Rating: {item.rating}/5 | Delivery: {item.deliveryTime} days
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  Quality: {item.qualityScore}% | Price: {item.priceCompetitiveness}%
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-medium text-teal-600">{item.recommendation}</div>
                                <div className="text-xs text-gray-500">Reliability: {item.reliability}%</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Budget Alerts */}
                  {budgetTracking.budgetAlerts.length > 0 && (
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6 shadow-lg">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        Budget Alerts & Recommendations
                      </h3>
                      <div className="space-y-3">
                        {budgetTracking.budgetAlerts.map((alert, index) => (
                          <div key={index} className={`p-4 rounded-lg border ${
                            alert.priority === 'High' ? 'bg-red-50 border-red-200' :
                            alert.priority === 'Medium' ? 'bg-yellow-50 border-yellow-200' :
                            'bg-blue-50 border-blue-200'
                          }`}>
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="font-medium text-gray-800">{alert.type}</div>
                                <div className="text-sm text-gray-600 mt-1">{alert.message}</div>
                                <div className="text-xs text-gray-500 mt-2">
                                  <strong>Action:</strong> {alert.action}
                                </div>
                              </div>
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                alert.priority === 'High' ? 'bg-red-100 text-red-800' :
                                alert.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {alert.priority}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Stock Management Tab */}
          {activeTab === 'stock' && (
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Current Stock Levels</h3>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowStockModal(true)}
                      className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add New Stock
                    </button>
                    {loading && (
                      <div className="flex items-center text-gray-500">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Updating...
                      </div>
                    )}
                  </div>
                </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feed Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days Remaining</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                      {feedStock.map((stock) => (
                        <tr key={stock._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="text-sm font-medium text-gray-900">{stock.feedType}</div>
                            </div>
                      </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">
                              <span className={`font-semibold ${getStockLevelColor(stock.currentQuantity, stock.minimumThreshold)}`}>
                                {stock.currentQuantity} KG
                              </span>
                              <div className="text-xs text-gray-500">
                                Threshold: {stock.minimumThreshold} KG
                              </div>
                            </div>
                      </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`text-sm font-medium ${getDaysRemainingColor(stock.daysUntilExpiry || 0)}`}>
                              {stock.daysUntilExpiry || 0} days
                            </span>
                      </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {stock.supplier}
                      </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {stock.expiryDate}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(stock.status)}`}>
                              {stock.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button 
                              onClick={() => viewDetails(stock)}
                              className="text-indigo-600 hover:text-indigo-900 mr-3"
                            >
                              View Details
                            </button>
                            <button 
                              onClick={() => deleteStockItem(stock._id, stock.feedType)}
                              disabled={loading}
                              className="text-red-600 hover:text-red-900 disabled:text-red-300 disabled:cursor-not-allowed"
                            >
                              Delete
                            </button>
                        </td>
                      </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </div>
                          </div>
          )}

          {/* Usage Records Tab */}
          {activeTab === 'usage' && (
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Usage Records</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feed Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity Used</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Birds</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Efficiency</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recorded By</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verified</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {feedUsage.map((usage) => (
                        <tr key={usage._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {usage.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {usage.feedType}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {usage.quantityUsed} KG
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {usage.totalBirds}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {usage.feedPerBird} KG/bird
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {usage.recordedBy}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              usage.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {usage.verified ? 'Verified' : 'Pending'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button 
                              onClick={() => deleteUsageRecord(usage._id, usage.feedType, usage.date)}
                              disabled={loading}
                              className="text-red-600 hover:text-red-900 disabled:text-red-300 disabled:cursor-not-allowed"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
                    </div>
                  </div>
                </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Feed Analytics Dashboard</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-600">Total Usage (30 days)</h4>
                    <p className="text-2xl font-bold text-blue-700">
                      {analytics.summary?.totalUsage?.toLocaleString() || 0} KG
                      </p>
                    </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-green-600">Total Cost</h4>
                    <p className="text-2xl font-bold text-green-700">
                      {formatCurrency(analytics.summary?.totalCost || 0)}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-purple-600">Avg Daily Usage</h4>
                    <p className="text-2xl font-bold text-purple-700">
                      {analytics.summary?.averageDailyUsage?.toFixed(1) || 0} KG
                    </p>
                </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-orange-600">Total Records</h4>
                    <p className="text-2xl font-bold text-orange-700">
                      {analytics.summary?.totalRecords || 0}
                    </p>
                  </div>
                </div>
                
                <div className="text-center py-8">
                  <p className="text-gray-500">📈 Advanced analytics charts and insights coming soon...</p>
                  <p className="text-sm text-gray-400 mt-2">Consumption trends, efficiency metrics, and predictive analytics</p>
              </div>
            </div>
          </div>
          )}

      {/* Stock Update Modal */}
      {showStockModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Feed Stock</h3>
              <form onSubmit={handleStockSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Feed Type</label>
                  <select
                    name="feedType"
                    value={stockForm.feedType}
                    onChange={handleStockInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    required
                  >
                    <option value="Layer Feed">Layer Feed</option>
                    <option value="Chick Starter">Chick Starter</option>
                    <option value="Grower Feed">Grower Feed</option>
                    <option value="Medicated Feed">Medicated Feed</option>
                    <option value="Organic Feed">Organic Feed</option>
                    <option value="Finisher Feed">Finisher Feed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Month</label>
                  <input
                    type="month"
                    name="month"
                    value={stockForm.month}
                    onChange={handleStockInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Baseline Quantity (KG)</label>
                  <input
                    type="number"
                    name="baselineQuantity"
                    value={stockForm.baselineQuantity}
                    onChange={handleStockInputChange}
                    placeholder="e.g., 1000"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Supplier</label>
                  <input
                    type="text"
                    name="supplier"
                    value={stockForm.supplier}
                    onChange={handleStockInputChange}
                    placeholder="Supplier Name"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Cost Per Unit (LKR)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="costPerUnit"
                    value={stockForm.costPerUnit}
                    onChange={handleStockInputChange}
                    placeholder="e.g., 150.00"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                  <input
                    type="date"
                    name="expiryDate"
                    value={stockForm.expiryDate}
                    onChange={handleStockInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Minimum Threshold (KG)</label>
                  <input
                    type="number"
                    name="minimumThreshold"
                    value={stockForm.minimumThreshold}
                    onChange={handleStockInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Quality Grade</label>
                  <select
                    name="qualityGrade"
                    value={stockForm.qualityGrade}
                    onChange={handleStockInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="A">Grade A</option>
                    <option value="B">Grade B</option>
                    <option value="C">Grade C</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Notes</label>
                  <textarea
                    name="notes"
                    value={stockForm.notes}
                    onChange={handleStockInputChange}
                    rows={3}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Any additional notes..."
                  />
                </div>

                <div className="md:col-span-2 flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowStockModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-md"
                  >
                    Update Stock
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Daily Usage Recording Modal */}
      {showUsageModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Daily Feed Usage</h3>
                </div>
                <button
                  onClick={() => setShowUsageModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
                <p className="text-sm text-blue-700">
                  📝 <strong>Enhanced Daily Recording</strong> - Record comprehensive feed usage data
                </p>
              </div>

              <form onSubmit={handleUsageSubmit} className="space-y-6">
                {/* Basic Information Section */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Basic Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Feed Type *</label>
                      <select
                        name="feedType"
                        value={usageForm.feedType}
                        onChange={handleUsageInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        required
                      >
                        <option value="Layer Feed">Layer Feed</option>
                        <option value="Chick Starter">Chick Starter</option>
                        <option value="Grower Feed">Grower Feed</option>
                        <option value="Medicated Feed">Medicated Feed</option>
                        <option value="Organic Feed">Organic Feed</option>
                        <option value="Finisher Feed">Finisher Feed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                      <div className="relative">
                        <input
                          type="date"
                          name="date"
                          value={usageForm.date}
                          onChange={async (e) => {
                            const newDate = e.target.value;
                            setUsageForm(prev => ({ ...prev, date: newDate }));
                            
                            // Check for conflicts and auto-fill data
                            const hasConflict = await checkDateConflicts(newDate, usageForm.feedType);
                            autoFillDateData(newDate);
                            
                            // Generate new suggestions when date changes
                            await generateDateSuggestions(usageForm.feedType);
                          }}
                          onFocus={() => setShowDateSuggestions(true)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                          required
                        />
                        
                        {/* Date suggestions dropdown */}
                        {showDateSuggestions && dateSuggestions.length > 0 && (
                          <div className="date-suggestions-container absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                            <div className="p-2 text-xs text-gray-500 border-b">Quick Date Selection:</div>
                            {dateSuggestions.map((suggestion, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={() => {
                                  setUsageForm(prev => ({ ...prev, date: suggestion.date }));
                                  autoFillDateData(suggestion.date);
                                  setShowDateSuggestions(false);
                                }}
                                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center justify-between ${
                                  suggestion.isRecommended ? 'bg-green-50 text-green-700' : ''
                                }`}
                              >
                                <span>{suggestion.label}</span>
                                <span className="text-xs text-gray-500">{suggestion.date}</span>
                                {suggestion.isRecommended && (
                                  <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">Recommended</span>
                                )}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* Date conflict warning */}
                      {dateConflicts.length > 0 && (
                        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                          <div className="flex items-center">
                            <svg className="w-4 h-4 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <span className="text-sm text-yellow-700">
                              <strong>Warning:</strong> Usage already recorded for this date and feed type
                            </span>
                          </div>
                          <div className="mt-1 text-xs text-yellow-600">
                            Existing record: {dateConflicts[0].quantityUsed}KG used by {dateConflicts[0].recordedBy}
                          </div>
                        </div>
                      )}
                      
                      {/* Auto-generated weather info */}
                      {usageForm.weather && (
                        <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
                          <div className="flex items-center text-sm text-blue-700">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                            </svg>
                            <span>Auto-filled: {usageForm.weather}, {usageForm.temperature}°C, {usageForm.humidity}% humidity</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quantity Used (KG) *</label>
                      <input
                        type="number"
                        step="0.1"
                        name="quantityUsed"
                        value={usageForm.quantityUsed}
                        onChange={handleUsageInputChange}
                        placeholder="e.g., 50.5"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Total Birds</label>
                      <input
                        type="number"
                        name="totalBirds"
                        value={usageForm.totalBirds}
                        onChange={handleUsageInputChange}
                        placeholder="e.g., 200"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Feeding Time</label>
                      <select
                        name="feedingTime"
                        value={usageForm.feedingTime}
                        onChange={handleUsageInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="Full Day">Full Day</option>
                        <option value="Morning Only">Morning Only</option>
                        <option value="Evening Only">Evening Only</option>
                        <option value="Twice Daily">Twice Daily</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <select
                        name="location"
                        value={usageForm.location}
                        onChange={handleUsageInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="Main Coop">Main Coop</option>
                        <option value="Secondary Coop">Secondary Coop</option>
                        <option value="Brooder House">Brooder House</option>
                        <option value="Free Range">Free Range</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Environmental Conditions Section */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                    </svg>
                    Environmental Conditions (Optional)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Weather</label>
                      <select
                        name="weather"
                        value={usageForm.weather}
                        onChange={handleUsageInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="">Select Weather</option>
                        <option value="Sunny">Sunny</option>
                        <option value="Rainy">Rainy</option>
                        <option value="Cloudy">Cloudy</option>
                        <option value="Hot">Hot</option>
                        <option value="Cold">Cold</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Temperature (°C)</label>
                      <input
                        type="number"
                        step="0.1"
                        name="temperature"
                        value={usageForm.temperature}
                        onChange={handleUsageInputChange}
                        placeholder="e.g., 25.5"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Humidity (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        name="humidity"
                        value={usageForm.humidity}
                        onChange={handleUsageInputChange}
                        placeholder="e.g., 65.0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Information Section */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Additional Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Waste Percentage (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        name="wastePercentage"
                        value={usageForm.wastePercentage}
                        onChange={handleUsageInputChange}
                        placeholder="e.g., 5.0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Recorded By *</label>
                      <input
                        type="text"
                        name="recordedBy"
                        value={usageForm.recordedBy}
                        onChange={handleUsageInputChange}
                        placeholder="Your name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                      <textarea
                        name="notes"
                        value={usageForm.notes}
                        onChange={handleUsageInputChange}
                        placeholder="Any additional observations or notes..."
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                  <p className="text-sm text-yellow-700 mb-2">
                    💡 <strong>Quick Actions:</strong> Fill common values instantly
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setUsageForm(prev => ({
                          ...prev,
                          totalBirds: '200',
                          feedingTime: 'Full Day',
                          location: 'Main Coop',
                          wastePercentage: '5.0'
                        }));
                      }}
                      className="px-3 py-1 text-xs bg-yellow-200 hover:bg-yellow-300 text-yellow-800 rounded-md"
                    >
                      Standard Layer Setup
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setUsageForm(prev => ({
                          ...prev,
                          totalBirds: '100',
                          feedingTime: 'Twice Daily',
                          location: 'Brooder House',
                          wastePercentage: '3.0'
                        }));
                      }}
                      className="px-3 py-1 text-xs bg-yellow-200 hover:bg-yellow-300 text-yellow-800 rounded-md"
                    >
                      Chick Setup
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setUsageForm(prev => ({
                          ...prev,
                          weather: 'Sunny',
                          temperature: '25.0',
                          humidity: '60.0'
                        }));
                      }}
                      className="px-3 py-1 text-xs bg-yellow-200 hover:bg-yellow-300 text-yellow-800 rounded-md"
                    >
                      Good Weather
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        const today = new Date().toISOString().split('T')[0];
                        setUsageForm(prev => ({ ...prev, date: today }));
                        await generateDateSuggestions(usageForm.feedType);
                        autoFillDateData(today);
                        setShowDateSuggestions(true);
                      }}
                      className="px-3 py-1 text-xs bg-blue-200 hover:bg-blue-300 text-blue-800 rounded-md"
                    >
                      Smart Date
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="text-sm text-gray-500">
                    * Required fields
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowUsageModal(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2 text-sm font-medium text-white bg-green-500 hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed rounded-md flex items-center"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Recording...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Record Usage
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedItem && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Stock Details - {selectedItem.feedType}</h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-700">Stock Information</h4>
                    <div className="mt-2 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Current Quantity:</span>
                        <span className="font-medium">{selectedItem.currentQuantity} KG</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Baseline Quantity:</span>
                        <span className="font-medium">{selectedItem.baselineQuantity} KG</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Minimum Threshold:</span>
                        <span className="font-medium">{selectedItem.minimumThreshold} KG</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Days Remaining:</span>
                        <span className={`font-medium ${getDaysRemainingColor(selectedItem.daysRemaining)}`}>
                          {selectedItem.daysRemaining || 0} days
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-700">Supplier Information</h4>
                    <div className="mt-2 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Supplier:</span>
                        <span className="font-medium">{selectedItem.supplier}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Contact:</span>
                        <span className="font-medium">{selectedItem.supplierContact || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery Date:</span>
                        <span className="font-medium">{selectedItem.deliveryDate || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-700">Quality & Cost</h4>
                    <div className="mt-2 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Quality Grade:</span>
                        <span className="font-medium">Grade {selectedItem.qualityGrade}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cost Per Unit:</span>
                        <span className="font-medium">{formatCurrency(selectedItem.costPerUnit)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Cost:</span>
                        <span className="font-medium">{formatCurrency(selectedItem.totalCost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Expiry Date:</span>
                        <span className="font-medium">{selectedItem.expiryDate}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-700">Consumption</h4>
                    <div className="mt-2 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Avg Daily Consumption:</span>
                        <span className="font-medium">
                          {selectedItem.averageDailyConsumption?.toFixed(1) || 0} KG
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <span className={`font-medium px-2 py-1 rounded text-xs ${getStatusColor(selectedItem.status)}`}>
                          {selectedItem.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedItem.notes && (
                  <div className="md:col-span-2">
                    <h4 className="font-medium text-gray-700">Notes</h4>
                    <p className="mt-2 text-sm text-gray-600">{selectedItem.notes}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-4">
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
              <p>No.222,Glahitiyawa,Kuliyapitiya</p>
              <p>Abeyrathne Enterprises</p>
              <p>Abeyrathne Enterprises@gmail.com</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FeedInventory;