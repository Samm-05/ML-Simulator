import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { experimentService } from '../../services/experimentService';

export interface DataPoint {
  id: string;
  x: number;
  y: number;
  z: number;
  cluster: number; // -1 if unassigned, 0..K-1 for assigned cluster
}

export interface Centroid {
  id: number;
  x: number;
  y: number;
  z: number;
  color: string;
  history: Array<{ x: number; y: number; z: number }>;
}

export interface IterationSnapshot {
  iteration: number;
  centroids: Array<{ x: number; y: number; z: number }>;
  assignments: number[];
  wcss: number;
  movementDist: number;
  explanation: string;
}

export interface KMeansState {
  k: number;
  initializationMethod: 'random' | 'kmeans++';
  maxIterations: number;
  tolerance: number;
  animationSpeed: number;
  randomSeed: number;
  showLabels: boolean;
  showVoronoi: boolean;
  showTrajectories: boolean;
  viewportMode: '3d' | '2d' | 'top';
  datasetPreset:
    | 'separated'
    | 'overlapping'
    | 'circular'
    | 'concentric'
    | 'random'
    | 'spiral'
    | 'blobs'
    | 'elongated'
    | 'noise'
    | 'custom';
  dataPoints: DataPoint[];
  centroids: Centroid[];
  historyStack: DataPoint[][];
  redoStack: DataPoint[][];
  iterationsHistory: IterationSnapshot[];
  currentStep: number;
  isPlaying: boolean;
  isConverged: boolean;
  isSaving: boolean;
  wcss: number;
  silhouetteScore: number;
  elapsedTime: number;
  fps: number;
  lastSavedId: string | null;
  addPointMode: boolean;
}

export const CLUSTER_COLORS = [
  '#3B82F6', // Blue (Cluster 0)
  '#EC4899', // Pink (Cluster 1)
  '#10B981', // Emerald (Cluster 2)
  '#F59E0B', // Amber (Cluster 3)
  '#8B5CF6', // Purple (Cluster 4)
  '#06B6D4', // Cyan (Cluster 5)
  '#F97316', // Orange (Cluster 6)
  '#6366F1', // Indigo (Cluster 7)
];

// Helper: Seeded pseudo-random generator
const pseudoRandom = (seed: number) => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

// Recommended default K for presets
const PRESET_DEFAULT_K: Record<KMeansState['datasetPreset'], number> = {
  separated: 3,
  overlapping: 3,
  blobs: 4,
  circular: 2,
  concentric: 2,
  elongated: 2,
  spiral: 3,
  random: 3,
  noise: 3,
  custom: 3,
};

