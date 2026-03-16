import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { algorithmOrder, algorithmRegistry, resolveAlgorithmId } from '../../algorithms';
import { AlgorithmId, DatasetConfig, SimulationStep } from '../../algorithms/types';
import AlgorithmControls from '../../components/simulator/AlgorithmControls';
import DatasetControls from '../../components/simulator/DatasetControls';
import PlaybackControls from '../../components/simulator/PlaybackControls';
import SimulatorCanvas from '../../components/simulator/SimulatorCanvas';
import GraphPanel from '../../components/simulator/GraphPanel';
import ExplanationPanel from '../../components/simulator/ExplanationPanel';
import { animatePanelMount, animateStepPulse } from '../../animations/gsapTimelines';

const Simulator: React.FC = () => {
  const { algorithm } = useParams<{ algorithm?: string }>();
  const navigate = useNavigate();
  const algorithmId: AlgorithmId = resolveAlgorithmId(algorithm);
  const definition = algorithmRegistry[algorithmId];
  const [params, setParams] = useState<Record<string, number | string>>(definition.defaultParams);
  const [datasetConfig, setDatasetConfig] = useState<DatasetConfig>(definition.defaultDataset);
  const [steps, setSteps] = useState<SimulationStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [seed, setSeed] = useState(0);
  const surfaceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setParams(definition.defaultParams);
    setDatasetConfig(definition.defaultDataset);
    setCurrentStepIndex(0);
    setPlaying(false);
    setSeed((current) => current + 1);
  }, [definition.defaultDataset, definition.defaultParams, algorithmId]);

  const effectiveParams = useMemo(
    () => ({ ...definition.defaultParams, ...params }),
    [definition.defaultParams, params]
  );

  const effectiveDatasetConfig = useMemo(
    () => ({ ...definition.defaultDataset, ...datasetConfig }),
    [definition.defaultDataset, datasetConfig]
  );

  const recompute = useMemo(() => {
    const dataset = definition.generateDataset(effectiveDatasetConfig, effectiveParams);
    return definition.buildSteps(dataset, effectiveParams);
  }, [definition, effectiveDatasetConfig, effectiveParams, seed]);

  useEffect(() => {
    setSteps(recompute);
    setCurrentStepIndex(0);
    setPlaying(false);
  }, [recompute]);

  useEffect(() => {
    if (!playing || steps.length === 0) {
      return undefined;
    }
    const timer = window.setInterval(() => {
      setCurrentStepIndex((current) => {
        if (current >= steps.length - 1) {
          setPlaying(false);
          return current;
        }
        return current + 1;
      });
    }, 820 / speed);
    return () => window.clearInterval(timer);
  }, [playing, speed, steps.length]);

  useEffect(() => {
    if (!surfaceRef.current) {
      return;
    }
    const pulse = animateStepPulse(surfaceRef.current);
    return () => {
      pulse.kill();
    };
  }, [currentStepIndex]);

  useEffect(() => {
    if (!surfaceRef.current) {
      return;
    }
    const mount = animatePanelMount(surfaceRef.current);
    return () => {
      mount.kill();
    };
  }, []);

  const step = steps[currentStepIndex];

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-[1600px] mx-auto space-y-6">
        <header className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-secondary-900 dark:text-secondary-50">Interactive Algorithm Simulator</h1>
          <div className="flex flex-wrap gap-2">
            {algorithmOrder.map((item) => (
              <motion.button
                key={item}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => navigate(`/simulator/${item}`)}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  item === algorithmId
                    ? 'bg-primary-600 text-white'
                    : 'bg-secondary-200 dark:bg-secondary-700 text-secondary-800 dark:text-secondary-100'
                }`}
              >
                {algorithmRegistry[item].name}
              </motion.button>
            ))}
          </div>
          <p className="text-secondary-600 dark:text-secondary-300">{definition.description}</p>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <motion.aside
            className="xl:col-span-3 space-y-4"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
          >
            <AlgorithmControls definitions={definition.parameterDefinitions} values={params} onChange={(key, value) => setParams((current) => ({ ...current, [key]: value }))} />
            <DatasetControls value={datasetConfig} onChange={setDatasetConfig} onRandomize={() => setSeed((current) => current + 1)} />
            <PlaybackControls
              isPlaying={playing}
              canStep={currentStepIndex < Math.max(0, steps.length - 1)}
              speed={speed}
              onPlayPause={() => setPlaying((current) => !current)}
              onReset={() => {
                setPlaying(false);
                setCurrentStepIndex(0);
              }}
              onStepForward={() => setCurrentStepIndex((current) => Math.min(current + 1, Math.max(0, steps.length - 1)))}
              onRandomize={() => setSeed((current) => current + 1)}
              onSpeedChange={setSpeed}
            />
          </motion.aside>

          <div ref={surfaceRef} className="xl:col-span-9 space-y-6">
            <SimulatorCanvas step={step} sceneType={definition.sceneType} />
            <GraphPanel
              steps={steps}
              currentIndex={currentStepIndex}
              primaryKey={definition.graphKeys.primary}
              secondaryKey={definition.graphKeys.secondary}
              primaryLabel={definition.graphLabels.primary}
              secondaryLabel={definition.graphLabels.secondary}
            />
            <ExplanationPanel step={step} totalSteps={steps.length} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Simulator;
