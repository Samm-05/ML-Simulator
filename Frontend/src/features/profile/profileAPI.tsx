import apiClient from '../../services/apiClient';   

// Types
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  emailNotifications: boolean;
  pushNotifications: boolean;
  defaultAlgorithmView: '2d' | '3d';
  animationSpeed: number;
  showExplanations: boolean;
}

export interface AlgorithmProgress {
  algorithmId: string;
  name: string;
  completed: boolean;
  score: number;
  attempts: number;
  lastPracticed: string;
  masteryLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface UserProgress {
  algorithms: AlgorithmProgress[];
  totalPracticeTime: number;
  averageScore: number;
  rank: number;
  level: number;
  experience: number;
  nextLevelExp: number; 
}

export interface ProfileData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'admin' | 'instructor';
  avatar?: string;
  institution?: string;
  bio?: string;
  points: number;
  badges: Badge[];
  streak: number;
  joinedAt: string;
  lastActive: string;
  isEmailVerified: boolean;
  settings: UserSettings;
  progress: UserProgress;
}

export interface SavedSimulation {
  id: string;
  name: string;
  algorithm: string;
  createdAt: string;
  parameters: Record<string, any>;
  results?: {
    accuracy?: number;
    loss?: number;
  };
}

export interface Activity {
  id: string;
  type: 'practice' | 'simulation' | 'challenge' | 'badge' | 'achievement';
  title: string;
  description: string;
  timestamp: string;
  score?: number;
  metadata?: Record<string, any>;
}

