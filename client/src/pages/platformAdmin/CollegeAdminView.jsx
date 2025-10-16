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
  Chip,
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
  Delete
} from '@mui/icons-material';
import { platformAdminApi } from '../../api/platformAdmin.api';
import { useToast } from '../../contexts/ToastContext';
import DashboardLayout from '../../layouts/DashboardLayout';

const CollegeAdminView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [collegeAdmin, setCollegeAdmin] = useState(null);
  const [collegeStats, setCollegeStats] = useState({});

  // Edit mode
  const [isEditMode, setIsEditMode] = useState(searchParams.get('edit') === 'true');
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone: '',
    managedCollege: '',
    isActive: true
  });
  const [saving, setSaving] = useState(false);

  // Dialogs
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Form data
  const [newPassword, setNewPassword] = useState('');
  const [colleges, setColleges] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch college admin details
  const fetchCollegeAdminDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await platformAdminApi.getCollegeAdminDetails(id);

      if (response.success) {
        setCollegeAdmin(response.data.collegeAdmin);
        setCollegeStats(response.data.collegeStats);
        setEditFormData({
          name: response.data.collegeAdmin.name,
          email: response.data.collegeAdmin.email,
          phone: response.data.collegeAdmin.phone,
          managedCollege: response.data.collegeAdmin.managedCollege?._id || '',
          isActive: response.data.collegeAdmin.isActive
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to load college admin details');
      showToast(err.message || 'Failed to load college admin details', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch colleges for managed college dropdown
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
    fetchCollegeAdminDetails();
    fetchColleges();
  }, [id]);

  const handleSaveChanges = async () => {
    try {
      setSaving(true);
      const response = await platformAdminApi.updateCollegeAdmin(id, editFormData);

      if (response.success) {
        showToast('College admin updated successfully', 'success');
        setIsEditMode(false);
        fetchCollegeAdminDetails();
      }
    } catch (err) {
      showToast(err.message || 'Failed to update college admin', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditFormData({
      name: collegeAdmin.name,
      email: collegeAdmin.email,
      phone: collegeAdmin.phone,
      managedCollege: collegeAdmin.managedCollege?._id || '',
      isActive: collegeAdmin.isActive
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
      const response = await platformAdminApi.resetCollegeAdminPassword(id, { newPassword });

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

  // Delete college admin
  const handleDeleteConfirm = async () => {
    try {
      setActionLoading(true);
      const response = await platformAdminApi.deleteCollegeAdmin(id);

      if (response.success) {
        showToast('College admin deleted successfully', 'success');
        navigate('/platform-admin/users');
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete college admin', 'error');
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

  if (error || !collegeAdmin) {
    return (
      <DashboardLayout>
        <Box sx={{ maxWidth: '1200px', width: '100%', mx: 'auto' }}>
          <Alert severity="error">{error || 'College admin not found'}</Alert>
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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
                  {collegeAdmin.name}
                </Typography>
                <Chip
                  label={collegeAdmin.isActive ? 'Active' : 'Inactive'}
                  size="small"
                  color={collegeAdmin.isActive ? 'success' : 'default'}
                  sx={{ fontWeight: 600 }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                College Admin ID: {collegeAdmin._id}
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
                  <FormControl fullWidth>
                    <InputLabel>Managed College</InputLabel>
                    <Select
                      value={editFormData.managedCollege}
                      onChange={(e) => setEditFormData({ ...editFormData, managedCollege: e.target.value })}
                      label="Managed College"
                    >
                      <MenuItem value="">None</MenuItem>
                      {colleges.map((college) => (
                        <MenuItem key={college._id} value={college._id}>
                          {college.name} ({college.country})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
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
                  <Typography variant="body1" fontWeight={600}>{collegeAdmin.name}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="caption" color="text.secondary">Email</Typography>
                  <Typography variant="body1" fontWeight={600}>{collegeAdmin.email}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="caption" color="text.secondary">Phone</Typography>
                  <Typography variant="body1" fontWeight={600}>{collegeAdmin.phone}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="caption" color="text.secondary">Status</Typography>
                  <Box>
                    <Chip
                      label={collegeAdmin.isActive ? 'Active' : 'Inactive'}
                      size="small"
                      color={collegeAdmin.isActive ? 'success' : 'default'}
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="caption" color="text.secondary">Joined Date</Typography>
                  <Typography variant="body1" fontWeight={600}>{formatDate(collegeAdmin.createdAt)}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="caption" color="text.secondary">Last Login</Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {collegeAdmin.lastLogin ? formatDate(collegeAdmin.lastLogin) : 'Never'}
                  </Typography>
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
                  startIcon={<Delete />}
                  onClick={() => setDeleteDialogOpen(true)}
                  sx={{ color: '#ef4444', borderColor: '#ef4444', fontWeight: 600 }}
                >
                  Delete College Admin
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Managed College */}
        {collegeAdmin.managedCollege && (
          <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Managed College
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="caption" color="text.secondary">College Name</Typography>
                  <Typography variant="body1" fontWeight={600}>{collegeAdmin.managedCollege.name}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="caption" color="text.secondary">Country</Typography>
                  <Typography variant="body1" fontWeight={600}>{collegeAdmin.managedCollege.country || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="caption" color="text.secondary">City</Typography>
                  <Typography variant="body1" fontWeight={600}>{collegeAdmin.managedCollege.city || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="caption" color="text.secondary">State</Typography>
                  <Typography variant="body1" fontWeight={600}>{collegeAdmin.managedCollege.state || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="caption" color="text.secondary">Type</Typography>
                  <Typography variant="body1" fontWeight={600}>{collegeAdmin.managedCollege.type || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="caption" color="text.secondary">Status</Typography>
                  <Box>
                    <Chip
                      label={collegeAdmin.managedCollege.status || 'Unaffiliated'}
                      size="small"
                      color={collegeAdmin.managedCollege.status === 'Live' ? 'success' : 'default'}
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>
                </Grid>
                {collegeAdmin.managedCollege.website && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" color="text.secondary">Website</Typography>
                    <Typography variant="body1" fontWeight={600}>
                      <a href={collegeAdmin.managedCollege.website} target="_blank" rel="noopener noreferrer" style={{ color: '#667eea' }}>
                        {collegeAdmin.managedCollege.website}
                      </a>
                    </Typography>
                  </Grid>
                )}
              </Grid>

              {/* College Stats */}
              {collegeStats.minersCount !== undefined && (
                <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid #e5e7eb' }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                    College Statistics
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <Typography variant="caption" color="text.secondary">Total Miners</Typography>
                      <Typography variant="h5" fontWeight={700} color="primary">
                        {collegeStats.minersCount || 0}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="caption" color="text.secondary">Active Sessions</Typography>
                      <Typography variant="h5" fontWeight={700} color="success.main">
                        {collegeStats.activeSessionsCount || 0}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="caption" color="text.secondary">Total Tokens Mined</Typography>
                      <Typography variant="h5" fontWeight={700} color="secondary.main">
                        {collegeAdmin.managedCollege.stats?.totalTokensMined?.toFixed(2) || '0.00'}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </CardContent>
          </Card>
        )}

        {!collegeAdmin.managedCollege && (
          <Card sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Managed College
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This college admin is not currently managing any college.
              </Typography>
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
                Reset password for {collegeAdmin.name}
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
              Are you sure you want to delete {collegeAdmin.name}? This will remove them as the admin of {collegeAdmin.managedCollege?.name || 'their college'}.
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

export default CollegeAdminView;
