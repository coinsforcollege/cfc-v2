import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';

const WebinarCTA = ({ headline, subline, buttonText, microcopy }) => {
  return (
    <Box sx={{ 
      position: 'relative',
      py: 16, 
      bgcolor: '#1a202c', 
      overflow: 'hidden',
      textAlign: 'center'
    }}>
      {/* Dynamic Background */}
      <Box sx={{
        position: 'absolute', top: '-50%', left: '-20%', width: '140%', height: '200%',
        background: 'linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(236,72,153,0.15) 50%, rgba(139,92,246,0.15) 100%)',
        zIndex: 0, animation: 'gradientShift 8s ease infinite', backgroundSize: '400% 400%',
        '@keyframes gradientShift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        }
      }} />

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 800, 
              color: '#ffffff',
              mb: 3,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              lineHeight: 1.2
            }}
          >
            {headline}
          </Typography>
          
          <Typography 
            variant="h5" 
            sx={{ 
              color: 'rgba(255,255,255,0.8)', 
              mb: 6,
              fontWeight: 400
            }}
          >
            {subline}
          </Typography>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ display: 'inline-block' }}>
            <Button
              href="https://events.coinsforcollege.org/events/2030-india-enrollment-opportunity"
              target="_blank"
              rel="noopener noreferrer"
              variant="contained"
              size="large"
              sx={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                color: '#ffffff',
                px: 6,
                py: 2.5,
                fontSize: '1.25rem',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(139, 92, 246, 0.4)',
                mb: 2,
                '&:hover': {
                  background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
                  boxShadow: '0 12px 40px rgba(139, 92, 246, 0.6)',
                }
              }}
            >
              {buttonText}
            </Button>
          </motion.div>
          
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mt: 2 }}>
            {microcopy}
          </Typography>
        </motion.div>
      </Container>
    </Box>
  );
};

export default WebinarCTA;
