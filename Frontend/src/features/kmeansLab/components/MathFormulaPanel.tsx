import React from 'react';
import { useAppSelector } from '../../../app/hooks';
import Card from '../../../components/ui/Card';
import { BookOpen, Calculator, Sparkles } from 'lucide-react';

export const MathFormulaPanel: React.FC = () => {
  const kmeans = useAppSelector((state) => state.kmeans);

  return (
    <Card className="p-5 border-mountainside bg-midnight/90 backdrop-blur-xl shadow-hard space-y-4">
      <div className="flex items-center space-x-2 text-cyan-400 font-bold text-sm uppercase tracking-wider">
        <Calculator className="w-4 h-4" />
        <span>Mathematical Foundations of K-Means</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Formula 1: Euclidean Distance */}
        <div className="p-4 rounded-xl bg-mountainside/30 border border-mountainside space-y-2">
          <p className="text-xs font-bold text-indigo-300">1. Euclidean Distance Metric</p>
          <div className="p-2.5 rounded-lg bg-midnight/80 font-mono text-xs text-arctic text-center">
            d(p, c_k) = √[(x_p - x_ck)² + (y_p - y_ck)²]
          </div>
          <p className="text-[11px] text-apres leading-relaxed">
            Measures straight-line distance from point p to centroid c_k. Each point attaches to the centroid minimizing this distance.
          </p>
        </div>

        {/* Formula 2: Centroid Mean Update */}
        <div className="p-4 rounded-xl bg-mountainside/30 border border-mountainside space-y-2">
          <p className="text-xs font-bold text-emerald-300">2. Centroid Mean Recalculation</p>
          <div className="p-2.5 rounded-lg bg-midnight/80 font-mono text-xs text-arctic text-center">
            c_k⁽ᵗ⁺¹⁾ = (1 / |S_k|) Σ_(p ∈ S_k) p
          </div>
          <p className="text-[11px] text-apres leading-relaxed">
            Computes center of mass for set S_k of points assigned to cluster k by averaging coordinate positions.
          </p>
        </div>

        {/* Formula 3: Objective Function WCSS */}
        <div className="p-4 rounded-xl bg-mountainside/30 border border-mountainside space-y-2">
          <p className="text-xs font-bold text-purple-300">3. Within-Cluster Sum of Squares (WCSS)</p>
          <div className="p-2.5 rounded-lg bg-midnight/80 font-mono text-xs text-arctic text-center">
            WCSS = Σ_(k=1..K) Σ_(p ∈ S_k) ||p - c_k||²
          </div>
          <p className="text-[11px] text-apres leading-relaxed">
            Objective function minimized iteratively until convergence. Current WCSS ={' '}
            <span className="font-bold text-indigo-400">{kmeans.wcss.toFixed(2)}</span>
          </p>
        </div>
      </div>
    </Card>
  );
};

export default MathFormulaPanel;
