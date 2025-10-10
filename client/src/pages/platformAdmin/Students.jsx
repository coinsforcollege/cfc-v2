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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Grid,
  Paper
} from '@mui/material';
import {
  Search,
  Visibility,
  Edit,
  Delete,
  LockReset,
  AccountBalanceWallet,
  Refresh,
  Close
} from '@mui/icons-material';
import { platformAdminApi } from '../../api/platformAdmin.api';
import { useToast } from '../../contexts/ToastContext';
import DashboardLayout from '../../layouts/DashboardLayout';

const Students = () => {
  const { showToast } = useToast();

  // State for students list
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [totalStudents, setTotalStudents] = useState(0);

  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
  const [addBalanceDialogOpen, setAddBalanceDialogOpen] = useState(false);

  // Selected student
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Form data
  const [editFormData, setEditFormData] = useState({ name: '', email: '', phone: '' });
  const [newPassword, setNewPassword] = useState('');
  const [balanceFormData, setBalanceFormData] = useState({ collegeId: '', amount: '' });
  const [colleges, setColleges] = useState([]);

  // Action loading states
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch students
  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await platformAdminApi.getAllStudents({
        search,
        page: page + 1,
        limit: rowsPerPage
      });

      if (response.success) {
        setStudents(response.data);
        setTotalStudents(response.pagination.total);
      }
    } catch (err) {
      setError(err.message || 'Failed to load students');
      showToast(err.message || 'Failed to load students', 'error');
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
    fetchStudents();
  }, [page, rowsPerPage]);

  useEffect(() => {
    fetchColleges();
  }, []);

  const handleSearch = () => {
    setPage(0);
    fetchStudents();
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // View student details
  const handleViewStudent = async (student) => {
    setSelectedStudent(student);
    setViewDialogOpen(true);
    setDetailsLoading(true);

    try {
      const response = await platformAdminApi.getStudentDetails(student._id);
      if (response.success) {
        setStudentDetails(response.data);
      }
    } catch (err) {
      showToast(err.message || 'Failed to load student details', 'error');
    } finally {
      setDetailsLoading(false);
    }
  };

  // Edit student
  const handleEditClick = (student) => {
    setSelectedStudent(student);
    setEditFormData({
      name: student.name,
      email: student.email,
      phone: student.phone
    });
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    try {
      setActionLoading(true);
      const response = await platformAdminApi.updateStudent(selectedStudent._id, editFormData);

      if (response.success) {
        showToast('Student updated successfully', 'success');
        setEditDialogOpen(false);
        fetchStudents();
      }
    } catch (err) {
      showToast(err.message || 'Failed to update student', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete student
  const handleDeleteClick = (student) => {
    setSelectedStudent(student);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setActionLoading(true);
      const response = await platformAdminApi.deleteStudent(selectedStudent._id);

      if (response.success) {
        showToast('Student deleted successfully', 'success');
        setDeleteDialogOpen(false);
        fetchStudents();
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete student', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Reset password
  const handleResetPasswordClick = (student) => {
    setSelectedStudent(student);
    setNewPassword('');
    setResetPasswordDialogOpen(true);
  };

  const handleResetPasswordSubmit = async () => {
    if (!newPassword || newPassword.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    try {
      setActionLoading(true);
      const response = await platformAdminApi.resetStudentPassword(selectedStudent._id, {
        newPassword
      });

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

  // Add balance
  const handleAddBalanceClick = (student) => {
    setSelectedStudent(student);
    setBalanceFormData({ collegeId: '', amount: '' });
    setAddBalanceDialogOpen(true);
  };

  const handleAddBalanceSubmit = async () => {
    if (!balanceFormData.collegeId || !balanceFormData.amount || balanceFormData.amount <= 0) {
      showToast('Please provide valid college and amount', 'error');
      return;
    }

    try {
      setActionLoading(true);
      const response = await platformAdminApi.addStudentBalance(selectedStudent._id, {
        collegeId: balanceFormData.collegeId,
        amount: parseFloat(balanceFormData.amount)
      });

      if (response.success) {
        showToast(response.message || 'Balance added successfully', 'success');
        setAddBalanceDialogOpen(false);
        setBalanceFormData({ collegeId: '', amount: '' });
      }
    } catch (err) {
      showToast(err.message || 'Failed to add balance', 'error');
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

  const sidebarStats = {
    studentsCount: totalStudents
  };

  return (
    <DashboardLayout stats={sidebarStats}>
      <Box sx={{ maxWidth: '1400px', width: '100%', mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
              Students
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage all registered students
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={fetchStudents}
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
              placeholder="Search by name or email..."
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
                    <IconButton size="small" onClick={() => { setSearch(''); setPage(0); fetchStudents(); }}>
                      <Close />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </CardContent>
        </Card>

        {/* Students Table */}
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
                        <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Student</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Contact</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#475569' }}>College</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Referrals</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Joined</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, color: '#475569' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {students.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                            <Typography variant="body2" color="text.secondary">
                              No students found
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        students.map((student) => (
                          <TableRow key={student._id} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                            <TableCell>
                              <Box>
                                <Typography variant="body2" fontWeight={600}>
                                  {student.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  ID: {student._id.slice(-8)}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box>
                                <Typography variant="body2">{student.email}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {student.phone}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {student.college?.name || 'N/A'}
                              </Typography>
                              {student.college?.country && (
                                <Typography variant="caption" color="text.secondary">
                                  {student.college.country}
                                </Typography>
                              )}
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={student.studentProfile?.totalReferrals || 0}
                                size="small"
                                color="primary"
                                sx={{ fontWeight: 600 }}
                              />
                            </TableCell>
                            <TableCell>
                              <Typography variant="caption" color="text.secondary">
                                {formatDate(student.createdAt)}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <IconButton
                                size="small"
                                onClick={() => handleViewStudent(student)}
                                sx={{ color: '#667eea' }}
                              >
                                <Visibility fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleEditClick(student)}
                                sx={{ color: '#06b6d4' }}
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleResetPasswordClick(student)}
                                sx={{ color: '#8b5cf6' }}
                              >
                                <LockReset fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleAddBalanceClick(student)}
                                sx={{ color: '#22c55e' }}
                              >
                                <AccountBalanceWallet fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteClick(student)}
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
                  count={totalStudents}
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

        {/* View Student Dialog */}
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
            Student Details
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            {detailsLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : studentDetails ? (
              <Box>
                {/* Basic Info */}
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Basic Information</Typography>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Name</Typography>
                    <Typography variant="body2" fontWeight={600}>{studentDetails.student.name}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Email</Typography>
                    <Typography variant="body2" fontWeight={600}>{studentDetails.student.email}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Phone</Typography>
                    <Typography variant="body2" fontWeight={600}>{studentDetails.student.phone}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Referral Code</Typography>
                    <Typography variant="body2" fontWeight={600}>{studentDetails.student.studentProfile.referralCode}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Total Referrals</Typography>
                    <Typography variant="body2" fontWeight={600}>{studentDetails.student.studentProfile.totalReferrals}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Joined Date</Typography>
                    <Typography variant="body2" fontWeight={600}>{formatDate(studentDetails.student.createdAt)}</Typography>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* Wallets */}
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Wallets</Typography>
                {studentDetails.wallets.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">No wallets yet</Typography>
                ) : (
                  <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e5e7eb' }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ bgcolor: '#f8fafc' }}>
                          <TableCell sx={{ fontWeight: 700 }}>College</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 700 }}>Balance</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {studentDetails.wallets.map((wallet, index) => (
                          <TableRow key={index}>
                            <TableCell>{wallet.college?.name || 'Unknown'}</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600, color: '#667eea' }}>
                              {wallet.balance.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}

                <Divider sx={{ my: 3 }} />

                {/* Mining Colleges */}
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Mining Colleges</Typography>
                {studentDetails.student.studentProfile.miningColleges.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">No colleges added yet</Typography>
                ) : (
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {studentDetails.student.studentProfile.miningColleges
                      .filter(mc => mc.college)
                      .map((mc, index) => (
                        <Chip
                          key={index}
                          label={mc.college.name}
                          sx={{ fontWeight: 600 }}
                        />
                      ))}
                  </Box>
                )}
              </Box>
            ) : null}
          </DialogContent>
          <DialogActions sx={{ p: 2.5, borderTop: '1px solid #e5e7eb' }}>
            <Button onClick={() => setViewDialogOpen(false)} sx={{ color: '#64748b', fontWeight: 600 }}>
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Student Dialog */}
        <Dialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
            }
          }}
        >
          <DialogTitle sx={{ fontWeight: 700 }}>Edit Student</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Name"
                value={editFormData.name}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={editFormData.email}
                onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Phone"
                value={editFormData.phone}
                onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setEditDialogOpen(false)} sx={{ color: '#64748b', fontWeight: 600 }}>
              Cancel
            </Button>
            <Button
              onClick={handleEditSubmit}
              variant="contained"
              disabled={actionLoading}
              sx={{
                background: 'linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%)',
                fontWeight: 700,
                '&:hover': {
                  background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)',
                }
              }}
            >
              {actionLoading ? <CircularProgress size={20} /> : 'Save Changes'}
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
              Are you sure you want to delete {selectedStudent?.name}? This will also delete all associated wallets and mining sessions.
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
                Reset password for {selectedStudent?.name}
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
                Add tokens to {selectedStudent?.name}'s wallet
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
      </Box>
    </DashboardLayout>
  );
};

export default Students;
