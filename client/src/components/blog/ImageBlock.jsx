import React from 'react';
import { Box, Typography } from '@mui/material';
import { borderRadius, shadows } from '../../utils/designTokens';

const ImageBlock = ({ data, getImageUrl }) => {
  const widthMap = {
    full: '100%',
    large: '90%',
    medium: '75%',
    small: '50%'
  };

  return (
    <Box sx={{ 
      mb: 4,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <Box sx={{ 
        width: { xs: '100%', md: widthMap[data.width || 'full'] },
        maxWidth: '100%'
      }}>
        <Box
          component="img"
          src={getImageUrl(data.image)}
          alt={data.alternativeText || data.caption || ''}
          sx={{
            width: '100%',
            height: 'auto',
            borderRadius: borderRadius['2xl'],
            boxShadow: shadows.lg,
            objectFit: 'cover'
          }}
        />
        {data.caption && (
          <Typography 
            variant="caption" 
            sx={{ 
              display: 'block',
              textAlign: 'center',
              mt: 1.5,
              fontStyle: 'italic',
              color: 'text.secondary'
            }}
          >
            {data.caption}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ImageBlock;

