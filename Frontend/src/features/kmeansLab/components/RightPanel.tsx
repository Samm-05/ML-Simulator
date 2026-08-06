import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { saveKMeansExperiment, CLUSTER_COLORS } from '../kmeansSlice';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { toast } from 'react-hot-toast';
import {
  Activity,
  Award,
  CheckCircle,
  FileText,
  Save,
  BarChart2,
  PieChart,
  Target,
  Sparkles,
  TrendingDown,
  Clock,
} from 'lucide-react';
import { ExperimentReportModal } from './ExperimentReportModal';

export const RightPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const kmeans = useAppSelector((state) => state.kmeans);
  const [showReportModal, setShowReportModal] = useState(false);

  const handleSave = async () => {
    const toastId = toast.loading('Saving K-Means experiment to MongoDB...');
    try {
      await dispatch(saveKMeansExperiment()).unwrap();
      toast.success('Experiment & progress saved successfully! +50 XP awarded.', { id: toastId });
    } catch (err: any) {
      toast.error(err || 'Failed to save experiment', { id: toastId });
    }
  };

  // Compute Cluster Distribution
  const clusterCounts: { [key: number]: number } = {};
  for (let i = 0; i < kmeans.k; i++) clusterCounts[i] = 0;
  kmeans.dataPoints.forEach((p) => {
    if (p.cluster >= 0) clusterCounts[p.cluster] = (clusterCounts[p.cluster] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      {/* Live Metrics Panel Card */}
      <Card className="p-5 space-y-4 border-mountainside bg-midnight/90 backdrop-blur-xl shadow-hard">
        <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm uppercase tracking-wider">
          <Activity className="w-4 h-4" />
          <span>Live Metrics Panel</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-mountainside/40 border border-mountainside">
            <p className="text-[10px] uppercase font-mono text-apres">Iteration</p>
            <p className="text-lg font-bold font-mono text-arctic">
              {kmeans.currentStep} / {kmeans.maxIterations}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-mountainside/40 border border-mountainside">
            <p className="text-[10px] uppercase font-mono text-apres">WCSS / Inertia</p>
            <p className="text-lg font-bold font-mono text-indigo-400">
              {kmeans.wcss > 0 ? kmeans.wcss.toFixed(1) : '0.0'}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-mountainside/40 border border-mountainside">
            <p className="text-[10px] uppercase font-mono text-apres">Silhouette Score</p>
            <p className="text-lg font-bold font-mono text-emerald-400">
              {kmeans.silhouetteScore.toFixed(2)}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-mountainside/40 border border-mountainside">
            <p className="text-[10px] uppercase font-mono text-apres">Convergence Status</p>
            <p className="text-xs font-bold font-mono mt-1">
              {kmeans.isConverged ? (
                <span className="text-emerald-400">✓ Converged</span>
              ) : kmeans.isPlaying ? (
                <span className="text-amber-400 animate-pulse">● Running</span>
              ) : (
                <span className="text-apres">Pending</span>
              )}
            </p>
          </div>
        </div>

        {/* Action Buttons: Save & Export Report */}
        <div className="space-y-2 pt-2 border-t border-mountainside">
          <Button
            variant="primary"
            className="w-full justify-center bg-indigo-600 hover:bg-indigo-500 text-xs font-bold py-2.5"
            onClick={handleSave}
            isLoading={kmeans.isSaving}
            icon={<Save className="w-4 h-4" />}
          >
            Save Experiment to MongoDB
          </Button>

          <Button
            variant="outline"
            className="w-full justify-center text-xs font-bold py-2.5"
            onClick={() => setShowReportModal(true)}
            icon={<FileText className="w-4 h-4 text-cyan-400" />}
          >
            Generate PDF Experiment Report
          </Button>
        </div>
      </Card>

      {/* Cluster Distribution & Legend Panel */}
      <Card className="p-5 space-y-4 border-mountainside bg-midnight/90 backdrop-blur-xl shadow-hard">
        <div className="flex items-center space-x-2 text-purple-400 font-bold text-sm uppercase tracking-wider">
          <PieChart className="w-4 h-4" />
          <span>Cluster Distribution</span>
        </div>

        <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
          {kmeans.centroids.map((c, idx) => {
            const count = clusterCounts[c.id] || 0;
            const pct = kmeans.dataPoints.length > 0 ? ((count / kmeans.dataPoints.length) * 100).toFixed(1) : '0';

            return (
              <div
                key={c.id}
                className="p-2.5 rounded-xl bg-mountainside/30 border border-mountainside flex items-center justify-between text-xs"
              >
                <div className="flex items-center space-x-2.5">
                  <span
                    className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: c.color }}
                  />
                  <div>
                    <p className="font-bold text-arctic">Cluster {c.id + 1}</p>
                    <p className="text-[10px] text-apres font-mono">
                      Mean: ({c.x.toFixed(1)}, {c.y.toFixed(1)})
                    </p>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <p className="font-bold text-arctic">{count} pts</p>
                  <p className="text-[10px] text-indigo-300">{pct}%</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Report Modal Component */}
      {showReportModal && (
        <ExperimentReportModal onClose={() => setShowReportModal(false)} />
      )}
    </div>
  );
};

export default RightPanel;
