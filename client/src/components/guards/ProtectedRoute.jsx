import React from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { CircularProgress, Box } from '@mui/material';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // Redirect to appropriate dashboard based on user's actual role
    if (user?.role === 'student') {
      return <Navigate to="/student/dashboard" replace />;
    } else if (user?.role === 'college_admin') {
      return <Navigate to="/college-admin/dashboard" replace />;
    } else if (user?.role === 'platform_admin') {
      return <Navigate to="/platform-admin/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  // Enforce prerequisites for students - must have at least one college selected
  // Skip this check if already on college-selection page
  if (user?.role === 'student' && location.pathname !== '/auth/college-selection') {
    const hasColleges = user?.studentProfile?.miningColleges?.length > 0;
    if (!hasColleges) {
      return <Navigate to="/auth/college-selection" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
