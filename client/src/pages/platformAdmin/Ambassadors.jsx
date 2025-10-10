import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  CircularProgress,
  Alert,
  InputAdornment,
  Avatar,
  Grid,
  MenuItem
} from '@mui/material';
import {
  Search,
  Refresh,
  Close,
  CheckCircle,
  Cancel,
  HourglassEmpty,
  Visibility,
  Email,
  Phone
} from '@mui/icons-material';
import { ambassadorApi } from '../../api/ambassador.api';
import { useToast } from '../../contexts/ToastContext';
import DashboardLayout from '../../layouts/DashboardLayout';

const Ambassadors = () => {
  const { showToast } = useToast();

  // State
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [totalApplications, setTotalApplications] = useState(0);

  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    pending: 0,
    under_review: 0,
    approved: 0,
    rejected: 0
  });

  // Fetch applications
  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await ambassadorApi.getAllApplications();

      if (response.success) {
        setApplications(response.data.applications);
        setStats(response.data.stats);
        setTotalApplications(response.data.applications.length);
      }
    } catch (err) {
      setError(err.message || 'Failed to load applications');
      showToast(err.message || 'Failed to load applications', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleSearch = () => {
    setPage(0);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Filter applications
  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(search.toLowerCase()) ||
      app.email.toLowerCase().includes(search.toLowerCase()) ||
      (app.college?.name || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Paginate
  const paginatedApplications = filteredApplications.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // View application details
  const handleViewApplication = (application) => {
    setSelectedApplication(application);
    setViewDialogOpen(true);
  };

  // Update application status
  const handleUpdateStatus = async (applicationId, status, reviewNotes = '') => {
    try {
      setActionLoading(true);
      await ambassadorApi.updateApplicationStatus(applicationId, status, reviewNotes);
      showToast(`Application ${status.replace('_', ' ')} successfully`, 'success');
      fetchApplications();
    } catch (err) {
      showToast(err.message || 'Failed to update application status', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle sx={{ color: '#10b981' }} />;
      case 'rejected': return <Cancel sx={{ color: '#ef4444' }} />;
      case 'under_review': return <HourglassEmpty sx={{ color: '#f59e0b' }} />;
      default: return <Visibility sx={{ color: '#6b7280' }} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return { background: '#dcfce7', color: '#166534' };
      case 'rejected': return { background: '#fee2e2', color: '#991b1b' };
      case 'under_review': return { background: '#fef3c7', color: '#92400e' };
      default: return { background: '#e5e7eb', color: '#374151' };
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const sidebarStats = {
    ambassadorsCount: totalApplications
  };

  return (
    <DashboardLayout stats={sidebarStats}>
      <Box sx={{ maxWidth: '1400px', width: '100%', mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
              Campus Ambassador Applications
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage all campus ambassador applications
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={fetchApplications}
              sx={{
                borderColor: '#667eea',
                color: '#667eea',
                fontWeight: 600,
                '&:hover': {
                  borderColor: '#764ba2',
                  background: 'rgba(102, 126, 234, 0.04)'
                }
              }}
            >
              Refresh
            </Button>
          </Box>
        </Box>

        {/* Stats Cards */}
        <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
          <Card sx={{ flex: '1 1 220px', borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Pending</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#6b7280' }}>
                    {stats.pending}
                  </Typography>
                </Box>
                <Box sx={{
                  background: '#e5e7eb',
                  p: 1.5,
                  borderRadius: 2,
                  display: 'flex'
                }}>
                  <Visibility sx={{ color: '#6b7280', fontSize: 28 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ flex: '1 1 220px', borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Under Review</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#f59e0b' }}>
                    {stats.under_review}
                  </Typography>
                </Box>
                <Box sx={{
                  background: '#fef3c7',
                  p: 1.5,
                  borderRadius: 2,
                  display: 'flex'
                }}>
                  <HourglassEmpty sx={{ color: '#f59e0b', fontSize: 28 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ flex: '1 1 220px', borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Approved</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#10b981' }}>
                    {stats.approved}
                  </Typography>
                </Box>
                <Box sx={{
                  background: '#dcfce7',
                  p: 1.5,
                  borderRadius: 2,
                  display: 'flex'
                }}>
                  <CheckCircle sx={{ color: '#10b981', fontSize: 28 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ flex: '1 1 220px', borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Rejected</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#ef4444' }}>
                    {stats.rejected}
                  </Typography>
                </Box>
                <Box sx={{
                  background: '#fee2e2',
                  p: 1.5,
                  borderRadius: 2,
                  display: 'flex'
                }}>
                  <Cancel sx={{ color: '#ef4444', fontSize: 28 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Filters Bar */}
        <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                placeholder="Search by name, email, or college..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                  endAdornment: search && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => { setSearch(''); setPage(0); }}>
                        <Close />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              <TextField
                select
                label="Status"
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
                sx={{ minWidth: 180 }}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="under_review">Under Review</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
              </TextField>
            </Box>
          </CardContent>
        </Card>

        {/* Applications Table */}
        <Card sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <CardContent sx={{ p: 0 }}>
            {error && (
              <Alert severity="error" sx={{ m: 3 }}>
                {error}
              </Alert>
            )}

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: '#f8fafc' }}>
                        <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Applicant</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#475569' }}>College</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Year</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Submitted</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Status</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, color: '#475569' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedApplications.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                            <Typography variant="body2" color="text.secondary">
                              No applications found
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedApplications.map((application) => (
                          <TableRow key={application._id} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar
                                  sx={{
                                    background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                                    width: 40,
                                    height: 40
                                  }}
                                >
                                  {application.name.charAt(0).toUpperCase()}
                                </Avatar>
                                <Box>
                                  <Typography variant="body2" fontWeight={600}>
                                    {application.name}
                                  </Typography>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Email sx={{ fontSize: 12, color: '#64748b' }} />
                                    <Typography variant="caption" color="text.secondary">
                                      {application.email}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box>
                                <Typography variant="body2" fontWeight={600}>
                                  {application.college?.name || 'N/A'}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {application.college?.country}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={application.yearOfStudy}
                                size="small"
                                sx={{
                                  background: '#e0f2fe',
                                  color: '#075985',
                                  fontWeight: 600
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {formatDate(application.submittedAt)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                icon={getStatusIcon(application.status)}
                                label={application.status.replace('_', ' ').toUpperCase()}
                                size="small"
                                sx={{
                                  ...getStatusColor(application.status),
                                  fontWeight: 600,
                                  textTransform: 'capitalize'
                                }}
                              />
                            </TableCell>
                            <TableCell align="right">
                              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                <IconButton
                                  size="small"
                                  onClick={() => handleViewApplication(application)}
                                  sx={{ color: '#667eea' }}
                                >
                                  <Visibility fontSize="small" />
                                </IconButton>
                                {application.status === 'pending' && (
                                  <>
                                    <Button
                                      size="small"
                                      variant="outlined"
                                      onClick={() => handleUpdateStatus(application._id, 'under_review')}
                                      disabled={actionLoading}
                                      sx={{
                                        borderColor: '#f59e0b',
                                        color: '#f59e0b',
                                        fontWeight: 600,
                                        '&:hover': {
                                          borderColor: '#d97706',
                                          background: 'rgba(245, 158, 11, 0.04)'
                                        }
                                      }}
                                    >
                                      Review
                                    </Button>
                                    <Button
                                      size="small"
                                      variant="contained"
                                      onClick={() => handleUpdateStatus(application._id, 'approved')}
                                      disabled={actionLoading}
                                      sx={{
                                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                        fontWeight: 600,
                                        '&:hover': {
                                          background: 'linear-gradient(135deg, #059669 0%, #047857 100%)'
                                        }
                                      }}
                                    >
                                      Approve
                                    </Button>
                                    <Button
                                      size="small"
                                      variant="outlined"
                                      onClick={() => handleUpdateStatus(application._id, 'rejected')}
                                      disabled={actionLoading}
                                      sx={{
                                        borderColor: '#ef4444',
                                        color: '#ef4444',
                                        fontWeight: 600,
                                        '&:hover': {
                                          borderColor: '#dc2626',
                                          background: 'rgba(239, 68, 68, 0.04)'
                                        }
                                      }}
                                    >
                                      Reject
                                    </Button>
                                  </>
                                )}
                                {application.status === 'under_review' && (
                                  <>
                                    <Button
                                      size="small"
                                      variant="contained"
                                      onClick={() => handleUpdateStatus(application._id, 'approved')}
                                      disabled={actionLoading}
                                      sx={{
                                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                        fontWeight: 600,
                                        '&:hover': {
                                          background: 'linear-gradient(135deg, #059669 0%, #047857 100%)'
                                        }
                                      }}
                                    >
                                      Approve
                                    </Button>
                                    <Button
                                      size="small"
                                      variant="outlined"
                                      onClick={() => handleUpdateStatus(application._id, 'rejected')}
                                      disabled={actionLoading}
                                      sx={{
                                        borderColor: '#ef4444',
                                        color: '#ef4444',
                                        fontWeight: 600,
                                        '&:hover': {
                                          borderColor: '#dc2626',
                                          background: 'rgba(239, 68, 68, 0.04)'
                                        }
                                      }}
                                    >
                                      Reject
                                    </Button>
                                  </>
                                )}
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>

                <TablePagination
                  component="div"
                  count={filteredApplications.length}
                  page={page}
                  onPageChange={(e, newPage) => setPage(newPage)}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value, 10));
                    setPage(0);
                  }}
                  rowsPerPageOptions={[10, 25, 50, 100]}
                />
              </>
            )}
          </CardContent>
        </Card>

        {/* View Application Details Dialog */}
        <Dialog
          open={viewDialogOpen}
          onClose={() => setViewDialogOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
            }
          }}
        >
          <DialogTitle sx={{ fontWeight: 700, borderBottom: '1px solid #e5e7eb' }}>
            Application Details
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            {selectedApplication && (
              <Box>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Applicant Information</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" color="text.secondary">Full Name</Typography>
                    <Typography variant="body2" fontWeight={600}>{selectedApplication.name}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" color="text.secondary">Email</Typography>
                    <Typography variant="body2" fontWeight={600}>{selectedApplication.email}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" color="text.secondary">Phone</Typography>
                    <Typography variant="body2" fontWeight={600}>{selectedApplication.phone || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" color="text.secondary">Year of Study</Typography>
                    <Typography variant="body2" fontWeight={600}>{selectedApplication.yearOfStudy}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" color="text.secondary">College</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {selectedApplication.college?.name || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" color="text.secondary">Submitted Date</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {formatDate(selectedApplication.submittedAt)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" color="text.secondary">Status</Typography>
                    <Box sx={{ mt: 0.5 }}>
                      <Chip
                        icon={getStatusIcon(selectedApplication.status)}
                        label={selectedApplication.status.replace('_', ' ').toUpperCase()}
                        size="small"
                        sx={{
                          ...getStatusColor(selectedApplication.status),
                          fontWeight: 600,
                          textTransform: 'capitalize'
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">Why do you want to be an ambassador?</Typography>
                    <Typography variant="body2" sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>
                      {selectedApplication.whyAmbassador || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">Experience and Skills</Typography>
                    <Typography variant="body2" sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>
                      {selectedApplication.experience || 'N/A'}
                    </Typography>
                  </Grid>
                  {selectedApplication.reviewNotes && (
                    <Grid item xs={12}>
                      <Typography variant="caption" color="text.secondary">Review Notes</Typography>
                      <Typography variant="body2" sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>
                        {selectedApplication.reviewNotes}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2.5, borderTop: '1px solid #e5e7eb' }}>
            <Button onClick={() => setViewDialogOpen(false)} sx={{ color: '#64748b', fontWeight: 600 }}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DashboardLayout>
  );
};

export default Ambassadors;
