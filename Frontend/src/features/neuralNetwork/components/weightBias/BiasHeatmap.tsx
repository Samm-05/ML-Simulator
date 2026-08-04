import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppSelector } from '../../../../app/hooks';
import Card from '../../../../components/ui/Card';
import { SlidersHorizontal } from 'lucide-react';

export const BiasHeatmap: React.FC = () => {
  const { layerSizes, trajectory, currentEpoch, config } = useAppSelector(
    (state) => state.neuralNetwork
  );
  const [selectedLayerIdx, setSelectedLayerIdx] = useState<number>(1);

  const snapshot = trajectory[currentEpoch];
  const prevSnapshot = trajectory[Math.max(0, currentEpoch - 1)];

  const currentLayerData = snapshot?.networkState?.layers[selectedLayerIdx];
  const prevLayerData = prevSnapshot?.networkState?.layers[selectedLayerIdx];

  const currentLayerSize = layerSizes[selectedLayerIdx] ?? 0;

  return (
    <Card className="p-5 space-y-4 bg-secondary-900/90 border border-mountainside backdrop-blur-xl shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-mountainside text-arctic border border-apres/40">
            <SlidersHorizontal className="w-4 h-4 text-slopes" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-arctic tracking-tight">Layer Bias Vector (b^{`[${selectedLayerIdx}]`})</h3>
            <p className="text-[10px] font-mono text-apres">Shift Offset Parameters per Neuron</p>
          </div>
        </div>

        {/* Layer Selector */}
        <div className="flex items-center gap-1 bg-midnight p-1 rounded-xl border border-mountainside">
          {layerSizes.map((_, idx) => {
            if (idx === 0) return null;
            return (
              <button
                key={`bias_layer_btn_${idx}`}
                onClick={() => setSelectedLayerIdx(idx)}
                className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-all ${
                  selectedLayerIdx === idx
                    ? 'bg-arctic text-midnight font-bold'
                    : 'text-slopes hover:text-arctic'
                }`}
              >
                L{idx}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bias Vector Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
        {Array.from({ length: currentLayerSize }).map((_, nIdx) => {
          const neuronData = currentLayerData?.neurons[nIdx];
          const prevNeuronData = prevLayerData?.neurons[nIdx];

          const bias = neuronData?.bias ?? 0;
          const gradB = neuronData?.gradB ?? 0;
          const prevBias = prevNeuronData?.bias ?? bias;
          const deltaB = -config.learningRate * gradB;

          const isPositive = bias >= 0;

          return (
            <motion.div
              key={`bias_node_${nIdx}`}
              whileHover={{ y: -2 }}
              className="p-3 rounded-xl bg-midnight/80 border border-mountainside/80 space-y-1 font-mono text-xs"
            >
              <div className="flex justify-between items-center text-[10px] text-apres">
                <span>Neuron {nIdx + 1}</span>
                <span className={`font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isPositive ? '+b' : '-b'}
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <span className="text-slopes text-[11px]">Bias:</span>
                <span className={`text-sm font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {bias.toFixed(4)}
                </span>
              </div>

              <div className="flex justify-between text-[10px] pt-1 border-t border-mountainside/50 text-apres">
                <span>∂L/∂b:</span>
                <span className="text-amber-400 font-bold">{gradB.toFixed(4)}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
};

export default BiasHeatmap;
