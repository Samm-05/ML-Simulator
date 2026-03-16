import React, { memo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { SimulationStep, SceneType } from '../../algorithms/types';
import KMeansScene from '../../three/scenes/KMeansScene';
import RegressionScene from '../../three/scenes/RegressionScene';
import DecisionTreeScene from '../../three/scenes/DecisionTreeScene';
import LogisticScene from '../../three/scenes/LogisticScene';
import PCAScene from '../../three/scenes/PCAScene';

interface SimulatorCanvasProps {
  step?: SimulationStep;
  sceneType: SceneType;
}

const SceneByType: React.FC<{ step: SimulationStep; sceneType: SceneType }> = ({ step, sceneType }) => {
  switch (sceneType) {
    case 'kmeans':
      return <KMeansScene step={step} />;
    case 'decision-tree':
      return <DecisionTreeScene step={step} />;
    case 'logistic':
      return <LogisticScene step={step} />;
    case 'pca':
      return <PCAScene step={step} />;
    case 'regression':
    default:
      return <RegressionScene step={step} />;
  }
};

const SimulatorCanvas: React.FC<SimulatorCanvasProps> = ({ step, sceneType }) => {
  return (
    <section className="rounded-xl border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 p-5">
      <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-50 mb-3">3D Visualization Canvas</h3>
      <div className="h-[420px] rounded-lg overflow-hidden bg-secondary-950">
        <Canvas camera={{ position: [9, 8, 9], fov: 48 }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[8, 12, 5]} intensity={1} />
          <gridHelper args={[20, 20, '#64748b', '#334155']} />
          <axesHelper args={[4]} />
          {step ? <SceneByType step={step} sceneType={sceneType} /> : null}
          <OrbitControls enablePan enableRotate enableZoom />
        </Canvas>
      </div>
    </section>
  );
};

export default memo(SimulatorCanvas);
