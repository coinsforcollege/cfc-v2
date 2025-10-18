import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import * as MuiIcons from '@mui/icons-material';
import { colors, borderRadius } from '../../utils/designTokens';

const CategoryCard = ({ category }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Map icon string to MUI icon component
  const IconComponent = MuiIcons[category.icon] || MuiIcons.HelpOutline;

  return (
    <Card
      onClick={() => navigate(`/docs/${category.slug}`)}
      sx={{
        height: '100%',
        cursor: 'pointer',
        borderRadius: borderRadius['2xl'],
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
          border: '1px solid rgba(139, 92, 246, 0.3)'
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: borderRadius.lg,
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <IconComponent sx={{ fontSize: 24, color: '#8b5cf6' }} />
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: colors.neutral[900],
                mb: 1,
                fontSize: '1.125rem'
              }}
            >
              {category.name}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: colors.neutral[600],
                lineHeight: 1.6,
                mb: 1.5,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}
            >
              {category.description}
            </Typography>

            <Typography
              variant="caption"
              sx={{
                color: colors.neutral[500],
                fontWeight: 500
              }}
            >
              {category.articleCount} {category.articleCount === 1 ? t('auth.article') : t('auth.articles')}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CategoryCard;
