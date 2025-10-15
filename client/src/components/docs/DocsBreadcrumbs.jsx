import React from 'react';
import { Box, Breadcrumbs, Link, Typography } from '@mui/material';
import { ChevronRight } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import { colors } from '../../utils/designTokens';

const DocsBreadcrumbs = ({ items }) => {
  const navigate = useNavigate();

  return (
    <Box sx={{ mb: 3 }}>
      <Breadcrumbs
        separator={<ChevronRight sx={{ fontSize: '1rem', color: colors.neutral[400] }} />}
        aria-label="breadcrumb"
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          if (isLast) {
            return (
              <Typography
                key={index}
                sx={{
                  color: colors.neutral[900],
                  fontWeight: 600,
                  fontSize: '0.875rem'
                }}
              >
                {item.label}
              </Typography>
            );
          }

          return (
            <Link
              key={index}
              onClick={() => navigate(item.link)}
              sx={{
                color: colors.neutral[600],
                fontSize: '0.875rem',
                cursor: 'pointer',
                textDecoration: 'none',
                '&:hover': {
                  color: colors.neutral[900],
                  textDecoration: 'underline'
                }
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
};

export default DocsBreadcrumbs;
