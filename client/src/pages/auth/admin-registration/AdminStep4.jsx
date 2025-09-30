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
  FormGroup,
  FormControlLabel,
  Checkbox,
  Chip,
  Paper,
  CircularProgress,
} from '@mui/material';
import {
  Token,
  TrendingUp,
  ShoppingCart,
  Schedule,
  CheckCircle,
  School,
} from '@mui/icons-material';
import { useAdminRegisterStep4 } from '../../../api/college-admin/admin.mutations';

const maxSupplyOptions = [
  { value: '100000', label: '100K tokens' },
  { value: '1000000', label: '1M tokens' },
  { value: '10000000', label: '10M tokens' },
  { value: '100000000', label: '100M tokens' },
  { value: '1000000000', label: '1B tokens' },
  { value: 'custom', label: 'Custom amount' },
];

const launchTimelineOptions = [
  { value: 'Q1-2024', label: 'Q1 2024' },
  { value: 'Q2-2024', label: 'Q2 2024' },
  { value: 'Q3-2024', label: 'Q3 2024' },
  { value: 'Q4-2024', label: 'Q4 2024' },
  { value: 'Q1-2025', label: 'Q1 2025' },
  { value: 'Q2-2025', label: 'Q2 2025' },
  { value: 'later', label: 'Later than Q2 2025' },
  { value: 'not-sure', label: 'Not sure yet' },
];

const earningOptions = [
  'Daily login rewards',
  'Attending events',
  'Academic achievements',
  'Community service',
  'Completing surveys',
  'Referring friends',
];

const spendingOptions = [
  'Campus dining',
  'Bookstore purchases',
  'Event tickets',
  'Parking fees',
  'Library services',
  'Gym membership',
];

