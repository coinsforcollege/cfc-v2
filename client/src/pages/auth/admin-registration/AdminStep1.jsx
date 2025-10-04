import { zodResolver } from '@hookform/resolvers/zod';
import {
  LocationOn,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import {
  Alert,
  AlertTitle,
  Autocomplete,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link as RouterLink, useNavigate } from 'react-router';
import { z } from 'zod';
import { useAdminRegister } from '../../../api/college-admin/admin.mutations';
import { useGetColleges } from '../../../api/student/student.queries';
import AddCollegeDialog from '../student-registration/components/AddCollegeDialog';

const adminRegistrationSchema = z.object({
  firstName: z
    .string()
    .nonempty("First name is required")
    .min(2, "First name must be at least 2 characters"),

  lastName: z
    .string()
    .nonempty("Last name is required")
    .min(2, "Last name must be at least 2 characters"),

  password: z
    .string()
    .nonempty("Password is required")
    .min(6, "Password must be at least 6 characters"),

  confirmPassword: z
    .string()
    .nonempty("Please confirm your password"),

  phone: z
    .string()
    .nonempty("Phone number is required")
    .regex(/^\+?[\d\s\-\(\)]+$/, "Please enter a valid phone number"),

  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),

  college: z.string().min(1, 'Please select a college'),

  email: z
    .string()
    .nonempty("Email is required")
    .regex(/\S+@\S+\.\S+/, "Please enter a valid email address"),

  position: z
    .string()
    .nonempty("Position is required")
    .min(2, "Position must be at least 2 characters"),

  workAtCollege: z.boolean().refine((val) => val === true, {
    message: "You must confirm that you work at this college",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});


const AdminStep1 = ({ data, onNext, onUpdateData }) => {
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, control, formState: { errors, isValid }, handleSubmit } = useForm({
    resolver: zodResolver(adminRegistrationSchema),
    mode: 'onTouched',
  });
  const navigate = useNavigate();

  const [showAddCollegeDialog, setShowAddCollegeDialog] = useState(false);

  const { data: colleges, isLoading: isLoadingColleges, isFetching: isFetchingColleges } = useGetColleges(
    { limit: 50 },
    { enabled: open }
  );
  const collegesData = colleges?.data?.colleges || [];

  const handleAddCollegeClick = () => {
    setShowAddCollegeDialog(true);
  };

  const adminRegisterMutation = useAdminRegister();

  const onSubmit = async (formData) => {
    console.log(formData)
    adminRegisterMutation.mutate(formData, {
      onSuccess: (data) => {
        navigate('/auth/login');
      },
    });
    // try {
    //   const submitData = {
    //     collegeEmail: formData.collegeEmail,
    //     position: formData.position,
    //     createNewCollege: formData.createNewCollege,
    //   };

    //   if (formData.createNewCollege) {
    //     submitData.newCollegeData = newCollegeData;
    //   } else {
    //     submitData.collegeId = formData.collegeId;
    //   }

    //   const response = await step1Mutation.mutateAsync(submitData);

    //   if (response.data) {
    //     // Update parent component data
    //     onUpdateData({
    //       ...formData,
    //       newCollegeData: formData.createNewCollege ? newCollegeData : null,
    //       tempToken: response.data.tempToken,
    //     });

    //     // Move to next step
    //     onNext();
    //   }
    // } catch (error) {
    //   console.error('Step 1 failed:', error);
    // }
  };

  const getErrorMessage = () => {
    if (adminRegisterMutation.isError) {
      return adminRegisterMutation.error.message || 'Admin registration failed. Please try again.';
    }
    return null;
  };

  return (
    <Box>
      {getErrorMessage() && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <AlertTitle>Registration Error</AlertTitle>
          {getErrorMessage()}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={3}>
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

          {/* College Search */}
          <Stack spacing={0.5}>
            <Controller
              name='college'
              control={control}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <Autocomplete
                  open={open}
                  onOpen={() => setOpen(true)}
                  onClose={() => setOpen(false)}
                  getOptionLabel={(option) => option.name || ''}
                  options={collegesData}
                  loading={isFetchingColleges}
                  value={collegesData.find(college => college._id === value) || null}
                  onChange={(event, newValue) => {
                    onChange(newValue ? newValue._id : ''); // Only pass ID
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="College Name"
                      placeholder="Search for your college..."
                      error={!!error}
                      helperText={error?.message}
                      slotProps={{
                        input: {
                          ...params.InputProps,
                          endAdornment: (
                            <React.Fragment>
                              {isFetchingColleges ? <CircularProgress color="inherit" size={20} /> : null}
                              {params.InputProps.endAdornment}
                            </React.Fragment>
                          ),
                        },
                      }}
                    />
                  )}
                  renderOption={(props, option) => (
                    <Box component="li" {...props}>
                      <Box>
                        <Typography variant="body1">{option.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          <LocationOn sx={{ fontSize: 12, mr: 0.5 }} />
                          {option.address?.city}, {option.address?.state}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  noOptionsText={'No colleges found'}
                />
              )}
            />
            <Typography component={'p'} variant='caption' color='text.secondary'>
              Can't find your college? {" "}
              <Link
                component={'button'}
                type='button'
                underline='hover'
                color='primary'
                onClick={handleAddCollegeClick}
              >
                Add it here
              </Link>
            </Typography>
          </Stack>

          {/* Work Confirmation */}
          <Stack spacing={0.5}>
            <FormControlLabel
              control={
                <Checkbox
                  name="workAtCollege"
                  {...register('workAtCollege')}
                  color="primary"
                />
              }
              label={
                <Typography variant="body2">
                  I work at this college
                </Typography>
              }
            />

            {errors.workAtCollege && (
              <Typography variant="caption" color="error" display="block" >
                {errors.workAtCollege?.message}
              </Typography>
            )}
          </Stack>

          {/* Official Email */}
          <TextField
            fullWidth
            name="email"
            label="Official College Email"
            type="email"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.workEmail?.message || "Use your official college email address (@college.edu)"}
            placeholder="your.name@college.edu"
          />

          {/* Position */}
          <TextField
            fullWidth
            name="position"
            label="Position/Title at College"
            {...register('position')}
            error={!!errors.position}
            helperText={errors.position?.message || "e.g., Student Affairs Director, IT Manager, Dean"}
            placeholder="Your position at the college"
          />

          {/* Phone Field */}
          <TextField
            fullWidth
            label="Phone Number"
            type="tel"
            {...register('phone')}
            error={!!errors.phone}
            helperText={errors.phone?.message || "Use your official college phone number"}
            placeholder="+1 (555) 123-4567"
            autoComplete='tel'
          />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
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
          </Stack>

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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={!isValid}
            loading={adminRegisterMutation.isPending}
          >
            Register as Admin
          </Button>
        </Stack>
      </Box>

      {/* Add College Dialog */}
      <AddCollegeDialog
        open={showAddCollegeDialog}
        onClose={() => setShowAddCollegeDialog(false)}
      />
    </Box>
  );
};

export default AdminStep1;

