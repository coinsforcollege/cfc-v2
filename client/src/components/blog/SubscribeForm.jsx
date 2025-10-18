import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { blogApi } from '../../api/blog.api';
import { colors, borderRadius } from '../../utils/designTokens';
import { useToast } from '../../contexts/ToastContext';

const SubscribeForm = () => {
  const { showToast } = useToast();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      showToast(t('auth.pleaseEnterYourEmail'), 'error');
      return;
    }

    try {
      setLoading(true);
      const response = await blogApi.subscribe({ email });
      
      if (response.success) {
        showToast(t('auth.successfullySubscribed'), 'success');
        setSubscribed(true);
        setEmail('');
      }
    } catch (error) {
      showToast(error.message || t('auth.failedToSubscribe'), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      p: 3,
      borderRadius: borderRadius.lg,
      border: `1px solid ${colors.neutral[200]}`,
      background: colors.neutral[50]
    }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: colors.neutral[900], fontSize: '1rem' }}>
        {t('auth.subscribeToNewsletter')}
      </Typography>
      
      <Typography variant="body2" sx={{ mb: 2, color: colors.neutral[600], fontSize: '0.875rem' }}>
        {t('auth.getNewArticlesViaEmail')}
      </Typography>

      {subscribed ? (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          gap: 1,
          py: 2
        }}>
          <CheckCircle sx={{ fontSize: 40, color: colors.success[500] }} />
          <Typography variant="body2" sx={{ fontWeight: 600, color: colors.neutral[900], textAlign: 'center' }}>
            {t('auth.thanksForSubscribing')}
          </Typography>
        </Box>
      ) : (
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            type="email"
            placeholder={t('auth.yourEmail')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            size="small"
            sx={{ mb: 1.5 }}
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              background: colors.neutral[900],
              color: 'white',
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': {
                background: colors.neutral[800],
              },
              '&:disabled': {
                background: colors.neutral[400],
              }
            }}
          >
            {loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : t('auth.subscribe')}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default SubscribeForm;
