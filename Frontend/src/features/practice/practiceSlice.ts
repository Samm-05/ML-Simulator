import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { practiceAPI } from './practiceAPI';
import { ALL_QUESTIONS, QUIZ_CATEGORIES } from './practiceData';
import { DifficultyLevel, Question, QuizCategory, UserPracticeStats, UserQuizAttempt } from './types';
import { toast } from 'react-hot-toast';

interface PracticeState {
  categories: QuizCategory[];
  activeQuiz: {
    categoryId: string;
    categoryTitle: string;
    difficulty: DifficultyLevel;
    questions: Question[];
  } | null;
  currentQuestionIndex: number;
  userAnswers: Record<string, string>;
  selectedDifficulty: DifficultyLevel;
  searchTerm: string;
  quizStartTime: number | null;
  quizResults: UserQuizAttempt | null;
  userStats: UserPracticeStats;
  attemptHistory: UserQuizAttempt[];
  loading: boolean;
  isQuizActive: boolean;
  showFeedback: boolean;
}

const LOCAL_STORAGE_HISTORY_KEY = 'ml_practice_history';

const getInitialHistory = (): UserQuizAttempt[] => {
  const raw = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }
  return [];
};

const initialHistory = getInitialHistory();

const calculateStatsFromHistory = (history: UserQuizAttempt[]): UserPracticeStats => {
  if (history.length === 0) {
    return {
      totalQuizzesCompleted: 0,
      averageAccuracy: 0,
      totalXP: 0,
      currentStreak: 1,
      questionsAnswered: 0,
      correctAnswered: 0,
    };
  }

  const totalQuizzesCompleted = history.length;
  const totalCorrect = history.reduce((sum, h) => sum + h.correctCount, 0);
  const totalQuestions = history.reduce((sum, h) => sum + h.totalQuestions, 0);
  const averageAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const totalXP = history.reduce((sum, h) => sum + h.score, 0);

  return {
    totalQuizzesCompleted,
    averageAccuracy,
    totalXP,
    currentStreak: Math.min(totalQuizzesCompleted, 7),
    questionsAnswered: totalQuestions,
    correctAnswered: totalCorrect,
  };
};

const initialState: PracticeState = {
  categories: QUIZ_CATEGORIES,
  activeQuiz: null,
  currentQuestionIndex: 0,
  userAnswers: {},
  selectedDifficulty: 'all',
  searchTerm: '',
  quizStartTime: null,
  quizResults: null,
  userStats: calculateStatsFromHistory(initialHistory),
  attemptHistory: initialHistory,
  loading: false,
  isQuizActive: false,
  showFeedback: false,
};

export const fetchPracticeCategories = createAsyncThunk('practice/fetchCategories', async () => {
  const data = await practiceAPI.getCategories();
  return data.length > 0 ? data : QUIZ_CATEGORIES;
});

export const fetchUserPracticeStats = createAsyncThunk('practice/fetchStats', async () => {
  const data = await practiceAPI.getStats();
  return data;
});

export const fetchAttemptHistory = createAsyncThunk('practice/fetchHistory', async () => {
  const data = await practiceAPI.getHistory();
  return data;
});

export const submitQuizAttempt = createAsyncThunk(
  'practice/submitQuizAttempt',
  async (
    payload: {
      categoryId: string;
      categoryTitle: string;
      userAnswers: Record<string, string>;
      questions: Question[];
      timeTakenSeconds: number;
    },
    { rejectWithValue }
  ) => {
    try {
      // Calculate results client side & send to backend API
      let correctCount = 0;
      payload.questions.forEach((q) => {
        if (payload.userAnswers[q.id] === q.correct_answer) {
          correctCount++;
        }
      });

      const totalQuestions = payload.questions.length;
      const accuracyPercentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
      const score = correctCount * 50 + (accuracyPercentage === 100 ? 100 : 0);

      // Recommend Lab if accuracy < 80%
      const category = QUIZ_CATEGORIES.find((c) => c.id === payload.categoryId);
      const recommendedLab =
        accuracyPercentage < 80 && category?.playgroundLabRoute
          ? {
              route: category.playgroundLabRoute,
              title: category.recommendedLabTitle || 'Playground Laboratory',
            }
          : undefined;

      const attemptResult: UserQuizAttempt = {
        id: `attempt-${Date.now()}`,
        categoryId: payload.categoryId,
        categoryTitle: payload.categoryTitle,
        score,
        totalQuestions,
        correctCount,
        accuracyPercentage,
        timeTakenSeconds: payload.timeTakenSeconds,
        completedAt: new Date().toISOString(),
        recommendedLab,
      };

      // Call API asynchronously
      try {
        await practiceAPI.submitQuiz({
          categoryId: payload.categoryId,
          categoryTitle: payload.categoryTitle,
          userAnswers: payload.userAnswers,
          timeTakenSeconds: payload.timeTakenSeconds,
          totalQuestions,
        });
      } catch (err) {
        console.warn('Backend submit fallback:', err);
      }

      return attemptResult;
    } catch (error: any) {
      return rejectWithValue('Failed to submit quiz attempt');
    }
  }
);

