import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, Line } from '@react-three/drei';
import * as THREE from 'three';

interface VisualizationCanvasProps {
  algorithm: string;
  data?: any;
  viewMode?: '2d' | '3d';
}

const VisualizationCanvas: React.FC<VisualizationCanvasProps> = ({
  algorithm,
  data,
  viewMode = '2d',
}) => {
  if (viewMode === '3d') {
    return (
      <Canvas camera={{ position: [10, 10, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        
        <gridHelper args={[20, 20, '#94a3b8', '#475569']} />
        <axesHelper args={[5]} />
        
        {data?.points?.map((point: any, index: number) => (
          <Sphere key={index} position={[point.x, point.y, point.z || 0]} args={[0.1, 32, 32]}>
            <meshStandardMaterial color={point.cluster ? `hsl(${point.cluster * 60}, 70%, 50%)` : '#2563eb'} />
          </Sphere>
        ))}
      </Canvas>
    );
  }

  return (
    <svg width="100%" height="100%" viewBox="0 0 800 600" className="bg-secondary-50 dark:bg-secondary-900 rounded-lg">
      {data?.points?.map((point: any, index: number) => (
        <circle
          key={index}
          cx={point.x * 50 + 400}
          cy={300 - point.y * 50}
          r={5}
          fill={point.cluster ? `hsl(${point.cluster * 60}, 70%, 50%)` : '#2563eb'}
        />
      ))}
      
      {algorithm === 'linear-regression' && data?.line && (
        <line
          x1={data.line.x1 * 50 + 400}
          y1={300 - data.line.y1 * 50}
          x2={data.line.x2 * 50 + 400}
          y2={300 - data.line.y2 * 50}
          stroke="#22c55e"
          strokeWidth="2"
        />
      )}
    </svg>
  );
};

export default VisualizationCanvas;