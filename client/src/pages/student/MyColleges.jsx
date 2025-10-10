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
  Autocomplete,
  IconButton,
  Paper,
  useTheme,
  ToggleButtonGroup,
  ToggleButton,
  Avatar,
  Tooltip
} from '@mui/material';
import {
  School,
  PlayArrow,
  Stop,
  Add,
  ContentCopy,
  CheckCircle,
  Close,
  CloudUpload,
  Link as LinkIcon,
  Share,
  Speed,
  Groups,
  Schedule
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useMiningWebSocket } from '../../hooks/useMiningWebSocket';
import { useToast } from '../../contexts/ToastContext';
import { studentApi } from '../../api/student.api';
import { miningApi } from '../../api/mining.api';
import { collegesApi } from '../../api/colleges.api';
import DashboardLayout from '../../layouts/DashboardLayout';

const MyColleges = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { miningStatus: wsMiningStatus } = useMiningWebSocket();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [miningStatus, setMiningStatus] = useState({});
  const [showAddCollegeDialog, setShowAddCollegeDialog] = useState(false);
  const [colleges, setColleges] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [newCollege, setNewCollege] = useState({ name: '', country: '', logo: '' });
  const [showNewCollegeForm, setShowNewCollegeForm] = useState(false);
  const [logoInputType, setLogoInputType] = useState('url');
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [actionLoading, setActionLoading] = useState('');
  const [copiedCollegeReferral, setCopiedCollegeReferral] = useState(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await studentApi.getDashboard();
      if (response.success) {
        setDashboard(response.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load dashboard');
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

      setDashboard(prev => ({
        ...prev,
        miningColleges: wsMiningStatus.miningColleges,
        activeSessions: wsMiningStatus.activeSessions,
        wallets: wsMiningStatus.wallets
      }));
    }
  }, [wsMiningStatus]);

  useEffect(() => {
    if (!user || user.role !== 'student') {
      navigate('/auth/login');
      return;
    }

    fetchDashboard();

    const dashboardInterval = setInterval(() => {
      fetchDashboard();
    }, 30000);

    return () => {
      clearInterval(dashboardInterval);
    };
  }, [user, navigate]);

  const handleStartMining = async (collegeId) => {
    try {
      setActionLoading(`start-${collegeId}`);
      const response = await miningApi.startMining(collegeId);
      if (response.success) {
        showToast('Mining started successfully!', 'success');
        fetchDashboard();
      }
    } catch (err) {
      console.error('Failed to start mining:', err);
      showToast(err.message || 'Failed to start mining', 'error');
    } finally {
      setActionLoading('');
    }
  };

  const handleStopMining = async (collegeId) => {
    try {
      setActionLoading(`stop-${collegeId}`);
      const response = await miningApi.stopMining(collegeId);
      if (response.success) {
        showToast('Mining stopped successfully!', 'success');
        fetchDashboard();
      }
    } catch (err) {
      console.error('Failed to stop mining:', err);
      showToast(err.message || 'Failed to stop mining', 'error');
    } finally {
      setActionLoading('');
    }
  };

  const handleSetPrimaryCollege = async (collegeId) => {
    try {
      setActionLoading(`primary-${collegeId}`);
      const response = await studentApi.setPrimaryCollege(collegeId);
      if (response.success) {
        fetchDashboard();
        showToast('Primary college updated!', 'success');
      }
    } catch (err) {
      console.error('Failed to set primary college:', err);
      showToast(err.message || 'Failed to set primary college', 'error');
    } finally {
      setActionLoading('');
    }
  };

  const handleCollegeSearch = async (searchTerm) => {
    if (searchTerm.length < 2) return;
    try {
      const response = await collegesApi.search(searchTerm);
      if (response.success) {
        setColleges(response.data);
      }
    } catch (err) {
      console.error('College search error:', err);
    }
  };

  const handleLogoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showToast('Please select an image file', 'error');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        showToast('File size should be less than 5MB', 'error');
        return;
      }

      setLogoFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUrlChange = (url) => {
    setNewCollege({ ...newCollege, logo: url });
    setLogoPreview(url);
  };

  const handleAddCollege = async () => {
    try {
      setActionLoading('add-college');

      const formData = new FormData();

      if (selectedCollege) {
        formData.append('collegeId', selectedCollege._id);
      } else {
        const collegeData = {
          name: newCollege.name,
          country: newCollege.country
        };

        if (logoInputType === 'url' && newCollege.logo) {
          collegeData.logo = newCollege.logo;
        }

        formData.append('newCollege', JSON.stringify(collegeData));

        if (logoInputType === 'file' && logoFile) {
          formData.append('logoFile', logoFile);
        }
      }

      const response = await studentApi.addCollege(formData);
      if (response.success) {
        setShowAddCollegeDialog(false);
        setSelectedCollege(null);
        setNewCollege({ name: '', country: '', logo: '' });
        setShowNewCollegeForm(false);
        setLogoFile(null);
        setLogoPreview('');
        setLogoInputType('url');
        fetchDashboard();
        showToast('College added successfully!', 'success');
      }
    } catch (err) {
      console.error('Failed to add college:', err);
      showToast(err.message || 'Failed to add college', 'error');
    } finally {
      setActionLoading('');
    }
  };

  const handleCloseAddCollegeDialog = () => {
    setShowAddCollegeDialog(false);
    setSelectedCollege(null);
    setNewCollege({ name: '', country: '', logo: '' });
    setShowNewCollegeForm(false);
    setLogoFile(null);
    setLogoPreview('');
    setLogoInputType('url');
  };

  const copyCollegeReferralLink = useCallback((collegeId) => {
    if (dashboard?.student?.referralCode) {
      const baseUrl = window.location.origin;
      const referralLink = `${baseUrl}/auth/register/student?ref=${dashboard.student.referralCode}&college=${collegeId}`;
      navigator.clipboard.writeText(referralLink);
      setCopiedCollegeReferral(collegeId);
      setTimeout(() => setCopiedCollegeReferral(null), 2000);
    }
  }, [dashboard?.student?.referralCode]);

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
    referralsCount: dashboard?.student?.totalReferrals || 0,
  };

  return (
    <DashboardLayout
      stats={sidebarStats}
      searchPlaceholder="Search colleges..."
    >
      <Box sx={{ maxWidth: '1200px', width: '100%', mx: 'auto' }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
          My Colleges
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Manage your college mining portfolio. Add up to 10 colleges and start earning tokens.
        </Typography>

        {/* Mining Stats */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
          gap: 2,
          mb: 4
        }}>
          <Box sx={{
            p: 2.5,
            borderRadius: 2,
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(34, 211, 238, 0.1) 100%)',
            border: '1px solid rgba(34, 211, 238, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
            <Box sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(34, 211, 238, 0.4)'
            }}>
              <Speed sx={{ color: 'white', fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem', display: 'block', mb: 0.5 }}>
                Base Rate
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#0891b2' }}>
                0.25 T/H
              </Typography>
            </Box>
          </Box>

          <Box sx={{
            p: 2.5,
            borderRadius: 2,
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
            <Box sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)'
            }}>
              <Groups sx={{ color: 'white', fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem', display: 'block', mb: 0.5 }}>
                Referral Bonus
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#8b5cf6' }}>
                +0.10 T/H
              </Typography>
            </Box>
          </Box>

          <Box sx={{
            p: 2.5,
            borderRadius: 2,
            background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(251, 113, 133, 0.1) 100%)',
            border: '1px solid rgba(236, 72, 153, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
            <Box sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #ec4899 0%, #fb7185 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(236, 72, 153, 0.4)'
            }}>
              <Schedule sx={{ color: 'white', fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem', display: 'block', mb: 0.5 }}>
                Session Length
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#ec4899' }}>
                24 Hours
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* My Colleges Header */}
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Active Colleges ({dashboard?.miningColleges.filter(mc => mc.college).length}/10)
          </Typography>
          {dashboard?.miningColleges.filter(mc => mc.college).length < 10 && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setShowAddCollegeDialog(true)}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: 2,
                boxShadow: '0 2px 12px rgba(102, 126, 234, 0.4)',
                fontWeight: 600,
                px: 2,
                py: 1,
                fontSize: '0.875rem',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 16px rgba(102, 126, 234, 0.5)'
                }
              }}
            >
              Add College
            </Button>
          )}
        </Box>

        {/* College Cards Grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 2 }}>
          {dashboard?.miningColleges.filter(mc => mc.college).map((mc) => {
            const session = miningStatus[mc.college._id];
            const wallet = dashboard?.wallets?.find(w => w.college && w.college._id === mc.college._id);
            const isActive = session && session.isActive && session.remainingHours > 0;
            const progress = isActive ? ((24 - session.remainingHours) / 24) * 100 : 0;

            const baseRate = mc.college.baseRate || 0.25;
            const referralBonusRate = mc.college.referralBonusRate || 0.1;
            const currentReferralsCount = mc.referredStudents?.length || 0;

            const effectiveReferralsForRate = isActive && session.earningRate
              ? Math.round((session.earningRate - baseRate) / referralBonusRate)
              : currentReferralsCount;

            const userEarningRate = isActive ? session.earningRate : (baseRate + (currentReferralsCount * referralBonusRate));

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
                  border: isActive ? '1px solid rgba(34, 211, 238, 0.3)' : '1px solid rgba(71, 85, 105, 0.3)',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: isActive
                      ? '0 20px 40px rgba(34, 211, 238, 0.3)'
                      : '0 20px 40px rgba(0, 0, 0, 0.5)',
                    border: isActive ? '1px solid rgba(34, 211, 238, 0.5)' : '1px solid rgba(71, 85, 105, 0.5)'
                  },
                  ...(isActive && {
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
                        {isActive ? 'MINING' : 'OFFLINE'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      {dashboard?.student.college?._id === mc.college._id ? (
                        <Chip
                          label="PRIMARY"
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
                          label="SET PRIMARY"
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
                      <Tooltip title={copiedCollegeReferral === mc.college._id ? "Link copied!" : "Share referral link for this college"} arrow>
                        <Chip
                          label={copiedCollegeReferral === mc.college._id ? "COPIED" : "INVITE"}
                          size="small"
                          icon={copiedCollegeReferral === mc.college._id ? <CheckCircle sx={{ fontSize: '0.8rem' }} /> : <Share sx={{ fontSize: '0.8rem' }} />}
                          onClick={() => copyCollegeReferralLink(mc.college._id)}
                          sx={{
                            height: 18,
                            background: copiedCollegeReferral === mc.college._id
                              ? 'rgba(34, 197, 94, 0.2)'
                              : 'rgba(139, 92, 246, 0.2)',
                            border: copiedCollegeReferral === mc.college._id
                              ? '1px solid rgba(34, 197, 94, 0.5)'
                              : '1px solid rgba(139, 92, 246, 0.5)',
                            color: copiedCollegeReferral === mc.college._id ? '#22c55e' : '#a78bfa',
                            fontSize: '0.6rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            '& .MuiChip-label': { px: 0.75 },
                            '& .MuiChip-icon': {
                              color: copiedCollegeReferral === mc.college._id ? '#22c55e' : '#a78bfa',
                              marginLeft: '4px',
                              marginRight: '-4px'
                            },
                            '&:hover': {
                              background: copiedCollegeReferral === mc.college._id
                                ? 'rgba(34, 197, 94, 0.3)'
                                : 'rgba(139, 92, 246, 0.3)',
                              border: copiedCollegeReferral === mc.college._id
                                ? '1px solid rgba(34, 197, 94, 0.6)'
                                : '1px solid rgba(139, 92, 246, 0.6)',
                            }
                          }}
                        />
                      </Tooltip>
                    </Box>
                  </Box>

                  {/* College Name */}
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: '#f1f5f9',
                      fontSize: '0.95rem',
                      mb: 0.5,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {mc.college.name}
                  </Typography>

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
                      title={`Your earning rate: ${baseRate} base + ${(effectiveReferralsForRate * referralBonusRate).toFixed(2)} referral bonus${isActive && currentReferralsCount > effectiveReferralsForRate ? ' (restart mining to apply new referrals)' : ''}`}
                      arrow
                      placement="top"
                    >
                      <Chip
                        label={`${userEarningRate.toFixed(2)} T/H`}
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
                        title={`${currentReferralsCount} referral${currentReferralsCount > 1 ? 's' : ''} for this college${isActive && currentReferralsCount > effectiveReferralsForRate ? ` (${effectiveReferralsForRate} counted in current rate)` : ''}`}
                        arrow
                        placement="top"
                      >
                        <Chip
                          label={`${currentReferralsCount} REF`}
                          size="small"
                          sx={{
                            height: 18,
                            background: 'rgba(96, 165, 250, 0.15)',
                            border: '1px solid rgba(96, 165, 250, 0.3)',
                            color: '#60a5fa',
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
                          CURRENT YIELD
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
                            @ {userEarningRate.toFixed(2)} T/H
                          </Typography>
                        </Box>
                      </Box>

                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.65rem' }}>
                            PROGRESS
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#22d3ee', fontSize: '0.65rem', fontWeight: 700 }}>
                            {session.remainingHours.toFixed(1)}H LEFT
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
                        MINING OFFLINE
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#475569', mt: 1, fontSize: '0.7rem' }}>
                        Start mining to earn tokens
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
                      {isActive ? 'TOTAL VALUE' : 'WALLET BALANCE'}
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
                        Wallet: {wallet?.balance.toFixed(4) || '0.0000'} + Mining: {session.currentTokens.toFixed(4)}
                      </Typography>
                    )}
                  </Box>

                  {/* Action Button */}
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={isActive ? <Stop /> : <PlayArrow />}
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
                      : isActive ? 'STOP MINING' : 'START MINING'
                    }
                  </Button>
                </Box>
              </Card>
            );
          })}
        </Box>

        {/* Add College Dialog */}
        <Dialog
          open={showAddCollegeDialog}
          onClose={handleCloseAddCollegeDialog}
          maxWidth="md"
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
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#2d3748' }}>
              Add College to Mining List
            </Typography>
            <IconButton onClick={handleCloseAddCollegeDialog} size="small">
              <Close />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ py: 4, px: 3 }}>
            {!showNewCollegeForm ? (
              <>
                <Autocomplete
                  options={colleges}
                  getOptionLabel={(option) => `${option.name} - ${option.country}`}
                  onInputChange={(e, value) => handleCollegeSearch(value)}
                  onChange={(e, value) => setSelectedCollege(value)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Search College"
                      placeholder="Start typing college name..."
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2
                        }
                      }}
                    />
                  )}
                  sx={{ mb: 2 }}
                />
                <Button
                  onClick={() => setShowNewCollegeForm(true)}
                  sx={{
                    color: '#8b5cf6',
                    textTransform: 'none',
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: 'rgba(139, 92, 246, 0.04)'
                    }
                  }}
                >
                  + College not found? Add new college
                </Button>
              </>
            ) : (
              <>
                <TextField
                  fullWidth
                  label="College Name"
                  value={newCollege.name}
                  onChange={(e) => setNewCollege({ ...newCollege, name: e.target.value })}
                  required
                  sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                />
                <TextField
                  fullWidth
                  label="Country"
                  value={newCollege.country}
                  onChange={(e) => setNewCollege({ ...newCollege, country: e.target.value })}
                  required
                  sx={{
                    mb: 4,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                />

                {/* Logo Upload Section */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#2d3748' }}>
                    College Logo (Optional)
                  </Typography>

                  <ToggleButtonGroup
                    value={logoInputType}
                    exclusive
                    onChange={(e, value) => {
                      if (value) {
                        setLogoInputType(value);
                        setLogoPreview('');
                        setLogoFile(null);
                        setNewCollege({ ...newCollege, logo: '' });
                      }
                    }}
                    sx={{ mb: 3 }}
                  >
                    <ToggleButton
                      value="file"
                      sx={{
                        textTransform: 'none',
                        px: 2,
                        py: 1
                      }}
                    >
                      <CloudUpload sx={{ mr: 1, fontSize: 20 }} />
                      Upload File
                    </ToggleButton>
                    <ToggleButton
                      value="url"
                      sx={{
                        textTransform: 'none',
                        px: 2,
                        py: 1
                      }}
                    >
                      <LinkIcon sx={{ mr: 1, fontSize: 20 }} />
                      Enter URL
                    </ToggleButton>
                  </ToggleButtonGroup>

                  {logoInputType === 'file' && (
                    <Box>
                      <Button
                        variant="outlined"
                        component="label"
                        startIcon={<CloudUpload />}
                        sx={{
                          mb: 2,
                          borderRadius: 2,
                          textTransform: 'none',
                          borderColor: '#8b5cf6',
                          color: '#8b5cf6',
                          '&:hover': {
                            borderColor: '#7c3aed',
                            backgroundColor: 'rgba(139, 92, 246, 0.04)'
                          }
                        }}
                      >
                        Choose Image
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={handleLogoFileChange}
                        />
                      </Button>
                      {logoFile && (
                        <Typography variant="body2" color="text.secondary">
                          Selected: {logoFile.name}
                        </Typography>
                      )}
                    </Box>
                  )}

                  {logoInputType === 'url' && (
                    <TextField
                      fullWidth
                      label="Logo URL"
                      value={newCollege.logo}
                      onChange={(e) => handleLogoUrlChange(e.target.value)}
                      placeholder="https://example.com/logo.png"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2
                        }
                      }}
                    />
                  )}

                  {logoPreview && (
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#2d3748' }}>
                        Preview:
                      </Typography>
                      <Avatar
                        src={logoPreview}
                        sx={{
                          width: 120,
                          height: 120,
                          border: '3px solid #e2e8f0',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                      >
                        <School sx={{ fontSize: 50 }} />
                      </Avatar>
                    </Box>
                  )}
                </Box>

                <Button
                  onClick={() => {
                    setShowNewCollegeForm(false);
                    setLogoFile(null);
                    setLogoPreview('');
                    setLogoInputType('url');
                  }}
                  sx={{
                    color: '#8b5cf6',
                    textTransform: 'none',
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: 'rgba(139, 92, 246, 0.04)'
                    }
                  }}
                >
                  Back to search
                </Button>
              </>
            )}
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
              onClick={handleCloseAddCollegeDialog}
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
              Cancel
            </Button>
            <Button
              onClick={handleAddCollege}
              disabled={(!selectedCollege && (!newCollege.name || !newCollege.country)) || actionLoading === 'add-college'}
              variant="contained"
              size="large"
              sx={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                px: 4,
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 2,
                '&:hover': {
                  background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)'
                },
                '&:disabled': {
                  background: '#e2e8f0',
                  color: '#94a3b8'
                }
              }}
            >
              {actionLoading === 'add-college' ? <CircularProgress size={20} color="inherit" /> : 'Add College'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DashboardLayout>
  );
};

export default MyColleges;
