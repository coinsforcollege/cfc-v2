import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Paper,
  Button,
  useTheme,
  useMediaQuery,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  alpha
} from '@mui/material';
import {
  AccountBalanceWallet,
  School,
  TrendingUp,
  Refresh,
  PlayArrow,
  Stop,
  People,
  KeyboardArrowUp,
  KeyboardArrowDown,
  Circle
} from '@mui/icons-material';
import Tooltip from '@mui/material/Tooltip';
import { useAuth } from '../../contexts/AuthContext';
import { useMiningWebSocket } from '../../hooks/useMiningWebSocket';
import { useToast } from '../../contexts/ToastContext';
import { userApi } from '../../api/user.api';
import { miningApi } from '../../api/mining.api';
import { BorderBeam } from '@/components/ui/border-beam';
import DashboardLayout from '../../layouts/DashboardLayout';
import GuidedTour, { WelcomeDialog } from '../../components/GuidedTour';
import { useTour } from '../../contexts/TourContext';
import { useTranslation } from 'react-i18next';

const Overview = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery('(max-width:1200px)');
  const { user } = useAuth();
  const { t } = useTranslation();
  const { showToast } = useToast();
  const { miningStatus: wsMiningStatus } = useMiningWebSocket();
  const { tourActive, tourStep, startTour, nextStep, isMobileTour } = useTour();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [miningStatus, setMiningStatus] = useState({});
  const [actionLoading, setActionLoading] = useState('');
  const isInitialLoadRef = useRef(true);

  const fetchDashboard = async () => {
    try {
      if (isInitialLoadRef.current) {
        setLoading(true);
      }
      const response = await userApi.getDashboard();
      if (response.success) {
        setDashboard(response.data);
      }
    } catch (err) {
      setError(err.message || t('user.failedToLoadDashboard'));
    } finally {
      if (isInitialLoadRef.current) {
        setLoading(false);
        isInitialLoadRef.current = false;
      }
    }
  };

  const handleStartMining = useCallback(async (collegeId) => {
    try {
      setActionLoading(`start-${collegeId}`);
      const response = await miningApi.startMining(collegeId);
      if (response.success) {
        showToast(t('user.miningStartedSuccess'), 'success');
        fetchDashboard();
        navigate('/user/colleges');
      }
    } catch (err) {
      console.error('Failed to start mining:', err);
      showToast(err.message || t('user.failedToStartMining'), 'error');
    } finally {
      setActionLoading('');
    }
  }, [t, showToast, navigate]);

  const handleStopMining = useCallback(async (collegeId) => {
    try {
      setActionLoading(`stop-${collegeId}`);
      const response = await miningApi.stopMining(collegeId);
      if (response.success) {
        showToast(t('user.miningStoppedSuccess'), 'success');
        fetchDashboard();
      }
    } catch (err) {
      console.error('Failed to stop mining:', err);
      showToast(err.message || t('user.failedToStopMining'), 'error');
    } finally {
      setActionLoading('');
    }
  }, [t, showToast]);


  useEffect(() => {
    if (wsMiningStatus) {
      const statusMap = {};
      wsMiningStatus.activeSessions?.forEach(session => {
        if (session.college) {
          statusMap[session.college._id] = session;
        }
      });

      // Always update mining status to reflect current token values
      // Even though session IDs stay the same, currentTokens changes every 5 seconds
      setMiningStatus(statusMap);

      // Only update activeSessions if they actually changed
      setDashboard(prev => {
        if (!prev) return prev;

        const prevSessionIds = prev.activeSessions?.map(s => s.sessionId).sort().join(',') || '';
        const newSessionIds = wsMiningStatus.activeSessions?.map(s => s.sessionId).sort().join(',') || '';

        if (prevSessionIds === newSessionIds) {
          return prev; // No change, don't trigger re-render
        }

        return {
          ...prev,
          activeSessions: wsMiningStatus.activeSessions
        };
      });
    }
  }, [wsMiningStatus]);

  useEffect(() => {
    if (!user || user.role !== 'user') {
      navigate('/auth/login');
      return;
    }

    fetchDashboard();
  }, [user, navigate]);

  useEffect(() => {
    if (dashboard && !loading && dashboard.user?.onboardingCompleted === false) {
      startTour(isMobile);
    }
  }, [dashboard, loading, isMobile]);

  // Initialize miningStatus from API data to avoid race condition with WebSocket
  // This ensures correct state is shown immediately on page load
  useEffect(() => {
    if (dashboard?.activeSessions && dashboard.activeSessions.length > 0) {
      const initialStatusMap = {};
      dashboard.activeSessions.forEach(session => {
        if (session.college) {
          initialStatusMap[session.college._id] = session;
        }
      });
      // Only set if miningStatus is still empty (initial load)
      setMiningStatus(prev => {
        // If already populated by WebSocket, don't override
        if (Object.keys(prev).length > 0) return prev;
        return initialStatusMap;
      });
    }
  }, [dashboard?.activeSessions]);

  const totalMiningTokens = useMemo(() => {
    return Object.values(miningStatus).reduce((sum, session) =>
      sum + (session.isActive && session.remainingHours > 0 ? session.currentTokens : 0), 0
    );
  }, [miningStatus]);

  const activeCollegeIds = useMemo(() => {
    return new Set(
      dashboard?.miningColleges
        ?.filter(mc => mc.college)
        .map(mc => mc.college._id) || []
    );
  }, [dashboard?.miningColleges]);

  const filteredWallets = useMemo(() => {
    return dashboard?.wallets?.filter(wallet =>
      wallet.college && activeCollegeIds.has(wallet.college._id)
    ) || [];
  }, [dashboard?.wallets, activeCollegeIds]);

  const totalBalance = useMemo(() => {
    const walletBalance = filteredWallets.reduce((sum, wallet) => sum + (wallet.balance || 0), 0);
    return walletBalance + totalMiningTokens;
  }, [filteredWallets, totalMiningTokens]);

  const currentEarningRate = useMemo(() => {
    return Object.values(miningStatus).reduce((sum, session) =>
      sum + (session.isActive && session.remainingHours > 0 ? session.earningRate : 0), 0
    );
  }, [miningStatus]);

  const hasActiveMiner = useMemo(() => {
    return Object.values(miningStatus).some(session =>
      session.isActive && session.remainingHours > 0
    );
  }, [miningStatus]);

  if (loading) {
    return (
      <DashboardLayout stats={{}}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout stats={{}}>
        <Alert severity="error">{error}</Alert>
      </DashboardLayout>
    );
  }

  const sidebarStats = {
    collegesCount: dashboard?.miningColleges?.filter(mc => mc.college).length || 0,
    referralsCount: dashboard?.user?.totalReferrals || 0,
  };

  return (
    <DashboardLayout
      stats={sidebarStats}
      searchPlaceholder="Search..."
    >
      <Box sx={{ maxWidth: '1200px', width: '100%', mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
            {t('user.welcome')}, {dashboard?.user.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {dashboard?.user.college?.name || t('user.noCollegeAssigned')}
          </Typography>
        </Box>

        {/* Summary Cards */}
        <Box sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          mb: 3
        }}>
          <Card sx={{
            flex: { xs: 'calc(50% - 8px)', md: 'calc(25% - 12px)' },
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)'
          }}>
            <CardContent>
              <AccountBalanceWallet sx={{ color: 'white', fontSize: 24, mb: 1 }} />
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)', display: 'block', mb: 0.5 }}>
                {t('user.totalBalance')}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {totalBalance.toFixed(4)}
              </Typography>
            </CardContent>
          </Card>

          <Card
            onClick={() => navigate('/user/colleges')}
            sx={{
              flex: { xs: 'calc(50% - 8px)', md: 'calc(25% - 12px)' },
              background: hasActiveMiner
                ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                : 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)',
              color: 'white',
              borderRadius: 3,
              boxShadow: hasActiveMiner
                ? '0 4px 20px rgba(240, 147, 251, 0.3)'
                : '0 4px 20px rgba(100, 116, 139, 0.2)',
              position: 'relative',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: hasActiveMiner
                  ? '0 6px 24px rgba(240, 147, 251, 0.4)'
                  : '0 6px 24px rgba(100, 116, 139, 0.3)'
              }
            }}
          >
            {hasActiveMiner && (
              <BorderBeam
                size={80}
                duration={7.5}
                delay={0}
                colorFrom="#ffffff"
                colorTo="#f0f0f0"
                borderWidth={3}
              />
            )}
            <CardContent sx={{ position: 'relative', zIndex: 1 }}>
              <TrendingUp sx={{ color: 'white', fontSize: 24, mb: 1 }} />
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)', display: 'block', mb: 0.5 }}>
                {hasActiveMiner ? t('user.minerRunning') : t('user.allMinersInactive')}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {totalMiningTokens.toFixed(4)}
              </Typography>
            </CardContent>
          </Card>

          <Card
            onClick={() => navigate('/user/community')}
            sx={{
              flex: { xs: 'calc(50% - 8px)', md: 'calc(25% - 12px)' },
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white',
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(79, 172, 254, 0.3)',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 6px 24px rgba(79, 172, 254, 0.4)'
              }
            }}
          >
            <CardContent>
              <People sx={{ color: 'white', fontSize: 24, mb: 1 }} />
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)', display: 'block', mb: 0.5 }}>
                {t('user.activeFriends')}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {dashboard?.summary?.activeFriendsCount?.active || 0} / {dashboard?.summary?.activeFriendsCount?.total || 0}
              </Typography>
            </CardContent>
          </Card>

          <Card
            onClick={() => navigate('/user/colleges')}
            sx={{
              flex: { xs: 'calc(50% - 8px)', md: 'calc(25% - 12px)' },
              background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
              color: 'white',
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(250, 112, 154, 0.3)',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 6px 24px rgba(250, 112, 154, 0.4)'
              }
            }}
          >
            <CardContent>
              <Refresh sx={{ color: 'white', fontSize: 24, mb: 1 }} />
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)', display: 'block', mb: 0.5 }}>
                {t('user.currentRate')}
              </Typography>
              <Tooltip title={t('user.totalRateTooltip')}>
                <Typography variant="h5" sx={{ fontWeight: 700, cursor: 'help' }}>
                  {currentEarningRate.toFixed(2)} {t('user.tokenPerHr')}
                </Typography>
              </Tooltip>
            </CardContent>
          </Card>
        </Box>

        {/* Balance Breakdown and Active Miners Row */}
        <Box sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          mb: 3
        }}>
          {/* Active Miners Table */}
          <Card sx={{
            flex: { xs: '100%', md: 'calc(50% - 8px)' },
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                  {t('user.tokenMiners')}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    if (tourActive && (tourStep === 'navigate-mobile' || tourStep === 'navigate')) {
                      nextStep();
                    }
                    navigate('/user/colleges');
                  }}
                  data-tour={tourActive && tourStep === 'navigate-mobile' && isMobileTour ? 'view-colleges-mobile-button' : undefined}
                  sx={{
                    textTransform: 'none',
                    borderColor: '#8b5cf6',
                    color: '#8b5cf6',
                    fontWeight: 600,
                    '&:hover': {
                      borderColor: '#7c3aed',
                      background: 'rgba(139, 92, 246, 0.05)'
                    }
                  }}
                >
                  {t('user.viewColleges')}
                </Button>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {t('user.miningStatus')}
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#f8fafc' }}>
                      <TableCell sx={{ fontWeight: 700, color: '#475569' }}>{t('user.college')}</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700, color: '#475569' }}>{t('user.action')}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, color: '#475569' }}>{t('user.progress')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dashboard?.miningColleges && dashboard.miningColleges.length > 0 ? (
                      dashboard.miningColleges.filter(mc => mc.college).sort((a, b) => {
                        const sessionA = miningStatus[a.college._id];
                        const sessionB = miningStatus[b.college._id];
                        const isMiningA = sessionA?.isActive && sessionA?.remainingHours > 0;
                        const isMiningB = sessionB?.isActive && sessionB?.remainingHours > 0;

                        if (isMiningA && !isMiningB) return -1;
                        if (!isMiningA && isMiningB) return 1;
                        return 0;
                      }).map((miningCollege, index) => {
                        const session = miningStatus[miningCollege.college._id];
                        const isMining = session?.isActive && session?.remainingHours > 0;
                        const progress = isMining ? Math.round(((24 - session.remainingHours) / 24) * 100) : 0;

                        return (
                          <TableRow key={index} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                            <TableCell>
                              <Box>
                                <Typography variant="body2" fontWeight={600}>
                                  {miningCollege.college.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {isMining ? t('user.miningActive') : t('user.notMining')}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="center">
                              <Tooltip title={isMining ? t('user.stopMining') : t('user.startMining')} arrow>
                                <span>
                                  <Button
                                    variant="contained"
                                    size="small"
                                    startIcon={isMining ? <Stop fontSize="small" /> : <PlayArrow fontSize="small" />}
                                    onClick={() => isMining ? handleStopMining(miningCollege.college._id) : handleStartMining(miningCollege.college._id)}
                                    disabled={actionLoading === `start-${miningCollege.college._id}` || actionLoading === `stop-${miningCollege.college._id}`}
                                    sx={{
                                      background: isMining
                                        ? 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)'
                                        : 'linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%)',
                                      color: 'white',
                                      fontWeight: 600,
                                      fontSize: '0.7rem',
                                      py: 0.5,
                                      px: 1.5,
                                      textTransform: 'none',
                                      '&:hover': {
                                        background: isMining
                                          ? 'linear-gradient(135deg, #b91c1c 0%, #dc2626 100%)'
                                          : 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)',
                                      },
                                      '&:disabled': {
                                        background: '#e5e7eb',
                                        color: '#9ca3af'
                                      }
                                    }}
                                  >
                                    {actionLoading === `start-${miningCollege.college._id}` || actionLoading === `stop-${miningCollege.college._id}`
                                      ? <CircularProgress size={16} sx={{ color: 'white' }} />
                                      : isMining ? t('user.stop') : t('user.start')
                                    }
                                  </Button>
                                </span>
                              </Tooltip>
                            </TableCell>
                            <TableCell align="right">
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                                <Box
                                  sx={{
                                    width: 60,
                                    height: 6,
                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                    borderRadius: 1,
                                    overflow: 'hidden'
                                  }}
                                >
                                  <Box
                                    sx={{
                                      width: `${progress}%`,
                                      height: '100%',
                                      bgcolor: isMining ? 'success.main' : 'grey.400',
                                      transition: 'width 0.3s ease'
                                    }}
                                  />
                                </Box>
                                <Typography variant="caption" fontWeight={600} sx={{ minWidth: 35 }}>
                                  {progress}%
                                </Typography>
                              </Box>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                            {t('user.noCollegesAdded')}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          {/* Crypto Wallet */}
          <Card sx={{
            flex: { xs: '100%', md: 'calc(50% - 8px)' },
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            overflow: 'hidden',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
            }
          }}>
            <CardContent sx={{ p: 3, pt: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
                  }}>
                    <AccountBalanceWallet sx={{ color: 'white', fontSize: 20 }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'white', lineHeight: 1.2 }}>
                      {t('user.tokenWallet')}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                      {t('user.multiCollegePortfolio')}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Total Balance Display */}
              <Box sx={{
                mt: 3,
                mb: 3,
                p: 2.5,
                borderRadius: 2,
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                border: '1px solid rgba(102, 126, 234, 0.2)'
              }}>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', display: 'block', mb: 1 }}>
                  {t('user.totalPortfolioValue')}
                </Typography>
                <Typography variant="h4" sx={{
                  fontWeight: 700,
                  color: 'white',
                  fontFamily: 'Monaco, Courier, monospace',
                  letterSpacing: '-0.5px'
                }}>
                  {totalBalance.toFixed(4)} <Typography component="span" variant="h6" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>{t('user.tokens')}</Typography>
                </Typography>
              </Box>

              {/* Token Holdings */}
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', display: 'block', mb: 2, textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
                {t('user.holdings')}
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {filteredWallets && filteredWallets.length > 0 ? (
                  <>
                    {filteredWallets.sort((a, b) => {
                      const sessionA = a.college ? miningStatus[a.college._id] : null;
                      const sessionB = b.college ? miningStatus[b.college._id] : null;
                      const isMiningA = sessionA?.isActive && sessionA?.remainingHours > 0;
                      const isMiningB = sessionB?.isActive && sessionB?.remainingHours > 0;

                      if (isMiningA && !isMiningB) return -1;
                      if (!isMiningA && isMiningB) return 1;
                      return (b.balance || 0) - (a.balance || 0);
                    }).map((wallet, index) => {
                      const percentage = totalBalance > 0 ? ((wallet.balance / totalBalance) * 100) : 0;
                      const session = wallet.college ? miningStatus[wallet.college._id] : null;
                      const isMining = session?.isActive && session?.remainingHours > 0;

                      return (
                        <Box
                          key={index}
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            background: isMining
                              ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(34, 211, 238, 0.15) 100%)'
                              : 'rgba(30, 41, 59, 0.5)',
                            border: isMining
                              ? '1px solid rgba(34, 211, 238, 0.3)'
                              : '1px solid rgba(71, 85, 105, 0.3)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              background: isMining
                                ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(34, 211, 238, 0.2) 100%)'
                                : 'rgba(30, 41, 59, 0.7)',
                              transform: 'translateX(4px)'
                            }
                          }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Box sx={{
                                width: 32,
                                height: 32,
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '2px solid rgba(139, 92, 246, 0.3)'
                              }}>
                                <School sx={{ color: 'white', fontSize: 16 }} />
                              </Box>
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 700, color: 'white', lineHeight: 1.2 }}>
                                  {wallet.college?.name || 'Unknown'}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
                                  {isMining && (
                                    <Circle sx={{
                                      fontSize: 8,
                                      color: '#22d3ee',
                                      animation: 'pulse 2s ease-in-out infinite',
                                      '@keyframes pulse': {
                                        '0%, 100%': { opacity: 1 },
                                        '50%': { opacity: 0.5 }
                                      }
                                    }} />
                                  )}
                                  <Typography variant="caption" sx={{ color: isMining ? '#22d3ee' : 'rgba(255,255,255,0.5)', fontSize: '0.65rem' }}>
                                    {isMining ? t('user.miningActiveStatus') : t('user.inactive')} • {wallet.college?.country || '-'}
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                            <Box sx={{ textAlign: 'right' }}>
                              <Typography variant="body1" sx={{
                                fontWeight: 700,
                                color: 'white',
                                fontFamily: 'Monaco, Courier, monospace',
                                fontSize: '0.95rem'
                              }}>
                                {wallet.balance.toFixed(4)}
                              </Typography>
                              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                                {percentage.toFixed(1)}%
                              </Typography>
                            </Box>
                          </Box>

                          {/* Progress Bar */}
                          <Box sx={{
                            height: 4,
                            background: 'rgba(15, 23, 42, 0.8)',
                            borderRadius: 2,
                            overflow: 'hidden',
                            position: 'relative'
                          }}>
                            <Box sx={{
                              height: '100%',
                              width: `${percentage}%`,
                              background: isMining
                                ? 'linear-gradient(90deg, #06b6d4, #22d3ee)'
                                : 'linear-gradient(90deg, #8b5cf6, #ec4899)',
                              transition: 'width 0.5s ease',
                              boxShadow: isMining ? '0 0 8px rgba(34, 211, 238, 0.5)' : '0 0 8px rgba(139, 92, 246, 0.5)'
                            }} />
                          </Box>
                        </Box>
                      );
                    })}
                  </>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <AccountBalanceWallet sx={{ fontSize: 48, color: 'rgba(255,255,255,0.2)', mb: 1 }} />
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                      {t('user.noBalanceData')}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                      {t('user.startMiningToEarn')}
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>

          
        </Box>

      </Box>

      {tourActive && (
        <>
          <WelcomeDialog
            open={tourStep === 'welcome'}
            onNext={nextStep}
            userName={dashboard?.user?.name || 'User'}
            isMobile={isMobileTour}
          />

          {isMobileTour ? (
            <GuidedTour targetElement="[data-tour='view-colleges-mobile-button']" step="navigate-mobile" />
          ) : (
            <GuidedTour targetElement="[data-tour='colleges-nav-link']" step="navigate" />
          )}
        </>
      )}
    </DashboardLayout>
  );
};

export default Overview;
