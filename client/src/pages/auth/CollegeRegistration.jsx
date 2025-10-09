import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { authApi } from '../../api/auth.api';

const CollegeRegistration = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const registrationData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      };

      const response = await authApi.registerCollege(registrationData);
      
      if (response.success) {
        // Auto-login
        login(response.data, response.token);
        
        // Redirect to college selection
        navigate('/auth/college-admin-selection');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, rgba(155, 184, 224, 0.4) 0%, rgba(179, 154, 232, 0.3) 50%, rgba(230, 155, 184, 0.3) 100%)',
        px: 2,
        py: 4
      }}
    >
      <Box
        sx={{
          maxWidth: '1200px',
          width: '100%',
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          minHeight: { sm: '600px' }
        }}
      >
        {/* Left Column - Content */}
        <Box
          sx={{
            flex: { xs: 'none', sm: '0 0 50%' },
            p: { xs: 4, md: 6 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
            order: { xs: 2, sm: 1 }
          }}
        >
          <Box sx={{ width: '80%', maxWidth: '400px' }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                mb: 3,
                background: 'linear-gradient(135deg, #0EA5E9 0%, #8B5CF6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Launch Your College Token
            </Typography>

            <Typography variant="body1" sx={{ mb: 3, color: '#4a5568', lineHeight: 1.7 }}>
              Join colleges building vibrant student communities through blockchain technology. Configure your token and track student engagement.
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5, color: '#2d3748' }}>
                What You Get
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#0EA5E9', mb: 0.5 }}>
                    📊 Student Engagement
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Build a vibrant community of engaged students before token launch
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#0EA5E9', mb: 0.5 }}>
                    📈 Growth Tracking
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Monitor student interest and engagement in real-time
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#0EA5E9', mb: 0.5 }}>
                    🔧 Data & Analytics
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Access detailed insights about student demographics and behavior
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#0EA5E9', mb: 0.5 }}>
                    🔒 Secure Platform
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Enterprise-grade security and compliance standards
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Right Column - Form */}
        <Box
          sx={{
            flex: { xs: 'none', sm: '0 0 50%' },
            p: { xs: 4, md: 6 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            order: { xs: 1, sm: 2 }
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              mb: 1,
              color: '#2d3748'
            }}
          >
            Create Admin Account
          </Typography>
          
          <Typography
            variant="body2"
            sx={{
              color: '#718096',
              mb: 3
            }}
          >
            Get started in under 2 minutes
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              sx={{ mb: 3 }}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                background: 'linear-gradient(135deg, #0EA5E9 0%, #8B5CF6 100%)',
                color: '#ffffff',
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: '8px',
                '&:hover': {
                  background: 'linear-gradient(135deg, #0284C7 0%, #7C3AED 100%)',
                },
                mb: 2
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Link
                  to="/auth/login"
                  style={{
                    color: '#0EA5E9',
                    textDecoration: 'none',
                    fontWeight: 600
                  }}
                >
                  Login
                </Link>
              </Typography>
            </Box>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default CollegeRegistration;
