import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Slide } from '@mui/material';
import { Close, Campaign } from '@mui/icons-material';
import apiClient from '../api/apiClient';

const AnnouncementBanner = () => {
  const [announcement, setAnnouncement] = useState(null);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncement();
  }, []);

  const fetchAnnouncement = async () => {
    try {
      const response = await apiClient.get('/blog/announcements');

      if (response.success && response.data && response.data.length > 0) {
        const latestAnnouncement = response.data[0];
        const announcementId = latestAnnouncement.id;

        const dismissed = localStorage.getItem(`announcement_dismissed_${announcementId}`);

        if (!dismissed) {
          setAnnouncement({
            id: announcementId,
            message: latestAnnouncement.message,
            link: latestAnnouncement.link,
            linkLabel: latestAnnouncement.linkLabel,
            image: latestAnnouncement.image ? {
              url: latestAnnouncement.image.url,
              alt: latestAnnouncement.image.alternativeText || 'Announcement'
            } : null
          });
          setVisible(true);
        }
      }
    } catch (error) {
      console.error('Error fetching announcement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    setVisible(false);
    if (announcement) {
      localStorage.setItem(`announcement_dismissed_${announcement.id}`, 'true');
    }
  };

  const getImageUrl = (image) => {
    if (!image) return null;
    const baseUrl = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';
    return image.url?.startsWith('http') ? image.url : `${baseUrl}${image.url}`;
  };

  if (loading || !announcement || !visible) {
    return null;
  }

  return (
    <Slide direction="down" in={visible} timeout={400}>
      <Box
        sx={{
          position: 'fixed',
          top: 64,
          left: 0,
          right: 0,
          zIndex: 999,
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.95) 0%, rgba(236, 72, 153, 0.95) 100%)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        }}
      >
        <Box
          sx={{
            maxWidth: '1400px',
            mx: 'auto',
            px: { xs: 2, sm: 3, md: 4 },
            py: { xs: 1, sm: 1.25 },
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 1, sm: 2 },
            minHeight: { xs: '44px', sm: '52px' }
          }}
        >
          {announcement.image ? (
            <Box
              component="img"
              src={getImageUrl(announcement.image)}
              alt={announcement.image.alt}
              sx={{
                width: { xs: 32, sm: 40 },
                height: { xs: 32, sm: 40 },
                borderRadius: '6px',
                objectFit: 'cover',
                flexShrink: 0,
                border: '2px solid rgba(255, 255, 255, 0.3)'
              }}
            />
          ) : (
            <Campaign
              sx={{
                fontSize: { xs: 18, sm: 20 },
                color: 'white',
                flexShrink: 0
              }}
            />
          )}

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255, 255, 255, 0.95)',
                fontSize: { xs: '0.7rem', sm: '0.8rem' },
                lineHeight: 1.4,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: { xs: 1, sm: 2 },
                WebkitBoxOrient: 'vertical',
              }}
            >
              {announcement.message}
            </Typography>
          </Box>

          {announcement.link && announcement.linkLabel && (
            <Box
              component="a"
              href={announcement.link}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: { xs: 'none', sm: 'block' },
                flexShrink: 0,
                px: 2,
                py: 0.75,
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '6px',
                color: 'white',
                fontSize: '0.8rem',
                fontWeight: 600,
                textDecoration: 'none',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.3)',
                  transform: 'translateY(-1px)',
                }
              }}
            >
              {announcement.linkLabel}
            </Box>
          )}

          <IconButton
            size="small"
            onClick={handleDismiss}
            sx={{
              color: 'white',
              flexShrink: 0,
              p: { xs: 0.5, sm: 0.75 },
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.2)',
              }
            }}
          >
            <Close sx={{ fontSize: { xs: 18, sm: 20 } }} />
          </IconButton>
        </Box>
      </Box>
    </Slide>
  );
};

export default AnnouncementBanner;
