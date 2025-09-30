import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Stack, TextField } from '@mui/material';
import React from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { useAddCollege } from '../../../../api/college/college.mutations';

export const collegeSchema = z.object({
  name: z.string().min(1, 'College name is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  type: z.string().min(1, 'College type is required'),
  country: z.string().min(1, 'Country is required'),
})

function AddCollegeDialog({ open, onClose }) {
  const { register, handleSubmit, formState: { errors, isValid }, control, reset } = useForm({
    resolver: zodResolver(collegeSchema),
    defaultValues: {
      name: '',
      city: '',
      country: '',
      state: '',
      type: '',
    },
    mode: 'onTouched',
  });

  const addCollegeMutation = useAddCollege();

  const onSubmit = (formData) => {
    console.log(formData)
    addCollegeMutation.mutate(formData, {
      onSuccess: () => {
        handleClose();
      }
    })
  }

  const handleClose = () => {
    onClose();
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      slotProps={{
        transition: {
          onExited: () => {
            addCollegeMutation.reset()
            reset();
          },
        }
      }}
    >
      <DialogTitle>{"Add New College"}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogContent>
          <Stack spacing={3}>
            {addCollegeMutation.isError && (
              <Alert severity="error">
                {addCollegeMutation?.error?.message || 'Add college failed. Please try again.'}
              </Alert>
            )}
            <TextField
              fullWidth
              label="College Name"
              {...register('name')}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
              <TextField
                fullWidth
                label="City"
                {...register('city')}
                error={!!errors.city}
                helperText={errors.city?.message}
              />
              <TextField
                fullWidth
                label="State"
                {...register('state')}
                error={!!errors.state}
                helperText={errors.state?.message}
              />
            </Stack>
            <TextField
              fullWidth
              label="Country"
              {...register('country')}
              error={!!errors.country}
              helperText={errors.country?.message}
            />
            <TextField
              select
              fullWidth
              label="College Type"
              {...register('type')}
              error={!!errors.type}
              helperText={errors.type?.message}
              defaultValue=''
            >
              <MenuItem value="public">Public</MenuItem>
              <MenuItem value="private">Private</MenuItem>
              <MenuItem value="community">Community College</MenuItem>
              <MenuItem value="technical">Technical School</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button type='button' onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type='submit'
            disabled={!isValid}
            loading={addCollegeMutation.isPending}
          // onClick={handleAddCollegeSubmit}
          // disabled={!newCollegeData.name || !newCollegeData.city || !newCollegeData.state}
          >
            Add College
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}

export default AddCollegeDialog