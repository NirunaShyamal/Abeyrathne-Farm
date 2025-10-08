import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const EggProductionSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  // Check if screen is mobile size
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const menuItems = [
    {
      id: 'egg-production',
      label: 'Egg Production Management',
      path: '/egg-production',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ),
    },
    {
      id: 'sales-order',
      label: 'Sales and Order Management',
      path: '/sales-order',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
    },
    {
      id: 'feed-inventory',
      label: 'Feed & Inventory Management',
      path: '/feed-inventory',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      id: 'task-scheduling',
      label: 'Task Scheduling',
      path: '/task-scheduling',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: 'financial-management',
      label: 'Financial Management',
      path: '/financial-management',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
    },
    // Only show User Management for admin users
    ...(user?.role === 'admin' ? [{
      id: 'user-management',
      label: 'User Management',
      path: '/user-management',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
    }] : []),
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="fixed top-4 left-4 z-50 p-2 bg-orange-600 text-white rounded-lg shadow-lg md:hidden hover:bg-orange-700/80 hover:backdrop-blur-sm transition-all duration-300 ease-in-out hover:scale-105 hover:opacity-90"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      {/* Mobile Overlay */}
      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        ${isMobile && !isMobileMenuOpen ? '-translate-x-full' : 'translate-x-0'}
        ${isMobile ? 'fixed' : 'relative'}
        ${isCollapsed ? 'w-16' : 'w-64'}
        bg-gradient-to-b from-orange-600 via-orange-700 to-orange-800
        shadow-2xl transition-all duration-300 ease-in-out
        flex flex-col ${isMobile ? 'h-screen z-50' : 'min-h-screen'}
      `}>
      {/* Header */}
      <div className="p-4 border-b border-orange-500/30">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">Farm Dashboard</h2>
                <p className="text-orange-200 text-sm">Abeyrathne Enterprises</p>
              </div>
            </div>
          )}
          
          {/* Control Buttons - Right Side */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 hover:backdrop-blur-sm text-white transition-all duration-300 ease-in-out hover:scale-110 hover:opacity-90 hover:shadow-lg hover:shadow-white/20 hover:border hover:border-white/30"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isCollapsed ? "M13 5l7 7-7 7M5 5l7 7-7 7" : "M11 19l-7-7 7-7m8 14l-7-7 7-7"} />
              </svg>
            </button>

            {/* Mobile Close Button */}
            {isMobile && (
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 hover:backdrop-blur-sm text-white transition-all duration-300 ease-in-out hover:scale-110 hover:opacity-90 hover:shadow-lg hover:shadow-white/20 hover:border hover:border-white/30 md:hidden"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto min-h-0">
        {menuItems.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            className={`
              group flex items-center px-3 py-3 rounded-xl transition-all duration-300 ease-in-out
              ${isActive(item.path)
                ? 'bg-white/20 text-white shadow-lg border border-white/30'
                : 'text-orange-100 hover:text-white hover:bg-white/10 hover:backdrop-blur-sm hover:scale-[1.02] hover:shadow-lg hover:shadow-orange-500/20 hover:border hover:border-white/20'
              }
              ${isCollapsed ? 'justify-center' : ''}
            `}
          >
            <div className={`
              ${isActive(item.path) 
                ? 'text-white' 
                : 'text-orange-200 group-hover:text-white group-hover:opacity-90 group-hover:scale-110 group-hover:drop-shadow-lg'
              }
              transition-all duration-300 ease-in-out
            `}>
              {item.icon}
            </div>
            {!isCollapsed && (
              <span className="ml-3 font-medium text-sm group-hover:opacity-90 group-hover:translate-x-1 transition-all duration-300 ease-in-out">
                {item.label}
              </span>
            )}

            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div className="absolute left-16 ml-2 px-2 py-1 bg-gray-900/90 backdrop-blur-sm text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300 ease-in-out whitespace-nowrap z-50 shadow-lg">
                {item.label}
              </div>
            )}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-orange-500/30">
        {!isCollapsed && (
          <div className="text-center">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2 backdrop-blur-sm">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <p className="text-orange-200 text-xs font-medium">
              Farm Management
            </p>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default EggProductionSidebar;
