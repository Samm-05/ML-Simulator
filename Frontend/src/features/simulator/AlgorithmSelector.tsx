import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Layers, GitBranch, Network } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { setAlgorithm } from './simulatorSlice';

const algorithms = [
  {
    id: 'linear-regression',
    name: 'Linear Regression',
    icon: Brain,
    description: 'Predict continuous values',
    color: 'from-primary-500 to-primary-600',
  },
  {
    id: 'kmeans',
    name: 'K-Means Clustering',
    icon: Layers,
    description: 'Group unlabeled data',
    color: 'from-accent-500 to-accent-600',
  },
  {
    id: 'decision-tree',
    name: 'Decision Tree',
    icon: GitBranch,
    description: 'Make hierarchical decisions',
    color: 'from-warning to-warning/80',
  },
  {
    id: 'neural-network',
    name: 'Neural Network',
    icon: Network,
    description: 'Deep learning basics',
    color: 'from-purple-500 to-purple-600',
  },
];

const AlgorithmSelector: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentAlgorithm } = useAppSelector((state) => state.simulator);

  return (
    <div className="space-y-3">
      {algorithms.map((algo) => {
        const Icon = algo.icon;
        const isSelected = currentAlgorithm === algo.id;

        return (
          <motion.button
            key={algo.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => dispatch(setAlgorithm(algo.id))}
            className={`
              w-full p-4 rounded-xl transition-all duration-200
              ${isSelected 
                ? `bg-gradient-to-r ${algo.color} text-white shadow-medium` 
                : 'bg-secondary-50 dark:bg-secondary-800 hover:bg-secondary-100 dark:hover:bg-secondary-700'
              }
            `}
          >
            <div className="flex items-center space-x-3">
              <div className={`
                p-2 rounded-lg
                ${isSelected 
                  ? 'bg-white/20' 
                  : `bg-gradient-to-r ${algo.color} bg-opacity-10`
                }
              `}>
                <Icon className={`
                  w-5 h-5
                  ${isSelected ? 'text-white' : 'text-primary-600'}
                `} />
              </div>
              <div className="flex-1 text-left">
                <h3 className={`
                  font-medium
                  ${isSelected ? 'text-white' : 'text-secondary-900 dark:text-white'}
                `}>
                  {algo.name}
                </h3>
                <p className={`
                  text-xs mt-0.5
                  ${isSelected ? 'text-white/80' : 'text-secondary-500 dark:text-secondary-400'}
                `}>
                  {algo.description}
                </p>
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
};

export default AlgorithmSelector;