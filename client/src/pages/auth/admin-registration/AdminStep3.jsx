import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  MenuItem,
  Card,
  CardContent,
  Avatar,
  IconButton,
  CircularProgress,
} from '@mui/material';
import {
  School,
  CloudUpload,
  LocationOn,
  Language,
  Description,
  Groups,
} from '@mui/icons-material';
import { useAdminRegisterStep3 } from '../../../api/college-admin/admin.mutations';

const collegeTypes = [
  { value: 'public', label: 'Public University' },
  { value: 'private', label: 'Private University' },
  { value: 'community', label: 'Community College' },
  { value: 'technical', label: 'Technical School' },
  { value: 'liberal-arts', label: 'Liberal Arts College' },
  { value: 'research', label: 'Research University' },
  { value: 'other', label: 'Other' },
];

const enrollmentRanges = [
  { value: '0-1000', label: 'Under 1,000 students' },
  { value: '1000-5000', label: '1,000 - 5,000 students' },
  { value: '5000-10000', label: '5,000 - 10,000 students' },
  { value: '10000-20000', label: '10,000 - 20,000 students' },
  { value: '20000-30000', label: '20,000 - 30,000 students' },
  { value: '30000+', label: 'Over 30,000 students' },
];

const AdminStep3 = ({ data, onNext, onBack, onUpdateData }) => {
  const [formData, setFormData] = useState({
    collegeLogo: data.collegeLogo || null,
    collegeInfo: {
      name: data.collegeInfo?.name || data.collegeName || '',
      shortName: data.collegeInfo?.shortName || '',
      address: {
        street: data.collegeInfo?.address?.street || '',
        city: data.collegeInfo?.address?.city || '',
        state: data.collegeInfo?.address?.state || '',
        zipCode: data.collegeInfo?.address?.zipCode || '',
        country: data.collegeInfo?.address?.country || 'United States',
      },
      website: data.collegeInfo?.website || '',
      type: data.collegeInfo?.type || 'public',
      enrollment: data.collegeInfo?.enrollment || '',
      description: data.collegeInfo?.description || '',
    },
  });
  
  const [errors, setErrors] = useState({});
  const [logoPreview, setLogoPreview] = useState(null);

  const step3Mutation = useAdminRegisterStep3();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        collegeInfo: {
          ...prev.collegeInfo,
          [parent]: {
            ...prev.collegeInfo[parent],
            [child]: value,
          },
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        collegeInfo: {
          ...prev.collegeInfo,
          [name]: value,
        },
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          logo: 'Please select an image file'
        }));
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          logo: 'Image size must be less than 5MB'
        }));
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        collegeLogo: file,
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
      
      // Clear error
      if (errors.logo) {
        setErrors(prev => ({
          ...prev,
          logo: ''
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // College name is required
    if (!formData.collegeInfo.name) {
      newErrors.name = 'College name is required';
    }
    
    // Address validation
    if (!formData.collegeInfo.address.city) {
      newErrors['address.city'] = 'City is required';
    }
    
    if (!formData.collegeInfo.address.state) {
      newErrors['address.state'] = 'State is required';
    }
    
    // Website validation (if provided)
    if (formData.collegeInfo.website && !formData.collegeInfo.website.match(/^https?:\/\/.+/)) {
      newErrors.website = 'Please enter a valid website URL (starting with http:// or https://)';
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
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('tempToken', data.tempToken);
      submitData.append('collegeInfo', JSON.stringify(formData.collegeInfo));
      
      if (formData.collegeLogo) {
        submitData.append('collegeLogo', formData.collegeLogo);
      }

      const response = await step3Mutation.mutateAsync(submitData);
      
      if (response.data) {
        // Update parent component data
        onUpdateData({
          ...formData,
          tempToken: response.data.tempToken,
        });
        
        // Move to next step
        onNext();
      }
    } catch (error) {
      console.error('Step 3 failed:', error);
    }
  };

  const getErrorMessage = () => {
    if (step3Mutation.error) {
      return step3Mutation.error.response?.data?.message || 
             step3Mutation.error.message || 
             'College profile setup failed. Please try again.';
    }
    return null;
  };

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        College Profile Setup
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Help us create a complete profile for your college. This information will be visible to students.
      </Typography>

      {getErrorMessage() && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {getErrorMessage()}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        {/* Logo Upload */}
        <Card sx={{ mb: 4, p: 3, textAlign: 'center', bgcolor: 'grey.50' }}>
          <Typography variant="h6" gutterBottom>
            College Logo
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{ 
                width: 120, 
                height: 120, 
                bgcolor: 'primary.main',
                fontSize: '3rem'
              }}
              src={logoPreview}
            >
              {!logoPreview && <School sx={{ fontSize: '3rem' }} />}
            </Avatar>
            
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="logo-upload"
              type="file"
              onChange={handleLogoUpload}
            />
            <label htmlFor="logo-upload">
              <IconButton color="primary" aria-label="upload logo" component="span">
                <CloudUpload />
              </IconButton>
              <Typography variant="body2" component="span" sx={{ ml: 1 }}>
                Upload Logo (Optional)
              </Typography>
            </label>
            
            {errors.logo && (
              <Typography variant="caption" color="error">
                {errors.logo}
              </Typography>
            )}
            
            <Typography variant="caption" color="text.secondary">
              Recommended: 400x400px, PNG or JPG, max 5MB
            </Typography>
          </Box>
        </Card>

        {/* College Information */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <School sx={{ mr: 1, verticalAlign: 'middle' }} />
              College Information
            </Typography>
            
            <TextField
              fullWidth
              name="name"
              label="College Name"
              value={formData.collegeInfo.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              margin="normal"
              required
              disabled={!data.createNewCollege} // Disable if existing college
            />
            
            <TextField
              fullWidth
              name="shortName"
              label="Short Name (Optional)"
              value={formData.collegeInfo.shortName}
              onChange={handleChange}
              margin="normal"
              placeholder="e.g., MIT, UCLA, State"
              helperText="Common abbreviation or nickname"
            />
            
            <TextField
              select
              fullWidth
              name="type"
              label="College Type"
              value={formData.collegeInfo.type}
              onChange={handleChange}
              margin="normal"
            >
              {collegeTypes.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            
            <TextField
              select
              fullWidth
              name="enrollment"
              label="Enrollment Range"
              value={formData.collegeInfo.enrollment}
              onChange={handleChange}
              margin="normal"
              slotProps={{
                input: {
                  startAdornment: <Groups color="action" sx={{ mr: 1 }} />,
                },
              }}
            >
              {enrollmentRanges.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <LocationOn sx={{ mr: 1, verticalAlign: 'middle' }} />
              Address
            </Typography>
            
            <TextField
              fullWidth
              name="address.street"
              label="Street Address (Optional)"
              value={formData.collegeInfo.address.street}
              onChange={handleChange}
              margin="normal"
            />
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                name="address.city"
                label="City"
                value={formData.collegeInfo.address.city}
                onChange={handleChange}
                error={!!errors['address.city']}
                helperText={errors['address.city']}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                name="address.state"
                label="State"
                value={formData.collegeInfo.address.state}
                onChange={handleChange}
                error={!!errors['address.state']}
                helperText={errors['address.state']}
                margin="normal"
                required
              />
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                name="address.zipCode"
                label="ZIP Code (Optional)"
                value={formData.collegeInfo.address.zipCode}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                name="address.country"
                label="Country"
                value={formData.collegeInfo.address.country}
                onChange={handleChange}
                margin="normal"
              />
            </Box>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <Language sx={{ mr: 1, verticalAlign: 'middle' }} />
              Additional Information
            </Typography>
            
            <TextField
              fullWidth
              name="website"
              label="Official Website (Optional)"
              value={formData.collegeInfo.website}
              onChange={handleChange}
              error={!!errors.website}
              helperText={errors.website || "e.g., https://www.college.edu"}
              margin="normal"
              placeholder="https://www.college.edu"
            />
            
            <TextField
              fullWidth
              multiline
              rows={3}
              name="description"
              label="College Description (Optional)"
              value={formData.collegeInfo.description}
              onChange={handleChange}
              margin="normal"
              placeholder="Brief description of your college, its mission, or what makes it unique..."
              helperText="This will be shown to students browsing colleges"
              slotProps={{
                input: {
                  startAdornment: <Description color="action" sx={{ mr: 1, mt: 1, alignSelf: 'flex-start' }} />,
                },
              }}
            />
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
          <Button
            variant="outlined"
            onClick={onBack}
            sx={{ textTransform: 'none' }}
          >
            Back
          </Button>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={step3Mutation.isPending}
            sx={{ 
              py: 1.5,
              textTransform: 'none',
              fontSize: '1.1rem'
            }}
          >
            {step3Mutation.isPending ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Continue'
            )}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminStep3;

