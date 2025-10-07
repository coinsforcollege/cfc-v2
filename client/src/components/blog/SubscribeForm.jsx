import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { blogApi } from '../../api/blog.api';
import { colors, borderRadius } from '../../utils/designTokens';
import { useToast } from '../../contexts/ToastContext';

const SubscribeForm = () => {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      showToast('Please enter your email', 'error');
      return;
    }

    try {
      setLoading(true);
      const response = await blogApi.subscribe({ email });
      
      if (response.success) {
        showToast('Successfully subscribed to our newsletter!', 'success');
        setSubscribed(true);
        setEmail('');
      }
    } catch (error) {
      showToast(error.message || 'Failed to subscribe', 'error');
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
        Subscribe to Newsletter
      </Typography>
      
      <Typography variant="body2" sx={{ mb: 2, color: colors.neutral[600], fontSize: '0.875rem' }}>
        Get new articles via email
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
            Thanks for subscribing!
          </Typography>
        </Box>
      ) : (
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            type="email"
            placeholder="Your email"
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
            {loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Subscribe'}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default SubscribeForm;
