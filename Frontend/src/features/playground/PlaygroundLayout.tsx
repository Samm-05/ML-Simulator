import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Brain,
  Sliders,
  Activity,
  Layers,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer';

export interface LabTab {
  id: string;
  name: string;
  shortName: string;
  path: string;
  icon: React.ElementType;
  color: string;
  badge: string;
  description: string;
}

export const LAB_TABS: LabTab[] = [
  {
    id: 'nn-lab',
    name: 'Neural Network Lab',
    shortName: 'NN Lab',
    path: '/playground/nn-lab',
    icon: Brain,
    color: 'text-purple-400 border-purple-500/40 bg-purple-500/10',
    badge: 'Deep Learning',
    description: 'Multi-layer perceptron, forward & backpropagation dynamics',
  },
  {
    id: 'linear-lab',
    name: 'Linear Regression Lab',
    shortName: 'Linear Lab',
    path: '/playground/linear-lab',
    icon: Sliders,
    color: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
    badge: 'Supervised',
    description: 'Hyperplane fitting, cost minimization & loss landscapes',
  },
  {
    id: 'logistic-lab',
    name: 'Logistic Regression Lab',
    shortName: 'Logistic Lab',
    path: '/playground/logistic-lab',
    icon: Activity,
    color: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10',
    badge: 'Classification',
    description: 'Sigmoid activation, log-loss & decision boundaries',
  },
  {
    id: 'gd-lab',
    name: 'Gradient Descent Lab',
    shortName: 'GD Lab',
    path: '/playground/gd-lab',
    icon: Layers,
    color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
    badge: 'Optimization',
    description: '3D loss surface optimization, learning rates & momentum',
  },
  {
    id: 'overfitting-lab',
    name: 'Overfitting & Regularization',
    shortName: 'Overfitting Lab',
    path: '/playground/overfitting-lab',
    icon: ShieldCheck,
    color: 'text-rose-400 border-rose-500/40 bg-rose-500/10',
    badge: 'Validation',
    description: 'Polynomial complexity, L1/L2 penalties & bias-variance',
  },
];

export const PlaygroundLayout: React.FC = () => {
  const location = useLocation();
  const currentTab = LAB_TABS.find((tab) => location.pathname.startsWith(tab.path)) || LAB_TABS[0];

  return (
    <PageContainer className="relative min-h-screen bg-midnight text-arctic py-4 px-4 space-y-6 font-sans select-none">
      {/* Playground Header & Hub Navigator */}
      <div className="bg-midnight/90 backdrop-blur-xl rounded-3xl border border-mountainside p-4 sm:p-6 shadow-hard space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-mountainside border border-apres/40 text-arctic shadow-soft">
              <Sparkles className="w-6 h-6 text-slopes" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-arctic tracking-tight">
                  ML Playground Workspace
                </h1>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-mountainside text-slopes border border-apres/30 uppercase tracking-wider">
                  Interactive Central Hub
                </span>
              </div>
              <p className="text-xs sm:text-sm font-mono text-apres mt-0.5">
                {currentTab.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-apres self-start md:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Active Lab: <strong className="text-arctic">{currentTab.name}</strong></span>
          </div>
        </div>

        {/* Lab Switcher Tab Bar */}
        <div className="flex items-center gap-2 p-1.5 bg-midnight rounded-2xl border border-mountainside overflow-x-auto scrollbar-hide">
          {LAB_TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <NavLink
                key={tab.id}
                to={tab.path}
                className={({ isActive }) =>
                  `relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 shrink-0 select-none ${
                    isActive
                      ? 'bg-mountainside text-arctic border border-apres/50 shadow-soft'
                      : 'text-slopes hover:text-arctic hover:bg-mountainside/50 border border-transparent'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-4 h-4 ${isActive ? 'text-arctic' : 'text-apres'}`} />
                    <span>{tab.shortName}</span>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full border ${tab.color}`}
                    >
                      {tab.badge}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="activeLabTab"
                        className="absolute inset-0 bg-mountainside/30 rounded-xl border border-apres/40 -z-10"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Render Active Lab Component */}
      <div className="w-full">
        <Outlet />
      </div>
    </PageContainer>
  );
};

export default PlaygroundLayout;
