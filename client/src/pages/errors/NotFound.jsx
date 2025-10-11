import { Home, Explore } from '@mui/icons-material';
import { Box, Button, Stack, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';

const NotFoundPage = () => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  const funMessages = [
    'Our miners are taking a coffee break',
    'This token hasn\'t been minted yet',
    'Looks like you wandered off campus',
    'Even blockchain explorers get lost sometimes',
    'This page went to mine some tokens',
    'Sorry, this classroom doesn\'t exist',
    'Our smart contract couldn\'t find this route',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % funMessages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `
          linear-gradient(135deg,
            rgba(155, 184, 224, 0.4) 0%,
            rgba(179, 154, 232, 0.3) 25%,
            rgba(230, 155, 184, 0.3) 50%,
            rgba(155, 214, 195, 0.3) 75%,
            rgba(155, 184, 224, 0.4) 100%
          )
        `,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Floating particles */}
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
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: i % 3 === 0 ? '#9bb8e0' : i % 3 === 1 ? '#b39ae8' : '#9bd6c3',
              opacity: 0.4,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </Box>

      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          px: 3,
          maxWidth: '600px',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Miner GIF */}
          <Box
            sx={{
              mb: 4,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Box
                component="img"
                src="/images/404-miner.gif"
                alt="Miner resting"
                sx={{
                  width: { xs: '200px', md: '250px' },
                  height: 'auto',
                  borderRadius: '20px',
                  boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)',
                  border: '3px solid rgba(255, 255, 255, 0.5)',
                }}
              />
            </motion.div>
          </Box>

          {/* 404 Text */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '5rem', md: '7rem' },
              fontWeight: 800,
              background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #f59e0b 100%)',
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              mb: 2,
              lineHeight: 1,
              animation: 'gradientShift 3s ease-in-out infinite',
              '@keyframes gradientShift': {
                '0%': { backgroundPosition: '0% 50%' },
                '50%': { backgroundPosition: '100% 50%' },
                '100%': { backgroundPosition: '0% 50%' },
              },
            }}
          >
            404
          </Typography>

          {/* Main heading */}
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: '#2d3748',
              mb: 3,
              fontSize: { xs: '1.75rem', md: '2.25rem' },
            }}
          >
            Miners Are Resting
          </Typography>

          {/* Rotating fun messages */}
          <Box
            sx={{
              minHeight: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 4,
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentMessageIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: '#718096',
                    fontSize: { xs: '1.1rem', md: '1.25rem' },
                    fontWeight: 500,
                    px: 2,
                  }}
                >
                  {funMessages[currentMessageIndex]}
                </Typography>
              </motion.div>
            </AnimatePresence>
          </Box>

          {/* Message indicators */}
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mb: 5 }}>
            {funMessages.map((_, index) => (
              <Box
                key={index}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: index === currentMessageIndex
                    ? 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)'
                    : 'rgba(139, 92, 246, 0.2)',
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </Box>

          {/* Buttons */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                component={Link}
                to="/"
                variant="contained"
                size="large"
                startIcon={<Home />}
                sx={{
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                  color: '#ffffff',
                  px: 4,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
                    boxShadow: '0 12px 40px rgba(139, 92, 246, 0.4)',
                  },
                }}
              >
                Go Home
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                component={Link}
                to="/colleges"
                variant="outlined"
                size="large"
                startIcon={<Explore />}
                sx={{
                  color: '#8b5cf6',
                  borderColor: '#8b5cf6',
                  borderWidth: '2px',
                  px: 4,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)',
                  backgroundColor: 'rgba(139, 92, 246, 0.08)',
                  '&:hover': {
                    borderColor: '#7c3aed',
                    borderWidth: '2px',
                    backgroundColor: 'rgba(139, 92, 246, 0.15)',
                  },
                }}
              >
                Explore Colleges
              </Button>
            </motion.div>
          </Stack>
        </motion.div>
      </Box>
    </Box>
  );
};

export default NotFoundPage;