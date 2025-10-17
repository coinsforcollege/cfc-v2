import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, Paper, Dialog, DialogContent, DialogActions, Button } from '@mui/material';
import { CheckCircle, ArrowForward, Celebration } from '@mui/icons-material';
import { useTour } from '../contexts/TourContext';

const GuidedTour = ({ targetElement, step }) => {
  const { tourActive, tourStep, nextStep } = useTour();
  const [targetRect, setTargetRect] = useState(null);
  const rafRef = useRef();

  useEffect(() => {
    if (tourActive && tourStep === step && targetElement) {
      const updatePosition = () => {
        const element = document.querySelector(targetElement);
        if (element) {
          const rect = element.getBoundingClientRect();
          setTargetRect(rect);
        }
        rafRef.current = requestAnimationFrame(updatePosition);
      };

      updatePosition();

      return () => {
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
        }
      };
    } else {
      setTargetRect(null);
    }
  }, [tourActive, tourStep, step, targetElement]);

  if (!tourActive || tourStep !== step || !targetRect) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    >
      {/* Backdrop with spotlight cutout */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          clipPath: `polygon(
            0% 0%,
            0% 100%,
            ${targetRect.left - 8}px 100%,
            ${targetRect.left - 8}px ${targetRect.top - 8}px,
            ${targetRect.right + 8}px ${targetRect.top - 8}px,
            ${targetRect.right + 8}px ${targetRect.bottom + 8}px,
            ${targetRect.left - 8}px ${targetRect.bottom + 8}px,
            ${targetRect.left - 8}px 100%,
            100% 100%,
            100% 0%
          )`,
        }}
      />

      {/* Animated glow around target */}
      <Box
        sx={{
          position: 'absolute',
          left: targetRect.left - 8,
          top: targetRect.top - 8,
          width: targetRect.width + 16,
          height: targetRect.height + 16,
          borderRadius: 2,
          boxShadow: '0 0 0 4px rgba(139, 92, 246, 0.6), 0 0 20px 8px rgba(139, 92, 246, 0.4)',
          animation: 'pulse 2s ease-in-out infinite',
          '@keyframes pulse': {
            '0%, 100%': {
              boxShadow: '0 0 0 4px rgba(139, 92, 246, 0.6), 0 0 20px 8px rgba(139, 92, 246, 0.4)',
            },
            '50%': {
              boxShadow: '0 0 0 4px rgba(236, 72, 153, 0.6), 0 0 30px 12px rgba(236, 72, 153, 0.4)',
            },
          },
        }}
      />
    </Box>
  );
};

