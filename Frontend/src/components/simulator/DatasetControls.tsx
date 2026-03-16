import React from 'react';
import { DatasetConfig } from '../../algorithms/types';

interface DatasetControlsProps {
  value: DatasetConfig;
  onChange: (next: DatasetConfig) => void;
  onRandomize: () => void;
}

const DatasetControls: React.FC<DatasetControlsProps> = ({ value, onChange, onRandomize }) => {
  return (
    <section className="rounded-xl border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 p-4">
      <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-50 mb-3">Dataset Controls</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-secondary-600 dark:text-secondary-300 mb-1">Sample Dataset</label>
          <select
            value={value.preset}
            onChange={(event) => onChange({ ...value, preset: event.target.value as DatasetConfig['preset'] })}
            className="w-full rounded-lg border border-secondary-300 dark:border-secondary-600 bg-secondary-50 dark:bg-secondary-900 px-3 py-2 text-sm"
          >
            <option value="random">Random</option>
            <option value="blobs">Blobs</option>
            <option value="line">Line</option>
            <option value="classification">Classification</option>
            <option value="moons">Moons</option>
          </select>
        </div>
        <div>
          <label className="flex justify-between text-sm text-secondary-600 dark:text-secondary-300 mb-1">
            <span>Dataset Size</span>
            <span className="font-medium">{value.size}</span>
          </label>
          <input
            type="range"
            min={80}
            max={1200}
            step={10}
            value={value.size}
            onChange={(event) => onChange({ ...value, size: Number(event.target.value) })}
            className="w-full accent-primary-600"
          />
        </div>
        <div>
          <label className="flex justify-between text-sm text-secondary-600 dark:text-secondary-300 mb-1">
            <span>Noise Level</span>
            <span className="font-medium">{value.noise.toFixed(2)}</span>
          </label>
          <input
            type="range"
            min={0.05}
            max={1}
            step={0.01}
            value={value.noise}
            onChange={(event) => onChange({ ...value, noise: Number(event.target.value) })}
            className="w-full accent-primary-600"
          />
        </div>
        <button
          type="button"
          onClick={onRandomize}
          className="w-full rounded-lg border border-primary-500 text-primary-600 dark:text-primary-300 px-4 py-2 font-semibold hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
        >
          Randomize Dataset
        </button>
      </div>
    </section>
  );
};

export default DatasetControls;
