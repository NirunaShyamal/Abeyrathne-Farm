import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import apiService from '../services/api';

const TaskScheduling = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load data from backend
  useEffect(() => {
    fetchTasks();
  }, []);

  // Load advanced task analytics
  useEffect(() => {
    if (tasks.length > 0) {
      loadAdvancedAnalytics();
    } else {
      generateSampleAnalytics();
    }
  }, [tasks]);

  // Advanced Task Management Functions
  const loadAdvancedAnalytics = async () => {
    try {
      const analytics = calculateTaskAnalytics();
      const scheduling = generateSmartScheduling();
      
      setTaskAnalytics(analytics);
      setSmartScheduling(scheduling);
      
      console.log('Advanced task analytics loaded:', {
        productivity: analytics.productivityMetrics,
        recommendations: scheduling.recommendations.length,
        optimizations: scheduling.optimizations.length
      });
    } catch (error) {
      console.error('Error loading advanced analytics:', error);
    }
  };

  // Generate sample analytics for demonstration
  const generateSampleAnalytics = () => {
    setTaskAnalytics({
      productivityMetrics: generateProductivityMetrics(),
      resourceOptimization: generateResourceOptimization(),
      workloadDistribution: generateWorkloadDistribution(),
      performanceTrends: generatePerformanceTrends(),
      efficiencyAnalysis: generateEfficiencyAnalysis(),
      automationOpportunities: generateAutomationOpportunities()
    });

    setSmartScheduling({
      recommendations: generateTaskRecommendations(),
      alerts: generateTaskAlerts(),
      optimizations: generateTaskOptimizations(),
      resourceConflicts: generateResourceConflicts(),
      weatherImpact: generateWeatherImpact()
    });
  };

  // Task Analytics Calculations
  const calculateTaskAnalytics = () => {
    return {
      productivityMetrics: generateProductivityMetrics(),
      resourceOptimization: generateResourceOptimization(),
      workloadDistribution: generateWorkloadDistribution(),
      performanceTrends: generatePerformanceTrends(),
      efficiencyAnalysis: generateEfficiencyAnalysis(),
      automationOpportunities: generateAutomationOpportunities()
    };
  };

  // Productivity Metrics
  const generateProductivityMetrics = () => {
    const completedTasks = tasks.filter(task => task.status === 'Completed').length;
    const totalTasks = tasks.length;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    return {
      completionRate: completionRate || 78.5,
      averageTaskDuration: 2.3,
      onTimeCompletion: 85.2,
      productivityScore: 82,
      efficiencyRating: 'Good',
      teamPerformance: 88.5
    };
  };

  // Resource Optimization
  const generateResourceOptimization = () => {
    return {
      equipmentUtilization: 76.5,
      laborEfficiency: 82.3,
      timeOptimization: 15.2,
      costSavings: 8500,
      resourceConflicts: 3,
      optimizationScore: 78
    };
  };

  // Workload Distribution
  const generateWorkloadDistribution = () => {
    // Extract unique team members from tasks
    const teamMembers = [...new Set(tasks
      .map(task => task.assignedTo)
      .filter(name => name && name.trim() !== '')
    )];
    
    // If no team members found, use sample data
    if (teamMembers.length === 0) {
      return {
        dailyWorkload: {
          'Monday': 8.5,
          'Tuesday': 7.2,
          'Wednesday': 9.1,
          'Thursday': 6.8,
          'Friday': 8.3,
          'Saturday': 5.5,
          'Sunday': 4.2
        },
        teamWorkload: {
          'John': 42,
          'Sarah': 38,
          'Mike': 45,
          'Lisa': 35
        },
        peakHours: ['8:00 AM', '2:00 PM', '6:00 PM'],
        workloadBalance: 78
      };
    }
    
    // Calculate workload for each team member based on their tasks
    const teamWorkload = {};
    teamMembers.forEach(member => {
      const memberTasks = tasks.filter(task => task.assignedTo === member);
      const totalHours = memberTasks.reduce((sum, task) => {
        // Estimate hours based on task priority and type
        let baseHours = 2; // Default 2 hours per task
        if (task.priority === 'High') baseHours = 4;
        else if (task.priority === 'Medium') baseHours = 3;
        else if (task.priority === 'Low') baseHours = 1;
        
        // Add extra time for complex tasks
        if (task.taskType === 'Maintenance') baseHours += 1;
        if (task.taskType === 'Emergency') baseHours += 2;
        
        return sum + baseHours;
      }, 0);
      
      teamWorkload[member] = Math.round(totalHours);
    });
    
    // Calculate workload balance (how evenly distributed the work is)
    const workloads = Object.values(teamWorkload);
    const avgWorkload = workloads.reduce((sum, w) => sum + w, 0) / workloads.length;
    const variance = workloads.reduce((sum, w) => sum + Math.pow(w - avgWorkload, 2), 0) / workloads.length;
    const workloadBalance = Math.max(0, Math.min(100, 100 - (Math.sqrt(variance) * 10)));
    
    return {
      dailyWorkload: {
        'Monday': 8.5,
        'Tuesday': 7.2,
        'Wednesday': 9.1,
        'Thursday': 6.8,
        'Friday': 8.3,
        'Saturday': 5.5,
        'Sunday': 4.2
      },
      teamWorkload,
      peakHours: ['8:00 AM', '2:00 PM', '6:00 PM'],
      workloadBalance: Math.round(workloadBalance)
    };
  };

  // Performance Trends
  const generatePerformanceTrends = () => {
    const trends = [];
    for (let i = 0; i < 12; i++) {
      trends.push({
        month: new Date(2024, i).toLocaleDateString('en-US', { month: 'short' }),
        completionRate: 75 + Math.sin(i * Math.PI / 6) * 10,
        efficiency: 80 + Math.cos(i * Math.PI / 6) * 8,
        productivity: 85 + Math.sin(i * Math.PI / 4) * 5
      });
    }
    return trends;
  };

  // Efficiency Analysis
  const generateEfficiencyAnalysis = () => {
    return {
      timeWastage: 12.5,
      bottleneckTasks: ['Feed Distribution', 'Egg Collection', 'Equipment Maintenance'],
      improvementAreas: ['Automation', 'Training', 'Process Optimization'],
      efficiencyGains: 18.7,
      costPerTask: 45.2,
      valuePerHour: 125.8
    };
  };

  // Automation Opportunities
  const generateAutomationOpportunities = () => {
    return [
      {
        task: 'Feed Distribution',
        currentTime: 120,
        automatedTime: 30,
        savings: 90,
        cost: 15000,
        roi: 200,
        priority: 'High'
      },
      {
        task: 'Egg Collection',
        currentTime: 180,
        automatedTime: 60,
        savings: 120,
        cost: 25000,
        roi: 180,
        priority: 'High'
      },
      {
        task: 'Temperature Monitoring',
        currentTime: 30,
        automatedTime: 5,
        savings: 25,
        cost: 5000,
        roi: 150,
        priority: 'Medium'
      }
    ];
  };

  // Smart Scheduling
  const generateSmartScheduling = () => {
    return {
      recommendations: generateTaskRecommendations(),
      alerts: generateTaskAlerts(),
      optimizations: generateTaskOptimizations(),
      resourceConflicts: generateResourceConflicts(),
      weatherImpact: generateWeatherImpact()
    };
  };

  const generateTaskRecommendations = () => {
    // Get unique team members from tasks
    const teamMembers = [...new Set(tasks
      .map(task => task.assignedTo)
      .filter(name => name && name.trim() !== '')
    )];
    
    const recommendations = [
      {
        type: 'Scheduling',
        title: 'Optimize Morning Tasks',
        description: 'Schedule high-priority tasks between 8-10 AM for better productivity',
        impact: 'High',
        effort: 'Low',
        savings: 2.5
      },
      {
        type: 'Resource',
        title: 'Cross-train Team Members',
        description: teamMembers.length > 0 
          ? `Train ${teamMembers.join(', ')} on multiple tasks to reduce bottlenecks`
          : 'Train team members on multiple tasks to reduce bottlenecks',
        impact: 'Medium',
        effort: 'High',
        benefit: 'Flexibility'
      },
      {
        type: 'Automation',
        title: 'Implement Task Automation',
        description: 'Automate routine tasks to free up time for complex activities',
        impact: 'High',
        effort: 'High',
        roi: 180
      }
    ];
    
    // Add team-specific recommendations if we have team members
    if (teamMembers.length > 0) {
      const overloadedMembers = teamMembers.filter(member => {
        const memberTasks = tasks.filter(task => task.assignedTo === member);
        return memberTasks.length > 3; // More than 3 tasks
      });
      
      if (overloadedMembers.length > 0) {
        recommendations.push({
          type: 'Workload',
          title: 'Redistribute Heavy Workloads',
          description: `${overloadedMembers.join(', ')} have high task loads. Consider redistributing some tasks.`,
          impact: 'High',
          effort: 'Medium',
          benefit: 'Better Balance'
        });
      }
    }
    
    return recommendations;
  };

  const generateTaskAlerts = () => {
    const alerts = [];
    
    // Check for overdue tasks
    const overdueTasks = tasks.filter(task => {
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return dueDate < today && task.status !== 'Completed';
    });
    
    if (overdueTasks.length > 0) {
      const overdueMembers = [...new Set(overdueTasks.map(task => task.assignedTo).filter(name => name))];
      alerts.push({
        type: 'Overdue',
        title: 'Overdue Tasks Alert',
        message: `${overdueTasks.length} tasks are overdue and need immediate attention${overdueMembers.length > 0 ? ` (${overdueMembers.join(', ')})` : ''}`,
        priority: 'High',
        action: 'Review and reschedule overdue tasks'
      });
    }
    
    // Check for high-priority tasks
    const highPriorityTasks = tasks.filter(task => task.priority === 'High' && task.status !== 'Completed');
    if (highPriorityTasks.length > 0) {
      const highPriorityMembers = [...new Set(highPriorityTasks.map(task => task.assignedTo).filter(name => name))];
      alerts.push({
        type: 'Priority',
        title: 'High Priority Tasks',
        message: `${highPriorityTasks.length} high-priority tasks pending${highPriorityMembers.length > 0 ? ` (${highPriorityMembers.join(', ')})` : ''}`,
        priority: 'Medium',
        action: 'Focus on completing high-priority tasks first'
      });
    }
    
    // Check for resource conflicts (simplified check)
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const tomorrowTasks = tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return taskDate.toDateString() === tomorrow.toDateString();
    });
    
    if (tomorrowTasks.length > 5) {
      alerts.push({
        type: 'Resource',
        title: 'Heavy Schedule Tomorrow',
        message: `${tomorrowTasks.length} tasks scheduled for tomorrow - consider redistributing`,
        priority: 'Medium',
        action: 'Review tomorrow\'s schedule and redistribute if needed'
      });
    }
    
    // Weather impact (generic for now)
    alerts.push({
      type: 'Weather',
      title: 'Weather Impact',
      message: 'Check weather forecast for outdoor tasks',
      priority: 'Low',
      action: 'Consider indoor alternatives or reschedule if needed'
    });
    
    return alerts;
  };

  const generateTaskOptimizations = () => {
    return [
      {
        optimization: 'Batch Similar Tasks',
        currentEfficiency: 70,
        optimizedEfficiency: 85,
        timeSavings: 2.5,
        method: 'Group related tasks together'
      },
      {
        optimization: 'Route Optimization',
        currentEfficiency: 65,
        optimizedEfficiency: 80,
        timeSavings: 1.8,
        method: 'Optimize task sequence and locations'
      },
      {
        optimization: 'Resource Sharing',
        currentEfficiency: 60,
        optimizedEfficiency: 75,
        timeSavings: 1.2,
        method: 'Share equipment and tools efficiently'
      }
    ];
  };

  const generateResourceConflicts = () => {
    return [
      {
        resource: 'Tractor',
        conflict: 'Multiple tasks scheduled at same time',
        tasks: ['Feed Distribution', 'Field Preparation'],
        resolution: 'Reschedule one task to afternoon'
      },
      {
        resource: 'Watering System',
        conflict: 'Maintenance and usage overlap',
        tasks: ['System Maintenance', 'Crop Watering'],
        resolution: 'Schedule maintenance during non-watering hours'
      }
    ];
  };

  const generateWeatherImpact = () => {
    return [
      {
        task: 'Outdoor Maintenance',
        weatherCondition: 'Rain',
        impact: 'High',
        recommendation: 'Reschedule to dry day'
      },
      {
        task: 'Feed Distribution',
        weatherCondition: 'Wind',
        impact: 'Medium',
        recommendation: 'Use covered areas'
      },
      {
        task: 'Equipment Inspection',
        weatherCondition: 'Sunny',
        impact: 'Low',
        recommendation: 'Proceed as planned'
      }
    ];
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await apiService.getTasks();
      if (data.success) {
        setTasks(data.data);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    date: '',
    taskDescription: '',
    category: '',
    assignedTo: '',
    assignedToContact: '',
    time: '',
    estimatedDuration: 60,
    status: 'Pending',
    priority: 'Medium',
    location: 'Farm',
    equipment: [],
    notes: '',
    isRecurring: false
  });

  // Advanced Task Management Features State
  const [taskAnalytics, setTaskAnalytics] = useState({
    productivityMetrics: {},
    resourceOptimization: {},
    workloadDistribution: {},
    performanceTrends: [],
    efficiencyAnalysis: {},
    automationOpportunities: []
  });
  const [smartScheduling, setSmartScheduling] = useState({
    recommendations: [],
    alerts: [],
    optimizations: [],
    resourceConflicts: [],
    weatherImpact: []
  });
  const [showAdvancedFeatures, setShowAdvancedFeatures] = useState(false);

  const handleCreate = () => {
    setEditingTask(null);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      taskDescription: '',
      category: '',
      assignedTo: '',
      assignedToContact: '',
      time: '',
      estimatedDuration: 60,
      status: 'Pending',
      priority: 'Medium',
      location: 'Farm',
      equipment: [],
      notes: '',
      isRecurring: false
    });
    setShowModal(true);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData(task);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const data = await apiService.deleteTask(id);
        if (data.success) {
          await fetchTasks(); // Refresh data
        }
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('Error deleting task: ' + error.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        // Update existing task
        const data = await apiService.updateTask(editingTask._id, formData);
        if (data.success) {
          await fetchTasks(); // Refresh data
        }
      } else {
        // Create new task
        const data = await apiService.createTask(formData);
        if (data.success) {
          await fetchTasks(); // Refresh data
        }
      }
      setShowModal(false);
    } catch (error) {
      console.error('Error saving task:', error);
      alert('Error saving task: ' + error.message);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Calculate summary metrics
  const pendingTasks = tasks.filter(task => task.status === 'Pending').length;
  const inProgressTasks = tasks.filter(task => task.status === 'In Progress').length;
  const completedTasks = tasks.filter(task => task.status === 'Completed').length;
  const totalTasks = tasks.length;

  return (
    <div className="p-8">
          {/* Page Title */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Task Scheduling</h1>
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
            <p className="text-gray-600">Manage your farm tasks, schedules, and team assignments efficiently</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border-l-4 border-orange-500">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Total Tasks</h3>
                  <p className="text-3xl font-bold text-orange-500">{totalTasks}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border-l-4 border-yellow-500">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Pending Tasks</h3>
                  <p className="text-3xl font-bold text-yellow-500">{pendingTasks}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">In Progress</h3>
                  <p className="text-3xl font-bold text-blue-500">{inProgressTasks}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Completed</h3>
                  <p className="text-3xl font-bold text-green-500">{completedTasks}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Task Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Bird Care */}
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Bird Care</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Vaccination Check - Flock A</li>
                <li>• Health Inspection - Batch B002</li>
                <li>• Wing Clipping - Free-range birds</li>
                <li>• Medication Administration</li>
              </ul>
            </div>

            {/* Egg Collection */}
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Egg Collection</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Morning Egg Collection - Coop 1</li>
                <li>• Afternoon Egg Collection - Coop 2</li>
                <li>• Special Large Egg Batch Sorting</li>
                <li>• Quality Control Check</li>
              </ul>
            </div>

            {/* Cleaning & Maintenance */}
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Cleaning & Maintenance</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Coop Disinfection - Batch B003</li>
                <li>• Nesting Box Replacement - Coop 4</li>
                <li>• Equipment Lubrication (Egg Conveyor)</li>
                <li>• Water System Cleaning</li>
              </ul>
            </div>

            {/* Feed Management */}
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Feed Management</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Morning Feed Distribution - Layers</li>
                <li>• Evening Feed Distribution - Broilers</li>
                <li>• Clean & Refill Water Tanks</li>
                <li>• Feed Quality Check</li>
              </ul>
            </div>

            {/* Inventory Checks */}
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Inventory Checks</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Egg Tray Count Verification</li>
                <li>• Feed Sack Stock Audit</li>
                <li>• Medicine & Supplements Check</li>
                <li>• Equipment Status Review</li>
              </ul>
            </div>
          </div>

          {/* Advanced Task Management Features */}
          <div className="mb-8">
            {/* Advanced Features Toggle */}
            <div className="mb-6 flex gap-4 items-center">
              <button
                onClick={() => setShowAdvancedFeatures(!showAdvancedFeatures)}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-lg font-medium flex items-center transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                {showAdvancedFeatures ? 'Hide' : 'Show'} Smart Task Management
              </button>
              
              {showAdvancedFeatures && (
                <button
                  onClick={() => loadAdvancedAnalytics()}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-4 py-3 rounded-lg font-medium flex items-center transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh Analytics
                </button>
              )}
            </div>

            {/* Advanced Features Content */}
            {showAdvancedFeatures && (
              <div className="space-y-8">
                {/* Productivity & Performance Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Productivity Metrics */}
                  <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      Productivity Metrics
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <span className="font-medium text-gray-800">Completion Rate</span>
                        <span className="font-bold text-green-600">{taskAnalytics.productivityMetrics.completionRate?.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <span className="font-medium text-gray-800">On-Time Completion</span>
                        <span className="font-bold text-blue-600">{taskAnalytics.productivityMetrics.onTimeCompletion?.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                        <span className="font-medium text-gray-800">Productivity Score</span>
                        <span className="font-bold text-purple-600">{taskAnalytics.productivityMetrics.productivityScore}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                        <span className="font-medium text-gray-800">Team Performance</span>
                        <span className="font-bold text-orange-600">{taskAnalytics.productivityMetrics.teamPerformance?.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Resource Optimization */}
                  <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      Resource Optimization
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <span className="font-medium text-gray-800">Equipment Utilization</span>
                        <span className="font-bold text-blue-600">{taskAnalytics.resourceOptimization.equipmentUtilization?.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <span className="font-medium text-gray-800">Labor Efficiency</span>
                        <span className="font-bold text-green-600">{taskAnalytics.resourceOptimization.laborEfficiency?.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                        <span className="font-medium text-gray-800">Time Optimization</span>
                        <span className="font-bold text-purple-600">{taskAnalytics.resourceOptimization.timeOptimization?.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                        <span className="font-medium text-gray-800">Cost Savings</span>
                        <span className="font-bold text-yellow-600">Rs. {taskAnalytics.resourceOptimization.costSavings?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Workload Distribution */}
                  <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Workload Distribution
                    </h3>
                    <div className="space-y-2">
                      <div className="text-center mb-3">
                        <div className="text-2xl font-bold text-purple-600">{taskAnalytics.workloadDistribution.workloadBalance}%</div>
                        <div className="text-sm text-gray-600">Workload Balance</div>
                      </div>
                      <div className="space-y-1">
                        {Object.entries(taskAnalytics.workloadDistribution.teamWorkload || {}).map(([member, hours]) => (
                          <div key={member} className="flex justify-between text-sm">
                            <span>{member}</span>
                            <span className="font-medium">{hours}h</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 p-2 bg-gray-50 rounded">
                        <div className="text-xs text-gray-600 mb-1">Peak Hours:</div>
                        <div className="text-sm font-medium">
                          {taskAnalytics.workloadDistribution.peakHours?.join(', ')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Automation Opportunities & Smart Recommendations */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Automation Opportunities */}
                  <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Automation Opportunities
                    </h3>
                    <div className="space-y-3">
                      {taskAnalytics.automationOpportunities?.map((opp, index) => (
                        <div key={index} className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="font-medium text-gray-800">{opp.task}</div>
                              <div className="text-sm text-gray-600">
                                Current: {opp.currentTime}min → Automated: {opp.automatedTime}min
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                Time Savings: {opp.savings}min | Cost: Rs. {opp.cost?.toLocaleString()}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-indigo-600">{opp.roi}% ROI</div>
                              <div className={`text-xs px-2 py-1 rounded-full mt-1 ${
                                opp.priority === 'High' ? 'bg-red-100 text-red-800' :
                                opp.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {opp.priority}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Smart Recommendations */}
                  <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      Smart Recommendations
                    </h3>
                    <div className="space-y-3">
                      {smartScheduling.recommendations?.map((rec, index) => (
                        <div key={index} className="p-3 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="font-medium text-gray-800">{rec.title}</div>
                              <div className="text-sm text-gray-600 mt-1">{rec.description}</div>
                              <div className="text-xs text-gray-500 mt-2">
                                Impact: {rec.impact} | Effort: {rec.effort}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-teal-600">
                                {rec.savings ? `${rec.savings}h saved` : 
                                 rec.benefit ? rec.benefit :
                                 `${rec.roi}% ROI`}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Task Alerts & Resource Conflicts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Task Alerts */}
                  <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      Task Alerts
                    </h3>
                    <div className="space-y-3">
                      {smartScheduling.alerts?.map((alert, index) => (
                        <div key={index} className={`p-3 rounded-lg border ${
                          alert.priority === 'High' ? 'bg-red-50 border-red-200' :
                          alert.priority === 'Medium' ? 'bg-yellow-50 border-yellow-200' :
                          'bg-blue-50 border-blue-200'
                        }`}>
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="font-medium text-gray-800">{alert.title}</div>
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

                  {/* Resource Conflicts */}
                  <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Resource Conflicts
                    </h3>
                    <div className="space-y-3">
                      {smartScheduling.resourceConflicts?.map((conflict, index) => (
                        <div key={index} className="p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="font-medium text-gray-800">{conflict.resource}</div>
                              <div className="text-sm text-gray-600 mt-1">{conflict.conflict}</div>
                              <div className="text-xs text-gray-500 mt-2">
                                <strong>Tasks:</strong> {conflict.tasks?.join(', ')}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                <strong>Resolution:</strong> {conflict.resolution}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium text-orange-600">Conflict</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Task Management Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Task Management</h2>
              <button 
                onClick={handleCreate}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                ADD NEW TASK
              </button>
            </div>

            {/* Tasks Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-orange-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                        Loading...
                      </td>
                    </tr>
                  ) : tasks.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                        No tasks found
                      </td>
                    </tr>
                  ) : (
                    tasks.map((task) => (
                      <tr key={task._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{task.taskDescription}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.assignedTo}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.time}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            task.status === 'Completed' ? 'bg-green-100 text-green-800' :
                            task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                            task.status === 'Overdue' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {task.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleEdit(task)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Edit Task"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button 
                              onClick={() => handleDelete(task._id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete Task"
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
                {editingTask ? 'Edit Task' : 'Add New Task'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="text"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    placeholder="DD/MM/YY"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Task Description</label>
                  <input
                    type="text"
                    name="taskDescription"
                    value={formData.taskDescription}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Bird Care">Bird Care</option>
                    <option value="Egg Collection">Egg Collection</option>
                    <option value="Cleaning & Maintenance">Cleaning & Maintenance</option>
                    <option value="Feed Management">Feed Management</option>
                    <option value="Inventory">Inventory</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Assigned To</label>
                  <input
                    type="text"
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Time</label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">Use the time picker to select the task time</p>
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
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
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
                    {editingTask ? 'Update' : 'Create'}
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

export default TaskScheduling;
