import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import apiService from '../services/api';
import weatherService from '../services/weatherService';
import { MetricCard, Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { MetricCardSkeleton, TableSkeleton, InlineLoading } from '../components/ui/Loading';

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
  // Default to show newest records first
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  
  // Advanced Features State
  const [aiPredictions, setAiPredictions] = useState({
    qualityScore: 0,
    productionForecast: [],
    recommendations: [],
    riskFactors: []
  });
  const [weatherData, setWeatherData] = useState({
    temperature: 0,
    humidity: 0,
    pressure: 0,
    impact: 'positive',
    description: '',
    windSpeed: 0,
    visibility: 0,
    lastUpdated: '',
    source: 'fallback'
  });
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [productionEfficiency, setProductionEfficiency] = useState({
    score: 0,
    trends: [],
    optimizations: []
  });
  const [showAdvancedFeatures, setShowAdvancedFeatures] = useState(false);

  // Load data from backend
  useEffect(() => {
    fetchRecords();
    fetchSummary();
  }, []);

  // Reload advanced features when records change
  useEffect(() => {
    loadAdvancedFeatures();
  }, [records]);

  // Load advanced features data
  const loadAdvancedFeatures = async () => {
    try {
      // If no records, generate sample data for demonstration
      if (records.length === 0) {
        console.log('No records available, generating sample data for AI analysis');
        generateSampleData();
        return;
      }

      // Calculate AI predictions based on actual data
      const qualityScore = calculateQualityScore();
      const productionForecast = generateProductionForecast();
      const recommendations = generateRecommendations();
      const riskFactors = identifyRiskFactors();
      
      setAiPredictions({
        qualityScore,
        productionForecast,
        recommendations,
        riskFactors
      });

      // Get real weather data
      setWeatherLoading(true);
      const weather = await fetchWeatherData();
      setWeatherData(weather);
      setWeatherLoading(false);

      // Calculate production efficiency
      const efficiency = calculateProductionEfficiency();
      setProductionEfficiency(efficiency);

      console.log('Advanced features loaded:', {
        qualityScore,
        forecastLength: productionForecast.length,
        recommendationsCount: recommendations.length,
        riskFactorsCount: riskFactors.length
      });
    } catch (error) {
      console.error('Error loading advanced features:', error);
    }
  };

  // Generate sample data for demonstration
  const generateSampleData = () => {
    // Generate sample AI predictions
    const sampleQualityScore = 85;
    const sampleForecast = [];
    
    for (let i = 1; i <= 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      sampleForecast.push({
        date: date.toISOString().split('T')[0],
        predicted: 120 + Math.floor(Math.random() * 40),
        confidence: Math.max(60, 100 - (i * 5))
      });
    }

    setAiPredictions({
      qualityScore: sampleQualityScore,
      productionForecast: sampleForecast,
      recommendations: [
        {
          type: 'success',
          title: 'Good Production Rate',
          description: 'Your current production rate is within optimal range',
          priority: 'low'
        },
        {
          type: 'info',
          title: 'Feed Optimization',
          description: 'Consider adjusting protein content for better egg quality',
          priority: 'medium'
        }
      ],
      riskFactors: []
    });

    // Generate sample weather data
    setWeatherData({
      temperature: 24 + Math.random() * 8,
      humidity: 65 + Math.random() * 15,
      pressure: 1015 + Math.random() * 10,
      impact: 'positive'
    });

    // Generate sample efficiency data
    setProductionEfficiency({
      score: 88,
      trends: [
        { week: 1, efficiency: 85 },
        { week: 2, efficiency: 87 },
        { week: 3, efficiency: 89 },
        { week: 4, efficiency: 88 },
        { week: 5, efficiency: 90 },
        { week: 6, efficiency: 87 },
        { week: 7, efficiency: 89 },
        { week: 8, efficiency: 88 }
      ],
      optimizations: [
        {
          title: 'Lighting Optimization',
          description: 'Adjust lighting schedule for 2% production increase',
          impact: 'Medium',
          effort: 'Low'
        },
        {
          title: 'Feed Timing',
          description: 'Optimize feeding times for better efficiency',
          impact: 'High',
          effort: 'Medium'
        }
      ]
    });
  };

  // AI-powered quality score calculation
  const calculateQualityScore = () => {
    if (records.length === 0) return 0;
    
    const recentRecords = records.slice(-30); // Last 30 days
    let totalDamagedRate = 0;
    let validRecords = 0;
    
    recentRecords.forEach(record => {
      const eggsCollected = Number(record.eggsCollected) || 0;
      const damagedEggs = Number(record.damagedEggs) || 0;
      
      if (eggsCollected > 0) {
        totalDamagedRate += (damagedEggs / eggsCollected);
        validRecords++;
      }
    });
    
    if (validRecords === 0) return 0;
    
    const avgDamagedRate = totalDamagedRate / validRecords;
    const qualityScore = Math.max(0, 100 - (avgDamagedRate * 100));
    return Math.round(qualityScore);
  };

  // Generate production forecast
  const generateProductionForecast = () => {
    const forecast = [];
    const last7Days = records.slice(-7);
    
    // Calculate average production from actual data
    let totalProduction = 0;
    let validDays = 0;
    
    last7Days.forEach(record => {
      const eggsCollected = Number(record.eggsCollected) || 0;
      if (eggsCollected > 0) {
        totalProduction += eggsCollected;
        validDays++;
      }
    });
    
    const avgProduction = validDays > 0 ? totalProduction / validDays : 0;
    
    for (let i = 1; i <= 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      // Add some variation based on day of week and season
      const dayOfWeek = date.getDay();
      const weekendFactor = (dayOfWeek === 0 || dayOfWeek === 6) ? 0.9 : 1.0;
      const seasonalFactor = getSeasonalFactor(date);
      
      forecast.push({
        date: date.toISOString().split('T')[0],
        predicted: Math.round(avgProduction * weekendFactor * seasonalFactor),
        confidence: Math.max(60, 100 - (i * 5))
      });
    }
    
    return forecast;
  };

  // Get seasonal factor for production
  const getSeasonalFactor = (date) => {
    const month = date.getMonth();
    // Spring and fall are typically better for egg production
    if (month >= 2 && month <= 4) return 1.1; // Spring
    if (month >= 8 && month <= 10) return 1.05; // Fall
    if (month >= 5 && month <= 7) return 0.95; // Summer
    return 0.9; // Winter
  };

  // Generate AI recommendations
  const generateRecommendations = () => {
    const recommendations = [];
    const qualityScore = calculateQualityScore();
    
    if (qualityScore < 70) {
      recommendations.push({
        type: 'warning',
        title: 'Egg Quality Improvement',
        description: 'Consider adjusting feed quality and hen health monitoring',
        priority: 'high'
      });
    }
    
    if (records.length > 0) {
      const recentProduction = records.slice(-7).reduce((sum, record) => sum + (Number(record.eggsCollected) || 0), 0);
      const previousProduction = records.slice(-14, -7).reduce((sum, record) => sum + (Number(record.eggsCollected) || 0), 0);
      
      if (previousProduction > 0 && recentProduction < previousProduction * 0.9) {
        recommendations.push({
          type: 'info',
          title: 'Production Decline Detected',
          description: 'Recent production has decreased. Check environmental factors and hen health.',
          priority: 'medium'
        });
      }
    }
    
    recommendations.push({
      type: 'success',
      title: 'Optimal Feeding Schedule',
      description: 'Maintain current feeding schedule for best results',
      priority: 'low'
    });
    
    return recommendations;
  };

  // Identify risk factors
  const identifyRiskFactors = () => {
    const risks = [];
    
    if (records.length > 0) {
      const recentDamaged = records.slice(-7).reduce((sum, record) => sum + (Number(record.damagedEggs) || 0), 0);
      const recentTotal = records.slice(-7).reduce((sum, record) => sum + (Number(record.eggsCollected) || 0), 0);
      
      if (recentTotal > 0 && (recentDamaged / recentTotal) > 0.05) {
        risks.push({
          factor: 'High Damage Rate',
          impact: 'High',
          description: `Damage rate is ${((recentDamaged / recentTotal) * 100).toFixed(1)}%, exceeding 5% threshold`
        });
      }
    }
    
    return risks;
  };

  // Fetch real weather data for Kuliyapitiya, Sri Lanka
  const fetchWeatherData = async () => {
    return await weatherService.getCurrentWeather();
  };


  // Refresh weather data
  const refreshWeatherData = async () => {
    setWeatherLoading(true);
    try {
      const weather = await fetchWeatherData();
      setWeatherData(weather);
    } catch (error) {
      console.error('Error refreshing weather:', error);
    } finally {
      setWeatherLoading(false);
    }
  };

  // Calculate production efficiency
  const calculateProductionEfficiency = () => {
    if (records.length === 0) return { score: 0, trends: [], optimizations: [] };
    
    const recentRecords = records.slice(-30);
    let totalProduction = 0;
    let totalDamaged = 0;
    let validRecords = 0;
    
    recentRecords.forEach(record => {
      const eggsCollected = Number(record.eggsCollected) || 0;
      const damagedEggs = Number(record.damagedEggs) || 0;
      
      if (eggsCollected > 0) {
        totalProduction += eggsCollected;
        totalDamaged += damagedEggs;
        validRecords++;
      }
    });
    
    const efficiencyScore = validRecords > 0 && totalProduction > 0 
      ? Math.max(0, 100 - (totalDamaged / totalProduction) * 100)
      : 0;
    
    return {
      score: Math.round(efficiencyScore),
      trends: generateEfficiencyTrends(),
      optimizations: generateOptimizations()
    };
  };

  // Generate efficiency trends
  const generateEfficiencyTrends = () => {
    const trends = [];
    const weeklyData = [];
    
    for (let i = 0; i < records.length; i += 7) {
      const weekRecords = records.slice(i, i + 7);
      if (weekRecords.length > 0) {
        const weekProduction = weekRecords.reduce((sum, record) => sum + (Number(record.eggsCollected) || 0), 0);
        const weekDamaged = weekRecords.reduce((sum, record) => sum + (Number(record.damagedEggs) || 0), 0);
        weeklyData.push({
          week: Math.floor(i / 7) + 1,
          efficiency: weekProduction > 0 ? ((weekProduction - weekDamaged) / weekProduction) * 100 : 0
        });
      }
    }
    
    return weeklyData.slice(-8); // Last 8 weeks
  };

  // Generate optimization suggestions
  const generateOptimizations = () => {
    const optimizations = [];
    
    optimizations.push({
      title: 'Feed Optimization',
      description: 'Consider adjusting protein content in feed by 2%',
      impact: 'Medium',
      effort: 'Low'
    });
    
    optimizations.push({
      title: 'Lighting Schedule',
      description: 'Optimize lighting duration for better production',
      impact: 'High',
      effort: 'Medium'
    });
    
    return optimizations;
  };

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

  // Generate next batch number using backend API
  const generateNextBatchNumber = async () => {
    try {
      const response = await apiService.get('/egg-production/batch/next-batch-number');
      if (response.success) {
        return response.data.nextBatchNumber;
      }
      throw new Error('Failed to generate batch number');
    } catch (error) {
      console.error('Error generating next batch number:', error);
      // Fallback to local generation if API fails
      if (records.length === 0) {
        return 'Batch-001';
      }

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
    }
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
  const reportRef = useRef(null);

  // Load external script helper
  const loadScript = (src) => new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve());
      if (existing.readyState === 'complete') resolve();
      return resolve();
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(script);
  });

  const exportReportPdf = async () => {
    try {
      if (!window.html2canvas) {
        await loadScript('https://unpkg.com/html2canvas@1.4.1/dist/html2canvas.min.js');
      }
      if (!window.jspdf || !window.jspdf.jsPDF) {
        await loadScript('https://unpkg.com/jspdf@2.5.1/dist/jspdf.umd.min.js');
      }
      const element = reportRef.current;
      if (!element) return;
      const canvas = await window.html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new window.jspdf.jsPDF('p', 'pt', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * pageWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      while (heightLeft > 0) {
        pdf.addPage();
        position = position - pageHeight;
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save('egg-production-report.pdf');
    } catch (e) {
      console.error('PDF export failed:', e);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const handleCreate = async () => {
    setEditingRecord(null);
    const today = new Date();
    try {
      const nextBatch = await generateNextBatchNumber();
      setFormData({
        date: formatDateForInput(today),
        batchNumber: nextBatch,
        birds: '',
        eggsCollected: '',
        damagedEggs: ''
      });
      setShowModal(true);
    } catch (error) {
      console.error('Error generating batch number:', error);
      // Fallback to local generation
      const fallbackBatch = records.length === 0 ? 'Batch-001' :
        `Batch-${(Math.max(...records.map(r => parseInt(r.batchNumber?.split('-')[1] || '0')), 0) + 1).toString().padStart(3, '0')}`;

      setFormData({
        date: formatDateForInput(today),
        batchNumber: fallbackBatch,
        birds: '',
        eggsCollected: '',
        damagedEggs: ''
      });
      setShowModal(true);
    }
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
        // Ensure types expected by backend
        date: formData.date, // keep as YYYY-MM-DD so it's sortable and consistent
        batchNumber: (formData.batchNumber || '').trim(),
        birds: formData.birds === '' ? undefined : Number(formData.birds),
        eggsCollected: formData.eggsCollected === '' ? undefined : Number(formData.eggsCollected),
        damagedEggs: formData.damagedEggs === '' ? 0 : Number(formData.damagedEggs),
        notes: formData.notes
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
        // Handle specific error types
        if (data.error === 'BATCH_NUMBER_IMMUTABLE') {
          alert('Batch numbers cannot be changed after record creation. This helps maintain data consistency and prevents duplicate batch numbers.');
        }
        if (data.error === 'DUPLICATE_BATCH_NUMBER') {
          alert('A record with this batch number already exists for this date. Please use a different batch number or edit the existing record.');
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
    <div className="p-8">
          {/* Page Title */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5zM8 15V9h4v6H8z" clipRule="evenodd" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">EGG PRODUCTION MANAGEMENT</h1>
              </div>
              
              {/* Back / Report Buttons */}
              <div className="flex items-center gap-3">
                <Link 
                  to="/" 
                  className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 font-medium"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Main Menu
                </Link>
                <Link 
                  to="/reports"
                  state={{ from: 'egg-production', autoExport: true }}
                  className="inline-flex items-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors duration-200 font-medium"
                  title="Download report"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6M3 3v18h18" />
                  </svg>
                  Download Report
                </Link>
              </div>
            </div>
          </div>

          <div id="egg-report" ref={reportRef}>
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Total EGGS Produced"
              value={summary.totalEggs.toLocaleString()}
              color="orange"
              icon={
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              }
              trend={{ direction: 'up', label: 'Production tracking' }}
            />
            <MetricCard
              title="Average Production Rate"
              value={`${summary.averageProduction}%`}
              color="blue"
              icon={
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
              trend={{ direction: 'neutral', label: 'Performance metric' }}
            />
            <MetricCard
              title="Eggs SOLD"
              value={Math.round(summary.eggsSold).toLocaleString()}
              color="green"
              icon={
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              }
              trend={{ direction: 'up', label: 'Sales success' }}
            />
            <MetricCard
              title="Eggs in Stock"
              value={Math.round(summary.eggsInStock).toLocaleString()}
              color="purple"
              icon={
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              }
              trend={{ direction: 'neutral', label: 'Available inventory' }}
            />
          </div>

          {/* Advanced Features Toggle */}
          <div className="mb-8 flex gap-4 items-center">
            <Button
              onClick={() => setShowAdvancedFeatures(!showAdvancedFeatures)}
              variant="primary"
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              }
            >
              {showAdvancedFeatures ? 'Hide' : 'Show'} AI Analytics & Insights
            </Button>
            
            {showAdvancedFeatures && (
              <Button
                onClick={() => loadAdvancedFeatures()}
                variant="success"
                size="lg"
                className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                }
              >
                Refresh AI Analysis
              </Button>
            )}
          </div>

          {/* Advanced Features Section */}
          {showAdvancedFeatures && (
            <div className="space-y-8 mb-8">
              {/* AI Quality Score & Weather Impact */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* AI Quality Score */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 shadow-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      AI Quality Score
                    </h3>
                    <div className="text-3xl font-bold text-blue-600">
                      {aiPredictions.qualityScore}%
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-1000"
                      style={{ width: `${aiPredictions.qualityScore}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Based on damage rates and production consistency over the last 30 days
                  </p>
                </div>

                {/* Weather Impact */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-6 shadow-lg border border-green-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                      </svg>
                      Weather Impact - Kuliyapitiya, Sri Lanka
                    </h3>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={refreshWeatherData}
                        disabled={weatherLoading}
                        className="p-2 bg-white/50 hover:bg-white/70 rounded-lg transition-colors disabled:opacity-50"
                        title="Refresh weather data"
                      >
                        <svg className={`w-4 h-4 text-green-600 ${weatherLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </button>
                      <div className={`text-2xl font-bold ${weatherData.impact === 'positive' ? 'text-green-600' : weatherData.impact === 'negative' ? 'text-red-600' : 'text-gray-600'}`}>
                        {weatherData.impact === 'positive' ? '☀️' : weatherData.impact === 'negative' ? '🌧️' : '🌤️'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-sm text-gray-600 mb-2">
                      {weatherLoading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500 mr-2"></div>
                          Loading weather data...
                        </div>
                      ) : (
                        weatherData.description || 'Current conditions'
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {weatherLoading ? 'Updating...' : `Last updated: ${weatherData.lastUpdated ? new Date(weatherData.lastUpdated).toLocaleString() : 'Just now'}`}
                      {weatherData.source && weatherData.source !== 'fallback' && (
                        <span className="ml-2 text-green-600">• Live data</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-600">{Math.round(weatherData.temperature)}°C</div>
                      <div className="text-xs text-gray-600">Temperature</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{Math.round(weatherData.humidity)}%</div>
                      <div className="text-xs text-gray-600">Humidity</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{Math.round(weatherData.pressure)} hPa</div>
                      <div className="text-xs text-gray-600">Pressure</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{weatherData.windSpeed || 0} m/s</div>
                      <div className="text-xs text-gray-600">Wind Speed</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-white/50 rounded-lg">
                    <div className="text-sm font-medium text-gray-700 mb-1">Production Impact:</div>
                    <div className={`text-sm font-medium ${
                      weatherData.impact === 'positive' ? 'text-green-700' : 
                      weatherData.impact === 'negative' ? 'text-red-700' : 
                      'text-gray-700'
                    }`}>
                      {weatherData.impact === 'positive' ? '✅ Optimal conditions for egg production' :
                       weatherData.impact === 'negative' ? '⚠️ Weather may affect production' :
                       '➖ Normal weather conditions'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Production Forecast */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  7-Day Production Forecast
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                  {aiPredictions.productionForecast.map((day, index) => (
                    <div key={index} className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                      <div className="text-sm font-medium text-gray-600 mb-2">
                        {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                      </div>
                      <div className="text-2xl font-bold text-purple-600 mb-1">
                        {day.predicted}
                      </div>
                      <div className="text-xs text-gray-500">
                        {day.confidence}% confidence
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Recommendations */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recommendations */}
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    AI Recommendations
                  </h3>
                  <div className="space-y-3">
                    {aiPredictions.recommendations.map((rec, index) => (
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

                {/* Production Efficiency */}
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Production Efficiency
                  </h3>
                  <div className="text-center mb-4">
                    <div className="text-4xl font-bold text-indigo-600 mb-2">
                      {productionEfficiency.score}%
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-1000"
                        style={{ width: `${productionEfficiency.score}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {productionEfficiency.optimizations.map((opt, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-sm text-gray-800">{opt.title}</div>
                          <div className="text-xs text-gray-600">{opt.description}</div>
                        </div>
                        <div className="text-right">
                          <div className={`text-xs px-2 py-1 rounded ${
                            opt.impact === 'High' ? 'bg-red-100 text-red-800' :
                            opt.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {opt.impact}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Risk Factors */}
              {aiPredictions.riskFactors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    Risk Factors Detected
                  </h3>
                  <div className="space-y-3">
                    {aiPredictions.riskFactors.map((risk, index) => (
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

          {/* Action Buttons and Filter */}
          <div className="flex gap-4 mb-8 items-center">
            <Button 
              onClick={handleCreate}
              variant="primary"
              size="lg"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              }
            >
              ADD NEW RECORD
            </Button>
            
<<<<<<< HEAD
            {/* Removed Generate Report link */}
=======
            <Link to="/reports" state={{ from: 'egg-production' }}>
              <Button 
                variant="secondary"
                size="lg"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                }
              >
                GENERATE REPORT
              </Button>
            </Link>
>>>>>>> 29f384aae82d1760c7f378f3db37cf8074b26258
            
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
          {loading ? (
            <TableSkeleton rows={5} columns={5} />
          ) : (
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
                    {filteredRecords.length === 0 ? (
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
          )}

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
                    <div className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm bg-gray-50 text-gray-700">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{formData.batchNumber}</span>
                        <span className="text-xs text-gray-500 bg-blue-100 px-2 py-1 rounded-full">
                          Cannot be changed
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Batch numbers cannot be modified after record creation to maintain data integrity
                      </p>
                    </div>
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
                  <Button
                    type="button"
                    onClick={() => setShowModal(false)}
                    variant="secondary"
                    size="md"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                  >
                    {editingRecord ? 'Update' : 'Create'}
                  </Button>
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
                <Button
                  onClick={() => {
                    setShowDetailsModal(false);
                    handleEdit(detailsRecord);
                  }}
                  variant="primary"
                  size="md"
                >
                  Edit Record
                </Button>
                <Button
                  onClick={() => setShowDetailsModal(false)}
                  variant="secondary"
                  size="md"
                >
                  Close
                </Button>
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
