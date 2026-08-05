import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Brain, Bell, User, LogOut, Settings } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { logout } from '../../features/auth/authSlice';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

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
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-midnight/90 border-b border-mountainside/80 backdrop-blur-xl shadow-soft'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="p-2 rounded-xl bg-mountainside border border-apres/40 text-arctic group-hover:border-slopes transition-colors">
              <Brain className="w-5 h-5 text-slopes" />
            </div>
            <span className="text-lg font-bold text-arctic tracking-tight group-hover:text-white transition-colors">
              ML Visual Lab
            </span>
          </Link>

          {/* Desktop Navigation */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/dashboard"
                className="text-sm font-medium text-slopes hover:text-arctic transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/neural-network"
                className="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1 font-semibold"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></span>
                NN Lab
              </Link>
              <Link
                to="/linear-regression"
                className="text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 font-semibold"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                Linear Lab
              </Link>
              <Link
                to="/logistic-regression"
                className="text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 font-semibold"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                Logistic Lab
              </Link>
              <Link
                to="/gradient-descent"
                className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1 font-semibold"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                GD Lab
              </Link>
              <Link
                to="/practice"
                className="text-sm font-medium text-slopes hover:text-arctic transition-colors"
              >
                Practice
              </Link>
              <Link
                to="/leaderboard"
                className="text-sm font-medium text-slopes hover:text-arctic transition-colors"
              >
                Leaderboard
              </Link>
            </div>
          )}

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <button className="p-2 rounded-xl text-slopes hover:text-arctic hover:bg-mountainside/60 transition-colors relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-info rounded-full"></span>
                </button>

                <div className="relative">
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center space-x-2 p-1 rounded-xl hover:bg-mountainside/60 transition-colors border border-transparent hover:border-mountainside"
                  >
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.firstName} className="w-8 h-8 rounded-full object-cover border border-apres" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-mountainside text-arctic border border-apres/50 flex items-center justify-center text-xs font-bold">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                      </div>
                    )}
                  </button>

                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute right-0 mt-2 w-48 bg-secondary-900 rounded-2xl shadow-hard border border-mountainside overflow-hidden backdrop-blur-xl"
                    >
                      <Link
                        to="/profile"
                        className="flex items-center space-x-2 px-4 py-3 text-sm text-slopes hover:text-arctic hover:bg-mountainside/60 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center space-x-2 px-4 py-3 text-sm text-slopes hover:text-arctic hover:bg-mountainside/60 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2 px-4 py-3 text-sm text-error hover:bg-mountainside/60 transition-colors border-t border-mountainside"
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
                <Link
                  to="/login"
                  className="text-sm font-medium text-slopes hover:text-arctic transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs font-semibold bg-arctic text-midnight hover:bg-slopes rounded-xl transition-colors shadow-soft"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-xl text-slopes hover:text-arctic hover:bg-mountainside/60 transition-colors"
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
          className="md:hidden bg-secondary-900 border-t border-mountainside px-4 py-4 space-y-2"
        >
          <Link
            to="/dashboard"
            className="block px-4 py-3 rounded-xl text-sm font-medium text-slopes hover:text-arctic hover:bg-mountainside/60 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            to="/practice"
            className="block px-4 py-3 rounded-xl text-sm font-medium text-slopes hover:text-arctic hover:bg-mountainside/60 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Practice
          </Link>
          <Link
            to="/leaderboard"
            className="block px-4 py-3 rounded-xl text-sm font-medium text-slopes hover:text-arctic hover:bg-mountainside/60 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Leaderboard
          </Link>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;