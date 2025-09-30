import { ArrowBack } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import AdminStep1 from './admin-registration/AdminStep1';
import { useAuth } from '../../contexts/AuthContext';
import AdminStep3 from './admin-registration/AdminStep3';
import AdminStep4 from './admin-registration/AdminStep4';

const steps = [
  'College Verification',
  'Personal Information',
  'College Profile Setup',
  'Token Configuration'
];

const AdminRegistration = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [registrationData, setRegistrationData] = useState({
    // Step 1 data
    collegeId: null,
    collegeName: '',
    collegeEmail: '',
    position: '',
    createNewCollege: false,
    newCollegeData: null,
    tempToken: null,
    
    // Step 2 data
    firstName: '',
    lastName: '',
    workPhone: '',
    password: '',
    confirmPassword: '',
    emailVerified: false,
    
    // Step 3 data
    collegeLogo: null,
    collegeInfo: {
      name: '',
      shortName: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'United States'
      },
      website: '',
      type: 'public',
      enrollment: '',
      description: ''
    },
    
    // Step 4 data
    tokenConfig: {
      name: '',
      ticker: '',
      maxSupply: '1000000',
      description: '',
      useCase: {
        earning: [],
        spending: []
      },
      launchTimeline: '',
      skipForNow: false
    }
  });

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleUpdateData = (stepData) => {
    setRegistrationData(prev => ({
      ...prev,
      ...stepData
    }));
  };

  const handleRegistrationComplete = (finalData) => {
    // Login the user with the received token and user data
    if (finalData.token && finalData.user) {
      login(finalData.user, finalData.token);
      navigate('/admin/dashboard');
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <AdminStep1
            data={registrationData}
            onNext={handleNext}
            onUpdateData={handleUpdateData}
          />
        );
      // case 1:
      //   return (
      //     <AdminStep2
      //       data={registrationData}
      //       onNext={handleNext}
      //       onBack={handleBack}
      //       onUpdateData={handleUpdateData}
      //     />
      //   );
      case 2:
        return (
          <AdminStep3
            data={registrationData}
            onNext={handleNext}
            onBack={handleBack}
            onUpdateData={handleUpdateData}
          />
        );
      case 3:
        return (
          <AdminStep4
            data={registrationData}
            onBack={handleBack}
            onComplete={handleRegistrationComplete}
            onUpdateData={handleUpdateData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: 3,
      }}
    >
      <Box sx={{ maxWidth: 900, mx: 'auto', px: 2 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
           <Button
             startIcon={<ArrowBack />}
             onClick={() => navigate('/auth/login')}
             sx={{ 
               textTransform: 'none',
               color: 'text.secondary',
               mb: 2
             }}
           >
             Back to Login
           </Button>
          
          <Typography variant="h4" component="h1" gutterBottom>
            Join as College Admin
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Set up your college's token program and connect with students
          </Typography>
        </Box>

        {/* Progress Stepper */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel
                    sx={{
                      '& .MuiStepLabel-label': {
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      },
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </CardContent>
        </Card>

        {/* Step Content */}
        <Card>
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            {renderStepContent(activeStep)}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default AdminRegistration;
