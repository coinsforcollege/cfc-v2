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
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
  Divider
} from '@mui/material';
import {
  Search,
  Visibility,
  Edit,
  Delete,
  Refresh,
  Close,
  Add,
  CloudUpload,
  Link as LinkIcon,
  AttachMoney,
  Save,
  ArrowBack,
  Verified
} from '@mui/icons-material';
import { platformAdminApi } from '../../api/platformAdmin.api';
import { useToast } from '../../contexts/ToastContext';
import DashboardLayout from '../../layouts/DashboardLayout';
import { getImageUrl } from '../../utils/imageUtils';
import { useNavigate } from 'react-router';

const Colleges = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();

  // State for colleges list
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [totalColleges, setTotalColleges] = useState(0);

  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [rateDialogOpen, setRateDialogOpen] = useState(false);
  const [defaultRateDialogOpen, setDefaultRateDialogOpen] = useState(false);

  // Selected college
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [collegeDetails, setCollegeDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [editingCollege, setEditingCollege] = useState(null);

  // Form data
  const [tempInput, setTempInput] = useState('');
  const [logoInputType, setLogoInputType] = useState('url');
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [coverInputType, setCoverInputType] = useState('url');
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [rateFormData, setRateFormData] = useState({ baseRate: '', referralBonusRate: '' });

  const [collegeFormData, setCollegeFormData] = useState({
    name: '',
    shortName: '',
    tagline: '',
    type: 'University',
    establishedYear: '',
    country: '',
    state: '',
    city: '',
    address: '',
    zipCode: '',
    logo: '',
    coverImage: '',
    videoUrl: '',
    description: '',
    about: '',
    mission: '',
    vision: '',
    website: '',
    email: '',
    phone: '',
    socialMedia: { facebook: '', twitter: '', instagram: '', linkedin: '', youtube: '' },
    departments: [],
    campusSize: { value: '', unit: 'acres' },
    studentLife: { totalStudents: '', internationalStudents: '', studentToFacultyRatio: '', clubs: '' }
  });

  // Action loading states
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch colleges
  const fetchColleges = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await platformAdminApi.getAllColleges({
        search,
        page: page + 1,
        limit: rowsPerPage
      });

      if (response.success) {
        setColleges(response.data);
        setTotalColleges(response.pagination.total);
      }
    } catch (err) {
      setError(err.message || 'Failed to load colleges');
      showToast(err.message || 'Failed to load colleges', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColleges();
  }, [page, rowsPerPage]);

  const handleSearch = () => {
    setPage(0);
    fetchColleges();
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // View college details
  const handleViewCollege = async (college) => {
    setSelectedCollege(college);
    setViewDialogOpen(true);
    setDetailsLoading(true);

    try {
      const response = await platformAdminApi.getCollegeDetails(college._id);
      if (response.success) {
        setCollegeDetails(response.data);
      }
    } catch (err) {
      showToast(err.message || 'Failed to load college details', 'error');
    } finally {
      setDetailsLoading(false);
    }
  };

  // Add/Edit college
  const handleAddCollege = () => {
    setEditingCollege(null);
    setCollegeFormData({
      name: '',
      shortName: '',
      tagline: '',
      type: 'University',
      establishedYear: '',
      country: '',
      state: '',
      city: '',
      address: '',
      zipCode: '',
      logo: '',
      coverImage: '',
      videoUrl: '',
      description: '',
      about: '',
      mission: '',
      vision: '',
      website: '',
      email: '',
      phone: '',
      socialMedia: { facebook: '', twitter: '', instagram: '', linkedin: '', youtube: '' },
      departments: [],
      campusSize: { value: '', unit: 'acres' },
      studentLife: { totalStudents: '', internationalStudents: '', studentToFacultyRatio: '', clubs: '' }
    });
    setLogoPreview('');
    setCoverPreview('');
    setLogoFile(null);
    setCoverFile(null);
    setFormDialogOpen(true);
  };

  const handleEditCollege = (college) => {
    setEditingCollege(college);
    setCollegeFormData({
      ...college,
      socialMedia: college.socialMedia || { facebook: '', twitter: '', instagram: '', linkedin: '', youtube: '' },
      studentLife: college.studentLife || { totalStudents: '', internationalStudents: '', studentToFacultyRatio: '', clubs: '' },
      departments: college.departments || [],
      campusSize: college.campusSize || { value: '', unit: 'acres' }
    });

    if (college.logo) {
      setLogoPreview(getImageUrl(college.logo));
      setLogoInputType('url');
    } else {
      setLogoPreview('');
      setLogoInputType('url');
    }

    if (college.coverImage) {
      setCoverPreview(getImageUrl(college.coverImage));
      setCoverInputType('url');
    } else {
      setCoverPreview('');
      setCoverInputType('url');
    }

    setFormDialogOpen(true);
  };

  const handleCollegeFormChange = (field, value) => {
    if (field.includes('.')) {
      const parts = field.split('.');
      setCollegeFormData(prev => {
        const newData = { ...prev };
        let current = newData;
        for (let i = 0; i < parts.length - 1; i++) {
          current[parts[i]] = { ...current[parts[i]] };
          current = current[parts[i]];
        }
        current[parts[parts.length - 1]] = value;
        return newData;
      });
    } else {
      setCollegeFormData({ ...collegeFormData, [field]: value });
    }
  };

  const addDepartment = () => {
    if (tempInput.trim()) {
      setCollegeFormData({
        ...collegeFormData,
        departments: [...collegeFormData.departments, tempInput.trim()]
      });
      setTempInput('');
    }
  };

  const removeDepartment = (index) => {
    setCollegeFormData({
      ...collegeFormData,
      departments: collegeFormData.departments.filter((_, i) => i !== index)
    });
  };

  const handleLogoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showToast('Please select an image file', 'error');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        showToast('File size should be less than 5MB', 'error');
        return;
      }
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCoverFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showToast('Please select an image file', 'error');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        showToast('File size should be less than 5MB', 'error');
        return;
      }
      setCoverFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setCoverPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveCollege = async () => {
    if (!collegeFormData.name || !collegeFormData.country) {
      showToast('Please fill in required fields (Name and Country)', 'error');
      return;
    }

    try {
      setActionLoading(true);

      const formData = new FormData();

      const objectFields = ['socialMedia', 'departments', 'campusSize', 'studentLife'];
      Object.keys(collegeFormData).forEach(key => {
        if (objectFields.includes(key)) {
          formData.append(key, JSON.stringify(collegeFormData[key]));
        } else if (collegeFormData[key] !== '' && collegeFormData[key] !== null) {
          formData.append(key, collegeFormData[key]);
        }
      });

      if (logoInputType === 'file' && logoFile) {
        formData.append('logoFile', logoFile);
      }
      if (coverInputType === 'file' && coverFile) {
        formData.append('coverFile', coverFile);
      }

      if (editingCollege) {
        await platformAdminApi.updateCollege(editingCollege._id, formData);
        showToast('College updated successfully', 'success');
      } else {
        await platformAdminApi.createCollege(formData);
        showToast('College created successfully', 'success');
      }

      setFormDialogOpen(false);
      setEditingCollege(null);
      setLogoFile(null);
      setLogoPreview('');
      setCoverFile(null);
      setCoverPreview('');
      fetchColleges();
    } catch (err) {
      showToast(err.message || 'Failed to save college', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete college
  const handleDeleteClick = (college) => {
    setSelectedCollege(college);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setActionLoading(true);
      const response = await platformAdminApi.deleteCollege(selectedCollege._id);

      if (response.success) {
        showToast('College deleted successfully', 'success');
        setDeleteDialogOpen(false);
        fetchColleges();
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete college', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Edit rates
  const handleOpenRateModal = (college) => {
    setSelectedCollege(college);
    setRateFormData({
      baseRate: college.baseRate || 0.25,
      referralBonusRate: college.referralBonusRate || 0.1
    });
    setRateDialogOpen(true);
  };

  const handleSaveRates = async () => {
    try {
      setActionLoading(true);
      const data = {
        baseRate: parseFloat(rateFormData.baseRate),
        referralBonusRate: parseFloat(rateFormData.referralBonusRate)
      };

      await platformAdminApi.updateCollegeRates(selectedCollege._id, data);
      showToast('Rates updated successfully', 'success');
      setRateDialogOpen(false);
      fetchColleges();
    } catch (err) {
      showToast(err.message || 'Failed to update rates', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Default rates
  const handleOpenDefaultRateModal = () => {
    setRateFormData({ baseRate: 0.25, referralBonusRate: 0.1 });
    setDefaultRateDialogOpen(true);
  };

  const handleSaveDefaultRates = async () => {
    try {
      setActionLoading(true);
      const data = {
        baseRate: parseFloat(rateFormData.baseRate),
        referralBonusRate: parseFloat(rateFormData.referralBonusRate)
      };

      await platformAdminApi.updateDefaultRates(data);
      showToast('Default rates updated successfully for all colleges', 'success');
      setDefaultRateDialogOpen(false);
      fetchColleges();
    } catch (err) {
      showToast(err.message || 'Failed to update default rates', 'error');
    } finally {
      setActionLoading(false);
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
    collegesCount: totalColleges
  };

  return (
    <DashboardLayout stats={sidebarStats}>
      <Box sx={{ maxWidth: '1400px', width: '100%', mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
              Colleges
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage all colleges on the platform
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<AttachMoney />}
              onClick={handleOpenDefaultRateModal}
              sx={{
                borderColor: '#10b981',
                color: '#10b981',
                fontWeight: 600,
                '&:hover': {
                  borderColor: '#059669',
                  background: 'rgba(16, 185, 129, 0.04)'
                }
              }}
            >
              Set Default Rates
            </Button>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={fetchColleges}
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
              startIcon={<Add />}
              onClick={handleAddCollege}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                fontWeight: 600,
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a67d8 0%, #6b42a0 100%)',
                }
              }}
            >
              Add College
            </Button>
          </Box>
        </Box>

        {/* Search Bar */}
        <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <CardContent sx={{ p: 3 }}>
            <TextField
              fullWidth
              placeholder="Search by college name or country..."
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
                    <IconButton size="small" onClick={() => { setSearch(''); setPage(0); fetchColleges(); }}>
                      <Close />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </CardContent>
        </Card>

        {/* Colleges Table */}
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
                        <TableCell sx={{ fontWeight: 700, color: '#475569' }}>College</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Admin</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, color: '#475569' }}>Base Rate</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, color: '#475569' }}>Referral Bonus</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, color: '#475569' }}>Total Miners</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, color: '#475569' }}>Active Miners</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, color: '#475569' }}>Tokens Mined</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Status</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, color: '#475569' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {colleges.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                            <Typography variant="body2" color="text.secondary">
                              No colleges found
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        colleges.map((college) => (
                          <TableRow key={college._id} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar
                                  src={college.logo ? getImageUrl(college.logo) : undefined}
                                  sx={{
                                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                    width: 40,
                                    height: 40
                                  }}
                                >
                                  {college.name.charAt(0).toUpperCase()}
                                </Avatar>
                                <Box>
                                  <Typography variant="body2" fontWeight={600}>
                                    {college.name}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {college.country}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              {college.admin ? (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <Verified sx={{ fontSize: 16, color: '#10b981' }} />
                                  <Typography variant="caption" color="success.main" fontWeight={600}>
                                    Claimed
                                  </Typography>
                                </Box>
                              ) : (
                                <Typography variant="caption" color="text.secondary">
                                  Unclaimed
                                </Typography>
                              )}
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2" fontWeight={600} color="success.main">
                                {college.baseRate || 0.25} t/h
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2" fontWeight={600} sx={{ color: '#3b82f6' }}>
                                {college.referralBonusRate || 0.1} t/h
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2">
                                {college.stats?.totalMiners || 0}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Chip
                                label={college.stats?.activeMiners || 0}
                                size="small"
                                color="primary"
                                sx={{ fontWeight: 600 }}
                              />
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2" fontWeight={600}>
                                {college.stats?.totalTokensMined ? college.stats.totalTokensMined.toFixed(2) : '0.00'}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={college.isActive ? 'Active' : 'Inactive'}
                                size="small"
                                color={college.isActive ? 'success' : 'default'}
                                sx={{ fontWeight: 600 }}
                              />
                            </TableCell>
                            <TableCell align="right">
                              <IconButton
                                size="small"
                                onClick={() => handleViewCollege(college)}
                                sx={{ color: '#667eea' }}
                              >
                                <Visibility fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleOpenRateModal(college)}
                                sx={{ color: '#10b981' }}
                              >
                                <AttachMoney fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => navigate(`/platform-admin/colleges/${college._id}/edit`)}
                                sx={{ color: '#06b6d4' }}
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteClick(college)}
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
                  count={totalColleges}
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

        {/* View College Dialog */}
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
            College Details
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            {detailsLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : collegeDetails ? (
              <Box>
                {/* Basic Info */}
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Basic Information</Typography>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Name</Typography>
                    <Typography variant="body2" fontWeight={600}>{collegeDetails.college.name}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Country</Typography>
                    <Typography variant="body2" fontWeight={600}>{collegeDetails.college.country}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Total Miners</Typography>
                    <Typography variant="body2" fontWeight={600}>{collegeDetails.minersCount || 0}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Active Mining Sessions</Typography>
                    <Typography variant="body2" fontWeight={600}>{collegeDetails.activeSessionsCount || 0}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Base Rate</Typography>
                    <Typography variant="body2" fontWeight={600} color="success.main">
                      {collegeDetails.college.baseRate || 0.25} t/h
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Referral Bonus Rate</Typography>
                    <Typography variant="body2" fontWeight={600} sx={{ color: '#3b82f6' }}>
                      {collegeDetails.college.referralBonusRate || 0.1} t/h
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Created Date</Typography>
                    <Typography variant="body2" fontWeight={600}>{formatDate(collegeDetails.college.createdAt)}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Status</Typography>
                    <Chip
                      label={collegeDetails.college.isActive ? 'Active' : 'Inactive'}
                      size="small"
                      color={collegeDetails.college.isActive ? 'success' : 'default'}
                      sx={{ fontWeight: 600 }}
                    />
                  </Grid>
                </Grid>
              </Box>
            ) : null}
          </DialogContent>
          <DialogActions sx={{ p: 2.5, borderTop: '1px solid #e5e7eb' }}>
            <Button onClick={() => setViewDialogOpen(false)} sx={{ color: '#64748b', fontWeight: 600 }}>
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add/Edit College Form Dialog */}
        <Dialog
          open={formDialogOpen}
          onClose={() => setFormDialogOpen(false)}
          maxWidth="lg"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              maxHeight: '90vh'
            }
          }}
        >
          <DialogTitle sx={{ fontWeight: 700, borderBottom: '1px solid #e5e7eb' }}>
            {editingCollege ? 'Edit College' : 'Add New College'}
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* BASIC INFORMATION */}
              <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#667eea' }}>
                    Basic Information
                  </Typography>
                  <Grid container spacing={2.5}>
                    <Grid item xs={12} md={5}>
                      <TextField
                        label="College Name *"
                        fullWidth
                        value={collegeFormData.name}
                        onChange={(e) => handleCollegeFormChange('name', e.target.value)}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        label="Short Name"
                        fullWidth
                        value={collegeFormData.shortName}
                        onChange={(e) => handleCollegeFormChange('shortName', e.target.value)}
                        placeholder="e.g., MIT"
                      />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <TextField
                        label="Type"
                        select
                        fullWidth
                        value={collegeFormData.type}
                        onChange={(e) => handleCollegeFormChange('type', e.target.value)}
                      >
                        <MenuItem value="University">University</MenuItem>
                        <MenuItem value="College">College</MenuItem>
                        <MenuItem value="Institute">Institute</MenuItem>
                        <MenuItem value="School">School</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <TextField
                        label="Est. Year"
                        type="number"
                        fullWidth
                        value={collegeFormData.establishedYear}
                        onChange={(e) => handleCollegeFormChange('establishedYear', e.target.value)}
                        placeholder="1861"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Tagline"
                        fullWidth
                        value={collegeFormData.tagline}
                        onChange={(e) => handleCollegeFormChange('tagline', e.target.value)}
                        placeholder="A short, catchy phrase"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Short Description (2-3 sentences)"
                        multiline
                        rows={3}
                        fullWidth
                        value={collegeFormData.description}
                        onChange={(e) => handleCollegeFormChange('description', e.target.value)}
                        placeholder="A brief overview of the college"
                        helperText={`${(collegeFormData.description || '').length} characters`}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* LOCATION */}
              <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#667eea' }}>
                    Location
                  </Typography>
                  <Grid container spacing={2.5}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Country *"
                        fullWidth
                        value={collegeFormData.country}
                        onChange={(e) => handleCollegeFormChange('country', e.target.value)}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="State/Province"
                        fullWidth
                        value={collegeFormData.state}
                        onChange={(e) => handleCollegeFormChange('state', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="City"
                        fullWidth
                        value={collegeFormData.city}
                        onChange={(e) => handleCollegeFormChange('city', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Zip/Postal Code"
                        fullWidth
                        value={collegeFormData.zipCode}
                        onChange={(e) => handleCollegeFormChange('zipCode', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Full Address"
                        multiline
                        rows={2}
                        fullWidth
                        value={collegeFormData.address}
                        onChange={(e) => handleCollegeFormChange('address', e.target.value)}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* MEDIA */}
              <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#667eea' }}>
                    Media & Branding
                  </Typography>

                  {/* LOGO */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>Logo</Typography>
                    <ToggleButtonGroup
                      value={logoInputType}
                      exclusive
                      onChange={(e, val) => val && setLogoInputType(val)}
                      sx={{ mb: 2 }}
                    >
                      <ToggleButton value="file"><CloudUpload sx={{ mr: 1, fontSize: 18 }} />Upload</ToggleButton>
                      <ToggleButton value="url"><LinkIcon sx={{ mr: 1, fontSize: 18 }} />URL</ToggleButton>
                    </ToggleButtonGroup>

                    {logoInputType === 'file' ? (
                      <Box>
                        <Button variant="outlined" component="label" startIcon={<CloudUpload />}>
                          Choose Image
                          <input type="file" hidden accept="image/*" onChange={handleLogoFileChange} />
                        </Button>
                        {logoFile && <Typography variant="body2" sx={{ mt: 1 }}>{logoFile.name}</Typography>}
                        {logoPreview && <Avatar src={logoPreview} sx={{ width: 80, height: 80, mt: 2 }} />}
                      </Box>
                    ) : (
                      <Box>
                        <TextField
                          fullWidth
                          placeholder="https://..."
                          value={collegeFormData.logo || ''}
                          onChange={(e) => handleCollegeFormChange('logo', e.target.value)}
                        />
                        {logoPreview && <Avatar src={logoPreview} sx={{ width: 80, height: 80, mt: 2 }} />}
                      </Box>
                    )}
                  </Box>

                  {/* COVER IMAGE */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>Cover Image</Typography>
                    <ToggleButtonGroup
                      value={coverInputType}
                      exclusive
                      onChange={(e, val) => val && setCoverInputType(val)}
                      sx={{ mb: 2 }}
                    >
                      <ToggleButton value="file"><CloudUpload sx={{ mr: 1, fontSize: 18 }} />Upload</ToggleButton>
                      <ToggleButton value="url"><LinkIcon sx={{ mr: 1, fontSize: 18 }} />URL</ToggleButton>
                    </ToggleButtonGroup>

                    {coverInputType === 'file' ? (
                      <Box>
                        <Button variant="outlined" component="label" startIcon={<CloudUpload />}>
                          Choose Image
                          <input type="file" hidden accept="image/*" onChange={handleCoverFileChange} />
                        </Button>
                        {coverFile && <Typography variant="body2" sx={{ mt: 1 }}>{coverFile.name}</Typography>}
                        {coverPreview && <Box component="img" src={coverPreview} sx={{ width: '100%', maxWidth: 300, height: 150, objectFit: 'cover', mt: 2, borderRadius: 1 }} />}
                      </Box>
                    ) : (
                      <Box>
                        <TextField
                          fullWidth
                          placeholder="https://..."
                          value={collegeFormData.coverImage || ''}
                          onChange={(e) => handleCollegeFormChange('coverImage', e.target.value)}
                        />
                        {coverPreview && <Box component="img" src={coverPreview} sx={{ width: '100%', maxWidth: 300, height: 150, objectFit: 'cover', mt: 2, borderRadius: 1 }} />}
                      </Box>
                    )}
                  </Box>

                  {/* VIDEO URL */}
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>Video URL</Typography>
                    <TextField
                      fullWidth
                      value={collegeFormData.videoUrl}
                      onChange={(e) => handleCollegeFormChange('videoUrl', e.target.value)}
                      placeholder="YouTube/Vimeo"
                    />
                  </Box>
                </CardContent>
              </Card>

              {/* ABOUT & MISSION */}
              <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#667eea' }}>
                    About & Mission
                  </Typography>
                  <Grid container spacing={2.5}>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                        Detailed About Section (500-2000 words)
                      </Typography>
                      <TextField
                        multiline
                        rows={10}
                        fullWidth
                        value={collegeFormData.about}
                        onChange={(e) => handleCollegeFormChange('about', e.target.value)}
                        placeholder="Write comprehensive details about the college including history, achievements, culture, values, notable alumni, research contributions, and what makes it unique..."
                        helperText={`${(collegeFormData.about || '').length} characters`}
                        sx={{
                          '& .MuiInputBase-root': {
                            fontSize: '15px',
                            lineHeight: '1.6'
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                        Mission Statement
                      </Typography>
                      <TextField
                        multiline
                        rows={6}
                        fullWidth
                        value={collegeFormData.mission}
                        onChange={(e) => handleCollegeFormChange('mission', e.target.value)}
                        placeholder="What the college aims to achieve..."
                        helperText={`${(collegeFormData.mission || '').length} characters`}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                        Vision Statement
                      </Typography>
                      <TextField
                        multiline
                        rows={6}
                        fullWidth
                        value={collegeFormData.vision}
                        onChange={(e) => handleCollegeFormChange('vision', e.target.value)}
                        placeholder="Vision for the future..."
                        helperText={`${(collegeFormData.vision || '').length} characters`}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* CONTACT */}
              <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#667eea' }}>
                    Contact Information
                  </Typography>
                  <Grid container spacing={2.5}>
                    <Grid item xs={12} md={4}>
                      <TextField
                        label="Website"
                        fullWidth
                        value={collegeFormData.website}
                        onChange={(e) => handleCollegeFormChange('website', e.target.value)}
                        placeholder="https://college.edu"
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        value={collegeFormData.email}
                        onChange={(e) => handleCollegeFormChange('email', e.target.value)}
                        placeholder="admissions@college.edu"
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        label="Phone"
                        fullWidth
                        value={collegeFormData.phone}
                        onChange={(e) => handleCollegeFormChange('phone', e.target.value)}
                        placeholder="+1 (555) 123-4567"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* DEPARTMENTS & STUDENT LIFE */}
              <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#667eea' }}>
                    Academic Departments
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <TextField
                      placeholder="Enter department name..."
                      fullWidth
                      value={tempInput}
                      onChange={(e) => setTempInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') addDepartment();
                      }}
                    />
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      onClick={addDepartment}
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        minWidth: 120
                      }}
                    >
                      Add
                    </Button>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
                    {collegeFormData.departments.map((dept, index) => (
                      <Chip
                        key={index}
                        label={dept}
                        onDelete={() => removeDepartment(index)}
                        sx={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white'
                        }}
                      />
                    ))}
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#667eea' }}>
                    Student Life & Campus
                  </Typography>
                  <Grid container spacing={2.5}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Total Students"
                        type="number"
                        fullWidth
                        value={collegeFormData.studentLife.totalStudents}
                        onChange={(e) => handleCollegeFormChange('studentLife.totalStudents', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="International Students"
                        type="number"
                        fullWidth
                        value={collegeFormData.studentLife.internationalStudents}
                        onChange={(e) => handleCollegeFormChange('studentLife.internationalStudents', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Student-Faculty Ratio"
                        fullWidth
                        placeholder="e.g., 15:1"
                        value={collegeFormData.studentLife.studentToFacultyRatio}
                        onChange={(e) => handleCollegeFormChange('studentLife.studentToFacultyRatio', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Number of Clubs"
                        type="number"
                        fullWidth
                        value={collegeFormData.studentLife.clubs}
                        onChange={(e) => handleCollegeFormChange('studentLife.clubs', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Campus Size"
                        type="number"
                        fullWidth
                        value={collegeFormData.campusSize.value}
                        onChange={(e) => handleCollegeFormChange('campusSize.value', e.target.value)}
                        placeholder="e.g., 168"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Unit"
                        select
                        fullWidth
                        value={collegeFormData.campusSize.unit}
                        onChange={(e) => handleCollegeFormChange('campusSize.unit', e.target.value)}
                      >
                        <MenuItem value="acres">Acres</MenuItem>
                        <MenuItem value="hectares">Hectares</MenuItem>
                        <MenuItem value="sq ft">Square Feet</MenuItem>
                        <MenuItem value="sq meters">Square Meters</MenuItem>
                      </TextField>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2.5, borderTop: '1px solid #e5e7eb' }}>
            <Button
              onClick={() => setFormDialogOpen(false)}
              sx={{ color: '#64748b', fontWeight: 600 }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveCollege}
              variant="contained"
              disabled={actionLoading || !collegeFormData.name || !collegeFormData.country}
              sx={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                fontWeight: 700,
                '&:hover': {
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                }
              }}
            >
              {actionLoading ? <CircularProgress size={20} /> : (editingCollege ? 'Update College' : 'Create College')}
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
              Are you sure you want to delete {selectedCollege?.name}? This action cannot be undone.
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

        {/* Edit Rates Dialog */}
        <Dialog
          open={rateDialogOpen}
          onClose={() => setRateDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
            }
          }}
        >
          <DialogTitle sx={{ fontWeight: 700 }}>
            Edit Rates - {selectedCollege?.name}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Base Rate (tokens/hour)"
                type="number"
                value={rateFormData.baseRate}
                onChange={(e) => setRateFormData({ ...rateFormData, baseRate: e.target.value })}
                inputProps={{ step: 0.01, min: 0 }}
                helperText="Earning rate for regular mining"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Referral Bonus Rate (tokens/hour)"
                type="number"
                value={rateFormData.referralBonusRate}
                onChange={(e) => setRateFormData({ ...rateFormData, referralBonusRate: e.target.value })}
                inputProps={{ step: 0.01, min: 0 }}
                helperText="Additional rate per referral when mining"
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setRateDialogOpen(false)} sx={{ color: '#64748b', fontWeight: 600 }}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveRates}
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
              {actionLoading ? <CircularProgress size={20} /> : 'Save Rates'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Set Default Rates Dialog */}
        <Dialog
          open={defaultRateDialogOpen}
          onClose={() => setDefaultRateDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
            }
          }}
        >
          <DialogTitle sx={{ fontWeight: 700 }}>
            Set Default Rates for All Colleges
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <Alert severity="warning" sx={{ mb: 3 }}>
                This will update the earning rates for ALL colleges on the platform.
              </Alert>
              <TextField
                fullWidth
                label="Base Rate (tokens/hour)"
                type="number"
                value={rateFormData.baseRate}
                onChange={(e) => setRateFormData({ ...rateFormData, baseRate: e.target.value })}
                inputProps={{ step: 0.01, min: 0 }}
                helperText="Default earning rate for regular mining"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Referral Bonus Rate (tokens/hour)"
                type="number"
                value={rateFormData.referralBonusRate}
                onChange={(e) => setRateFormData({ ...rateFormData, referralBonusRate: e.target.value })}
                inputProps={{ step: 0.01, min: 0 }}
                helperText="Default additional rate per referral when mining"
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setDefaultRateDialogOpen(false)} sx={{ color: '#64748b', fontWeight: 600 }}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveDefaultRates}
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
              {actionLoading ? <CircularProgress size={20} /> : 'Update All Colleges'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DashboardLayout>
  );
};

export default Colleges;
