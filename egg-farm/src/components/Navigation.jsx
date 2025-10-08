import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/farm-logo.svg';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  // Search functionality
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Generate search suggestions based on common farm terms
    if (value.length > 1) {
      const suggestions = [
        'eggs', 'production', 'batch', 'sales', 'orders', 'customers',
        'feed', 'inventory', 'tasks', 'scheduling', 'financial', 'records',
        'chickens', 'hens', 'layers', 'poultry', 'farm', 'management'
      ].filter(term => 
        term.toLowerCase().includes(value.toLowerCase()) && 
        term.toLowerCase() !== value.toLowerCase()
      ).slice(0, 5);
      
      setSearchSuggestions(suggestions);
      setShowSuggestions(true);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
    if (searchSuggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleSearchBlur = () => {
    setIsSearchFocused(false);
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    navigate(`/search?q=${encodeURIComponent(suggestion)}`);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Company Name */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center group">
                <div className="w-16 h-10 bg-gradient-to-r from-orange-400 to-orange-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                  <img src={logo} alt="Abeyrathne Enterprises Logo" className="w-14 h-8" />
                </div>
                <div className="ml-3 hidden sm:block">
                  <h1 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                    Abeyrathne Enterprises
                  </h1>
                  <p className="text-xs text-gray-500">Farm Management System</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-lg mx-4 lg:mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search farm data..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm transition-all duration-200 bg-gray-50 focus:bg-white ${
                    isSearchFocused 
                      ? 'border-orange-500 ring-2 ring-orange-500 ring-opacity-20' 
                      : 'border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                  }`}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                {searchQuery && (
                  <button
                    type="submit"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-orange-500 hover:text-orange-700 transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                )}
                
                {/* Search Suggestions Dropdown */}
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                    {searchSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition-colors"
                      >
                        <div className="flex items-center">
                          <svg className="h-4 w-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          {suggestion}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Navigation and Auth Buttons */}
          <div className="flex items-center space-x-3">
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-1">
              <Link 
                to="/about" 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === '/about' 
                    ? 'bg-orange-100 text-orange-700' 
                    : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                }`}
              >
                About
              </Link>
              {isAuthenticated && user?.role === 'admin' && (
                <Link 
                  to="/user-management" 
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    location.pathname === '/user-management' 
                      ? 'bg-orange-100 text-orange-700' 
                      : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                  }`}
                >
                  Admin
                </Link>
              )}
            </nav>
            
            {/* User Section */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {/* User Info - Hidden on small screens */}
                <div className="hidden sm:flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
                    <img src={logo} alt="Farm Logo" className="w-6 h-4" />
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">{user?.fullName || 'User'}</div>
                    <div className="text-gray-500 capitalize">{user?.role}</div>
                  </div>
                </div>
                
                {/* Logout Button */}
                <button
                  onClick={logout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <span className="hidden sm:inline">Logout</span>
                  <svg className="w-4 h-4 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link 
                  to="/signin" 
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <span className="hidden sm:inline">Sign In</span>
                  <span className="sm:hidden">Login</span>
                </Link>
                <Link 
                  to="/register" 
                  className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <span className="hidden sm:inline">Register</span>
                  <span className="sm:hidden">Sign Up</span>
                </Link>
              </div>
            )}
            
            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg text-gray-600 hover:text-orange-600 hover:bg-orange-50 transition-colors"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            {/* Mobile Search Bar */}
            <div className="p-4 border-b border-gray-100">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search farm data..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm transition-all duration-200 bg-gray-50 focus:bg-white ${
                    isSearchFocused 
                      ? 'border-orange-500 ring-2 ring-orange-500 ring-opacity-20' 
                      : 'border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                  }`}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                {searchQuery && (
                  <button
                    type="submit"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-orange-500 hover:text-orange-700 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                )}
                
                {/* Mobile Search Suggestions Dropdown */}
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                    {searchSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => {
                          handleSuggestionClick(suggestion);
                          setIsMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition-colors"
                      >
                        <div className="flex items-center">
                          <svg className="h-4 w-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          {suggestion}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </form>
            </div>
            
            {/* Mobile Navigation Links */}
            <div className="p-4 space-y-2">
              <Link 
                to="/about" 
                className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === '/about' 
                    ? 'bg-orange-100 text-orange-700' 
                    : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                About Us
              </Link>
              {isAuthenticated && user?.role === 'admin' && (
                <Link 
                  to="/user-management" 
                  className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    location.pathname === '/user-management' 
                      ? 'bg-orange-100 text-orange-700' 
                      : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  User Management
                </Link>
              )}
            </div>
            
            {/* Mobile Auth Section */}
            {!isAuthenticated && (
              <div className="p-4 border-t border-gray-100 space-y-3">
                <Link 
                  to="/signin" 
                  className="block w-full text-center py-3 px-4 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="block w-full text-center py-3 px-4 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
            
            {/* Mobile User Info */}
            {isAuthenticated && (
              <div className="p-4 border-t border-gray-100">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-600 rounded-xl flex items-center justify-center">
                    <img src={logo} alt="Farm Logo" className="w-8 h-5" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{user?.fullName || 'User'}</div>
                    <div className="text-sm text-gray-500 capitalize">{user?.role}</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-center py-3 px-4 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-all duration-200"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navigation;