import React from 'react';
import { Button } from '@mui/material';

const ShimmerButton = ({ children, onClick, variant = 'primary', size = 'lg', ...props }) => {
  return (
    <Button
      onClick={onClick}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        background: variant === 'primary' 
          ? 'linear-gradient(135deg, #0EA5E9 0%, #8B5CF6 100%)'
          : 'rgba(255, 255, 255, 0.1)',
        color: '#ffffff',
        border: variant === 'secondary' ? '1px solid rgba(255, 255, 255, 0.2)' : 'none',
        borderRadius: '12px',
        padding: size === 'lg' ? '16px 32px' : '12px 24px',
        fontSize: size === 'lg' ? '1.125rem' : '1rem',
        fontWeight: 600,
        textTransform: 'none',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 25px rgba(14, 165, 233, 0.4)',
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
          transition: 'left 0.5s',
        },
        '&:hover::before': {
          left: '100%',
        },
        ...props.sx,
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default ShimmerButton;
