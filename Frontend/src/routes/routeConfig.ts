export const routeConfig = {
  public: ['/login', '/register', '/forgot-password'],
  private: [
    '/dashboard',
    '/simulator',
    '/practice',
    '/leaderboard',
    '/profile',
    '/settings',
  ],
  admin: ['/admin', '/admin/users', '/admin/analytics'],
};

export const navigationLinks = [
  { name: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
  { name: 'Simulator', path: '/simulator', icon: 'Brain' },
  { name: 'Practice', path: '/practice', icon: 'Target' },
  { name: 'Leaderboard', path: '/leaderboard', icon: 'Trophy' },
  { name: 'Profile', path: '/profile', icon: 'User' },
];