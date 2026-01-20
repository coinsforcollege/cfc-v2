import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Box, TextField, Button, Typography, Alert, CircularProgress } from '@mui/material';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { authApi } from '../../api/auth.api';

import { trackLogin } from '../../utils/fbPixel';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
    setLoading(true);

    try {
      let recaptchaToken;

      if (import.meta.env.DEV) {
        // Dev bypass
        console.log('Using mock reCAPTCHA token for dev');
        recaptchaToken = 'mock-token';
      } else {
        if (!executeRecaptcha) {
          setError('reCAPTCHA not ready. Please try again.');
          setLoading(false);
          return;
        }

        recaptchaToken = await executeRecaptcha('login');
      }

      const response = await authApi.login({
        ...formData,
        recaptchaToken
      });
      
      if (response.success) {
        login(response.data, response.token);
        
        // Track login event
        trackLogin(response.data.role);
        
        // Redirect based on role
        if (response.data.role === 'user') {
          // Check if user has colleges in miningColleges
          const hasColleges = response.data.userProfile?.miningColleges?.length > 0;

          if (!hasColleges) {
            // No colleges, redirect to college selection
            navigate('/auth/college-selection');
          } else {
            // Has colleges, go to overview page
            navigate('/user/overview');
          }
        } else if (response.data.role === 'college_admin') {
          navigate('/college-admin/dashboard');
        } else if (response.data.role === 'platform_admin') {
          navigate('/platform-admin/dashboard');
        }
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
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
        pt: { xs: 12, md: 14 },
        pb: 4
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
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%)',
            order: { xs: 2, sm: 1 }
          }}
        >
          <Box sx={{ width: '80%', maxWidth: '400px' }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                mb: 3,
                background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              {t('auth.loginTitle')}
            </Typography>

            <Typography variant="body1" sx={{ mb: 3, color: '#4a5568', lineHeight: 1.7 }}>
              {t('auth.loginSubtitle')}
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5, color: '#2d3748' }}>
                {t('auth.whatYouCanDo')}
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#8b5cf6', mb: 0.5 }}>
                    {t('auth.mineCollegeTokens')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('auth.mineCollegeTokensDesc')}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#8b5cf6', mb: 0.5 }}>
                    {t('auth.trackYourEarnings')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('auth.trackYourEarningsDesc')}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#8b5cf6', mb: 0.5 }}>
                    {t('auth.manageYourPortfolio')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('auth.manageYourPortfolioDesc')}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#8b5cf6', mb: 0.5 }}>
                    {t('auth.inviteAndEarnMore')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('auth.inviteAndEarnMoreDesc')}
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
            {t('auth.loginToYourAccount')}
          </Typography>
          
          <Typography
            variant="body2"
            sx={{
              color: '#718096',
              mb: 3
            }}
          >
            {t('auth.accessYourDashboard')}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label={t('auth.email')}
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              label={t('auth.password')}
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              sx={{ mb: 1 }}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
              <Link
                to="/auth/forgot-password"
                style={{
                  color: '#8b5cf6',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 600
                }}
              >
                {t('auth.forgotPassword', 'Forgot Password?')}
              </Link>
            </Box>

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                color: '#ffffff',
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: '8px',
                '&:hover': {
                  background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
                },
                mb: 2
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : t('auth.loginButton')}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                {t('auth.dontHaveAccount')}{' '}
                <Link
                  to="/auth/register/user"
                  style={{
                    color: '#8b5cf6',
                    textDecoration: 'none',
                    fontWeight: 600
                  }}
                >
                  {t('auth.registerAsStudent')}
                </Link>
                {' or '}
                <Link
                  to="/auth/register/college"
                  style={{
                    color: '#8b5cf6',
                    textDecoration: 'none',
                    fontWeight: 600
                  }}
                >
                  {t('auth.registerAsCollege')}
                </Link>
              </Typography>
            </Box>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;