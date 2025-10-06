import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Container, Typography, Button, Stack, Grid, Card, CardContent } from '@mui/material';
import { ArrowForward, TrendingUp, School, Security, Timer } from '@mui/icons-material';
import { Link } from 'react-router';
import collegenIcon from '../../assets/collegen-icon-blue-transparent-bg.svg';

const HeroSection = () => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentActivity, setCurrentActivity] = useState(0);
  const rotatingTexts = ['Digital Economy', 'Alumni Network', 'Blockchain Gateway'];
  
  const activities = [
    { text: 'IIT Bombay: 3,200 early supporters', type: 'supporters', college: 'IIT Bombay' },
    { text: 'University of Toronto joined waitlist', type: 'waitlist', college: 'Toronto' },
    { text: 'MIT students mining at accelerated rate', type: 'mining', college: 'MIT' },
    { text: 'BITS Pilani configured tokenomics structure', type: 'config', college: 'BITS Pilani' },
    { text: 'Stanford alumni donations increased 340%', type: 'donations', college: 'Stanford' },
    { text: 'Harvard launched NFT endowment program', type: 'nft', college: 'Harvard' }
  ];

  useEffect(() => {
    const textInterval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % rotatingTexts.length);
    }, 3000); // Change text every 3 seconds

    const activityInterval = setInterval(() => {
      setCurrentActivity((prev) => (prev + 1) % activities.length);
    }, 3000);

    return () => {
      clearInterval(textInterval);
      clearInterval(activityInterval);
    };
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: `url(${collegenIcon})`,
        background: `
          linear-gradient(135deg, 
            rgba(155, 184, 224, 0.4) 0%, 
            rgba(179, 154, 232, 0.3) 25%,
            rgba(230, 155, 184, 0.3) 50%,
            rgba(155, 214, 195, 0.3) 75%,
            rgba(155, 184, 224, 0.4) 100%
          )
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center, center',
        backgroundRepeat: 'no-repeat, no-repeat',
        filter: 'none',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `url(${collegenIcon})`,
          backgroundSize: '300px 300px',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.15,
          pointerEvents: 'none',
        }
      }}
    >
      <Box sx={{ 
        position: 'relative', 
        zIndex: 2, 
        display: 'flex', 
        alignItems: 'center', 
        minHeight: '100vh', 
        px: { xs: 2, md: 4 }, 
        maxWidth: '1200px', 
        mx: 'auto', 
        gap: { xs: 2, md: 4 },
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: { xs: 'center', md: 'flex-start' }
      }}>
        <Box sx={{ 
          flex: { xs: 'none', md: '0 0 60%' },
          width: { xs: '100%', md: '60%' },
          mb: { xs: 4, md: 0 }
        }}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Box sx={{ position: 'relative', mb: 3 }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <Typography
                    variant="h1"
                    sx={{
                      fontSize: { xs: '2.5rem', md: '4rem' },
                      fontWeight: 800,
                      color: '#2d3748',
                      lineHeight: 1.1,
                      textShadow: 'none',
                      position: 'relative',
                    }}
                  >
                    Launch Your College's{' '}
                    <Box
                      component="span"
                      sx={{
                        position: 'relative',
                        display: 'inline-block',
                        minWidth: { xs: '280px', md: '350px' },
                        height: '1.2em',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={currentTextIndex}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.5 }}
                          style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            background: currentTextIndex === 0 
                              ? 'linear-gradient(135deg, #9bb8e0 0%, #b39ae8 50%, #e69bb8 100%)' // Digital Economy - darker blue to purple to pink
                              : currentTextIndex === 1 
                              ? 'linear-gradient(135deg, #b39ae8 0%, #e69bb8 50%, #9bd6c3 100%)' // Alumni Network - purple to pink to mint
                              : 'linear-gradient(135deg, #ffb347 0%, #ff8c42 50%, #ff6b35 100%)', // Blockchain Gateway - orange to red-orange
                            backgroundSize: '200% 200%',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            animation: 'gradientShift 3s ease-in-out infinite',
                          }}
                        >
                          {rotatingTexts[currentTextIndex]}
                        </motion.span>
                      </AnimatePresence>
                    </Box>
                  </Typography>
                </motion.div>
                
                {/* Floating particles around title */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    pointerEvents: 'none',
                  }}
                >
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      style={{
                        position: 'absolute',
                        width: '4px',
                        height: '4px',
                        borderRadius: '50%',
                        background: 'rgba(155, 184, 224, 0.7)',
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        y: [-10, 10, -10],
                        opacity: [0.3, 1, 0.3],
                      }}
                      transition={{
                        duration: 2 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                      }}
                    />
                  ))}
                </Box>
              </Box>

              <Typography
                sx={{
                  color: '#718096',
                  mb: 4,
                  fontSize: { xs: '1.1rem', md: '1.25rem' },
                  lineHeight: 1.6,
                  maxWidth: '500px',
                }}
              >
                Turnkey token infrastructure, smart contracts, and full ecosystem deployment on{' '}
                <Box component="span" sx={{ color: '#8b5cf6', fontWeight: 600 }}>
                  Collegen L2
                </Box>
                . From configuration to go-live in weeks, not months.
              </Typography>

              <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    component={Link}
                    to="/auth/register/student"
                    variant="contained"
                    size="large"
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
                      flexDirection: 'column',
                      gap: 0,
                      alignItems: 'flex-start'
                    }}
                  >
                    <Box sx={{ fontSize: '0.75rem', fontWeight: 500, opacity: 0.9, lineHeight: 1 }}>
                      Students
                    </Box>
                    <Box sx={{ lineHeight: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      Start Mining
                      <ArrowForward sx={{ fontSize: '1rem' }} />
                    </Box>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    component={Link}
                    to="/auth/register/college"
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
                      flexDirection: 'column',
                      gap: 0,
                      alignItems: 'flex-start',
                      '&:hover': {
                        borderColor: '#7c3aed',
                        backgroundColor: 'rgba(139, 92, 246, 0.12)',
                      },
                    }}
                  >
                    <Box sx={{ fontSize: '0.75rem', fontWeight: 500, opacity: 0.8, lineHeight: 1 }}>
                      Colleges
                    </Box>
                    <Box sx={{ lineHeight: 1 }}>
                      Join Waitlist
                    </Box>
                  </Button>
                </motion.div>
              </Stack>

              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 2,
                  px: 3,
                  py: 2,
                  backgroundColor: 'rgba(155, 214, 195, 0.15)',
                  borderRadius: '50px',
                  border: '1px solid rgba(155, 214, 195, 0.3)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: '#9bd6c3',
                  }}
                />
                <Typography sx={{ color: '#059669', fontSize: '1rem', fontWeight: 500 }}>
                  12,450 students mining now
                </Typography>
              </Box>
            </motion.div>
        </Box>
        
        <Box sx={{ 
          flex: { xs: 'none', md: '0 0 40%' },
          width: { xs: '100%', md: '40%' },
          display: { xs: 'none', md: 'block' }
        }}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Stack spacing={3}>
                <Card
                  sx={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '16px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <School sx={{ color: '#9bb8e0', fontSize: '2rem' }} />
                      <Typography variant="h6" sx={{ color: '#2d3748', fontWeight: 600 }}>
                        500+ Colleges
                      </Typography>
                    </Box>
                    <Typography sx={{ color: '#718096' }}>
                      Leading institutions already building their digital economies
                    </Typography>
                  </CardContent>
                </Card>

                <Card
                  sx={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '16px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <TrendingUp sx={{ color: '#b39ae8', fontSize: '2rem' }} />
                      <Typography variant="h6" sx={{ color: '#2d3748', fontWeight: 600 }}>
                        $2M+ Deployed
                      </Typography>
                    </Box>
                    <Typography sx={{ color: '#718096' }}>
                      Tokens already in circulation across campus networks
                    </Typography>
                  </CardContent>
                </Card>

                <Card
                  sx={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '16px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Security sx={{ color: '#e69bb8', fontSize: '2rem' }} />
                      <Typography variant="h6" sx={{ color: '#2d3748', fontWeight: 600 }}>
                        Enterprise Grade
                      </Typography>
                    </Box>
                    <Typography sx={{ color: '#718096' }}>
                      Audited smart contracts and institutional infrastructure
                    </Typography>
                  </CardContent>
                </Card>
              </Stack>
            </motion.div>
        </Box>
      </Box>
      
      {/* Live Activity Feed - Bottom of Hero */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '90%',
          maxWidth: '800px',
          zIndex: 3,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              p: 2,
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#10b981',
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%': { opacity: 1 },
                    '50%': { opacity: 0.5 },
                    '100%': { opacity: 1 },
                  },
                }}
              />
              <Typography sx={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>
                LIVE
              </Typography>
            </Box>
            
            <motion.div
              key={currentActivity}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
              style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}
            >
              <Timer sx={{ color: '#8b5cf6', fontSize: '16px' }} />
              <Typography
                sx={{
                  fontSize: '0.9rem',
                  color: '#4a5568',
                  fontWeight: 500,
                }}
              >
                {activities[currentActivity].text}
              </Typography>
            </motion.div>

            {/* Activity Indicators */}
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {activities.map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    background: index === currentActivity ? '#8b5cf6' : 'rgba(139, 92, 246, 0.3)',
                    transition: 'all 0.3s ease',
                  }}
                />
              ))}
            </Box>
          </Box>
        </motion.div>
      </Box>
    </Box>
  );
};

export default HeroSection;
