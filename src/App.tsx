import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/admin/Dashboard'; // Admin page
import CounterInterface from './pages/counter/CounterInterface'; // Counter page
import RemoteInterface from './pages/customer/RemoteInterface'; // Customer page
import ProtectedRoute from './components/auth/ProtectedRoute'; // For protected routes
import Login from './pages/auth/Login'; // Login page
import Register from './pages/auth/Register';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Default route - redirect to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Protected Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/counter"
          element={
            <ProtectedRoute>
              <CounterInterface />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer"
          element={
            <ProtectedRoute>
              <RemoteInterface />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;