import React, { useState, useEffect, useRef } from 'react';
import { Question } from '../types';
import Card from '../../../components/ui/Card';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  Lightbulb,
  BookOpen,
  Sparkles,
  Calculator,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface QuestionCardProps {
  question: Question;
  selectedAnswer?: string;
  onSelectAnswer: (answer: string) => void;
  showFeedback: boolean;
}

const KaTeXBlock: React.FC<{ formula: string }> = ({ formula }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && formula) {
      try {
        ref.current.innerHTML = '';
        katex.render(formula, ref.current, {
          throwOnError: false,
          displayMode: true,
        });
      } catch (err) {
        console.error('KaTeX formula render error:', err);
      }
    }
  }, [formula]);

  return <div ref={ref} className="py-2 text-center text-emerald-300 font-mono text-lg overflow-x-auto" />;
};

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedAnswer,
  onSelectAnswer,
  showFeedback,
}) => {
  const [fillBlankInput, setFillBlankInput] = useState('');
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    setFillBlankInput('');
    setShowHint(false);
  }, [question.id]);

  const isCorrect = selectedAnswer === question.correct_answer;

  const handleFillBlankSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fillBlankInput.trim()) {
      onSelectAnswer(fillBlankInput.trim());
    }
  };

  return (
    <Card className="p-6 sm:p-8 bg-midnight/90 border border-mountainside/80 rounded-3xl shadow-hard space-y-6">
      {/* Question Type & Difficulty Badges */}
      <div className="flex items-center justify-between border-b border-mountainside pb-3 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider font-bold">
            {question.type.replace('_', ' ')}
          </span>
          <span className="text-apres">• {question.topic}</span>
        </div>

        <span
          className={`px-2.5 py-0.5 rounded-full border uppercase text-[10px] font-bold tracking-wider ${
            question.difficulty === 'easy'
              ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/40'
              : question.difficulty === 'medium'
              ? 'bg-amber-950/40 text-amber-400 border-amber-500/40'
              : 'bg-rose-950/40 text-rose-400 border-rose-500/40'
          }`}
        >
          {question.difficulty}
        </span>
      </div>

      {/* Case Study / Context Scenario Card if present */}
      {question.context_or_scenario && (
        <div className="p-4 bg-mountainside/40 border border-cyan-500/30 rounded-2xl space-y-1.5 text-xs sm:text-sm text-cyan-200 font-sans leading-relaxed">
          <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-cyan-400 uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            Case Scenario & Context
          </div>
          <p className="whitespace-pre-line">{question.context_or_scenario}</p>
        </div>
      )}

      {/* Question Text */}
      <div className="space-y-3">
        <h2 className="text-lg sm:text-xl font-bold text-arctic tracking-tight leading-relaxed">
          {question.question}
        </h2>

        {/* Optional LaTeX Formula Block */}
        {question.formula && <KaTeXBlock formula={question.formula} />}
      </div>

      {/* Collapsible Hint */}
      {question.hint && (
        <div>
          <button
            type="button"
            onClick={() => setShowHint(!showHint)}
            className="flex items-center gap-1.5 text-xs font-mono text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>{showHint ? 'Hide Hint' : 'Need a Hint?'}</span>
            {showHint ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
          {showHint && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-2 p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs font-mono text-amber-200"
            >
              💡 <strong>Hint:</strong> {question.hint}
            </motion.div>
          )}
        </div>
      )}

      {/* Answer Input Options depending on Question Type */}
      {question.type === 'fill_blank' ? (
        <form onSubmit={handleFillBlankSubmit} className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={fillBlankInput}
              onChange={(e) => setFillBlankInput(e.target.value)}
              placeholder="Type your short answer..."
              disabled={showFeedback}
              className="w-full p-3 rounded-xl bg-mountainside border border-apres/40 text-arctic font-mono text-sm focus:outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              disabled={showFeedback || !fillBlankInput.trim()}
              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold transition-all disabled:opacity-50"
            >
              Submit Answer
            </button>
          </div>
        </form>
      ) : (
        /* Options List for MCQ, True/False, Formula ID, Scenario, Case Study */
        <div className="space-y-2.5 pt-2">
          {question.options?.map((option, idx) => {
            const isSelected = selectedAnswer === option;
            const isTargetCorrect = option === question.correct_answer;

            let optionStyle = 'bg-mountainside/40 border-apres/30 hover:border-cyan-400/60 text-arctic';

            if (selectedAnswer) {
              if (isSelected && isCorrect) {
                optionStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold';
              } else if (isSelected && !isCorrect) {
                optionStyle = 'bg-rose-950/60 border-rose-500 text-rose-300 font-bold';
              } else if (isTargetCorrect) {
                optionStyle = 'bg-emerald-950/40 border-emerald-500/60 text-emerald-300';
              } else {
                optionStyle = 'bg-midnight/60 border-mountainside/60 text-slopes opacity-60';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={showFeedback}
                onClick={() => onSelectAnswer(option)}
                className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm font-sans transition-all duration-150 flex items-start gap-3 cursor-pointer ${optionStyle}`}
              >
                <span className="font-mono font-bold text-cyan-400 shrink-0 mt-0.5">
                  {String.fromCharCode(65 + idx)}.
                </span>
                <span className="flex-1">{option}</span>
                {selectedAnswer && isSelected && (
                  <span className="shrink-0 mt-0.5">
                    {isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400" />
                    )}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Post-Answer Immediate Feedback Box (Phase 8) */}
      <AnimatePresence>
        {showFeedback && selectedAnswer && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-5 rounded-2xl border space-y-3 font-sans shadow-lg ${
              isCorrect
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
            }`}
          >
            <div className="flex items-center gap-2 font-mono font-bold text-sm">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="text-emerald-400 uppercase tracking-wider">✓ Correct Answer! (+50 XP)</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-rose-400" />
                  <span className="text-rose-400 uppercase tracking-wider">✗ Incorrect</span>
                </>
              )}
            </div>

            <div className="space-y-2 text-xs sm:text-sm leading-relaxed">
              <p>
                <strong>Correct Explanation:</strong> {question.explanation}
              </p>

              {question.real_time_application && (
                <div className="p-3 rounded-xl bg-midnight/70 border border-cyan-500/30 text-cyan-200 font-mono text-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                    <Sparkles className="w-3.5 h-3.5" /> Real-World Production Application:
                  </div>
                  <p>{question.real_time_application}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default QuestionCard;
