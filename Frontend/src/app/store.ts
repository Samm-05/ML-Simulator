import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import dashboardReducer from '../features/dashboard/dashboardSlice';
import simulatorReducer from '../features/simulator/simulatorSlice';
import practiceReducer from '../features/practice/practiceSlice';
import leaderboardReducer from '../features/leaderboard/leaderboardSlice';
import profileReducer from '../features/profile/profileSlice';
import uiReducer from '../features/ui/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    simulator: simulatorReducer,
    practice: practiceReducer,
    leaderboard: leaderboardReducer,
    profile: profileReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['simulator/runSimulation'],
        ignoredPaths: ['simulator.animationFrame'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;