import React, { useEffect, useState, useMemo, useRef } from 'react';
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
  Stop
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useMiningWebSocket } from '../../hooks/useMiningWebSocket';
import { useToast } from '../../contexts/ToastContext';
import { studentApi } from '../../api/student.api';
import { BorderBeam } from '@/components/ui/border-beam';
import DashboardLayout from '../../layouts/DashboardLayout';

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

const Overview = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { miningStatus: wsMiningStatus } = useMiningWebSocket();
  const [dashboard, setDashboard] = useState(null);
  const [currentLogIndex, setCurrentLogIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [miningStatus, setMiningStatus] = useState({});
  const isInitialLoadRef = useRef(true);

  const fetchDashboard = async () => {
    try {
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

  useEffect(() => {
    const logInterval = setInterval(() => {
      setCurrentLogIndex((prev) => (prev + 1) % blockchainLogs.length);
    }, 2500);
    return () => clearInterval(logInterval);
  }, []);

  const totalMiningTokens = useMemo(() => {
    return Object.values(miningStatus).reduce((sum, session) =>
      sum + (session.isActive && session.remainingHours > 0 ? session.currentTokens : 0), 0
    );
  }, [miningStatus]);

  const totalBalance = useMemo(() => {
    return (dashboard?.summary?.totalBalance || 0) + totalMiningTokens;
  }, [dashboard?.summary?.totalBalance, totalMiningTokens]);

  const currentEarningRate = useMemo(() => {
    return Object.values(miningStatus).reduce((sum, session) =>
      sum + (session.isActive && session.remainingHours > 0 ? session.earningRate : 0), 0
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
    referralsCount: dashboard?.student?.totalReferrals || 0,
  };

  return (
    <DashboardLayout
      stats={sidebarStats}
      searchPlaceholder="Search..."
    >
      <Box sx={{ maxWidth: '1200px', width: '100%', mx: 'auto' }}>
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

        {/* Balance Breakdown and Active Miners Row */}
        <Box sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          mb: 3
        }}>
          {/* Balance Breakdown Table */}
          <Card sx={{
            flex: { xs: '100%', md: 'calc(50% - 8px)' },
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
                Balance Breakdown
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Your token balance across all colleges
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#f8fafc' }}>
                      <TableCell sx={{ fontWeight: 700, color: '#475569' }}>College</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, color: '#475569' }}>Balance</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, color: '#475569' }}>%</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dashboard?.wallets && dashboard.wallets.length > 0 ? (
                      <>
                        {dashboard.wallets.map((wallet, index) => {
                          const percentage = totalBalance > 0 ? ((wallet.balance / totalBalance) * 100).toFixed(0) : 0;
                          return (
                            <TableRow key={index} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                              <TableCell>
                                <Box>
                                  <Typography variant="body2" fontWeight={600}>
                                    {wallet.college?.name || 'Unknown'}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {wallet.college?.country || '-'}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell align="right">
                                <Typography variant="body2" fontWeight={600} color="primary.main">
                                  {wallet.balance.toFixed(2)}
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Chip
                                  label={`${percentage}%`}
                                  size="small"
                                  sx={{
                                    fontWeight: 600,
                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                    color: 'primary.main'
                                  }}
                                />
                              </TableCell>
                            </TableRow>
                          );
                        })}
                        <TableRow sx={{ bgcolor: '#f8fafc' }}>
                          <TableCell>
                            <Typography variant="body2" fontWeight={700}>
                              Total
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight={700} color="primary.main">
                              {totalBalance.toFixed(2)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Chip
                              label="100%"
                              size="small"
                              sx={{
                                fontWeight: 700,
                                bgcolor: 'primary.main',
                                color: 'white'
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      </>
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                            No balance data available
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          {/* Active Miners Table */}
          <Card sx={{
            flex: { xs: '100%', md: 'calc(50% - 8px)' },
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
                Active Miners
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Mining status for all your colleges
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#f8fafc' }}>
                      <TableCell sx={{ fontWeight: 700, color: '#475569' }}>College</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700, color: '#475569' }}>Status</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, color: '#475569' }}>Progress</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dashboard?.miningColleges && dashboard.miningColleges.length > 0 ? (
                      dashboard.miningColleges.filter(mc => mc.college).map((miningCollege, index) => {
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
                                  {isMining ? 'Mining active' : 'Not mining'}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="center">
                              <Chip
                                icon={isMining ? <PlayArrow fontSize="small" /> : <Stop fontSize="small" />}
                                label={isMining ? 'Mining' : 'Idle'}
                                size="small"
                                color={isMining ? 'success' : 'default'}
                                sx={{ fontWeight: 600 }}
                              />
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
                            No colleges added yet
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Box>

      </Box>
    </DashboardLayout>
  );
};

export default Overview;
