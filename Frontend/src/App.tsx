import React, { useEffect } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { setOnlineStatus } from './features/ui/uiSlice';
import { ThemeProvider } from './contexts/ThemeContext';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';

const APP_SHELL_ROUTES = ['/dashboard', '/gradient-descent', '/simulator', '/practice', '/leaderboard', '/profile', '/settings'];
const AUTH_ROUTES = ['/login', '/register', '/signup', '/forgot-password'];

const RoutedApp: React.FC = () => {
  const location = useLocation();
  const { sidebarOpen } = useAppSelector((state) => state.ui);
  const isAppShellRoute = APP_SHELL_ROUTES.some((route) => location.pathname.startsWith(route));
  const isAuthRoute = AUTH_ROUTES.includes(location.pathname);
  const isLandingRoute = location.pathname === '/';

  if (isLandingRoute || isAuthRoute) {
    return (
      <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 transition-colors duration-300">
        <AppRoutes />
      </div>
    );
  }

  if (isAppShellRoute) {
    return (
      <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 transition-colors duration-300 flex flex-col">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar />
          <main className={`flex-1 pt-16 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
            <AppRoutes />
          </main>
        </div>
        <Footer />
      </div>
    );
  }

  return <AppRoutes />;
};

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleOnline = () => dispatch(setOnlineStatus(true));
    const handleOffline = () => dispatch(setOnlineStatus(false));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [dispatch]);

  return (
    <ThemeProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <RoutedApp />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#0f172a',
              borderRadius: '0.75rem',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            },
            success: {
              iconTheme: {
                primary: '#22c55e',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </Router>
    </ThemeProvider>
  );
}

export default App;
