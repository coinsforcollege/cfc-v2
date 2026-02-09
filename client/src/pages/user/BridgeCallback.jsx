import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Button
} from '@mui/material';
import {
  CheckCircle,
  Error as ErrorIcon,
  ArrowBack
} from '@mui/icons-material';

const BridgeCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [countdown, setCountdown] = useState(5);

  const status = searchParams.get('status');
  const message = searchParams.get('message');

  const isSuccess = status === 'success';
  const isError = status === 'error';

  useEffect(() => {
    if (!status) {
      navigate('/user/dashboard');
      return;
    }

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/user/dashboard');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [status, navigate]);

  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: '#f8fafc'
    }}>
      <Card sx={{
        maxWidth: 480,
        width: '100%',
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        overflow: 'hidden'
      }}>
        {/* Top accent bar */}
        <Box sx={{
          height: 4,
          background: isSuccess
            ? 'linear-gradient(90deg, #10b981, #34d399)'
            : isError
              ? 'linear-gradient(90deg, #ef4444, #f87171)'
              : 'linear-gradient(90deg, #667eea, #764ba2)'
        }} />

        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          {!status ? (
            <CircularProgress />
          ) : isSuccess ? (
            <>
              <Box sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3
              }}>
                <CheckCircle sx={{ fontSize: 40, color: '#10b981' }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
                Account Linked
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Your Intuition Exchange account has been successfully connected.
                You can now migrate your balances.
              </Typography>
            </>
          ) : (
            <>
              <Box sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3
              }}>
                <ErrorIcon sx={{ fontSize: 40, color: '#ef4444' }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
                Connection Failed
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {message || 'Something went wrong while connecting to Intuition Exchange. Please try again.'}
              </Typography>
            </>
          )}

          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
            Redirecting to dashboard in {countdown} seconds...
          </Typography>

          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate('/user/dashboard')}
            sx={{
              textTransform: 'none',
              borderColor: '#8b5cf6',
              color: '#8b5cf6',
              fontWeight: 600,
              '&:hover': {
                borderColor: '#7c3aed',
                background: 'rgba(139, 92, 246, 0.05)'
              }
            }}
          >
            Go to Dashboard
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default BridgeCallback;
