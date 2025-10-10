import React from 'react';
import { Box, Typography } from '@mui/material';
import DashboardLayout from '../../layouts/DashboardLayout';

const Leaderboard = () => {
  return (
    <DashboardLayout
      stats={{}}
      searchPlaceholder="Search..."
    >
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 3 }}>
          Leaderboard
        </Typography>
        <Typography color="text.secondary">
          Leaderboard content will be moved here
        </Typography>
      </Box>
    </DashboardLayout>
  );
};

export default Leaderboard;
