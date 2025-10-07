import React from 'react';
import { Box, Typography } from '@mui/material';
import { borderRadius, shadows } from '../../utils/designTokens';

const VideoBlock = ({ data }) => {
  const getEmbedUrl = (url) => {
    // YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('youtu.be') 
        ? url.split('youtu.be/')[1]?.split('?')[0]
        : url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    // Vimeo
    if (url.includes('vimeo.com')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    
    return url;
  };

  const aspectRatioMap = {
    '16:9': '56.25%',
    '4:3': '75%',
    '1:1': '100%'
  };

  return (
    <Box sx={{ mb: 4 }}>
      {data.title && (
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          {data.title}
        </Typography>
      )}
      <Box sx={{ 
        position: 'relative',
        paddingBottom: aspectRatioMap[data.aspectRatio || '16:9'],
        height: 0,
        overflow: 'hidden',
        borderRadius: borderRadius['2xl'],
        boxShadow: shadows.lg
      }}>
        <iframe
          src={getEmbedUrl(data.videoUrl)}
          title={data.title || 'Video'}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none'
          }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </Box>
    </Box>
  );
};

export default VideoBlock;

