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
    <section className="rounded-xl border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 p-4">
      <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-50 mb-3">Parameter Controls</h3>
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
                      <label className="flex justify-between text-sm text-secondary-600 dark:text-secondary-300 mb-1">
                        <span>{definition.label}</span>
                        <span className="font-medium">{safeValue}</span>
                      </label>
                      <input
                        type="range"
                        min={definition.min}
                        max={definition.max}
                        step={definition.step}
                        value={safeValue}
                        onChange={(event) => onChange(definition.key, Number(event.target.value))}
                        className="w-full accent-primary-600"
                      />
                    </>
                  );
                })()}
              </>
            ) : (
              <>
                <label className="block text-sm text-secondary-600 dark:text-secondary-300 mb-1">{definition.label}</label>
                <select
                  value={String(values[definition.key])}
                  onChange={(event) => onChange(definition.key, event.target.value)}
                  className="w-full rounded-lg border border-secondary-300 dark:border-secondary-600 bg-secondary-50 dark:bg-secondary-900 px-3 py-2 text-sm"
                >
                  {definition.options.map((option) => (
                    <option key={option.value} value={option.value}>
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
