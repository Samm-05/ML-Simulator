import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { leaderboardAPI } from './leaderboardAPI';

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar?: string;
  role?: string;
  xp: number;
  points: number;
  level: number;
  streak: number;
  completedModules: number;
  completedLabs: number;
  completedQuizzes: number;
  badges: string[];
  progressPercent: number;
  lastActive?: string;
}

interface LeaderboardState {
  global: LeaderboardEntry[];
  weekly: LeaderboardEntry[];
  byAlgorithm: Record<string, LeaderboardEntry[]>;
  userRank: {
    global: number;
    weekly: number;
    byAlgorithm: Record<string, number>;
  };
  loading: boolean;
  error: string | null;
}

const initialState: LeaderboardState = {
  global: [],
  weekly: [],
  byAlgorithm: {},
  userRank: {
    global: 0,
    weekly: 0,
    byAlgorithm: {},
  },
  loading: false,
  error: null,
};

const extractEntries = (payload: any): LeaderboardEntry[] => {
  if (!payload) return [];
  if (Array.isArray(payload.entries)) return payload.entries;
  if (Array.isArray(payload)) return payload;
  return [];
};

const extractUserRank = (payload: any): number => {
  if (payload && typeof payload.userRank === 'number') return payload.userRank;
  if (payload && typeof payload.rank === 'number') return payload.rank;
  return 0;
};

export const fetchGlobalLeaderboard = createAsyncThunk(
  'leaderboard/fetchGlobal',
  async (_, { rejectWithValue }) => {
    try {
      const response = await leaderboardAPI.getGlobal();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch leaderboard from server');
    }
  }
);

export const fetchWeeklyLeaderboard = createAsyncThunk(
  'leaderboard/fetchWeekly',
  async (_, { rejectWithValue }) => {
    try {
      const response = await leaderboardAPI.getWeekly();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch weekly leaderboard');
    }
  }
);

export const fetchAlgorithmLeaderboard = createAsyncThunk(
  'leaderboard/fetchByAlgorithm',
  async (algorithm: string, { rejectWithValue }) => {
    try {
      const response = await leaderboardAPI.getByAlgorithm(algorithm);
      return { algorithm, data: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch algorithm leaderboard');
    }
  }
);

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Global Leaderboard
      .addCase(fetchGlobalLeaderboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGlobalLeaderboard.fulfilled, (state, action) => {
        state.loading = false;
        state.global = extractEntries(action.payload);
        state.userRank.global = extractUserRank(action.payload);
      })
      .addCase(fetchGlobalLeaderboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Weekly Leaderboard
      .addCase(fetchWeeklyLeaderboard.fulfilled, (state, action) => {
        state.weekly = extractEntries(action.payload);
        state.userRank.weekly = extractUserRank(action.payload);
      })
      // Algorithm Leaderboard
      .addCase(fetchAlgorithmLeaderboard.fulfilled, (state, action) => {
        const { algorithm, data } = action.payload;
        state.byAlgorithm[algorithm] = extractEntries(data);
        state.userRank.byAlgorithm[algorithm] = extractUserRank(data);
      });
  },
});

export default leaderboardSlice.reducer;