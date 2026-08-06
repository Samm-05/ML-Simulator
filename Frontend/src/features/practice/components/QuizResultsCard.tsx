import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, CheckCircle2, XCircle, Clock, Sparkles, ArrowRight, RotateCcw, FlaskConical, LayoutDashboard } from 'lucide-react';
import Card from '../../../components/ui/Card';
import { UserQuizAttempt } from '../types';
import { motion } from 'framer-motion';

export interface QuizResultsCardProps {
  results: UserQuizAttempt;
  onRetakeQuiz: () => void;
}

export const QuizResultsCard: React.FC<QuizResultsCardProps> = ({ results, onRetakeQuiz }) => {
  const navigate = useNavigate();

  const minutes = Math.floor(results.timeTakenSeconds / 60);
  const seconds = results.timeTakenSeconds % 60;
  const isPassed = results.accuracyPercentage >= 70;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto space-y-6 select-none"
    >
      <Card className="p-8 bg-midnight/90 border border-mountainside/90 rounded-3xl shadow-2xl space-y-8 text-center relative overflow-hidden">
        {/* Subtle Background Glow */}
        <div className={`absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full blur-3xl pointer-events-none ${isPassed ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`} />

        {/* Header Icon */}
        <div className="relative z-10 space-y-3">
          <div className={`w-20 h-20 mx-auto rounded-3xl border flex items-center justify-center shadow-lg ${
            isPassed
              ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-400'
              : 'bg-amber-950/60 border-amber-500/50 text-amber-400'
          }`}>
            <Trophy className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-mono uppercase tracking-widest text-apres">
              Quiz Evaluation Results
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-arctic tracking-tight">
              {results.categoryTitle}
            </h1>
          </div>
        </div>

        {/* Score & XP Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10 font-mono">
          <div className="p-3.5 bg-mountainside/40 border border-apres/20 rounded-2xl space-y-1">
            <span className="text-[11px] text-apres">Score</span>
            <p className="text-xl font-bold text-emerald-400">{results.accuracyPercentage}%</p>
          </div>

          <div className="p-3.5 bg-mountainside/40 border border-apres/20 rounded-2xl space-y-1">
            <span className="text-[11px] text-apres">Correct</span>
            <p className="text-xl font-bold text-arctic">{results.correctCount} / {results.totalQuestions}</p>
          </div>

          <div className="p-3.5 bg-mountainside/40 border border-apres/20 rounded-2xl space-y-1">
            <span className="text-[11px] text-apres">Time Taken</span>
            <p className="text-xl font-bold text-cyan-300">{minutes}m {seconds}s</p>
          </div>

          <div className="p-3.5 bg-mountainside/40 border border-apres/20 rounded-2xl space-y-1">
            <span className="text-[11px] text-apres">XP Earned</span>
            <p className="text-xl font-bold text-purple-400">+{results.score} XP</p>
          </div>
        </div>

        {/* Playground Lab Recommendation Box (Phase 12) */}
        {results.recommendedLab && (
          <div className="p-5 bg-gradient-to-r from-cyan-950/60 via-midnight to-mountainside border border-cyan-500/40 rounded-2xl space-y-3 text-left shadow-hard relative z-10">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-cyan-400 uppercase tracking-wider">
              <FlaskConical className="w-4 h-4 text-cyan-400" />
              Recommended Interactive Practice
            </div>
            <p className="text-xs sm:text-sm text-slopes font-sans leading-relaxed">
              Improve your conceptual intuition for this topic in the 3D visual laboratory environment.
            </p>
            <button
              type="button"
              onClick={() => navigate(results.recommendedLab!.route)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Launch {results.recommendedLab.title}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 relative z-10 font-mono">
          <button
            type="button"
            onClick={onRetakeQuiz}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-mountainside/80 hover:bg-mountainside border border-apres/40 text-slopes hover:text-arctic text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Quiz</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/practice')}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Return to Practice Dashboard</span>
          </button>
        </div>
      </Card>
    </motion.div>
  );
};

export default QuizResultsCard;
