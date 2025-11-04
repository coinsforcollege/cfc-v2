import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Chip
} from '@mui/material';
import { School } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { authApi } from '../../api/auth.api';
import { collegesApi } from '../../api/colleges.api';
import OTPDialog from '../../components/OTPDialog';

const StudentRegistration = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [searchParams] = useSearchParams();
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    referralCode: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [referralCollege, setReferralCollege] = useState(null);
  const [showOTPDialog, setShowOTPDialog] = useState(false);
  const [verificationToken, setVerificationToken] = useState(null);

  // Extract referral code and college ID from URL params
  useEffect(() => {
    const refCode = searchParams.get('ref');
    const collegeId = searchParams.get('college');

    if (refCode) {
      setFormData(prev => ({ ...prev, referralCode: refCode }));
    }

    if (collegeId) {
      // Fetch college details to display
      collegesApi.getById(collegeId)
        .then(response => {
          setReferralCollege(response.data);
        })
        .catch(err => {
          console.error('Failed to fetch college:', err);
        });
    }
  }, [searchParams]);

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
      const collegeId = searchParams.get('college');

      const otpData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        referralCode: formData.referralCode || undefined,
        collegeId: collegeId || undefined,
        language: i18n.language || 'en'
      };

      const response = await authApi.sendOTPUser(otpData);

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
      const collegeId = searchParams.get('college');

      const registrationData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        referralCode: formData.referralCode || undefined,
        collegeId: collegeId || undefined,
        verificationToken: token
      };

      const response = await authApi.registerUser(registrationData);

      if (response.success) {
        login(response.data, response.token);

        const hasColleges = response.data.userProfile?.miningColleges?.length > 0;

        if (hasColleges) {
          navigate('/user/dashboard');
        } else {
          navigate('/auth/college-selection');
        }
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
              {t('auth.joinFutureCollegeTokens')}
            </Typography>

            <Typography variant="body1" sx={{ mb: 3, color: '#4a5568', lineHeight: 1.7 }}>
              {t('auth.startMiningTokensDesc')}
            </Typography>

            <Box sx={{ mb: 3 }}>
              
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#8b5cf6', mb: 0.5 }}>
                    {t('auth.mineCollegeTokensStudent')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('auth.mineCollegeTokensStudentDesc')}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#8b5cf6', mb: 0.5 }}>
                    {t('auth.earlyAdopterBenefits')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('auth.earlyAdopterBenefitsDesc')}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#8b5cf6', mb: 0.5 }}>
                    {t('auth.buildYourNetwork')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('auth.buildYourNetworkDesc')}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#8b5cf6', mb: 0.5 }}>
                    {t('auth.referralRewards')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('auth.referralRewardsDesc')}
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
            {t('auth.createYourAccount')}
          </Typography>
          
          <Typography
            variant="body2"
            sx={{
              color: '#718096',
              mb: 3
            }}
          >
            {t('auth.startMiningInMinutes')}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {referralCollege && (
            <Alert
              severity="info"
              icon={<School />}
              sx={{
                mb: 3,
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                '& .MuiAlert-icon': {
                  color: '#8b5cf6'
                }
              }}
            >
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#2d3748', mb: 0.5 }}>
                  {t('auth.youWereInvitedToJoin', { college: referralCollege.name })}
                </Typography>
                <Typography variant="caption" sx={{ color: '#4a5568' }}>
                  {t('auth.collegeWillBeAdded')}
                </Typography>
              </Box>
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
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label={t('auth.referralCodeOptional')}
              name="referralCode"
              value={formData.referralCode}
              onChange={handleChange}
              sx={{ mb: 3 }}
            />

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
              {loading ? <CircularProgress size={24} color="inherit" /> : t('auth.continue')}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {t('auth.alreadyHaveAccount')}{' '}
                <Link
                  to="/auth/login"
                  style={{
                    color: '#8b5cf6',
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
        role="user"
        onVerified={handleOTPVerified}
        onClose={handleCloseOTPDialog}
      />
    </Box>
  );
};

export default StudentRegistration;