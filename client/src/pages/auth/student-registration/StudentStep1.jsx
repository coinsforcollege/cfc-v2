import { zodResolver } from '@hookform/resolvers/zod';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Alert, Box, Button, Checkbox, FormControlLabel, IconButton, InputAdornment, LinearProgress, Link, Stack, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link as RouterLink } from 'react-router';
import { useStudentRegisterStep1 } from '../../../api/student/student.mutations';
import { studentStep1Schema } from '../../../schemas/auth/studentRegister.schema';
import { getPasswordStrength } from '../../../utils/helperFunctions';

const StudentStep1 = ({ data, onNext, onUpdateData }) => {
  const { register, handleSubmit, formState: { errors, isValid }, watch } = useForm({
    resolver: zodResolver(studentStep1Schema),
    defaultValues: {
      email: data.email || '',
      password: '',
      confirmPassword: '',
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      phone: data.phone || '',
      termsAccepted: data.termsAccepted || false,
    },
    mode: 'onTouched',
  })
  const password = watch('password')

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordStrength = getPasswordStrength(password);

  const step1Mutation = useStudentRegisterStep1();

  // Submit form data to step 1 mutation
  const onSubmit = async (data) => {
    step1Mutation.mutate(data, {
      onSuccess: (response) => {
        const { tempToken, ...rest } = response.data;
        onUpdateData({
          ...data,
          ...rest,
          tempToken
        });

        // Move to next step
        onNext();
      }
    })
  };

  return (
    <Box>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h5" component="h2" gutterBottom>
            Basic Information
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Let's start with some basic information about you.
          </Typography>
        </Box>

        {step1Mutation.isError && (
          <Alert severity="error">
            {step1Mutation?.error?.message || 'Step 1 failed. Please try again.'}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack spacing={3}>
            {/* Name Fields */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
              <TextField
                fullWidth
                label="First Name"
                {...register('firstName')}
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
              />
              <TextField
                fullWidth
                label="Last Name"
                {...register('lastName')}
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
              />
            </Stack>

            {/* Email Field */}
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
              autoComplete="email"
            />

            {/* Phone Field */}
            <TextField
              fullWidth
              label="Phone Number"
              type="tel"
              {...register('phone')}
              error={!!errors.phone}
              helperText={errors.phone?.message}
              placeholder="+1 (555) 123-4567"
              autoComplete='tel'
            />

            {/* Password Field */}
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
              autoComplete="new-password"
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

            {/* Password Strength Indicator */}
            {password && (
              <Box>
                <LinearProgress
                  variant="determinate"
                  value={passwordStrength.strength}
                  color={passwordStrength.color}
                  sx={{ height: 4, borderRadius: 2 }}
                />
                <Typography variant="caption" color={`${passwordStrength.color}.main`}>
                  Password strength: {passwordStrength.text}
                </Typography>
              </Box>
            )}

            {/* Confirm Password Field */}
            <TextField
              fullWidth
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              {...register('confirmPassword')}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              autoComplete="new-password"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            {/* Terms and Conditions */}
            <Stack spacing={0.5}>
              <FormControlLabel
                control={<Checkbox {...register("termsAccepted")} />}
                label={
                  <Typography variant="body2" color="text.secondary">
                    I agree to the{' '}
                    <Link
                      component={RouterLink}
                      to="/terms"
                      color='primary'
                      underline='hover'
                    >
                      Terms and Conditions
                    </Link>
                  </Typography>
                }
              />
              {errors.termsAccepted && (
                <Typography variant="caption" color="error" display="block">
                  {errors.termsAccepted.message}
                </Typography>
              )}
            </Stack>

            {/* Submit Button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={!isValid}
                loading={step1Mutation.isPending}
              >
                Continue
              </Button>
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default StudentStep1;

