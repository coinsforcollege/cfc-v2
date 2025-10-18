import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Email } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { colors, borderRadius } from '../../utils/designTokens';

const DocsContactCTA = ({ message }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        mt: 6,
        p: 4,
        borderRadius: borderRadius['2xl'],
        background: `
          radial-gradient(circle at 20% 20%, rgba(139, 92, 246, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.05) 0%, transparent 50%)
        `,
        border: '1px solid rgba(139, 92, 246, 0.1)',
        textAlign: 'center'
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          color: colors.neutral[900],
          mb: 1
        }}
      >
        {message || t('auth.cantFindWhatYoureLookingFor')}
      </Typography>

      <Typography
        variant="body2"
        sx={{
          color: colors.neutral[600],
          mb: 3,
          maxWidth: 500,
          mx: 'auto'
        }}
      >
        {t('auth.ourSupportTeamIsHere')}
      </Typography>

      <Button
        variant="contained"
        startIcon={<Email />}
        onClick={() => navigate('/contact')}
        sx={{
          background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
          color: 'white',
          fontWeight: 600,
          px: 4,
          py: 1.5,
          borderRadius: borderRadius.lg,
          textTransform: 'none',
          '&:hover': {
            background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 20px rgba(139, 92, 246, 0.3)'
          },
          transition: 'all 0.2s'
        }}
      >
        {t('auth.contactSupport')}
      </Button>
    </Box>
  );
};

export default DocsContactCTA;
