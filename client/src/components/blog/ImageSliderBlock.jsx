import React, { useState, useEffect } from 'react';
import { Box, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { borderRadius, shadows, colors } from '../../utils/designTokens';

const ImageSliderBlock = ({ data, getImageUrl }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = data.images || [];

  useEffect(() => {
    if (!data.autoplay || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, data.interval || 3000);

    return () => clearInterval(interval);
  }, [data.autoplay, data.interval, images.length]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  if (!images || images.length === 0) return null;

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ 
        position: 'relative',
        borderRadius: borderRadius['2xl'],
        overflow: 'hidden',
        boxShadow: shadows.lg
      }}>
        <Box
          component="img"
          src={getImageUrl(images[currentIndex])}
          alt={`Slide ${currentIndex + 1}`}
          sx={{
            width: '100%',
            height: { xs: 300, md: 500 },
            objectFit: 'cover'
          }}
        />

        {images.length > 1 && (
          <>
            {/* Previous Button */}
            <IconButton
              onClick={handlePrevious}
              sx={{
                position: 'absolute',
                left: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(0,0,0,0.5)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                '&:hover': {
                  background: 'rgba(0,0,0,0.7)',
                }
              }}
            >
              <ChevronLeft />
            </IconButton>

            {/* Next Button */}
            <IconButton
              onClick={handleNext}
              sx={{
                position: 'absolute',
                right: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(0,0,0,0.5)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                '&:hover': {
                  background: 'rgba(0,0,0,0.7)',
                }
              }}
            >
              <ChevronRight />
            </IconButton>

            {/* Indicators */}
            <Box sx={{
              position: 'absolute',
              bottom: 16,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: 1
            }}>
              {images.map((_, index) => (
                <Box
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: index === currentIndex ? 'white' : 'rgba(255,255,255,0.5)',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    '&:hover': {
                      background: 'white',
                      transform: 'scale(1.2)'
                    }
                  }}
                />
              ))}
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default ImageSliderBlock;

