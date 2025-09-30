import { ArrowBack } from '@mui/icons-material';
import {
  Box,
  Button,
  Step,
  StepLabel,
  Stepper,
  Typography
} from '@mui/material';
import React, { useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import StudentStep1 from './student-registration/StudentStep1';
import StudentStep2 from './student-registration/StudentStep2';
import StudentStep3 from './student-registration/StudentStep3';

const steps = [
  'Basic Information',
  'College Selection',
  'Verification',
];

const StudentRegistration = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [registrationData, setRegistrationData] = useState({
    // Step 1 data
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    termsAccepted: false,
    tempToken: null,

    // Step 2 data
    collegeId: null,
    collegeName: '',
    graduationYear: new Date().getFullYear() + 1,
    createNewCollege: false,
    newCollegeData: null,

    // Step 3 data
    emailCode: '',
    phoneCode: '',
    codesRequested: false,
    userId: null,
    isVerified: false,
  });

  const navigate = useNavigate();
  const { login } = useAuth();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [activeStep])

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
    // TODO: Show success message and redirect to login page
    navigate('/auth/login');
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <StudentStep1
            data={registrationData}
            onNext={handleNext}
            onUpdateData={handleUpdateData}
          />
        );
      case 1:
        return (
          <StudentStep2
            data={registrationData}
            onNext={handleNext}
            onBack={handleBack}
            onUpdateData={handleUpdateData}
          />
        );
      case 2:
        return (
          <StudentStep3
            data={registrationData}
            onNext={handleNext}
            onBack={handleBack}
            onUpdateData={handleUpdateData}
            onComplete={handleRegistrationComplete}
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
        py: 6,
        px: 2,
      }}
    >
      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
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
            Join as Student
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Create your account to start mining college tokens
          </Typography>
        </Box>

        {/* Progress Stepper */}
        <Box sx={{ mb: 4 }}>
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
        </Box>

        {/* Step Content */}
        <Box>
          {renderStepContent(activeStep)}
        </Box>
      </Box>
    </Box>
  );
};

export default StudentRegistration;

