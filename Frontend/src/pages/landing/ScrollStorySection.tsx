import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Layers, TrendingUp, GitBranch, PieChart, Activity } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface StoryStep {
  id: string;
  title: string;
  subtitle: string;
  icon: React.FC<{ className?: string }>;
  math: string;
  description: string;
  gradient: string;
  visualSnippet: React.FC;
}

const storySteps: StoryStep[] = [
  {
    id: 'gradient-descent',
    title: '1. Gradient Descent',
    subtitle: 'Navigating Loss Surfacess',
    icon: TrendingUp,
    math: 'w_t+1 = w_t - α ∇J(w_t)',
    description: 'Calculates the negative gradient vector at the current parameter coordinates and steps iteratively down the loss basin.',
    gradient: 'from-indigo-500 to-purple-600',
    visualSnippet: () => (
      <div className="w-full h-48 rounded-2xl bg-secondary-950 p-4 border border-secondary-800 flex flex-col justify-center items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent" />
        <svg className="w-full h-32" viewBox="0 0 300 120">
          <path d="M 20 20 Q 150 120 280 20" stroke="#6366f1" strokeWidth="3" fill="none" />
          <circle cx="90" cy="72" r="8" fill="#14b8a6" className="animate-pulse" />
          <line x1="90" y1="72" x2="130" y2="92" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" />
        </svg>
        <span className="text-[10px] font-mono text-secondary-400 mt-2">Loss Minimization Trajectory</span>
      </div>
    ),
  },
  {
    id: 'decision-boundary',
    title: '2. Decision Boundaries',
    subtitle: 'Hyperplane Class Separation',
    icon: Activity,
    math: 'w₁x₁ + w₂x₂ + b = 0',
    description: 'Finds an optimal linear or non-linear hyperplane boundary that separates feature data into discrete target classes.',
    gradient: 'from-teal-400 to-emerald-600',
    visualSnippet: () => (
      <div className="w-full h-48 rounded-2xl bg-secondary-950 p-4 border border-secondary-800 flex flex-col justify-center items-center relative overflow-hidden">
        <svg className="w-full h-32" viewBox="0 0 300 120">
          {/* Blue Class Points */}
          <circle cx="60" cy="40" r="5" fill="#38bdf8" />
          <circle cx="80" cy="30" r="5" fill="#38bdf8" />
          <circle cx="100" cy="60" r="5" fill="#38bdf8" />
          {/* Red Class Points */}
          <circle cx="180" cy="80" r="5" fill="#ef4444" />
          <circle cx="200" cy="95" r="5" fill="#ef4444" />
          <circle cx="230" cy="70" r="5" fill="#ef4444" />
          {/* Decision Boundary Line */}
          <line x1="40" y1="100" x2="260" y2="20" stroke="#14b8a6" strokeWidth="3" />
        </svg>
        <span className="text-[10px] font-mono text-secondary-400 mt-2">Binary Hyperplane Separation</span>
      </div>
    ),
  },
  {
    id: 'clusters',
    title: '3. Spatial Clustering',
    subtitle: 'Centroid Voronoi Tesselation',
    icon: Layers,
    math: 'min ∑ ||x_i - μ_k||²',
    description: 'Groups unlabeled data points around dynamic centroid anchors by minimizing within-cluster distance metrics.',
    gradient: 'from-amber-400 to-orange-600',
    visualSnippet: () => (
      <div className="w-full h-48 rounded-2xl bg-secondary-950 p-4 border border-secondary-800 flex flex-col justify-center items-center relative overflow-hidden">
        <svg className="w-full h-32" viewBox="0 0 300 120">
          <circle cx="80" cy="50" r="22" fill="#6366f1" fillOpacity="0.15" stroke="#6366f1" strokeDasharray="2 2" />
          <circle cx="80" cy="50" r="4" fill="#6366f1" />

          <circle cx="210" cy="70" r="28" fill="#14b8a6" fillOpacity="0.15" stroke="#14b8a6" strokeDasharray="2 2" />
          <circle cx="210" cy="70" r="4" fill="#14b8a6" />
        </svg>
        <span className="text-[10px] font-mono text-secondary-400 mt-2">Iterative Centroid Convergence</span>
      </div>
    ),
  },
  {
    id: 'tree-growth',
    title: '4. Decision Tree Splitting',
    subtitle: 'Recursive Information Gain',
    icon: GitBranch,
    math: 'Gain = H(Parent) - ∑ pᵢ H(Child)',
    description: 'Recursively partitions dataset based on maximum information gain or Gini impurity reduction thresholds.',
    gradient: 'from-purple-500 to-pink-600',
    visualSnippet: () => (
      <div className="w-full h-48 rounded-2xl bg-secondary-950 p-4 border border-secondary-800 flex flex-col justify-center items-center relative overflow-hidden">
        <svg className="w-full h-32" viewBox="0 0 300 120">
          <circle cx="150" cy="25" r="8" fill="#a855f7" />
          <line x1="150" y1="25" x2="90" y2="65" stroke="#64748b" strokeWidth="2" />
          <line x1="150" y1="25" x2="210" y2="65" stroke="#64748b" strokeWidth="2" />
          <circle cx="90" cy="65" r="7" fill="#38bdf8" />
          <circle cx="210" cy="65" r="7" fill="#38bdf8" />
        </svg>
        <span className="text-[10px] font-mono text-secondary-400 mt-2">Hierarchical Decision Hierarchy</span>
      </div>
    ),
  },
  {
    id: 'pca',
    title: '5. PCA Dimensionality Reduction',
    subtitle: 'Principal Axis Variance Alignment',
    icon: PieChart,
    math: 'Σ v = λ v',
    description: 'Identifies orthogonal directions of maximum variance to compress high-dimensional feature spaces.',
    gradient: 'from-sky-400 to-blue-600',
    visualSnippet: () => (
      <div className="w-full h-48 rounded-2xl bg-secondary-950 p-4 border border-secondary-800 flex flex-col justify-center items-center relative overflow-hidden">
        <svg className="w-full h-32" viewBox="0 0 300 120">
          <line x1="50" y1="100" x2="250" y2="20" stroke="#38bdf8" strokeWidth="3" />
          <line x1="90" y1="20" x2="210" y2="100" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 3" />
        </svg>
        <span className="text-[10px] font-mono text-secondary-400 mt-2">Eigenvector Projection Vectors</span>
      </div>
    ),
  },
];

