import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import dashboardReducer from '../features/dashboard/dashboardSlice';
import simulatorReducer from '../features/simulator/simulatorSlice';
import practiceReducer from '../features/practice/practiceSlice';
import leaderboardReducer from '../features/leaderboard/leaderboardSlice';
import profileReducer from '../features/profile/profileSlice';
import uiReducer from '../features/ui/uiSlice';

import gradientDescentReducer from '../features/gradientDescent/gradientDescentSlice';
import linearRegressionReducer from '../features/linearRegression/linearRegressionSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  dashboard: dashboardReducer,
  simulator: simulatorReducer,
  gradientDescent: gradientDescentReducer,
  linearRegression: linearRegressionReducer,
  practice: practiceReducer,
  leaderboard: leaderboardReducer,
  profile: profileReducer,
  ui: uiReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;