// Welcome Dialog Component
export const WelcomeDialog = ({ open, onNext, studentName }) => {
  return (
    <Dialog
      open={open}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        },
      }}
      disableEscapeKeyDown
    >
      <DialogContent sx={{ py: 4, px: 4, textAlign: 'center' }}>
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3,
          }}
        >
          <CheckCircle sx={{ fontSize: 50, color: 'white' }} />
        </Box>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: '#1e293b',
            mb: 2,
          }}
        >
          Welcome, {studentName}!
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 3, lineHeight: 1.8 }}
        >
          Your college has been successfully added. Let's take a quick tour to get you started with mining tokens.
        </Typography>

        <Box
          sx={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%)',
            borderRadius: 2,
            p: 2.5,
            mb: 2,
          }}
        >
          <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.8 }}>
            This tour will show you how to:
          </Typography>
          <Box component="ul" sx={{ textAlign: 'left', pl: 2, mt: 1, mb: 0 }}>
            <li>
              <Typography variant="body2" color="text.secondary">
                Navigate to your colleges page
              </Typography>
            </li>
            <li>
              <Typography variant="body2" color="text.secondary">
                Start your first mining session
              </Typography>
            </li>
            <li>
              <Typography variant="body2" color="text.secondary">
                Understand how to earn tokens
              </Typography>
            </li>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          borderTop: '1px solid #e2e8f0',
          px: 4,
          py: 3,
        }}
      >
        <Button
          onClick={onNext}
          variant="contained"
          fullWidth
          endIcon={<ArrowForward />}
          sx={{
            background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
            py: 1.5,
            fontWeight: 600,
            textTransform: 'none',
            borderRadius: 2,
            fontSize: '1rem',
            '&:hover': {
              background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
            },
          }}
        >
          Start Tour
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Tooltip Component
export const TourTooltip = ({ targetElement, title, description, onNext }) => {
  const { tourActive } = useTour();
  const [targetRect, setTargetRect] = useState(null);
  const [position, setPosition] = useState('bottom');

  useEffect(() => {
    if (tourActive && targetElement) {
      const updatePosition = () => {
        const element = document.querySelector(targetElement);
        if (element) {
          const rect = element.getBoundingClientRect();
          setTargetRect(rect);

          // Determine best position
          const spaceBelow = window.innerHeight - rect.bottom;
          const spaceAbove = rect.top;

          if (spaceBelow > 300) {
            setPosition('bottom');
          } else if (spaceAbove > 300) {
            setPosition('top');
          } else {
            setPosition('bottom');
          }
        }
      };

      updatePosition();
      window.addEventListener('scroll', updatePosition);
      window.addEventListener('resize', updatePosition);

      return () => {
        window.removeEventListener('scroll', updatePosition);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [tourActive, targetElement]);

  if (!tourActive || !targetRect) {
    return null;
  }

  const tooltipStyle = {
    position: 'fixed',
    left: targetRect.left + targetRect.width / 2,
    transform: 'translateX(-50%)',
    zIndex: 10000,
    pointerEvents: 'auto',
    width: '320px',
    maxWidth: '90vw',
  };

  if (position === 'bottom') {
    tooltipStyle.top = targetRect.bottom + 20;
  } else {
    tooltipStyle.bottom = window.innerHeight - targetRect.top + 20;
  }

  return (
    <Paper
      sx={{
        ...tooltipStyle,
        borderRadius: 2,
        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
          color: 'white',
          px: 2.5,
          py: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>
          {title}
        </Typography>
      </Box>
      <Box sx={{ p: 2.5 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.7 }}>
          {description}
        </Typography>
        <Button
          onClick={onNext}
          variant="contained"
          fullWidth
          sx={{
            background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
            py: 1,
            fontWeight: 600,
            textTransform: 'none',
            '&:hover': {
              background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
            },
          }}
        >
          Got it!
        </Button>
      </Box>
    </Paper>
  );
};

// Success Dialog Component
export const SuccessDialog = ({ open, onComplete }) => {
  return (
    <Dialog
      open={open}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        },
      }}
      disableEscapeKeyDown
    >
      <DialogContent sx={{ py: 4, px: 4, textAlign: 'center' }}>
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ec4899 0%, #f59e0b 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3,
          }}
        >
          <Celebration sx={{ fontSize: 50, color: 'white' }} />
        </Box>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: '#1e293b',
            mb: 2,
          }}
        >
          You're All Set!
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 3, lineHeight: 1.8 }}
        >
          Your mining session has started successfully. Here are some tips to maximize your earnings:
        </Typography>

        <Box
          sx={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%)',
            borderRadius: 2,
            p: 2.5,
            mb: 2,
          }}
        >
          <Box component="ul" sx={{ textAlign: 'left', pl: 2, m: 0 }}>
            <li>
              <Typography variant="body2" color="text.primary" sx={{ mb: 1.5 }}>
                <strong>Come back daily</strong> - Mining sessions last 24 hours, restart them regularly
              </Typography>
            </li>
            <li>
              <Typography variant="body2" color="text.primary" sx={{ mb: 1.5 }}>
                <strong>Add more colleges</strong> - Mine for up to 10 colleges simultaneously
              </Typography>
            </li>
            <li>
              <Typography variant="body2" color="text.primary" sx={{ mb: 1.5 }}>
                <strong>Invite friends</strong> - Share your referral code to boost your earning rate
              </Typography>
            </li>
            <li>
              <Typography variant="body2" color="text.primary">
                <strong>Set your primary</strong> - Choose a primary college to show your main affiliation
              </Typography>
            </li>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          borderTop: '1px solid #e2e8f0',
          px: 4,
          py: 3,
        }}
      >
        <Button
          onClick={onComplete}
          variant="contained"
          fullWidth
          sx={{
            background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
            py: 1.5,
            fontWeight: 600,
            textTransform: 'none',
            borderRadius: 2,
            fontSize: '1rem',
            '&:hover': {
              background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
            },
          }}
        >
          Go to Dashboard
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GuidedTour;