// Generate dataset preset points
const generateDatasetPoints = (
  preset: KMeansState['datasetPreset'],
  seed: number = 42,
  count: number = 120
): DataPoint[] => {
  const points: DataPoint[] = [];
  let currentSeed = seed;
  const rand = () => pseudoRandom(currentSeed++);

  switch (preset) {
    case 'separated': {
      const centers = [
        { x: -3.5, y: -2, z: -1 },
        { x: 3.5, y: 2.5, z: 1.5 },
        { x: 0, y: 4, z: -2 },
      ];
      centers.forEach((center) => {
        for (let i = 0; i < Math.floor(count / 3); i++) {
          points.push({
            id: `p-${points.length}`,
            x: center.x + (rand() - 0.5) * 2.2,
            y: center.y + (rand() - 0.5) * 2.2,
            z: center.z + (rand() - 0.5) * 2.0,
            cluster: -1,
          });
        }
      });
      break;
    }
    case 'overlapping': {
      const centers = [
        { x: -1.5, y: -1, z: 0 },
        { x: 1.5, y: 1, z: 0.5 },
        { x: 0, y: 1.5, z: -1 },
      ];
      centers.forEach((center) => {
        for (let i = 0; i < Math.floor(count / 3); i++) {
          points.push({
            id: `p-${points.length}`,
            x: center.x + (rand() - 0.5) * 3.5,
            y: center.y + (rand() - 0.5) * 3.5,
            z: center.z + (rand() - 0.5) * 3.0,
            cluster: -1,
          });
        }
      });
      break;
    }
    case 'circular': {
      for (let i = 0; i < count; i++) {
        const angle = rand() * Math.PI * 2;
        const radius = 1.5 + rand() * 3.5;
        points.push({
          id: `p-${i}`,
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius,
          z: (rand() - 0.5) * 1.5,
          cluster: -1,
        });
      }
      break;
    }
    case 'concentric': {
      // Ring 1 (Inner)
      for (let i = 0; i < count / 2; i++) {
        const angle = rand() * Math.PI * 2;
        const radius = 1.2 + rand() * 0.8;
        points.push({
          id: `p-${i}`,
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius,
          z: (rand() - 0.5) * 0.8,
          cluster: -1,
        });
      }
      // Ring 2 (Outer)
      for (let i = 0; i < count / 2; i++) {
        const angle = rand() * Math.PI * 2;
        const radius = 3.8 + rand() * 1.0;
        points.push({
          id: `p-${points.length}`,
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius,
          z: (rand() - 0.5) * 1.2,
          cluster: -1,
        });
      }
      break;
    }
    case 'blobs': {
      const centers = [
        { x: -4, y: 3, z: 1 },
        { x: 4, y: 3, z: -1 },
        { x: -3, y: -3, z: -2 },
        { x: 3, y: -3, z: 2 },
      ];
      centers.forEach((center) => {
        for (let i = 0; i < Math.floor(count / 4); i++) {
          points.push({
            id: `p-${points.length}`,
            x: center.x + (rand() - 0.5) * 1.8,
            y: center.y + (rand() - 0.5) * 1.8,
            z: center.z + (rand() - 0.5) * 1.8,
            cluster: -1,
          });
        }
      });
      break;
    }
    case 'elongated': {
      for (let i = 0; i < count / 2; i++) {
        const t = (rand() - 0.5) * 7;
        points.push({
          id: `p-${i}`,
          x: t,
          y: 0.6 * t + (rand() - 0.5) * 1.2 + 2,
          z: (rand() - 0.5) * 1.5,
          cluster: -1,
        });
      }
      for (let i = 0; i < count / 2; i++) {
        const t = (rand() - 0.5) * 7;
        points.push({
          id: `p-${points.length}`,
          x: t,
          y: -0.6 * t + (rand() - 0.5) * 1.2 - 2,
          z: (rand() - 0.5) * 1.5,
          cluster: -1,
        });
      }
      break;
    }
    default: {
      for (let i = 0; i < count; i++) {
        points.push({
          id: `p-${i}`,
          x: (rand() - 0.5) * 8,
          y: (rand() - 0.5) * 8,
          z: (rand() - 0.5) * 4,
          cluster: -1,
        });
      }
      break;
    }
  }

  return points;
};

// Distance calculation
const distSq = (p: { x: number; y: number; z: number }, c: { x: number; y: number; z: number }) => {
  const dx = p.x - c.x;
  const dy = p.y - c.y;
  const dz = p.z - c.z;
  return dx * dx + dy * dy + dz * dz;
};

// Calculate WCSS (Inertia)
const calculateWCSS = (points: DataPoint[], centroids: Centroid[]) => {
  let totalWCSS = 0;
  points.forEach((p) => {
    if (p.cluster >= 0 && centroids[p.cluster]) {
      totalWCSS += distSq(p, centroids[p.cluster]);
    }
  });
  return totalWCSS;
};