// Mock data for development
const mockProfile: ProfileData = {
  id: 'user-123',
  email: 'john.doe@example.com',
  firstName: 'John',
  lastName: 'Doe',
  role: 'student',
  avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=2563eb&color=fff',
  institution: 'University of Technology',
  bio: 'Passionate about machine learning and AI education. Currently learning deep learning and neural networks.',
  points: 2450,
  badges: [
    {
      id: 'badge-1',
      name: 'Quick Learner',
      description: 'Completed 5 challenges in one day',
      icon: '🚀',
      earnedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'badge-2',
      name: 'Linear Regression Master',
      description: 'Achieved 100% on all linear regression challenges',
      icon: '📈',
      earnedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'badge-3',
      name: 'K-Means Expert',
      description: 'Perfect clustering on all K-Means challenges',
      icon: '🔄',
      earnedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'badge-4',
      name: '7 Day Streak',
      description: 'Practiced for 7 days in a row',
      icon: '🔥',
      earnedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  streak: 12,
  joinedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
  lastActive: new Date().toISOString(),
  isEmailVerified: true,
  settings: {
    theme: 'system',
    emailNotifications: true,
    pushNotifications: true,
    defaultAlgorithmView: '2d',
    animationSpeed: 1,
    showExplanations: true,
  },
  progress: {
    algorithms: [
      {
        algorithmId: 'linear-regression',
        name: 'Linear Regression',
        completed: true,
        score: 95,
        attempts: 3,
        lastPracticed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        masteryLevel: 'expert',
      },
      {
        algorithmId: 'kmeans',
        name: 'K-Means Clustering',
        completed: true,
        score: 88,
        attempts: 5,
        lastPracticed: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        masteryLevel: 'advanced',
      },
      {
        algorithmId: 'decision-tree',
        name: 'Decision Tree',
        completed: false,
        score: 72,
        attempts: 4,
        lastPracticed: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        masteryLevel: 'intermediate',
      },
      {
        algorithmId: 'neural-network',
        name: 'Neural Network',
        completed: false,
        score: 45,
        attempts: 2,
        lastPracticed: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        masteryLevel: 'beginner',
      },
    ],
    totalPracticeTime: 245, // in minutes
    averageScore: 85,
    rank: 42,
    level: 7,
    experience: 1250,
    nextLevelExp: 1500,
  },
};

const mockSavedSimulations: SavedSimulation[] = [
  {
    id: 'sim-1',
    name: 'Housing Price Prediction',
    algorithm: 'linear-regression',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    parameters: {
      learningRate: 0.01,
      epochs: 100,
      noise: 0.1,
    },
    results: {
      accuracy: 0.92,
      loss: 0.08,
    },
  },
  {
    id: 'sim-2',
    name: 'Customer Segmentation',
    algorithm: 'kmeans',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    parameters: {
      k: 4,
      maxIterations: 50,
    },
    results: {
      accuracy: 0.88,
    },
  },
  {
    id: 'sim-3',
    name: 'Iris Classification',
    algorithm: 'decision-tree',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    parameters: {
      maxDepth: 5,
      minSamplesSplit: 2,
      criterion: 'gini',
    },
    results: {
      accuracy: 0.95,
    },
  },
];

const mockActivities: Activity[] = [
  {
    id: 'act-1',
    type: 'practice',
    title: 'Linear Regression Challenge',
    description: 'Completed parameter tuning challenge with 95% accuracy',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    score: 95,
  },
  {
    id: 'act-2',
    type: 'badge',
    title: 'Earned New Badge',
    description: 'Quick Learner badge unlocked',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'act-3',
    type: 'simulation',
    title: 'K-Means Simulation',
    description: 'Created customer segmentation model',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'act-4',
    type: 'challenge',
    title: 'Decision Tree Challenge',
    description: 'Completed pruning challenge',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    score: 88,
  },
];

export const profileAPI = {
  /**
   * Get user profile data
   */
  getProfile: async (): Promise<ProfileData> => {
    try {
      // In production, replace with actual API call
      // const response = await apiClient.get('/profile');
      // return response.data;
      
      // For development, return mock data with simulated delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockProfile;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: Partial<ProfileData>): Promise<ProfileData> => {
    try {
      // In production: const response = await apiClient.put('/profile', data);
      await new Promise(resolve => setTimeout(resolve, 500));
      return { ...mockProfile, ...data };
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  /**
   * Upload avatar image
   */
  uploadAvatar: async (file: File): Promise<{ avatarUrl: string }> => {
    try {
      // In production: const formData = new FormData();
      // formData.append('avatar', file);
      // const response = await apiClient.post('/profile/avatar', formData, {
      //   headers: { 'Content-Type': 'multipart/form-data' },
      // });
      // return response.data;

      // For development, simulate upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      const avatarUrl = URL.createObjectURL(file);
      return { avatarUrl };
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    }
  },

  /**
   * Get saved simulations
   */
  getSavedSimulations: async (): Promise<SavedSimulation[]> => {
    try {
      // In production: const response = await apiClient.get('/profile/simulations');
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockSavedSimulations;
    } catch (error) {
      console.error('Error fetching saved simulations:', error);
      throw error;
    }
  },

  /**
   * Save a simulation
   */
  saveSimulation: async (simulationId: string): Promise<void> => {
    try {
      // In production: await apiClient.post(`/profile/simulations/${simulationId}`);
      await new Promise(resolve => setTimeout(resolve, 200));
      console.log('Simulation saved:', simulationId);
    } catch (error) {
      console.error('Error saving simulation:', error);
      throw error;
    }
  },

  /**
   * Remove a saved simulation
   */
  removeSimulation: async (simulationId: string): Promise<void> => {
    try {
      // In production: await apiClient.delete(`/profile/simulations/${simulationId}`);
      await new Promise(resolve => setTimeout(resolve, 200));
      console.log('Simulation removed:', simulationId);
    } catch (error) {
      console.error('Error removing simulation:', error);
      throw error;
    }
  },

  /**
   * Get user achievements/badges
   */
  getAchievements: async (): Promise<Badge[]> => {
    try {
      // In production: const response = await apiClient.get('/profile/achievements');
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockProfile.badges;
    } catch (error) {
      console.error('Error fetching achievements:', error);
      throw error;
    }
  },

  /**
   * Update user settings
   */
  updateSettings: async (settings: Partial<UserSettings>): Promise<UserSettings> => {
    try {
      // In production: const response = await apiClient.put('/profile/settings', settings);
      await new Promise(resolve => setTimeout(resolve, 300));
      return { ...mockProfile.settings, ...settings };
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  },

  /**
   * Get user progress
   */
  getProgress: async (): Promise<UserProgress> => {
    try {
      // In production: const response = await apiClient.get('/profile/progress');
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockProfile.progress;
    } catch (error) {
      console.error('Error fetching progress:', error);
      throw error;
    }
  },

  /**
   * Get recent activity
   */
  getActivity: async (limit: number = 10): Promise<Activity[]> => {
    try {
      // In production: const response = await apiClient.get('/profile/activity', { params: { limit } });
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockActivities.slice(0, limit);
    } catch (error) {
      console.error('Error fetching activity:', error);
      throw error;
    }
  },

  /**
   * Change password
   */
  changePassword: async (currentPassword: string, newPassword: string): Promise<{ message: string }> => {
    try {
      // In production: const response = await apiClient.post('/profile/change-password', {
      //   currentPassword,
      //   newPassword,
      // });
      await new Promise(resolve => setTimeout(resolve, 500));
      return { message: 'Password changed successfully' };
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  },

  /**
   * Delete account
   */
  deleteAccount: async (password: string): Promise<{ message: string }> => {
    try {
      // In production: const response = await apiClient.delete('/profile/account', {
      //   data: { password },
      // });
      await new Promise(resolve => setTimeout(resolve, 500));
      return { message: 'Account deleted successfully' };
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  },

  /**
   * Export user data
   */
  exportData: async (): Promise<Blob> => {
    try {
      // In production: const response = await apiClient.get('/profile/export', {
      //   responseType: 'blob',
      // });
      // return response.data;
      
      // For development, create mock JSON blob
      const data = {
        profile: mockProfile,
        simulations: mockSavedSimulations,
        activities: mockActivities,
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      return blob;
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  },
};

export default profileAPI;