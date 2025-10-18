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
import { Warning, School } from '@mui/icons-material';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';

const CollegeAdminConfirmationDialog = ({ open, onConfirm, onCancel }) => {
  const { t } = useTranslation();
  const [confirmationText, setConfirmationText] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    if (confirmationText.trim().toLowerCase() === 'i represent a college') {
      onConfirm();
    } else {
      setError(t('auth.pleaseTypeExactPhrase'));
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
          <Warning sx={{ color: '#f59e0b', fontSize: 24 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#2d3748' }}>
            {t('auth.attention')}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Alert
          severity="warning"
          icon={<School />}
          sx={{
            mb: 2,
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(251, 191, 36, 0.1) 100%)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            '& .MuiAlert-icon': {
              color: '#f59e0b'
            }
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#2d3748', mb: 0.5 }}>
            {t('auth.collegeAdminOnly')}
          </Typography>
        </Alert>

        <Box sx={{ mb: 1 }}>
          <Typography variant="body2" sx={{ color: '#4a5568', mb: 1, lineHeight: 1.4 }}>
            {t('auth.ifYouAreStudent')}
          </Typography>

          <Button
            component={Link}
            to="/auth/student-registration"
            variant="contained"
            size="medium"
            sx={{
              background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
              color: '#ffffff',
              textTransform: 'none',
              fontWeight: 600,
              mb: 1,
              '&:hover': {
                background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
              }
            }}
          >
            {t('auth.goToCommunitySignup')}
          </Button>
        </Box>

        <Box sx={{ mb: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#2d3748', mb: 1.5 }}>
            {t('auth.collegeAdminAccountRequirements')}
          </Typography>
          <Box sx={{ pl: 2 }}>
            <Typography variant="body2" sx={{ color: '#4a5568', display: 'flex', alignItems: 'flex-start' }}>
              <Box component="span" sx={{ mr: 1, color: '#0EA5E9', fontWeight: 700 }}>•</Box>
              {t('auth.mustBeOfficialRepresentative')}
            </Typography>
            <Typography variant="body2" sx={{ color: '#4a5568', display: 'flex', alignItems: 'flex-start' }}>
              <Box component="span" sx={{ mr: 1, color: '#0EA5E9', fontWeight: 700 }}>•</Box>
              {t('auth.willBeAskedToProvideProof')}
            </Typography>
            <Typography variant="body2" sx={{ color: '#4a5568', display: 'flex', alignItems: 'flex-start' }}>
              <Box component="span" sx={{ mr: 1, color: '#0EA5E9', fontWeight: 700 }}>•</Box>
              {t('auth.accountRemainsUnverified')}
            </Typography>
            
          </Box>
        </Box>

        <Box
          sx={{
            p: 2,
            background: 'rgba(239, 246, 255, 0.6)',
            borderRadius: '12px',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            mb: 1
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#2d3748', mb: 1.5 }}>
            {t('auth.toProceedWithRegistration')}
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
            {t('auth.iRepresentACollege')}
          </Typography>
          <TextField
            fullWidth
            placeholder={t('auth.typeHere')}
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
          {t('common.cancel')}
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
          {t('auth.continueToRegistration')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CollegeAdminConfirmationDialog;
