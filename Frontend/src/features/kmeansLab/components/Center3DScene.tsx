import React, { useMemo, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import gsap from 'gsap';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  setViewportMode,
  addCustomPoint,
  togglePlayPause,
  stepForward,
  resetPlayback,
  CLUSTER_COLORS,
  DataPoint,
  Centroid,
} from '../kmeansSlice';
import Card from '../../../components/ui/Card';
import {
  Sparkles,
  Info,
  Layers,
  Compass,
  Target,
  Zap,
  Play,
  Pause,
  RotateCcw,
} from 'lucide-react';

// Distance helper
const dist3D = (p: { x: number; y: number; z: number }, c: { x: number; y: number; z: number }) => {
  const dx = p.x - c.x;
  const dy = p.y - c.y;
  const dz = p.z - c.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
};

// 3D Inner Scene Component inside R3F Canvas
const KMeans3DInnerScene: React.FC<{
  dataPoints: DataPoint[];
  centroids: Centroid[];
  showVoronoi: boolean;
  showTrajectories: boolean;
  showLabels: boolean;
  addPointMode: boolean;
  onAddPoint: (x: number, y: number, z: number) => void;
  hoveredPointId: string | null;
  setHoveredPointId: (id: string | null) => void;
  hoveredCentroidId: number | null;
  setHoveredCentroidId: (id: number | null) => void;
}> = ({
  dataPoints,
  centroids,
  showVoronoi,
  showTrajectories,
  showLabels,
  addPointMode,
  onAddPoint,
  hoveredPointId,
  setHoveredPointId,
  hoveredCentroidId,
  setHoveredCentroidId,
}) => {
  // Compute point-centroid distance explanations for hovered point
  const hoveredPointObj = useMemo(() => {
    if (!hoveredPointId) return null;
    return dataPoints.find((p) => p.id === hoveredPointId) || null;
  }, [hoveredPointId, dataPoints]);

  const pointExplanation = useMemo(() => {
    if (!hoveredPointObj || centroids.length === 0) return null;
    const distances = centroids.map((c) => ({
      centroidId: c.id,
      color: c.color,
      dist: dist3D(hoveredPointObj, c),
    }));
    distances.sort((a, b) => a.dist - b.dist);
    const closest = distances[0];

    return {
      point: hoveredPointObj,
      closest,
      allDistances: distances,
    };
  }, [hoveredPointObj, centroids]);

  // Compute 3D Voronoi Decision Boundary Canvas Texture
  const voronoiTexture = useMemo(() => {
    if (!showVoronoi || centroids.length === 0) return null;

    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const width = canvas.width;
    const height = canvas.height;
    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    const rgbColors = centroids.map((c) => {
      const hex = c.color.replace('#', '');
      return {
        r: parseInt(hex.substring(0, 2), 16),
        g: parseInt(hex.substring(2, 4), 16),
        b: parseInt(hex.substring(4, 6), 16),
      };
    });

    for (let py = 0; py < height; py++) {
      for (let px = 0; px < width; px++) {
        const wx = (px / width) * 12 - 6;
        const wy = ((height - py) / height) * 12 - 6;

        let minDistSq = Infinity;
        let nearestIdx = 0;

        centroids.forEach((c, idx) => {
          const dx = wx - c.x;
          const dy = wy - c.y;
          const d = dx * dx + dy * dy;
          if (d < minDistSq) {
            minDistSq = d;
            nearestIdx = idx;
          }
        });

        const rgb = rgbColors[nearestIdx % rgbColors.length];
        const index = (py * width + px) * 4;
        data[index] = rgb.r;
        data[index + 1] = rgb.g;
        data[index + 2] = rgb.b;
        data[index + 3] = 65; // ~25% alpha
      }
    }

    ctx.putImageData(imgData, 0, 0);
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, [centroids, showVoronoi]);

  // Handle plane click for adding points
  const handlePlaneClick = (e: ThreeEvent<MouseEvent>) => {
    if (!addPointMode) return;
    e.stopPropagation();
    const { x, y, z } = e.point;
    onAddPoint(
      Math.max(-5, Math.min(5, x)),
      Math.max(-5, Math.min(5, y)),
      Math.max(-2, Math.min(2, z))
    );
  };

  return (
    <>
      {/* 3D Lighting Setup */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 15, 10]} intensity={1.2} castShadow />
      <pointLight position={[-10, -10, -5]} intensity={0.5} />

      {/* Grid Floor */}
      <gridHelper args={[12, 12, '#3b82f6', '#1e2638']} position={[0, -0.02, 0]} />

      {/* 3D Voronoi Decision Boundary Floor Plane */}
      {voronoiTexture && (
        <mesh position={[0, -0.01, 0]}>
          <planeGeometry args={[12, 12]} />
          <meshBasicMaterial map={voronoiTexture} transparent opacity={0.45} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Cluster Bounding Regions (Discs surrounding assigned points) */}
      {centroids.map((c) => {
        const assignedPts = dataPoints.filter((p) => p.cluster === c.id);
        if (assignedPts.length === 0) return null;

        let maxDist = 0.8;
        assignedPts.forEach((p) => {
          const d = dist3D(p, c);
          if (d > maxDist) maxDist = d;
        });
        const radius = Math.min(5.5, maxDist + 0.35);

        return (
          <group key={`cluster-boundary-${c.id}`} position={[c.x, c.y, 0.005]}>
            {/* Outer Boundary Ring */}
            <mesh>
              <ringGeometry args={[radius - 0.08, radius, 64]} />
              <meshBasicMaterial color={c.color} side={THREE.DoubleSide} transparent opacity={0.75} />
            </mesh>

            {/* Translucent Interior Fill */}
            <mesh>
              <circleGeometry args={[radius - 0.08, 64]} />
              <meshBasicMaterial color={c.color} side={THREE.DoubleSide} transparent opacity={0.14} />
            </mesh>
          </group>
        );
      })}

      {/* Interactive Raycast Floor Plane for Add Point */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.03, 0]}
        onClick={handlePlaneClick}
        visible={false}
      >
        <planeGeometry args={[16, 16]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* 3D Trajectory Lines for Centroids */}
      {showTrajectories &&
        centroids.map((c) => {
          if (!c.history || c.history.length < 2) return null;
          const points3D = c.history.map((h) => new THREE.Vector3(h.x, h.y, h.z));
          const lineGeometry = new THREE.BufferGeometry().setFromPoints(points3D);

          return (
            <line key={`traj-${c.id}`} geometry={lineGeometry}>
              <lineDashedMaterial
                color={c.color}
                linewidth={2.5}
                scale={1}
                dashSize={0.2}
                gapSize={0.1}
              />
            </line>
          );
        })}

      {/* 3D Connector Lines from Points to Centroids */}
      {dataPoints.map((pt) => {
        if (pt.cluster < 0 || !centroids[pt.cluster]) return null;
        const c = centroids[pt.cluster];
        const isHovered = pt.id === hoveredPointId;

        return (
          <line
            key={`conn-${pt.id}`}
            geometry={
              new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(pt.x, pt.y, pt.z),
                new THREE.Vector3(c.x, c.y, c.z),
              ])
            }
          >
            <lineBasicMaterial
              color={c.color}
              transparent
              opacity={isHovered ? 0.9 : 0.15}
              linewidth={isHovered ? 3 : 1}
            />
          </line>
        );
      })}

      {/* Render 3D Data Point Spheres */}
      {dataPoints.map((pt) => {
        const isAssigned = pt.cluster >= 0 && CLUSTER_COLORS[pt.cluster];
        const color = isAssigned ? CLUSTER_COLORS[pt.cluster] : '#64748b';
        const isHovered = pt.id === hoveredPointId;

        return (
          <group key={pt.id} position={[pt.x, pt.y, pt.z]}>
            <mesh
              onPointerOver={(e) => {
                e.stopPropagation();
                setHoveredPointId(pt.id);
              }}
              onPointerOut={(e) => {
                e.stopPropagation();
                setHoveredPointId(null);
              }}
            >
              <sphereGeometry args={[isHovered ? 0.24 : 0.16, 24, 24]} />
              <meshStandardMaterial
                color={color}
                roughness={0.2}
                metalness={0.3}
                emissive={color}
                emissiveIntensity={isHovered ? 0.8 : 0.25}
              />
            </mesh>

            {/* Hovered Point Pulse Ring */}
            {isHovered && (
              <mesh>
                <ringGeometry args={[0.26, 0.32, 32]} />
                <meshBasicMaterial color={color} side={THREE.DoubleSide} transparent opacity={0.8} />
              </mesh>
            )}

            {/* Interactive 3D HTML Tooltip Card on Hover */}
            {isHovered && pointExplanation && (
              <Html position={[0, 0.4, 0]} center style={{ pointerEvents: 'none' }}>
                <div className="bg-midnight/95 backdrop-blur-md border border-cyan-500/50 p-3 rounded-xl shadow-2xl text-xs w-64 space-y-1.5 font-sans z-50 text-arctic">
                  <div className="flex items-center justify-between border-b border-mountainside pb-1 font-mono">
                    <span className="font-bold text-cyan-300">Point #{pt.id.replace('p-', '')}</span>
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                      style={{
                        backgroundColor: `${color}33`,
                        color: color,
                        border: `1px solid ${color}66`,
                      }}
                    >
                      {pt.cluster >= 0 ? `Cluster ${pt.cluster + 1}` : 'Unassigned'}
                    </span>
                  </div>

                  <div className="space-y-1 text-[11px]">
                    <p className="font-mono text-slopes">
                      Position: ({pt.x.toFixed(2)}, {pt.y.toFixed(2)}, {pt.z.toFixed(2)})
                    </p>
                    <p className="text-arctic font-medium">
                      Closest Centroid: <strong style={{ color }}>C{pointExplanation.closest.centroidId + 1}</strong> (d = {pointExplanation.closest.dist.toFixed(2)})
                    </p>
                    <p className="text-apres text-[10px] italic leading-tight">
                      💡 Assigned to Cluster {pointExplanation.closest.centroidId + 1} because Euclidean distance d={pointExplanation.closest.dist.toFixed(2)} is shortest.
                    </p>
                  </div>
                </div>
              </Html>
            )}
          </group>
        );
      })}

      {/* Render 3D Centroids */}
      {centroids.map((c) => {
        const assignedCount = dataPoints.filter((p) => p.cluster === c.id).length;
        const isHovered = c.id === hoveredCentroidId;

        return (
          <group key={`centroid-${c.id}`} position={[c.x, c.y, c.z]}>
            {/* Outer Diamond / Octahedron Mesh */}
            <mesh
              onPointerOver={(e) => {
                e.stopPropagation();
                setHoveredCentroidId(c.id);
              }}
              onPointerOut={(e) => {
                e.stopPropagation();
                setHoveredCentroidId(null);
              }}
            >
              <octahedronGeometry args={[0.38, 0]} />
              <meshStandardMaterial
                color={c.color}
                roughness={0.1}
                metalness={0.8}
                emissive={c.color}
                emissiveIntensity={0.6}
              />
            </mesh>

            {/* Pulsing Outer Wireframe Sphere */}
            <mesh>
              <sphereGeometry args={[0.5, 16, 16]} />
              <meshBasicMaterial color={c.color} wireframe transparent opacity={0.3} />
            </mesh>

            {/* Floating 3D Centroid Label Badge */}
            {showLabels && (
              <Html position={[0, 0.65, 0]} center style={{ pointerEvents: 'none' }}>
                <div
                  className="px-2.5 py-1 rounded-full text-xs font-mono font-bold shadow-hard whitespace-nowrap flex items-center gap-1.5"
                  style={{
                    backgroundColor: '#0a0d14ea',
                    color: c.color,
                    border: `1.5px solid ${c.color}`,
                  }}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                  <span>
                    C{c.id + 1} ({assignedCount} pts)
                  </span>
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </>
  );
};

export const Center3DScene: React.FC = () => {
  const dispatch = useAppDispatch();
  const kmeans = useAppSelector((state) => state.kmeans);
  const controlsRef = useRef<OrbitControlsImpl>(null);

  const [hoveredPointId, setHoveredPointId] = useState<string | null>(null);
  const [hoveredCentroidId, setHoveredCentroidId] = useState<number | null>(null);

  // Smooth camera transitions via GSAP
  useEffect(() => {
    if (!controlsRef.current) return;
    const controls = controlsRef.current;
    const targetCam = controls.object;

    let posX = 0;
    let posY = 4;
    let posZ = 12;

    if (kmeans.viewportMode === '2d') {
      posX = 0;
      posY = 0;
      posZ = 13;
    } else if (kmeans.viewportMode === 'top') {
      posX = 0;
      posY = 14;
      posZ = 0.01;
    }

    gsap.to(targetCam.position, {
      x: posX,
      y: posY,
      z: posZ,
      duration: 1.0,
      ease: 'power2.out',
      onUpdate: () => controls.update(),
    });
  }, [kmeans.viewportMode]);

  const handleAddPoint = (x: number, y: number, z: number) => {
    dispatch(addCustomPoint({ x, y, z }));
  };

  const hoveredPointObj = useMemo(() => {
    if (!hoveredPointId) return null;
    return kmeans.dataPoints.find((p) => p.id === hoveredPointId) || null;
  }, [hoveredPointId, kmeans.dataPoints]);

  return (
    <Card className="relative w-full h-[540px] bg-midnight/95 border-mountainside rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between p-4">
      {/* Top Overlay Header */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none gap-2">
        <div className="flex items-center space-x-2 bg-midnight/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-mountainside pointer-events-auto shadow-md">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold text-arctic">Interactive 3D WebGL Viewport</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            {kmeans.viewportMode.toUpperCase()} 3D Mode
          </span>
        </div>

        {/* Action Buttons: Run / Re-Run Clustering & Camera Mode */}
        <div className="flex items-center space-x-2 pointer-events-auto">
          <button
            type="button"
            onClick={() => dispatch(togglePlayPause())}
            className={`
              flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-soft transition-all cursor-pointer
              ${
                kmeans.isPlaying
                  ? 'bg-amber-500 hover:bg-amber-400 text-midnight'
                  : kmeans.isConverged
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }
            `}
          >
            {kmeans.isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
              </>
            ) : kmeans.isConverged ? (
              <>
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Re-Run Clustering 🚀</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Run Clustering 🚀</span>
              </>
            )}
          </button>

          <div className="flex items-center space-x-1 bg-midnight/90 backdrop-blur-md p-1 rounded-xl border border-mountainside shadow-md">
            {(['3d', '2d', 'top'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => dispatch(setViewportMode(mode))}
                className={`
                  px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer
                  ${
                    kmeans.viewportMode === mode
                      ? 'bg-indigo-600 text-white shadow-soft'
                      : 'text-slopes hover:text-arctic hover:bg-mountainside/50'
                  }
                `}
              >
                {mode.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Real Three.js R3F 3D WebGL Canvas */}
      <div className="w-full h-full rounded-xl overflow-hidden">
        <Canvas
          camera={{ position: [0, 4, 12], fov: 50 }}
          className={kmeans.addPointMode ? 'cursor-crosshair' : 'cursor-grab active:cursor-grabbing'}
        >
          <OrbitControls
            ref={controlsRef}
            enableDamping
            dampingFactor={0.05}
            maxPolarAngle={Math.PI / 2 + 0.1}
          />
          <KMeans3DInnerScene
            dataPoints={kmeans.dataPoints}
            centroids={kmeans.centroids}
            showVoronoi={kmeans.showVoronoi}
            showTrajectories={kmeans.showTrajectories}
            showLabels={kmeans.showLabels}
            addPointMode={kmeans.addPointMode}
            onAddPoint={handleAddPoint}
            hoveredPointId={hoveredPointId}
            setHoveredPointId={setHoveredPointId}
            hoveredCentroidId={hoveredCentroidId}
            setHoveredCentroidId={setHoveredCentroidId}
          />
        </Canvas>
      </div>

      {/* Hovered Point Explanation Banner */}
      {hoveredPointObj && (
        <div className="absolute top-16 left-4 right-4 z-20 pointer-events-none">
          <div className="p-3 bg-midnight/95 backdrop-blur-md border border-cyan-500/50 rounded-xl shadow-2xl text-xs text-arctic flex items-center justify-between gap-4 pointer-events-auto">
            <div className="flex items-center space-x-2">
              <Info className="w-4 h-4 text-cyan-400 shrink-0" />
              <div>
                <span className="font-bold text-cyan-300 mr-2">Point Inspection:</span>
                <span className="font-mono text-slopes">
                  ({hoveredPointObj.x.toFixed(2)}, {hoveredPointObj.y.toFixed(2)}, {hoveredPointObj.z.toFixed(2)})
                </span>
              </div>
            </div>

            <div className="text-right font-mono">
              <span className="text-apres mr-2">Assigned:</span>
              <span
                className="font-bold px-2 py-0.5 rounded-full text-xs"
                style={{
                  backgroundColor: `${CLUSTER_COLORS[hoveredPointObj.cluster]}22`,
                  color: CLUSTER_COLORS[hoveredPointObj.cluster],
                  border: `1px solid ${CLUSTER_COLORS[hoveredPointObj.cluster]}66`,
                }}
              >
                {hoveredPointObj.cluster >= 0 ? `Cluster ${hoveredPointObj.cluster + 1}` : 'Unassigned'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Floating Legend / Control Status Indicator */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex items-center space-x-3 bg-midnight/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-mountainside pointer-events-auto text-xs text-apres shadow-md">
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-indigo-400 inline-block" />
            <span>Voronoi Regions & Enclosing Rings</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
            <span>Hover Point Inspection</span>
          </span>
        </div>

        <div className="bg-midnight/90 backdrop-blur-md px-3 py-1 rounded-xl border border-mountainside text-[11px] font-mono text-slopes pointer-events-auto shadow-md">
          {kmeans.isConverged ? (
            <span className="text-emerald-400 font-bold">✓ Stabilized & Converged</span>
          ) : kmeans.isPlaying ? (
            <span className="text-amber-400 font-bold animate-pulse">● Optimizing Iteration {kmeans.currentStep}</span>
          ) : (
            <span>Click 'Run Clustering 🚀' or Step Forward!</span>
          )}
        </div>
      </div>
    </Card>
  );
};

export default Center3DScene;
