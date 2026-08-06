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
import { UniversalReportModal } from '../../../components/reports/UniversalReportModal';

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
      const msg = typeof err === 'string' ? err : (err?.message || 'Failed to save experiment');
      toast.error(msg, { id: toastId });
    }
  };

  // Compute Cluster Distribution
  const clusterCounts: { [key: number]: number } = {};
  for (let i = 0; i < kmeans.k; i++) clusterCounts[i] = 0;
  kmeans.dataPoints.forEach((p) => {
    if (p.cluster >= 0) clusterCounts[p.cluster] = (clusterCounts[p.cluster] || 0) + 1;
  });

  return (
    <div className="space-y-6 select-none">
      {/* Live Metrics Panel Card */}
      <Card className="p-5 space-y-4 border-mountainside bg-midnight/90 backdrop-blur-xl shadow-hard">
        <div className="flex items-center justify-between border-b border-mountainside pb-2">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm uppercase tracking-wider">
            <Activity className="w-4 h-4" />
            <span>Live Metrics Panel</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            +50 XP
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-mountainside/40 border border-mountainside">
            <p className="text-[10px] uppercase font-mono text-apres">Iteration</p>
            <p className="text-lg font-bold font-mono text-arctic">
              {kmeans.currentStep} / {kmeans.maxIterations}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-mountainside/40 border border-mountainside">
            <p className="text-[10px] uppercase font-mono text-apres">Status</p>
            <p className="text-sm font-bold font-mono text-cyan-400 capitalize">
              {kmeans.status}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-mountainside/40 border border-mountainside">
            <p className="text-[10px] uppercase font-mono text-apres">WCSS (Inertia)</p>
            <p className="text-base font-bold font-mono text-indigo-400">
              {kmeans.wcss.toFixed(2)}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-mountainside/40 border border-mountainside">
            <p className="text-[10px] uppercase font-mono text-apres">Silhouette</p>
            <p className="text-base font-bold font-mono text-emerald-400">
              {kmeans.silhouetteScore.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2 border-t border-mountainside">
          <Button
            variant="primary"
            className="w-full justify-center bg-indigo-600 hover:bg-indigo-500 text-xs font-bold py-2.5 shadow-soft cursor-pointer"
            onClick={handleSave}
            isLoading={kmeans.isSaving}
            icon={<Save className="w-4 h-4" />}
          >
            Save Experiment to MongoDB
          </Button>

          <Button
            variant="outline"
            className="w-full justify-center text-xs font-bold py-2.5 border-mountainside text-arctic hover:bg-mountainside/60 cursor-pointer"
            onClick={() => setShowReportModal(true)}
            icon={<FileText className="w-4 h-4 text-cyan-400" />}
          >
            Download Detailed Report (PDF) 📄
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

      {/* Universal Detailed Report Modal */}
      {showReportModal && (
        <UniversalReportModal algorithm="kmeans" onClose={() => setShowReportModal(false)} />
      )}
    </div>
  );
};

export default RightPanel;
