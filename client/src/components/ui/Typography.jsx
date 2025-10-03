import React from 'react';
import { Typography as MuiTypography } from '@mui/material';
import { colors, gradients, typography } from '../../utils/designTokens';

const Typography = ({ 
  variant = 'body1', 
  gradient = false,
  color = 'inherit',
  children, 
  className = '',
  ...props 
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'h1':
        return {
          fontSize: typography.fontSize['5xl'],
          fontWeight: typography.fontWeight.black,
          lineHeight: typography.lineHeight.tight,
          color: colors.neutral[900],
        };
      case 'h2':
        return {
          fontSize: typography.fontSize['4xl'],
          fontWeight: typography.fontWeight.bold,
          lineHeight: typography.lineHeight.tight,
          color: colors.neutral[900],
        };
      case 'h3':
        return {
          fontSize: typography.fontSize['3xl'],
          fontWeight: typography.fontWeight.bold,
          lineHeight: typography.lineHeight.snug,
          color: colors.neutral[800],
        };
      case 'h4':
        return {
          fontSize: typography.fontSize['2xl'],
          fontWeight: typography.fontWeight.semibold,
          lineHeight: typography.lineHeight.snug,
          color: colors.neutral[800],
        };
      case 'h5':
        return {
          fontSize: typography.fontSize.xl,
          fontWeight: typography.fontWeight.semibold,
          lineHeight: typography.lineHeight.normal,
          color: colors.neutral[700],
        };
      case 'h6':
        return {
          fontSize: typography.fontSize.lg,
          fontWeight: typography.fontWeight.medium,
          lineHeight: typography.lineHeight.normal,
          color: colors.neutral[700],
        };
      case 'body1':
        return {
          fontSize: typography.fontSize.base,
          fontWeight: typography.fontWeight.normal,
          lineHeight: typography.lineHeight.relaxed,
          color: colors.neutral[600],
        };
      case 'body2':
        return {
          fontSize: typography.fontSize.sm,
          fontWeight: typography.fontWeight.normal,
          lineHeight: typography.lineHeight.normal,
          color: colors.neutral[500],
        };
      case 'caption':
        return {
          fontSize: typography.fontSize.xs,
          fontWeight: typography.fontWeight.medium,
          lineHeight: typography.lineHeight.normal,
          color: colors.neutral[400],
        };
      default:
        return {};
    }
  };

  const getGradientStyles = () => {
    if (gradient) {
      return {
        background: gradients.primary,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      };
    }
    return {};
  };

  const getColorStyles = () => {
    if (color !== 'inherit') {
      return { color };
    }
    return {};
  };

  return (
    <MuiTypography
      sx={{
        fontFamily: typography.fontFamily.sans,
        ...getVariantStyles(),
        ...getGradientStyles(),
        ...getColorStyles(),
      }}
      className={className}
      {...props}
    >
      {children}
    </MuiTypography>
  );
};

export default Typography;
