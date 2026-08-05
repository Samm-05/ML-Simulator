import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import ProtectedRoute from './ProtectedRoute';
import LandingPage from '../pages/landing/LandingPage';

// Auth Pages
import Login from '../features/auth/Login';
import Register from '../features/auth/Register';
import ForgotPassword from '../features/auth/ForgotPassword';

// Main Pages
import Dashboard from '../features/dashboard/Dashboard';
import PracticePage from '../features/practice/PracticePage';
import LeaderboardPage from '../features/leaderboard/LeaderboardPage';
import ProfilePage from '../features/profile/ProfilePage';

import GradientDescentLab from '../features/gradientDescent/GradientDescentLab';
import LinearRegressionLab from '../features/linearRegression/LinearRegressionLab';
import LogisticRegressionLab from '../features/logisticRegression/LogisticRegressionLab';
import NeuralNetworkLab from '../features/neuralNetwork/NeuralNetworkLab';
import OverfittingLab from '../features/overfittingLab/OverfittingLab';

const AppRoutes: React.FC = () => {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/neural-network" element={<NeuralNetworkLab />} />
          <Route path="/linear-regression" element={<LinearRegressionLab />} />
          <Route path="/gradient-descent" element={<GradientDescentLab />} />
          <Route path="/logistic-regression" element={<LogisticRegressionLab />} />
          <Route path="/overfitting-lab" element={<OverfittingLab />} />

          {/* Legacy Redirects */}
          <Route path="/simulator/neural-network" element={<Navigate to="/neural-network" replace />} />
          <Route path="/simulator/linear-regression" element={<Navigate to="/linear-regression" replace />} />
          <Route path="/simulator/gradient-descent" element={<Navigate to="/gradient-descent" replace />} />
          <Route path="/simulator/logistic-regression" element={<Navigate to="/logistic-regression" replace />} />
          <Route path="/simulator/logistic" element={<Navigate to="/logistic-regression" replace />} />
          <Route path="/simulator/overfitting" element={<Navigate to="/overfitting-lab" replace />} />
          <Route path="/simulator/*" element={<Navigate to="/dashboard" replace />} />

          <Route path="/practice" element={<PracticePage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* Default Routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

export default AppRoutes;
