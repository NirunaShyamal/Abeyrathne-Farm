import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import ConnectionTest from '../components/ConnectionTest';
import { MetricCard, StatsCard } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { MetricCardSkeleton, CardSkeleton } from '../components/ui/Loading';

const Home = () => {
  const { user } = useAuth();
  
  // Function to get time-based greeting for Sri Lankan time
  const getTimeBasedGreeting = () => {
    // Sri Lanka is UTC+5:30
    const now = new Date();
    const sriLankaTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
    const hour = sriLankaTime.getHours();
    
    if (hour >= 5 && hour < 12) {
      return "Good Morning!";
    } else if (hour >= 12 && hour < 17) {
      return "Good Afternoon!";
    } else if (hour >= 17 && hour < 21) {
      return "Good Evening!";
    } else {
      return "Good Night!";
    }
  };

  // State for current greeting
  const [currentGreeting, setCurrentGreeting] = useState(getTimeBasedGreeting());
  
  const [metrics, setMetrics] = useState({
    totalBirds: 0,
    mortalityRate: 0,
    totalEggs: 0,
    totalEmployees: 0,
    loading: true
  });

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    fetchMetrics();
    
    // Update greeting every minute
    const updateGreeting = () => {
      setCurrentGreeting(getTimeBasedGreeting());
    };
    
    // Update immediately
    updateGreeting();
    
    // Set up interval to update every minute
    const interval = setInterval(updateGreeting, 60000); // 60 seconds
    
    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const fetchMetrics = async () => {
    try {
      setMetrics(prev => ({ ...prev, loading: true }));
      
      // Fetch egg production summary
      const eggSummary = await apiService.getEggProductionSummary();
      
      // Fetch sales summary
      const salesSummary = await apiService.getSalesSummary();
      
      // Fetch feed inventory summary
      const feedSummary = await apiService.getFeedInventorySummary();

      // Calculate metrics from the data
      const totalBirds = eggSummary.data?.totalRecords > 0 ? 
        eggSummary.data.totalRecords * 100 : 0; // Assuming 100 birds per record for demo
      
      const totalEggs = eggSummary.data?.totalEggs || 0;
      const totalDamagedEggs = eggSummary.data?.totalDamagedEggs || 0;
      const mortalityRate = totalBirds > 0 ? 
        ((totalDamagedEggs / totalBirds) * 100).toFixed(1) : 0;
      
      const totalEmployees = 25; // Fixed for now, can be made dynamic later

      setMetrics({
        totalBirds,
        mortalityRate: parseFloat(mortalityRate),
        totalEggs,
        totalEmployees,
        loading: false
      });
    } catch (error) {
      console.error('Error fetching metrics:', error);
      setMetrics({
        totalBirds: 0,
        mortalityRate: 0,
        totalEggs: 0,
        totalEmployees: 0,
        loading: false
      });
    }
  };

  // Sidebar menu items with icons
  const menuItems = [
    {
      title: 'Production',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      items: [
        { name: 'Egg Production', path: '/egg-production', icon: '🥚' },
        { name: 'Feed Management', path: '/feed-inventory', icon: '🌾' },
      ]
    },
    {
      title: 'Business',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      items: [
        { name: 'Sales & Orders', path: '/sales-order', icon: '📦' },
        { name: 'Financial Management', path: '/financial-management', icon: '💰' },
      ]
    },
    {
      title: 'Operations',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      items: [
        { name: 'Task Scheduling', path: '/task-scheduling', icon: '📅' },
        { name: 'User Management', path: '/user-management', icon: '👥', adminOnly: true },
      ]
    }
  ];

  // Progress bar component
  const ProgressBar = ({ value, max, color = 'blue', label }) => (
    <div className="w-full">
      <div className="flex justify-between text-sm text-gray-600 mb-1">
        <span>{label}</span>
        <span>{value}/{max}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-500 ${
            color === 'green' ? 'bg-gradient-to-r from-green-400 to-green-600' :
            color === 'red' ? 'bg-gradient-to-r from-red-400 to-red-600' :
            color === 'blue' ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
            'bg-gradient-to-r from-orange-400 to-orange-600'
          }`}
          style={{ width: `${Math.min((value / max) * 100, 100)}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="p-6 lg:p-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-600 rounded-xl flex items-center justify-center mr-4 mb-4 sm:mb-0">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
              {currentGreeting}
            </h1>
            <p className="text-lg sm:text-xl text-gray-600">
              Optimize your farm operations with real-time insights
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.loading ? (
          <>
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
          </>
        ) : (
          <>
            <MetricCard
              title="Total Birds"
              value={metrics.totalBirds.toLocaleString()}
              color="orange"
              icon={
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              }
              trend={{ direction: 'up', label: 'Healthy flock' }}
            />

            <MetricCard
              title="Mortality Rate"
              value={`${metrics.mortalityRate}%`}
              color="red"
              icon={
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              }
              trend={{ direction: 'down', label: 'Needs attention' }}
            />

            <MetricCard
              title="Total Eggs"
              value={metrics.totalEggs.toLocaleString()}
              color="green"
              icon={
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              }
              trend={{ direction: 'up', label: 'Excellent production' }}
            />

            <MetricCard
              title="Employees"
              value={metrics.totalEmployees}
              color="blue"
              icon={
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
              trend={{ direction: 'neutral', label: 'Active team' }}
            />
          </>
        )}
      </div>

      {/* Connection Test - Admin Only */}
      {user?.role === 'admin' && (
        <div className="mb-8">
          <ConnectionTest />
        </div>
      )}

      {/* Enhanced Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Enhanced Location Section */}
        <Card>
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Our Location</h2>
              <p className="text-gray-600">Visit our farm</p>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <p className="text-gray-700 font-medium">No. 222, Glahitiyawa, Kuliyapitiya</p>
            <p className="text-sm text-gray-500 mt-1">Sri Lanka</p>
          </div>
          
          <div className="rounded-xl h-64 overflow-hidden shadow-lg border-2 border-gray-200">
            <iframe
              src="https://maps.google.com/maps?q=F24W%2B3C+ABEYARATHNA+FARM,+Galahitiyawa&t=k&z=18&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Abeyarathna Farm Location"
            ></iframe>
          </div>
          
          <div className="mt-4 text-center">
            <Button
              as="a"
              href="https://maps.google.com/?q=F24W+3C+ABEYARATHNA+FARM,+Galahitiyawa&t=k"
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              }
            >
              Open in Google Maps
            </Button>
          </div>
        </Card>

        {/* Enhanced Stats Section with Charts */}
        <StatsCard
          title="Farm Statistics"
          subtitle="Real-time performance metrics"
          icon={
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
          stats={[
            {
              title: "Financial Health",
              subtitle: "Monthly revenue tracking",
              value: "85%",
              textColor: "text-orange-600",
              bgColor: "from-orange-50 to-orange-100",
              iconBg: "bg-orange-500",
              icon: (
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              ),
              progress: 85,
              progressColor: "bg-gradient-to-r from-orange-400 to-orange-600"
            },
            {
              title: "Sales Performance",
              subtitle: "Order fulfillment rate",
              value: "92%",
              textColor: "text-green-600",
              bgColor: "from-green-50 to-green-100",
              iconBg: "bg-green-500",
              icon: (
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              ),
              progress: 92,
              progressColor: "bg-gradient-to-r from-green-400 to-green-600"
            },
            {
              title: "Feed Inventory",
              subtitle: "Stock level monitoring",
              value: "68%",
              textColor: "text-blue-600",
              bgColor: "from-blue-50 to-blue-100",
              iconBg: "bg-blue-500",
              icon: (
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              ),
              progress: 68,
              progressColor: "bg-gradient-to-r from-blue-400 to-blue-600"
            }
          ]}
        >
          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            <Button
              as={Link}
              to="/financial-management"
              variant="primary"
              className="w-full justify-center"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              }
            >
              Finances
            </Button>
            <Button
              as={Link}
              to="/sales-order"
              variant="success"
              className="w-full justify-center"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              }
            >
              Sales
            </Button>
          </div>
        </StatsCard>
      </div>

      {/* Enhanced Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Copyright © 2024 Abeyrathne Enterprises. All Rights Reserved.</p>
            <div className="text-sm text-gray-500 space-y-1">
              <p>No. 222, Glahitiyawa, Kuliyapitiya, Sri Lanka</p>
              <p>Email: abeyrathne.enterprises@gmail.com</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;