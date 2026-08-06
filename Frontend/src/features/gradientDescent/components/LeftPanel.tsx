import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, CheckCircle, ChevronRight, HelpCircle, Lightbulb, Target, Sparkles, Save, FileText } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { setTutorialMode, setTutorialStepIndex, markTutorialCompleted } from '../gradientDescentSlice';
import { TUTORIAL_STEPS } from '../utils/tutorialData';
import { soundFx } from '../utils/soundEffects';
import { experimentService } from '../../../services/experimentService';
import { toast } from 'react-hot-toast';
import Button from '../../../components/ui/Button';
import { UniversalReportModal } from '../../../components/reports/UniversalReportModal';

export const LeftPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const gdState = useAppSelector((state) => state.gradientDescent);
  const tutorialMode = gdState?.tutorialMode ?? false;
  const currentTutorialStep = gdState?.currentTutorialStep ?? 0;
  const completedTutorialSteps = gdState?.completedTutorialSteps ?? [];
  const params = gdState?.params;
  const steps = gdState?.steps ?? [];
  const currentStepIndex = gdState?.currentStepIndex ?? 0;

  const [saving, setSaving] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  if (!params) return null;

  const currentStep = steps[currentStepIndex] || steps[0] || { loss: 0, gradX: 0, gradY: 0 };
  const activeTutorial = TUTORIAL_STEPS[currentTutorialStep] || TUTORIAL_STEPS[0];
  const isCompleted = completedTutorialSteps.includes(currentTutorialStep);

  const handleNextTutorialStep = () => {
    if (currentTutorialStep < TUTORIAL_STEPS.length - 1) {
      dispatch(markTutorialCompleted(currentTutorialStep));
      dispatch(setTutorialStepIndex(currentTutorialStep + 1));
      soundFx.playConvergenceChime();
    }
  };

  const handlePrevTutorialStep = () => {
    if (currentTutorialStep > 0) {
      dispatch(setTutorialStepIndex(currentTutorialStep - 1));
    }
  };

  // Automated check if current user action meets tutorial objective
  const checkVerification = () => {
    if (activeTutorial.verification(params, steps, currentStepIndex)) {
      if (!isCompleted) {
        dispatch(markTutorialCompleted(currentTutorialStep));
        soundFx.playConvergenceChime();
      }
      return true;
    }
    return false;
  };

  const isVerified = checkVerification();

  const handleSaveExperiment = async () => {
    setSaving(true);
    const toastId = toast.loading('Saving Gradient Descent experiment...');
    try {
      await experimentService.saveExperiment({
        algorithm: 'gradient-descent',
        title: `Gradient Descent (${params.surfaceType || '3D Surface'}, α=${params.learningRate})`,
        parameters: {
          learningRate: params.learningRate,
          iterations: params.iterations,
          momentum: params.momentum,
          surfaceType: params.surfaceType,
          initialX: params.initialX,
          initialY: params.initialY,
        },
        metrics: {
          loss: currentStep.loss,
          gradX: currentStep.gradX,
          gradY: currentStep.gradY,
          totalSteps: steps.length,
        },
      });
      toast.success('Gradient Descent experiment saved to MongoDB! +50 XP', { id: toastId });
    } catch (err: any) {
      toast.error('Failed to save experiment', { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5 select-none">
      {/* Mode Selector Toggle: Explore vs Guided Tutorial */}
      <div className="bg-midnight border border-mountainside p-1.5 rounded-2xl flex items-center gap-1 shadow-soft">
        <button
          type="button"
          onClick={() => dispatch(setTutorialMode(false))}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            !tutorialMode
              ? 'bg-mountainside text-arctic border border-apres/50 shadow-soft'
              : 'text-slopes hover:text-arctic hover:bg-mountainside/40'
          }`}
        >
          <BookOpen className="w-4 h-4 text-cyan-400" />
          Free Explore Lab
        </button>

        <button
          type="button"
          onClick={() => dispatch(setTutorialMode(true))}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            tutorialMode
              ? 'bg-mountainside text-arctic border border-apres/50 shadow-soft'
              : 'text-slopes hover:text-arctic hover:bg-mountainside/40'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          15-Step Tutorial
        </button>
      </div>

      {/* Guided Tutorial Mode Card */}
      {tutorialMode ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-midnight border border-mountainside/80 rounded-2xl p-5 shadow-hard space-y-4 relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
              Lesson {currentTutorialStep + 1} / {TUTORIAL_STEPS.length}
            </span>
            {isVerified && (
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                <CheckCircle className="w-3.5 h-3.5" />
                Completed
              </span>
            )}
          </div>

          <div>
            <h3 className="text-base font-bold text-arctic tracking-tight">{activeTutorial.title}</h3>
            <p className="text-xs text-slopes font-medium mt-0.5">{activeTutorial.subtitle}</p>
          </div>

          <div className="bg-mountainside/50 border border-apres/30 p-3 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-arctic">
              <Target className="w-4 h-4 text-cyan-400 shrink-0" />
              Objective
            </div>
            <p className="text-xs text-slopes leading-relaxed">{activeTutorial.objective}</p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-arctic">
              <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
              Educational Concept
            </div>
            <p className="text-xs text-slopes leading-relaxed">{activeTutorial.concept}</p>
          </div>

          <div className="bg-cyan-950/30 border border-cyan-500/20 p-3 rounded-xl text-xs text-cyan-300 flex items-start gap-2">
            <HelpCircle className="w-4 h-4 shrink-0 text-cyan-400 mt-0.5" />
            <div>
              <span className="font-semibold text-cyan-200">Interactive Hint: </span>
              {activeTutorial.hint}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-mountainside/80">
            <button
              type="button"
              onClick={handlePrevTutorialStep}
              disabled={currentTutorialStep === 0}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slopes hover:text-arctic hover:bg-mountainside/50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              Previous
            </button>

            <button
              type="button"
              onClick={handleNextTutorialStep}
              disabled={currentTutorialStep >= TUTORIAL_STEPS.length - 1}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-arctic text-midnight hover:bg-slopes transition-all shadow-soft flex items-center gap-1 disabled:opacity-50"
            >
              Next Lesson
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      ) : (
        /* Action Card: Save Experiment & Download PDF Report */
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-midnight border border-mountainside rounded-2xl p-5 shadow-hard space-y-3"
        >
          <div className="flex items-center justify-between border-b border-mountainside pb-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
              <Save className="w-4 h-4" />
              Experiment & Report Actions
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              +50 XP
            </span>
          </div>

          <div className="space-y-2">
            <Button
              variant="primary"
              onClick={handleSaveExperiment}
              isLoading={saving}
              className="w-full justify-center bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs py-2.5 shadow-soft cursor-pointer"
              icon={<Save className="w-4 h-4" />}
            >
              Save Experiment to MongoDB
            </Button>

            <Button
              variant="outline"
              onClick={() => setShowReportModal(true)}
              className="w-full justify-center text-xs font-bold py-2.5 border-mountainside text-arctic hover:bg-mountainside/60 cursor-pointer"
              icon={<FileText className="w-4 h-4 text-cyan-400" />}
            >
              Download Detailed Report (PDF) 📄
            </Button>
          </div>
        </motion.div>
      )}

      {/* Universal Detailed Report Modal */}
      {showReportModal && (
        <UniversalReportModal algorithm="gradient-descent" onClose={() => setShowReportModal(false)} />
      )}
    </div>
  );
};
