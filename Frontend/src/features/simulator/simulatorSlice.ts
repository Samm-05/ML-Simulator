import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { simulationAPI } from '../../services/simulationService';
import {
  linearRegression,
  kMeans,
  decisionTree,
} from './algorithms';

interface SimulationState {
  currentAlgorithm: string;
  parameters: Record<string, any>;
  data: any;
  isRunning: boolean;
  currentStep: number;
  lossHistory: number[];
  accuracyHistory: number[];
  explanation: string;
  loading: boolean;
  error: string | null;
}

const initialState: SimulationState = {
  currentAlgorithm: 'linear-regression',
  parameters: {
    learningRate: 0.01,
    epochs: 50,
    noise: 0.1,
    k: 3,
    maxIterations: 100,
    maxDepth: 5,
    minSamplesSplit: 2,
    criterion: 'gini',
  },
  data: null,
  isRunning: false,
  currentStep: 0,
  lossHistory: [],
  accuracyHistory: [],
  explanation: '',
  loading: false,
  error: null,
};

export const runSimulation = createAsyncThunk(
  'simulator/run',
  async (_, { getState }) => {
    const state = getState() as { simulator: SimulationState };
    const { currentAlgorithm, parameters } = state.simulator;

    switch (currentAlgorithm) {
      case 'linear-regression':
        return linearRegression.simulate(parameters);
      case 'kmeans':
        return kMeans.simulate(parameters);
      case 'decision-tree':
        return decisionTree.simulate(parameters);
      default:
        throw new Error('Unknown algorithm');
    }
  }
);

const simulatorSlice = createSlice({
  name: 'simulator',
  initialState,
  reducers: {
    setAlgorithm: (state, action: PayloadAction<string>) => {
      state.currentAlgorithm = action.payload;
      state.currentStep = 0;
      state.lossHistory = [];
      state.accuracyHistory = [];
    },
    updateParameter: (state, action: PayloadAction<{ param: string; value: any }>) => {
      state.parameters[action.payload.param] = action.payload.value;
    },
    pauseSimulation: (state) => {
      state.isRunning = false;
    },
    resetSimulation: (state) => {
      state.isRunning = false;
      state.currentStep = 0;
      state.lossHistory = [];
      state.accuracyHistory = [];
      state.data = null;
    },
    nextStep: (state) => {
      state.currentStep += 1;
    },
    updateLoss: (state, action: PayloadAction<number>) => {
      state.lossHistory.push(action.payload);
    },
    updateExplanation: (state, action: PayloadAction<string>) => {
      state.explanation = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(runSimulation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(runSimulation.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.lossHistory = action.payload.lossHistory;
        state.isRunning = true;
      })
      .addCase(runSimulation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Simulation failed';
      });
  },
});

export const {
  setAlgorithm,
  updateParameter,
  pauseSimulation,
  resetSimulation,
  nextStep,
  updateLoss,
  updateExplanation,
} = simulatorSlice.actions;

export default simulatorSlice.reducer;