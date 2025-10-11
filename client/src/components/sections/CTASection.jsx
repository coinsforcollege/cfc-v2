import React from 'react';
import { motion } from 'framer-motion';
import { Box, Container, Typography, Button, Stack } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';

const CTASection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const getDashboardPath = () => {
    if (!user) return '/auth/register/student';
    if (user.role === 'student') return '/student/dashboard';
    if (user.role === 'college_admin') return '/college-admin/dashboard';
    if (user.role === 'platform_admin') return '/platform-admin/dashboard';
    return '/';
  };

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 20%, rgba(139, 92, 246, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 40% 60%, rgba(6, 182, 212, 0.05) 0%, transparent 50%)
          `,
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Box
            sx={{
              textAlign: 'center',
              p: 6,
              borderRadius: '24px',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2rem', md: '3rem' },
                fontWeight: 800,
                background: 'linear-gradient(135deg, #2d3748 0%, #4a5568 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                mb: 3,
              }}
            >
              Ready to Transform Alumni Engagement?
            </Typography>
            <Typography
              sx={{
                color: '#718096',
                fontSize: { xs: '1.1rem', md: '1.25rem' },
                mb: 4,
                maxWidth: '700px',
                mx: 'auto',
                lineHeight: 1.6,
              }}
            >
              Join the digital fundraising revolution. Increase transparency, build stronger relationships, and unlock new revenue streams.
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="center"
              sx={{ mt: 4 }}
            >
              {user ? (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={() => navigate(getDashboardPath())}
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForward />}
                    sx={{
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                      color: '#ffffff',
                      px: 4,
                      py: 2,
                      fontSize: '1.125rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)',
                      '&:hover': {
                        boxShadow: '0 12px 40px rgba(139, 92, 246, 0.4)',
                      },
                    }}
                  >
                    Go to Dashboard
                  </Button>
                </motion.div>
              ) : (
                <>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={() => navigate('/auth/register/college')}
                      variant="contained"
                      size="large"
                      endIcon={<ArrowForward />}
                      sx={{
                        background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                        color: '#ffffff',
                        px: 4,
                        py: 2,
                        fontSize: '1.125rem',
                        fontWeight: 600,
                        textTransform: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)',
                        '&:hover': {
                          boxShadow: '0 12px 40px rgba(139, 92, 246, 0.4)',
                        },
                      }}
                    >
                      Join Waitlist
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={() => navigate('/auth/register/student')}
                      variant="outlined"
                      size="large"
                      sx={{
                        color: '#8b5cf6',
                        borderColor: '#8b5cf6',
                        px: 4,
                        py: 2,
                        fontSize: '1.125rem',
                        fontWeight: 600,
                        textTransform: 'none',
                        borderRadius: '12px',
                        backdropFilter: 'blur(10px)',
                        backgroundColor: 'rgba(139, 92, 246, 0.08)',
                        '&:hover': {
                          borderColor: '#7c3aed',
                          backgroundColor: 'rgba(139, 92, 246, 0.12)',
                        },
                      }}
                    >
                      Start Mining
                    </Button>
                  </motion.div>
                </>
              )}
            </Stack>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default CTASection;
