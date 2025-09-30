import { zodResolver } from '@hookform/resolvers/zod';
import {
  Email,
  Refresh,
  Sms,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useStudentRegisterStep3, useStudentResendCodes } from '../../../api/student/student.mutations';
import { studentStep3Schema } from '../../../schemas/auth/studentRegister.schema';

const StudentStep3 = ({ data, onBack, onUpdateData, onComplete }) => {
  const { register, handleSubmit, formState: { errors, isValid }, control } = useForm({
    resolver: zodResolver(studentStep3Schema)
  });

  const [resendCooldown, setResendCooldown] = useState(0);

  const step3Mutation = useStudentRegisterStep3();
  const resendMutation = useStudentResendCodes();

  // Cooldown timer for resend button
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // Resend verification codes
  const handleResendCodes = async () => {
    if (!data.tempToken) {
      return;
    }
    try {
      await resendMutation.mutateAsync({
        tempToken: data.tempToken,
      });

      // Start cooldown
      setResendCooldown(60);
    } catch (error) {
      console.error('Resend codes failed:', error);
    }
  };

  // Submit verification codes
  const onSubmit = async (formData) => {
    step3Mutation.mutate({
      tempToken: data.tempToken,
      emailCode: formData.emailCode,
      phoneCode: formData.phoneCode,
    }, {
      onSuccess: (response) => {
        onUpdateData({
          ...formData,
          ...response.data,
          tempToken: response.data?.tempToken || data.tempToken,
        })

        // complete registration
        onComplete();
      }
    })
  }

  const getErrorMessage = () => {
    if (step3Mutation.isError) {
      return step3Mutation.error.message ||
        'Verification failed. Please check your codes and try again.';
    }

    if (resendMutation.isError) {
      return resendMutation.error.message ||
        'Failed to resend codes. Please try again.';
    }

    return null;
  };

  const getSuccessMessage = () => {
    if (resendMutation.isSuccess) {
      return 'Verification codes have been resent to your email and phone.';
    }
    return null;
  };

  // Format phone number for display
  const formatPhoneNumber = (phone) => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length >= 10) {
      return `(${cleaned.slice(-10, -7)}) ${cleaned.slice(-7, -4)}-${cleaned.slice(-4)}`;
    }
    return phone;
  };

  return (
    <Box>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h5" component="h2" gutterBottom>
            Verification
          </Typography>
          <Typography variant="body2" color="text.secondary">
            We've sent verification codes to your email and phone number. Please enter them below to verify your account.
          </Typography>
        </Box>
        {getErrorMessage() && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {getErrorMessage()}
          </Alert>
        )}

        {getSuccessMessage() && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {getSuccessMessage()}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack spacing={3}>
            {/* Email Verification */}
            <Paper variant='outlined' sx={{ p: 3, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
              <Stack width="100%" spacing={3}>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Email color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">Email Verification</Typography>
                  </Box>

                  <Typography variant="body2" color="text.secondary">
                    Enter the 6-digit code sent to: <strong>{data.email}</strong>
                  </Typography>
                </Stack>

                <TextField
                  fullWidth
                  name="emailCode"
                  label="Email Verification Code"
                  {...register('emailCode')}
                  error={!!errors.emailCode?.message}
                  helperText={errors.emailCode?.message}
                  placeholder="123456"
                  slotProps={{
                    htmlInput: {
                      maxLength: 6,
                      style: {
                        textAlign: 'center',
                        letterSpacing: '0.5em',
                        fontFamily: 'monospace'
                      }
                    }
                  }}
                />
              </Stack>
              <Stack width="100%" spacing={3}>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Sms color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">Phone Verification</Typography>
                  </Box>

                  <Typography variant="body2" color="text.secondary">
                    Enter the 6-digit code sent to: <strong>{formatPhoneNumber(data.phone)}</strong>
                  </Typography>
                </Stack>

                <TextField
                  name="phoneCode"
                  label="Phone Verification Code"
                  {...register('phoneCode')}
                  error={!!errors.phoneCode?.message}
                  helperText={errors.phoneCode?.message}
                  placeholder="123456"
                  slotProps={{
                    htmlInput: {
                      maxLength: 6,
                      style: {
                        textAlign: 'center',
                        letterSpacing: '0.5em',
                        fontFamily: 'monospace'
                      }
                    }
                  }}
                />
              </Stack>
            </Paper>

            {/* Phone Verification */}

            {/* Resend Codes */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="body2" color="text.secondary" paragraph>
                Didn't receive the codes?
              </Typography>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={handleResendCodes}
                loading={resendMutation.isPending}
                disabled={resendCooldown > 0 || resendMutation.isPending}
                sx={{ textTransform: 'none' }}
              >
                {resendCooldown > 0
                  ? `Resend in ${resendCooldown}s`
                  : 'Resend Codes'
                }
              </Button>
            </Box>

            {/* Navigation Buttons */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
              <Button
                variant="text"
                onClick={onBack}
                disabled={step3Mutation.isPending}
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={!isValid}
                loading={step3Mutation.isPending}
              >
                Complete Registration
              </Button>
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Box >
  );
}

export default StudentStep3;

