import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import { Send, CheckCircle } from '@mui/icons-material';
import { blogApi } from '../../api/blog.api';
import { colors, borderRadius } from '../../utils/designTokens';
import { useToast } from '../../contexts/ToastContext';

const ContactForm = ({ postSlug }) => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    try {
      setLoading(true);
      const response = await blogApi.submitContact({
        ...formData,
        postSlug
      });
      
      if (response.success) {
        showToast('Message sent successfully! We\'ll get back to you soon.', 'success');
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        
        setTimeout(() => setSubmitted(false), 5000);
      }
    } catch (error) {
      showToast(error.message || 'Failed to send message', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      py: 4,
      borderTop: `1px solid ${colors.neutral[200]}`,
      borderBottom: `1px solid ${colors.neutral[200]}`
    }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
        Get in Touch
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Have questions or feedback about this article? We'd love to hear from you!
      </Typography>

      {submitted ? (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          gap: 2,
          py: 4
        }}>
          <CheckCircle sx={{ fontSize: 64, color: colors.success[500] }} />
          <Typography variant="h6" sx={{ fontWeight: 600, textAlign: 'center' }}>
            Thank you for your message!
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            We'll respond to you as soon as possible
          </Typography>
        </Box>
      ) : (
        <Box component="form" onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
            <TextField
              name="name"
              placeholder="Your name *"
              value={formData.name}
              onChange={handleChange}
              required
              sx={{ flex: 1, minWidth: 200 }}
            />
            <TextField
              name="email"
              type="email"
              placeholder="Your email *"
              value={formData.email}
              onChange={handleChange}
              required
              sx={{ flex: 1, minWidth: 200 }}
            />
          </Box>

          <TextField
            fullWidth
            name="subject"
            placeholder="Subject (optional)"
            value={formData.subject}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            multiline
            rows={4}
            name="message"
            placeholder="Your message *"
            value={formData.message}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
          />

          <Button
            type="submit"
            variant="contained"
            endIcon={<Send />}
            disabled={loading}
            sx={{
              background: colors.neutral[900],
              px: 4,
              py: 1.5,
              fontWeight: 600,
              '&:hover': {
                background: colors.neutral[800]
              },
              '&:disabled': {
                background: colors.neutral[400],
              }
            }}
          >
            {loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Send Message'}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ContactForm;
