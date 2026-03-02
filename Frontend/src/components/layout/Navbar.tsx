import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Brain, Bell, User, LogOut, Settings, Moon, Sun } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { logout } from '../../features/auth/authSlice';
import { toggleTheme } from '../../features/ui/uiSlice';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { theme } = useAppSelector((state) => state.ui);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/80 dark:bg-secondary-900/80 backdrop-blur-lg shadow-soft' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Brain className="w-8 h-8 text-primary-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
              ML Visual Lab
            </span>
          </Link>

          {/* Desktop Navigation */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/dashboard" className="text-secondary-600 dark:text-secondary-300 hover:text-primary-600 transition-colors">
                Dashboard
              </Link>
              <Link to="/simulator" className="text-secondary-600 dark:text-secondary-300 hover:text-primary-600 transition-colors">
                Simulator
              </Link>
              <Link to="/practice" className="text-secondary-600 dark:text-secondary-300 hover:text-primary-600 transition-colors">
                Practice
              </Link>
              <Link to="/leaderboard" className="text-secondary-600 dark:text-secondary-300 hover:text-primary-600 transition-colors">
                Leaderboard
              </Link>
            </div>
          )}

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => dispatch(toggleTheme())}
              className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {isAuthenticated ? (
              <>
                <button className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-accent-500 rounded-full"></span>
                </button>

                <div className="relative">
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center space-x-2 p-1 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
                  >
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.firstName} className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                        <span className="text-primary-600 dark:text-primary-300 font-medium">
                          {user?.firstName?.[0]}{user?.lastName?.[0]}
                        </span>
                      </div>
                    )}
                  </button>

                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-secondary-800 rounded-xl shadow-hard border border-secondary-200 dark:border-secondary-700 overflow-hidden"
                    >
                      <Link
                        to="/profile"
                        className="flex items-center space-x-2 px-4 py-3 hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center space-x-2 px-4 py-3 hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2 px-4 py-3 hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors text-error"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-secondary-600 dark:text-secondary-300 hover:text-primary-600 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && isAuthenticated && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white dark:bg-secondary-800 border-t border-secondary-200 dark:border-secondary-700"
        >
          <div className="px-4 py-4 space-y-2">
            <Link to="/dashboard" className="block px-4 py-3 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors">
              Dashboard
            </Link>
            <Link to="/simulator" className="block px-4 py-3 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors">
              Simulator
            </Link>
            <Link to="/practice" className="block px-4 py-3 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors">
              Practice
            </Link>
            <Link to="/leaderboard" className="block px-4 py-3 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors">
              Leaderboard
            </Link>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;