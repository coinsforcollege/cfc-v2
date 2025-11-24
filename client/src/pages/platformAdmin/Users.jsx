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
  Tabs,
  Tab,
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
  Delete,
  Refresh,
  Close,
  PersonRemove
} from '@mui/icons-material';
import { platformAdminApi } from '../../api/platformAdmin.api';
import { useToast } from '../../contexts/ToastContext';
import DashboardLayout from '../../layouts/DashboardLayout';

const Users = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Tab state
  const [currentTab, setCurrentTab] = useState(0);

  // State for users list
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [errorUsers, setErrorUsers] = useState('');
  const [searchUsers, setSearchUsers] = useState('');
  const [pageUsers, setPageUsers] = useState(0);
  const [rowsPerPageUsers, setRowsPerPageUsers] = useState(25);
  const [totalUsers, setTotalUsers] = useState(0);

  // State for college admins list
  const [collegeAdmins, setCollegeAdmins] = useState([]);
  const [loadingCollegeAdmins, setLoadingCollegeAdmins] = useState(true);
  const [errorCollegeAdmins, setErrorCollegeAdmins] = useState('');
  const [searchCollegeAdmins, setSearchCollegeAdmins] = useState('');
  const [pageCollegeAdmins, setPageCollegeAdmins] = useState(0);
  const [rowsPerPageCollegeAdmins, setRowsPerPageCollegeAdmins] = useState(25);
  const [totalCollegeAdmins, setTotalCollegeAdmins] = useState(0);

  // Remove admin dialog
  const [removeAdminDialogOpen, setRemoveAdminDialogOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [removingAdmin, setRemovingAdmin] = useState(false);

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      setErrorUsers('');
      const response = await platformAdminApi.getAllStudents({
        search: searchUsers,
        page: pageUsers + 1,
        limit: rowsPerPageUsers
      });

      if (response.success) {
        setUsers(response.data);
        setTotalUsers(response.pagination.total);
      }
    } catch (err) {
      setErrorUsers(err.message || 'Failed to load users');
      showToast(err.message || 'Failed to load users', 'error');
    } finally {
      setLoadingUsers(false);
    }
  };

  // Fetch college admins
  const fetchCollegeAdmins = async () => {
    try {
      setLoadingCollegeAdmins(true);
      setErrorCollegeAdmins('');
      const response = await platformAdminApi.getAllCollegeAdmins({
        search: searchCollegeAdmins,
        page: pageCollegeAdmins + 1,
        limit: rowsPerPageCollegeAdmins
      });

      if (response.success) {
        setCollegeAdmins(response.data);
        setTotalCollegeAdmins(response.pagination.total);
      }
    } catch (err) {
      setErrorCollegeAdmins(err.message || 'Failed to load college admins');
      showToast(err.message || 'Failed to load college admins', 'error');
    } finally {
      setLoadingCollegeAdmins(false);
    }
  };

  useEffect(() => {
    if (currentTab === 0) {
      fetchUsers();
    } else {
      fetchCollegeAdmins();
    }
  }, [currentTab, pageUsers, rowsPerPageUsers, pageCollegeAdmins, rowsPerPageCollegeAdmins]);

  const handleSearchUsers = () => {
    setPageUsers(0);
    fetchUsers();
  };

  const handleSearchCollegeAdmins = () => {
    setPageCollegeAdmins(0);
    fetchCollegeAdmins();
  };

  const handleSearchKeyPress = (e, type) => {
    if (e.key === 'Enter') {
      if (type === 'users') {
        handleSearchUsers();
      } else {
        handleSearchCollegeAdmins();
      }
    }
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
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

  const handleViewUser = (id) => {
    navigate(`/platform-admin/users/${id}`);
  };

  const handleEditUser = (id) => {
    navigate(`/platform-admin/users/${id}?edit=true`);
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
    usersCount: totalUsers,
    collegeAdminsCount: totalCollegeAdmins
  };

  return (
    <DashboardLayout stats={sidebarStats}>
      <Box sx={{ maxWidth: '1400px', width: '100%', mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
              Users
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage all platform users
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={currentTab === 0 ? fetchUsers : fetchCollegeAdmins}
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

        {/* Tabs */}
        <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              px: 3,
              '& .MuiTab-root': {
                fontWeight: 600,
                fontSize: '0.95rem',
                textTransform: 'none'
              }
            }}
          >
            <Tab label={`Students (${totalUsers})`} />
            <Tab label={`College Admins (${totalCollegeAdmins})`} />
          </Tabs>
        </Card>

        {/* Search Bar */}
        <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <CardContent sx={{ p: 3 }}>
            <TextField
              fullWidth
              placeholder={currentTab === 0 ? 'Search users by name or email...' : 'Search college admins by name or email...'}
              value={currentTab === 0 ? searchUsers : searchCollegeAdmins}
              onChange={(e) => currentTab === 0 ? setSearchUsers(e.target.value) : setSearchCollegeAdmins(e.target.value)}
              onKeyPress={(e) => handleSearchKeyPress(e, currentTab === 0 ? 'users' : 'college-admins')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
                endAdornment: ((currentTab === 0 && searchUsers) || (currentTab === 1 && searchCollegeAdmins)) && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => {
                        if (currentTab === 0) {
                          setSearchUsers('');
                          setPageUsers(0);
                          fetchUsers();
                        } else {
                          setSearchCollegeAdmins('');
                          setPageCollegeAdmins(0);
                          fetchCollegeAdmins();
                        }
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

        {/* Students Table */}
        {currentTab === 0 && (
          <Card sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ p: 0 }}>
              {errorUsers && (
                <Alert severity="error" sx={{ m: 3 }}>
                  {errorUsers}
                </Alert>
              )}

              {loadingUsers ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                  <CircularProgress />
                </Box>
              ) : (
                <>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ bgcolor: '#f8fafc' }}>
                          <TableCell sx={{ fontWeight: 700, color: '#475569' }}>User</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Contact</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: '#475569' }}>College</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Referrals</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Joined</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 700, color: '#475569' }}>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {users.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                              <Typography variant="body2" color="text.secondary">
                                No users found
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ) : (
                          users.map((user) => (
                            <TableRow key={user._id} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                              <TableCell>
                                <Box>
                                  <Typography variant="body2" fontWeight={600}>
                                    {user.name}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    ID: {user._id.slice(-8)}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box>
                                  <Typography variant="body2">{user.email}</Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {user.phone}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">
                                  {user.college?.name || 'N/A'}
                                </Typography>
                                {user.college?.country && (
                                  <Typography variant="caption" color="text.secondary">
                                    {user.college.country}
                                  </Typography>
                                )}
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={user.userProfile?.totalReferrals || 0}
                                  size="small"
                                  color="primary"
                                  sx={{ fontWeight: 600 }}
                                />
                              </TableCell>
                              <TableCell>
                                <Typography variant="caption" color="text.secondary">
                                  {formatDate(user.createdAt)}
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <IconButton
                                  size="small"
                                  onClick={() => handleViewUser(user._id)}
                                  sx={{ color: '#667eea' }}
                                >
                                  <Visibility fontSize="small" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() => handleEditUser(user._id)}
                                  sx={{ color: '#06b6d4' }}
                                >
                                  <Edit fontSize="small" />
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
                    count={totalUsers}
                    page={pageUsers}
                    onPageChange={(e, newPage) => setPageUsers(newPage)}
                    rowsPerPage={rowsPerPageUsers}
                    onRowsPerPageChange={(e) => {
                      setRowsPerPageUsers(parseInt(e.target.value, 10));
                      setPageUsers(0);
                    }}
                    rowsPerPageOptions={[10, 25, 50, 100]}
                  />
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* College Admins Table */}
        {currentTab === 1 && (
          <Card sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ p: 0 }}>
              {errorCollegeAdmins && (
                <Alert severity="error" sx={{ m: 3 }}>
                  {errorCollegeAdmins}
                </Alert>
              )}

              {loadingCollegeAdmins ? (
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
                                  <Typography variant="body2">{admin.email}</Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {admin.phone}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">
                                  {admin.managedCollege?.name || 'N/A'}
                                </Typography>
                                {admin.managedCollege?.country && (
                                  <Typography variant="caption" color="text.secondary">
                                    {admin.managedCollege.country}
                                  </Typography>
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
                                <Typography variant="caption" color="text.secondary">
                                    {formatDate(admin.createdAt)}
                                  </Typography>
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
                    count={totalCollegeAdmins}
                    page={pageCollegeAdmins}
                    onPageChange={(e, newPage) => setPageCollegeAdmins(newPage)}
                    rowsPerPage={rowsPerPageCollegeAdmins}
                    onRowsPerPageChange={(e) => {
                      setRowsPerPageCollegeAdmins(parseInt(e.target.value, 10));
                      setPageCollegeAdmins(0);
                    }}
                    rowsPerPageOptions={[10, 25, 50, 100]}
                  />
                </>
              )}
            </CardContent>
          </Card>
        )}

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

export default Users;
