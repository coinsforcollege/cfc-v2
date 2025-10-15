import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Button,
  TextField,
  Typography,
  Alert
} from '@mui/material';
import { Warning, School, Person } from '@mui/icons-material';
import { Link } from 'react-router';

const CollegeAdminConfirmationDialog = ({ open, onConfirm, onCancel }) => {
  const [confirmationText, setConfirmationText] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    if (confirmationText.trim().toLowerCase() === 'i represent a college') {
      onConfirm();
    } else {
      setError('Please type the exact phrase to continue');
    }
  };

  const handleTextChange = (e) => {
    setConfirmationText(e.target.value);
    setError('');
  };

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)'
        }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Warning sx={{ color: '#f59e0b', fontSize: 32 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#2d3748' }}>
            College Admin Registration
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Alert
          severity="warning"
          icon={<School />}
          sx={{
            mb: 3,
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(251, 191, 36, 0.1) 100%)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            '& .MuiAlert-icon': {
              color: '#f59e0b'
            }
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#2d3748', mb: 0.5 }}>
            This registration is ONLY for official college representatives
          </Typography>
        </Alert>

        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" sx={{ color: '#4a5568', mb: 2, lineHeight: 1.7 }}>
            If you are a <strong>student, alumni, fan, or supporter</strong> who wants to mine tokens for your college, you should register through the Community Signup instead.
          </Typography>

          <Box
            sx={{
              p: 2.5,
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%)',
              borderRadius: '12px',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              mb: 3
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <Person sx={{ color: '#8b5cf6' }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#2d3748' }}>
                Are you a student or supporter?
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#4a5568', mb: 1.5 }}>
              Join the community and start mining tokens for your favorite college right away!
            </Typography>
            <Button
              component={Link}
              to="/auth/student-registration"
              variant="contained"
              size="small"
              sx={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                color: '#ffffff',
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
                }
              }}
            >
              Go to Community Signup
            </Button>
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#2d3748', mb: 1.5 }}>
            College Admin Account Requirements:
          </Typography>
          <Box sx={{ pl: 2 }}>
            <Typography variant="body2" sx={{ color: '#4a5568', mb: 1, display: 'flex', alignItems: 'flex-start' }}>
              <Box component="span" sx={{ mr: 1, color: '#0EA5E9', fontWeight: 700 }}>•</Box>
              You must be an official representative of a college or university
            </Typography>
            <Typography variant="body2" sx={{ color: '#4a5568', mb: 1, display: 'flex', alignItems: 'flex-start' }}>
              <Box component="span" sx={{ mr: 1, color: '#0EA5E9', fontWeight: 700 }}>•</Box>
              You will be asked to provide proof of your official association
            </Typography>
            <Typography variant="body2" sx={{ color: '#4a5568', mb: 1, display: 'flex', alignItems: 'flex-start' }}>
              <Box component="span" sx={{ mr: 1, color: '#0EA5E9', fontWeight: 700 }}>•</Box>
              Your account will remain unverified until proof is approved
            </Typography>
            <Typography variant="body2" sx={{ color: '#4a5568', display: 'flex', alignItems: 'flex-start' }}>
              <Box component="span" sx={{ mr: 1, color: '#0EA5E9', fontWeight: 700 }}>•</Box>
              All features will be unlocked after verification is complete
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            p: 2.5,
            background: 'rgba(239, 246, 255, 0.6)',
            borderRadius: '12px',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            mb: 3
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#2d3748', mb: 1.5 }}>
            To proceed with College Admin registration, please type:
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 700,
              color: '#0EA5E9',
              fontFamily: 'monospace',
              fontSize: '0.95rem',
              mb: 2
            }}
          >
            I represent a college
          </Typography>
          <TextField
            fullWidth
            placeholder="Type here..."
            value={confirmationText}
            onChange={handleTextChange}
            error={!!error}
            helperText={error}
            autoFocus
            sx={{
              '& .MuiOutlinedInput-root': {
                background: 'rgba(255, 255, 255, 0.9)',
                '&:hover fieldset': {
                  borderColor: '#0EA5E9',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#0EA5E9',
                }
              }
            }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 0 }}>
        <Button
          onClick={onCancel}
          sx={{
            color: '#718096',
            textTransform: 'none',
            fontWeight: 600
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={!confirmationText.trim()}
          sx={{
            background: 'linear-gradient(135deg, #0EA5E9 0%, #8B5CF6 100%)',
            color: '#ffffff',
            textTransform: 'none',
            fontWeight: 600,
            '&:hover': {
              background: 'linear-gradient(135deg, #0284C7 0%, #7C3AED 100%)',
            },
            '&:disabled': {
              background: '#e2e8f0',
              color: '#a0aec0'
            }
          }}
        >
          Continue to Registration
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CollegeAdminConfirmationDialog;
