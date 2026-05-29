import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import { motion } from 'framer-motion';

const WebinarHost = ({ bio }) => {
  return (
    <Box sx={{ position: 'relative', py: 16, overflow: 'hidden' }}>
      {/* Background blobs */}
      <Box sx={{
        position: 'absolute', top: '10%', right: '-5%', width: 500, height: 500,
        background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, rgba(255,255,255,0) 70%)',
        borderRadius: '50%', zIndex: 0
      }} />
      <Box sx={{
        position: 'absolute', bottom: '-10%', left: '-5%', width: 600, height: 600,
        background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, rgba(255,255,255,0) 70%)',
        borderRadius: '50%', zIndex: 0
      }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          gap: { xs: 6, md: 8 },
          alignItems: 'flex-start'
        }}>
          <Box sx={{ 
            flex: 'none', 
            width: { xs: '100%', sm: '320px', md: '320px' },
            position: { md: 'sticky' },
            top: { md: '120px' }
          }}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Box sx={{
                position: 'relative',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 24px 48px rgba(0,0,0,0.12)',
                border: '1px solid rgba(255,255,255,0.4)',
                '&::after': {
                  content: '""',
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.1), transparent)',
                  pointerEvents: 'none'
                }
              }}>
                <Box
                  component="img"
                  src="https://cfc-events-backend.onrender.com/uploads/1643659268501_6da73113eb.jpeg"
                  alt="Joshua Samuel"
                  sx={{
                    width: '100%',
                    aspectRatio: '4/5',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
              </Box>
            </motion.div>
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Typography variant="overline" sx={{ color: '#718096', fontWeight: 700, letterSpacing: 2, mb: 2, display: 'block' }}>
                MEET YOUR HOST
              </Typography>
              <Typography variant="h2" sx={{ fontWeight: 800, color: '#2d3748', mb: 1, lineHeight: 1.2, fontSize: { xs: '2.5rem', md: '3rem' } }}>
                Joshua Samuel
              </Typography>
              <Typography variant="h6" sx={{ color: '#718096', fontWeight: 600, mb: 4, fontStyle: 'italic' }}>
                Founder & CEO, Coins for College
              </Typography>
              <Box sx={{ 
                color: '#4a5568', 
                fontSize: '1.25rem', 
                lineHeight: 1.8,
                '& p': { mb: 4 } 
              }}>
                {bio}
              </Box>
            </motion.div>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default WebinarHost;
