import React from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { CircularProgress, Box } from '@mui/material';

const PublicRoute = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isAuthenticated && user) {
    // Redirect authenticated users to their appropriate dashboard
    if (user.role === 'student') {
      return <Navigate to="/student/dashboard" replace />;
    } else if (user.role === 'college_admin') {
      return <Navigate to="/college-admin/dashboard" replace />;
    } else if (user.role === 'platform_admin') {
      return <Navigate to="/platform-admin/dashboard" replace />;
    }
  }

  return children;
};

export default PublicRoute;
