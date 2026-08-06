import React, { useMemo, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  addPoint,
  setHoveredPointId,
} from '../logisticRegressionSlice';
import { sigmoid, mapFeatures } from '../engine/logisticRegressionEngine';
import { DataPoint2D } from '../types';
import { RotateCcw, Plus, Eye, Sparkles, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

// Custom Shader for Soft Probability Heatmap Surface
const HeatmapShader = {
  uniforms: {
    u_w1: { value: 0 },
    u_w2: { value: 0 },
    u_b: { value: 0 },
    u_w11: { value: 0 },
    u_w22: { value: 0 },
    u_w12: { value: 0 },
    u_featureType: { value: 0 }, // 0: linear, 1: polynomial
    u_threshold: { value: 0.5 },
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    void main() {
      vUv = uv;
      vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    uniform float u_w1;
    uniform float u_w2;
    uniform float u_b;
    uniform float u_w11;
    uniform float u_w22;
    uniform float u_w12;
    uniform float u_featureType;
    uniform float u_threshold;

    float sigmoid(float z) {
      return 1.0 / (1.0 + exp(-clamp(z, -30.0, 30.0)));
    }

    void main() {
      float x1 = vWorldPosition.x;
      float x2 = vWorldPosition.y;

      float z = u_b + u_w1 * x1 + u_w2 * x2;
      if (u_featureType > 0.5) {
        z += u_w11 * (x1 * x1) + u_w22 * (x2 * x2) + u_w12 * (x1 * x2);
      }

      float prob = sigmoid(z);

      vec3 colClass0 = vec3(0.05, 0.45, 0.85);
      vec3 colBoundary = vec3(0.9, 0.9, 0.95);
      vec3 colClass1 = vec3(0.95, 0.25, 0.35);

      vec3 color;
      if (prob < u_threshold) {
        float t = prob / max(u_threshold, 0.001);
        color = mix(colClass0, colBoundary, t * 0.7);
      } else {
        float t = (prob - u_threshold) / max(1.0 - u_threshold, 0.001);
        color = mix(colBoundary, colClass1, t * 0.85);
      }

      // Draw decision boundary highlight line
      float boundaryDist = abs(prob - u_threshold);
      if (boundaryDist < 0.015) {
        color = vec3(1.0, 1.0, 1.0);
      }

      gl_FragColor = vec4(color, 0.35);
    }
  `,
};

// Probability Heatmap Surface Mesh
const HeatmapSurface: React.FC = () => {
  const { trajectory, currentEpoch, config } = useAppSelector(
    (state) => state.logisticRegression
  );
  const meshRef = useRef<THREE.Mesh>(null);

  const currentWeights = trajectory[currentEpoch]?.weights || {
    w1: 0,
    w2: 0,
    b: 0,
  };

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.clone(HeatmapShader.uniforms),
      vertexShader: HeatmapShader.vertexShader,
      fragmentShader: HeatmapShader.fragmentShader,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
  }, []);

  if (shaderMaterial) {
    shaderMaterial.uniforms.u_w1.value = currentWeights.w1;
    shaderMaterial.uniforms.u_w2.value = currentWeights.w2;
    shaderMaterial.uniforms.u_b.value = currentWeights.b;
    shaderMaterial.uniforms.u_w11.value = currentWeights.w11 ?? 0;
    shaderMaterial.uniforms.u_w22.value = currentWeights.w22 ?? 0;
    shaderMaterial.uniforms.u_w12.value = currentWeights.w12 ?? 0;
    shaderMaterial.uniforms.u_featureType.value =
      config.featureType === 'polynomial' ? 1 : 0;
    shaderMaterial.uniforms.u_threshold.value = config.threshold;
  }

  return (
    <mesh ref={meshRef} position={[0, 0, -0.05]} material={shaderMaterial}>
      <planeGeometry args={[10, 10, 64, 64]} />
    </mesh>
  );
};

// Decision Boundary Line Mesh
const DecisionBoundaryLine: React.FC = () => {
  const { trajectory, currentEpoch, config } = useAppSelector(
    (state) => state.logisticRegression
  );
  const lineRef = useRef<THREE.Line>(null);

  const currentWeights = trajectory[currentEpoch]?.weights || {
    w1: 0,
    w2: 0,
    b: 0,
  };

  const lineGeometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const step = 0.1;

    if (config.featureType === 'linear') {
      const { w1, w2, b } = currentWeights;
      if (Math.abs(w2) > 0.001) {
        for (let x = -5; x <= 5; x += step) {
          const y = (-w1 * x - b) / w2;
          if (y >= -5 && y <= 5) {
            points.push(new THREE.Vector3(x, y, 0.02));
          }
        }
      } else if (Math.abs(w1) > 0.001) {
        const x = -b / w1;
        for (let y = -5; y <= 5; y += step) {
          points.push(new THREE.Vector3(x, y, 0.02));
        }
      }
    } else {
      for (let x = -5; x <= 5; x += step) {
        for (let y = -5; y <= 5; y += step) {
          const phi = mapFeatures(x, y, config.featureType);
          let z =
            currentWeights.b +
            currentWeights.w1 * phi[0] +
            currentWeights.w2 * phi[1];
          if (config.featureType === 'polynomial') {
            z +=
              (currentWeights.w11 ?? 0) * phi[2] +
              (currentWeights.w22 ?? 0) * phi[3] +
              (currentWeights.w12 ?? 0) * phi[4];
          }
          const prob = sigmoid(z);
          if (Math.abs(prob - config.threshold) < 0.02) {
            points.push(new THREE.Vector3(x, y, 0.02));
          }
        }
      }
    }

    const geom = new THREE.BufferGeometry();
    if (points.length > 0) {
      geom.setFromPoints(points);
    }
    return geom;
  }, [currentWeights, config.threshold, config.featureType]);

  return (
    <line ref={lineRef} geometry={lineGeometry}>
      <lineBasicMaterial color="#ffffff" linewidth={3} />
    </line>
  );
};

// 3D Point Particle Component
const PointSphere: React.FC<{ point: DataPoint2D }> = ({ point }) => {
  const dispatch = useAppDispatch();
  const { trajectory, currentEpoch, config, hoveredPointId } = useAppSelector(
    (state) => state.logisticRegression
  );

  const currentWeights = trajectory[currentEpoch]?.weights || {
    w1: 0,
    w2: 0,
    b: 0,
  };

  const phi = mapFeatures(point.x1, point.x2, config.featureType);
  let z = currentWeights.b + currentWeights.w1 * phi[0] + currentWeights.w2 * phi[1];
  if (config.featureType === 'polynomial') {
    z +=
      (currentWeights.w11 ?? 0) * phi[2] +
      (currentWeights.w22 ?? 0) * phi[3] +
      (currentWeights.w12 ?? 0) * phi[4];
  }
  const prob = sigmoid(z);
  const predictedLabel = prob >= config.threshold ? 1 : 0;
  const isCorrect = predictedLabel === point.label;
  const isHovered = hoveredPointId === point.id;

  const color = point.label === 1 ? '#ef4444' : '#3b82f6';

  return (
    <group position={[point.x1, point.x2, 0.1]}>
      {/* Outer Pulse Ring for Misclassified Points */}
      {!isCorrect && (
        <mesh position={[0, 0, -0.01]}>
          <ringGeometry args={[0.22, 0.28, 32]} />
          <meshBasicMaterial color="#f59e0b" transparent opacity={0.85} />
        </mesh>
      )}

      {/* Main Sphere */}
      <mesh
        onPointerOver={(e) => {
          e.stopPropagation();
          dispatch(setHoveredPointId(point.id));
        }}
        onPointerOut={() => dispatch(setHoveredPointId(null))}
      >
        <sphereGeometry args={[isHovered ? 0.22 : 0.16, 24, 24]} />
        <meshStandardMaterial
          color={color}
          roughness={0.2}
          metalness={0.3}
          emissive={color}
          emissiveIntensity={isHovered ? 0.6 : 0.25}
        />
      </mesh>

      {/* Hover Tooltip */}
      {isHovered && (
        <Html distanceFactor={10} position={[0, 0.35, 0.2]}>
          <div className="bg-midnight/90 backdrop-blur-md text-arctic text-xs p-2.5 rounded-xl border border-apres/40 shadow-2xl space-y-1 min-w-[160px] pointer-events-none font-mono">
            <div className="flex items-center justify-between border-b border-apres/30 pb-1">
              <span className="font-bold">Point {point.id.slice(0, 5)}</span>
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] ${
                  point.label === 1 ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                }`}
              >
                Class {point.label} ({point.label === 1 ? 'Red' : 'Blue'})
              </span>
            </div>
            <div>
              Feature 1 (x₁): <span className="text-arctic font-semibold">{point.x1.toFixed(2)}</span>
            </div>
            <div>
              Feature 2 (x₂): <span className="text-arctic font-semibold">{point.x2.toFixed(2)}</span>
            </div>
            <div>
              Linear Score (z): <span className="text-yellow-400">{z.toFixed(2)}</span>
            </div>
            <div>
              Probability P(y=1): <span className="text-cyan-400">{(prob * 100).toFixed(1)}%</span>
            </div>
            <div className="pt-1 flex items-center justify-between border-t border-apres/30 text-[10px]">
              <span>Pred: Class {predictedLabel}</span>
              <span className={isCorrect ? 'text-green-400 font-bold' : 'text-amber-400 font-bold'}>
                {isCorrect ? '✓ Correct' : '✕ Misclassified'}
              </span>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};

// 3D Axis Labels Overlay
const AxisLabels3D: React.FC = () => {
  return (
    <>
      <Html position={[4.2, -4.6, 0.1]}>
        <div className="px-2 py-0.5 rounded bg-midnight/90 border border-cyan-500/50 text-cyan-300 text-[10px] font-mono font-bold shadow-md whitespace-nowrap">
          Feature 1 (x₁) →
        </div>
      </Html>

      <Html position={[-4.6, 4.2, 0.1]}>
        <div className="px-2 py-0.5 rounded bg-midnight/90 border border-cyan-500/50 text-cyan-300 text-[10px] font-mono font-bold shadow-md whitespace-nowrap">
          ↑ Feature 2 (x₂)
        </div>
      </Html>
    </>
  );
};

// Main Three.js Scene Content
const SceneContent: React.FC<{ addClassLabel: 0 | 1 }> = ({ addClassLabel }) => {
  const dispatch = useAppDispatch();
  const { points } = useAppSelector((state) => state.logisticRegression);

  const handlePlaneClick = (e: any) => {
    if (e.intersections && e.intersections.length > 0) {
      const point = e.intersections[0].point;
      const x1 = Math.max(-4.8, Math.min(4.8, point.x));
      const x2 = Math.max(-4.8, Math.min(4.8, point.y));
      dispatch(addPoint({ x1, x2, label: addClassLabel }));
    }
  };

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[10, 10, 10]} intensity={1.2} />
      <directionalLight position={[-10, -10, -5]} intensity={0.4} color="#3b82f6" />

      <gridHelper
        args={[10, 20, '#475569', '#1e293b']}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, -0.08]}
      />

      <mesh
        position={[0, 0, -0.06]}
        onClick={handlePlaneClick}
        visible={false}
      >
        <planeGeometry args={[10, 10]} />
        <meshBasicMaterial />
      </mesh>

      <HeatmapSurface />
      <DecisionBoundaryLine />
      <AxisLabels3D />

      {points.map((pt) => (
        <PointSphere key={pt.id} point={pt} />
      ))}
    </>
  );
};

