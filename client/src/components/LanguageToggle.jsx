import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import { Language as LanguageIcon } from '@mui/icons-material';

const LanguageToggle = ({ isMobile = false }) => {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    handleClose();
  };

  const currentLanguage = i18n.language || 'en';
  const languageDisplay = currentLanguage === 'zh' ? '中文' : 'EN';

  if (isMobile) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            color: '#2d3748',
            textTransform: 'uppercase',
            fontSize: '0.75rem',
            letterSpacing: '0.5px',
            mb: 1
          }}
        >
          Language / 语言
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Box
            onClick={() => changeLanguage('en')}
            sx={{
              flex: 1,
              padding: '8px 16px',
              borderRadius: '8px',
              background: currentLanguage === 'en'
                ? 'linear-gradient(135deg, #0EA5E9 0%, #8B5CF6 100%)'
                : 'rgba(255, 255, 255, 0.8)',
              color: currentLanguage === 'en' ? '#ffffff' : '#374151',
              border: currentLanguage === 'en'
                ? 'none'
                : '1px solid rgba(139, 92, 246, 0.2)',
              cursor: 'pointer',
              textAlign: 'center',
              fontWeight: 500,
              fontSize: '0.9rem',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: currentLanguage === 'en'
                  ? 'linear-gradient(135deg, #0284C7 0%, #7C3AED 100%)'
                  : 'rgba(139, 92, 246, 0.1)',
              }
            }}
          >
            EN
          </Box>
          <Box
            onClick={() => changeLanguage('zh')}
            sx={{
              flex: 1,
              padding: '8px 16px',
              borderRadius: '8px',
              background: currentLanguage === 'zh'
                ? 'linear-gradient(135deg, #0EA5E9 0%, #8B5CF6 100%)'
                : 'rgba(255, 255, 255, 0.8)',
              color: currentLanguage === 'zh' ? '#ffffff' : '#374151',
              border: currentLanguage === 'zh'
                ? 'none'
                : '1px solid rgba(139, 92, 246, 0.2)',
              cursor: 'pointer',
              textAlign: 'center',
              fontWeight: 500,
              fontSize: '0.9rem',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: currentLanguage === 'zh'
                  ? 'linear-gradient(135deg, #0284C7 0%, #7C3AED 100%)'
                  : 'rgba(139, 92, 246, 0.1)',
              }
            }}
          >
            中文
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <IconButton
        onClick={handleClick}
        sx={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(139, 92, 246, 0.2)',
          width: '44px',
          height: '44px',
          '&:hover': {
            background: 'rgba(139, 92, 246, 0.1)',
            borderColor: 'rgba(139, 92, 246, 0.4)',
          },
          transition: 'all 0.3s ease',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <LanguageIcon sx={{ fontSize: '18px', color: '#8b5cf6', mb: 0.2 }} />
          <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: '#8b5cf6', lineHeight: 1 }}>
            {languageDisplay}
          </Typography>
        </Box>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            mt: 1
          }
        }}
      >
        <MenuItem
          onClick={() => changeLanguage('en')}
          sx={{
            fontSize: '0.95rem',
            py: 1.5,
            px: 2,
            background: currentLanguage === 'en' ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
            fontWeight: currentLanguage === 'en' ? 600 : 400,
            color: currentLanguage === 'en' ? '#8b5cf6' : '#374151',
            '&:hover': {
              background: 'rgba(139, 92, 246, 0.1)',
            }
          }}
        >
          English
        </MenuItem>
        <MenuItem
          onClick={() => changeLanguage('zh')}
          sx={{
            fontSize: '0.95rem',
            py: 1.5,
            px: 2,
            background: currentLanguage === 'zh' ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
            fontWeight: currentLanguage === 'zh' ? 600 : 400,
            color: currentLanguage === 'zh' ? '#8b5cf6' : '#374151',
            '&:hover': {
              background: 'rgba(139, 92, 246, 0.1)',
            }
          }}
        >
          中文 (简体)
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default LanguageToggle;