// Initial Centroid Placement Logic (Random vs KMeans++)
const initializeCentroidPositions = (
  k: number,
  points: DataPoint[],
  method: 'random' | 'kmeans++',
  seed: number
): Centroid[] => {
  if (points.length === 0) return [];
  let currentSeed = seed;
  const rand = () => pseudoRandom(currentSeed++);

  const centroids: Centroid[] = [];

  if (method === 'kmeans++') {
    // 1st centroid chosen randomly from points
    const firstIdx = Math.floor(rand() * points.length);
    const p1 = points[firstIdx];
    centroids.push({
      id: 0,
      x: p1.x,
      y: p1.y,
      z: p1.z,
      color: CLUSTER_COLORS[0],
      history: [{ x: p1.x, y: p1.y, z: p1.z }],
    });

    for (let cIdx = 1; cIdx < k; cIdx++) {
      const distances: number[] = points.map((p) => {
        let minD = Infinity;
        centroids.forEach((c) => {
          const d = distSq(p, c);
          if (d < minD) minD = d;
        });
        return minD;
      });

      const sumD = distances.reduce((acc, val) => acc + val, 0);
      let target = rand() * sumD;
      let nextIdx = 0;

      for (let i = 0; i < distances.length; i++) {
        target -= distances[i];
        if (target <= 0) {
          nextIdx = i;
          break;
        }
      }

      const pNext = points[nextIdx];
      centroids.push({
        id: cIdx,
        x: pNext.x,
        y: pNext.y,
        z: pNext.z,
        color: CLUSTER_COLORS[cIdx % CLUSTER_COLORS.length],
        history: [{ x: pNext.x, y: pNext.y, z: pNext.z }],
      });
    }
  } else {
    // Pure Random placement in bounding area of points
    let minX = -4,
      maxX = 4,
      minY = -4,
      maxY = 4,
      minZ = -2,
      maxZ = 2;
    if (points.length > 0) {
      minX = Math.min(...points.map((p) => p.x));
      maxX = Math.max(...points.map((p) => p.x));
      minY = Math.min(...points.map((p) => p.y));
      maxY = Math.max(...points.map((p) => p.y));
      minZ = Math.min(...points.map((p) => p.z));
      maxZ = Math.max(...points.map((p) => p.z));
    }

    for (let cIdx = 0; cIdx < k; cIdx++) {
      const cx = minX + rand() * (maxX - minX);
      const cy = minY + rand() * (maxY - minY);
      const cz = minZ + rand() * (maxZ - minZ);
      centroids.push({
        id: cIdx,
        x: cx,
        y: cy,
        z: cz,
        color: CLUSTER_COLORS[cIdx % CLUSTER_COLORS.length],
        history: [{ x: cx, y: cy, z: cz }],
      });
    }
  }

  return centroids;
};

// Initial state setup
const initialSeed = 42;
const initialDatasetPreset: KMeansState['datasetPreset'] = 'separated';
const initialK = PRESET_DEFAULT_K[initialDatasetPreset];
const initialPoints = generateDatasetPoints(initialDatasetPreset, initialSeed, 120);
const initialCentroids = initializeCentroidPositions(initialK, initialPoints, 'kmeans++', initialSeed);

// Async Thunk for saving experiment to MongoDB
export const saveKMeansExperiment = createAsyncThunk(
  'kmeans/saveExperiment',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = (getState() as { kmeans: KMeansState }).kmeans;
      const payload = {
        algorithm: 'kmeans',
        title: `K-Means Clustering (K=${state.k}, Preset=${state.datasetPreset})`,
        parameters: {
          k: state.k,
          initializationMethod: state.initializationMethod,
          maxIterations: state.maxIterations,
          tolerance: state.tolerance,
          datasetPreset: state.datasetPreset,
        },
        dataset: {
          preset: state.datasetPreset,
          pointCount: state.dataPoints.length,
        },
        metrics: {
          wcss: state.wcss,
          silhouetteScore: state.silhouetteScore,
          iterationsToConvergence: state.currentStep,
          converged: state.isConverged,
        },
        visualizationState: {
          viewportMode: state.viewportMode,
          showLabels: state.showLabels,
          showVoronoi: state.showVoronoi,
          showTrajectories: state.showTrajectories,
        },
      };

      const res = await experimentService.saveExperiment(payload);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to save experiment');
    }
  }
);

