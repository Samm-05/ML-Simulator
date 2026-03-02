import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, ArrowRight } from 'lucide-react';
import Card from '../../components/ui/Card';

interface StepExplanationPanelProps {
  algorithm: string;
  step: number;
}

const StepExplanationPanel: React.FC<StepExplanationPanelProps> = ({ algorithm, step }) => {
  const getExplanation = () => {
    const explanations: Record<string, string[]> = {
      'linear-regression': [
        'Initialize random weights and bias',
        'Forward pass: calculate predictions',
        'Compute loss using MSE',
        'Backward pass: calculate gradients',
        'Update parameters using gradient descent',
        'Check convergence',
      ],
      'kmeans': [
        'Randomly initialize K centroids',
        'Assign each point to nearest centroid',
        'Update centroids to cluster means',
        'Check if centroids moved',
        'Repeat until convergence',
      ],
      'decision-tree': [
        'Start with all data at root node',
        'Find best feature to split on',
        'Split data into child nodes',
        'Check if node is pure or max depth reached',
        'Repeat recursively for each child',
      ],
    };

    return explanations[algorithm]?.[step] || 'Step explanation not available';
  };

  return (
    <Card className="p-6 h-full">
      <div className="flex items-center space-x-2 mb-4">
        <Lightbulb className="w-5 h-5 text-warning" />
        <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">Step {step + 1}</h2>
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="text-secondary-600 dark:text-secondary-400"
        >
          {getExplanation()}
        </motion.p>
      </AnimatePresence>

      <div className="flex items-center space-x-2 text-sm text-primary-600 mt-4">
        <ArrowRight className="w-4 h-4" />
        <span>Next: {getExplanation()}</span>
      </div>
    </Card>
  );
};

export default StepExplanationPanel;