import {
  ArrowForward,
  CheckCircle,
  ContentCopy,
  Email,
  Facebook,
  LocalFireDepartment,
  School,
  Settings,
  Share,
  Twitter,
  Verified,
  WhatsApp,
  PlayArrow,
  Stop
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  alpha,
  useTheme
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';

const mockDashboardData = {
  user: {
    firstName: 'John',
    lastName: 'Doe',
    tokens: 2450,
    miningStreak: 15,
    rank: 42
  },
  college: {
    name: 'MIT',
    logo: '',
    studentCount: 2847,
    status: 'Token Configured'
  },
  mining: {
    canMine: false, // Set to false to see blockchain terminal
    nextMineTime: null,
    lastMined: new Date(Date.now() - 5 * 60 * 60 * 1000) // 5 hours ago = countdown active
  },
  referrals: {
    code: 'JOHN2024MIT',
    successfulReferrals: 8,
    bonusTokens: 400
  },
  recentActivity: [
    { date: '2024-03-15', time: '09:30 AM', tokens: 100, bonus: 10 },
    { date: '2024-03-14', time: '08:45 AM', tokens: 100, bonus: 10 },
    { date: '2024-03-13', time: '10:15 AM', tokens: 100, bonus: 10 },
    { date: '2024-03-12', time: '09:00 AM', tokens: 100, bonus: 0 },
    { date: '2024-03-11', time: '11:20 AM', tokens: 100, bonus: 0 }
  ],
  leaderboard: [
    { rank: 1, name: 'Sarah M.', tokens: 5680 },
    { rank: 2, name: 'Michael C.', tokens: 4920 },
    { rank: 3, name: 'Emily R.', tokens: 4750 },
    { rank: 4, name: 'David L.', tokens: 3890 },
    { rank: 5, name: 'Jessica K.', tokens: 3560 },
    { rank: 6, name: 'James P.', tokens: 3120 },
    { rank: 7, name: 'Amanda S.', tokens: 2980 },
    { rank: 8, name: 'Ryan T.', tokens: 2750 },
    { rank: 9, name: 'Lisa W.', tokens: 2650 },
    { rank: 10, name: 'Chris B.', tokens: 2580 }
  ],
  balances: [
    { college: 'MIT', country: 'United States', balance: 1250.50, percentage: 51 },
    { college: 'Stanford', country: 'United States', balance: 820.25, percentage: 33 },
    { college: 'Oxford', country: 'United Kingdom', balance: 379.25, percentage: 16 }
  ],
  activeMiners: [
    { college: 'MIT', country: 'United States', status: 'mining', startTime: '2024-03-15 09:30 AM', progress: 75 },
    { college: 'Stanford', country: 'United States', status: 'mining', startTime: '2024-03-15 09:30 AM', progress: 75 },
    { college: 'Oxford', country: 'United Kingdom', status: 'idle', startTime: null, progress: 0 }
  ]
};

const blockchainLogs = [
  '⛏️  BLOCK_VERIFY: 0x7f3a9b2c...hash validated | consensus: PoW',
  '🔐 ENCRYPT_WALLET: AES-256 cipher active | ledger sync: 98%',
  '⚡ TOKEN_MINT: +0.25 TCN | txn: 0x4e8f2d1a | gas optimized',
  '🔗 CHAIN_SYNC: distributed ledger replicated | nodes: 847',
  '🛡️  MERKLE_ROOT: 0xae91b6f4...integrity verified | depth: 12',
  '💎 NONCE_COMPUTE: difficulty adjusted | hashrate: 2.3 TH/s',
  '📊 MEMPOOL_BROADCAST: pending txns queued | network latency: 42ms',
  '🔒 SIGNATURE_VERIFY: ECDSA validation passed | pubkey confirmed',
  '⛓️  UTXO_UPDATE: balance reconciled | confirmations: 6/6',
  '🚀 SMART_CONTRACT: execute() → success | gas used: 21000 wei'
];

function StudentDashboard() {
  const theme = useTheme();
  const { user } = useAuth();
  const [timeUntilMine, setTimeUntilMine] = useState(0);
  const [copying, setCopying] = useState(false);
  const [currentLogIndex, setCurrentLogIndex] = useState(0);

  useEffect(() => {
    if (!mockDashboardData.mining.canMine && mockDashboardData.mining.lastMined) {
      const updateCountdown = () => {
        const now = new Date();
        const nextMineTime = new Date(
          mockDashboardData.mining.lastMined.getTime() + 24 * 60 * 60 * 1000
        );
        const diff = nextMineTime - now;
        setTimeUntilMine(Math.max(0, diff));
      };
      updateCountdown();
      const interval = setInterval(updateCountdown, 1000);
      return () => clearInterval(interval);
    }
  }, []);

  // Rotate blockchain logs continuously
  useEffect(() => {
    const logInterval = setInterval(() => {
      setCurrentLogIndex((prev) => (prev + 1) % blockchainLogs.length);
    }, 2500); // Change log every 2.5 seconds
    return () => clearInterval(logInterval);
  }, []);

  const formatCountdown = (ms) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleCopyReferralCode = () => {
    console.log(mockDashboardData.referrals.code);
    navigator.clipboard.writeText(mockDashboardData.referrals.code);
    setCopying(true);
    setTimeout(() => setCopying(false), 2000);
  };

  const handleMineNow = () => {
    console.log('Mining tokens...');
  };

  const getStatusColor = (status) => {
    if (status === 'Token Configured') return 'success';
    if (status === 'Admin Joined') return 'primary';
    return 'default';
  };

  const getStatusIcon = (status) => {
    if (status === 'Token Configured') return <Settings fontSize="small" />;
    if (status === 'Admin Joined') return <Verified fontSize="small" />;
    return <CheckCircle fontSize="small" />;
  };

  const progressPercentage = mockDashboardData.mining.canMine
    ? 100
    : ((24 * 60 * 60 * 1000 - timeUntilMine) / (24 * 60 * 60 * 1000)) * 100;

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="lg">
        {/* Blockchain Activity Terminal - FULL WIDTH AT TOP */}
        <Paper 
          elevation={0}
          sx={{ 
            bgcolor: '#0a0e27',
            borderRadius: 2,
            p: 1.5,
            mb: 3,
            border: '1px solid',
            borderColor: alpha(theme.palette.primary.main, 0.3),
            boxShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.15)}`
          }}
        >
          <Box sx={{ 
            fontFamily: 'Monaco, Consolas, "Courier New", monospace',
            fontSize: '0.75rem',
            color: '#00ff41',
            lineHeight: 1.6,
            overflow: 'hidden'
          }}>
            <Box 
              sx={{ 
                opacity: 0.7,
                mb: 0.5,
                animation: 'fadeIn 0.5s ease-in',
                '@keyframes fadeIn': {
                  from: { opacity: 0 },
                  to: { opacity: 0.7 }
                }
              }}
            >
              {blockchainLogs[(currentLogIndex + blockchainLogs.length - 1) % blockchainLogs.length]}
            </Box>
            <Box 
              sx={{ 
                opacity: 1,
                animation: 'slideIn 0.5s ease-out',
                '@keyframes slideIn': {
                  from: { transform: 'translateX(-10px)', opacity: 0 },
                  to: { transform: 'translateX(0)', opacity: 1 }
                }
              }}
            >
              {blockchainLogs[currentLogIndex]}
              <Box 
                component="span" 
                sx={{ 
                  display: 'inline-block',
                  width: '6px',
                  height: '12px',
                  bgcolor: '#00ff41',
                  ml: 0.5,
                  animation: 'blink 1s step-end infinite',
                  '@keyframes blink': {
                    '0%, 50%': { opacity: 1 },
                    '51%, 100%': { opacity: 0 }
                  }
                }} 
              />
            </Box>
          </Box>
        </Paper>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Welcome back, {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : 'User'}! 👋
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Keep up your mining streak and climb the leaderboard
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Mining Status Card */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              elevation={2}
              sx={{
                height: '100%',
              }}
            >
              <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                  Mining Status
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    my: 4
                  }}
                >
                  <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                    <CircularProgress
                      variant="determinate"
                      value={progressPercentage}
                      size={160}
                      thickness={4}
                      sx={{
                        color: mockDashboardData.mining.canMine
                          ? 'success.main'
                          : 'primary.main'
                      }}
                    />
                    <Box
                      sx={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column'
                      }}
                    >
                      {mockDashboardData.mining.canMine ? (
                        <>
                          <CheckCircle
                            sx={{ fontSize: 48, color: 'success.main', mb: 1 }}
                          />
                          <Typography variant="body2" fontWeight={600}>
                            Ready!
                          </Typography>
                        </>
                      ) : (
                        <>
                          <Typography variant="h6" fontWeight={700}>
                            {formatCountdown(timeUntilMine)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            until next mine
                          </Typography>
                        </>
                      )}
                    </Box>
                  </Box>
                </Box>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleMineNow}
                  disabled={!mockDashboardData.mining.canMine}
                  sx={{
                    textTransform: 'none',
                    mb: 2
                  }}
                >
                  {mockDashboardData.mining.canMine ? 'Mine Now' : 'Come Back Later'}
                </Button>
                <Stack direction="row" spacing={2} justifyContent="space-between">
                  <Box sx={{ textAlign: 'center', flex: 1 }}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="center"
                      spacing={0.5}
                    >
                      <LocalFireDepartment sx={{ color: 'warning.main' }} />
                      <Typography variant="h6" fontWeight={700}>
                        {mockDashboardData.user.miningStreak}
                      </Typography>
                    </Stack>
                    <Typography variant="caption" color="text.secondary">
                      Day Streak
                    </Typography>
                  </Box>
                  <Divider orientation="vertical" flexItem />
                  <Box sx={{ textAlign: 'center', flex: 1 }}>
                    <Typography variant="h6" fontWeight={700} color="primary.main">
                      {mockDashboardData.user.tokens.toLocaleString()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Total Tokens
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* My College Card */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card elevation={2} sx={{ height: '100%' }}>
              <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                  My College
                </Typography>
                <Stack spacing={3} sx={{ mt: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      sx={{
                        width: 64,
                        height: 64,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: 'primary.main'
                      }}
                    >
                      <School fontSize="large" />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" fontWeight={700}>
                        {user?.college?.name || 'College'}
                      </Typography>
                      <Chip
                        icon={getStatusIcon(mockDashboardData.college.status)}
                        label={mockDashboardData.college.status}
                        size="small"
                        color={getStatusColor(mockDashboardData.college.status)}
                        sx={{ mt: 0.5 }}
                      />
                    </Box>
                  </Box>
                  <Divider />
                  <Grid container spacing={2}>
                    <Grid size={6}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          bgcolor: alpha(theme.palette.primary.main, 0.05),
                          textAlign: 'center'
                        }}
                      >
                        <Typography variant="h5" fontWeight={700} color="primary.main">
                          {mockDashboardData.college.studentCount.toLocaleString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Students Mining
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid size={6}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          bgcolor: alpha(theme.palette.secondary.main, 0.05),
                          textAlign: 'center'
                        }}
                      >
                        <Typography variant="h5" fontWeight={700} color="secondary.main">
                          #{mockDashboardData.user.rank}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Your Rank
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                  <Button
                    component={Link}
                    to="/my-college"
                    variant="outlined"
                    fullWidth
                    endIcon={<ArrowForward />}
                    sx={{ textTransform: 'none' }}
                  >
                    View College Details
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Invite Friends Card */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card elevation={2}>
              <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ mb: 3 }}
                >
                  <Typography variant="h5" fontWeight={700}>
                    Invite Friends
                  </Typography>
                  <Share color="primary" />
                </Stack>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    borderRadius: 2,
                    border: `2px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
                    mb: 3
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    gutterBottom
                    display="block"
                  >
                    Your Referral Code
                  </Typography>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography
                      variant="h6"
                      className='font-mono select-all'
                    >
                      {mockDashboardData.referrals.code}
                    </Typography>
                    <Tooltip title={copying ? 'Copied!' : 'Copy code'}>
                      <IconButton
                        onClick={handleCopyReferralCode}
                        size="small"
                        color="primary"
                      >
                        <ContentCopy />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Box>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid size={6}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        bgcolor: alpha(theme.palette.success.main, 0.05),
                        textAlign: 'center'
                      }}
                    >
                      <Typography variant="h5" fontWeight={700} color="success.main">
                        {mockDashboardData.referrals.successfulReferrals}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Successful Referrals
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid size={6}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        bgcolor: alpha(theme.palette.warning.main, 0.05),
                        textAlign: 'center'
                      }}
                    >
                      <Typography variant="h5" fontWeight={700} color="warning.main">
                        {mockDashboardData.referrals.bonusTokens}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Bonus Tokens Earned
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Share with friends:
                </Typography>
                <Stack direction="row" spacing={1}>
                  {[
                    { icon: WhatsApp, color: '#25D366', label: 'WhatsApp' },
                    { icon: Facebook, color: '#1877F2', label: 'Facebook' },
                    { icon: Twitter, color: '#1DA1F2', label: 'Twitter' },
                    { icon: Email, color: '#EA4335', label: 'Email' }
                  ].map((social) => (
                    <Tooltip key={social.label} title={social.label}>
                      <IconButton
                        size="small"
                        sx={{
                          bgcolor: alpha(social.color, 0.1),
                          color: social.color,
                          '&:hover': {
                            bgcolor: alpha(social.color, 0.2)
                          }
                        }}
                      >
                        <social.icon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Activity Card */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card elevation={2}>
              <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                  Recent Activity
                </Typography>
                <Stack spacing={2} sx={{ mt: 3 }}>
                  {mockDashboardData.recentActivity.map((activity, index) => (
                    <Box
                      key={index}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.primary.main, 0.02),
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                      }}
                    >
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {activity.date}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {activity.time}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Chip
                            label={`+${activity.tokens} tokens`}
                            size="small"
                            color="success"
                            sx={{ fontWeight: 600 }}
                          />
                          {activity.bonus > 0 && (
                            <Typography
                              variant="caption"
                              color="warning.main"
                              display="block"
                              sx={{ mt: 0.5 }}
                            >
                              +{activity.bonus} bonus
                            </Typography>
                          )}
                        </Box>
                      </Stack>
                    </Box>
                  ))}
                </Stack>
                <Button
                  fullWidth
                  variant="text"
                  sx={{ mt: 2, textTransform: 'none' }}
                >
                  View All Activity
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Balance Breakdown Table */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card elevation={2}>
              <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                  Balance Breakdown
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Your token balance across all colleges
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                        <TableCell><strong>College</strong></TableCell>
                        <TableCell align="right"><strong>Balance</strong></TableCell>
                        <TableCell align="right"><strong>%</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {mockDashboardData.balances.map((item, index) => (
                        <TableRow
                          key={index}
                          sx={{
                            '&:hover': {
                              bgcolor: alpha(theme.palette.primary.main, 0.02)
                            }
                          }}
                        >
                          <TableCell>
                            <Box>
                              <Typography variant="body2" fontWeight={600}>
                                {item.college}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {item.country}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight={600} color="primary.main">
                              {item.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Chip
                              label={`${item.percentage}%`}
                              size="small"
                              sx={{
                                fontWeight: 600,
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                color: 'primary.main'
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.08) }}>
                        <TableCell>
                          <Typography variant="body2" fontWeight={700}>
                            Total
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight={700} color="primary.main">
                            {mockDashboardData.balances.reduce((sum, item) => sum + item.balance, 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Active Miners Table */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card elevation={2}>
              <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                  Active Miners
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Mining status for all your colleges
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                        <TableCell><strong>College</strong></TableCell>
                        <TableCell align="center"><strong>Status</strong></TableCell>
                        <TableCell align="right"><strong>Progress</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {mockDashboardData.activeMiners.map((miner, index) => (
                        <TableRow
                          key={index}
                          sx={{
                            '&:hover': {
                              bgcolor: alpha(theme.palette.primary.main, 0.02)
                            }
                          }}
                        >
                          <TableCell>
                            <Box>
                              <Typography variant="body2" fontWeight={600}>
                                {miner.college}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {miner.status === 'mining' ? miner.startTime : 'Not mining'}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              icon={miner.status === 'mining' ? <PlayArrow fontSize="small" /> : <Stop fontSize="small" />}
                              label={miner.status === 'mining' ? 'Mining' : 'Idle'}
                              size="small"
                              color={miner.status === 'mining' ? 'success' : 'default'}
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
                                    width: `${miner.progress}%`,
                                    height: '100%',
                                    bgcolor: miner.status === 'mining' ? 'success.main' : 'grey.400',
                                    transition: 'width 0.3s ease'
                                  }}
                                />
                              </Box>
                              <Typography variant="caption" fontWeight={600} sx={{ minWidth: 35 }}>
                                {miner.progress}%
                              </Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default StudentDashboard;
