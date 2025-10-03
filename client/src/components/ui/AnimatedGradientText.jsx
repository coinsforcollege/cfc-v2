import React from 'react';
import { Typography } from '@mui/material';

const AnimatedGradientText = ({ children, variant = 'h1', ...props }) => {
  return (
    <Typography
      variant={variant}
      sx={{
        background: 'linear-gradient(135deg, #0EA5E9 0%, #8B5CF6 50%, #10B981 100%)',
        backgroundSize: '200% 200%',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        animation: 'gradientShift 3s ease-in-out infinite',
        '@keyframes gradientShift': {
          '0%': {
            backgroundPosition: '0% 50%',
          },
          '50%': {
            backgroundPosition: '100% 50%',
          },
          '100%': {
            backgroundPosition: '0% 50%',
          },
        },
        ...props.sx,
      }}
      {...props}
    >
      {children}
    </Typography>
  );
};

export default AnimatedGradientText;
