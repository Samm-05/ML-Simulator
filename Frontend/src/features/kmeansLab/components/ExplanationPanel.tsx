import React from 'react';
import Card from '../../../components/ui/Card';
import { BookOpen, Sparkles, Target, Zap, ShieldCheck } from 'lucide-react';

export const ExplanationPanel: React.FC = () => {
  return (
    <Card className="p-5 border-mountainside bg-midnight/90 backdrop-blur-xl shadow-hard space-y-4">
      <div className="flex items-center space-x-2 text-indigo-400 font-bold text-sm uppercase tracking-wider">
        <BookOpen className="w-4 h-4" />
        <span>Unsupervised Learning Concept Guide: K-Means Clustering</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slopes leading-relaxed">
        <div className="p-3.5 rounded-xl bg-mountainside/30 border border-mountainside space-y-1.5">
          <div className="flex items-center space-x-2 text-arctic font-bold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>1. What is K-Means Clustering?</span>
          </div>
          <p>
            K-Means is a foundational unsupervised machine learning algorithm designed to partition N unlabeled observations into K distinct clusters. Each observation is assigned to the cluster with the nearest mean centroid.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-mountainside/30 border border-mountainside space-y-1.5">
          <div className="flex items-center space-x-2 text-arctic font-bold">
            <Target className="w-3.5 h-3.5 text-cyan-400" />
            <span>2. Why KMeans++ Initialization?</span>
          </div>
          <p>
            Standard random initialization can lead to sub-optimal local minima. KMeans++ solves this by selecting initial centroids proportional to squared distance from existing centroids, spreading them out for faster convergence.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-mountainside/30 border border-mountainside space-y-1.5">
          <div className="flex items-center space-x-2 text-arctic font-bold">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>3. Voronoi Partitioning Geometry</span>
          </div>
          <p>
            The decision boundaries formed between centroids represent a Voronoi diagram. Every point inside a Voronoi cell is strictly closer to that cell's centroid than to any other centroid in the space.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-mountainside/30 border border-mountainside space-y-1.5">
          <div className="flex items-center space-x-2 text-arctic font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>4. Convergence Criteria</span>
          </div>
          <p>
            The algorithm terminates when either centroid positions stabilize (movement &lt; tolerance), cluster assignments stop changing, or the maximum iteration threshold is reached.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default ExplanationPanel;
