import React from 'react';
import { useParams } from 'react-router-dom';

const Simulator: React.FC = () => {
  const { algorithm } = useParams<{ algorithm: string }>();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-secondary-900 dark:text-white mb-6">
        ML Simulator: {algorithm || 'Select Algorithm'}
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Panel - Controls */}
        <div className="lg:col-span-1 bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">Controls</h2>
          <p className="text-secondary-600 dark:text-secondary-400">Simulation controls will appear here</p>
        </div>

        {/* Center Panel - Visualization */}
        <div className="lg:col-span-2 bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-soft min-h-[500px]">
          <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">Visualization</h2>
          <div className="flex items-center justify-center h-96 bg-secondary-50 dark:bg-secondary-900 rounded-lg">
            <p className="text-secondary-500">Visualization canvas will appear here</p>
          </div>
        </div>

        {/* Right Panel - Explanation */}
        <div className="lg:col-span-1 bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">Explanation</h2>
          <p className="text-secondary-600 dark:text-secondary-400">Step-by-step explanation will appear here</p>
        </div>
      </div>
    </div>
  );
};

export default Simulator;
