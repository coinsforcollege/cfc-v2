import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { gradients, borderRadius, shadows, colors } from '../../utils/designTokens';

const CTABannerBlock = ({ data }) => {
  const backgroundMap = {
    'primary': colors.primary[500],
    'secondary': colors.secondary[500],
    'success': colors.success[500],
    'warning': '#f59e0b',
    'gradient-purple': gradients.primary,
    'gradient-blue': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  };

  return (
    <Box sx={{ 
      mb: 4,
      p: { xs: 3, md: 4 },
      background: backgroundMap[data.backgroundColor] || gradients.primary,
      borderRadius: borderRadius['2xl'],
      boxShadow: shadows.xl,
      color: 'white',
      textAlign: 'center'
    }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
        {data.title}
      </Typography>
      
      {data.description && (
        <Typography variant="body1" sx={{ mb: 3, opacity: 0.95 }}>
          {data.description}
        </Typography>
      )}

      <Button
        variant="contained"
        endIcon={<ArrowForward />}
        href={data.buttonUrl}
        target={data.openInNewTab ? '_blank' : '_self'}
        rel={data.openInNewTab ? 'noopener noreferrer' : ''}
        sx={{
          background: 'white',
          color: colors.primary[600],
          fontWeight: 700,
          px: 4,
          py: 1.5,
          borderRadius: borderRadius.xl,
          boxShadow: shadows.lg,
          '&:hover': {
            background: colors.neutral[50],
            transform: 'translateY(-2px)',
            boxShadow: shadows.xl,
          },
          transition: 'all 0.2s'
        }}
      >
        {data.buttonText}
      </Button>
    </Box>
  );
};

export default CTABannerBlock;

