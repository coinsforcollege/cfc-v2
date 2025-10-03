import React from 'react';
import { Button as MuiButton } from '@mui/material';
import { colors, gradients, shadows, borderRadius, typography } from '../../utils/designTokens';

const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '',
  ...props 
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          background: gradients.primary,
          color: '#ffffff',
          boxShadow: shadows.glow,
          '&:hover': {
            background: gradients.primaryDark,
            boxShadow: '0 0 30px rgba(14, 165, 233, 0.5)',
            transform: 'translateY(-2px)',
          },
        };
      case 'secondary':
        return {
          background: 'rgba(255, 255, 255, 0.1)',
          color: '#ffffff',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
          },
        };
      case 'outline':
        return {
          background: 'transparent',
          color: colors.neutral[700],
          border: `2px solid ${colors.neutral[300]}`,
          '&:hover': {
            background: colors.neutral[50],
            border: `2px solid ${colors.primary[500]}`,
            color: colors.primary[600],
          },
        };
      case 'ghost':
        return {
          background: 'transparent',
          color: colors.neutral[600],
          '&:hover': {
            background: colors.neutral[100],
            color: colors.neutral[800],
          },
        };
      default:
        return {};
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          padding: '8px 16px',
          fontSize: typography.fontSize.sm,
          borderRadius: borderRadius.md,
        };
      case 'md':
        return {
          padding: '12px 24px',
          fontSize: typography.fontSize.base,
          borderRadius: borderRadius.lg,
        };
      case 'lg':
        return {
          padding: '16px 32px',
          fontSize: typography.fontSize.lg,
          borderRadius: borderRadius.xl,
        };
      case 'xl':
        return {
          padding: '20px 40px',
          fontSize: typography.fontSize.xl,
          borderRadius: borderRadius['2xl'],
        };
      default:
        return {};
    }
  };

  return (
    <MuiButton
      sx={{
        fontFamily: typography.fontFamily.sans,
        fontWeight: typography.fontWeight.semibold,
        textTransform: 'none',
        transition: 'all 0.3s ease',
        ...getVariantStyles(),
        ...getSizeStyles(),
      }}
      className={className}
      {...props}
    >
      {children}
    </MuiButton>
  );
};

export default Button;
