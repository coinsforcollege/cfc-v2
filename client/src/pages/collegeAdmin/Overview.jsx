import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid
} from '@mui/material';
import {
  People,
  TrendingUp,
  EmojiEvents,
  Check,
  LocalGasStation,
  ShowChart,
  Code,
  Api,
  Security,
  CloudDone,
  Rocket,
  Stars,
  Speed,
  AttachMoney,
  AccountBalance
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router';
import { collegeAdminApi } from '../../api/collegeAdmin.api';
import DashboardLayout from '../../layouts/DashboardLayout';

const getStatusChipStyle = (status) => {
  switch(status) {
    case 'Unaffiliated':
      return { background: 'rgba(148, 163, 184, 0.9)', color: 'white' };
    case 'Waitlist':
      return { background: 'rgba(245, 158, 11, 0.9)', color: 'white' };
    case 'Building':
      return { background: 'rgba(59, 130, 246, 0.9)', color: 'white' };
    case 'Live':
      return { background: 'rgba(16, 185, 129, 0.9)', color: 'white' };
    default:
      return { background: 'rgba(229, 231, 235, 0.9)', color: '#6b7280' };
  }
};

const Overview = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'college_admin') {
      navigate('/auth/login');
      return;
    }
    fetchDashboard();
  }, [user, navigate]);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await collegeAdminApi.getDashboard();
      setDashboard(response.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      if (error.status === 404 || error.message?.includes('No college associated')) {
        navigate('/auth/college-admin-selection');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && !dashboard) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LinearProgress sx={{ width: '50%' }} />
      </Box>
    );
  }

  const college = dashboard?.college || {};
  const stats = college?.stats || {};

  const timelineSteps = [
    { label: 'College Registration', completed: true },
    { label: 'Profile Setup', completed: true },
    { label: 'Community Building', completed: false },
    { label: 'Token Launch', completed: false },
  ];

  const platformFeatures = [
    { icon: <LocalGasStation />, title: 'Gas Sponsorship', description: 'Zero transaction fees', enabled: true },
    { icon: <ShowChart />, title: 'Exchange Listing', description: 'InTuition Exchange', enabled: true },
    { icon: <Code />, title: 'Smart Contracts', description: 'Pre-built & audited', enabled: true },
    { icon: <Api />, title: 'API Access', description: 'Full platform API', enabled: true },
    { icon: <Security />, title: 'Security Audits', description: 'Professional audits', enabled: true },
    { icon: <CloudDone />, title: 'Cloud Infra', description: 'Scalable hosting', enabled: true },
    { icon: <AttachMoney />, title: 'Fiat On-Ramp', description: 'Easy token purchase', enabled: true },
    { icon: <Speed />, title: 'Fast Settlements', description: 'Instant transfers', enabled: true },
    { icon: <AccountBalance />, title: 'Multi-sig Wallets', description: 'Enhanced security', enabled: true },
  ];

  const leaderboardData = [
    { rank: 1, name: 'MIT', country: 'USA', miners: 8420, tokens: 12580.50 },
    { rank: 2, name: 'Stanford University', country: 'USA', miners: 7890, tokens: 11234.20 },
    { rank: 3, name: 'Harvard University', country: 'USA', miners: 7235, tokens: 10852.75 },
    { rank: 4, name: 'Oxford University', country: 'UK', miners: 6890, tokens: 10335.60 },
    { rank: 5, name: college.name, country: college.country, miners: stats.totalMiners || 0, tokens: stats.totalTokensMined || 0, highlight: true },
    { rank: 6, name: 'Cambridge University', country: 'UK', miners: 5890, tokens: 8835.40 },
  ];

  const sidebarStats = {
    communityCount: stats.totalMiners || 0,
  };

  return (
    <DashboardLayout stats={sidebarStats}>
      <Box sx={{ maxWidth: '1400px', width: '100%', mx: 'auto' }}>
        {/* Celebration Banner */}
        <Card sx={{
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          mb: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                  Welcome to Collegen, {college.name}!
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  You're part of something big. Your college token journey starts here.
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip
                  label={dashboard?.college?.status || 'Unaffiliated'}
                  sx={{
                    ...getStatusChipStyle(dashboard?.college?.status),
                    fontWeight: 600
                  }}
                />
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
          <Card sx={{ flex: '1 1 280px', borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  p: 1.5,
                  borderRadius: 2,
                  display: 'flex'
                }}>
                  <People sx={{ color: 'white', fontSize: 28 }} />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Total Miners</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>{stats.totalMiners || 0}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ flex: '1 1 280px', borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  p: 1.5,
                  borderRadius: 2,
                  display: 'flex'
                }}>
                  <TrendingUp sx={{ color: 'white', fontSize: 28 }} />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Active Miners</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>{stats.activeMiners || 0}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ flex: '1 1 280px', borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{
                  background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                  p: 1.5,
                  borderRadius: 2,
                  display: 'flex'
                }}>
                  <EmojiEvents sx={{ color: 'white', fontSize: 28 }} />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Tokens Mined</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {stats.totalTokensMined ? stats.totalTokensMined.toFixed(2) : '0.00'}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Launch Timeline */}
        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
              <Rocket sx={{ color: '#667eea', fontSize: 28 }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Launch Timeline</Typography>
            </Box>
            <Box sx={{ position: 'relative', px: 2 }}>
              <Box sx={{
                position: 'absolute',
                top: 20,
                left: '10%',
                right: '10%',
                height: 4,
                background: '#e2e8f0',
                borderRadius: 2,
                zIndex: 0
              }}>
                <Box sx={{
                  height: '100%',
                  width: '50%',
                  background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
                  borderRadius: 2,
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    right: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: '#10b981',
                    boxShadow: '0 0 0 4px rgba(16, 185, 129, 0.2)',
                    animation: 'pulse 2s infinite'
                  }
                }} />
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
                {timelineSteps.map((step, index) => (
                  <Box key={index} sx={{ flex: 1, textAlign: 'center' }}>
                    <Box sx={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      background: step.completed
                        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                        : '#e2e8f0',
                      border: !step.completed && timelineSteps[index - 1]?.completed ? '3px solid #10b981' : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto',
                      mb: 2,
                      boxShadow: step.completed
                        ? '0 4px 12px rgba(16, 185, 129, 0.3)'
                        : !step.completed && timelineSteps[index - 1]?.completed
                          ? '0 0 0 4px rgba(16, 185, 129, 0.2)'
                          : 'none',
                      animation: !step.completed && timelineSteps[index - 1]?.completed ? 'pulse 2s infinite' : 'none'
                    }}>
                      {step.completed ? (
                        <Check sx={{ color: 'white', fontSize: 24 }} />
                      ) : (
                        <Typography sx={{
                          color: timelineSteps[index - 1]?.completed ? '#10b981' : '#64748b',
                          fontWeight: 700
                        }}>
                          {index + 1}
                        </Typography>
                      )}
                    </Box>
                    <Typography variant="body2" sx={{
                      fontWeight: 600,
                      color: step.completed ? '#10b981' : '#64748b',
                      mb: 0.5
                    }}>
                      {step.label}
                    </Typography>
                    {!step.completed && timelineSteps[index - 1]?.completed && (
                      <Chip
                        label="In Progress"
                        size="small"
                        sx={{
                          background: 'rgba(16, 185, 129, 0.1)',
                          color: '#10b981',
                          fontWeight: 600,
                          fontSize: '10px'
                        }}
                      />
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
            <Box sx={{
              mt: 4,
              p: 2,
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
              borderRadius: 2,
              textAlign: 'center'
            }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#667eea' }}>
                Expected Token Launch: Q2 2026
              </Typography>
            </Box>

            <style>
              {`
                @keyframes pulse {
                  0%, 100% {
                    box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.2);
                  }
                  50% {
                    box-shadow: 0 0 0 8px rgba(16, 185, 129, 0.1);
                  }
                }
              `}
            </style>
          </CardContent>
        </Card>

        {/* Platform Features */}
        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Stars sx={{ color: '#667eea', fontSize: 28 }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Platform Features Enabled</Typography>
            </Box>
            <Grid container spacing={2.5}>
              {platformFeatures.map((feature, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Box sx={{
                    p: 2.5,
                    borderRadius: 2.5,
                    border: '2px solid',
                    borderColor: '#e2e8f0',
                    background: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.5,
                    transition: 'all 0.3s',
                    '&:hover': {
                      borderColor: '#667eea',
                      boxShadow: '0 4px 20px rgba(102, 126, 234, 0.15)',
                      transform: 'translateY(-2px)'
                    }
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        p: 1.5,
                        borderRadius: 2,
                        display: 'flex',
                        color: 'white'
                      }}>
                        {feature.icon}
                      </Box>
                      <Chip
                        label="Enabled"
                        size="small"
                        sx={{
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '10px'
                        }}
                      />
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>{feature.title}</Typography>
                      <Typography variant="caption" color="text.secondary">{feature.description}</Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* Global Leaderboard */}
        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <EmojiEvents sx={{ color: '#f59e0b', fontSize: 28 }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Global Leaderboard</Typography>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f8fafc' }}>
                    <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Rank</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#475569' }}>College</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#475569' }} align="right">Miners</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#475569' }} align="right">Tokens</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {leaderboardData.map((item, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        background: item.highlight ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
                        '&:hover': { background: item.highlight ? 'rgba(102, 126, 234, 0.15)' : '#f8fafc' }
                      }}
                    >
                      <TableCell>
                        <Chip
                          label={item.rank}
                          size="small"
                          sx={{
                            background: item.rank <= 3 ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : '#e2e8f0',
                            color: item.rank <= 3 ? 'white' : '#64748b',
                            fontWeight: 700
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: item.highlight ? 700 : 600 }}>
                            {item.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">{item.country}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.miners}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.tokens.toFixed(2)}</Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>
    </DashboardLayout>
  );
};

export default Overview;
