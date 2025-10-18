import React from 'react';
import { Box, Typography, Chip, Button } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { colors, borderRadius } from '../../utils/designTokens';

const DocsSidebar = ({ categories = [], currentCategorySlug = null, featuredArticles = [] }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Box
      sx={{
        position: 'sticky',
        top: 100,
        alignSelf: 'flex-start'
      }}
    >
      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: colors.neutral[900],
              fontSize: '1rem'
            }}
          >
            {t('auth.featuredArticles')}
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {featuredArticles.slice(0, 4).map((article) => (
              <Box
                key={article.id}
                onClick={() => navigate(`/docs/${article.category.slug}/${article.slug}`)}
                sx={{
                  cursor: 'pointer',
                  pb: 2,
                  borderBottom: `1px solid ${colors.neutral[200]}`,
                  '&:last-child': {
                    borderBottom: 'none',
                    pb: 0
                  },
                  '&:hover h6': {
                    color: '#8b5cf6'
                  }
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    mb: 0.5,
                    transition: 'color 0.2s',
                    color: colors.neutral[900]
                  }}
                >
                  {article.title}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: colors.neutral[500] }}
                >
                  {formatDate(article.updatedAt)}
                </Typography>
              </Box>
            ))}
          </Box>

          {featuredArticles.length > 4 && (
            <Button
              onClick={() => navigate('/docs/featured')}
              endIcon={<ArrowForward />}
              sx={{
                mt: 2,
                color: '#8b5cf6',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  background: 'rgba(139, 92, 246, 0.05)'
                }
                }}
              >
                {t('auth.viewAll')}
              </Button>
          )}
        </Box>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: colors.neutral[900],
              fontSize: '1rem'
            }}
          >
            {t('auth.categories')}
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {categories.map((category) => (
              <Chip
                key={category.id}
                label={category.name}
                onClick={() => navigate(`/docs/${category.slug}`)}
                sx={{
                  justifyContent: 'flex-start',
                  fontWeight: 500,
                  cursor: 'pointer',
                  borderRadius: borderRadius.md,
                  ...(currentCategorySlug === category.slug && {
                    background: 'rgba(139, 92, 246, 0.1)',
                    color: '#8b5cf6',
                    border: '1px solid rgba(139, 92, 246, 0.2)'
                  }),
                  '&:hover': {
                    background: currentCategorySlug === category.slug
                      ? 'rgba(139, 92, 246, 0.15)'
                      : colors.neutral[100]
                  }
                }}
              />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default DocsSidebar;