const AdminStep4 = ({ data, onBack, onComplete, onUpdateData }) => {
  const [formData, setFormData] = useState({
    tokenConfig: {
      name: data.tokenConfig?.name || '',
      ticker: data.tokenConfig?.ticker || '',
      maxSupply: data.tokenConfig?.maxSupply || '1000000',
      customSupply: data.tokenConfig?.customSupply || '',
      description: data.tokenConfig?.description || '',
      useCase: {
        earning: data.tokenConfig?.useCase?.earning || [],
        spending: data.tokenConfig?.useCase?.spending || [],
      },
      customEarning: data.tokenConfig?.customEarning || '',
      customSpending: data.tokenConfig?.customSpending || '',
      launchTimeline: data.tokenConfig?.launchTimeline || '',
      skipForNow: data.tokenConfig?.skipForNow || false,
    },
  });
  
  const [errors, setErrors] = useState({});

  const step4Mutation = useAdminRegisterStep4();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        tokenConfig: {
          ...prev.tokenConfig,
          [parent]: {
            ...prev.tokenConfig[parent],
            [child]: value,
          },
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        tokenConfig: {
          ...prev.tokenConfig,
          [name]: value.toUpperCase(), // Ticker symbols are typically uppercase
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

  const handleUseCaseChange = (type, option, checked) => {
    setFormData(prev => ({
      ...prev,
      tokenConfig: {
        ...prev.tokenConfig,
        useCase: {
          ...prev.tokenConfig.useCase,
          [type]: checked
            ? [...prev.tokenConfig.useCase[type], option]
            : prev.tokenConfig.useCase[type].filter(item => item !== option),
        },
      },
    }));
  };

  const handleSkip = async () => {
    try {
      const response = await step4Mutation.mutateAsync({
        tempToken: data.tempToken,
        skipForNow: true,
      });
      
      if (response.data) {
        // Update parent component data
        onUpdateData({
          ...formData,
          tokenConfig: {
            ...formData.tokenConfig,
            skipForNow: true,
          },
        });
        
        // Complete registration
        onComplete(response.data);
      }
    } catch (error) {
      console.error('Step 4 skip failed:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.tokenConfig.skipForNow) {
      // Token name validation
      if (!formData.tokenConfig.name) {
        newErrors.name = 'Token name is required';
      } else if (formData.tokenConfig.name.length < 3) {
        newErrors.name = 'Token name must be at least 3 characters';
      }
      
      // Ticker validation
      if (!formData.tokenConfig.ticker) {
        newErrors.ticker = 'Token ticker is required';
      } else if (formData.tokenConfig.ticker.length < 3 || formData.tokenConfig.ticker.length > 5) {
        newErrors.ticker = 'Ticker must be 3-5 characters';
      } else if (!/^[A-Z]+$/.test(formData.tokenConfig.ticker)) {
        newErrors.ticker = 'Ticker must contain only uppercase letters';
      }
      
      // Max supply validation
      if (formData.tokenConfig.maxSupply === 'custom' && !formData.tokenConfig.customSupply) {
        newErrors.customSupply = 'Please enter a custom supply amount';
      }
      
      // Description validation
      if (!formData.tokenConfig.description) {
        newErrors.description = 'Token description is required';
      } else if (formData.tokenConfig.description.length < 20) {
        newErrors.description = 'Description must be at least 20 characters';
      }
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
      const response = await step4Mutation.mutateAsync({
        tempToken: data.tempToken,
        tokenConfig: formData.tokenConfig,
        skipForNow: false,
      });
      
      if (response.data) {
        // Update parent component data
        onUpdateData({
          ...formData,
        });
        
        // Complete registration
        onComplete(response.data);
      }
    } catch (error) {
      console.error('Step 4 failed:', error);
    }
  };

  const getErrorMessage = () => {
    if (step4Mutation.error) {
      return step4Mutation.error.response?.data?.message || 
             step4Mutation.error.message || 
             'Token configuration failed. Please try again.';
    }
    return null;
  };

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        Token Configuration (Optional)
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Configure your future college token or skip this step and set it up later from your dashboard.
      </Typography>

      {getErrorMessage() && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {getErrorMessage()}
        </Alert>
      )}

      {/* College Summary */}
      <Paper sx={{ p: 3, mb: 4, bgcolor: 'success.50', border: '1px solid', borderColor: 'success.200' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <CheckCircle color="success" sx={{ mr: 1 }} />
          <Typography variant="h6" color="success.dark">
            Registration Almost Complete!
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <School color="action" sx={{ mr: 1 }} />
          <Typography variant="body1">
            <strong>{data.collegeInfo?.name || data.collegeName}</strong>
          </Typography>
        </Box>
        
        <Typography variant="body2" color="text.secondary">
          Your college admin account will be ready after this step. Students can start showing interest in your college immediately.
        </Typography>
      </Paper>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        {/* Basic Token Information */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <Token sx={{ mr: 1, verticalAlign: 'middle' }} />
              Basic Token Information
            </Typography>
            
            <TextField
              fullWidth
              name="name"
              label="Token Name"
              value={formData.tokenConfig.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name || "e.g., University of Example Token"}
              margin="normal"
              placeholder="Your College Token"
            />
            
            <TextField
              fullWidth
              name="ticker"
              label="Ticker Symbol"
              value={formData.tokenConfig.ticker}
              onChange={handleChange}
              error={!!errors.ticker}
              helperText={errors.ticker || "3-5 uppercase letters, e.g., UET, COLLEGE"}
              margin="normal"
              placeholder="TOKEN"
              inputProps={{ 
                maxLength: 5,
                style: { textTransform: 'uppercase' }
              }}
            />
            
            <TextField
              select
              fullWidth
              name="maxSupply"
              label="Maximum Supply"
              value={formData.tokenConfig.maxSupply}
              onChange={handleChange}
              margin="normal"
              helperText="Total number of tokens that will ever exist"
            >
              {maxSupplyOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            
            {formData.tokenConfig.maxSupply === 'custom' && (
              <TextField
                fullWidth
                name="customSupply"
                label="Custom Supply Amount"
                value={formData.tokenConfig.customSupply}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  tokenConfig: {
                    ...prev.tokenConfig,
                    customSupply: e.target.value.replace(/\D/g, ''), // Only allow numbers
                  }
                }))}
                error={!!errors.customSupply}
                helperText={errors.customSupply}
                margin="normal"
                placeholder="1000000"
              />
            )}
            
            <TextField
              fullWidth
              multiline
              rows={3}
              name="description"
              label="Token Description"
              value={formData.tokenConfig.description}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                tokenConfig: {
                  ...prev.tokenConfig,
                  description: e.target.value,
                }
              }))}
              error={!!errors.description}
              helperText={errors.description || "Brief description of your token's purpose and use cases"}
              margin="normal"
              placeholder="Describe what your college token will be used for..."
            />
          </CardContent>
        </Card>

        {/* Use Cases */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <TrendingUp sx={{ mr: 1, verticalAlign: 'middle' }} />
              How will students earn tokens?
            </Typography>
            
            <FormGroup>
              {earningOptions.map((option) => (
                <FormControlLabel
                  key={option}
                  control={
                    <Checkbox
                      checked={formData.tokenConfig.useCase.earning.includes(option)}
                      onChange={(e) => handleUseCaseChange('earning', option, e.target.checked)}
                    />
                  }
                  label={option}
                />
              ))}
            </FormGroup>
            
            <TextField
              fullWidth
              name="customEarning"
              label="Custom Earning Method (Optional)"
              value={formData.tokenConfig.customEarning}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                tokenConfig: {
                  ...prev.tokenConfig,
                  customEarning: e.target.value,
                }
              }))}
              margin="normal"
              placeholder="Other ways students can earn tokens..."
            />
          </CardContent>
        </Card>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <ShoppingCart sx={{ mr: 1, verticalAlign: 'middle' }} />
              How will students spend tokens?
            </Typography>
            
            <FormGroup>
              {spendingOptions.map((option) => (
                <FormControlLabel
                  key={option}
                  control={
                    <Checkbox
                      checked={formData.tokenConfig.useCase.spending.includes(option)}
                      onChange={(e) => handleUseCaseChange('spending', option, e.target.checked)}
                    />
                  }
                  label={option}
                />
              ))}
            </FormGroup>
            
            <TextField
              fullWidth
              name="customSpending"
              label="Custom Spending Option (Optional)"
              value={formData.tokenConfig.customSpending}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                tokenConfig: {
                  ...prev.tokenConfig,
                  customSpending: e.target.value,
                }
              }))}
              margin="normal"
              placeholder="Other ways students can spend tokens..."
            />
          </CardContent>
        </Card>

        {/* Launch Timeline */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <Schedule sx={{ mr: 1, verticalAlign: 'middle' }} />
              Launch Timeline
            </Typography>
            
            <TextField
              select
              fullWidth
              name="launchTimeline"
              label="When do you plan to launch?"
              value={formData.tokenConfig.launchTimeline}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                tokenConfig: {
                  ...prev.tokenConfig,
                  launchTimeline: e.target.value,
                }
              }))}
              margin="normal"
              helperText="This is just an estimate and can be changed later"
            >
              {launchTimelineOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mt: 4 }}>
          <Button
            variant="outlined"
            onClick={onBack}
            sx={{ textTransform: 'none', order: { xs: 2, sm: 1 } }}
          >
            Back
          </Button>
          
          <Button
            variant="outlined"
            onClick={handleSkip}
            disabled={step4Mutation.isPending}
            sx={{ 
              textTransform: 'none',
              order: { xs: 3, sm: 2 },
              flex: { sm: 1 }
            }}
          >
            {step4Mutation.isPending ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              'Skip for Now'
            )}
          </Button>
          
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={step4Mutation.isPending}
            sx={{ 
              py: 1.5,
              textTransform: 'none',
              fontSize: '1.1rem',
              order: { xs: 1, sm: 3 },
              flex: { sm: 2 }
            }}
          >
            {step4Mutation.isPending ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Complete Registration'
            )}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminStep4;

