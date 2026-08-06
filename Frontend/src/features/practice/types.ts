export type QuestionType =
  | 'mcq'
  | 'true_false'
  | 'fill_blank'
  | 'formula_id'
  | 'scenario'
  | 'debug'
  | 'case_study';

export type DifficultyLevel = 'all' | 'easy' | 'medium' | 'hard';

export interface Question {
  id: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  type: QuestionType;
  question: string;
  context_or_scenario?: string;
  options?: string[];
  correct_answer: string;
  explanation: string;
  real_time_application?: string;
  hint?: string;
  formula?: string;
  tags?: string[];
}

export interface QuizCategory {
  id: string;
  title: string;
  topic: string;
  shortDescription: string;
  iconName: string;
  questionCount: number;
  difficultyDistribution: {
    easy: number;
    medium: number;
    hard: number;
  };
  playgroundLabRoute?: string;
  recommendedLabTitle?: string;
}

export interface UserQuizAttempt {
  id: string;
  categoryId: string;
  categoryTitle: string;
  score: number;
  totalQuestions: number;
  correctCount: number;
  accuracyPercentage: number;
  timeTakenSeconds: number;
  completedAt: string;
  topicPerformance?: Record<string, number>;
  recommendedLab?: {
    route: string;
    title: string;
  };
}

export interface UserPracticeStats {
  totalQuizzesCompleted: number;
  averageAccuracy: number;
  totalXP: number;
  currentStreak: number;
  questionsAnswered: number;
  correctAnswered: number;
}
