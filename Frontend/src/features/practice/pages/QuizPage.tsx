import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  startQuiz,
  recordAnswer,
  nextQuestion,
  prevQuestion,
  submitQuizAttempt,
  exitQuiz,
} from '../practiceSlice';
import PageContainer from '../../../components/layout/PageContainer';
import QuestionCard from '../components/QuestionCard';
import QuizTimer from '../components/QuizTimer';
import QuizResultsCard from '../components/QuizResultsCard';
import { ChevronLeft, ChevronRight, CheckCircle2, X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const QuizPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    activeQuiz,
    currentQuestionIndex,
    userAnswers,
    showFeedback,
    quizResults,
    quizStartTime,
  } = useAppSelector((state) => state.practice);

  // Initialize Quiz if not already active or if category parameter changed
  useEffect(() => {
    if (categoryId && (!activeQuiz || activeQuiz.categoryId !== categoryId)) {
      dispatch(startQuiz({ categoryId }));
    }
  }, [categoryId, activeQuiz, dispatch]);

  if (quizResults) {
    return (
      <PageContainer className="relative min-h-screen bg-midnight text-arctic py-8 px-4 sm:px-6 lg:px-8 space-y-6 font-sans select-none">
        <QuizResultsCard
          results={quizResults}
          onRetakeQuiz={() => {
            if (categoryId) dispatch(startQuiz({ categoryId }));
          }}
        />
      </PageContainer>
    );
  }

  if (!activeQuiz || activeQuiz.questions.length === 0) {
    return (
      <PageContainer className="relative min-h-screen bg-midnight text-arctic py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center font-sans">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-400 mx-auto" />
          <p className="text-sm font-mono text-slopes">Loading quiz questions...</p>
        </div>
      </PageContainer>
    );
  }

  const currentQuestion = activeQuiz.questions[currentQuestionIndex];
  const totalQuestions = activeQuiz.questions.length;
  const isFirst = currentQuestionIndex === 0;
  const isLast = currentQuestionIndex === totalQuestions - 1;
  const progressPercent = Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100);
  const selectedAnswer = userAnswers[currentQuestion.id];

  const handleSelectAnswer = (answer: string) => {
    dispatch(recordAnswer({ questionId: currentQuestion.id, answer }));
  };

  const handleNext = () => {
    dispatch(nextQuestion());
  };

  const handlePrev = () => {
    dispatch(prevQuestion());
  };

  const handleSubmitQuiz = () => {
    const timeTakenSeconds = quizStartTime ? Math.round((Date.now() - quizStartTime) / 1000) : 120;
    dispatch(
      submitQuizAttempt({
        categoryId: activeQuiz.categoryId,
        categoryTitle: activeQuiz.categoryTitle,
        userAnswers,
        questions: activeQuiz.questions,
        timeTakenSeconds,
      })
    );
  };

  const handleExit = () => {
    dispatch(exitQuiz());
    navigate('/practice');
  };

  return (
    <PageContainer className="relative min-h-screen bg-midnight text-arctic py-8 px-4 sm:px-6 lg:px-8 space-y-6 font-sans select-none">
      {/* Top Quiz Header Bar */}
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleExit}
              className="p-2 rounded-xl bg-mountainside/80 border border-apres/30 text-slopes hover:text-arctic transition-colors cursor-pointer"
              title="Exit Quiz"
            >
              <X className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-arctic tracking-tight">
                {activeQuiz.categoryTitle}
              </h1>
              <span className="text-xs font-mono text-cyan-400">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </span>
            </div>
          </div>

          {/* Countdown Timer */}
          <QuizTimer initialSeconds={600} />
        </div>

        {/* Animated Progress Bar */}
        <div className="w-full h-2 bg-mountainside rounded-full overflow-hidden border border-apres/20">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Question Card Component */}
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            <QuestionCard
              question={currentQuestion}
              selectedAnswer={selectedAnswer}
              onSelectAnswer={handleSelectAnswer}
              showFeedback={showFeedback}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Quiz Navigation Controls */}
      <div className="max-w-4xl mx-auto flex items-center justify-between pt-2 font-mono">
        <button
          type="button"
          onClick={handlePrev}
          disabled={isFirst}
          className="px-5 py-2.5 rounded-xl bg-mountainside/60 border border-apres/30 text-xs sm:text-sm font-semibold text-slopes hover:text-arctic hover:bg-mountainside/80 transition-all flex items-center gap-1.5 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        {isLast ? (
          <button
            type="button"
            onClick={handleSubmitQuiz}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <span>Submit Quiz</span>
            <CheckCircle2 className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <span>Next Question</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </PageContainer>
  );
};

export default QuizPage;
