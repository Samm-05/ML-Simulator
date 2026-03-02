import React from 'react';
import { motion } from 'framer-motion';
import { Sliders, Play, Pause, RotateCcw, Settings } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  updateParameter,
  runSimulation,
  pauseSimulation,
  resetSimulation,
} from './simulatorSlice';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const SimulationControls: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentAlgorithm, parameters, isRunning } = useAppSelector(
    (state) => state.simulator
  );

  const handleParameterChange = (param: string, value: any) => {
    dispatch(updateParameter({ param, value }));
  };

  const handleRun = () => {
    dispatch(runSimulation());
  };

  const handlePause = () => {
    dispatch(pauseSimulation());
  };

  const handleReset = () => {
    dispatch(resetSimulation());
  };

  const renderParameters = () => {
    switch (currentAlgorithm) {
      case 'linear-regression':
        return (
          <>
            <div className="space-y-2">
              <label className="text-sm text-secondary-600 dark:text-secondary-400">
                Learning Rate: {parameters.learningRate}
              </label>
              <input
                type="range"
                min="0.001"
                max="1"
                step="0.001"
                value={parameters.learningRate}
                onChange={(e) => handleParameterChange('learningRate', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-secondary-600 dark:text-secondary-400">
                Epochs: {parameters.epochs}
              </label>
              <input
                type="range"
                min="10"
                max="200"
                step="10"
                value={parameters.epochs}
                onChange={(e) => handleParameterChange('epochs', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-secondary-600 dark:text-secondary-400">
                Noise: {parameters.noise}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={parameters.noise}
                onChange={(e) => handleParameterChange('noise', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </>
        );

      case 'kmeans':
        return (
          <>
            <div className="space-y-2">
              <label className="text-sm text-secondary-600 dark:text-secondary-400">
                Number of Clusters (K): {parameters.k}
              </label>
              <input
                type="range"
                min="2"
                max="8"
                step="1"
                value={parameters.k}
                onChange={(e) => handleParameterChange('k', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-secondary-600 dark:text-secondary-400">
                Max Iterations: {parameters.maxIterations}
              </label>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={parameters.maxIterations}
                onChange={(e) => handleParameterChange('maxIterations', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </>
        );

      case 'decision-tree':
        return (
          <>
            <div className="space-y-2">
              <label className="text-sm text-secondary-600 dark:text-secondary-400">
                Max Depth: {parameters.maxDepth}
              </label>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={parameters.maxDepth}
                onChange={(e) => handleParameterChange('maxDepth', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-secondary-600 dark:text-secondary-400">
                Min Samples Split: {parameters.minSamplesSplit}
              </label>
              <input
                type="range"
                min="2"
                max="20"
                step="1"
                value={parameters.minSamplesSplit}
                onChange={(e) => handleParameterChange('minSamplesSplit', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-secondary-600 dark:text-secondary-400">
                Criterion:
              </span>
              <select
                value={parameters.criterion}
                onChange={(e) => handleParameterChange('criterion', e.target.value)}
                className="px-3 py-1 bg-secondary-50 dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-lg text-sm"
              >
                <option value="gini">Gini</option>
                <option value="entropy">Entropy</option>
              </select>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
          Controls
        </h2>
        <Settings className="w-5 h-5 text-secondary-400" />
      </div>

      <div className="space-y-6">
        {/* Parameters */}
        <div className="space-y-4">
          {renderParameters()}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant={isRunning ? 'secondary' : 'primary'}
            onClick={isRunning ? handlePause : handleRun}
            className="col-span-1"
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <Button
            variant="secondary"
            onClick={handleReset}
            className="col-span-1"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button
            variant="secondary"
            className="col-span-1"
          >
            <Sliders className="w-4 h-4" />
          </Button>
        </div>

        {/* Current Step */}
        <div className="p-3 bg-secondary-50 dark:bg-secondary-900 rounded-lg">
          <p className="text-sm text-secondary-600 dark:text-secondary-400">
            Current Step
          </p>
          <p className="text-lg font-semibold text-secondary-900 dark:text-white">
            {parameters.epochs || parameters.maxIterations || 50}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default SimulationControls;