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
  InputAdornment
} from '@mui/material';
import {
  Search,
  Refresh,
  Close,
  Delete,
  FileDownload,
  Email,
  CheckCircle,
  Cancel
} from '@mui/icons-material';
import { useToast } from '../../contexts/ToastContext';
import DashboardLayout from '../../layouts/DashboardLayout';
import apiClient from '../../api/apiClient';

const Subscribers = () => {
  const { showToast } = useToast();

  // State
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSubscriber, setSelectedSubscriber] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch subscribers
  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await apiClient.get('/blog/subscribers');

      if (response.success) {
        setSubscribers(response.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load subscribers');
      showToast(err.message || 'Failed to load subscribers', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleSearch = () => {
    setPage(0);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Filter subscribers
  const filteredSubscribers = subscribers.filter(subscriber =>
    subscriber.email.toLowerCase().includes(search.toLowerCase()) ||
    (subscriber.name || '').toLowerCase().includes(search.toLowerCase())
  );

  // Paginate
  const paginatedSubscribers = filteredSubscribers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Delete subscriber
  const handleDeleteClick = (subscriber) => {
    setSelectedSubscriber(subscriber);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setActionLoading(true);
      const response = await apiClient.delete(`/blog/subscribers/${selectedSubscriber.id}`);

      if (response.success) {
        showToast('Subscriber deleted successfully', 'success');
        setDeleteDialogOpen(false);
        fetchSubscribers();
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete subscriber', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    const csv = subscribers.map(s =>
      `${s.email},${s.name || ''},${s.active ? 'Active' : 'Unsubscribed'},${new Date(s.createdAt).toLocaleDateString()}`
    ).join('\n');
    const blob = new Blob(['Email,Name,Status,Subscribed Date\n' + csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscribers_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    showToast('CSV exported successfully', 'success');
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const activeCount = subscribers.filter(s => s.active).length;
  const inactiveCount = subscribers.filter(s => !s.active).length;

  const sidebarStats = {
    subscribersCount: subscribers.length
  };

  return (
    <DashboardLayout stats={sidebarStats}>
      <Box sx={{ maxWidth: '1400px', width: '100%', mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
              Newsletter Subscribers
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage all newsletter subscribers
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={fetchSubscribers}
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
            <Button
              variant="contained"
              startIcon={<FileDownload />}
              onClick={handleExportCSV}
              disabled={subscribers.length === 0}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                fontWeight: 600,
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a67d8 0%, #6b42a0 100%)'
                }
              }}
            >
              Export to CSV
            </Button>
          </Box>
        </Box>

        {/* Stats Cards */}
        <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
          <Card sx={{ flex: '1 1 280px', borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Total Subscribers</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#667eea' }}>
                    {subscribers.length}
                  </Typography>
                </Box>
                <Box sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  p: 1.5,
                  borderRadius: 2,
                  display: 'flex'
                }}>
                  <Email sx={{ color: 'white', fontSize: 28 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ flex: '1 1 280px', borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Active</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#10b981' }}>
                    {activeCount}
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

          <Card sx={{ flex: '1 1 280px', borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Unsubscribed</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#6b7280' }}>
                    {inactiveCount}
                  </Typography>
                </Box>
                <Box sx={{
                  background: '#e5e7eb',
                  p: 1.5,
                  borderRadius: 2,
                  display: 'flex'
                }}>
                  <Cancel sx={{ color: '#6b7280', fontSize: 28 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Search Bar */}
        <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <CardContent sx={{ p: 3 }}>
            <TextField
              fullWidth
              placeholder="Search by email or name..."
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
          </CardContent>
        </Card>

        {/* Subscribers Table */}
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
                        <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Email</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Name</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Subscribed Date</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, color: '#475569' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedSubscribers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                            <Typography variant="body2" color="text.secondary">
                              No subscribers found
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedSubscribers.map((subscriber) => (
                          <TableRow key={subscriber.id} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Email sx={{ fontSize: 16, color: '#667eea' }} />
                                <Typography variant="body2" fontWeight={600}>
                                  {subscriber.email}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {subscriber.name || '-'}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={subscriber.active ? 'Active' : 'Unsubscribed'}
                                size="small"
                                sx={{
                                  background: subscriber.active
                                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                                    : '#e5e7eb',
                                  color: subscriber.active ? 'white' : '#6b7280',
                                  fontWeight: 600
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {formatDate(subscriber.createdAt)}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteClick(subscriber)}
                                sx={{ color: '#ef4444' }}
                              >
                                <Delete fontSize="small" />
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
                  count={filteredSubscribers.length}
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

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
            }
          }}
        >
          <DialogTitle sx={{ fontWeight: 700 }}>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete the subscriber {selectedSubscriber?.email}? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setDeleteDialogOpen(false)} sx={{ color: '#64748b', fontWeight: 600 }}>
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              variant="contained"
              disabled={actionLoading}
              sx={{
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                fontWeight: 700,
                '&:hover': {
                  background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                }
              }}
            >
              {actionLoading ? <CircularProgress size={20} /> : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DashboardLayout>
  );
};

export default Subscribers;
