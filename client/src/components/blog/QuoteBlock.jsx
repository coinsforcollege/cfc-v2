import React from 'react';
import { Box, Typography } from '@mui/material';
import { FormatQuote } from '@mui/icons-material';
import { colors, borderRadius } from '../../utils/designTokens';

const QuoteBlock = ({ data }) => {
  return (
    <Box sx={{ 
      mb: 4,
      position: 'relative',
      py: 4,
      px: { xs: 3, md: 5 },
      background: `linear-gradient(135deg, ${colors.primary[50]} 0%, ${colors.secondary[50]} 100%)`,
      borderRadius: borderRadius['2xl'],
      borderLeft: `6px solid ${colors.primary[500]}`
    }}>
      <FormatQuote 
        sx={{ 
          position: 'absolute',
          top: 16,
          left: 16,
          fontSize: 48,
          color: colors.primary[200],
          opacity: 0.5
        }} 
      />
      
      <Typography 
        variant="h5" 
        sx={{ 
          fontStyle: 'italic',
          fontWeight: 500,
          color: colors.neutral[800],
          lineHeight: 1.6,
          mb: 2,
          pl: { xs: 0, md: 4 }
        }}
      >
        "{data.text}"
      </Typography>

      {(data.author || data.authorTitle) && (
        <Box sx={{ pl: { xs: 0, md: 4 }, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ 
            width: 40, 
            height: 2, 
            background: colors.primary[400]
          }} />
          <Box>
            {data.author && (
              <Typography variant="body1" sx={{ fontWeight: 600, color: colors.neutral[900] }}>
                {data.author}
              </Typography>
            )}
            {data.authorTitle && (
              <Typography variant="body2" color="text.secondary">
                {data.authorTitle}
              </Typography>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default QuoteBlock;

