import React, { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { useAppSelector } from '../../../app/hooks';
import { RotateCcw, Eye, Sparkles as SparklesIcon } from 'lucide-react';

// Custom Shader for Vibrant 3D Loss-Complexity Surface
const SurfaceShader = {
  uniforms: {
    u_time: { value: 0 },
    u_markerU: { value: 0 },
    u_markerV: { value: 0 },
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    varying float vElevation;

    void main() {
      vUv = uv;
      vec3 pos = position;

      // Map u (degree) and v (lambda)
      float deg = ((pos.x + 3.0) / 6.0) * 12.0 + 1.0;
      float lambda = max(0.0, ((pos.y + 3.0) / 6.0) * 0.1);

      // Compute synthetic 3D loss surface elevation
      float biasSq = 1.8 / pow(max(deg, 0.8), 1.1);
      float variance = 0.035 * pow(max(deg, 1.0), 1.7) * (1.0 / (1.0 + lambda * 25.0));
      float z = clamp(biasSq + variance, 0.1, 3.2);

      pos.z = z * 0.7 - 1.2;
      vElevation = z;

      vWorldPosition = (modelMatrix * vec4(pos, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    varying float vElevation;

    void main() {
      // Vibrant Gradient based on elevation (loss height):
      // Low Loss (Good fit): Deep Cyan / Emerald
      // Mid Loss (Bias): Bright Blue / Amber
      // High Loss (Overfit): Crimson Red / Pink
      vec3 colGood = vec3(0.06, 0.85, 0.65);   // Emerald / Teal
      vec3 colMid = vec3(0.2, 0.55, 0.95);    // Bright Blue
      vec3 colHigh = vec3(0.95, 0.25, 0.35);   // Crimson Red

      vec3 color;
      if (vElevation < 0.6) {
        color = mix(colGood, colMid, vElevation / 0.6);
      } else {
        color = mix(colMid, colHigh, clamp((vElevation - 0.6) / 2.0, 0.0, 1.0));
      }

      // Add Subtle Grid Lines
      vec2 grid = abs(fract(vUv * 20.0 - 0.5) - 0.5) / fwidth(vUv * 20.0);
      float line = min(grid.x, grid.y);
      float c = 1.0 - min(line, 1.0);

      vec3 finalColor = mix(color, vec3(1.0, 1.0, 1.0), c * 0.25);

      gl_FragColor = vec4(finalColor, 0.85);
    }
  `,
};

// Illuminated Surface Component
const IlluminatedLossSurface: React.FC<{ showWireframe: boolean }> = ({ showWireframe }) => {
  const { config, result } = useAppSelector((state) => state.overfitting);
  const meshRef = useRef<THREE.Mesh>(null);

  const gridRes = 48;

  const geometry = useMemo(() => {
    return new THREE.PlaneGeometry(6, 6, gridRes, gridRes);
  }, []);

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.clone(SurfaceShader.uniforms),
      vertexShader: SurfaceShader.vertexShader,
      fragmentShader: SurfaceShader.fragmentShader,
      transparent: true,
      side: THREE.DoubleSide,
      wireframe: showWireframe,
    });
  }, [showWireframe]);

  // Compute 3D position of current model Operating Point Ball
  const currentMarkerPos = useMemo(() => {
    const u = ((config.degree - 1) / 12) * 6 - 3;
    const v = (config.lambda / 0.1) * 6 - 3;

    const biasSq = 1.8 / Math.pow(Math.max(config.degree, 0.8), 1.1);
    const variance = 0.035 * Math.pow(Math.max(config.degree, 1.0), 1.7) * (1 / (1 + config.lambda * 25));
    const z = Math.min(3.2, Math.max(0.1, biasSq + variance));

    return [u, v, z * 0.7 - 1.0 + 0.2] as [number, number, number];
  }, [config.degree, config.lambda]);

  return (
    <group rotation={[-Math.PI / 3, 0, 0]}>
      {/* 3D Loss Mesh Surface */}
      <mesh ref={meshRef} geometry={geometry} material={shaderMaterial} />

      {/* Wireframe Outline Overlay for extra high-tech polish */}
      {!showWireframe && (
        <mesh geometry={geometry} position={[0, 0, 0.01]}>
          <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.15} />
        </mesh>
      )}

      {/* Current Model Operating Point Marker Ball */}
      <group position={currentMarkerPos}>
        <mesh>
          <sphereGeometry args={[0.22, 32, 32]} />
          <meshStandardMaterial
            color={
              result.regime === 'good_fit'
                ? '#10B981'
                : result.regime === 'underfitting'
                ? '#3B82F6'
                : '#EF4444'
            }
            emissive={
              result.regime === 'good_fit'
                ? '#10B981'
                : result.regime === 'underfitting'
                ? '#3B82F6'
                : '#EF4444'
            }
            emissiveIntensity={0.8}
            roughness={0.1}
          />
        </mesh>

        {/* Pulsing Outer Glow Ring */}
        <mesh position={[0, 0, 0]}>
          <ringGeometry args={[0.26, 0.35, 32]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.7} />
        </mesh>

        {/* Floating Tooltip Label */}
        <Html distanceFactor={8} position={[0, 0.4, 0.2]}>
          <div className="bg-midnight/95 backdrop-blur-md text-arctic text-[11px] p-2.5 rounded-xl border border-apres/40 shadow-2xl space-y-1 min-w-[150px] pointer-events-none font-mono">
            <div className="flex items-center justify-between border-b border-apres/30 pb-1 font-bold">
              <span>Model Point</span>
              <span
                className={`px-1.5 py-0.5 rounded text-[9px] uppercase ${
                  result.regime === 'good_fit'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : result.regime === 'underfitting'
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'bg-rose-500/20 text-rose-400'
                }`}
              >
                {result.regime.replace('_', ' ')}
              </span>
            </div>
            <div>
              Degree d: <span className="text-cyan-400 font-bold">{config.degree}</span>
            </div>
            <div>
              Regularization λ: <span className="text-purple-400 font-bold">{config.lambda.toFixed(3)}</span>
            </div>
            <div>
              Val Loss: <span className="text-amber-400 font-bold">{result.valLoss.toFixed(4)}</span>
            </div>
          </div>
        </Html>
      </group>

      {/* 3D Axis Labels in Canvas */}
      <Html position={[3.2, -3.2, -1.0]}>
        <div className="px-2 py-0.5 rounded bg-midnight/90 border border-cyan-500/50 text-cyan-300 text-[10px] font-mono font-bold shadow-md whitespace-nowrap">
          Degree (d) →
        </div>
      </Html>

      <Html position={[-3.2, 3.2, -1.0]}>
        <div className="px-2 py-0.5 rounded bg-midnight/90 border border-purple-500/50 text-purple-300 text-[10px] font-mono font-bold shadow-md whitespace-nowrap">
          ↑ Regularization (λ)
        </div>
      </Html>
    </group>
  );
};

export const Overfitting3DScene: React.FC = () => {
  const { result } = useAppSelector((state) => state.overfitting);
  const [showWireframe, setShowWireframe] = useState(false);
  const controlsRef = useRef<any>(null);

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  return (
    <div className="w-full h-full min-h-[420px] relative rounded-3xl overflow-hidden bg-midnight border border-apres/30 shadow-2xl flex flex-col select-none">
      {/* Top Header Controls Bar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-auto">
        <div className="px-3 py-1.5 rounded-xl bg-midnight/90 backdrop-blur-md border border-apres/40 text-xs font-mono text-arctic flex items-center gap-2 shadow-lg">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              result.regime === 'good_fit'
                ? 'bg-emerald-400'
                : result.regime === 'underfitting'
                ? 'bg-blue-400'
                : 'bg-rose-400 animate-pulse'
            }`}
          />
          <span className="font-bold">3D Loss-Complexity Surface</span>
        </div>

        <div className="flex items-center gap-1.5 bg-midnight/90 backdrop-blur-md p-1.5 rounded-xl border border-apres/40 shadow-lg">
          <button
            onClick={() => setShowWireframe(!showWireframe)}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              showWireframe
                ? 'bg-cyan-500 text-midnight font-bold shadow-md'
                : 'text-slopes hover:text-arctic'
            }`}
          >
            {showWireframe ? 'Wireframe' : 'Shaded Surface'}
          </button>
          <button
            onClick={handleResetCamera}
            className="p-1.5 rounded-lg text-slopes hover:text-arctic hover:bg-mountainside/50 transition-all cursor-pointer"
            title="Reset Camera View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Canvas */}
      <Canvas camera={{ position: [0, -5.5, 5.5], fov: 45 }} gl={{ antialias: true, alpha: true }}>
        <color attach="background" args={['#070B10']} />
        <ambientLight intensity={0.9} />
        <directionalLight position={[10, 15, 10]} intensity={1.4} color="#ffffff" />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#3b82f6" />

        <IlluminatedLossSurface showWireframe={showWireframe} />
        <Sparkles count={50} scale={8} size={2.0} speed={0.4} color="#00f0ff" opacity={0.3} />
        <OrbitControls ref={controlsRef} enablePan enableRotate enableZoom maxPolarAngle={Math.PI / 2 - 0.05} />
      </Canvas>

      {/* Bottom Color Gradient Legend */}
      <div className="absolute bottom-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between bg-midnight/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-apres/40 text-[11px] font-mono text-slopes pointer-events-none shadow-2xl gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-blue-400 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" /> Underfitting (High Bias)
          </span>
          <span className="flex items-center gap-1 text-emerald-400 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Good Fit (Optimal)
          </span>
          <span className="flex items-center gap-1 text-rose-400 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> Overfitting (High Variance)
          </span>
        </div>
        <span className="text-[10px] text-cyan-300 font-bold">Z = Validation Loss</span>
      </div>
    </div>
  );
};

export default Overfitting3DScene;
