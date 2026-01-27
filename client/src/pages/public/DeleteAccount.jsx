import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Alert, CircularProgress, Stepper, Step, StepLabel } from '@mui/material';
import { authApi } from '../../api/auth.api';

const DeleteAccount = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [reason, setReason] = useState('');
  const [verificationToken, setVerificationToken] = useState('');
  const [timer, setTimer] = useState(0);

  const steps = ['Verify Identity', 'Enter Code', 'Confirm Deletion'];

  // Timer countdown
  useEffect(() => {
    let interval;
    if (activeStep === 1 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeStep, timer]);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await authApi.sendPublicAccountDeletionOTP({ email, password });
      if (response.success) {
        setSuccess('Verification code sent to your email.');
        setActiveStep(1);
        setTimer(60);
      }
    } catch (err) {
      setError(err.message || 'Failed to verify credentials. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await authApi.sendPublicAccountDeletionOTP({ email, password });
      if (response.success) {
        setSuccess('Verification code resent successfully.');
        setTimer(60);
      }
    } catch (err) {
      setError(err.message || 'Failed to resend code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await authApi.verifyPublicAccountDeletionOTP({ email, otp });
      if (response.success) {
        setVerificationToken(response.data.verificationToken);
        setSuccess('Code verified successfully.');
        setActiveStep(2);
      }
    } catch (err) {
      setError(err.message || 'Invalid verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitDeletion = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authApi.requestPublicAccountDeletion({
        email,
        verificationToken,
        reason: reason.trim() || undefined
      });

      if (response.success) {
        setSuccess('Your account deletion request has been submitted successfully. Our team will process it and you will receive a confirmation email.');
        setActiveStep(3);
      }
    } catch (err) {
      setError(err.message || 'Failed to submit deletion request. Please try again.');
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
        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 50%, rgba(185, 28, 28, 0.1) 100%)',
        px: 2,
        py: 4
      }}
    >
      <Box
        sx={{
          maxWidth: '500px',
          width: '100%',
          background: 'rgba(255, 255, 255, 0.98)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          p: 4
        }}
      >
        <Typography
          variant="h4"
          align="center"
          sx={{
            fontWeight: 800,
            mb: 1,
            color: '#dc2626'
          }}
        >
          Delete Account
        </Typography>

        <Typography
          variant="body2"
          align="center"
          sx={{ mb: 3, color: '#64748b' }}
        >
          Coins For College
        </Typography>

        {activeStep < 3 && (
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity={activeStep === 3 ? 'success' : 'info'} sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        {activeStep === 0 && (
          <form onSubmit={handleSendOTP}>
            <Box sx={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              p: 2,
              mb: 3
            }}>
              <Typography variant="body2" sx={{ color: '#dc2626', fontWeight: 500, mb: 1 }}>
                Warning: This action cannot be undone
              </Typography>
              <Typography variant="body2" sx={{ color: '#7f1d1d' }}>
                Once your deletion request is processed, all your data will be permanently removed from our system.
              </Typography>
            </Box>

            <Typography variant="body1" sx={{ mb: 3, textAlign: 'center', color: '#4a5568' }}>
              Enter your account credentials to verify your identity.
            </Typography>

            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={{ mb: 3 }}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                background: '#dc2626',
                color: '#ffffff',
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: '8px',
                '&:hover': {
                  background: '#b91c1c',
                }
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Continue'}
            </Button>
          </form>
        )}

        {activeStep === 1 && (
          <form onSubmit={handleVerifyOTP}>
            <Typography variant="body1" sx={{ mb: 3, textAlign: 'center', color: '#4a5568' }}>
              Enter the 6-digit verification code sent to <strong>{email}</strong>
            </Typography>

            <TextField
              fullWidth
              label="Verification Code"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              inputProps={{ maxLength: 6 }}
              sx={{ mb: 3 }}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                background: '#dc2626',
                color: '#ffffff',
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: '8px',
                '&:hover': {
                  background: '#b91c1c',
                },
                mb: 2
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Verify Code'}
            </Button>

            <Button
              fullWidth
              variant="outlined"
              onClick={handleResendOTP}
              disabled={loading || timer > 0}
              sx={{
                mb: 2,
                borderColor: '#e2e8f0',
                color: timer > 0 ? '#94a3b8' : '#dc2626',
                '&:hover': {
                  borderColor: '#dc2626',
                  background: 'rgba(220, 38, 38, 0.04)'
                }
              }}
            >
              {timer > 0 ? `Resend Code in ${timer}s` : 'Resend Code'}
            </Button>

            <Button
              fullWidth
              variant="text"
              onClick={() => {
                setActiveStep(0);
                setOtp('');
                setError('');
                setSuccess('');
              }}
              disabled={loading}
              sx={{ color: '#64748b' }}
            >
              Back
            </Button>
          </form>
        )}

        {activeStep === 2 && (
          <form onSubmit={handleSubmitDeletion}>
            <Box sx={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              p: 2,
              mb: 3
            }}>
              <Typography variant="body2" sx={{ color: '#dc2626', fontWeight: 500, mb: 1 }}>
                Final Step
              </Typography>
              <Typography variant="body2" sx={{ color: '#7f1d1d' }}>
                After submitting, your deletion request will be sent to our team for processing. You can still use your account until the request is processed.
              </Typography>
            </Box>

            <Typography variant="body1" sx={{ mb: 2, color: '#4a5568' }}>
              Please tell us why you're leaving (optional):
            </Typography>

            <TextField
              fullWidth
              label="Reason for leaving"
              multiline
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Help us improve our service..."
              sx={{ mb: 3 }}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                background: '#dc2626',
                color: '#ffffff',
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: '8px',
                '&:hover': {
                  background: '#b91c1c',
                },
                mb: 2
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit Deletion Request'}
            </Button>

            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                setActiveStep(1);
                setError('');
                setSuccess('');
              }}
              disabled={loading}
              sx={{
                borderColor: '#e2e8f0',
                color: '#64748b',
                '&:hover': {
                  borderColor: '#94a3b8',
                  background: 'rgba(100, 116, 139, 0.04)'
                }
              }}
            >
              Back
            </Button>
          </form>
        )}

        {activeStep === 3 && (
          <Box sx={{ textAlign: 'center' }}>
            <Box sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: '#dcfce7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px'
            }}>
              <Typography sx={{ fontSize: 40 }}>&#10003;</Typography>
            </Box>

            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#166534' }}>
              Request Submitted
            </Typography>

            <Typography variant="body1" sx={{ color: '#4a5568', mb: 3 }}>
              Your account deletion request has been submitted. Our team will review and process it. You will receive a confirmation email once your account has been deleted.
            </Typography>

            <Typography variant="body2" sx={{ color: '#64748b' }}>
              You can close this page now.
            </Typography>
          </Box>
        )}

        {activeStep < 3 && (
          <Box sx={{ textAlign: 'center', mt: 3, pt: 3, borderTop: '1px solid #e2e8f0' }}>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              Changed your mind?{' '}
              <a
                href="/"
                style={{
                  color: '#8b5cf6',
                  textDecoration: 'none',
                  fontWeight: 600
                }}
              >
                Return to Homepage
              </a>
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default DeleteAccount;
