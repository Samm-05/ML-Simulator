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
      className="fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white dark:bg-secondary-900 border-r border-secondary-200/80 dark:border-secondary-800 hidden lg:block overflow-hidden z-40 shadow-soft"
    >
      <div className="h-full flex flex-col relative min-h-0">
        {/* Toggle Button */}
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="absolute -right-3 top-20 w-7 h-7 bg-white dark:bg-secondary-900 border border-secondary-200/70 dark:border-secondary-700 rounded-full flex items-center justify-center shadow-soft hover:shadow-medium transition-shadow z-10"
        >
          {sidebarOpen ? (
            <ChevronLeft className="w-4 h-4 text-secondary-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-secondary-500" />
          )}
        </button>

        {/* Brand */}
        <div className="px-4 pt-6 pb-2">
          <div className={`flex items-center ${sidebarOpen ? 'gap-3' : 'justify-center'}`}>
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-primary-600 to-accent-500 text-white flex items-center justify-center shadow-soft">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            {sidebarOpen && (
              <div>
                <p className="text-sm font-semibold text-secondary-900 dark:text-white">ML Visual Lab</p>
                <p className="text-xs text-secondary-500 dark:text-secondary-400">Student workspace</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {sidebarOpen && (
            <p className="px-3 text-[11px] uppercase tracking-[0.18em] text-secondary-400 dark:text-secondary-500 mb-2">
              Main
            </p>
          )}
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `relative flex items-center px-3 py-3 rounded-2xl transition-all duration-200
                ${!sidebarOpen ? 'justify-center' : 'space-x-3'}
                ${isActive
                  ? 'bg-primary-600 text-white shadow-medium'
                  : 'text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100/70 dark:hover:bg-secondary-800/70'
                }`
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="px-3 py-6 border-t border-secondary-200/70 dark:border-secondary-800 mt-auto">
          {sidebarOpen && (
            <p className="px-3 text-[11px] uppercase tracking-[0.18em] text-secondary-400 dark:text-secondary-500 mb-2">
              Account
            </p>
          )}
          {bottomItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-3 py-3 rounded-2xl transition-all duration-200
                ${!sidebarOpen ? 'justify-center' : 'space-x-3'}
                ${isActive
                  ? 'bg-secondary-900 text-white dark:bg-white dark:text-secondary-900'
                  : 'text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100/70 dark:hover:bg-secondary-800/70'
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
