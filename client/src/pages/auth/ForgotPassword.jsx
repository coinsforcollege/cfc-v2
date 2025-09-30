import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  TextField,
  Typography
} from '@mui/material';
import React, { useState } from 'react';
import { Link } from 'react-router';
import { useForgotPassword } from '../../api/student/student.mutations';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const forgotPasswordMutation = useForgotPassword();

  const handleChange = (e) => {
    setEmail(e.target.value);
    
    // Clear error when user starts typing
    if (emailError) {
      setEmailError('');
    }
  };

  const validateEmail = () => {
    if (!email) {
      setEmailError('Email is required');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEmail()) {
      return;
    }

    try {
      await forgotPasswordMutation.mutateAsync({ email });
      setIsSubmitted(true);
    } catch (error) {
      console.error('Forgot password failed:', error);
    }
  };

  const getErrorMessage = () => {
    if (forgotPasswordMutation.error) {
      return forgotPasswordMutation.error.response?.data?.message || 
             forgotPasswordMutation.error.message || 
             'Failed to send reset email. Please try again.';
    }
    return null;
  };

  if (isSubmitted) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 6,
        }}
      >
        <Card
          sx={{
            maxWidth: 400,
            width: '100%',
            mx: 2,
          }}
        >
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <CheckCircle 
              sx={{ 
                fontSize: 64, 
                color: 'success.main', 
                mb: 2 
              }} 
            />
            <Typography variant="h5" component="h1" gutterBottom>
              Check Your Email
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              We've sent a password reset link to:
            </Typography>
            <Typography variant="body1" fontWeight="medium" paragraph>
              {email}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Click the link in the email to reset your password. If you don't see the email, check your spam folder.
            </Typography>
            
            <Box sx={{ mt: 4 }}>
              <Button
                component={Link}
                to="/auth/login"
                variant="contained"
                // startIcon={<ArrowBack />}
                sx={{ textTransform: 'none' }}
              >
                Back to Login
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 6,
      }}
    >
      <Card
        sx={{
          maxWidth: 400,
          width: '100%',
          mx: 2,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ mb: 3 }}>
            <Button
              component={Link}
              to="/auth/login"
              // startIcon={<ArrowBack />}
              sx={{ 
                textTransform: 'none',
                color: 'text.secondary',
                mb: 2
              }}
            >
              Back to Login
            </Button>
          </Box>

          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Forgot Password?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enter your email address and we'll send you a link to reset your password.
            </Typography>
          </Box>

          {getErrorMessage() && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {getErrorMessage()}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              fullWidth
              name="email"
              label="Email Address"
              type="email"
              value={email}
              onChange={handleChange}
              error={!!emailError}
              helperText={emailError}
              margin="normal"
              autoComplete="email"
              autoFocus
              // slotProps={{
              //   input: {
              //     startAdornment: (
              //       <InputAdornment position="start">
              //         <Email color="action" />
              //       </InputAdornment>
              //     ),
              //   },
              // }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={forgotPasswordMutation.isPending}
              sx={{ 
                mt: 3, 
                mb: 2,
                py: 1.5,
                textTransform: 'none',
                fontSize: '1.1rem'
              }}
            >
              {forgotPasswordMutation.isPending ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Send Reset Link'
              )}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ForgotPassword;