const practiceSlice = createSlice({
  name: 'practice',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setSelectedDifficultyFilter: (state, action: PayloadAction<DifficultyLevel>) => {
      state.selectedDifficulty = action.payload;
    },
    startQuiz: (
      state,
      action: PayloadAction<{ categoryId: string; difficulty?: DifficultyLevel }>
    ) => {
      const { categoryId, difficulty = 'all' } = action.payload;
      const category = QUIZ_CATEGORIES.find((c) => c.id === categoryId) || QUIZ_CATEGORIES[0];

      // Filter questions by category and optional difficulty
      let questions = ALL_QUESTIONS.filter(
        (q) => q.topic.toLowerCase().includes(category.topic.toLowerCase()) || category.topic.toLowerCase().includes(q.topic.toLowerCase())
      );

      if (questions.length === 0) {
        questions = ALL_QUESTIONS.slice(0, 5);
      }

      if (difficulty !== 'all') {
        const filtered = questions.filter((q) => q.difficulty === difficulty);
        if (filtered.length > 0) questions = filtered;
      }

      state.activeQuiz = {
        categoryId: category.id,
        categoryTitle: category.title,
        difficulty,
        questions,
      };
      state.currentQuestionIndex = 0;
      state.userAnswers = {};
      state.quizStartTime = Date.now();
      state.quizResults = null;
      state.isQuizActive = true;
      state.showFeedback = false;
    },
    recordAnswer: (
      state,
      action: PayloadAction<{ questionId: string; answer: string }>
    ) => {
      state.userAnswers[action.payload.questionId] = action.payload.answer;
      state.showFeedback = true;
    },
    nextQuestion: (state) => {
      if (state.activeQuiz && state.currentQuestionIndex < state.activeQuiz.questions.length - 1) {
        state.currentQuestionIndex += 1;
        state.showFeedback = false;
      }
    },
    prevQuestion: (state) => {
      if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex -= 1;
        state.showFeedback = false;
      }
    },
    setShowFeedback: (state, action: PayloadAction<boolean>) => {
      state.showFeedback = action.payload;
    },
    exitQuiz: (state) => {
      state.activeQuiz = null;
      state.isQuizActive = false;
      state.currentQuestionIndex = 0;
      state.userAnswers = {};
      state.showFeedback = false;
    },
    clearResults: (state) => {
      state.quizResults = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPracticeCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(fetchUserPracticeStats.fulfilled, (state, action) => {
        if (action.payload && action.payload.totalQuizzesCompleted > 0) {
          state.userStats = action.payload;
        }
      })
      .addCase(fetchAttemptHistory.fulfilled, (state, action) => {
        if (action.payload && action.payload.length > 0) {
          state.attemptHistory = action.payload;
          state.userStats = calculateStatsFromHistory(action.payload);
        }
      })
      .addCase(submitQuizAttempt.fulfilled, (state, action) => {
        state.quizResults = action.payload;
        state.isQuizActive = false;

        // Add to history & save to localStorage
        state.attemptHistory.unshift(action.payload);
        try {
          localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(state.attemptHistory));
        } catch (e) {}

        // Recalculate stats
        state.userStats = calculateStatsFromHistory(state.attemptHistory);
        toast.success(`Quiz Completed! Scored ${action.payload.score} XP`);
      });
  },
});

export const {
  setSearchTerm,
  setSelectedDifficultyFilter,
  startQuiz,
  recordAnswer,
  nextQuestion,
  prevQuestion,
  setShowFeedback,
  exitQuiz,
  clearResults,
} = practiceSlice.actions;

export default practiceSlice.reducer;