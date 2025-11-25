import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Send,
  Mail,
  MapPin,
  MessageSquare
} from 'lucide-react';
import { blogApi } from '../api/blog.api';
import { useAuth } from '../contexts/AuthContext';
import { trackContact } from '../utils/fbPixel';

const Contact = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!formData.name || !formData.email || !formData.message) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const response = await blogApi.submitContact(formData);

      if (response.success) {
        // Track contact event
        trackContact(formData.subject || 'General Inquiry');
        
        setSuccess(true);
        setFormData({
          name: user?.name || '',
          email: user?.email || '',
          phone: user?.phone || '',
          subject: '',
          message: ''
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'hello@coinsforcollege.com',
      link: 'mailto:hello@coinsforcollege.com',
      color: '#8b5cf6'
    },
    {
      icon: MapPin,
      title: 'Location',
      value: 'California',
      link: '#',
      color: '#06b6d4'
    }
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `
          radial-gradient(circle at 20% 20%, rgba(139, 92, 246, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 40% 60%, rgba(6, 182, 212, 0.05) 0%, transparent 50%)
        `,
        pt: 12,
        pb: 8
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              mb: 2,
              background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Get in Touch
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#64748b',
              maxWidth: 600,
              mx: 'auto',
              lineHeight: 1.8
            }}
          >
            Have a question or want to learn more about Coins For College?
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {/* Contact Form */}
          <Box sx={{ flex: '1 1 500px', minWidth: 0 }}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <MessageSquare size={24} style={{ color: '#8b5cf6' }} />
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
                    Send us a Message
                  </Typography>
                </Box>

                {error && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                )}

                {success && (
                  <Alert severity="success" sx={{ mb: 3 }}>
                    Thank you for contacting us! We'll get back to you soon.
                  </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </Box>

                  <TextField
                    fullWidth
                    label="Phone (Optional)"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    label="Subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    label="Message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    multiline
                    rows={6}
                    sx={{ mb: 3 }}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : <Send size={20} />}
                    sx={{
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                      color: '#ffffff',
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      borderRadius: 2,
                      '&:hover': {
                        background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)'
                      },
                      '&:disabled': {
                        background: '#e2e8f0',
                        color: '#a0aec0'
                      }
                    }}
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Contact Information */}
          <Box sx={{ flex: '0 1 350px', minWidth: 0 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <Card
                    key={index}
                    component={info.link !== '#' ? 'a' : 'div'}
                    href={info.link !== '#' ? info.link : undefined}
                    sx={{
                      borderRadius: 3,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease',
                      cursor: info.link !== '#' ? 'pointer' : 'default',
                      '&:hover': info.link !== '#' ? {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                      } : {}
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            background: `linear-gradient(135deg, ${info.color}15 0%, ${info.color}30 100%)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                        >
                          <Icon size={24} style={{ color: info.color }} />
                        </Box>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            variant="caption"
                            sx={{ color: '#64748b', display: 'block', mb: 0.5 }}
                          >
                            {info.title}
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: 600, color: '#1e293b' }}
                          >
                            {info.value}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                );
              })}

              {/* Additional Info Card */}
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
                  border: '1px solid rgba(139, 92, 246, 0.2)'
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
                    Office Hours
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b', mb: 1 }}>
                    Monday - Friday: 9:00 AM - 6:00 PM PST
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b' }}>
                    Saturday - Sunday: Closed
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Contact;
