import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,

  IconButton,
  Paper,
  useTheme,
  useMediaQuery,
  ToggleButtonGroup,
  ToggleButton,
  Avatar,
  Tooltip,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import {
  School,
  PlayArrow,
  Stop,
  Add,
  ContentCopy,
  CheckCircle,
  Close,

  Share,
  Speed,
  Groups,
  Schedule,
  Delete,
  DeleteOutline,
  RemoveCircleOutline,
  Visibility
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useMiningWebSocket } from '../../hooks/useMiningWebSocket';
import { useToast } from '../../contexts/ToastContext';
import { userApi } from '../../api/user.api';
import { miningApi } from '../../api/mining.api';
import { bridgeApi } from '../../api/bridge.api';

import DashboardLayout from '../../layouts/DashboardLayout';
import MiningManagedBanner from '../../components/bridge/MiningManagedBanner';
import MigrationCountdownBanner from '../../components/bridge/MigrationCountdownBanner';
import ShareDialog from '../../components/ShareDialog';
import GuidedTour, { SuccessDialog } from '../../components/GuidedTour';
import { useTour } from '../../contexts/TourContext';
import { useTranslation } from 'react-i18next';

const MyColleges = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery('(max-width:1200px)');
  const showButtonIcons = useMediaQuery('(min-width:600px)');
  const { user } = useAuth();
  const { t } = useTranslation();
  const { showToast } = useToast();
  const { miningStatus: wsMiningStatus } = useMiningWebSocket();
  const { tourActive, tourStep, nextStep, completeTour, isMobileTour } = useTour();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [miningStatus, setMiningStatus] = useState({});

  const [actionLoading, setActionLoading] = useState('');
  const [copiedCollegeReferral, setCopiedCollegeReferral] = useState(null);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareDialogData, setShareDialogData] = useState(null);
  const [deleteMode, setDeleteMode] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [collegeToDelete, setCollegeToDelete] = useState(null);
  const [deleteConfirmChecked, setDeleteConfirmChecked] = useState(false);
  const [bridgeStatus, setBridgeStatus] = useState(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await userApi.getDashboard();
      console.log('Dashboard API Response:', response);
      if (response.success) {
        console.log('Dashboard Data:', response.data);
        setDashboard(response.data);
      }
    } catch (err) {
      console.error('Dashboard Error:', err);
      setError(err.message || t('user.failedToLoadDashboard'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (wsMiningStatus) {
      const statusMap = {};
      wsMiningStatus.activeSessions?.forEach(session => {
        if (session.college) {
          statusMap[session.college._id] = session;
        }
      });
      setMiningStatus(statusMap);

      // Only update activeSessions, NOT miningColleges or wallets
      // This prevents WebSocket from overwriting user actions (add/delete)
      setDashboard(prev => ({
        ...prev,
        activeSessions: wsMiningStatus.activeSessions
      }));
    }
  }, [wsMiningStatus]);

  useEffect(() => {
    if (!user || user.role !== 'user') {
      navigate('/auth/login');
      return;
    }

    fetchDashboard();

    bridgeApi.getStatus().then(res => {
      if (res.success) setBridgeStatus(res.data);
    }).catch(() => {});
  }, [user, navigate]);

  const handleConnectExchange = useCallback(async () => {
    try {
      const response = await bridgeApi.initiateLink();
      if (response.success && response.data?.authorizeUrl) {
        window.location.href = response.data.authorizeUrl;
      }
    } catch (err) {
      showToast(err.message || 'Failed to initiate connection', 'error');
    }
  }, [showToast]);

  // Initialize miningStatus from API data to avoid race condition with WebSocket
  // This ensures correct button state is shown immediately on page load
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

  // Auto-advance tour if already mining or no colleges
  useEffect(() => {
    if (tourActive && tourStep === 'mining' && !loading && dashboard?.miningColleges) {
      const validColleges = dashboard.miningColleges.filter(mc => mc.college);
      
      // Check if all valid colleges are currently mining
      const allMining = validColleges.length > 0 && validColleges.every(mc => {
        const session = miningStatus[mc.college._id];
        return session && session.isActive && session.remainingHours > 0;
      });

      // If no colleges (nothing to mine) or all are already mining, auto-advance
      if (validColleges.length === 0 || allMining) {
        const timer = setTimeout(() => {
          nextStep();
        }, 1000); // Small delay to ensure user sees the transition
        return () => clearTimeout(timer);
      }
    }
  }, [tourActive, tourStep, loading, dashboard, miningStatus, nextStep]);

  const handleStartMining = async (collegeId) => {
    try {
      setActionLoading(`start-${collegeId}`);
      const response = await miningApi.startMining(collegeId);
      if (response.success) {
        showToast(t('user.miningStartedSuccess'), 'success');
        fetchDashboard();

        if (tourActive && tourStep === 'mining') {
          nextStep();
        }
      }
    } catch (err) {
      console.error('Failed to start mining:', err);
      showToast(err.message || t('user.failedToStartMining'), 'error');
    } finally {
      setActionLoading('');
    }
  };

  const handleStopMining = async (collegeId) => {
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
  };

  const handleToggleAllMining = useCallback(async () => {
    try {
      // Check if all colleges are currently mining
      const allMining = dashboard?.miningColleges?.length > 0 && dashboard?.miningColleges?.every(mc => {
        const session = miningStatus[mc.college._id];
        return session && session.isActive && session.remainingHours > 0;
      });

      if (allMining) {
        // Stop All
        setActionLoading('stop-all');
        const response = await miningApi.stopAllMining();
        if (response.success) {
          showToast(response.message, 'success');
          fetchDashboard();
        }
      } else {
        // Start All (Mine All)
        setActionLoading('mine-all');
        const response = await miningApi.startAllMining();
        if (response.success) {
          showToast(response.message, 'success');
          fetchDashboard();
        }
      }
    } catch (err) {
      console.error('Failed to toggle all mining:', err);
      showToast(err.message || 'Failed to toggle mining', 'error');
    } finally {
      setActionLoading('');
    }
  }, [dashboard, miningStatus, showToast]);

  const handleCompleteTour = async () => {
    try {
      await userApi.completeOnboarding();
      completeTour();
      navigate('/user/dashboard');
    } catch (err) {
      console.error('Failed to complete onboarding:', err);
    }
  };

  const handleSetPrimaryCollege = async (collegeId) => {
    try {
      setActionLoading(`primary-${collegeId}`);
      const response = await userApi.setPrimaryCollege(collegeId);
      if (response.success) {
        fetchDashboard();
        showToast(t('user.primaryCollegeUpdated'), 'success');
      }
    } catch (err) {
      console.error('Failed to set primary college:', err);
      showToast(err.message || t('user.failedToSetPrimaryCollege'), 'error');
    } finally {
      setActionLoading('');
    }
  };



  const copyCollegeReferralLink = useCallback((collegeId) => {
    if (dashboard?.user?.referralCode) {
      const baseUrl = window.location.origin;
      const referralLink = `${baseUrl}/auth/register/user?ref=${dashboard.user.referralCode}&college=${collegeId}`;
      navigator.clipboard.writeText(referralLink);
      setCopiedCollegeReferral(collegeId);
      setTimeout(() => setCopiedCollegeReferral(null), 2000);
    }
  }, [dashboard?.user?.referralCode]);

  const handleShareCollege = useCallback((college) => {
    const wallet = dashboard?.wallets?.find(w => w.college && w.college._id === college._id);
    const baseUrl = window.location.origin;

    setShareDialogData({
      collegeName: college.name,
      collegeLogo: college.logo,
      balance: wallet?.balance || 0,
      isGeneral: false,
      text: `I'm building my portfolio on Coins For College with ${college.name}. Join me!`,
      url: `${baseUrl}/auth/register/user?ref=${dashboard?.user?.referralCode}&college=${college._id}`
    });
    setShowShareDialog(true);
  }, [dashboard]);

  const handleToggleDeleteMode = () => {
    setDeleteMode(!deleteMode);
  };

  const handleDeleteCollegeClick = (college) => {
    const wallet = dashboard?.wallets?.find(w => w.college && w.college._id === college._id);
    setCollegeToDelete({ ...college, balance: wallet?.balance || 0 });
    setShowDeleteDialog(true);
    setDeleteConfirmChecked(false);
  };

  const handleCloseDeleteDialog = () => {
    setShowDeleteDialog(false);
    setCollegeToDelete(null);
    setDeleteConfirmChecked(false);
  };

  const handleConfirmDelete = async () => {
    if (!collegeToDelete || !deleteConfirmChecked) return;

    try {
      setActionLoading(`delete-${collegeToDelete._id}`);

      const session = miningStatus[collegeToDelete._id];
      const isActive = session && session.isActive && session.remainingHours > 0;

      if (isActive) {
        await miningApi.stopMining(collegeToDelete._id);
      }

      const response = await userApi.removeCollege(collegeToDelete._id);

      if (response.success) {
        showToast(t('user.collegeRemovedSuccess'), 'success');
        fetchDashboard();
        handleCloseDeleteDialog();
        setDeleteMode(false);
      }
    } catch (err) {
      console.error('Failed to remove college:', err);
      showToast(err.message || t('user.failedToRemoveCollege'), 'error');
    } finally {
      setActionLoading('');
    }
  };

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
      searchPlaceholder="Search colleges..."
    >
      <Box sx={{ maxWidth: '1200px', width: '100%', mx: 'auto' }}>
        {/* Header with Title/Tagline and Stats */}
        <Box sx={{ mb: 4, mt: 4, display: 'flex', width: '100%', flexDirection: 'column', alignItems: 'flex-start' }}>
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', textAlign: 'left' }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
              {t('user.myColleges')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('user.myCollegesDesc')}
            </Typography>
          </Box>
        </Box>

        <MigrationCountdownBanner
          bridgeStatus={bridgeStatus}
          onConnectClick={handleConnectExchange}
          onMigrateClick={() => navigate('/user/dashboard?scrollTo=migrate')}
        />

        {bridgeStatus?.migrated ? (
          <>
            <MiningManagedBanner />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
              Your colleges and balances have been transferred. After the cutoff date, mining will be permanently removed from Coins for College.
            </Typography>
          </>
        ) : (
        <>
        {/* Active Colleges Header */}
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: '0.875rem', sm: '1.25rem' } }}>
            {t('user.activeColleges')} ({dashboard?.miningColleges.filter(mc => mc.college).length}/10)
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {dashboard?.miningColleges?.length > 0 && (
              (() => {
                const allMining = dashboard?.miningColleges?.every(mc => {
                   const session = miningStatus[mc.college._id];
                   return session && session.isActive && session.remainingHours > 0;
                });
                
                return (
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={allMining ? <Stop /> : <PlayArrow />}
                    onClick={handleToggleAllMining}
                    disabled={actionLoading === 'mine-all' || actionLoading === 'stop-all'}
                    sx={{
                      background: allMining 
                        ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                        : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: 'white',
                      fontWeight: 600,
                      px: { xs: 1.5, sm: 2 },
                      py: { xs: 0.5, sm: 1 },
                      fontSize: { xs: '0.65rem', sm: '0.875rem' },
                      textTransform: 'none',
                      minWidth: 'auto',
                      '& .MuiButton-startIcon': {
                        marginRight: { xs: 0.25, sm: 1 },
                        '& > svg': {
                          fontSize: { xs: '0.875rem', sm: '1.25rem' }
                        }
                      },
                      '&:hover': {
                        background: allMining
                          ? 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'
                          : 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                      },
                      '&.Mui-disabled': {
                        background: '#e2e8f0',
                        color: '#94a3b8'
                      }
                    }}
                  >
                    {allMining ? 'Stop All' : 'Mine All'}
                  </Button>
                );
              })()
            )}
            {dashboard?.miningColleges.filter(mc => mc.college).length > 0 && (
              <Button
                variant={deleteMode ? 'contained' : 'outlined'}
                startIcon={showButtonIcons ? (deleteMode ? <Close /> : <RemoveCircleOutline />) : null}
                onClick={handleToggleDeleteMode}
                sx={{
                  background: deleteMode ? 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)' : 'transparent',
                  borderColor: deleteMode ? 'transparent' : '#dc2626',
                  color: deleteMode ? 'white' : '#dc2626',
                  borderRadius: 2,
                  boxShadow: deleteMode ? '0 2px 12px rgba(220, 38, 38, 0.4)' : 'none',
                  fontWeight: 600,
                  px: { xs: 1.5, sm: 2 },
                  py: { xs: 0.5, sm: 1 },
                  fontSize: { xs: '0.65rem', sm: '0.875rem' },
                  transition: 'all 0.2s',
                  minWidth: 'auto',
                  '& .MuiButton-startIcon': {
                    marginRight: { xs: 0.25, sm: 1 },
                    '& > svg': {
                      fontSize: { xs: '0.875rem', sm: '1.25rem' }
                    }
                  },
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    background: deleteMode ? 'linear-gradient(135deg, #b91c1c 0%, #dc2626 100%)' : 'rgba(220, 38, 38, 0.1)',
                    borderColor: '#dc2626',
                    boxShadow: deleteMode ? '0 4px 16px rgba(220, 38, 38, 0.5)' : 'none'
                  }
                }}
              >
                {deleteMode ? t('user.cancel') : t('user.removeCollege')}
              </Button>
            )}
            {dashboard?.miningColleges.filter(mc => mc.college).length < 10 && (
              <Button
                variant="contained"
                startIcon={showButtonIcons ? <Add /> : null}
                onClick={() => navigate('/auth/college-selection', { state: { fromDashboard: true } })}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: 2,
                  boxShadow: '0 2px 12px rgba(102, 126, 234, 0.4)',
                  fontWeight: 600,
                  px: { xs: 1.5, sm: 2 },
                  py: { xs: 0.5, sm: 1 },
                  fontSize: { xs: '0.65rem', sm: '0.875rem' },
                  transition: 'all 0.2s',
                  minWidth: 'auto',
                  '& .MuiButton-startIcon': {
                    marginRight: { xs: 0.25, sm: 1 },
                    '& > svg': {
                      fontSize: { xs: '0.875rem', sm: '1.25rem' }
                    }
                  },
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 16px rgba(102, 126, 234, 0.5)'
                  }
                }}
              >
                {t('user.addCollege')}
              </Button>
            )}
          </Box>
        </Box>

        {/* College Cards Grid */}
        <Box sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
          },
          '@media (min-width: 800px)': {
            gridTemplateColumns: 'repeat(3, 1fr)',
          },
          '@media (min-width: 1300px)': {
            gridTemplateColumns: 'repeat(4, 1fr)',
          }
        }}>
          {dashboard?.miningColleges?.filter(mc => mc.college).sort((a, b) => {
            const sessionA = miningStatus[a.college._id];
            const sessionB = miningStatus[b.college._id];
            const isMiningA = sessionA?.isActive && sessionA?.remainingHours > 0;
            const isMiningB = sessionB?.isActive && sessionB?.remainingHours > 0;

            if (isMiningA && !isMiningB) return -1;
            if (!isMiningA && isMiningB) return 1;
            return 0;
          }).map((mc, index) => {
            const session = miningStatus[mc.college._id];
            const wallet = dashboard?.wallets?.find(w => w.college && w.college._id === mc.college._id);
            const isActive = session && session.isActive && session.remainingHours > 0;
            const progress = isActive ? ((24 - session.remainingHours) / 24) * 100 : 0;

            const baseRate = mc.college.baseRate || 0.25;
            const referralBonusRate = mc.college.referralBonusRate || 0.1;
            const REFERRAL_LIMIT_PER_COLLEGE = 10;
            const currentReferralsCount = mc.referredUsers?.length || 0;
            const cappedReferralsCount = Math.min(currentReferralsCount, REFERRAL_LIMIT_PER_COLLEGE);

            const effectiveReferralsForRate = isActive && session.earningRate
              ? Math.round((session.earningRate - baseRate) / referralBonusRate)
              : cappedReferralsCount;

            const userEarningRate = isActive ? session.earningRate : (baseRate + (cappedReferralsCount * referralBonusRate));

            return (
              <Card
                key={mc.college._id}
                sx={{
                  height: 420,
                  background: isActive
                    ? 'linear-gradient(145deg, #0f172a 0%, #1e293b 100%)'
                    : 'linear-gradient(145deg, #1e293b 0%, #334155 100%)',
                  borderRadius: 2,
                  position: 'relative',
                  overflow: 'hidden',
                  border: deleteMode
                    ? '2px solid rgba(220, 38, 38, 0.5)'
                    : (isActive ? '1px solid rgba(34, 211, 238, 0.3)' : '1px solid rgba(71, 85, 105, 0.3)'),
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: deleteMode
                      ? '0 20px 40px rgba(220, 38, 38, 0.4)'
                      : (isActive
                        ? '0 20px 40px rgba(34, 211, 238, 0.3)'
                        : '0 20px 40px rgba(0, 0, 0, 0.5)'),
                    border: deleteMode
                      ? '2px solid rgba(220, 38, 38, 0.7)'
                      : (isActive ? '1px solid rgba(34, 211, 238, 0.5)' : '1px solid rgba(71, 85, 105, 0.5)')
                  },
                  ...(isActive && !deleteMode && {
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '200%',
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(34, 211, 238, 0.1), transparent)',
                      animation: 'scan 3s linear infinite',
                    },
                    '@keyframes scan': {
                      '0%': { left: '-100%' },
                      '100%': { left: '100%' }
                    }
                  })
                }}
              >
                {deleteMode && (
                  <IconButton
                    onClick={() => handleDeleteCollegeClick(mc.college)}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      zIndex: 10,
                      background: 'rgba(220, 38, 38, 0.9)',
                      color: 'white',
                      width: 40,
                      height: 40,
                      '&:hover': {
                        background: 'rgba(185, 28, 28, 1)',
                        transform: 'scale(1.1)'
                      }
                    }}
                  >
                    <DeleteOutline />
                  </IconButton>
                )}
                {/* Header Section */}
                <Box sx={{
                  p: 2,
                  borderBottom: '1px solid rgba(71, 85, 105, 0.3)',
                  position: 'relative',
                  zIndex: 1,
                  minHeight: 100
                }}>
                  {/* Status Indicator */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: isActive ? '#22d3ee' : '#64748b',
                        boxShadow: isActive ? '0 0 10px #22d3ee' : 'none',
                        animation: isActive ? 'pulse 2s infinite' : 'none',
                        '@keyframes pulse': {
                          '0%, 100%': { opacity: 1 },
                          '50%': { opacity: 0.5 }
                        }
                      }} />
                      <Typography
                        variant="caption"
                        sx={{
                          color: isActive ? '#22d3ee' : '#64748b',
                          fontWeight: 700,
                          fontSize: '0.65rem',
                          letterSpacing: '0.05em',
                          textTransform: 'uppercase',
                          fontFamily: 'Monaco, monospace'
                        }}
                      >
                        {isActive ? t('user.mining') : t('user.offline')}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      {dashboard?.user.college?._id === mc.college._id ? (
                        <Chip
                          label={t('user.primary')}
                          size="small"
                          sx={{
                            height: 18,
                            background: 'rgba(34, 197, 94, 0.2)',
                            border: '1px solid rgba(34, 197, 94, 0.5)',
                            color: '#22c55e',
                            fontSize: '0.6rem',
                            fontWeight: 700,
                            '& .MuiChip-label': { px: 0.75 }
                          }}
                        />
                      ) : (
                        <Chip
                          label={t('user.setPrimary')}
                          size="small"
                          onClick={() => handleSetPrimaryCollege(mc.college._id)}
                          disabled={actionLoading === `primary-${mc.college._id}`}
                          sx={{
                            height: 18,
                            background: 'rgba(100, 116, 139, 0.2)',
                            border: '1px solid rgba(100, 116, 139, 0.4)',
                            color: '#94a3b8',
                            fontSize: '0.6rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            '& .MuiChip-label': { px: 0.75 },
                            '&:hover': {
                              background: 'rgba(148, 163, 184, 0.3)',
                              border: '1px solid rgba(148, 163, 184, 0.6)',
                              color: '#cbd5e1'
                            },
                            '&.Mui-disabled': {
                              opacity: 0.5,
                              cursor: 'not-allowed'
                            }
                          }}
                        />
                      )}
                      <Tooltip title={t('user.shareCollegeTooltip')} arrow>
                        <Chip
                          label={t('user.share')}
                          size="small"
                          icon={<Share sx={{ fontSize: '0.8rem' }} />}
                          onClick={() => handleShareCollege(mc.college)}
                          sx={{
                            height: 18,
                            background: 'rgba(139, 92, 246, 0.2)',
                            border: '1px solid rgba(139, 92, 246, 0.5)',
                            color: '#a78bfa',
                            fontSize: '0.6rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            '& .MuiChip-label': { px: 0.75 },
                            '& .MuiChip-icon': {
                              color: '#a78bfa',
                              marginLeft: '4px',
                              marginRight: '-4px'
                            },
                            '&:hover': {
                              background: 'rgba(139, 92, 246, 0.3)',
                              border: '1px solid rgba(139, 92, 246, 0.6)',
                            }
                          }}
                        />
                      </Tooltip>
                    </Box>
                  </Box>

                  {/* College Name */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: '#f1f5f9',
                        fontSize: '0.95rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {mc.college.name}
                    </Typography>
                    <Chip
                      label={mc.college.status || 'Unaffiliated'}
                      size="small"
                      sx={{
                        height: 16,
                        fontSize: '0.55rem',
                        fontWeight: 700,
                        background: mc.college.status === 'Live' 
                          ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                          : mc.college.status === 'Building'
                          ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                          : mc.college.status === 'Waitlist'
                          ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
                          : 'rgba(100, 116, 139, 0.3)',
                        color: '#fff',
                        border: 'none',
                        '& .MuiChip-label': { px: 1, py: 0 }
                      }}
                    />
                  </Box>

                  <Typography
                    variant="caption"
                    sx={{
                      color: '#94a3b8',
                      fontSize: '0.7rem',
                      display: 'block',
                      mb: 1
                    }}
                  >
                    {mc.college.country}
                  </Typography>

                  {/* Rates */}
                  <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
                    <Tooltip
                      title={t('user.earningRateTooltip', {
                        baseRate: baseRate,
                        bonusRate: (effectiveReferralsForRate * referralBonusRate).toFixed(2),
                        cappedCount: cappedReferralsCount,
                        totalCount: currentReferralsCount,
                        restart: isActive && cappedReferralsCount > effectiveReferralsForRate ? t('user.restartMiningToApply') : ''
                      })}
                      arrow
                      placement="top"
                    >
                      <Chip
                        label={`${userEarningRate.toFixed(2)} ${t('user.tokenPerHr')}`}
                        size="small"
                        sx={{
                          height: 18,
                          background: 'rgba(52, 211, 153, 0.15)',
                          border: '1px solid rgba(52, 211, 153, 0.3)',
                          color: '#34d399',
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          '& .MuiChip-label': { px: 0.75 },
                          cursor: 'help'
                        }}
                      />
                    </Tooltip>
                    {currentReferralsCount > 0 && (
                      <Tooltip
                        title={t('user.referralsTooltip', {
                          count: currentReferralsCount,
                          cappedCount: cappedReferralsCount,
                          plural: currentReferralsCount > 1 ? 's' : '',
                          active: isActive && cappedReferralsCount > effectiveReferralsForRate ? t('user.referralActive', { effectiveCount: effectiveReferralsForRate }) : ''
                        })}
                        arrow
                        placement="top"
                      >
                        <Chip
                          label={`${cappedReferralsCount}/10 REF${currentReferralsCount > REFERRAL_LIMIT_PER_COLLEGE ? ' (max)' : ''}`}
                          size="small"
                          sx={{
                            height: 18,
                            background: currentReferralsCount >= REFERRAL_LIMIT_PER_COLLEGE 
                              ? 'rgba(251, 191, 36, 0.15)' 
                              : 'rgba(96, 165, 250, 0.15)',
                            border: currentReferralsCount >= REFERRAL_LIMIT_PER_COLLEGE
                              ? '1px solid rgba(251, 191, 36, 0.3)'
                              : '1px solid rgba(96, 165, 250, 0.3)',
                            color: currentReferralsCount >= REFERRAL_LIMIT_PER_COLLEGE 
                              ? '#fbbf24' 
                              : '#60a5fa',
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            '& .MuiChip-label': { px: 0.75 },
                            cursor: 'help'
                          }}
                        />
                      </Tooltip>
                    )}
                  </Box>
                </Box>

                {/* Mining Progress Section */}
                <Box sx={{
                  p: 2,
                  borderBottom: '1px solid rgba(71, 85, 105, 0.3)',
                  height: 120,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  position: 'relative',
                  zIndex: 1
                }}>
                  {isActive ? (
                    <>
                      <Box sx={{ mb: 1.5, mt: 0.5 }}>
                        <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.65rem', mb: 0.75, display: 'block' }}>
                          {t('user.currentYield')}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                          <Typography variant="h5" sx={{
                            color: '#22d3ee',
                            fontWeight: 700,
                            fontFamily: 'Monaco, monospace',
                            fontSize: '1.5rem'
                          }}>
                            {session.currentTokens.toFixed(4)}
                          </Typography>
                          <Typography variant="caption" sx={{
                            color: '#64748b',
                            fontSize: '0.65rem',
                            fontWeight: 700
                          }}>
                            @ {userEarningRate.toFixed(2)} {t('user.tokenPerHr')}
                          </Typography>
                        </Box>
                      </Box>

                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.65rem' }}>
                            {t('user.progressLabel')}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#22d3ee', fontSize: '0.65rem', fontWeight: 700 }}>
                            {session.remainingHours.toFixed(1)}H {t('user.leftShort')}
                          </Typography>
                        </Box>
                        <Box sx={{
                          height: 6,
                          background: 'rgba(15, 23, 42, 0.8)',
                          border: '1px solid rgba(34, 211, 238, 0.2)',
                          borderRadius: 3,
                          overflow: 'hidden',
                          position: 'relative'
                        }}>
                          <Box sx={{
                            height: '100%',
                            width: `${progress}%`,
                            background: 'linear-gradient(90deg, #06b6d4, #22d3ee, #06b6d4)',
                            backgroundSize: '200% 100%',
                            animation: 'gradient 2s ease infinite',
                            boxShadow: '0 0 10px rgba(34, 211, 238, 0.5)',
                            '@keyframes gradient': {
                              '0%': { backgroundPosition: '0% 50%' },
                              '50%': { backgroundPosition: '100% 50%' },
                              '100%': { backgroundPosition: '0% 50%' }
                            }
                          }} />
                        </Box>
                      </Box>
                    </>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 2 }}>
                      <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem' }}>
                        {t('user.miningOffline')}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#475569', mt: 1, fontSize: '0.7rem' }}>
                        {t('user.startMiningToEarnTokens')}
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* Balance Section */}
                <Box sx={{
                  p: 2,
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  position: 'relative',
                  zIndex: 1
                }}>
                  <Box sx={{
                    background: isActive
                      ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(34, 211, 238, 0.15) 100%)'
                      : 'rgba(15, 23, 42, 0.5)',
                    border: isActive ? '1px solid rgba(34, 211, 238, 0.3)' : '1px solid rgba(71, 85, 105, 0.3)',
                    borderRadius: 1.5,
                    p: 1.5,
                    mb: 1.5
                  }}>
                    <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.65rem', mb: 0.5, display: 'block' }}>
                      {isActive ? t('user.totalValue') : t('user.walletBalance')}
                    </Typography>
                    <Typography variant="h6" sx={{
                      color: isActive ? '#22d3ee' : '#f1f5f9',
                      fontWeight: 700,
                      fontFamily: 'Monaco, monospace',
                      fontSize: '1.1rem'
                    }}>
                      {isActive
                        ? ((wallet?.balance || 0) + session.currentTokens).toFixed(4)
                        : (wallet?.balance.toFixed(4) || '0.0000')
                      }
                    </Typography>
                    {isActive && (
                      <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.6rem', display: 'block', mt: 0.5 }}>
                        {t('user.wallet')}: {wallet?.balance.toFixed(4) || '0.0000'} + Mining: {session.currentTokens.toFixed(4)}
                      </Typography>
                    )}
                  </Box>

                  {/* Action Buttons */}
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={isActive ? <Stop /> : <PlayArrow />}
                      data-tour={tourActive && tourStep === 'mining' && !isActive ? 'start-mining-button' : undefined}
                      onClick={() => isActive ? handleStopMining(mc.college._id) : handleStartMining(mc.college._id)}
                      disabled={actionLoading === `start-${mc.college._id}` || actionLoading === `stop-${mc.college._id}`}
                      sx={{
                        background: isActive
                          ? 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)'
                          : 'linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%)',
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        py: 1.25,
                        borderRadius: 1.5,
                        border: isActive
                          ? '1px solid rgba(239, 68, 68, 0.5)'
                          : '1px solid rgba(34, 211, 238, 0.5)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        boxShadow: isActive
                          ? '0 4px 20px rgba(239, 68, 68, 0.4)'
                          : '0 4px 20px rgba(34, 211, 238, 0.4)',
                        '&:hover': {
                          background: isActive
                            ? 'linear-gradient(135deg, #b91c1c 0%, #dc2626 100%)'
                            : 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)',
                          boxShadow: isActive
                            ? '0 6px 25px rgba(239, 68, 68, 0.5)'
                            : '0 6px 25px rgba(34, 211, 238, 0.5)',
                        },
                        '&:disabled': {
                          background: 'rgba(71, 85, 105, 0.3)',
                          color: '#64748b'
                        }
                      }}
                    >
                      {actionLoading === `start-${mc.college._id}` || actionLoading === `stop-${mc.college._id}`
                        ? <CircularProgress size={20} sx={{ color: 'white' }} />
                        : isActive ? t('user.stop') : t('user.start')
                      }
                    </Button>

                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Visibility />}
                      onClick={() => window.open(`/colleges/${mc.college._id}`, '_blank')}
                      sx={{
                        color: '#94a3b8',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        py: 1.25,
                        borderRadius: 1.5,
                        border: '1px solid rgba(148, 163, 184, 0.5)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        '&:hover': {
                          background: 'rgba(148, 163, 184, 0.1)',
                          border: '1px solid rgba(148, 163, 184, 0.7)',
                          color: '#cbd5e1'
                        }
                      }}
                    >
                      {t('user.view')}
                    </Button>
                  </Box>
                </Box>
              </Card>
            );
          })}
        </Box>

        </>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={showDeleteDialog}
          onClose={handleCloseDeleteDialog}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
            }
          }}
        >
          <DialogTitle
            sx={{
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              py: 2.5,
              px: 3
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#dc2626' }}>
              {t('user.removeCollegeTitle')}
            </Typography>
            <IconButton onClick={handleCloseDeleteDialog} size="small">
              <Close />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ py: 4, px: 3 }}>
            <Box sx={{ mb: 3, textAlign: 'center' }}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: 'rgba(220, 38, 38, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2
                }}
              >
                <Delete sx={{ fontSize: 32, color: '#dc2626' }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 1 }}>
                {t('user.areYouSure')}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                dangerouslySetInnerHTML={{
                  __html: t('user.removeCollegeMessage', { name: collegeToDelete?.name || '' })
                }}
              />
            </Box>

            <Alert severity="warning" sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                {t('user.warningBalanceLost')}
              </Typography>
              <Typography
                variant="body2"
                dangerouslySetInnerHTML={{
                  __html: t('user.balanceLostMessage', { balance: collegeToDelete?.balance?.toFixed(4) || '0.0000' })
                }}
              />
            </Alert>

            <FormControlLabel
              control={
                <Checkbox
                  checked={deleteConfirmChecked}
                  onChange={(e) => setDeleteConfirmChecked(e.target.checked)}
                  sx={{
                    color: '#dc2626',
                    '&.Mui-checked': {
                      color: '#dc2626'
                    }
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ color: '#475569' }}>
                  {t('user.understandBalanceLost')}
                </Typography>
              }
            />
          </DialogContent>

          <DialogActions
            sx={{
              borderTop: '1px solid #e2e8f0',
              px: 3,
              py: 2.5,
              gap: 1
            }}
          >
            <Button
              onClick={handleCloseDeleteDialog}
              size="large"
              sx={{
                textTransform: 'none',
                color: '#64748b',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: 'rgba(100, 116, 139, 0.04)'
                }
              }}
            >
              {t('common.cancel')}
            </Button>
            <Button
              onClick={handleConfirmDelete}
              disabled={!deleteConfirmChecked || actionLoading.startsWith('delete-')}
              variant="contained"
              size="large"
              sx={{
                background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
                px: 4,
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 2,
                '&:hover': {
                  background: 'linear-gradient(135deg, #b91c1c 0%, #dc2626 100%)'
                },
                '&:disabled': {
                  background: '#e2e8f0',
                  color: '#94a3b8'
                }
              }}
            >
              {actionLoading.startsWith('delete-') ? <CircularProgress size={20} color="inherit" /> : t('user.removeCollege')}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Share Dialog */}
        <ShareDialog
          open={showShareDialog}
          onClose={() => setShowShareDialog(false)}
          shareData={shareDialogData}
        />

        {/* Guided Tour Components */}
        {tourActive && (
          <>
            <GuidedTour targetElement="[data-tour='start-mining-button']" step="mining" />

            <SuccessDialog
              open={tourStep === 'success'}
              onComplete={handleCompleteTour}
              isMobile={isMobileTour}
            />
          </>
        )}
      </Box>
    </DashboardLayout>
  );
};

export default MyColleges;
