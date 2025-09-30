import { zodResolver } from '@hookform/resolvers/zod';
import { LocationOn } from '@mui/icons-material';
import { Alert, Autocomplete, Box, Button, CircularProgress, FormControl, InputLabel, Link, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useStudentRegisterStep2 } from '../../../api/student/student.mutations';
import { useGetColleges } from '../../../api/student/student.queries';
import AddCollegeDialog from './components/AddCollegeDialog';
import { studentStep2Schema } from '../../../schemas/auth/studentRegister.schema';

const graduationYears = Array.from({ length: 7 }, (_, i) => 2024 + i);

const StudentStep2 = ({ data, onNext, onBack, onUpdateData }) => {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, formState: { errors, isValid }, control } = useForm({
    resolver: zodResolver(studentStep2Schema),
    defaultValues: {
      college: '',
      graduationYear: new Date().getFullYear() + 1,
    },
    mode: 'onTouched',
  });

  const step2Mutation = useStudentRegisterStep2();

  const [showAddCollegeDialog, setShowAddCollegeDialog] = useState(false);

  const { data: colleges, isLoading: isLoadingColleges, isFetching: isFetchingColleges } = useGetColleges(
    { limit: 50 },
    { enabled: open }
  );
  const collegesData = colleges?.data?.colleges || [];

  const handleAddCollegeClick = () => {
    setShowAddCollegeDialog(true);
  };

  const onSubmit = async (formData) => {
    step2Mutation.mutate({ ...formData, tempToken: data.tempToken }, {
      onSuccess: (response) => {
        const { tempToken, ...rest } = response.data;
        onUpdateData({
          ...formData,
          ...rest,
          tempToken: tempToken || data.tempToken,
        });
        onNext();
      }
    })
  };

  return (
    <Box>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h5" component="h2" gutterBottom>
            College Selection
          </Typography>
          <Typography variant="body2" color="text.secondary" component='p'>
            Find and select your college, or add it if it's not listed.
          </Typography>
        </Box>

        {step2Mutation.isError && (
          <Alert severity="error">
            {step2Mutation.error.message || 'College selection failed. Please try again.'}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack spacing={3}>
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
                    value={collegesData.find(college => college.id === value) || null}
                    onChange={(event, newValue) => {
                      onChange(newValue ? newValue.id : ''); // Only pass ID
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
                  disabled={step2Mutation.isPending}
                >
                  Add it here
                </Link>
              </Typography>
            </Stack>

            {/* Graduation Year */}
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Graduation Year</InputLabel>
              <Controller
                name="graduationYear"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="graduation-year-label"
                    label="Graduation Year"
                  >
                    {graduationYears.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.graduationYear && (
                <p style={{ color: "red", fontSize: "0.8rem" }}>
                  {errors.graduationYear.message}
                </p>
              )}
            </FormControl>

            {/* Navigation Buttons */}
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
            }}>
              <Button
                variant="text"
                onClick={onBack}
                disabled={step2Mutation.isPending}
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={!isValid}
                loading={step2Mutation.isPending}
              >
                Continue
              </Button>
            </Box>
          </Stack>
        </Box>

        {/* Add College Dialog */}
        <AddCollegeDialog
          open={showAddCollegeDialog}
          onClose={() => setShowAddCollegeDialog(false)}
        />
      </Stack >
    </Box >
  );
};

export default StudentStep2;

