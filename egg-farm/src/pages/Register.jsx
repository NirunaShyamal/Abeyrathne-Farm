import { Link } from 'react-router-dom';
import { useState } from 'react';
import logo from '../assets/farm-logo.svg';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    farmName: '',
    farmLocation: '',
    agreeToTerms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Register:', formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Farm-themed Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Rolling Hills */}
        <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-green-800/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-emerald-700/20 to-transparent"></div>
        
        {/* Floating Farm Elements */}
        <div className="absolute top-20 left-10 w-16 h-16 bg-green-500/20 rounded-full animate-float"></div>
        <div className="absolute top-32 right-20 w-12 h-12 bg-emerald-500/20 rounded-full animate-float animation-delay-2000"></div>
        <div className="absolute bottom-40 left-1/4 w-8 h-8 bg-teal-500/20 rounded-full animate-float animation-delay-4000"></div>
        
        {/* Sun */}
        <div className="absolute top-10 right-10 w-20 h-20 bg-gradient-to-r from-yellow-300 to-orange-300 rounded-full opacity-60 animate-pulse"></div>
        
        {/* Clouds */}
        <div className="absolute top-16 left-1/4 w-24 h-12 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute top-24 right-1/3 w-20 h-10 bg-white/10 rounded-full animate-pulse animation-delay-2000"></div>
      </div>

      {/* Farm Icons Floating */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute text-green-400/20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${4 + Math.random() * 2}s`
            }}
          >
            {i % 7 === 0 && <span className="text-2xl">🌱</span>}
            {i % 7 === 1 && <span className="text-2xl">🐔</span>}
            {i % 7 === 2 && <span className="text-2xl">🥚</span>}
            {i % 7 === 3 && <span className="text-2xl">🌾</span>}
            {i % 7 === 4 && <span className="text-2xl">🚜</span>}
            {i % 7 === 5 && <span className="text-2xl">🌿</span>}
            {i % 7 === 6 && <span className="text-2xl">🐄</span>}
          </div>
        ))}
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Logo and Company Name */}
        <div className="flex justify-center items-center mb-8">
          <div className="flex-shrink-0">
            <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300">
              <img src={logo} alt="Abeyrathne Enterprises Logo" className="w-12 h-12" />
            </div>
          </div>
          <div className="ml-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-green-100 to-emerald-200 bg-clip-text text-transparent">Abeyrathne Enterprises</h1>
            <p className="text-green-300 text-sm">Farm Management System</p>
          </div>
        </div>
        
        <h2 className="text-center text-5xl font-bold bg-gradient-to-r from-white via-green-100 to-emerald-200 bg-clip-text text-transparent mb-2">
          Join Our Farm
        </h2>
        <p className="text-center text-xl text-green-200 font-medium mb-2">
          Create your farm management account
        </p>
        <p className="text-center text-green-300 mb-8">
          Start managing your farm operations today
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-4xl relative z-10">
        <div className="bg-white/15 backdrop-blur-lg py-8 px-4 shadow-2xl sm:rounded-3xl sm:px-10 border border-white/20">
          <form className="space-y-8" onSubmit={handleSubmit}>
            {/* Personal Information Section */}
            <div className="border-b border-white/20 pb-8">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <div className="w-8 h-8 bg-green-500/30 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                Personal Information
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-white mb-2">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-4 border border-white/30 rounded-xl bg-white/10 text-white placeholder-green-300 focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300 text-lg"
                    placeholder="Enter your first name"
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-white mb-2">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-4 border border-white/30 rounded-xl bg-white/10 text-white placeholder-green-300 focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300 text-lg"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-4 border border-white/30 rounded-xl bg-white/10 text-white placeholder-green-300 focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300 text-lg"
                    placeholder="Enter your email"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="phone" className="block text-sm font-medium text-white mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-4 border border-white/30 rounded-xl bg-white/10 text-white placeholder-green-300 focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300 text-lg"
                    placeholder="Enter your phone number"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Farm Information Section */}
            <div className="border-b border-white/20 pb-8">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <div className="w-8 h-8 bg-emerald-500/30 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                Farm Information
              </h3>
              
              <div className="mt-6">
                <label htmlFor="farmName" className="block text-sm font-medium text-white mb-2">
                  Farm Name
                </label>
                <input
                  id="farmName"
                  name="farmName"
                  type="text"
                  required
                  value={formData.farmName}
                  onChange={handleChange}
                  className="w-full px-4 py-4 border border-white/30 rounded-xl bg-white/10 text-white placeholder-green-300 focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300 text-lg"
                  placeholder="Enter your farm name"
                />
              </div>

              <div className="mt-6">
                <label htmlFor="farmLocation" className="block text-sm font-medium text-white mb-2">
                  Farm Location
                </label>
                <div className="relative">
                  <input
                    id="farmLocation"
                    name="farmLocation"
                    type="text"
                    required
                    value={formData.farmLocation}
                    onChange={handleChange}
                    className="w-full px-4 py-4 border border-white/30 rounded-xl bg-white/10 text-white placeholder-green-300 focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300 text-lg"
                    placeholder="Enter your farm location"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Section */}
            <div className="pb-8">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <div className="w-8 h-8 bg-teal-500/30 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-teal-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                Security
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-4 border border-white/30 rounded-xl bg-white/10 text-white placeholder-green-300 focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300 text-lg"
                      placeholder="Create a password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <svg className="h-5 w-5 text-green-300 hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-green-300 hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-4 border border-white/30 rounded-xl bg-white/10 text-white placeholder-green-300 focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300 text-lg"
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <svg className="h-5 w-5 text-green-300 hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-green-300 hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="agreeToTerms"
                  name="agreeToTerms"
                  type="checkbox"
                  required
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-white/30 rounded bg-white/10"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="agreeToTerms" className="text-white">
                  I agree to the{' '}
                  <Link to="/terms" className="text-green-300 hover:text-green-200 transition-colors">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-green-300 hover:text-green-200 transition-colors">
                    Privacy Policy
                  </Link>
                </label>
              </div>
            </div>

            {/* Register Button */}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-lg font-medium text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
              >
                <span className="flex items-center">
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Create Farm Account
                </span>
              </button>
            </div>
          </form>

          {/* Sign In Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-green-300">
              Already have an account?{' '}
              <Link to="/signin" className="font-medium text-green-200 hover:text-white transition-colors">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center relative z-10">
        <p className="text-sm text-green-300">
          © 2024 Abeyrathne Enterprises. All rights reserved.
        </p>
        <p className="text-sm text-green-400 mt-1">
          No,222,Glahitiyawa,Kuliyapitiya
        </p>
      </div>
    </div>
  );
};

export default Register;