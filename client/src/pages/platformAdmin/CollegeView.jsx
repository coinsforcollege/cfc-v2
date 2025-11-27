import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Tabs,
  Tab,
  Chip,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  Avatar,
  Stack,
  Card,
  CardContent,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Edit,
  Delete,
  ArrowBack,
  School,
  Person,
  Group,
  Timer,
  Search,
  AccountBalanceWallet,
  Email,
  Phone,
  Language,
  LocationOn,
  Warning,
  CheckCircle,
  AddLink
} from '@mui/icons-material';
import { platformAdminApi } from '../../api/platformAdmin.api';
import { useToast } from '../../contexts/ToastContext';
import { format } from 'date-fns';
import DashboardLayout from '../../layouts/DashboardLayout';

const CollegeView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [college, setCollege] = useState(null);
  const [stats, setStats] = useState({ minersCount: 0, activeSessionsCount: 0 });

  // Miners Tab State
  const [miners, setMiners] = useState([]);
  const [minersLoading, setMinersLoading] = useState(false);
  const [minersPage, setMinersPage] = useState(0);
  const [minersRowsPerPage, setMinersRowsPerPage] = useState(10);
  const [minersTotal, setMinersTotal] = useState(0);
  const [minersSearch, setMinersSearch] = useState('');

  // Sessions Tab State
  const [sessions, setSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [sessionsPage, setSessionsPage] = useState(0);
  const [sessionsRowsPerPage, setSessionsRowsPerPage] = useState(10);
  const [sessionsTotal, setSessionsTotal] = useState(0);
  const [sessionsStatus, setSessionsStatus] = useState('all');

  useEffect(() => {
    fetchCollegeDetails();
  }, [id]);

  useEffect(() => {
    if (currentTab === 1) {
      fetchMiners();
    } else if (currentTab === 2) {
      fetchSessions();
    }
  }, [currentTab, minersPage, minersRowsPerPage, minersSearch, sessionsPage, sessionsRowsPerPage, sessionsStatus]);

  const fetchCollegeDetails = async () => {
    try {
      setLoading(true);
      const response = await platformAdminApi.getCollegeDetails(id);
      if (response.success && response.data) {
        setCollege(response.data.college);
        setStats({
          minersCount: response.data.minersCount || 0,
          activeSessionsCount: response.data.activeSessionsCount || 0
        });
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching college details:', err);
      setError('Failed to load college details');
    } finally {
      setLoading(false);
    }
  };

  const fetchMiners = async () => {
    try {
      setMinersLoading(true);
      const response = await platformAdminApi.getCollegeMiners(id, {
        page: minersPage + 1,
        limit: minersRowsPerPage,
        search: minersSearch
      });
      if (response.success && response.data) {
        setMiners(response.data);
        setMinersTotal(response.pagination?.total || 0);
      }
    } catch (err) {
      console.error('Error fetching miners:', err);
      showToast('Failed to load miners', 'error');
    } finally {
      setMinersLoading(false);
    }
  };

  const fetchSessions = async () => {
    try {
      setSessionsLoading(true);
      const response = await platformAdminApi.getCollegeSessions(id, {
        page: sessionsPage + 1,
        limit: sessionsRowsPerPage,
        status: sessionsStatus === 'all' ? undefined : sessionsStatus
      });
      if (response.success && response.data) {
        setSessions(response.data);
        setSessionsTotal(response.pagination?.total || 0);
      }
    } catch (err) {
      console.error('Error fetching sessions:', err);
      showToast('Failed to load sessions', 'error');
    } finally {
      setSessionsLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Live': return 'success';
      case 'Building': return 'info';
      case 'Waitlist': return 'warning';
      default: return 'default';
    }
  };

  // Dummy stats object for layout
  const sidebarStats = {
    // You might want to fetch global stats here or pass them down
  };

  if (loading) {
    return (
      <DashboardLayout stats={sidebarStats}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }

  if (error || !college) {
    return (
      <DashboardLayout stats={sidebarStats}>
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Alert severity="error">{error || 'College not found'}</Alert>
          <Button startIcon={<ArrowBack />} onClick={() => navigate('/platform-admin/colleges')} sx={{ mt: 2 }}>
            Back to Colleges
          </Button>
        </Container>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout stats={sidebarStats}>
      <Box sx={{ maxWidth: '1400px', width: '100%', mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        <IconButton onClick={() => navigate('/platform-admin/colleges')}>
          <ArrowBack />
        </IconButton>
        <Avatar src={college.logo} alt={college.name} sx={{ width: 56, height: 56, border: '1px solid #eee' }}>
          <School />
        </Avatar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" fontWeight={700}>
            {college.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
            <Chip 
              label={college.status} 
              color={getStatusColor(college.status)} 
              size="small" 
              sx={{ fontWeight: 600 }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <LocationOn fontSize="small" />
              {college.city}, {college.country}
            </Typography>
          </Box>
        </Box>
        <Button 
          variant="outlined" 
          startIcon={<Edit />} 
          onClick={() => navigate(`/platform-admin/colleges/${id}/edit`)}
        >
          Edit
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card elevation={0} sx={{ border: '1px solid #e0e0e0', height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">Total Miners</Typography>
              <Typography variant="h4" fontWeight={700} sx={{ my: 1 }}>
                {stats.minersCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Users
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card elevation={0} sx={{ border: '1px solid #e0e0e0', height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">Active Sessions</Typography>
              <Typography variant="h4" fontWeight={700} sx={{ my: 1, color: 'success.main' }}>
                {stats.activeSessionsCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Currently Mining
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card elevation={0} sx={{ border: '1px solid #e0e0e0', height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">Total Tokens Mined</Typography>
              <Typography variant="h4" fontWeight={700} sx={{ my: 1, color: 'primary.main' }}>
                {college.stats?.totalTokensMined?.toFixed(2) || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Lifetime
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card elevation={0} sx={{ border: '1px solid #e0e0e0', height: '100%', bgcolor: college.admin ? 'success.light' : 'warning.light', bgOpacity: 0.1 }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">Admin Status</Typography>
              {college.admin ? (
                <>
                  <Typography variant="h6" fontWeight={600} sx={{ my: 1 }}>
                    {college.admin.name}
                  </Typography>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Email fontSize="small" /> {college.admin.email}
                  </Typography>
                </>
              ) : (
                <>
                  <Typography variant="h5" fontWeight={700} sx={{ my: 1 }}>
                    Unclaimed
                  </Typography>
                  <Button 
                    size="small" 
                    variant="contained" 
                    color="primary"
                    onClick={() => navigate(`/platform-admin/users?assignCollege=${id}`)}
                  >
                    Assign Admin
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={currentTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Overview" />
          <Tab label={`Miners (${stats.minersCount})`} />
          <Tab label={`Sessions (${stats.activeSessionsCount} active)`} />
        </Tabs>

        {/* Overview Tab */}
        {currentTab === 0 && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>About</Typography>
                <Typography variant="body1" paragraph>
                  {college.description || 'No description available.'}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>Contact Information</Typography>
                <Stack spacing={1}>
                  {college.website && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Language color="action" />
                      <a href={college.website.startsWith('http') ? college.website : `https://${college.website}`} target="_blank" rel="noreferrer">
                        {college.website}
                      </a>
                    </Box>
                  )}
                  {college.phone && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Phone color="action" />
                      <Typography>{college.phone}</Typography>
                    </Box>
                  )}
                  {college.email && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Email color="action" />
                      <Typography>{college.email}</Typography>
                    </Box>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Earning Rates</Typography>
                <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">Base Rate</Typography>
                      <Typography variant="h5" color="primary.main">{college.baseRate} / hr</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">Referral Bonus</Typography>
                      <Typography variant="h5" color="success.main">+{college.referralBonusRate} / hr</Typography>
                    </Grid>
                  </Grid>
                </Paper>
                
                {college.admin && (
                  <>
                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Admin Actions</Typography>
                    <Stack direction="row" spacing={2}>
                      <Button 
                        variant="outlined" 
                        color="error"
                        onClick={async () => {
                          if (window.confirm(`Are you sure you want to remove ${college.admin.name} as admin?`)) {
                            try {
                              await platformAdminApi.removeCollegeAdmin(college.admin._id);
                              showToast('Admin removed successfully', 'success');
                              fetchCollegeDetails(); // Refresh
                            } catch (err) {
                              showToast('Failed to remove admin', 'error');
                            }
                          }
                        }}
                      >
                        Remove Admin
                      </Button>
                      <Button 
                        variant="outlined"
                        onClick={() => navigate(`/platform-admin/college-admins/${college.admin._id}`)}
                      >
                        View Admin Profile
                      </Button>
                    </Stack>
                  </>
                )}
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Miners Tab */}
        {currentTab === 1 && (
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', mb: 2 }}>
              <TextField
                size="small"
                placeholder="Search miners..."
                value={minersSearch}
                onChange={(e) => setMinersSearch(e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
                }}
                sx={{ width: 300 }}
              />
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Joined</TableCell>
                    <TableCell align="right">Wallet Balance</TableCell>
                    <TableCell align="right">Total Mined</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {minersLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center"><CircularProgress size={24} /></TableCell>
                    </TableRow>
                  ) : miners.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">No miners found</TableCell>
                    </TableRow>
                  ) : (
                    miners.map((miner) => (
                      <TableRow key={miner._id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 32, height: 32 }}>{miner.name?.charAt(0)}</Avatar>
                            {miner.name}
                          </Box>
                        </TableCell>
                        <TableCell>{miner.email}</TableCell>
                        <TableCell>{format(new Date(miner.createdAt), 'MMM d, yyyy')}</TableCell>
                        <TableCell align="right">
                          <Chip label={miner.wallet.balance.toFixed(2)} size="small" color="primary" variant="outlined" />
                        </TableCell>
                        <TableCell align="right">{miner.wallet.totalMined.toFixed(2)}</TableCell>
                        <TableCell align="center">
                          <IconButton size="small" onClick={() => navigate(`/platform-admin/users/${miner._id}`)}>
                            <Person fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={minersTotal}
              page={minersPage}
              onPageChange={(e, newPage) => setMinersPage(newPage)}
              rowsPerPage={minersRowsPerPage}
              onRowsPerPageChange={(e) => setMinersRowsPerPage(parseInt(e.target.value, 10))}
            />
          </Box>
        )}

        {/* Sessions Tab */}
        {currentTab === 2 && (
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', mb: 2, gap: 2 }}>
              <Button 
                variant={sessionsStatus === 'all' ? 'contained' : 'outlined'} 
                onClick={() => setSessionsStatus('all')}
                size="small"
              >
                All
              </Button>
              <Button 
                variant={sessionsStatus === 'active' ? 'contained' : 'outlined'} 
                onClick={() => setSessionsStatus('active')}
                size="small"
                color="success"
              >
                Active
              </Button>
              <Button 
                variant={sessionsStatus === 'completed' ? 'contained' : 'outlined'} 
                onClick={() => setSessionsStatus('completed')}
                size="small"
                color="info"
              >
                Completed
              </Button>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Status</TableCell>
                    <TableCell>Miner</TableCell>
                    <TableCell>Start Time</TableCell>
                    <TableCell>Duration/End</TableCell>
                    <TableCell align="right">Tokens Earned</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sessionsLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center"><CircularProgress size={24} /></TableCell>
                    </TableRow>
                  ) : sessions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">No mining sessions found</TableCell>
                    </TableRow>
                  ) : (
                    sessions.map((session) => (
                      <TableRow key={session._id}>
                        <TableCell>
                          <Chip 
                            label={session.isActive ? 'Active' : 'Completed'} 
                            color={session.isActive ? 'success' : 'default'} 
                            size="small" 
                          />
                        </TableCell>
                        <TableCell>
                          {session.user ? session.user.name : 'Unknown User'}
                        </TableCell>
                        <TableCell>{format(new Date(session.startTime), 'MMM d, HH:mm')}</TableCell>
                        <TableCell>
                          {session.isActive 
                            ? <Typography variant="caption" color="success.main">Currently Mining</Typography>
                            : format(new Date(session.endTime), 'MMM d, HH:mm')
                          }
                        </TableCell>
                        <TableCell align="right">
                          {session.isActive 
                            ? '-' 
                            : <Chip label={session.tokensEarned?.toFixed(4)} size="small" />
                          }
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={sessionsTotal}
              page={sessionsPage}
              onPageChange={(e, newPage) => setSessionsPage(newPage)}
              rowsPerPage={sessionsRowsPerPage}
              onRowsPerPageChange={(e) => setSessionsRowsPerPage(parseInt(e.target.value, 10))}
            />
          </Box>
        )}
      </Paper>
      </Box>
    </DashboardLayout>
  );
};

export default CollegeView;

