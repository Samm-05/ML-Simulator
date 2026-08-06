import React, { useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  setViewportMode,
  addCustomPoint,
  CLUSTER_COLORS,
} from '../kmeansSlice';
import Card from '../../../components/ui/Card';
import {
  Eye,
  Maximize2,
  RotateCcw,
  Compass,
  Layers,
  Sparkles,
} from 'lucide-react';

export const Center3DScene: React.FC = () => {
  const dispatch = useAppDispatch();
  const kmeans = useAppSelector((state) => state.kmeans);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Render 2D / Voronoi / 3D Canvas Representation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width;
    canvas.height = height;

    // Coordinate conversion (-5..5 -> canvas pixels)
    const toCanvasX = (x: number) => ((x + 5) / 10) * width;
    const toCanvasY = (y: number) => height - ((y + 5) / 10) * height;

    // Clear background
    ctx.fillStyle = '#0a0d14';
    ctx.fillRect(0, 0, width, height);

    // Draw Grid Lines
    ctx.strokeStyle = '#1e2638';
    ctx.lineWidth = 1;
    for (let x = -5; x <= 5; x += 1) {
      const cx = toCanvasX(x);
      ctx.beginPath();
      ctx.moveTo(cx, 0);
      ctx.lineTo(cx, height);
      ctx.stroke();
    }
    for (let y = -5; y <= 5; y += 1) {
      const cy = toCanvasY(y);
      ctx.beginPath();
      ctx.moveTo(0, cy);
      ctx.lineTo(width, cy);
      ctx.stroke();
    }

    // Draw Voronoi Regions if enabled
    if (kmeans.showVoronoi && kmeans.centroids.length > 0) {
      const step = 6;
      for (let px = 0; px < width; px += step) {
        for (let py = 0; py < height; py += step) {
          const worldX = (px / width) * 10 - 5;
          const worldY = ((height - py) / height) * 10 - 5;

          let minDistSq = Infinity;
          let nearestCluster = 0;

          kmeans.centroids.forEach((c) => {
            const dx = worldX - c.x;
            const dy = worldY - c.y;
            const d = dx * dx + dy * dy;
            if (d < minDistSq) {
              minDistSq = d;
              nearestCluster = c.id;
            }
          });

          const color = CLUSTER_COLORS[nearestCluster % CLUSTER_COLORS.length];
          ctx.fillStyle = `${color}18`; // Subtle alpha fill
          ctx.fillRect(px, py, step, step);
        }
      }
    }

    // Draw Centroid Trajectories if enabled
    if (kmeans.showTrajectories) {
      kmeans.centroids.forEach((c) => {
        if (c.history && c.history.length > 1) {
          ctx.beginPath();
          ctx.strokeStyle = c.color;
          ctx.lineWidth = 2;
          ctx.setLineDash([4, 4]);

          c.history.forEach((pos, idx) => {
            const hx = toCanvasX(pos.x);
            const hy = toCanvasY(pos.y);
            if (idx === 0) ctx.moveTo(hx, hy);
            else ctx.lineTo(hx, hy);
          });
          ctx.stroke();
          ctx.setLineDash([]);
        }
      });
    }

    // Draw Data Points
    kmeans.dataPoints.forEach((pt) => {
      const px = toCanvasX(pt.x);
      const py = toCanvasY(pt.y);

      ctx.beginPath();
      ctx.arc(px, py, 5, 0, Math.PI * 2);

      if (pt.cluster >= 0 && CLUSTER_COLORS[pt.cluster]) {
        const color = CLUSTER_COLORS[pt.cluster];
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 6;
      } else {
        ctx.fillStyle = '#64748b'; // Unassigned grey
        ctx.shadowBlur = 0;
      }

      ctx.fill();
      ctx.shadowBlur = 0;

      // Point outline
      ctx.strokeStyle = '#ffffff33';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Draw Centroids
    kmeans.centroids.forEach((c) => {
      const cx = toCanvasX(c.x);
      const cy = toCanvasY(c.y);

      // Pulse ring animation
      ctx.beginPath();
      ctx.arc(cx, cy, 14, 0, Math.PI * 2);
      ctx.strokeStyle = `${c.color}66`;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Outer Star / Diamond Marker
      ctx.beginPath();
      ctx.arc(cx, cy, 9, 0, Math.PI * 2);
      ctx.fillStyle = c.color;
      ctx.shadowColor = c.color;
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Centroid Label Badge
      if (kmeans.showLabels) {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`C${c.id + 1}`, cx, cy - 16);
      }
    });
  }, [kmeans]);

  // Click on Canvas to add point in addPointMode
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!kmeans.addPointMode || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    const worldX = (px / rect.width) * 10 - 5;
    const worldY = ((rect.height - py) / rect.height) * 10 - 5;

    dispatch(addCustomPoint({ x: worldX, y: worldY, z: 0 }));
  };

  return (
    <Card className="relative w-full h-[520px] bg-midnight/90 border-mountainside rounded-2xl overflow-hidden shadow-hard flex flex-col justify-between p-4">
      {/* Top Overlay Header */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex items-center space-x-2 bg-midnight/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-mountainside pointer-events-auto">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold text-arctic">K-Means Viewport</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            {kmeans.viewportMode.toUpperCase()} Mode
          </span>
        </div>

        {/* Viewport Control Buttons */}
        <div className="flex items-center space-x-1.5 bg-midnight/85 backdrop-blur-md p-1 rounded-xl border border-mountainside pointer-events-auto">
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

      {/* Main Interactive Canvas Element */}
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className={`w-full h-full rounded-xl ${kmeans.addPointMode ? 'cursor-crosshair' : 'cursor-grab'}`}
      />

      {/* Bottom Floating Legend / Indicator */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex items-center space-x-3 bg-midnight/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-mountainside pointer-events-auto text-xs text-apres">
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-indigo-400 inline-block" />
            <span>Voronoi Partitioning</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" />
            <span>Centroid Means</span>
          </span>
        </div>

        <div className="bg-midnight/85 backdrop-blur-md px-3 py-1 rounded-xl border border-mountainside text-[11px] font-mono text-slopes pointer-events-auto">
          {kmeans.isConverged ? (
            <span className="text-emerald-400 font-bold">✓ Stabilized & Converged</span>
          ) : kmeans.isPlaying ? (
            <span className="text-amber-400 font-bold animate-pulse">● Optimizing Iteration {kmeans.currentStep}</span>
          ) : (
            <span>Ready to Step</span>
          )}
        </div>
      </div>
    </Card>
  );
};

export default Center3DScene;
