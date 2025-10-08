import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const SalesOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Advanced Features State
  const [salesAnalytics, setSalesAnalytics] = useState({
    totalRevenue: 0,
    averageOrderValue: 0,
    customerCount: 0,
    conversionRate: 0,
    topCustomers: [],
    salesTrends: [],
    seasonalPatterns: []
  });
  const [aiInsights, setAiInsights] = useState({
    salesForecast: [],
    demandPrediction: [],
    pricingOptimization: [],
    customerSegmentation: [],
    recommendations: [],
    riskFactors: []
  });
  const [customerAnalytics, setCustomerAnalytics] = useState({
    satisfactionScore: 0,
    loyaltyMetrics: [],
    behaviorPatterns: [],
    churnRisk: [],
    lifetimeValue: []
  });
  const [showAdvancedFeatures, setShowAdvancedFeatures] = useState(false);

  // API Base URL
  const API_BASE_URL = 'http://localhost:5000/api';

  // Load data from backend
  useEffect(() => {
    fetchOrders();
  }, []);

  // Load advanced analytics when orders change
  useEffect(() => {
    if (orders.length > 0) {
      loadAdvancedAnalytics();
    } else {
      generateSampleAnalytics();
    }
  }, [orders]);

  // Load advanced analytics
  const loadAdvancedAnalytics = async () => {
    try {
      const analytics = calculateSalesAnalytics();
      const insights = generateAIInsights();
      const customerData = analyzeCustomerBehavior();
      
      setSalesAnalytics(analytics);
      setAiInsights(insights);
      setCustomerAnalytics(customerData);
      
      console.log('Advanced analytics loaded:', {
        totalRevenue: analytics.totalRevenue,
        forecastLength: insights.salesForecast.length,
        customerCount: analytics.customerCount
      });
    } catch (error) {
      console.error('Error loading advanced analytics:', error);
    }
  };

  // Generate sample analytics for demonstration
  const generateSampleAnalytics = () => {
    setSalesAnalytics({
      totalRevenue: 125000,
      averageOrderValue: 450,
      customerCount: 28,
      conversionRate: 78,
      topCustomers: [
        { name: 'Colombo Supermarket', orders: 15, revenue: 12500 },
        { name: 'Kandy Fresh Market', orders: 12, revenue: 9800 },
        { name: 'Galle Food Center', orders: 10, revenue: 8200 }
      ],
      salesTrends: generateSalesTrends(),
      seasonalPatterns: generateSeasonalPatterns()
    });

    setAiInsights({
      demandPrediction: generateDemandPrediction(),
      pricingOptimization: generatePricingOptimization(),
      customerSegmentation: generateCustomerSegmentation(),
      recommendations: generateSalesRecommendations(),
      riskFactors: identifySalesRisks()
    });

    setCustomerAnalytics({
      satisfactionScore: 87,
      loyaltyMetrics: generateLoyaltyMetrics(),
      behaviorPatterns: generateBehaviorPatterns(),
      churnRisk: generateChurnRisk(),
      lifetimeValue: generateLifetimeValue()
    });
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/sales-orders`);
      const data = await response.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate next order number
  const generateNextOrderNumber = () => {
    const currentYear = new Date().getFullYear();
    
    if (orders.length === 0) {
      return `SO-${currentYear}-001`;
    }
    
    // Extract order numbers for current year and find the highest
    const currentYearPrefix = `SO-${currentYear}-`;
    const orderNumbers = orders
      .map(order => order.orderNumber)
      .filter(orderNum => orderNum && orderNum.startsWith(currentYearPrefix))
      .map(orderNum => {
        const parts = orderNum.split('-');
        const num = parts[2]; // Get the number part after SO-YYYY-
        return parseInt(num, 10) || 0;
      });
    
    const maxOrder = Math.max(...orderNumbers, 0);
    const nextOrder = maxOrder + 1;
    return `SO-${currentYear}-${nextOrder.toString().padStart(3, '0')}`;
  };

  const [showModal, setShowModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [formData, setFormData] = useState({
    orderNumber: '',
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    productType: '',
    quantity: '',
    unitPrice: '',
    orderDate: '',
    deliveryDate: '',
    status: 'Pending',
    paymentStatus: 'Pending',
    notes: ''
  });

  const handleCreate = () => {
    setEditingOrder(null);
    const nextOrderNumber = generateNextOrderNumber();
    setFormData({
      orderNumber: nextOrderNumber,
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      productType: '',
      quantity: '',
      unitPrice: '',
      orderDate: new Date().toISOString().split('T')[0],
      deliveryDate: '',
      status: 'Pending',
      paymentStatus: 'Pending',
      notes: ''
    });
    setShowModal(true);
  };

  const handleEdit = (order) => {
    setEditingOrder(order);
    setFormData(order);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/sales-orders/${id}`, {
          method: 'DELETE',
        });
        const data = await response.json();
        if (data.success) {
          await fetchOrders(); // Refresh data
        }
      } catch (error) {
        console.error('Error deleting order:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingOrder) {
        // Update existing order
        const response = await fetch(`${API_BASE_URL}/sales-orders/${editingOrder._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        const data = await response.json();
        if (data.success) {
          await fetchOrders(); // Refresh data
        }
      } else {
        // Create new order
        const response = await fetch(`${API_BASE_URL}/sales-orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        const data = await response.json();
        if (data.success) {
          await fetchOrders(); // Refresh data
        }
      }
      setShowModal(false);
    } catch (error) {
      console.error('Error saving order:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Advanced Analytics Functions
  const calculateSalesAnalytics = () => {
    if (orders.length === 0) return {
      totalRevenue: 0,
      averageOrderValue: 0,
      customerCount: 0,
      conversionRate: 0,
      topCustomers: [],
      salesTrends: [],
      seasonalPatterns: []
    };

    const totalRevenue = orders.reduce((sum, order) => sum + (Number(order.quantity) * Number(order.unitPrice)), 0);
    const averageOrderValue = totalRevenue / orders.length;
    const uniqueCustomers = new Set(orders.map(order => order.customerName)).size;
    
    // Calculate conversion rate (simulated)
    const conversionRate = Math.min(95, 60 + (orders.length * 2));
    
    // Top customers by revenue
    const customerRevenue = {};
    orders.forEach(order => {
      const revenue = Number(order.quantity) * Number(order.unitPrice);
      if (customerRevenue[order.customerName]) {
        customerRevenue[order.customerName] += revenue;
      } else {
        customerRevenue[order.customerName] = revenue;
      }
    });
    
    const topCustomers = Object.entries(customerRevenue)
      .map(([name, revenue]) => ({
        name,
        revenue,
        orders: orders.filter(order => order.customerName === name).length
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    return {
      totalRevenue: Math.round(totalRevenue),
      averageOrderValue: Math.round(averageOrderValue),
      customerCount: uniqueCustomers,
      conversionRate: Math.round(conversionRate),
      topCustomers,
      salesTrends: generateSalesTrends(),
      seasonalPatterns: generateSeasonalPatterns()
    };
  };

  const generateAIInsights = () => {
    return {
      demandPrediction: generateDemandPrediction(),
      pricingOptimization: generatePricingOptimization(),
      customerSegmentation: generateCustomerSegmentation(),
      recommendations: generateSalesRecommendations(),
      riskFactors: identifySalesRisks()
    };
  };

  const analyzeCustomerBehavior = () => {
    return {
      satisfactionScore: calculateSatisfactionScore(),
      loyaltyMetrics: generateLoyaltyMetrics(),
      behaviorPatterns: generateBehaviorPatterns(),
      churnRisk: generateChurnRisk(),
      lifetimeValue: generateLifetimeValue()
    };
  };

  // Sales forecasting
  const generateSalesForecast = () => {
    const forecast = [];
    const last7Days = orders.slice(-7);
    const avgDailyRevenue = last7Days.reduce((sum, order) => 
      sum + (Number(order.quantity) * Number(order.unitPrice)), 0) / 7;
    
    for (let i = 1; i <= 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      const dayOfWeek = date.getDay();
      const weekendFactor = (dayOfWeek === 0 || dayOfWeek === 6) ? 0.8 : 1.0;
      const seasonalFactor = getSeasonalFactor(date);
      
      forecast.push({
        date: date.toISOString().split('T')[0],
        predictedRevenue: Math.round(avgDailyRevenue * weekendFactor * seasonalFactor),
        predictedOrders: Math.round((last7Days.length / 7) * weekendFactor * seasonalFactor),
        confidence: Math.max(60, 100 - (i * 5))
      });
    }
    
    return forecast;
  };

  const getSeasonalFactor = (date) => {
    const month = date.getMonth();
    // Higher demand in festive seasons and holidays
    if (month === 11 || month === 0) return 1.2; // December/January (festive season)
    if (month >= 3 && month <= 5) return 1.1; // April-June (wedding season)
    if (month >= 8 && month <= 10) return 1.05; // September-November (good season)
    return 0.95; // Other months
  };

  // Demand prediction
  const generateDemandPrediction = () => {
    return [
      { product: 'Fresh Eggs (Grade A)', predictedDemand: 1200, confidence: 85 },
      { product: 'Fresh Eggs (Grade B)', predictedDemand: 800, confidence: 78 },
      { product: 'Organic Eggs', predictedDemand: 300, confidence: 72 },
      { product: 'Free Range Eggs', predictedDemand: 200, confidence: 68 }
    ];
  };

  // Pricing optimization
  const generatePricingOptimization = () => {
    return [
      {
        product: 'Fresh Eggs (Grade A)',
        currentPrice: 15,
        suggestedPrice: 16,
        expectedIncrease: 8,
        reason: 'High demand, low competition'
      },
      {
        product: 'Organic Eggs',
        currentPrice: 25,
        suggestedPrice: 24,
        expectedIncrease: -2,
        reason: 'Competitive pricing needed'
      }
    ];
  };

  // Customer segmentation
  const generateCustomerSegmentation = () => {
    return [
      { segment: 'VIP Customers', count: 5, revenue: 45000, characteristics: 'High value, frequent orders' },
      { segment: 'Regular Customers', count: 15, revenue: 60000, characteristics: 'Consistent, moderate orders' },
      { segment: 'New Customers', count: 8, revenue: 20000, characteristics: 'Recent, growing potential' }
    ];
  };

  // Sales recommendations
  const generateSalesRecommendations = () => {
    const recommendations = [];
    
    if (orders.length > 0) {
      const recentOrders = orders.slice(-7);
      const avgOrderValue = recentOrders.reduce((sum, order) => 
        sum + (Number(order.quantity) * Number(order.unitPrice)), 0) / recentOrders.length;
      
      if (avgOrderValue < 300) {
        recommendations.push({
          type: 'info',
          title: 'Increase Average Order Value',
          description: 'Consider upselling or bundle offers to increase order value',
          priority: 'medium'
        });
      }
    }
    
    recommendations.push({
      type: 'success',
      title: 'Customer Retention Strategy',
      description: 'Implement loyalty program for repeat customers',
      priority: 'high'
    });
    
    return recommendations;
  };

  // Risk identification
  const identifySalesRisks = () => {
    const risks = [];
    
    if (orders.length > 0) {
      const recentOrders = orders.slice(-7);
      const pendingOrders = recentOrders.filter(order => order.status === 'Pending').length;
      
      if (pendingOrders > recentOrders.length * 0.3) {
        risks.push({
          factor: 'High Pending Orders',
          impact: 'Medium',
          description: `${pendingOrders} pending orders may affect cash flow`
        });
      }
    }
    
    return risks;
  };

  // Customer analytics
  const calculateSatisfactionScore = () => {
    if (orders.length === 0) return 85;
    
    const completedOrders = orders.filter(order => order.status === 'Completed').length;
    const totalOrders = orders.length;
    const completionRate = (completedOrders / totalOrders) * 100;
    
    return Math.min(100, Math.round(completionRate + 10));
  };

  const generateLoyaltyMetrics = () => {
    return [
      { metric: 'Repeat Purchase Rate', value: 68, trend: '+5%' },
      { metric: 'Customer Retention', value: 82, trend: '+3%' },
      { metric: 'Referral Rate', value: 25, trend: '+2%' }
    ];
  };

  const generateBehaviorPatterns = () => {
    return [
      { pattern: 'Peak Order Time', value: '10:00 AM - 2:00 PM', insight: 'Most orders placed during lunch hours' },
      { pattern: 'Preferred Day', value: 'Tuesday-Thursday', insight: 'Mid-week orders are most common' },
      { pattern: 'Seasonal Preference', value: 'Festive Seasons', insight: 'Higher demand during holidays' }
    ];
  };

  const generateChurnRisk = () => {
    return [
      { customer: 'ABC Restaurant', risk: 'Low', lastOrder: '2 days ago' },
      { customer: 'XYZ Cafe', risk: 'Medium', lastOrder: '2 weeks ago' },
      { customer: 'DEF Hotel', risk: 'High', lastOrder: '1 month ago' }
    ];
  };

  const generateLifetimeValue = () => {
    return [
      { customer: 'Colombo Supermarket', ltv: 15000, orders: 25 },
      { customer: 'Kandy Fresh Market', ltv: 12000, orders: 20 },
      { customer: 'Galle Food Center', ltv: 9500, orders: 15 }
    ];
  };

  const generateSalesTrends = () => {
    const trends = [];
    for (let i = 0; i < 12; i++) {
      trends.push({
        month: new Date(2024, i).toLocaleDateString('en-US', { month: 'short' }),
        revenue: 8000 + Math.random() * 4000,
        orders: 15 + Math.floor(Math.random() * 10)
      });
    }
    return trends;
  };

  const generateSeasonalPatterns = () => {
    return [
      { season: 'Festive Season', boost: 25, months: 'Dec-Jan' },
      { season: 'Wedding Season', boost: 15, months: 'Apr-Jun' },
      { season: 'Regular Season', boost: 0, months: 'Feb-Mar, Jul-Nov' }
    ];
  };

  return (
    <div className="p-8">
          {/* Page Title */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Sales and Order Management</h1>
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
            </div>
            <p className="text-gray-600">Manage your sales orders, customers, and inventory efficiently</p>
          </div>

          {/* Notifications Panel - Centered */}
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
              <h2 className="text-xl font-bold text-orange-500 mb-6">Notifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                  <div className="flex">
                    <div className="ml-3">
                      <p className="text-sm text-red-700 font-medium">Low Stock Alerts</p>
                      <p className="text-sm text-red-600">Organic Eggs - 15 units remaining</p>
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                  <div className="flex">
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700 font-medium">Pending Order Reminders</p>
                      <p className="text-sm text-yellow-600">3 orders awaiting confirmation</p>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
                  <div className="flex">
                    <div className="ml-3">
                      <p className="text-sm text-green-700 font-medium">Order Ready for Dispatch</p>
                      <p className="text-sm text-green-600">Order #2 ready for pickup</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Management Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Product Catalog */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Product Catalog</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Add / Edit / Delete Products</li>
                <li>• Category Filtering</li>
                <li>• Price Management</li>
                <li>• Stock Tracking</li>
              </ul>
            </div>

            {/* Customer Management */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Customer Management</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Customer Database</li>
                <li>• Contact Information</li>
                <li>• Order History</li>
                <li>• Customer Analytics</li>
              </ul>
            </div>

            {/* Order Placement */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Order Placement</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Create New Orders</li>
                <li>• Edit Orders</li>
                <li>• Order Tracking</li>
                <li>• Status Updates</li>
              </ul>
            </div>

            {/* Stock Management */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Stock Management</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Stock Deduction Processing</li>
                <li>• Inventory Levels</li>
                <li>• Low Stock Alerts</li>
                <li>• Reorder Points</li>
              </ul>
            </div>

            {/* Invoice & Payment */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Invoice & Payment</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Generate Invoices</li>
                <li>• Payment Tracking</li>
                <li>• Payment Methods</li>
                <li>• Outstanding Payments</li>
              </ul>
            </div>

            {/* Sales Reports */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Sales Reports</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Sales Analytics</li>
                <li>• Revenue Reports</li>
                <li>• Customer Insights</li>
                <li>• Performance Metrics</li>
              </ul>
            </div>
          </div>

          {/* Orders Management Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Order Management</h2>
              <button 
                onClick={handleCreate}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New Order
              </button>
            </div>

            {/* Advanced Features Toggle */}
            <div className="mb-8 flex gap-4 items-center">
              <button
                onClick={() => setShowAdvancedFeatures(!showAdvancedFeatures)}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-3 rounded-lg font-medium flex items-center transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                {showAdvancedFeatures ? 'Hide' : 'Show'} AI Sales Analytics & Insights
              </button>
              
              {showAdvancedFeatures && (
                <button
                  onClick={() => loadAdvancedAnalytics()}
                  className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-4 py-3 rounded-lg font-medium flex items-center transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh Analytics
                </button>
              )}
            </div>

            {/* Advanced Features Section */}
            {showAdvancedFeatures && (
              <div className="space-y-8 mb-8">
                {/* Sales Analytics Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 shadow-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-600">Total Revenue</h3>
                        <p className="text-3xl font-bold text-blue-600">Rs. {salesAnalytics.totalRevenue.toLocaleString()}</p>
                      </div>
                      <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-6 shadow-lg border border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-600">Avg Order Value</h3>
                        <p className="text-3xl font-bold text-green-600">Rs. {salesAnalytics.averageOrderValue.toLocaleString()}</p>
                      </div>
                      <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-violet-100 rounded-xl p-6 shadow-lg border border-purple-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-600">Customers</h3>
                        <p className="text-3xl font-bold text-purple-600">{salesAnalytics.customerCount}</p>
                      </div>
                      <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-orange-50 to-amber-100 rounded-xl p-6 shadow-lg border border-orange-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-600">Conversion Rate</h3>
                        <p className="text-3xl font-bold text-orange-600">{salesAnalytics.conversionRate}%</p>
                      </div>
                      <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Demand Prediction */}
                <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                  <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      Demand Prediction
                    </h3>
                    <div className="space-y-3">
                      {aiInsights.demandPrediction.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                          <div>
                            <div className="font-medium text-gray-800">{item.product}</div>
                            <div className="text-sm text-gray-600">{item.predictedDemand} units</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-green-600">{item.confidence}%</div>
                            <div className="text-xs text-gray-500">confidence</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Customer Analytics & Pricing Optimization */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Customer Satisfaction */}
                  <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      Customer Satisfaction
                    </h3>
                    <div className="text-center mb-4">
                      <div className="text-4xl font-bold text-blue-600 mb-2">
                        {customerAnalytics.satisfactionScore}%
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-1000"
                          style={{ width: `${customerAnalytics.satisfactionScore}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {customerAnalytics.loyaltyMetrics.map((metric, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-700">{metric.metric}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-blue-600">{metric.value}%</span>
                            <span className="text-xs text-green-600">{metric.trend}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pricing Optimization */}
                  <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      Pricing Optimization
                    </h3>
                    <div className="space-y-3">
                      {aiInsights.pricingOptimization.map((item, index) => (
                        <div key={index} className="p-3 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg">
                          <div className="font-medium text-gray-800 mb-2">{item.product}</div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">Current: Rs. {item.currentPrice}</span>
                            <span className="text-sm text-gray-600">Suggested: Rs. {item.suggestedPrice}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className={`text-sm font-medium ${item.expectedIncrease > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {item.expectedIncrease > 0 ? '+' : ''}{item.expectedIncrease}% revenue
                            </span>
                            <span className="text-xs text-gray-500">{item.reason}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Top Customers & AI Recommendations */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Top Customers */}
                  <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Top Customers
                    </h3>
                    <div className="space-y-3">
                      {salesAnalytics.topCustomers.map((customer, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
                          <div>
                            <div className="font-medium text-gray-800">{customer.name}</div>
                            <div className="text-sm text-gray-600">{customer.orders} orders</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-indigo-600">Rs. {customer.revenue.toLocaleString()}</div>
                            <div className="text-xs text-gray-500">total revenue</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Recommendations */}
                  <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      AI Recommendations
                    </h3>
                    <div className="space-y-3">
                      {aiInsights.recommendations.map((rec, index) => (
                        <div key={index} className={`p-3 rounded-lg border-l-4 ${
                          rec.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                          rec.type === 'info' ? 'bg-blue-50 border-blue-400' :
                          'bg-green-50 border-green-400'
                        }`}>
                          <div className="flex items-start">
                            <div className={`w-2 h-2 rounded-full mt-2 mr-3 ${
                              rec.priority === 'high' ? 'bg-red-500' :
                              rec.priority === 'medium' ? 'bg-yellow-500' :
                              'bg-green-500'
                            }`}></div>
                            <div>
                              <div className="font-medium text-gray-800">{rec.title}</div>
                              <div className="text-sm text-gray-600">{rec.description}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Risk Factors */}
                {aiInsights.riskFactors.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-6 shadow-lg">
                    <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      Risk Factors Detected
                    </h3>
                    <div className="space-y-3">
                      {aiInsights.riskFactors.map((risk, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200">
                          <div>
                            <div className="font-medium text-red-800">{risk.factor}</div>
                            <div className="text-sm text-red-600">{risk.description}</div>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                            risk.impact === 'High' ? 'bg-red-100 text-red-800' :
                            risk.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {risk.impact}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Orders Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-orange-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                        Loading...
                      </td>
                    </tr>
                  ) : orders.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                        No orders found
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.orderNumber}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.customerName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.productType}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.quantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rs. {order.totalAmount?.toFixed(2) || '0.00'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'Ready' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.orderDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleEdit(order)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Edit Order"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button 
                              onClick={() => handleDelete(order._id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete Order"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
      </div>

      {/* Modal for Create/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingOrder ? 'Edit Order' : 'Create New Order'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Order Number</label>
                  {editingOrder ? (
                    <input
                      type="text"
                      name="orderNumber"
                      value={formData.orderNumber}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                      required
                    />
                  ) : (
                    <div className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm bg-gray-50 text-gray-700">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-orange-600">{formData.orderNumber}</span>
                        <span className="text-xs text-gray-500 bg-green-100 px-2 py-1 rounded-full">
                          Auto-generated
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Order numbers are automatically generated in sequence
                      </p>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Customer Name</label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Customer Phone</label>
                  <input
                    type="text"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Product Type</label>
                  <select
                    name="productType"
                    value={formData.productType}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    required
                  >
                    <option value="">Select Product</option>
                    <option value="Small Eggs">Small Eggs</option>
                    <option value="Medium Eggs">Medium Eggs</option>
                    <option value="Large Eggs">Large Eggs</option>
                    <option value="Extra Large Eggs">Extra Large Eggs</option>
                    <option value="Mixed Size">Mixed Size</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Unit Price</label>
                  <input
                    type="number"
                    step="0.01"
                    name="unitPrice"
                    value={formData.unitPrice}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Order Date</label>
                  <input
                    type="date"
                    name="orderDate"
                    value={formData.orderDate}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Ready">Ready</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
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
                    {editingOrder ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
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

export default SalesOrder;
