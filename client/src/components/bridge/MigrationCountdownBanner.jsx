import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Schedule, SwapHoriz } from '@mui/icons-material';

// Cutoff date for migration - mining moves to Exchange after this
const MIGRATION_CUTOFF = new Date('2026-03-15T00:00:00Z');

const MigrationCountdownBanner = ({ bridgeStatus, onConnectClick, onMigrateClick }) => {
  const [daysLeft, setDaysLeft] = useState(null);

  useEffect(() => {
    const now = new Date();
    const diff = MIGRATION_CUTOFF - now;
    const days = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    setDaysLeft(days);
  }, []);

  // Don't show if already migrated or cutoff passed
  if (bridgeStatus?.migrated || daysLeft === null || daysLeft <= 0) {
    return null;
  }

  const isUrgent = daysLeft <= 7;
  const isConnected = bridgeStatus?.linked === true;

  return (
    <Box sx={{
      p: 2,
      borderRadius: 2,
      background: isUrgent
        ? '#fef2f2'
        : '#fffbeb',
      border: isUrgent
        ? '1px solid #fca5a5'
        : '1px solid #fcd34d',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 1.5,
      mb: 3
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Schedule sx={{
          color: isUrgent ? '#dc2626' : '#d97706',
          fontSize: 22
        }} />
        <Box>
          <Typography variant="body2" sx={{
            fontWeight: 700,
            color: isUrgent ? '#991b1b' : '#92400e'
          }}>
            Mining moves to Intuition Exchange in {daysLeft} day{daysLeft !== 1 ? 's' : ''}
          </Typography>
          <Typography variant="caption" sx={{ color: isUrgent ? '#b91c1c' : '#a16207' }}>
            {isConnected
              ? 'Migrate your balances before the cutoff to keep mining.'
              : 'Connect your Exchange account and migrate to continue mining.'}
          </Typography>
        </Box>
      </Box>

      {!isConnected ? (
        <Button
          variant="contained"
          size="small"
          onClick={onConnectClick}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            background: isUrgent ? '#dc2626' : '#d97706',
            color: '#fff',
            '&:hover': {
              background: isUrgent ? '#b91c1c' : '#b45309',
            }
          }}
        >
          Connect Now
        </Button>
      ) : (
        <Button
          variant="contained"
          size="small"
          onClick={onMigrateClick}
          startIcon={<SwapHoriz sx={{ fontSize: 16 }} />}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            background: isUrgent ? '#dc2626' : '#d97706',
            color: '#fff',
            '&:hover': {
              background: isUrgent ? '#b91c1c' : '#b45309',
            }
          }}
        >
          Migrate Now
        </Button>
      )}
    </Box>
  );
};

export default MigrationCountdownBanner;
