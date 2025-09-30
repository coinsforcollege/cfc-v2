import { zodResolver } from '@hookform/resolvers/zod';
import {
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { Alert, Box, Button, Divider, IconButton, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { z } from 'zod';
import { useLogin } from '../../api/student/student.mutations';
import { useAuth } from '../../contexts/AuthContext';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .toLowerCase()
    .trim(),

  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password is too long')
})

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login: loginUser } = useAuth();

  const loginMutation = useLogin();

  const onSubmit = async (data) => {
    loginMutation.mutate(data, {
      onSuccess: (response) => {
        if (response.data && response.data.accessToken && response.data.user) {
          // Use auth context to login
          loginUser(response.data.user, response.data.accessToken);

          // Redirect based on user role
          const { role } = response.data.user;
          switch (role) {
            case 'student':
              navigate('/student');
              break;
            case 'college_admin':
              navigate('/college-admin');
              break;
            case 'platform_admin':
              navigate('/admin');
              break;
            default:
              navigate('/dashboard');
          }
        }
      },
      onError: (error) => {
        console.error('Login failed:', error);
      }
    })
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 3,
      }}
    >
      <Box
        sx={{
          maxWidth: 400,
          width: '100%',
          mx: 2,
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome Back
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sign in to your account to continue
          </Typography>
        </Box>

        {loginMutation.isError && (
          <Alert severity="error" className='mb-6'>
            {loginMutation.error.message || 'Login failed. Please try again.'}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack spacing={3}>
            <TextField
              fullWidth
              name="email"
              label="Email Address"
              type="email"
              {...register('email')}
              error={!!errors.email?.message}
              helperText={errors.email?.message}
              margin="normal"
              autoComplete="email"
            />

            <Stack spacing={0.5}>
              <TextField
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                error={!!errors.password?.message}
                helperText={errors.password?.message}
                margin="normal"
                autoComplete="current-password"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <Box sx={{ textAlign: 'right' }}>
                <Button
                  component={Link}
                  to="/auth/forgot-password"
                  variant="text"
                  size="small"
                  sx={{ textTransform: 'none' }}
                >
                  Forgot password?
                </Button>
              </Box>
            </Stack>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              loading={loginMutation.isPending}
            >
              Sign In
            </Button>

            <Divider>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?
              </Typography>
            </Divider>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                component={Link}
                to="/auth/register/student"
                variant="outlined"
                fullWidth
                sx={{ textTransform: 'none' }}
              >
                Join as Student
              </Button>
              <Button
                component={Link}
                to="/auth/register/admin"
                variant="outlined"
                fullWidth
                sx={{ textTransform: 'none' }}
              >
                Join as College
              </Button>
            </Box>
          </Stack>
        </Box>
      </Box>
    </Box >
  );
};

export default Login;