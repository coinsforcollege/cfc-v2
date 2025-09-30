import { CheckCircle, Settings, TrendingUp, Verified } from '@mui/icons-material'
import { alpha, Chip, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import React from 'react'

function LeaderBoard({ theme, topColleges }) {
  const getStatusIcon = (status) => {
    if (status === 'Token Configured') return <Settings fontSize="small" />;
    if (status === 'Admin Verified') return <Verified fontSize="small" />;
    return <CheckCircle fontSize="small" />;
  };

  const getStatusColor = (status) => {
    if (status === 'Token Configured') return 'success';
    if (status === 'Admin Verified') return 'primary';
    return 'default';
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography
        variant="h3"
        align="center"
        sx={{
          mb: 4,
          typography: { xs: 'h4', md: 'h3' },
          '&&': {
            fontWeight: 700,
          }
        }}
      >
        Top Colleges Leaderboard
      </Typography>
      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
              <TableCell><strong>Rank</strong></TableCell>
              <TableCell><strong>College Name</strong></TableCell>
              <TableCell align="center"><strong>Students Mining</strong></TableCell>
              <TableCell align="center"><strong>Growth (24h)</strong></TableCell>
              <TableCell align="center"><strong>Status</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {topColleges.map((college) => (
              <TableRow key={college.rank} sx={{ '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.02) }, transition: 'background-color 0.2s ease' }}>
                <TableCell><Chip label={`#${college.rank}`} size="small" sx={{ fontWeight: 700, bgcolor: college.rank <= 3 ? 'warning.main' : 'default', color: college.rank <= 3 ? 'warning.contrastText' : 'text.primary' }} /></TableCell>
                <TableCell><Typography fontWeight={600}>{college.name}</Typography></TableCell>
                <TableCell align="center"><Typography fontWeight={600}>{college.students.toLocaleString()}</Typography></TableCell>
                <TableCell align="center"><Chip icon={<TrendingUp fontSize="small" />} label={college.growth} size="small" color="success" variant="outlined" /></TableCell>
                <TableCell align="center"><Chip icon={getStatusIcon(college.status)} label={college.status} size="small" color={getStatusColor(college.status)} variant="outlined" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  )
}

export default LeaderBoard