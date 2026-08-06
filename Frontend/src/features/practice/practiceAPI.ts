import apiClient from '../../services/apiClient';
import { Question, QuizCategory, UserPracticeStats, UserQuizAttempt } from './types';

export const practiceAPI = {
  /**
   * Get all quiz categories
   */
  getCategories: async (): Promise<QuizCategory[]> => {
    try {
      const response = await apiClient.get('/practice/categories');
      return response.data;
    } catch {
      // Fallback handled in slice if offline
      return [];
    }
  },

  /**
   * Get questions for a given category & difficulty
   */
  getQuestions: async (categoryId: string, difficulty: string = 'all'): Promise<Question[]> => {
    try {
      const response = await apiClient.get('/practice/questions', {
        params: { categoryId, difficulty },
      });
      return response.data;
    } catch {
      return [];
    }
  },

  /**
   * Start a quiz attempt session
   */
  startQuiz: async (categoryId: string, difficulty: string): Promise<{ attemptId: string }> => {
    try {
      const response = await apiClient.post('/practice/start', { categoryId, difficulty });
      return response.data;
    } catch {
      return { attemptId: `attempt-${Date.now()}` };
    }
  },

  /**
   * Submit quiz answers
   */
  submitQuiz: async (payload: {
    categoryId: string;
    categoryTitle: string;
    userAnswers: Record<string, string>;
    timeTakenSeconds: number;
    totalQuestions: number;
  }): Promise<UserQuizAttempt> => {
    const response = await apiClient.post('/practice/submit', payload);
    return response.data;
  },

  /**
   * Get user quiz history
   */
  getHistory: async (): Promise<UserQuizAttempt[]> => {
    try {
      const response = await apiClient.get('/practice/history');
      return response.data;
    } catch {
      return [];
    }
  },

  /**
   * Get overall user practice statistics
   */
  getStats: async (): Promise<UserPracticeStats> => {
    try {
      const response = await apiClient.get('/practice/stats');
      return response.data;
    } catch {
      return {
        totalQuizzesCompleted: 0,
        averageAccuracy: 0,
        totalXP: 0,
        currentStreak: 0,
        questionsAnswered: 0,
        correctAnswered: 0,
      };
    }
  },
};

export default practiceAPI;
