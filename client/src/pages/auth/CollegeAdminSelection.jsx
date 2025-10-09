import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Avatar,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
  IconButton
} from '@mui/material';
import { Search, School, People, TrendingUp, LocationOn, Add, Close, CloudUpload, Link as LinkIcon } from '@mui/icons-material';
import { collegesApi } from '../../api/colleges.api';
import { collegeAdminApi } from '../../api/collegeAdmin.api';
import { useAuth } from '../../contexts/AuthContext';
import { getImageUrl } from '../../utils/imageUtils';

// Helper function to get chip style based on status
const getStatusChipStyle = (status) => {
  switch(status) {
    case 'Unaffiliated':
      return {
        background: 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)',
        color: 'white'
      };
    case 'Waitlist':
      return {
        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        color: 'white'
      };
    case 'Building':
      return {
        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        color: 'white'
      };
    case 'Live':
      return {
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: 'white'
      };
    default:
      return {
        background: '#e5e7eb',
        color: '#6b7280'
      };
  }
};

const CollegeAdminSelection = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectingCollege, setSelectingCollege] = useState(null);
  const [error, setError] = useState('');
  
  // Add College Dialog
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newCollege, setNewCollege] = useState({
    name: '',
    country: '',
    logo: ''
  });
  const [logoInputType, setLogoInputType] = useState('url'); // 'url' or 'file'
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');

  useEffect(() => {
    fetchColleges();
  }, [searchTerm]);

  const fetchColleges = async () => {
    try {
      setLoading(true);
      
      const params = {
        page: 1,
        limit: 20,
        sortBy: 'tokens'
      };

      if (searchTerm) {
        params.search = searchTerm;
      }

      const response = await collegesApi.getAll(params);
      
      if (response.colleges) {
        setColleges(response.colleges);
      } else {
        setColleges(response || []);
      }
    } catch (err) {
      console.error('Error fetching colleges:', err);
      setError('Failed to load colleges');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCollege = async (collegeId) => {
    try {
      setSelectingCollege(collegeId);
      setError('');

      const formData = new FormData();
      formData.append('collegeId', collegeId);

      const response = await collegeAdminApi.selectCollege(formData);

      if (response.success) {
        // Update user context with new college data
        const updatedUser = {
          ...user,
          managedCollege: response.data.college._id
        };
        updateUser(updatedUser);

        // Redirect to dashboard
        navigate('/college-admin/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Failed to select college');
      setSelectingCollege(null);
    }
  };

  const handleLogoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size should be less than 5MB');
        return;
      }

      setLogoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUrlChange = (url) => {
    setNewCollege({ ...newCollege, logo: url });
    setLogoPreview(url);
  };

  const handleCreateAndSelectCollege = async () => {
    try {
      if (!newCollege.name || !newCollege.country) {
        setError('College name and country are required');
        return;
      }

      setSelectingCollege('new');
      setError('');

      const formData = new FormData();
      
      // Prepare new college data
      const collegeData = {
        name: newCollege.name,
        country: newCollege.country
      };

      // Add logo URL if provided (not file upload)
      if (logoInputType === 'url' && newCollege.logo) {
        collegeData.logo = newCollege.logo;
      }

      formData.append('newCollege', JSON.stringify(collegeData));

      // Add file if uploaded
      if (logoInputType === 'file' && logoFile) {
        formData.append('logoFile', logoFile);
      }

      const response = await collegeAdminApi.selectCollege(formData);

      if (response.success) {
        // Update user context
        const updatedUser = {
          ...user,
          managedCollege: response.data.college._id
        };
        updateUser(updatedUser);

        // Close dialog and redirect
        setShowAddDialog(false);
        navigate('/college-admin/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Failed to create college');
      setSelectingCollege(null);
    }
  };

  const resetDialog = () => {
    setNewCollege({ name: '', country: '', logo: '' });
    setLogoFile(null);
    setLogoPreview('');
    setLogoInputType('url');
    setError('');
  };

  const handleCloseDialog = () => {
    setShowAddDialog(false);
    resetDialog();
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, rgba(155, 184, 224, 0.4) 0%, rgba(179, 154, 232, 0.3) 50%, rgba(230, 155, 184, 0.3) 100%)',
        pt: { xs: 12, md: 14 },
        pb: 8,
        px: 2
      }}
    >
      <Box
        sx={{
          maxWidth: '1200px',
          mx: 'auto'
        }}
      >
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              background: 'linear-gradient(135deg, #0EA5E9 0%, #8B5CF6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2
            }}
          >
            Select Your College
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            Choose the college you want to manage
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You'll be able to configure token settings and track student engagement
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3, maxWidth: '800px', mx: 'auto' }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Search Bar */}
        <Box sx={{ maxWidth: '800px', mx: 'auto', mb: 4 }}>
          <TextField
            fullWidth
            placeholder="Search colleges by name, country, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              background: 'white',
              borderRadius: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: '#0EA5E9' }} />
                </InputAdornment>
              )
            }}
          />
          <Button
            variant="text"
            onClick={() => setShowAddDialog(true)}
            sx={{
              mt: 1,
              color: '#0EA5E9',
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            + Can't find your college? Add it here
          </Button>
        </Box>

        {/* Loading */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* College Cards */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  md: 'repeat(2, 1fr)'
                },
                gap: 3,
                mb: 4
              }}
            >
              {colleges.map((college) => (
                <Card
                  key={college._id}
                  sx={{
                    borderRadius: 3,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s',
                    background: 'white',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 32px rgba(14, 165, 233, 0.2)'
                    }
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                      {/* Logo */}
                      <Avatar
                        src={getImageUrl(college.logo) || '/images/college-logo-placeholder.png'}
                        sx={{
                          width: 70,
                          height: 70,
                          border: '3px solid white',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                      >
                        <School sx={{ fontSize: 35 }} />
                      </Avatar>

                      {/* Info */}
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                          <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            {college.name}
                          </Typography>
                          <Chip
                            label={college.status || 'Unaffiliated'}
                            size="small"
                            sx={{
                              ...getStatusChipStyle(college.status),
                              fontWeight: 600,
                              fontSize: '0.7rem'
                            }}
                          />
                          {college.admin && (
                            <Chip
                              label="Has Admin"
                              size="small"
                              sx={{
                                background: '#e5e7eb',
                                color: '#6b7280',
                                fontWeight: 600,
                                fontSize: '0.7rem'
                              }}
                            />
                          )}
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
                          <LocationOn sx={{ fontSize: 16, color: '#64748b' }} />
                          <Typography variant="body2" color="text.secondary">
                            {college.city ? `${college.city}, ${college.country}` : college.country}
                          </Typography>
                        </Box>

                        {/* Stats */}
                        <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <People sx={{ fontSize: 18, color: '#0EA5E9' }} />
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#0EA5E9' }}>
                              {college.stats?.totalMiners || 0}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              miners
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <TrendingUp sx={{ fontSize: 18, color: '#8B5CF6' }} />
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#8B5CF6' }}>
                              {college.stats?.totalTokensMined ? college.stats.totalTokensMined.toFixed(2) : 0}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              tokens
                            </Typography>
                          </Box>
                        </Box>

                        {/* Action Button */}
                        <Button
                          fullWidth
                          variant="contained"
                          onClick={() => handleSelectCollege(college._id)}
                          disabled={selectingCollege === college._id || !!college.admin}
                          sx={{
                            background: 'linear-gradient(135deg, #0EA5E9 0%, #8B5CF6 100%)',
                            color: 'white',
                            fontWeight: 600,
                            textTransform: 'none',
                            py: 1,
                            borderRadius: 2,
                            '&:hover': {
                              background: 'linear-gradient(135deg, #0284C7 0%, #7C3AED 100%)'
                            },
                            '&:disabled': {
                              background: '#e5e7eb',
                              color: '#9ca3af'
                            }
                          }}
                        >
                          {selectingCollege === college._id ? (
                            <CircularProgress size={20} color="inherit" />
                          ) : college.admin ? (
                            'Already Has Admin'
                          ) : (
                            'Select to Manage'
                          )}
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>

            {/* No results */}
            {colleges.length === 0 && !loading && (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <School sx={{ fontSize: 80, color: '#cbd5e1', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No colleges found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Try a different search term or add your college
                </Typography>
              </Box>
            )}
          </>
        )}
      </Box>

      {/* Add College Dialog */}
      <Dialog 
        open={showAddDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
          }
        }}
      >
        {/* Header */}
        <DialogTitle
          sx={{
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            py: 2.5,
            px: 3
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#2d3748' }}>
            Add New College
          </Typography>
          <IconButton onClick={handleCloseDialog} size="small">
            <Close />
          </IconButton>
        </DialogTitle>

        {/* Content */}
        <DialogContent sx={{ py: 4, px: 3 }}>
          {/* College Name */}
          <TextField
            fullWidth
            label="College Name"
            value={newCollege.name}
            onChange={(e) => setNewCollege({ ...newCollege, name: e.target.value })}
            required
            sx={{ 
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
          />

          {/* Country */}
          <TextField
            fullWidth
            label="Country"
            value={newCollege.country}
            onChange={(e) => setNewCollege({ ...newCollege, country: e.target.value })}
            required
            sx={{ 
              mb: 4,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
          />

          {/* Logo Upload Section */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#2d3748' }}>
              College Logo (Optional)
            </Typography>

            {/* Toggle between File and URL */}
            <ToggleButtonGroup
              value={logoInputType}
              exclusive
              onChange={(e, value) => {
                if (value) {
                  setLogoInputType(value);
                  setLogoPreview('');
                  setLogoFile(null);
                  setNewCollege({ ...newCollege, logo: '' });
                }
              }}
              sx={{ mb: 3 }}
            >
              <ToggleButton 
                value="file"
                sx={{
                  textTransform: 'none',
                  px: 2,
                  py: 1
                }}
              >
                <CloudUpload sx={{ mr: 1, fontSize: 20 }} />
                Upload File
              </ToggleButton>
              <ToggleButton 
                value="url"
                sx={{
                  textTransform: 'none',
                  px: 2,
                  py: 1
                }}
              >
                <LinkIcon sx={{ mr: 1, fontSize: 20 }} />
                Enter URL
              </ToggleButton>
            </ToggleButtonGroup>

            {/* File Upload */}
            {logoInputType === 'file' && (
              <Box>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUpload />}
                  sx={{ 
                    mb: 2,
                    borderRadius: 2,
                    textTransform: 'none',
                    borderColor: '#0EA5E9',
                    color: '#0EA5E9',
                    '&:hover': {
                      borderColor: '#0284C7',
                      backgroundColor: 'rgba(14, 165, 233, 0.04)'
                    }
                  }}
                >
                  Choose Image
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleLogoFileChange}
                  />
                </Button>
                {logoFile && (
                  <Typography variant="body2" color="text.secondary">
                    Selected: {logoFile.name}
                  </Typography>
                )}
              </Box>
            )}

            {/* URL Input */}
            {logoInputType === 'url' && (
              <TextField
                fullWidth
                label="Logo URL"
                value={newCollege.logo}
                onChange={(e) => handleLogoUrlChange(e.target.value)}
                placeholder="https://example.com/logo.png"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
            )}

            {/* Logo Preview */}
            {logoPreview && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#2d3748' }}>
                  Preview:
                </Typography>
                <Avatar
                  src={logoPreview}
                  sx={{
                    width: 120,
                    height: 120,
                    border: '3px solid #e2e8f0',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                >
                  <School sx={{ fontSize: 50 }} />
                </Avatar>
              </Box>
            )}
          </Box>
        </DialogContent>

        {/* Actions */}
        <DialogActions
          sx={{
            borderTop: '1px solid #e2e8f0',
            px: 3,
            py: 2.5,
            gap: 1
          }}
        >
          <Button 
            onClick={handleCloseDialog} 
            size="large"
            sx={{
              textTransform: 'none',
              color: '#64748b',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: 'rgba(100, 116, 139, 0.04)'
              }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateAndSelectCollege}
            disabled={!newCollege.name || !newCollege.country || selectingCollege === 'new'}
            variant="contained"
            size="large"
            sx={{
              background: 'linear-gradient(135deg, #0EA5E9 0%, #8B5CF6 100%)',
              px: 4,
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: 2,
              '&:hover': {
                background: 'linear-gradient(135deg, #0284C7 0%, #7C3AED 100%)'
              },
              '&:disabled': {
                background: '#e2e8f0',
                color: '#94a3b8'
              }
            }}
          >
            {selectingCollege === 'new' ? <CircularProgress size={20} color="inherit" /> : 'Add & Select College'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CollegeAdminSelection;

