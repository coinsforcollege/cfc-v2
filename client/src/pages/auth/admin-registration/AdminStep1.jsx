import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Autocomplete,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Chip,
  Card,
  CardContent,
  Avatar,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import {
  School,
  Add,
  LocationOn,
  Email,
  Work,
} from '@mui/icons-material';
import { useAdminRegisterStep1 } from '../../../api/college-admin/admin.mutations';
import { useSearchColleges } from '../../../api/college-admin/admin.queries';

const AdminStep1 = ({ data, onNext, onUpdateData }) => {
  const [formData, setFormData] = useState({
    collegeId: data.collegeId || null,
    collegeName: data.collegeName || '',
    collegeEmail: data.collegeEmail || '',
    position: data.position || '',
    createNewCollege: data.createNewCollege || false,
    workAtCollege: false,
  });
  
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [collegeSearch, setCollegeSearch] = useState('');
  const [showAddCollegeDialog, setShowAddCollegeDialog] = useState(false);
  const [newCollegeData, setNewCollegeData] = useState({
    name: '',
    shortName: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    type: 'public',
    website: '',
    email: '',
  });
  const [errors, setErrors] = useState({});

  const step1Mutation = useAdminRegisterStep1();
  const { data: searchResults, isLoading: isSearching } = useSearchColleges(
    collegeSearch,
    { enabled: collegeSearch.length > 2 }
  );

  // Update selected college when search results change
  useEffect(() => {
    if (data.collegeId && searchResults?.data) {
      const college = searchResults.data.find(c => c._id === data.collegeId);
      if (college) {
        setSelectedCollege(college);
        setFormData(prev => ({
          ...prev,
          collegeId: college._id,
          collegeName: college.name,
        }));
      }
    }
  }, [data.collegeId, searchResults]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: fieldValue
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleCollegeSelect = (event, value) => {
    if (value) {
      setSelectedCollege(value);
      setFormData(prev => ({
        ...prev,
        collegeId: value._id,
        collegeName: value.name,
        createNewCollege: false,
      }));
      
      // Clear error
      if (errors.college) {
        setErrors(prev => ({ ...prev, college: '' }));
      }
    } else {
      setSelectedCollege(null);
      setFormData(prev => ({
        ...prev,
        collegeId: null,
        collegeName: '',
        createNewCollege: false,
      }));
    }
  };

  const handleAddCollegeClick = () => {
    setNewCollegeData(prev => ({
      ...prev,
      name: collegeSearch,
    }));
    setShowAddCollegeDialog(true);
  };

  const handleNewCollegeChange = (e) => {
    const { name, value } = e.target;
    setNewCollegeData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddCollegeSubmit = () => {
    // Basic validation for new college
    if (!newCollegeData.name || !newCollegeData.city || !newCollegeData.state) {
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      createNewCollege: true,
      collegeName: newCollegeData.name,
      collegeId: null,
    }));
    
    setSelectedCollege({
      name: newCollegeData.name,
      city: newCollegeData.city,
      state: newCollegeData.state,
      type: newCollegeData.type,
      isNew: true,
    });
    
    setShowAddCollegeDialog(false);
    
    // Clear error
    if (errors.college) {
      setErrors(prev => ({ ...prev, college: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!selectedCollege) {
      newErrors.college = 'Please select or add your college';
    }
    
    if (!formData.workAtCollege) {
      newErrors.workAtCollege = 'Please confirm that you work at this college';
    }
    
    if (!formData.collegeEmail) {
      newErrors.collegeEmail = 'Official college email is required';
    } else if (!formData.collegeEmail.includes('@')) {
      newErrors.collegeEmail = 'Please enter a valid email address';
    } else {
      // Check if email domain matches college domain pattern
      const emailDomain = formData.collegeEmail.split('@')[1];
      if (!emailDomain.includes('.edu') && !emailDomain.includes('college') && !emailDomain.includes('university')) {
        newErrors.collegeEmail = 'Please use your official college email address (@college.edu)';
      }
    }
    
    if (!formData.position) {
      newErrors.position = 'Please specify your position at the college';
    } else if (formData.position.length < 2) {
      newErrors.position = 'Position must be at least 2 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const submitData = {
        collegeEmail: formData.collegeEmail,
        position: formData.position,
        createNewCollege: formData.createNewCollege,
      };
      
      if (formData.createNewCollege) {
        submitData.newCollegeData = newCollegeData;
      } else {
        submitData.collegeId = formData.collegeId;
      }

      const response = await step1Mutation.mutateAsync(submitData);
      
      if (response.data) {
        // Update parent component data
        onUpdateData({
          ...formData,
          newCollegeData: formData.createNewCollege ? newCollegeData : null,
          tempToken: response.data.tempToken,
        });
        
        // Move to next step
        onNext();
      }
    } catch (error) {
      console.error('Step 1 failed:', error);
    }
  };

  const getErrorMessage = () => {
    if (step1Mutation.error) {
      return step1Mutation.error.response?.data?.message || 
             step1Mutation.error.message || 
             'College verification failed. Please try again.';
    }
    return null;
  };

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        College Verification
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        First, let's verify your college affiliation and official email address.
      </Typography>

      {getErrorMessage() && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {getErrorMessage()}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        {/* College Search */}
        <Autocomplete
          options={searchResults?.data || []}
          getOptionLabel={(option) => option.name || ''}
          value={selectedCollege}
          onChange={handleCollegeSelect}
          inputValue={collegeSearch}
          onInputChange={(event, newValue) => setCollegeSearch(newValue)}
          loading={isSearching}
          freeSolo
          renderInput={(params) => (
            <TextField
              {...params}
              label="Find your college"
              placeholder="Search for your college..."
              error={!!errors.college}
              helperText={errors.college || "Start typing to search for colleges"}
              slotProps={{
                input: {
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      <School color="action" sx={{ mr: 1 }} />
                      {params.InputProps.startAdornment}
                    </>
                  ),
                  endAdornment: (
                    <>
                      {isSearching ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                },
              }}
            />
          )}
          renderOption={(props, option) => (
            <Box component="li" {...props}>
              <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                <School />
              </Avatar>
              <Box>
                <Typography variant="body1">{option.name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  <LocationOn sx={{ fontSize: 12, mr: 0.5 }} />
                  {option.address?.city}, {option.address?.state}
                  {option.type && (
                    <Chip
                      label={option.type}
                      size="small"
                      sx={{ ml: 1, height: 16, fontSize: '0.7rem' }}
                    />
                  )}
                </Typography>
              </Box>
            </Box>
          )}
          noOptionsText={
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Don't see your college?
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<Add />}
                onClick={handleAddCollegeClick}
                sx={{ textTransform: 'none' }}
              >
                Add "{collegeSearch}"
              </Button>
            </Box>
          }
          sx={{ mb: 3 }}
        />

        {/* Selected College Display */}
        {selectedCollege && (
          <Card sx={{ mb: 3, bgcolor: 'primary.50' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                  <School />
                </Avatar>
                <Box>
                  <Typography variant="h6">{selectedCollege.name}</Typography>
                  {selectedCollege.isNew ? (
                    <Chip label="New College" color="success" size="small" />
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      <LocationOn sx={{ fontSize: 14, mr: 0.5 }} />
                      {selectedCollege.address?.city || selectedCollege.city}, {selectedCollege.address?.state || selectedCollege.state}
                      {selectedCollege.type && (
                        <Chip
                          label={selectedCollege.type}
                          size="small"
                          sx={{ ml: 1 }}
                        />
                      )}
                    </Typography>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Work Confirmation */}
        <FormControlLabel
          control={
            <Checkbox
              name="workAtCollege"
              checked={formData.workAtCollege}
              onChange={handleChange}
              color="primary"
            />
          }
          label={
            <Typography variant="body2">
              I work at this college
            </Typography>
          }
          sx={{ mb: 2 }}
        />
        
        {errors.workAtCollege && (
          <Typography variant="caption" color="error" display="block" sx={{ mt: -1, mb: 2 }}>
            {errors.workAtCollege}
          </Typography>
        )}

        {/* Official Email */}
        <TextField
          fullWidth
          name="collegeEmail"
          label="Official College Email"
          type="email"
          value={formData.collegeEmail}
          onChange={handleChange}
          error={!!errors.collegeEmail}
          helperText={errors.collegeEmail || "Use your official college email address (@college.edu)"}
          margin="normal"
          placeholder="your.name@college.edu"
          slotProps={{
            input: {
              startAdornment: (
                <Email color="action" sx={{ mr: 1 }} />
              ),
            },
          }}
        />

        {/* Position */}
        <TextField
          fullWidth
          name="position"
          label="Position/Title at College"
          value={formData.position}
          onChange={handleChange}
          error={!!errors.position}
          helperText={errors.position || "e.g., Student Affairs Director, IT Manager, Dean"}
          margin="normal"
          placeholder="Your position at the college"
          slotProps={{
            input: {
              startAdornment: (
                <Work color="action" sx={{ mr: 1 }} />
              ),
            },
          }}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={step1Mutation.isPending}
          sx={{ 
            mt: 4,
            py: 1.5,
            textTransform: 'none',
            fontSize: '1.1rem'
          }}
        >
          {step1Mutation.isPending ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Continue'
          )}
        </Button>
      </Box>

      {/* Add College Dialog */}
      <Dialog
        open={showAddCollegeDialog}
        onClose={() => setShowAddCollegeDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New College</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="College Name"
              name="name"
              value={newCollegeData.name}
              onChange={handleNewCollegeChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Short Name (Optional)"
              name="shortName"
              value={newCollegeData.shortName}
              onChange={handleNewCollegeChange}
              margin="normal"
              placeholder="e.g., MIT, UCLA"
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="City"
                name="city"
                value={newCollegeData.city}
                onChange={handleNewCollegeChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="State"
                name="state"
                value={newCollegeData.state}
                onChange={handleNewCollegeChange}
                margin="normal"
                required
              />
            </Box>
            <TextField
              select
              fullWidth
              label="College Type"
              name="type"
              value={newCollegeData.type}
              onChange={handleNewCollegeChange}
              margin="normal"
            >
              <MenuItem value="public">Public</MenuItem>
              <MenuItem value="private">Private</MenuItem>
              <MenuItem value="community">Community College</MenuItem>
              <MenuItem value="technical">Technical School</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </TextField>
            <TextField
              fullWidth
              label="Website (Optional)"
              name="website"
              value={newCollegeData.website}
              onChange={handleNewCollegeChange}
              margin="normal"
              placeholder="https://college.edu"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddCollegeDialog(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleAddCollegeSubmit}
            variant="contained"
            disabled={!newCollegeData.name || !newCollegeData.city || !newCollegeData.state}
          >
            Add College
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminStep1;

