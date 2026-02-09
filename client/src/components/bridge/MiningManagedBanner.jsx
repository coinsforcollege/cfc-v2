import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { OpenInNew, SwapHoriz } from '@mui/icons-material';

const MiningManagedBanner = () => {
  const exchangeUrl = import.meta.env.VITE_EXCHANGE_URL || 'https://exchange.intuition.com';

  return (
    <Box sx={{
      p: 3,
      borderRadius: 3,
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      border: '1px solid rgba(16, 185, 129, 0.3)',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        background: 'linear-gradient(90deg, #10b981, #34d399, #10b981)',
      }
    }}>
      <Box sx={{
        width: 48,
        height: 48,
        borderRadius: '50%',
        background: 'rgba(16, 185, 129, 0.15)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mx: 'auto',
        mb: 2
      }}>
        <SwapHoriz sx={{ color: '#34d399', fontSize: 24 }} />
      </Box>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#f1f5f9', mb: 0.5 }}>
        Mining Managed on Intuition Exchange
      </Typography>
      <Typography variant="body2" sx={{ color: '#94a3b8', mb: 2.5 }}>
        Your tokens have been migrated. All mining activity is now on the exchange.
      </Typography>

      <Button
        variant="contained"
        endIcon={<OpenInNew />}
        href={`${exchangeUrl}/college-coins`}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white',
          fontWeight: 600,
          textTransform: 'none',
          borderRadius: 2,
          px: 3,
          '&:hover': {
            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
          }
        }}
      >
        Open College Coins on Exchange
      </Button>
    </Box>
  );
};

export default MiningManagedBanner;
