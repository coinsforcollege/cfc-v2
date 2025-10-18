import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { authApi } from '../../api/auth.api';
import OTPDialog from '../../components/OTPDialog';
import CollegeAdminConfirmationDialog from '../../components/CollegeAdminConfirmationDialog';

const CollegeRegistration = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOTPDialog, setShowOTPDialog] = useState(false);
  const [verificationToken, setVerificationToken] = useState(null);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(true);
  const [confirmedAsAdmin, setConfirmedAsAdmin] = useState(false);

  useEffect(() => {
    const hasConfirmed = sessionStorage.getItem('collegeAdminConfirmed');
    if (hasConfirmed === 'true') {
      setConfirmedAsAdmin(true);
      setShowConfirmationDialog(false);
    }
  }, []);

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
      const otpData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        language: i18n.language || 'en'
      };

      const response = await authApi.sendOTPCollege(otpData);

      if (response.success) {
        setShowOTPDialog(true);
      }
    } catch (err) {
      setError(err.message || 'Failed to send verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerified = async (token) => {
    setVerificationToken(token);
    setShowOTPDialog(false);
    setLoading(true);

    try {
      const registrationData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        verificationToken: token
      };

      const response = await authApi.registerCollege(registrationData);

      if (response.success) {
        login(response.data, response.token);
        navigate('/auth/college-admin-selection');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseOTPDialog = () => {
    setShowOTPDialog(false);
  };

  const handleConfirmAdmin = () => {
    setConfirmedAsAdmin(true);
    setShowConfirmationDialog(false);
    sessionStorage.setItem('collegeAdminConfirmed', 'true');
  };

  const handleCancelConfirmation = () => {
    navigate('/auth/student-registration');
  };

  if (!confirmedAsAdmin) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, rgba(155, 184, 224, 0.4) 0%, rgba(179, 154, 232, 0.3) 50%, rgba(230, 155, 184, 0.3) 100%)',
        }}
      >
        <CollegeAdminConfirmationDialog
          open={showConfirmationDialog}
          onConfirm={handleConfirmAdmin}
          onCancel={handleCancelConfirmation}
        />
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
              {t('auth.launchYourCollegeToken')}
            </Typography>

            <Typography variant="body1" sx={{ mb: 3, color: '#4a5568', lineHeight: 1.7 }}>
              {t('auth.joinCollegesBuildingDesc')}
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5, color: '#2d3748' }}>
                {t('auth.whatYouGet')}
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#0EA5E9', mb: 0.5 }}>
                    {t('auth.studentEngagement')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('auth.studentEngagementDesc')}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#0EA5E9', mb: 0.5 }}>
                    {t('auth.growthTracking')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('auth.growthTrackingDesc')}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#0EA5E9', mb: 0.5 }}>
                    {t('auth.dataAndAnalytics')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('auth.dataAndAnalyticsDesc')}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#0EA5E9', mb: 0.5 }}>
                    {t('auth.securePlatform')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('auth.securePlatformDesc')}
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
            {t('auth.createAdminAccount')}
          </Typography>
          
          <Typography
            variant="body2"
            sx={{
              color: '#718096',
              mb: 3
            }}
          >
            {t('auth.getStartedInMinutes')}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label={t('auth.fullName')}
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label={t('auth.email')}
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label={t('auth.phone')}
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label={t('auth.password')}
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label={t('auth.confirmPassword')}
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
              {loading ? <CircularProgress size={24} color="inherit" /> : t('auth.continue')}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {t('auth.alreadyHaveAccount')}{' '}
                <Link
                  to="/auth/login"
                  style={{
                    color: '#0EA5E9',
                    textDecoration: 'none',
                    fontWeight: 600
                  }}
                >
                  {t('auth.loginLink')}
                </Link>
              </Typography>
            </Box>
          </form>
        </Box>
      </Box>

      <OTPDialog
        open={showOTPDialog}
        email={formData.email}
        role="college_admin"
        onVerified={handleOTPVerified}
        onClose={handleCloseOTPDialog}
      />
    </Box>
  );
};

export default CollegeRegistration;
