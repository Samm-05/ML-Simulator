import React from 'react';
import { useAppSelector } from '../../../app/hooks';
import { X, Printer, Sparkles, CheckCircle, FileText } from 'lucide-react';
import Button from '../../../components/ui/Button';

interface Props {
  onClose: () => void;
}

export const LinearReportModal: React.FC<Props> = ({ onClose }) => {
  const { user } = useAppSelector((state) => state.auth);
  const lrState = useAppSelector((state) => state.linearRegression);

  const params = lrState?.params;
  const points = lrState?.points ?? [];
  const steps = lrState?.steps ?? [];
  const currentStepIndex = lrState?.currentStepIndex ?? 0;

  const currentStep = steps[currentStepIndex] || steps[0] || {
    w: 0,
    b: 0,
    mseLoss: 0,
    gradW: 0,
    gradB: 0,
  };

  const handlePrint = () => {
    window.print();
  };

  if (!params) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto select-none">
      <div className="relative w-full max-w-2xl bg-midnight border border-mountainside rounded-2xl p-6 space-y-6 shadow-2xl text-arctic print:text-black print:bg-white print:p-0 print:border-none">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-mountainside pb-4 print:hidden">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold">Linear Regression Experiment Report</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-mountainside/60 text-slopes hover:text-arctic transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Document Body */}
        <div className="space-y-4 text-xs leading-relaxed">
          <div className="flex justify-between items-start pb-4 border-b border-mountainside/50">
            <div>
              <h1 className="text-xl font-bold text-amber-400 print:text-black">ML Visual Lab Studio</h1>
              <p className="text-apres">Linear Regression Model Analysis Report</p>
            </div>
            <div className="text-right text-apres">
              <p>Student: <strong className="text-arctic print:text-black">{user?.firstName || 'Learner'} {user?.lastName || ''}</strong></p>
              <p>Date: {new Date().toLocaleDateString()}</p>
              <p>Status: <span className="text-emerald-400 font-bold print:text-black">Model Fit Completed</span></p>
            </div>
          </div>

          {/* Hyperparameter Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-xl bg-mountainside/30 border border-mountainside print:bg-gray-100 print:border-gray-300">
            <div>
              <p className="text-apres text-[10px]">Dataset Preset</p>
              <p className="font-bold capitalize">{params.preset || 'Synthetic'}</p>
            </div>
            <div>
              <p className="text-apres text-[10px]">Points Count</p>
              <p className="font-bold">{points.length}</p>
            </div>
            <div>
              <p className="text-apres text-[10px]">Learning Rate α</p>
              <p className="font-bold">{params.learningRate}</p>
            </div>
            <div>
              <p className="text-apres text-[10px]">Max Epochs</p>
              <p className="font-bold">{params.epochs}</p>
            </div>
          </div>

          {/* Model Fit Results */}
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-amber-300 print:text-black">Final Model Equation & Metrics</h3>
            <div className="p-3 rounded-xl bg-midnight/80 border border-amber-500/30 text-center font-mono text-sm text-amber-300 font-bold print:bg-gray-100 print:text-black">
              ŷ = {currentStep.w.toFixed(4)} · x + ({currentStep.b.toFixed(4)})
            </div>

            <div className="grid grid-cols-3 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-mountainside/20 border border-mountainside print:border-gray-300">
                <p className="text-[10px] text-apres">MSE Loss J(w,b)</p>
                <p className="text-base font-bold font-mono text-amber-400 print:text-black">{currentStep.mseLoss.toFixed(4)}</p>
              </div>
              <div className="p-3 rounded-xl bg-mountainside/20 border border-mountainside print:border-gray-300">
                <p className="text-[10px] text-apres">Final Slope Weight w</p>
                <p className="text-base font-bold font-mono text-cyan-400 print:text-black">{currentStep.w.toFixed(4)}</p>
              </div>
              <div className="p-3 rounded-xl bg-mountainside/20 border border-mountainside print:border-gray-300">
                <p className="text-[10px] text-apres">Final Intercept Bias b</p>
                <p className="text-base font-bold font-mono text-emerald-400 print:text-black">{currentStep.b.toFixed(4)}</p>
              </div>
            </div>
          </div>

          {/* Gradient Analysis */}
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-amber-300 print:text-black">Gradient Derivatives & Optimization</h3>
            <div className="grid grid-cols-2 gap-3 font-mono">
              <div className="p-2.5 rounded-xl bg-mountainside/30 border border-mountainside print:bg-gray-100">
                <span className="text-[10px] text-apres block">∂J / ∂w (Weight Gradient)</span>
                <span className="text-xs font-bold text-emerald-400 print:text-black">{currentStep.gradW.toFixed(6)}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-mountainside/30 border border-mountainside print:bg-gray-100">
                <span className="text-[10px] text-apres block">∂J / ∂b (Bias Gradient)</span>
                <span className="text-xs font-bold text-emerald-400 print:text-black">{currentStep.gradB.toFixed(6)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-mountainside print:hidden">
          <Button variant="outline" onClick={onClose} className="text-xs">
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handlePrint}
            className="text-xs bg-amber-500 hover:bg-amber-400 text-midnight font-bold"
            icon={<Printer className="w-4 h-4" />}
          >
            Download / Print PDF Report
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LinearReportModal;
