import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Brain,
  Target,
  Trophy,
  User,
  BookOpen,
  Settings,
  History,
  BarChart3,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { toggleSidebar } from '../../features/ui/uiSlice';

const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { sidebarOpen } = useAppSelector((state) => state.ui);

  if (!isAuthenticated) return null;

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/simulator', icon: Brain, label: 'Simulator' },
    { path: '/practice', icon: Target, label: 'Practice' },
    { path: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
  ];

  const bottomItems = [
    { path: '/profile', icon: User, label: 'Profile' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarOpen ? 256 : 80 }}
      transition={{ duration: 0.3 }}
      className="fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white dark:bg-secondary-800 border-r border-secondary-200 dark:border-secondary-700 hidden lg:block overflow-hidden z-40"
    >
      <div className="h-full flex flex-col relative">
        {/* Toggle Button */}
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="absolute -right-3 top-20 w-6 h-6 bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-full flex items-center justify-center shadow-soft hover:shadow-medium transition-shadow z-10"
        >
          {sidebarOpen ? (
            <ChevronLeft className="w-4 h-4 text-secondary-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-secondary-500" />
          )}
        </button>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-3 py-3 rounded-xl transition-all duration-200
                ${!sidebarOpen ? 'justify-center' : 'space-x-3'}
                ${isActive
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                  : 'text-secondary-600 dark:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-700/50'
                }`
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="px-3 py-6 border-t border-secondary-200 dark:border-secondary-700">
          {bottomItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-3 py-3 rounded-xl transition-all duration-200
                ${!sidebarOpen ? 'justify-center' : 'space-x-3'}
                ${isActive
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                  : 'text-secondary-600 dark:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-700/50'
                }`
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </NavLink>
          ))}
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;