import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Grid,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  Save,
  Cancel,
  LockReset,
  Delete,
  AccountBalanceWallet,
  PersonAddAlt,
  PersonRemove
} from '@mui/icons-material';
import { platformAdminApi } from '../../api/platformAdmin.api';
import { useToast } from '../../contexts/ToastContext';
import DashboardLayout from '../../layouts/DashboardLayout';

const UserView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [wallets, setWallets] = useState([]);
  const [miningSessions, setMiningSessions] = useState([]);

  // Edit mode
  const [isEditMode, setIsEditMode] = useState(searchParams.get('edit') === 'true');
  const [editFormData, setEditFormData] = useState({ name: '', email: '', phone: '', isActive: true });
  const [saving, setSaving] = useState(false);

  // Dialogs
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addBalanceDialogOpen, setAddBalanceDialogOpen] = useState(false);
  const [assignAdminDialogOpen, setAssignAdminDialogOpen] = useState(false);
  const [removeAdminDialogOpen, setRemoveAdminDialogOpen] = useState(false);

  // Form data
  const [newPassword, setNewPassword] = useState('');
  const [balanceFormData, setBalanceFormData] = useState({ collegeId: '', amount: '' });
  const [colleges, setColleges] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);
  const [assignCollegeId, setAssignCollegeId] = useState('');

  // Fetch user details
  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await platformAdminApi.getStudentDetails(id);

      if (response.success) {
        setUser(response.data.user);
        setWallets(response.data.wallets);
        setMiningSessions(response.data.recentMiningSessions);
        setEditFormData({
          name: response.data.user.name,
          email: response.data.user.email,
          phone: response.data.user.phone,
          isActive: response.data.user.isActive
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to load user details');
      showToast(err.message || 'Failed to load user details', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch colleges for add balance dropdown
  const fetchColleges = async () => {
    try {
      const response = await platformAdminApi.getAllColleges({ limit: 1000 });
      if (response.success) {
        setColleges(response.data);
      }
    } catch (err) {
      console.error('Failed to load colleges:', err);
    }
  };

  useEffect(() => {
    fetchUserDetails();
    fetchColleges();
  }, [id]);

  const handleSaveChanges = async () => {
    try {
      setSaving(true);
      const response = await platformAdminApi.updateStudent(id, editFormData);

      if (response.success) {
        showToast('User updated successfully', 'success');
        setIsEditMode(false);
        fetchUserDetails();
      }
    } catch (err) {
      showToast(err.message || 'Failed to update user', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      isActive: user.isActive
    });
  };

  // Reset password
  const handleResetPasswordSubmit = async () => {
    if (!newPassword || newPassword.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    try {
      setActionLoading(true);
      const response = await platformAdminApi.resetStudentPassword(id, { newPassword });

      if (response.success) {
        showToast('Password reset successfully', 'success');
        setResetPasswordDialogOpen(false);
        setNewPassword('');
      }
    } catch (err) {
      showToast(err.message || 'Failed to reset password', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete user
  const handleDeleteConfirm = async () => {
    try {
      setActionLoading(true);
      const response = await platformAdminApi.deleteStudent(id);

      if (response.success) {
        showToast('User deleted successfully', 'success');
        navigate('/platform-admin/users');
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete user', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Add balance
  const handleAddBalanceSubmit = async () => {
    if (!balanceFormData.collegeId || !balanceFormData.amount || balanceFormData.amount <= 0) {
      showToast('Please provide valid college and amount', 'error');
      return;
    }

    try {
      setActionLoading(true);
      const response = await platformAdminApi.addStudentBalance(id, {
        collegeId: balanceFormData.collegeId,
        amount: parseFloat(balanceFormData.amount)
      });

      if (response.success) {
        showToast(response.message || 'Balance added successfully', 'success');
        setAddBalanceDialogOpen(false);
        setBalanceFormData({ collegeId: '', amount: '' });
        fetchUserDetails();
      }
    } catch (err) {
      showToast(err.message || 'Failed to add balance', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Assign college admin
  const handleAssignAdminSubmit = async () => {
    if (!assignCollegeId) {
      showToast('Please select a college', 'error');
      return;
    }

    try {
      setActionLoading(true);
      const response = await platformAdminApi.assignCollegeAdmin(id, {
        collegeId: assignCollegeId
      });

      if (response.success) {
        showToast('User assigned as college admin successfully', 'success');
        setAssignAdminDialogOpen(false);
        setAssignCollegeId('');
        fetchUserDetails();
        navigate('/platform-admin/users'); // Redirect to college admins tab
      }
    } catch (err) {
      showToast(err.message || 'Failed to assign college admin', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Remove college admin
  const handleRemoveAdminSubmit = async () => {
    try {
      setActionLoading(true);
      const response = await platformAdminApi.removeCollegeAdmin(id);

      if (response.success) {
        showToast('College admin status removed successfully', 'success');
        setRemoveAdminDialogOpen(false);
        fetchUserDetails();
      }
    } catch (err) {
      showToast(err.message || 'Failed to remove college admin', 'error');
    } finally {
      setActionLoading(false);
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

  if (loading) {
    return (
      <DashboardLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }

  if (error || !user) {
    return (
      <DashboardLayout>
        <Box sx={{ maxWidth: '1200px', width: '100%', mx: 'auto' }}>
          <Alert severity="error">{error || 'User not found'}</Alert>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/platform-admin/users')}
            sx={{ mt: 2 }}
          >
            Back to Users
          </Button>
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Box sx={{ maxWidth: '1200px', width: '100%', mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => navigate('/platform-admin/users')}>
              <ArrowBack />
            </IconButton>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
                {user.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                User ID: {user._id}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            {!isEditMode ? (
              <>
                <Button
                  variant="outlined"
                  startIcon={<Edit />}
                  onClick={() => setIsEditMode(true)}
                  sx={{ fontWeight: 600 }}
                >
                  Edit
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outlined"
                  startIcon={<Cancel />}
                  onClick={handleCancelEdit}
                  sx={{ fontWeight: 600 }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSaveChanges}
                  disabled={saving}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    fontWeight: 600,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a67d8 0%, #6b42a0 100%)',
                    }
                  }}
                >
                  {saving ? <CircularProgress size={20} /> : 'Save Changes'}
                </Button>
              </>
            )}
          </Box>
        </Box>

        {/* Basic Information */}
        <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Basic Information
            </Typography>

            {isEditMode ? (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Name"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={editFormData.isActive}
                        onChange={(e) => setEditFormData({ ...editFormData, isActive: e.target.checked })}
                        color="primary"
                      />
                    }
                    label="Active Status"
                  />
                </Grid>
              </Grid>
            ) : (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="caption" color="text.secondary">Name</Typography>
                  <Typography variant="body1" fontWeight={600}>{user.name}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="caption" color="text.secondary">Email</Typography>
                  <Typography variant="body1" fontWeight={600}>{user.email}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="caption" color="text.secondary">Phone</Typography>
                  <Typography variant="body1" fontWeight={600}>{user.phone}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                <Typography variant="caption" color="text.secondary">Primary College</Typography>
                {user.college ? (
                  <Typography 
                    variant="body1" 
                    fontWeight={600}
                    onClick={() => navigate(`/platform-admin/colleges/${user.college._id}`)}
                    sx={{ 
                      cursor: 'pointer',
                      color: '#667eea',
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    {user.college?.name || 'N/A'}
                    {user.college?.country && ` (${user.college.country})`}
                  </Typography>
                ) : (
                  <Typography variant="body1" fontWeight={600}>N/A</Typography>
                )}
              </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="caption" color="text.secondary">Referral Code</Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {user.userProfile?.referralCode || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="caption" color="text.secondary">Total Referrals</Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {user.userProfile?.totalReferrals || 0}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="caption" color="text.secondary">Joined Date</Typography>
                  <Typography variant="body1" fontWeight={600}>{formatDate(user.createdAt)}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="caption" color="text.secondary">Last Login</Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="caption" color="text.secondary">Status</Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Chip
                      label={user.isActive ? 'Active' : 'Inactive'}
                      size="small"
                      color={user.isActive ? 'success' : 'default'}
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>
                </Grid>
              </Grid>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        {isEditMode && (
          <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Actions
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {user.role === 'user' && (
                  <Button
                    variant="outlined"
                    startIcon={<PersonAddAlt />}
                    onClick={() => setAssignAdminDialogOpen(true)}
                    sx={{ color: '#10b981', borderColor: '#10b981', fontWeight: 600 }}
                  >
                    Promote to College Admin
                  </Button>
                )}
                {user.role === 'college_admin' && (
                  <Button
                    variant="outlined"
                    startIcon={<PersonRemove />}
                    onClick={() => setRemoveAdminDialogOpen(true)}
                    sx={{ color: '#f59e0b', borderColor: '#f59e0b', fontWeight: 600 }}
                  >
                    Remove College Admin
                  </Button>
                )}
                <Button
                  variant="outlined"
                  startIcon={<LockReset />}
                  onClick={() => setResetPasswordDialogOpen(true)}
                  sx={{ color: '#8b5cf6', borderColor: '#8b5cf6', fontWeight: 600 }}
                >
                  Reset Password
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<AccountBalanceWallet />}
                  onClick={() => setAddBalanceDialogOpen(true)}
                  sx={{ color: '#22c55e', borderColor: '#22c55e', fontWeight: 600 }}
                >
                  Add Balance
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Delete />}
                  onClick={() => setDeleteDialogOpen(true)}
                  sx={{ color: '#ef4444', borderColor: '#ef4444', fontWeight: 600 }}
                >
                  Delete User
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Wallets */}
        <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Wallets
            </Typography>
            {wallets.length === 0 ? (
              <Typography variant="body2" color="text.secondary">No wallets yet</Typography>
            ) : (
              <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e5e7eb' }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#f8fafc' }}>
                      <TableCell sx={{ fontWeight: 700 }}>College</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Country</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>Balance</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {wallets.map((wallet, index) => (
                      <TableRow key={index}>
                        <TableCell>{wallet.college?.name || 'Unknown'}</TableCell>
                        <TableCell>{wallet.college?.country || 'N/A'}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600, color: '#667eea' }}>
                          {wallet.balance.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>

        {/* Mining Colleges */}
        <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Mining Colleges
            </Typography>
            {user.userProfile?.miningColleges?.length === 0 ? (
              <Typography variant="body2" color="text.secondary">No colleges added yet</Typography>
            ) : (
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {user.userProfile?.miningColleges
                  ?.filter(mc => mc.college)
                  .map((mc, index) => (
                    <Chip
                      key={index}
                      label={mc.college.name}
                      sx={{ fontWeight: 600 }}
                    />
                  ))}
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Recent Mining Sessions */}
        {miningSessions.length > 0 && (
          <Card sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Recent Mining Sessions
              </Typography>
              <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e5e7eb' }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#f8fafc' }}>
                      <TableCell sx={{ fontWeight: 700 }}>College</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Start Time</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>End Time</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>Tokens Earned</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {miningSessions.map((session) => (
                      <TableRow key={session._id}>
                        <TableCell>{session.college?.name || 'Unknown'}</TableCell>
                        <TableCell>{formatDate(session.startTime)}</TableCell>
                        <TableCell>{session.endTime ? formatDate(session.endTime) : 'N/A'}</TableCell>
                        <TableCell>
                          <Chip
                            label={session.isActive ? 'Active' : 'Completed'}
                            size="small"
                            color={session.isActive ? 'success' : 'default'}
                            sx={{ fontWeight: 600 }}
                          />
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600, color: '#667eea' }}>
                          {session.tokensEarned?.toFixed(2) || '0.00'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}

        {/* Reset Password Dialog */}
        <Dialog
          open={resetPasswordDialogOpen}
          onClose={() => setResetPasswordDialogOpen(false)}
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
            }
          }}
        >
          <DialogTitle sx={{ fontWeight: 700 }}>Reset Password</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Reset password for {user.name}
              </Typography>
              <TextField
                fullWidth
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                helperText="Minimum 6 characters"
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setResetPasswordDialogOpen(false)} sx={{ color: '#64748b', fontWeight: 600 }}>
              Cancel
            </Button>
            <Button
              onClick={handleResetPasswordSubmit}
              variant="contained"
              disabled={actionLoading}
              sx={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                fontWeight: 700,
                '&:hover': {
                  background: 'linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)',
                }
              }}
            >
              {actionLoading ? <CircularProgress size={20} /> : 'Reset Password'}
            </Button>
          </DialogActions>
        </Dialog>

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
              Are you sure you want to delete {user.name}? This will also delete all associated wallets and mining sessions.
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

        {/* Add Balance Dialog */}
        <Dialog
          open={addBalanceDialogOpen}
          onClose={() => setAddBalanceDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
            }
          }}
        >
          <DialogTitle sx={{ fontWeight: 700 }}>Add Balance</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Add tokens to {user.name}'s wallet
              </Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>College</InputLabel>
                <Select
                  value={balanceFormData.collegeId}
                  onChange={(e) => setBalanceFormData({ ...balanceFormData, collegeId: e.target.value })}
                  label="College"
                >
                  {colleges.map((college) => (
                    <MenuItem key={college._id} value={college._id}>
                      {college.name} ({college.country})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Amount"
                type="number"
                value={balanceFormData.amount}
                onChange={(e) => setBalanceFormData({ ...balanceFormData, amount: e.target.value })}
                helperText="Amount of tokens to add"
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setAddBalanceDialogOpen(false)} sx={{ color: '#64748b', fontWeight: 600 }}>
              Cancel
            </Button>
            <Button
              onClick={handleAddBalanceSubmit}
              variant="contained"
              disabled={actionLoading}
              sx={{
                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                fontWeight: 700,
                '&:hover': {
                  background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                }
              }}
            >
              {actionLoading ? <CircularProgress size={20} /> : 'Add Balance'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Assign College Admin Dialog */}
        <Dialog
          open={assignAdminDialogOpen}
          onClose={() => setAssignAdminDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
            }
          }}
        >
          <DialogTitle sx={{ fontWeight: 700 }}>Assign as College Admin</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Promote <strong>{user.name}</strong> to college admin
              </Typography>
              <FormControl fullWidth>
                <InputLabel>College</InputLabel>
                <Select
                  value={assignCollegeId}
                  onChange={(e) => setAssignCollegeId(e.target.value)}
                  label="College"
                >
                  {colleges
                    .filter(college => !college.admin) // Only show colleges without admins
                    .map((college) => (
                      <MenuItem key={college._id} value={college._id}>
                        {college.name} ({college.country})
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setAssignAdminDialogOpen(false)} sx={{ color: '#64748b', fontWeight: 600 }}>
              Cancel
            </Button>
            <Button
              onClick={handleAssignAdminSubmit}
              variant="contained"
              disabled={actionLoading}
              sx={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                fontWeight: 700,
                '&:hover': {
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                }
              }}
            >
              {actionLoading ? <CircularProgress size={20} /> : 'Assign as Admin'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Remove College Admin Dialog */}
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
              Are you sure you want to remove <strong>{user.name}</strong> as admin of <strong>{user.managedCollege?.name}</strong>?
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
              onClick={handleRemoveAdminSubmit}
              variant="contained"
              disabled={actionLoading}
              sx={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                fontWeight: 700,
                '&:hover': {
                  background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                }
              }}
            >
              {actionLoading ? <CircularProgress size={20} /> : 'Remove Admin'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DashboardLayout>
  );
};

export default UserView;