export const ScrollStorySection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      storySteps.forEach((step, index) => {
        ScrollTrigger.create({
          trigger: `#story-card-${index}`,
          start: 'top 60%',
          end: 'bottom 40%',
          onEnter: () => setActiveStepIndex(index),
          onEnterBack: () => setActiveStepIndex(index),
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const activeStep = storySteps[activeStepIndex];

  return (
    <section ref={containerRef} className="py-24 bg-secondary-950 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs font-semibold tracking-widest uppercase text-accent-400">
            Scroll Driven Storytelling
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mt-2">
            Watch How Algorithms Think
          </h2>
          <p className="mt-4 text-secondary-300 text-base sm:text-lg">
            As you scroll, explore how raw mathematics converts into visual geometric updates.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Scrollable Story Cards Column */}
          <div className="lg:col-span-6 space-y-16">
            {storySteps.map((step, index) => {
              const Icon = step.icon;
              const isActive = activeStepIndex === index;

              return (
                <div
                  key={step.id}
                  id={`story-card-${index}`}
                  className={`p-8 rounded-3xl border transition-all duration-500 ${
                    isActive
                      ? 'bg-secondary-900 border-primary-500/80 shadow-[0_0_30px_rgba(99,102,241,0.2)]'
                      : 'bg-secondary-900/40 border-secondary-800 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${step.gradient} text-white`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-mono text-secondary-400 uppercase tracking-widest">
                        {step.subtitle}
                      </span>
                      <h3 className="text-2xl font-bold text-white">{step.title}</h3>
                    </div>
                  </div>

                  <p className="text-secondary-300 text-base leading-relaxed mb-6">
                    {step.description}
                  </p>

                  <div className="p-4 rounded-xl bg-secondary-950 border border-secondary-800 font-mono text-sm text-primary-300">
                    {step.math}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sticky Visual Preview Column */}
          <div className="lg:col-span-6 sticky top-28">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="p-8 rounded-3xl bg-secondary-900 border border-secondary-800 shadow-2xl backdrop-blur-xl relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-accent-400" />
                    <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      Live Concept Geometry
                    </span>
                  </div>
                  <span className="text-xs font-mono px-3 py-1 rounded-full bg-secondary-800 text-secondary-300">
                    Module 0{activeStepIndex + 1} / 05
                  </span>
                </div>

                <h4 className="text-xl font-bold text-white mb-2">{activeStep.title}</h4>
                <p className="text-xs text-secondary-400 mb-6">{activeStep.subtitle}</p>

                {/* Render Mini Visual Canvas */}
                <activeStep.visualSnippet />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScrollStorySection;
