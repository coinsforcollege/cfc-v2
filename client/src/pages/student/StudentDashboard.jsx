import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useNavigate, Link } from 'react-router';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  CircularProgress,
  Alert,
  LinearProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Autocomplete,
  IconButton,
  Paper,
  alpha,
  useTheme,
  ToggleButtonGroup,
  ToggleButton,
  Avatar,
  Tooltip
} from '@mui/material';
import {
  AccountBalanceWallet,
  School,
  TrendingUp,
  PlayArrow,
  Stop,
  Add,
  Refresh,
  ContentCopy,
  CheckCircle,
  Close,
  CloudUpload,
  Link as LinkIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useMiningWebSocket } from '../../hooks/useMiningWebSocket';
import { useToast } from '../../contexts/ToastContext';
import { studentApi } from '../../api/student.api';
import { miningApi } from '../../api/mining.api';
import { collegesApi } from '../../api/colleges.api';
import { BorderBeam } from '@/components/ui/border-beam';

const blockchainLogs = [
  'BLOCK_VERIFY: 0x7f3a9b2c...hash validated | consensus: PoW',
  'ENCRYPT_WALLET: AES-256 cipher active | ledger sync: 98%',
  'TOKEN_MINT: +0.25 TCN | txn: 0x4e8f2d1a | gas optimized',
  'CHAIN_SYNC: distributed ledger replicated | nodes: 847',
  'MERKLE_ROOT: 0xae91b6f4...integrity verified | depth: 12',
  'NONCE_COMPUTE: difficulty adjusted | hashrate: 2.3 TH/s',
  'MEMPOOL_BROADCAST: pending txns queued | network latency: 42ms',
  'SIGNATURE_VERIFY: ECDSA validation passed | pubkey confirmed',
  'UTXO_UPDATE: balance reconciled | confirmations: 6/6',
  'SMART_CONTRACT: execute() → success | gas used: 21000 wei'
];

const StudentDashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const { miningStatus: wsMiningStatus, isConnected: wsConnected, error: wsError } = useMiningWebSocket();
  const [dashboard, setDashboard] = useState(null);
  const [currentLogIndex, setCurrentLogIndex] = useState(0);
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
  const [justSetPrimary, setJustSetPrimary] = useState(null);
  const [copiedReferral, setCopiedReferral] = useState(false);
  const isInitialLoadRef = useRef(true);

  const fetchDashboard = useCallback(async () => {
    try {
      // Only show loading spinner on initial load, not on background refreshes
      if (isInitialLoadRef.current) {
        setLoading(true);
      }
      const response = await studentApi.getDashboard();
      if (response.success) {
        setDashboard(response.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load dashboard');
    } finally {
      if (isInitialLoadRef.current) {
        setLoading(false);
        isInitialLoadRef.current = false;
      }
    }
  }, []);

  // Update mining status from WebSocket
  useEffect(() => {
    if (wsMiningStatus) {
      const statusMap = {};
      wsMiningStatus.activeSessions?.forEach(session => {
        if (session.college) {
          statusMap[session.college._id] = session;
        }
      });
      setMiningStatus(statusMap);
      
      // Update dashboard with WebSocket data, preserving existing summary data
      setDashboard(prev => ({
        ...prev,
        miningColleges: wsMiningStatus.miningColleges,
        activeSessions: wsMiningStatus.activeSessions,
        wallets: wsMiningStatus.wallets
      }));
      
      // Log token updates for debugging
      wsMiningStatus.activeSessions?.forEach(session => {
        if (session.college && session.isActive && session.remainingHours > 0) {
          console.log(`💰 ${session.college.name}: ${session.currentTokens.toFixed(4)} tokens (${session.remainingHours.toFixed(1)}h remaining)`);
        }
      });
    }
  }, [wsMiningStatus]);

  // Show WebSocket connection status
  useEffect(() => {
    if (wsError) {
      showToast(`WebSocket Error: ${wsError}`, 'error');
    }
  }, [wsError, showToast]);

  useEffect(() => {
    if (!user || user.role !== 'student') {
      navigate('/auth/login');
      return;
    }
    
    // Initial fetch
    fetchDashboard();
    
    // Update dashboard data every 30 seconds (less frequent since WebSocket handles mining updates)
    const dashboardInterval = setInterval(() => {
      fetchDashboard();
    }, 30000);
    
    return () => {
      clearInterval(dashboardInterval);
    };
  }, [user, navigate, fetchDashboard]);

  // Rotate blockchain logs continuously
  useEffect(() => {
    const logInterval = setInterval(() => {
      setCurrentLogIndex((prev) => (prev + 1) % blockchainLogs.length);
    }, 2500); // Change log every 2.5 seconds
    return () => clearInterval(logInterval);
  }, []);

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
        setJustSetPrimary(collegeId);
        setTimeout(() => setJustSetPrimary(null), 3000);
      }
    } catch (err) {
      console.error('Failed to set primary college:', err);
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
      // Check file type
      if (!file.type.startsWith('image/')) {
        showToast('Please select an image file', 'error');
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showToast('File size should be less than 5MB', 'error');
        return;
      }

      setLogoFile(file);
      
      // Create preview
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
        // Prepare new college data
        const collegeData = {
          name: newCollege.name,
          country: newCollege.country
        };

        // Add logo URL if provided (not file upload)
        if (logoInputType === 'url' && newCollege.logo) {
          collegeData.logo = newCollege.logo;
        }

        formData.append('newCollege', JSON.stringify(collegeData));

        // Add file if uploaded
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

  const copyReferralCode = useCallback(() => {
    if (dashboard?.student?.referralCode) {
      navigator.clipboard.writeText(dashboard.student.referralCode);
      setCopiedReferral(true);
      setTimeout(() => setCopiedReferral(false), 2000);
    }
  }, [dashboard?.student?.referralCode]);

  // Memoize calculated values to prevent unnecessary re-renders
  const totalMiningTokens = useMemo(() => {
    return Object.values(miningStatus).reduce((sum, session) =>
      sum + (session.isActive && session.remainingHours > 0 ? session.currentTokens : 0), 0
    );
  }, [miningStatus]);

  const totalBalance = useMemo(() => {
    return (dashboard?.summary?.totalBalance || 0) + totalMiningTokens;
  }, [dashboard?.summary?.totalBalance, totalMiningTokens]);

  // Calculate current earning rate from active sessions
  const currentEarningRate = useMemo(() => {
    return Object.values(miningStatus).reduce((sum, session) =>
      sum + (session.isActive && session.remainingHours > 0 ? session.earningRate : 0), 0
    );
  }, [miningStatus]);

  // Calculate total referral bonus across all mining colleges
  const totalReferralBonus = useMemo(() => {
    if (!dashboard?.miningColleges || !dashboard?.student?.totalReferrals) return 0;
    // Sum up referral bonus rates from all mining colleges
    const totalBonus = dashboard.miningColleges.reduce((sum, mc) => {
      if (mc.college && mc.college.referralBonusRate) {
        return sum + (mc.college.referralBonusRate * dashboard.student.totalReferrals);
      }
      return sum;
    }, 0);
    return totalBonus;
  }, [dashboard?.miningColleges, dashboard?.student?.totalReferrals]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: '#f8fafc',
      pt: { xs: 10, md: 12 } // Padding top to avoid header overlap
    }}>
      {/* Container with max width */}
      <Box sx={{ 
        maxWidth: '1200px', 
        width: '100%',
        mx: 'auto', 
        px: { xs: 2, md: 3 },
        py: 0
      }}>
        {/* Header with Terminal */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 3 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
              Welcome, {dashboard?.student.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {dashboard?.student.college?.name || 'No college assigned'}
            </Typography>
          </Box>

          {/* Blockchain Activity Terminal */}
          <Paper 
            elevation={0}
            sx={{ 
              bgcolor: '#f5f5f5',
              borderRadius: 1,
              px: 2,
              py: 1
            }}
          >
            <Box sx={{ 
              fontFamily: 'Monaco, Consolas, "Courier New", monospace',
              fontSize: '0.65rem',
              color: '#333',
              fontWeight: 300,
              lineHeight: 1.4,
              overflow: 'hidden',
              whiteSpace: 'nowrap'
            }}>
              <Box sx={{ opacity: 0.5 }}>
                {blockchainLogs[(currentLogIndex + blockchainLogs.length - 1) % blockchainLogs.length]}
              </Box>
              <Box>
                {blockchainLogs[currentLogIndex]}
              </Box>
            </Box>
          </Paper>
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
              Total Balance
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {totalBalance.toFixed(4)}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ 
          flex: { xs: 'calc(50% - 8px)', md: 'calc(25% - 12px)' },
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          color: 'white',
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(240, 147, 251, 0.3)',
          position: 'relative'
        }}>
          <BorderBeam 
            size={80}
            duration={7.5}
            delay={0}
            colorFrom="#ffffff"
            colorTo="#f0f0f0"
            borderWidth={3}
          />
          <CardContent sx={{ position: 'relative', zIndex: 1 }}>
            <TrendingUp sx={{ color: 'white', fontSize: 24, mb: 1 }} />
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)', display: 'block', mb: 0.5 }}>
              Miner Running
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {totalMiningTokens.toFixed(4)}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ 
          flex: { xs: 'calc(50% - 8px)', md: 'calc(25% - 12px)' },
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          color: 'white',
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(79, 172, 254, 0.3)'
        }}>
          <CardContent>
            <School sx={{ color: 'white', fontSize: 24, mb: 1 }} />
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)', display: 'block', mb: 0.5 }}>
              Colleges
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {dashboard?.miningColleges.filter(mc => mc.college).length} / 10
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{
          flex: { xs: 'calc(50% - 8px)', md: 'calc(25% - 12px)' },
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          color: 'white',
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(250, 112, 154, 0.3)'
        }}>
          <CardContent>
            <Refresh sx={{ color: 'white', fontSize: 24, mb: 1 }} />
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)', display: 'block', mb: 0.5 }}>
              Current Rate
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {currentEarningRate.toFixed(2)} /hr
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Image and Referral Row */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <Box sx={{ flex: { xs: '100%', md: 'calc(50% - 8px)' } }}>
          <Box 
            sx={{ 
              position: 'relative',
              height: 250,
              width: '100%'
            }}
          >
            <Box
              component="img"
              src="/images/animated-pixel-art-programmer.gif"
              alt="Mining Activity"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: 3,
                border: '3px solid rgba(251, 191, 36, 0.3)',
                boxShadow: '0 4px 20px rgba(251, 191, 36, 0.3)'
              }}
            />
            
            {/* Become Ambassador Button with Border Beam Animation */}
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 2
              }}
            >
              <Button
                component={Link}
                to="/ambassador/apply"
                sx={{
                  position: 'relative',
                  background: 'rgba(0, 0, 0, 0.7)',
                  backdropFilter: 'blur(10px)',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  px: 2.5,
                  py: 1,
                  borderRadius: 2,
                  textTransform: 'none',
                  border: '2px solid transparent',
                  '&:hover': {
                    background: 'rgba(0, 0, 0, 0.8)',
                  },
                  transition: 'all 0.3s ease',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: -2,
                    borderRadius: 2,
                    padding: '2px',
                    background: 'linear-gradient(45deg, #ff0080, #ff8c00, #40e0d0, #ff0080)',
                    backgroundSize: '300%',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                    animation: 'borderBeam 3s linear infinite',
                  },
                  '@keyframes borderBeam': {
                    '0%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                    '100%': { backgroundPosition: '0% 50%' }
                  }
                }}
              >
                Become An Ambassador
              </Button>
            </Box>
            <Box sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              background: 'rgba(0, 0, 0, 0.8)',
              px: 1.5,
              py: 0.5,
              borderRadius: 1.5,
              border: '2px solid rgba(16, 185, 129, 0.6)'
            }}>
              <Box sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#10b981',
                animation: 'blink 1.5s infinite',
                '@keyframes blink': {
                  '0%, 100%': { opacity: 1 },
                  '50%': { opacity: 0.3 }
                }
              }} />
              <Typography variant="caption" sx={{ color: 'white', fontWeight: 700, fontSize: '0.7rem' }}>
                LIVE
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ flex: { xs: '100%', md: 'calc(50% - 8px)' } }}>
          <Card sx={{ 
            height: 250,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
            color: 'white',
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)'
          }}>
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', p: 2.5 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                Invite & Earn More
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1, 
                mb: 2, 
                p: 1.5, 
                background: 'rgba(255,255,255,0.15)', 
                borderRadius: 2
              }}>
                <Typography variant="body1" sx={{ flex: 1, fontWeight: 600 }}>
                  {dashboard?.student.referralCode}
                </Typography>
                <IconButton 
                  size="small" 
                  onClick={copyReferralCode} 
                  sx={{ 
                    color: 'white',
                    background: copiedReferral ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255,255,255,0.2)',
                    '&:hover': { background: copiedReferral ? 'rgba(16, 185, 129, 0.4)' : 'rgba(255,255,255,0.3)' }
                  }}
                >
                  {copiedReferral ? <CheckCircle fontSize="small" /> : <ContentCopy fontSize="small" />}
                </IconButton>
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.95, mb: 0.5 }}>
                Referrals: <strong>{dashboard?.student.totalReferrals || 0}</strong>
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.95 }}>
                Potential Bonus: <strong>+{totalReferralBonus.toFixed(2)}/hr</strong>
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* My Colleges */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          My Colleges
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

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 2 }}>
        {dashboard?.miningColleges.filter(mc => mc.college).map((mc) => {
          const session = miningStatus[mc.college._id];
          const wallet = dashboard?.wallets?.find(w => w.college && w.college._id === mc.college._id);
          const isActive = session && session.isActive && session.remainingHours > 0;
          const progress = isActive ? ((24 - session.remainingHours) / 24) * 100 : 0;

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
              {/* Header Section - Fixed Height */}
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
                </Box>

                {/* College Name - Truncated */}
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
                  <Tooltip title="Base mining rate - tokens earned per hour" arrow placement="top">
                    <Chip
                      label={`${mc.college.baseRate || 0.25} T/H`}
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
                  {mc.college.referralBonusRate && (
                    <Tooltip title="Referral bonus - additional tokens per hour per referral" arrow placement="top">
                      <Chip
                        label={`+${mc.college.referralBonusRate} REF`}
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

              {/* Mining Progress Section - Fixed Height */}
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
                    {/* Current Mining Tokens */}
                    <Box sx={{ mb: 1.5, mt: 0.5 }}>
                      <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.65rem', mb: 0.75, display: 'block' }}>
                        CURRENT YIELD
                      </Typography>
                      <Typography variant="h5" sx={{
                        color: '#22d3ee',
                        fontWeight: 700,
                        fontFamily: 'Monaco, monospace',
                        fontSize: '1.5rem'
                      }}>
                        {session.currentTokens.toFixed(4)}
                      </Typography>
                    </Box>

                    {/* Progress Bar */}
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

              {/* Balance Section - Fixed Height */}
              <Box sx={{
                p: 2,
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                position: 'relative',
                zIndex: 1
              }}>
                {/* Balance Display */}
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
        {/* Header */}
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

        {/* Content */}
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

                {/* Toggle between File and URL */}
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

                {/* File Upload */}
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

                {/* URL Input */}
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

                {/* Logo Preview */}
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
                ← Back to search
              </Button>
            </>
          )}
        </DialogContent>

        {/* Actions */}
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
    </Box>
  );
};

export default StudentDashboard;

