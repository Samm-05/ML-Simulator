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
    <section className="rounded-2xl border border-mountainside bg-secondary-900/90 backdrop-blur-xl p-5 shadow-soft">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-bold text-arctic tracking-tight">3D Scientific Viewport</h3>
        <span className="text-[10px] font-mono text-apres uppercase tracking-widest">
          WebGL 60 FPS • {sceneType}
        </span>
      </div>
      <div className="h-[420px] rounded-xl overflow-hidden bg-midnight border border-mountainside/60 relative">
        <Canvas camera={{ position: [9, 8, 9], fov: 48 }} gl={{ antialias: true, alpha: true }}>
          <color attach="background" args={['#090F15']} />
          <ambientLight intensity={0.9} />
          <directionalLight position={[8, 12, 5]} intensity={1.2} color="#D3D1CE" />
          <gridHelper args={[20, 20, '#6C6D74', '#262E36']} />
          <axesHelper args={[4]} />
          {step ? <SceneByType step={step} sceneType={sceneType} /> : null}
          <OrbitControls enablePan enableRotate enableZoom />
        </Canvas>
      </div>
    </section>
  );
};

export default memo(SimulatorCanvas);
