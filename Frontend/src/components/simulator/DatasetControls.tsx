import React from 'react';
import { DatasetConfig } from '../../algorithms/types';

interface DatasetControlsProps {
  value: DatasetConfig;
  onChange: (next: DatasetConfig) => void;
  onRandomize: () => void;
}

const DatasetControls: React.FC<DatasetControlsProps> = ({ value, onChange, onRandomize }) => {
  return (
    <section className="rounded-2xl border border-mountainside bg-secondary-900/90 backdrop-blur-xl p-4 shadow-soft">
      <h3 className="text-sm font-bold text-arctic uppercase tracking-wider mb-3">Dataset Config</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slopes mb-1.5">Preset Morphology</label>
          <select
            value={value.preset}
            onChange={(event) => onChange({ ...value, preset: event.target.value as DatasetConfig['preset'] })}
            className="w-full rounded-xl border border-mountainside bg-mountainside/50 px-3 py-2 text-xs font-mono text-arctic focus:outline-none focus:border-slopes"
          >
            <option value="random" className="bg-secondary-900">Random Distribution</option>
            <option value="blobs" className="bg-secondary-900">Gaussian Blobs</option>
            <option value="line" className="bg-secondary-900">Linear Manifold</option>
            <option value="classification" className="bg-secondary-900">Classification Space</option>
            <option value="moons" className="bg-secondary-900">Interlocking Moons</option>
          </select>
        </div>
        <div>
          <label className="flex justify-between text-xs font-medium text-slopes mb-1.5">
            <span>Sample Points</span>
            <span className="font-mono text-arctic font-bold">{value.size}</span>
          </label>
          <input
            type="range"
            min={80}
            max={1200}
            step={10}
            value={value.size}
            onChange={(event) => onChange({ ...value, size: Number(event.target.value) })}
            className="w-full accent-arctic bg-mountainside rounded-lg h-1.5"
          />
        </div>
        <div>
          <label className="flex justify-between text-xs font-medium text-slopes mb-1.5">
            <span>Noise Variance</span>
            <span className="font-mono text-arctic font-bold">{value.noise.toFixed(2)}</span>
          </label>
          <input
            type="range"
            min={0.05}
            max={1}
            step={0.01}
            value={value.noise}
            onChange={(event) => onChange({ ...value, noise: Number(event.target.value) })}
            className="w-full accent-arctic bg-mountainside rounded-lg h-1.5"
          />
        </div>
        <button
          type="button"
          onClick={onRandomize}
          className="w-full rounded-xl border border-apres text-arctic bg-mountainside/60 px-4 py-2 text-xs font-semibold hover:bg-mountainside hover:border-slopes transition-colors"
        >
          Reseed Random Points
        </button>
      </div>
    </section>
  );
};

export default DatasetControls;
