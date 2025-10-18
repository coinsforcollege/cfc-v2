import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';
import { Email, CheckCircle } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const OTPDialog = ({ open, email, role, onVerified, onClose }) => {
  const { t } = useTranslation();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [attemptsRemaining, setAttemptsRemaining] = useState(5);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (open) {
      setOtp(['', '', '', '', '', '']);
      setError('');
      setAttemptsRemaining(5);
      setResendTimer(30);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleChange = (index, value) => {
    if (value.length > 1) {
      value = value[0];
    }

    if (!/^\d*$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);

    if (!/^\d+$/.test(pastedData)) {
      return;
    }

    const newOtp = pastedData.split('').concat(Array(6 - pastedData.length).fill(''));
    setOtp(newOtp);

    const nextEmptyIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextEmptyIndex]?.focus();
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');

    if (otpCode.length !== 6) {
      setError(t('auth.enterAllSixDigits'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { authApi } = await import('../api/auth.api');
      let response;

      if (role === 'password_change') {
        response = await authApi.verifyOTPForPasswordChange({
          otp: otpCode
        });
      } else {
        response = await authApi.verifyOTP({
          email,
          otp: otpCode,
          role
        });
      }

      if (response.success) {
        onVerified(response.data.verificationToken);
      }
    } catch (err) {
      setError(err.message || t('auth.invalidOTPTryAgain'));
      if (err.attemptsRemaining !== undefined) {
        setAttemptsRemaining(err.attemptsRemaining);
      }
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setError('');

    try {
      const { authApi } = await import('../api/auth.api');
      let response;

      if (role === 'password_change') {
        response = await authApi.resendOTPForPasswordChange();
      } else {
        response = await authApi.resendOTP({ email, role });
      }

      if (response.success) {
        setResendTimer(30);
        setOtp(['', '', '', '', '', '']);
        setAttemptsRemaining(5);
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      if (err.waitTime) {
        setResendTimer(err.waitTime);
        setError(err.message || t('auth.pleaseWaitBeforeRequesting'));
      } else {
        setError(err.message || t('auth.failedToResendOTP'));
      }
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          background: 'rgba(255, 255, 255, 0.98)'
        }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pt: 4 }}>
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}
        >
          <Email sx={{ fontSize: 32, color: '#8b5cf6' }} />
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#2d3748' }}>
          {t('auth.verifyYourEmail')}
        </Typography>
        <Typography variant="body2" sx={{ color: '#718096', mt: 1 }}>
          {t('auth.sentSixDigitCode')}
        </Typography>
        <Typography variant="body2" sx={{ color: '#8b5cf6', fontWeight: 600 }}>
          {email}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ px: 4, pb: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
            {attemptsRemaining < 5 && attemptsRemaining > 0 && (
              <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                {t('auth.attemptsRemaining', { count: attemptsRemaining })}
              </Typography>
            )}
          </Alert>
        )}

        <Box
          sx={{
            display: 'flex',
            gap: 1.5,
            justifyContent: 'center',
            mb: 3
          }}
        >
          {otp.map((digit, index) => (
            <TextField
              key={index}
              inputRef={el => inputRefs.current[index] = el}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              inputProps={{
                maxLength: 1,
                style: {
                  textAlign: 'center',
                  fontSize: '24px',
                  fontWeight: 600,
                  padding: '16px 0'
                }
              }}
              sx={{
                width: '48px',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '&.Mui-focused fieldset': {
                    borderColor: '#8b5cf6',
                    borderWidth: '2px'
                  }
                }
              }}
            />
          ))}
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {t('auth.didNotReceiveCode')}
          </Typography>
          <Button
            onClick={handleResend}
            disabled={resendTimer > 0 || resendLoading}
            sx={{
              textTransform: 'none',
              color: '#8b5cf6',
              fontWeight: 600,
              '&:hover': {
                background: 'rgba(139, 92, 246, 0.05)'
              }
            }}
          >
            {resendLoading ? (
              <CircularProgress size={20} />
            ) : resendTimer > 0 ? (
              t('auth.resendIn', { seconds: resendTimer })
            ) : (
              t('auth.resendCode')
            )}
          </Button>
        </Box>

        <Box
          sx={{
            mt: 3,
            p: 2,
            borderRadius: '8px',
            background: 'rgba(139, 92, 246, 0.05)',
            border: '1px solid rgba(139, 92, 246, 0.2)'
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <CheckCircle sx={{ fontSize: 14, color: '#8b5cf6' }} />
            {t('auth.codeExpiresIn')}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 4, pb: 4, flexDirection: 'column', gap: 2 }}>
        <Button
          fullWidth
          variant="contained"
          onClick={handleVerify}
          disabled={loading || otp.join('').length !== 6}
          sx={{
            background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
            color: '#ffffff',
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 600,
            textTransform: 'none',
            borderRadius: '8px',
            '&:hover': {
              background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)'
            },
            '&:disabled': {
              background: '#e2e8f0',
              color: '#a0aec0'
            }
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : t('auth.verifyCode')}
        </Button>

        <Button
          fullWidth
          onClick={onClose}
          sx={{
            color: '#718096',
            textTransform: 'none',
            fontWeight: 600
          }}
        >
          {t('common.cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OTPDialog;
