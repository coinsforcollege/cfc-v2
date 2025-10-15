import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { Schedule, Visibility } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import { colors } from '../../utils/designTokens';

const ArticleListItem = ({ article, showCategory = true }) => {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleClick = () => {
    if (article.category) {
      navigate(`/docs/${article.category.slug}/${article.slug}`);
    }
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        cursor: 'pointer',
        pb: 3,
        mb: 3,
        borderBottom: `1px solid ${colors.neutral[200]}`,
        '&:last-child': {
          borderBottom: 'none',
          mb: 0,
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
          fontWeight: 700,
          color: colors.neutral[900],
          mb: 1,
          fontSize: '1.125rem',
          transition: 'color 0.2s'
        }}
      >
        {article.title}
      </Typography>

      {article.excerpt && (
        <Typography
          variant="body2"
          sx={{
            color: colors.neutral[600],
            mb: 1.5,
            lineHeight: 1.6,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {article.excerpt}
        </Typography>
      )}

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        {showCategory && article.category && (
          <Chip
            label={article.category.name}
            size="small"
            sx={{
              fontWeight: 600,
              background: 'rgba(139, 92, 246, 0.1)',
              color: '#8b5cf6',
              border: '1px solid rgba(139, 92, 246, 0.2)'
            }}
          />
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Schedule sx={{ fontSize: 14, color: colors.neutral[400] }} />
          <Typography variant="caption" sx={{ color: colors.neutral[500] }}>
            {formatDate(article.updatedAt)}
          </Typography>
        </Box>

        {article.readingTime && (
          <Typography variant="caption" sx={{ color: colors.neutral[500] }}>
            {article.readingTime} min read
          </Typography>
        )}

        {article.viewCount > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Visibility sx={{ fontSize: 14, color: colors.neutral[400] }} />
            <Typography variant="caption" sx={{ color: colors.neutral[500] }}>
              {article.viewCount} views
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ArticleListItem;
