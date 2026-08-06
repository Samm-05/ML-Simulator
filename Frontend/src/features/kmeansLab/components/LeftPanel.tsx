import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  setK,
  setInitializationMethod,
  setDatasetPreset,
  setAnimationSpeed,
  toggleShowLabels,
  toggleShowVoronoi,
  toggleShowTrajectories,
  toggleAddPointMode,
  clearPoints,
  undoPoint,
  redoPoint,
  CLUSTER_COLORS,
} from '../kmeansSlice';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import {
  Sliders,
  Sparkles,
  PlusCircle,
  Trash2,
  RotateCcw,
  RotateCw,
  Eye,
  Layers,
  Network,
  Zap,
  Grid,
} from 'lucide-react';

export const LeftPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const kmeans = useAppSelector((state) => state.kmeans);

  const datasetPresets: Array<{
    id: typeof kmeans.datasetPreset;
    name: string;
    description: string;
  }> = [
    { id: 'separated', name: 'Separated Clusters', description: '3 well-isolated Gaussian blobs' },
    { id: 'overlapping', name: 'Overlapping Clusters', description: 'Clusters with merged boundaries' },
    { id: 'blobs', name: 'Gaussian Blobs', description: '4 distinct variance clusters' },
    { id: 'circular', name: 'Circular Clusters', description: 'Uniform radial distributions' },
    { id: 'concentric', name: 'Concentric Rings', description: 'Non-linearly separable rings' },
    { id: 'elongated', name: 'Elongated Clusters', description: 'Anisotropic linear strands' },
    { id: 'spiral', name: 'Spiral Pattern', description: 'Complex Archimedean spiral' },
    { id: 'random', name: 'Uniform Random', description: 'Uniform spatial distribution' },
    { id: 'noise', name: 'High Noise', description: 'Sparse noisy data points' },
  ];

  return (
    <div className="space-y-6">
      {/* Dataset Generator Presets Card */}
      <Card className="p-5 space-y-4 border-mountainside bg-midnight/90 backdrop-blur-xl shadow-hard">
        <div className="flex items-center space-x-2 text-indigo-400 font-bold text-sm uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Dataset Generator</span>
        </div>

        <div className="space-y-2 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
          {datasetPresets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => dispatch(setDatasetPreset(preset.id))}
              className={`
                w-full text-left p-2.5 rounded-xl border transition-all text-xs cursor-pointer flex justify-between items-center
                ${
                  kmeans.datasetPreset === preset.id
                    ? 'border-indigo-500 bg-indigo-500/10 text-arctic font-bold shadow-soft'
                    : 'border-mountainside hover:bg-mountainside/50 text-slopes hover:text-arctic'
                }
              `}
            >
              <div>
                <p className="font-semibold">{preset.name}</p>
                <p className="text-[10px] text-apres font-normal">{preset.description}</p>
              </div>
              {kmeans.datasetPreset === preset.id && (
                <span className="w-2 h-2 rounded-full bg-indigo-400 shrink-0 shadow-sm" />
              )}
            </button>
          ))}
        </div>
      </Card>

      {/* Point Editor Controls */}
      <Card className="p-5 space-y-4 border-mountainside bg-midnight/90 backdrop-blur-xl shadow-hard">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-cyan-400 font-bold text-sm uppercase tracking-wider">
            <Grid className="w-4 h-4" />
            <span>Interactive Point Editor</span>
          </div>
          <span className="text-xs font-mono text-apres">{kmeans.dataPoints.length} Points</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => dispatch(toggleAddPointMode())}
            className={`
              flex items-center justify-center space-x-1.5 p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer
              ${
                kmeans.addPointMode
                  ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                  : 'border-mountainside bg-mountainside/40 hover:bg-mountainside/80 text-slopes'
              }
            `}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{kmeans.addPointMode ? 'Click Canvas' : 'Add Point'}</span>
          </button>

          <button
            type="button"
            onClick={() => dispatch(clearPoints())}
            className="flex items-center justify-center space-x-1.5 p-2 rounded-xl text-xs font-bold border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
        </div>

        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => dispatch(undoPoint())}
            disabled={kmeans.historyStack.length === 0}
            className="flex-1 flex items-center justify-center space-x-1 p-1.5 rounded-lg border border-mountainside bg-mountainside/40 text-xs text-slopes hover:text-arctic disabled:opacity-40 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Undo</span>
          </button>
          <button
            type="button"
            onClick={() => dispatch(redoPoint())}
            disabled={kmeans.redoStack.length === 0}
            className="flex-1 flex items-center justify-center space-x-1 p-1.5 rounded-lg border border-mountainside bg-mountainside/40 text-xs text-slopes hover:text-arctic disabled:opacity-40 cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Redo</span>
          </button>
        </div>
      </Card>

      {/* Parameter Engine Card */}
      <Card className="p-5 space-y-5 border-mountainside bg-midnight/90 backdrop-blur-xl shadow-hard">
        <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm uppercase tracking-wider">
          <Sliders className="w-4 h-4" />
          <span>Parameter Engine</span>
        </div>

        {/* K Clusters Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slopes font-semibold">Number of Clusters (K):</span>
            <span className="font-mono font-bold text-indigo-400 text-sm">{kmeans.k}</span>
          </div>
          <input
            type="range"
            min={2}
            max={8}
            step={1}
            value={kmeans.k}
            onChange={(e) => dispatch(setK(Number(e.target.value)))}
            className="w-full h-1.5 bg-mountainside rounded-lg appearance-none cursor-pointer accent-indigo-400"
          />
          <div className="flex justify-between text-[10px] text-apres font-mono">
            <span>K=2</span>
            <span>K=5</span>
            <span>K=8</span>
          </div>
        </div>

        {/* Initialization Method Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slopes">Initialization Method:</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => dispatch(setInitializationMethod('kmeans++'))}
              className={`
                p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer
                ${
                  kmeans.initializationMethod === 'kmeans++'
                    ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300'
                    : 'border-mountainside bg-mountainside/40 text-apres hover:text-arctic'
                }
              `}
            >
              KMeans++ (Smart)
            </button>
            <button
              type="button"
              onClick={() => dispatch(setInitializationMethod('random'))}
              className={`
                p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer
                ${
                  kmeans.initializationMethod === 'random'
                    ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300'
                    : 'border-mountainside bg-mountainside/40 text-apres hover:text-arctic'
                }
              `}
            >
              Pure Random
            </button>
          </div>
        </div>

        {/* Animation Speed Selector */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slopes font-semibold">Animation Speed:</span>
            <span className="font-mono text-cyan-400 font-bold">{kmeans.animationSpeed}x</span>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {[0.5, 1, 1.5, 2].map((spd) => (
              <button
                key={spd}
                type="button"
                onClick={() => dispatch(setAnimationSpeed(spd))}
                className={`
                  py-1 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer
                  ${
                    kmeans.animationSpeed === spd
                      ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300'
                      : 'border-mountainside bg-mountainside/40 text-apres hover:text-arctic'
                  }
                `}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>

        {/* View Toggles */}
        <div className="space-y-2 pt-2 border-t border-mountainside">
          <p className="text-xs font-bold uppercase tracking-wider text-apres mb-2">Display Overlays</p>

          <label className="flex items-center justify-between text-xs text-slopes cursor-pointer hover:text-arctic">
            <span>Show Voronoi Boundaries</span>
            <input
              type="checkbox"
              checked={kmeans.showVoronoi}
              onChange={() => dispatch(toggleShowVoronoi())}
              className="w-4 h-4 accent-indigo-400 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between text-xs text-slopes cursor-pointer hover:text-arctic">
            <span>Show Centroid Trajectories</span>
            <input
              type="checkbox"
              checked={kmeans.showTrajectories}
              onChange={() => dispatch(toggleShowTrajectories())}
              className="w-4 h-4 accent-indigo-400 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between text-xs text-slopes cursor-pointer hover:text-arctic">
            <span>Show Centroid Labels</span>
            <input
              type="checkbox"
              checked={kmeans.showLabels}
              onChange={() => dispatch(toggleShowLabels())}
              className="w-4 h-4 accent-indigo-400 cursor-pointer"
            />
          </label>
        </div>
      </Card>
    </div>
  );
};

export default LeftPanel;
