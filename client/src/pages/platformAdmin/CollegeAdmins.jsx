import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
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
  Chip,
  CircularProgress,
  Alert,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip
} from '@mui/material';
import {
  Search,
  Visibility,
  Edit,
  Refresh,
  Close,
  PersonRemove,
  Email,
  Phone,
  CalendarToday,
  School
} from '@mui/icons-material';
import { platformAdminApi } from '../../api/platformAdmin.api';
import { useToast } from '../../contexts/ToastContext';
import DashboardLayout from '../../layouts/DashboardLayout';

const CollegeAdmins = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();

  // State for college admins list
  const [collegeAdmins, setCollegeAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [total, setTotal] = useState(0);

  // Remove admin dialog
  const [removeAdminDialogOpen, setRemoveAdminDialogOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [removingAdmin, setRemovingAdmin] = useState(false);

  // Fetch college admins
  const fetchCollegeAdmins = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await platformAdminApi.getAllCollegeAdmins({
        search: search,
        page: page + 1,
        limit: rowsPerPage
      });

      if (response.success) {
        setCollegeAdmins(response.data);
        setTotal(response.pagination.total);
      }
    } catch (err) {
      setError(err.message || 'Failed to load college admins');
      showToast(err.message || 'Failed to load college admins', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollegeAdmins();
  }, [page, rowsPerPage]);

  const handleSearch = () => {
    setPage(0);
    fetchCollegeAdmins();
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewCollegeAdmin = (id) => {
    navigate(`/platform-admin/college-admins/${id}`);
  };

  const handleEditCollegeAdmin = (id) => {
    navigate(`/platform-admin/college-admins/${id}?edit=true`);
  };

  const handleRemoveAdminClick = (admin) => {
    setSelectedAdmin(admin);
    setRemoveAdminDialogOpen(true);
  };

  const handleRemoveAdminConfirm = async () => {
    if (!selectedAdmin) return;

    try {
      setRemovingAdmin(true);
      const response = await platformAdminApi.removeCollegeAdmin(selectedAdmin._id);

      if (response.success) {
        showToast('College admin status removed successfully', 'success');
        setRemoveAdminDialogOpen(false);
        setSelectedAdmin(null);
        fetchCollegeAdmins();
      }
    } catch (err) {
      showToast(err.message || 'Failed to remove college admin', 'error');
    } finally {
      setRemovingAdmin(false);
    }
  };

  const sidebarStats = {
    collegeAdminsCount: total
  };

  return (
    <DashboardLayout stats={sidebarStats}>
      <Box sx={{ maxWidth: '1400px', width: '100%', mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
              College Admins
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage administrators for all colleges
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={fetchCollegeAdmins}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              fontWeight: 600,
              '&:hover': {
                background: 'linear-gradient(135deg, #5a67d8 0%, #6b42a0 100%)',
              }
            }}
          >
            Refresh
          </Button>
        </Box>

        {/* Search Bar */}
        <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <CardContent sx={{ p: 3 }}>
            <TextField
              fullWidth
              placeholder="Search college admins by name or email..."
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
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSearch('');
                        setPage(0);
                        fetchCollegeAdmins();
                      }}
                    >
                      <Close />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </CardContent>
        </Card>

        {/* College Admins Table */}
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
                        <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Admin</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Contact</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Managed College</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Joined</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, color: '#475569' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {collegeAdmins.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                            <Typography variant="body2" color="text.secondary">
                              No college admins found
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        collegeAdmins.map((admin) => (
                          <TableRow key={admin._id} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                            <TableCell>
                              <Box>
                                <Typography variant="body2" fontWeight={600}>
                                  {admin.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  ID: {admin._id.slice(-8)}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <Email sx={{ fontSize: 14, color: '#64748b' }} />
                                  <Typography variant="body2">{admin.email}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <Phone sx={{ fontSize: 14, color: '#64748b' }} />
                                  <Typography variant="caption" color="text.secondary">
                                    {admin.phone}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              {admin.managedCollege ? (
                                <Button
                                  size="small"
                                  startIcon={<School sx={{ fontSize: 16 }} />}
                                  onClick={() => navigate(`/platform-admin/colleges/${admin.managedCollege._id}`)}
                                  sx={{ textTransform: 'none', justifyContent: 'flex-start', textAlign: 'left' }}
                                >
                                  <Box>
                                    <Typography variant="body2" sx={{ lineHeight: 1.2 }}>
                                      {admin.managedCollege.name}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                      {admin.managedCollege.country}
                                    </Typography>
                                  </Box>
                                </Button>
                              ) : (
                                <Chip label="No College" size="small" color="warning" variant="outlined" />
                              )}
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={admin.isActive ? 'Active' : 'Inactive'}
                                size="small"
                                color={admin.isActive ? 'success' : 'default'}
                                sx={{ fontWeight: 600 }}
                              />
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <CalendarToday sx={{ fontSize: 14, color: '#64748b' }} />
                                <Typography variant="caption" color="text.secondary">
                                  {formatDate(admin.createdAt)}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="right">
                              <IconButton
                                size="small"
                                onClick={() => handleViewCollegeAdmin(admin._id)}
                                sx={{ color: '#667eea' }}
                              >
                                <Visibility fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleEditCollegeAdmin(admin._id)}
                                sx={{ color: '#06b6d4' }}
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                              <Tooltip title="Remove Admin Status">
                                <IconButton
                                  size="small"
                                  onClick={() => handleRemoveAdminClick(admin)}
                                  sx={{ color: '#f59e0b' }}
                                >
                                  <PersonRemove fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>

                <TablePagination
                  component="div"
                  count={total}
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

        {/* Remove Admin Confirmation Dialog */}
        <Dialog
          open={removeAdminDialogOpen}
          onClose={() => setRemoveAdminDialogOpen(false)}
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
            }
          }}
        >
          <DialogTitle sx={{ fontWeight: 700 }}>Remove College Admin Status</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to remove <strong>{selectedAdmin?.name}</strong> as admin of <strong>{selectedAdmin?.managedCollege?.name}</strong>?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              This will:
            </Typography>
            <Box component="ul" sx={{ mt: 1, pl: 2 }}>
              <Typography component="li" variant="body2" color="text.secondary">
                Change user role to 'user'
              </Typography>
              <Typography component="li" variant="body2" color="text.secondary">
                Disconnect user from the college
              </Typography>
              <Typography component="li" variant="body2" color="text.secondary">
                Reset college status to 'Unaffiliated' if applicable
              </Typography>
              <Typography component="li" variant="body2" color="text.secondary">
                Send a notification email to the user
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setRemoveAdminDialogOpen(false)} sx={{ color: '#64748b', fontWeight: 600 }}>
              Cancel
            </Button>
            <Button
              onClick={handleRemoveAdminConfirm}
              variant="contained"
              disabled={removingAdmin}
              sx={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                fontWeight: 700,
                '&:hover': {
                  background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                }
              }}
            >
              {removingAdmin ? <CircularProgress size={20} /> : 'Remove Admin'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DashboardLayout>
  );
};

export default CollegeAdmins;

