import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Chip,
  Avatar,
  LinearProgress,
  MenuItem,
  InputAdornment,
  Paper
} from '@mui/material';
import {
  ArrowBack,
  Save,
  Add,
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  YouTube,
  Delete
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { platformAdminApi } from '../../api/platformAdmin.api';
import { getImageUrl } from '../../utils/imageUtils';
import DashboardLayout from '../../layouts/DashboardLayout';

const CollegeEdit = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [tempInput, setTempInput] = useState('');

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState('');

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
    socialMedia: {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: '',
      youtube: ''
    },
    departments: [],
    campusSize: { value: '', unit: 'acres' },
    studentLife: {
      totalStudents: '',
      internationalStudents: '',
      studentToFacultyRatio: '',
      clubs: ''
    }
  });

  useEffect(() => {
    if (!user || user.role !== 'platform_admin') {
      navigate('/auth/login');
      return;
    }
    fetchCollege();
  }, [user, navigate, id]);

  const fetchCollege = async () => {
    try {
      setLoading(true);
      const response = await platformAdminApi.getCollegeDetails(id);

      if (response.success) {
        const college = response.data.college;
        setCollegeFormData({
          ...college,
          socialMedia: college.socialMedia || { facebook: '', twitter: '', instagram: '', linkedin: '', youtube: '' },
          studentLife: college.studentLife || { totalStudents: '', internationalStudents: '', studentToFacultyRatio: '', clubs: '' },
          departments: college.departments || [],
          campusSize: college.campusSize || { value: '', unit: 'acres' }
        });

        if (college.logo) {
          setLogoPreview(getImageUrl(college.logo));
        }
        if (college.coverImage) {
          setCoverPreview(getImageUrl(college.coverImage));
        }
      }
    } catch (error) {
      console.error('Error fetching college:', error);
      showToast('Failed to load college data', 'error');
    } finally {
      setLoading(false);
    }
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
    try {
      setSaveLoading(true);

      const formData = new FormData();

      const objectFields = ['socialMedia', 'departments', 'campusSize', 'studentLife'];
      Object.keys(collegeFormData).forEach(key => {
        if (objectFields.includes(key)) {
          formData.append(key, JSON.stringify(collegeFormData[key]));
        } else if (collegeFormData[key] !== '' && collegeFormData[key] !== null) {
          formData.append(key, collegeFormData[key]);
        }
      });

      if (logoFile) {
        formData.append('logoFile', logoFile);
      }
      if (coverFile) {
        formData.append('coverFile', coverFile);
      }

      await platformAdminApi.updateCollege(id, formData);
      showToast('College updated successfully', 'success');
      navigate('/platform-admin/colleges');
    } catch (error) {
      console.error('Error saving college:', error);
      showToast('Failed to update college', 'error');
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading && !collegeFormData.name) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LinearProgress sx={{ width: '50%' }} />
      </Box>
    );
  }

  const sidebarStats = {};

  return (
    <DashboardLayout stats={sidebarStats}>
      <Box sx={{ maxWidth: '1200px', width: '100%', marginLeft: 'auto', marginRight: 'auto', paddingBottom: 4 }}>
        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', marginBottom: 3, position: 'sticky', top: 0, zIndex: 10 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
                  Edit College
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {collegeFormData.name}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<ArrowBack />}
                  onClick={() => navigate('/platform-admin/colleges')}
                >
                  Back to Colleges
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSaveCollege}
                  disabled={!collegeFormData.name || !collegeFormData.country || saveLoading}
                  sx={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                    }
                  }}
                >
                  {saveLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Paper sx={{ padding: 5, borderRadius: 3, boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)' }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, marginBottom: 3, color: '#667eea' }}>
              Basic Information
            </Typography>
            <Box sx={{ marginBottom: 3 }}>
              <TextField
                fullWidth
                label="College Name"
                value={collegeFormData.name}
                onChange={(e) => handleCollegeFormChange('name', e.target.value)}
                required
              />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, marginBottom: 3 }}>
              <TextField
                fullWidth
                label="Short Name"
                value={collegeFormData.shortName}
                onChange={(e) => handleCollegeFormChange('shortName', e.target.value)}
                placeholder="e.g., MIT, UCLA"
              />
              <TextField
                fullWidth
                label="Tagline"
                value={collegeFormData.tagline}
                onChange={(e) => handleCollegeFormChange('tagline', e.target.value)}
                placeholder="A memorable phrase"
              />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, marginBottom: 3 }}>
              <TextField
                fullWidth
                select
                label="Type"
                value={collegeFormData.type}
                onChange={(e) => handleCollegeFormChange('type', e.target.value)}
              >
                <MenuItem value="University">University</MenuItem>
                <MenuItem value="College">College</MenuItem>
                <MenuItem value="Institute">Institute</MenuItem>
                <MenuItem value="School">School</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>
              <TextField
                fullWidth
                label="Established Year"
                type="number"
                value={collegeFormData.establishedYear}
                onChange={(e) => handleCollegeFormChange('establishedYear', e.target.value)}
                placeholder="1861"
              />
            </Box>
            <Box sx={{ marginBottom: 3 }}>
              <TextField
                fullWidth
                label="Short Description"
                multiline
                rows={3}
                value={collegeFormData.description}
                onChange={(e) => handleCollegeFormChange('description', e.target.value)}
                placeholder="A brief 2-3 sentence overview"
                helperText={`${(collegeFormData.description || '').length} characters`}
              />
            </Box>
          </Box>

          <Box sx={{ marginTop: 5 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, marginBottom: 3, color: '#ec4899' }}>
              Location
            </Typography>
            <Box sx={{ marginBottom: 3 }}>
              <TextField
                fullWidth
                label="Country"
                value={collegeFormData.country}
                onChange={(e) => handleCollegeFormChange('country', e.target.value)}
                required
              />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, marginBottom: 3 }}>
              <TextField
                fullWidth
                label="State / Province"
                value={collegeFormData.state}
                onChange={(e) => handleCollegeFormChange('state', e.target.value)}
                placeholder="e.g., California"
              />
              <TextField
                fullWidth
                label="City"
                value={collegeFormData.city}
                onChange={(e) => handleCollegeFormChange('city', e.target.value)}
                placeholder="e.g., Los Angeles"
              />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, marginBottom: 3 }}>
              <TextField
                fullWidth
                label="Zip Code"
                value={collegeFormData.zipCode}
                onChange={(e) => handleCollegeFormChange('zipCode', e.target.value)}
                placeholder="e.g., 90001"
              />
              <TextField
                fullWidth
                label="Street Address"
                value={collegeFormData.address}
                onChange={(e) => handleCollegeFormChange('address', e.target.value)}
                placeholder="Complete street address"
              />
            </Box>
          </Box>

          <Box sx={{ marginTop: 5 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, marginBottom: 3, color: '#4ecdc4' }}>
              Branding
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, marginBottom: 3 }}>
              <Box sx={{ width: '100%' }}>
                <TextField
                  fullWidth
                  label="Logo URL"
                  value={collegeFormData.logo || ''}
                  onChange={(e) => {
                    handleCollegeFormChange('logo', e.target.value);
                    if (e.target.value) setLogoPreview(e.target.value);
                  }}
                  placeholder="https://..."
                  sx={{ marginBottom: 2 }}
                />
                <Button variant="outlined" component="label" fullWidth sx={{ marginBottom: 2 }}>
                  Or Upload Logo File
                  <input type="file" hidden accept="image/*" onChange={handleLogoFileChange} />
                </Button>
                <Box sx={{ height: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  {logoPreview && (
                    <Avatar src={logoPreview} sx={{ width: 100, height: 100 }} />
                  )}
                </Box>
              </Box>
              <Box sx={{ width: '100%' }}>
                <TextField
                  fullWidth
                  label="Cover Image URL"
                  value={collegeFormData.coverImage || ''}
                  onChange={(e) => {
                    handleCollegeFormChange('coverImage', e.target.value);
                    if (e.target.value) setCoverPreview(e.target.value);
                  }}
                  placeholder="https://..."
                  sx={{ marginBottom: 2 }}
                />
                <Button variant="outlined" component="label" fullWidth sx={{ marginBottom: 2 }}>
                  Or Upload Cover File
                  <input type="file" hidden accept="image/*" onChange={handleCoverFileChange} />
                </Button>
                <Box sx={{ height: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  {coverPreview && (
                    <Box component="img" src={coverPreview} sx={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 2 }} />
                  )}
                </Box>
              </Box>
            </Box>
            <Box sx={{ marginBottom: 3 }}>
              <TextField
                fullWidth
                label="Video URL"
                value={collegeFormData.videoUrl}
                onChange={(e) => handleCollegeFormChange('videoUrl', e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                helperText="YouTube or Vimeo video"
              />
            </Box>
          </Box>

          <Box sx={{ marginTop: 5 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, marginBottom: 3, color: '#f59e0b' }}>
              About & Mission
            </Typography>
            <Box sx={{ marginBottom: 3 }}>
              <TextField
                fullWidth
                label="About"
                multiline
                rows={6}
                value={collegeFormData.about}
                onChange={(e) => handleCollegeFormChange('about', e.target.value)}
                placeholder="Write about the college..."
                helperText={`${(collegeFormData.about || '').length} characters`}
              />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, marginBottom: 3 }}>
              <TextField
                fullWidth
                label="Mission Statement"
                multiline
                rows={3}
                value={collegeFormData.mission}
                onChange={(e) => handleCollegeFormChange('mission', e.target.value)}
                placeholder="What the college aims to achieve"
              />
              <TextField
                fullWidth
                label="Vision Statement"
                multiline
                rows={3}
                value={collegeFormData.vision}
                onChange={(e) => handleCollegeFormChange('vision', e.target.value)}
                placeholder="College's aspirations"
              />
            </Box>
          </Box>

          <Box sx={{ marginTop: 5 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, marginBottom: 3, color: '#45b7d1' }}>
              Contact Information
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, marginBottom: 3 }}>
              <TextField
                fullWidth
                label="Website"
                value={collegeFormData.website}
                onChange={(e) => handleCollegeFormChange('website', e.target.value)}
                placeholder="https://college.edu"
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={collegeFormData.email}
                onChange={(e) => handleCollegeFormChange('email', e.target.value)}
                placeholder="info@college.edu"
              />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, marginBottom: 3 }}>
              <TextField
                fullWidth
                label="Phone"
                value={collegeFormData.phone}
                onChange={(e) => handleCollegeFormChange('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
              <Box sx={{ width: { xs: '0%', sm: '50%' } }}></Box>
            </Box>
          </Box>

          <Box sx={{ marginTop: 5 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, marginBottom: 3, color: '#8b5cf6' }}>
              Social Media
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, marginBottom: 3 }}>
              <TextField
                fullWidth
                placeholder="Facebook Page URL"
                value={collegeFormData.socialMedia.facebook}
                onChange={(e) => handleCollegeFormChange('socialMedia.facebook', e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Facebook sx={{ color: '#1877f2' }} /></InputAdornment>
                }}
              />
              <TextField
                fullWidth
                placeholder="Twitter Handle"
                value={collegeFormData.socialMedia.twitter}
                onChange={(e) => handleCollegeFormChange('socialMedia.twitter', e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Twitter sx={{ color: '#1da1f2' }} /></InputAdornment>
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, marginBottom: 3 }}>
              <TextField
                fullWidth
                placeholder="Instagram Handle"
                value={collegeFormData.socialMedia.instagram}
                onChange={(e) => handleCollegeFormChange('socialMedia.instagram', e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Instagram sx={{ color: '#e4405f' }} /></InputAdornment>
                }}
              />
              <TextField
                fullWidth
                placeholder="LinkedIn Page URL"
                value={collegeFormData.socialMedia.linkedin}
                onChange={(e) => handleCollegeFormChange('socialMedia.linkedin', e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><LinkedIn sx={{ color: '#0077b5' }} /></InputAdornment>
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, marginBottom: 3 }}>
              <TextField
                fullWidth
                placeholder="YouTube Channel URL"
                value={collegeFormData.socialMedia.youtube}
                onChange={(e) => handleCollegeFormChange('socialMedia.youtube', e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><YouTube sx={{ color: '#ff0000' }} /></InputAdornment>
                }}
              />
              <Box sx={{ width: { xs: '0%', sm: '50%' } }}></Box>
            </Box>
          </Box>

          <Box sx={{ marginTop: 5 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, marginBottom: 3, color: '#10b981' }}>
              Departments
            </Typography>
            <Box sx={{ marginBottom: 3 }}>
              <TextField
                fullWidth
                placeholder="Enter department name and press Enter"
                value={tempInput}
                onChange={(e) => setTempInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addDepartment();
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<Add />}
                        onClick={addDepartment}
                        disabled={!tempInput.trim()}
                      >
                        Add
                      </Button>
                    </InputAdornment>
                  )
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {collegeFormData.departments.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No departments added yet
                </Typography>
              ) : (
                collegeFormData.departments.map((dept, index) => (
                  <Chip
                    key={index}
                    label={dept}
                    onDelete={() => removeDepartment(index)}
                    deleteIcon={<Delete />}
                  />
                ))
              )}
            </Box>
          </Box>

          <Box sx={{ marginTop: 5 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, marginBottom: 3, color: '#f97316' }}>
              Student Life & Campus
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, marginBottom: 3 }}>
              <TextField
                fullWidth
                label="Total Student Enrollment"
                type="number"
                value={collegeFormData.studentLife.totalStudents}
                onChange={(e) => handleCollegeFormChange('studentLife.totalStudents', e.target.value)}
                placeholder="e.g., 15000"
              />
              <TextField
                fullWidth
                label="International Students"
                type="number"
                value={collegeFormData.studentLife.internationalStudents}
                onChange={(e) => handleCollegeFormChange('studentLife.internationalStudents', e.target.value)}
                placeholder="e.g., 3000"
              />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, marginBottom: 3 }}>
              <TextField
                fullWidth
                label="Student-Faculty Ratio"
                value={collegeFormData.studentLife.studentToFacultyRatio}
                onChange={(e) => handleCollegeFormChange('studentLife.studentToFacultyRatio', e.target.value)}
                placeholder="e.g., 15:1"
              />
              <TextField
                fullWidth
                label="Number of Student Clubs"
                type="number"
                value={collegeFormData.studentLife.clubs}
                onChange={(e) => handleCollegeFormChange('studentLife.clubs', e.target.value)}
                placeholder="e.g., 250"
              />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, marginBottom: 3 }}>
              <TextField
                fullWidth
                label="Campus Size"
                type="number"
                value={collegeFormData.campusSize.value}
                onChange={(e) => handleCollegeFormChange('campusSize.value', e.target.value)}
                placeholder="e.g., 168"
              />
              <TextField
                fullWidth
                select
                label="Unit"
                value={collegeFormData.campusSize.unit}
                onChange={(e) => handleCollegeFormChange('campusSize.unit', e.target.value)}
              >
                <MenuItem value="acres">Acres</MenuItem>
                <MenuItem value="hectares">Hectares</MenuItem>
                <MenuItem value="sq ft">Square Feet</MenuItem>
                <MenuItem value="sq meters">Square Meters</MenuItem>
              </TextField>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 5 }}>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSaveCollege}
              disabled={!collegeFormData.name || !collegeFormData.country || saveLoading}
              size="large"
              sx={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                paddingLeft: 4,
                paddingRight: 4,
                paddingTop: 1.5,
                paddingBottom: 1.5,
                '&:hover': {
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                }
              }}
            >
              {saveLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </DashboardLayout>
  );
};

export default CollegeEdit;
