import React from 'react';
import { useAppSelector } from '../../../app/hooks';
import { X, Printer, Download, Sparkles, CheckCircle } from 'lucide-react';
import Button from '../../../components/ui/Button';

interface Props {
  onClose: () => void;
}

export const ExperimentReportModal: React.FC<Props> = ({ onClose }) => {
  const { user } = useAppSelector((state) => state.auth);
  const kmeans = useAppSelector((state) => state.kmeans);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-midnight border border-mountainside rounded-2xl p-6 space-y-6 shadow-2xl text-arctic print:text-black print:bg-white print:p-0 print:border-none">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-mountainside pb-4 print:hidden">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold">K-Means Experiment Report</h2>
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
              <h1 className="text-xl font-bold text-indigo-400 print:text-black">ML Visual Lab Studio</h1>
              <p className="text-apres">K-Means Clustering Laboratory Report</p>
            </div>
            <div className="text-right text-apres">
              <p>Student: <strong className="text-arctic print:text-black">{user?.firstName || 'Learner'} {user?.lastName || ''}</strong></p>
              <p>Date: {new Date().toLocaleDateString()}</p>
              <p>Status: <span className="text-emerald-400 font-bold print:text-black">Completed</span></p>
            </div>
          </div>

          {/* Configuration Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-xl bg-mountainside/30 border border-mountainside print:bg-gray-100 print:border-gray-300">
            <div>
              <p className="text-apres text-[10px]">Dataset Preset</p>
              <p className="font-bold capitalize">{kmeans.datasetPreset}</p>
            </div>
            <div>
              <p className="text-apres text-[10px]">Total Points</p>
              <p className="font-bold">{kmeans.dataPoints.length}</p>
            </div>
            <div>
              <p className="text-apres text-[10px]">Number of K</p>
              <p className="font-bold">{kmeans.k}</p>
            </div>
            <div>
              <p className="text-apres text-[10px]">Init Method</p>
              <p className="font-bold">{kmeans.initializationMethod}</p>
            </div>
          </div>

          {/* Metrics */}
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-indigo-300 print:text-black">Performance Results</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-mountainside/20 border border-mountainside print:border-gray-300">
                <p className="text-[10px] text-apres">Final WCSS (Inertia)</p>
                <p className="text-base font-bold font-mono text-indigo-400 print:text-black">{kmeans.wcss.toFixed(2)}</p>
              </div>
              <div className="p-3 rounded-xl bg-mountainside/20 border border-mountainside print:border-gray-300">
                <p className="text-[10px] text-apres">Silhouette Score</p>
                <p className="text-base font-bold font-mono text-emerald-400 print:text-black">{kmeans.silhouetteScore.toFixed(2)}</p>
              </div>
              <div className="p-3 rounded-xl bg-mountainside/20 border border-mountainside print:border-gray-300">
                <p className="text-[10px] text-apres">Total Iterations</p>
                <p className="text-base font-bold font-mono text-arctic print:text-black">{kmeans.currentStep}</p>
              </div>
            </div>
          </div>

          {/* Final Centroids Table */}
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-indigo-300 print:text-black">Final Centroid Coordinates</h3>
            <table className="w-full text-left border-collapse border border-mountainside print:border-gray-300">
              <thead>
                <tr className="bg-mountainside/50 print:bg-gray-200 text-apres text-[10px]">
                  <th className="p-2 border border-mountainside print:border-gray-300">Cluster</th>
                  <th className="p-2 border border-mountainside print:border-gray-300">Centroid (X, Y)</th>
                  <th className="p-2 border border-mountainside print:border-gray-300">Points Assigned</th>
                </tr>
              </thead>
              <tbody>
                {kmeans.centroids.map((c) => {
                  const count = kmeans.dataPoints.filter((p) => p.cluster === c.id).length;
                  return (
                    <tr key={c.id} className="border-t border-mountainside/40 print:border-gray-300">
                      <td className="p-2 font-bold">Cluster {c.id + 1}</td>
                      <td className="p-2 font-mono">({c.x.toFixed(2)}, {c.y.toFixed(2)})</td>
                      <td className="p-2 font-mono">{count} points</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-mountainside print:hidden">
          <Button variant="outline" onClick={onClose} className="text-xs">
            Close
          </Button>
          <Button variant="primary" onClick={handlePrint} className="text-xs bg-indigo-600 hover:bg-indigo-500" icon={<Printer className="w-4 h-4" />}>
            Print / Export PDF
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExperimentReportModal;