const initialState: KMeansState = {
  k: initialK,
  initializationMethod: 'kmeans++',
  maxIterations: 20,
  tolerance: 0.001,
  animationSpeed: 1,
  randomSeed: initialSeed,
  showLabels: true,
  showVoronoi: true,
  showTrajectories: true,
  viewportMode: '3d',
  datasetPreset: initialDatasetPreset,
  dataPoints: initialPoints,
  centroids: initialCentroids,
  historyStack: [],
  redoStack: [],
  iterationsHistory: [
    {
      iteration: 0,
      centroids: initialCentroids.map((c) => ({ x: c.x, y: c.y, z: c.z })),
      assignments: initialPoints.map(() => -1),
      wcss: 0,
      movementDist: 0,
      explanation: 'Step 0: Unlabeled Data Points. Initial centroids initialized using KMeans++.',
    },
  ],
  currentStep: 0,
  isPlaying: false,
  isConverged: false,
  isSaving: false,
  wcss: 0,
  silhouetteScore: 0.78,
  elapsedTime: 0,
  fps: 60,
  lastSavedId: null,
  addPointMode: false,
};

export const kmeansSlice = createSlice({
  name: 'kmeans',
  initialState,
  reducers: {
    setK: (state, action: PayloadAction<number>) => {
      state.k = Math.max(2, Math.min(8, action.payload));
      state.centroids = initializeCentroidPositions(
        state.k,
        state.dataPoints,
        state.initializationMethod,
        state.randomSeed
      );
      state.dataPoints.forEach((p) => (p.cluster = -1));
      state.isPlaying = false;
      state.isConverged = false;
      state.currentStep = 0;
      state.wcss = 0;
      state.iterationsHistory = [
        {
          iteration: 0,
          centroids: state.centroids.map((c) => ({ x: c.x, y: c.y, z: c.z })),
          assignments: state.dataPoints.map(() => -1),
          wcss: 0,
          movementDist: 0,
          explanation: `Re-initialized K=${state.k} centroids using ${state.initializationMethod}. Click Play or Step to begin clustering.`,
        },
      ];
    },
    setInitializationMethod: (state, action: PayloadAction<'random' | 'kmeans++'>) => {
      state.initializationMethod = action.payload;
      state.centroids = initializeCentroidPositions(
        state.k,
        state.dataPoints,
        state.initializationMethod,
        state.randomSeed
      );
      state.dataPoints.forEach((p) => (p.cluster = -1));
      state.currentStep = 0;
      state.isConverged = false;
      state.isPlaying = false;
      state.wcss = 0;
    },
    setDatasetPreset: (state, action: PayloadAction<KMeansState['datasetPreset']>) => {
      state.datasetPreset = action.payload;
      const targetK = PRESET_DEFAULT_K[action.payload] || state.k;
      state.k = targetK;
      state.randomSeed += 1;
      state.dataPoints = generateDatasetPoints(action.payload, state.randomSeed, 120);
      state.centroids = initializeCentroidPositions(
        state.k,
        state.dataPoints,
        state.initializationMethod,
        state.randomSeed
      );
      state.dataPoints.forEach((p) => (p.cluster = -1));
      state.currentStep = 0;
      state.isPlaying = false;
      state.isConverged = false;
      state.wcss = 0;
      state.iterationsHistory = [
        {
          iteration: 0,
          centroids: state.centroids.map((c) => ({ x: c.x, y: c.y, z: c.z })),
          assignments: state.dataPoints.map(() => -1),
          wcss: 0,
          movementDist: 0,
          explanation: `Generated preset '${action.payload}' with optimal K=${targetK}. Points unassigned. Click Play or Step Forward to run clustering!`,
        },
      ];
    },
    setViewportMode: (state, action: PayloadAction<'3d' | '2d' | 'top'>) => {
      state.viewportMode = action.payload;
    },
    toggleShowLabels: (state) => {
      state.showLabels = !state.showLabels;
    },
    toggleShowVoronoi: (state) => {
      state.showVoronoi = !state.showVoronoi;
    },
    toggleShowTrajectories: (state) => {
      state.showTrajectories = !state.showTrajectories;
    },
    setAnimationSpeed: (state, action: PayloadAction<number>) => {
      state.animationSpeed = action.payload;
    },
    toggleAddPointMode: (state) => {
      state.addPointMode = !state.addPointMode;
    },
    addCustomPoint: (state, action: PayloadAction<{ x: number; y: number; z?: number }>) => {
      state.historyStack.push(JSON.parse(JSON.stringify(state.dataPoints)));
      state.redoStack = [];
      const newPt: DataPoint = {
        id: `p-custom-${Date.now()}`,
        x: action.payload.x,
        y: action.payload.y,
        z: action.payload.z ?? 0,
        cluster: -1,
      };
      state.dataPoints.push(newPt);
      state.isConverged = false;
    },
    deletePoint: (state, action: PayloadAction<string>) => {
      state.historyStack.push(JSON.parse(JSON.stringify(state.dataPoints)));
      state.redoStack = [];
      state.dataPoints = state.dataPoints.filter((p) => p.id !== action.payload);
      state.isConverged = false;
    },
    clearPoints: (state) => {
      state.historyStack.push(JSON.parse(JSON.stringify(state.dataPoints)));
      state.redoStack = [];
      state.dataPoints = [];
      state.centroids = [];
      state.isConverged = false;
      state.currentStep = 0;
    },
    undoPoint: (state) => {
      if (state.historyStack.length > 0) {
        const prev = state.historyStack.pop()!;
        state.redoStack.push(JSON.parse(JSON.stringify(state.dataPoints)));
        state.dataPoints = prev;
        state.isConverged = false;
      }
    },
    redoPoint: (state) => {
      if (state.redoStack.length > 0) {
        const next = state.redoStack.pop()!;
        state.historyStack.push(JSON.parse(JSON.stringify(state.dataPoints)));
        state.dataPoints = next;
        state.isConverged = false;
      }
    },
    togglePlayPause: (state) => {
      if (state.isConverged || state.currentStep >= state.maxIterations) {
        // Auto-restart when clicking play on converged state
        state.randomSeed += 1;
        state.centroids = initializeCentroidPositions(
          state.k,
          state.dataPoints,
          state.initializationMethod,
          state.randomSeed
        );
        state.dataPoints.forEach((p) => (p.cluster = -1));
        state.currentStep = 0;
        state.isConverged = false;
        state.isPlaying = true;
        state.wcss = 0;
        state.iterationsHistory = [
          {
            iteration: 0,
            centroids: state.centroids.map((c) => ({ x: c.x, y: c.y, z: c.z })),
            assignments: state.dataPoints.map(() => -1),
            wcss: 0,
            movementDist: 0,
            explanation: 'Restarted simulation with fresh centroid placement.',
          },
        ];
      } else {
        state.isPlaying = !state.isPlaying;
      }
    },
    stepForward: (state) => {
      if (state.isConverged || state.currentStep >= state.maxIterations) {
        state.isPlaying = false;
        return;
      }

      // Step 1: Assign each point to closest centroid
      let totalDistMovement = 0;
      let assignmentsChanged = false;

      state.dataPoints.forEach((p) => {
        let minDistSq = Infinity;
        let closestCluster = 0;

        state.centroids.forEach((c) => {
          const d = distSq(p, c);
          if (d < minDistSq) {
            minDistSq = d;
            closestCluster = c.id;
          }
        });

        if (p.cluster !== closestCluster) {
          p.cluster = closestCluster;
          assignmentsChanged = true;
        }
      });

      // Step 2: Recalculate centroid positions (means)
      state.centroids.forEach((c) => {
        const assignedPts = state.dataPoints.filter((p) => p.cluster === c.id);
        if (assignedPts.length > 0) {
          const meanX = assignedPts.reduce((acc, p) => acc + p.x, 0) / assignedPts.length;
          const meanY = assignedPts.reduce((acc, p) => acc + p.y, 0) / assignedPts.length;
          const meanZ = assignedPts.reduce((acc, p) => acc + p.z, 0) / assignedPts.length;

          const movement = Math.sqrt(
            Math.pow(meanX - c.x, 2) + Math.pow(meanY - c.y, 2) + Math.pow(meanZ - c.z, 2)
          );
          totalDistMovement += movement;

          c.x = meanX;
          c.y = meanY;
          c.z = meanZ;
          c.history.push({ x: meanX, y: meanY, z: meanZ });
        }
      });

      const currentWCSS = calculateWCSS(state.dataPoints, state.centroids);
      state.wcss = currentWCSS;
      state.currentStep += 1;

      // Check convergence condition
      if (totalDistMovement < state.tolerance || !assignmentsChanged || state.currentStep >= state.maxIterations) {
        state.isConverged = true;
        state.isPlaying = false;
      }

      const explanation = state.isConverged
        ? `Iteration ${state.currentStep}: Algorithm converged! Total centroid movement ${totalDistMovement.toFixed(4)} < tolerance ${state.tolerance}. WCSS = ${currentWCSS.toFixed(2)}.`
        : `Iteration ${state.currentStep}: Assigned ${state.dataPoints.length} points to nearest centroids and updated means. WCSS = ${currentWCSS.toFixed(2)}.`;

      state.iterationsHistory.push({
        iteration: state.currentStep,
        centroids: state.centroids.map((c) => ({ x: c.x, y: c.y, z: c.z })),
        assignments: state.dataPoints.map((p) => p.cluster),
        wcss: currentWCSS,
        movementDist: totalDistMovement,
        explanation,
      });
    },
    stepBackward: (state) => {
      if (state.currentStep <= 0 || state.iterationsHistory.length <= 1) {
        return;
      }
      state.iterationsHistory.pop();
      state.currentStep -= 1;
      state.isConverged = false;

      const prevSnapshot = state.iterationsHistory[state.iterationsHistory.length - 1];
      if (prevSnapshot) {
        prevSnapshot.centroids.forEach((cPos, idx) => {
          if (state.centroids[idx]) {
            state.centroids[idx].x = cPos.x;
            state.centroids[idx].y = cPos.y;
            state.centroids[idx].z = cPos.z;
          }
        });
        prevSnapshot.assignments.forEach((clusterIdx, pIdx) => {
          if (state.dataPoints[pIdx]) {
            state.dataPoints[pIdx].cluster = clusterIdx;
          }
        });
        state.wcss = prevSnapshot.wcss;
      }
    },
    resetPlayback: (state) => {
      state.isPlaying = false;
      state.isConverged = false;
      state.currentStep = 0;
      state.randomSeed += 1;
      state.centroids = initializeCentroidPositions(
        state.k,
        state.dataPoints,
        state.initializationMethod,
        state.randomSeed
      );
      state.dataPoints.forEach((p) => (p.cluster = -1));
      state.wcss = 0;
      state.iterationsHistory = [
        {
          iteration: 0,
          centroids: state.centroids.map((c) => ({ x: c.x, y: c.y, z: c.z })),
          assignments: state.dataPoints.map(() => -1),
          wcss: 0,
          movementDist: 0,
          explanation: 'Playback reset. Centroids re-placed and points unassigned.',
        },
      ];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveKMeansExperiment.pending, (state) => {
        state.isSaving = true;
      })
      .addCase(saveKMeansExperiment.fulfilled, (state, action) => {
        state.isSaving = false;
        state.lastSavedId = action.payload?.id || action.payload?._id || null;
      })
      .addCase(saveKMeansExperiment.rejected, (state) => {
        state.isSaving = false;
      });
  },
});

export const {
  setK,
  setInitializationMethod,
  setDatasetPreset,
  setViewportMode,
  toggleShowLabels,
  toggleShowVoronoi,
  toggleShowTrajectories,
  setAnimationSpeed,
  toggleAddPointMode,
  addCustomPoint,
  deletePoint,
  clearPoints,
  undoPoint,
  redoPoint,
  togglePlayPause,
  stepForward,
  stepBackward,
  resetPlayback,
} = kmeansSlice.actions;

export default kmeansSlice.reducer;
