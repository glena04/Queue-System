import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/reduxHooks';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Access the authentication state from the Redux store
  const isAuthenticated = useAppSelector((state) => state.auth.user !== null);

  // If the user is not authenticated, redirect to the login page
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If authenticated, render the children components
  return <>{children}</>;
};

export default ProtectedRoute;