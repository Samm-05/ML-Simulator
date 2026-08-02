import React from 'react';
import { motion } from 'framer-motion';
import { ParameterDefinition } from '../../algorithms/types';
import { itemVariant } from '../../animations/framerVariants';

interface AlgorithmControlsProps {
  definitions: ParameterDefinition[];
  values: Record<string, number | string>;
  onChange: (key: string, value: number | string) => void;
}

const AlgorithmControls: React.FC<AlgorithmControlsProps> = ({ definitions, values, onChange }) => {
  return (
    <section className="rounded-2xl border border-mountainside bg-secondary-900/90 backdrop-blur-xl p-4 shadow-soft">
      <h3 className="text-sm font-bold text-arctic uppercase tracking-wider mb-3">Hyperparameters</h3>
      <div className="space-y-4">
        {definitions.map((definition, index) => (
          <motion.div key={definition.key} variants={itemVariant} initial="hidden" animate="visible" custom={index}>
            {definition.type === 'slider' ? (
              <>
                {(() => {
                  const rawValue = values[definition.key];
                  const numericValue = typeof rawValue === 'number' ? rawValue : Number(rawValue);
                  const safeValue = Number.isFinite(numericValue) ? numericValue : definition.min;
                  return (
                    <>
                      <label className="flex justify-between text-xs font-medium text-slopes mb-1.5">
                        <span>{definition.label}</span>
                        <span className="font-mono text-arctic font-bold">{safeValue}</span>
                      </label>
                      <input
                        type="range"
                        min={definition.min}
                        max={definition.max}
                        step={definition.step}
                        value={safeValue}
                        onChange={(event) => onChange(definition.key, Number(event.target.value))}
                        className="w-full accent-arctic bg-mountainside rounded-lg h-1.5"
                      />
                    </>
                  );
                })()}
              </>
            ) : (
              <>
                <label className="block text-xs font-medium text-slopes mb-1.5">{definition.label}</label>
                <select
                  value={String(values[definition.key])}
                  onChange={(event) => onChange(definition.key, event.target.value)}
                  className="w-full rounded-xl border border-mountainside bg-mountainside/50 px-3 py-2 text-xs font-mono text-arctic focus:outline-none focus:border-slopes"
                >
                  {definition.options.map((option) => (
                    <option key={option.value} value={option.value} className="bg-secondary-900 text-arctic">
                      {option.label}
                    </option>
                  ))}
                </select>
              </>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default AlgorithmControls;