export const Center3DScene: React.FC = () => {
  const [addClassLabel, setAddClassLabel] = useState<0 | 1>(1);
  const [is3D, setIs3D] = useState(true);
  const [showExplanationBanner, setShowExplanationBanner] = useState(false);
  const controlsRef = useRef<any>(null);

  const { trajectory, currentEpoch, config } = useAppSelector(
    (state) => state.logisticRegression
  );

  const currentWeights = trajectory[currentEpoch]?.weights || { w1: 0, w2: 0, b: 0 };

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  return (
    <div className="relative w-full h-full min-h-[500px] bg-midnight rounded-3xl overflow-hidden border border-apres/30 shadow-2xl flex flex-col select-none">
      {/* Top Floating Control Bar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
        {/* Class Selector for Adding Points */}
        <div className="flex items-center gap-1.5 bg-midnight/90 backdrop-blur-md p-1.5 rounded-2xl border border-apres/40 shadow-lg">
          <span className="text-[11px] text-apres px-1 font-mono flex items-center gap-1">
            <Plus className="w-3.5 h-3.5" /> Point:
          </span>
          <button
            onClick={() => setAddClassLabel(0)}
            className={`px-2.5 py-1 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              addClassLabel === 0
                ? 'bg-blue-500 text-white shadow-md shadow-blue-500/30 font-bold'
                : 'text-slopes hover:text-arctic'
            }`}
          >
            Class 0 (Blue)
          </button>
          <button
            onClick={() => setAddClassLabel(1)}
            className={`px-2.5 py-1 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              addClassLabel === 1
                ? 'bg-red-500 text-white shadow-md shadow-red-500/30 font-bold'
                : 'text-slopes hover:text-arctic'
            }`}
          >
            Class 1 (Red)
          </button>
        </div>

        {/* Controls: Guide Toggle, 2D/3D View, Reset Camera */}
        <div className="flex items-center gap-1.5 bg-midnight/90 backdrop-blur-md p-1.5 rounded-2xl border border-apres/40 shadow-lg">
          <button
            onClick={() => setShowExplanationBanner(!showExplanationBanner)}
            className={`px-2.5 py-1 rounded-xl transition-all flex items-center gap-1 text-xs font-mono cursor-pointer ${
              showExplanationBanner
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                : 'text-slopes hover:text-arctic'
            }`}
            title="Toggle Scene Explanation Guide"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Guide</span>
            {showExplanationBanner ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          <button
            onClick={() => setIs3D(!is3D)}
            className="px-2.5 py-1 rounded-xl text-slopes hover:text-arctic hover:bg-mountainside/50 transition-all flex items-center gap-1 text-xs font-mono cursor-pointer"
            title="Toggle 2D/3D View"
          >
            <Eye className="w-3.5 h-3.5" /> {is3D ? '3D' : '2D'}
          </button>
          <button
            onClick={handleResetCamera}
            className="p-1.5 rounded-xl text-slopes hover:text-arctic hover:bg-mountainside/50 transition-all cursor-pointer"
            title="Reset Camera View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Collapsible Scene Guide Box */}
      {showExplanationBanner && (
        <div className="absolute top-14 left-3 right-3 z-30 bg-midnight/95 backdrop-blur-md p-3.5 rounded-2xl border border-cyan-500/40 shadow-2xl space-y-1.5 text-xs font-sans text-arctic pointer-events-auto">
          <div className="flex items-center justify-between border-b border-cyan-500/30 pb-1 font-mono text-[11px] font-bold text-cyan-400">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> 3D Classification Guide
            </span>
            <button
              onClick={() => setShowExplanationBanner(false)}
              className="text-apres hover:text-arctic text-[10px] cursor-pointer"
            >
              ✕ Close
            </button>
          </div>
          <p className="text-slopes text-[11px] leading-relaxed">
            <strong className="text-arctic">White Line:</strong> Decision Boundary where score <code className="text-cyan-300">z = 0</code> and probability <code className="text-cyan-300">P = 50%</code>.
            <br />
            <strong className="text-arctic">Red Region:</strong> Predicted <strong className="text-red-400">Class 1 (P ≥ {config.threshold})</strong>. <strong className="text-arctic">Blue Region:</strong> Predicted <strong className="text-blue-400">Class 0 (P &lt; {config.threshold})</strong>.
            <br />
            <strong className="text-amber-400">Yellow Ring:</strong> Misclassified sample error.
          </p>
        </div>
      )}

      {/* React Three Fiber Canvas */}
      <Canvas
        camera={{
          position: is3D ? [0, -6, 7] : [0, 0, 8.5],
          fov: 45,
        }}
        className="w-full h-full cursor-crosshair"
      >
        <OrbitControls
          ref={controlsRef}
          enableRotate={is3D}
          enablePan={true}
          enableZoom={true}
          maxPolarAngle={Math.PI / 2 - 0.05}
        />
        <SceneContent addClassLabel={addClassLabel} />
      </Canvas>

      {/* Bottom Visual Legend & Labeling Bar */}
      <div className="absolute bottom-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between bg-midnight/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-apres/40 text-[11px] font-mono text-slopes pointer-events-none shadow-2xl gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1 text-blue-400 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block shadow-sm" /> Class 0
          </span>
          <span className="flex items-center gap-1 text-red-400 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block shadow-sm" /> Class 1
          </span>
          <span className="flex items-center gap-1 text-arctic font-bold">
            <span className="w-3 h-0.5 bg-white inline-block shadow-sm" /> Boundary (z = 0)
          </span>
          <span className="flex items-center gap-1 text-amber-400 font-bold">
            <span className="w-2.5 h-2.5 rounded-full border-2 border-amber-400 inline-block" /> Error
          </span>
        </div>
        <span className="text-[10px] text-cyan-300 font-bold">z = {currentWeights.w1.toFixed(2)}x₁ + {currentWeights.w2.toFixed(2)}x₂ + {currentWeights.b.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default Center3DScene;
