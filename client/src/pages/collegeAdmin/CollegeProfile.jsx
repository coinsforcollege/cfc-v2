import React, { useState, useEffect } from 'react';
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
import { useNavigate } from 'react-router';
import { collegeAdminApi } from '../../api/collegeAdmin.api';
import { getImageUrl } from '../../utils/imageUtils';
import { useToast } from '../../contexts/ToastContext';
import DashboardLayout from '../../layouts/DashboardLayout';
import { COUNTRIES } from '../../constants/countries';
import { useTranslation } from 'react-i18next';

const CollegeProfile = () => {
  const { t } = useTranslation();
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
    if (!user || user.role !== 'college_admin') {
      navigate('/auth/login');
      return;
    }
    fetchDashboard();
  }, [user, navigate]);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await collegeAdminApi.getDashboard();

      if (response.data.college) {
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
      console.error('Error fetching dashboard:', error);
      showToast(t('collegeAdminCollegeProfile.errorLoadFailed'), 'error');
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
        showToast(t('collegeAdminCollegeProfile.errorInvalidImageFile'), 'error');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        showToast(t('collegeAdminCollegeProfile.errorFileSizeTooLarge'), 'error');
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
        showToast(t('collegeAdminCollegeProfile.errorInvalidImageFile'), 'error');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        showToast(t('collegeAdminCollegeProfile.errorFileSizeTooLarge'), 'error');
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

      const objectFields = ['socialMedia', 'departments', 'tokenPreferences', 'campusSize', 'studentLife'];
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

      await collegeAdminApi.updateCollegeDetails(formData);
      showToast(t('collegeAdminCollegeProfile.successUpdated'), 'success');
      fetchDashboard();
      setLogoFile(null);
      setCoverFile(null);
    } catch (error) {
      console.error('Error saving college:', error);
      showToast(t('collegeAdminCollegeProfile.errorUpdateFailed'), 'error');
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
                  {t('collegeAdminCollegeProfile.pageTitle')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('collegeAdminCollegeProfile.pageDescription')}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<ArrowBack />}
                  onClick={() => navigate('/college-admin/overview')}
                >
                  {t('collegeAdminCollegeProfile.buttonCancel')}
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
                  {saveLoading ? t('collegeAdminCollegeProfile.buttonSaving') : t('collegeAdminCollegeProfile.buttonSave')}
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Paper sx={{ padding: 5, borderRadius: 3, boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)' }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, marginBottom: 3, color: '#667eea' }}>
              {t('collegeAdminCollegeProfile.sectionBasicInformation')}
            </Typography>
            <Box sx={{ marginBottom: 3 }}>
              <TextField
                fullWidth
                label={t('collegeAdminCollegeProfile.labelCollegeName')}
                value={collegeFormData.name}
                onChange={(e) => handleCollegeFormChange('name', e.target.value)}
                required
                disabled
                helperText={t('collegeAdminCollegeProfile.helperCannotChange')}
              />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, marginBottom: 3 }}>
              <TextField
                fullWidth
                label={t('collegeAdminCollegeProfile.labelShortName')}
                value={collegeFormData.shortName}
                onChange={(e) => handleCollegeFormChange('shortName', e.target.value)}
                placeholder={t('collegeAdminCollegeProfile.placeholderShortName')}
              />
              <TextField
                fullWidth
                label={t('collegeAdminCollegeProfile.labelTagline')}
                value={collegeFormData.tagline}
                onChange={(e) => handleCollegeFormChange('tagline', e.target.value)}
                placeholder={t('collegeAdminCollegeProfile.placeholderTagline')}
              />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, marginBottom: 3 }}>
              <TextField
                fullWidth
                select
                label={t('collegeAdminCollegeProfile.labelType')}
                value={collegeFormData.type}
                onChange={(e) => handleCollegeFormChange('type', e.target.value)}
              >
                <MenuItem value="University">{t('collegeAdminCollegeProfile.typeUniversity')}</MenuItem>
                <MenuItem value="College">{t('collegeAdminCollegeProfile.typeCollege')}</MenuItem>
                <MenuItem value="Institute">{t('collegeAdminCollegeProfile.typeInstitute')}</MenuItem>
                <MenuItem value="School">{t('collegeAdminCollegeProfile.typeSchool')}</MenuItem>
                <MenuItem value="Other">{t('collegeAdminCollegeProfile.typeOther')}</MenuItem>
              </TextField>
              <TextField
                fullWidth
                label={t('collegeAdminCollegeProfile.labelEstablishedYear')}
                type="number"
                value={collegeFormData.establishedYear}
                onChange={(e) => handleCollegeFormChange('establishedYear', e.target.value)}
                placeholder={t('collegeAdminCollegeProfile.placeholderEstablishedYear')}
              />
            </Box>
            <Box sx={{ marginBottom: 3 }}>
              <TextField
                fullWidth
                label={t('collegeAdminCollegeProfile.labelShortDescription')}
                multiline
                rows={3}
                value={collegeFormData.description}
                onChange={(e) => handleCollegeFormChange('description', e.target.value)}
                placeholder={t('collegeAdminCollegeProfile.placeholderShortDescription')}
                helperText={`${(collegeFormData.description || '').length} ${t('collegeAdminCollegeProfile.characters')}`}
              />
            </Box>
          </Box>

          <Box sx={{ marginTop: 5 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, marginBottom: 3, color: '#ec4899' }}>
              {t('collegeAdminCollegeProfile.sectionLocation')}
            </Typography>
            <Box sx={{ marginBottom: 3 }}>
              <TextField
                fullWidth
                select
                label={t('collegeAdminCollegeProfile.labelCountry')}
                value={collegeFormData.country}
                onChange={(e) => handleCollegeFormChange('country', e.target.value)}
                required
                disabled
                helperText={t('collegeAdminCollegeProfile.helperCannotChange')}
              >
                {COUNTRIES.map((country) => (
                  <MenuItem key={country} value={country}>
                    {country}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, marginBottom: 3 }}>
              <TextField
                fullWidth
                label={t('collegeAdminCollegeProfile.labelState')}
                value={collegeFormData.state}
                onChange={(e) => handleCollegeFormChange('state', e.target.value)}
                placeholder={t('collegeAdminCollegeProfile.placeholderState')}
              />
              <TextField
                fullWidth
                label={t('collegeAdminCollegeProfile.labelCity')}
                value={collegeFormData.city}
                onChange={(e) => handleCollegeFormChange('city', e.target.value)}
                placeholder={t('collegeAdminCollegeProfile.placeholderCity')}
              />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, marginBottom: 3 }}>
              <TextField
                fullWidth
                label={t('collegeAdminCollegeProfile.labelZipCode')}
                value={collegeFormData.zipCode}
                onChange={(e) => handleCollegeFormChange('zipCode', e.target.value)}
                placeholder={t('collegeAdminCollegeProfile.placeholderZipCode')}
              />
              <TextField
                fullWidth
                label={t('collegeAdminCollegeProfile.labelStreetAddress')}
                value={collegeFormData.address}
                onChange={(e) => handleCollegeFormChange('address', e.target.value)}
                placeholder={t('collegeAdminCollegeProfile.placeholderStreetAddress')}
              />
            </Box>
          </Box>

          <Box sx={{ marginTop: 5 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, marginBottom: 3, color: '#4ecdc4' }}>
              {t('collegeAdminCollegeProfile.sectionBranding')}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, marginBottom: 3 }}>
              <Box sx={{ width: '100%' }}>
                <TextField
                  fullWidth
                  label={t('collegeAdminCollegeProfile.labelLogoURL')}
                  value={collegeFormData.logo || ''}
                  onChange={(e) => {
                    handleCollegeFormChange('logo', e.target.value);
                    if (e.target.value) setLogoPreview(e.target.value);
                  }}
                  placeholder="https://..."
                  sx={{ marginBottom: 2 }}
                />
                <Button variant="outlined" component="label" fullWidth sx={{ marginBottom: 2 }}>
                  {t('collegeAdminCollegeProfile.buttonUploadLogo')}
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
                  label={t('collegeAdminCollegeProfile.labelCoverImageURL')}
                  value={collegeFormData.coverImage || ''}
                  onChange={(e) => {
                    handleCollegeFormChange('coverImage', e.target.value);
                    if (e.target.value) setCoverPreview(e.target.value);
                  }}
                  placeholder="https://..."
                  sx={{ marginBottom: 2 }}
                />
                <Button variant="outlined" component="label" fullWidth sx={{ marginBottom: 2 }}>
                  {t('collegeAdminCollegeProfile.buttonUploadCover')}
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
                label={t('collegeAdminCollegeProfile.labelVideoURL')}
                value={collegeFormData.videoUrl}
                onChange={(e) => handleCollegeFormChange('videoUrl', e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                helperText={t('collegeAdminCollegeProfile.helperVideoURL')}
              />
            </Box>
          </Box>

          <Box sx={{ marginTop: 5 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, marginBottom: 3, color: '#f59e0b' }}>
              {t('collegeAdminCollegeProfile.sectionAboutMission')}
            </Typography>
            <Box sx={{ marginBottom: 3 }}>
              <TextField
                fullWidth
                label={t('collegeAdminCollegeProfile.labelAbout')}
                multiline
                rows={6}
                value={collegeFormData.about}
                onChange={(e) => handleCollegeFormChange('about', e.target.value)}
                placeholder={t('collegeAdminCollegeProfile.placeholderAbout')}
                helperText={`${(collegeFormData.about || '').length} ${t('collegeAdminCollegeProfile.characters')}`}
              />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, marginBottom: 3 }}>
              <TextField
                fullWidth
                label={t('collegeAdminCollegeProfile.labelMission')}
                multiline
                rows={3}
                value={collegeFormData.mission}
                onChange={(e) => handleCollegeFormChange('mission', e.target.value)}
                placeholder={t('collegeAdminCollegeProfile.placeholderMission')}
              />
              <TextField
                fullWidth
                label={t('collegeAdminCollegeProfile.labelVision')}
                multiline
                rows={3}
                value={collegeFormData.vision}
                onChange={(e) => handleCollegeFormChange('vision', e.target.value)}
                placeholder={t('collegeAdminCollegeProfile.placeholderVision')}
              />
            </Box>
          </Box>

          <Box sx={{ marginTop: 5 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, marginBottom: 3, color: '#45b7d1' }}>
              {t('collegeAdminCollegeProfile.sectionContactInformation')}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, marginBottom: 3 }}>
              <TextField
                fullWidth
                label={t('collegeAdminCollegeProfile.labelWebsite')}
                value={collegeFormData.website}
                onChange={(e) => handleCollegeFormChange('website', e.target.value)}
                placeholder={t('collegeAdminCollegeProfile.placeholderWebsite')}
              />
              <TextField
                fullWidth
                label={t('collegeAdminCollegeProfile.labelEmail')}
                type="email"
                value={collegeFormData.email}
                onChange={(e) => handleCollegeFormChange('email', e.target.value)}
                placeholder={t('collegeAdminCollegeProfile.placeholderEmail')}
              />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, marginBottom: 3 }}>
              <TextField
                fullWidth
                label={t('collegeAdminCollegeProfile.labelPhone')}
                value={collegeFormData.phone}
                onChange={(e) => handleCollegeFormChange('phone', e.target.value)}
                placeholder={t('collegeAdminCollegeProfile.placeholderPhone')}
              />
              <Box sx={{ width: { xs: '0%', sm: '50%' } }}></Box>
            </Box>
          </Box>

          <Box sx={{ marginTop: 5 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, marginBottom: 3, color: '#8b5cf6' }}>
              {t('collegeAdminCollegeProfile.sectionSocialMedia')}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, marginBottom: 3 }}>
              <TextField
                fullWidth
                placeholder={t('collegeAdminCollegeProfile.placeholderFacebook')}
                value={collegeFormData.socialMedia.facebook}
                onChange={(e) => handleCollegeFormChange('socialMedia.facebook', e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Facebook sx={{ color: '#1877f2' }} /></InputAdornment>
                }}
              />
              <TextField
                fullWidth
                placeholder={t('collegeAdminCollegeProfile.placeholderTwitter')}
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
                placeholder={t('collegeAdminCollegeProfile.placeholderInstagram')}
                value={collegeFormData.socialMedia.instagram}
                onChange={(e) => handleCollegeFormChange('socialMedia.instagram', e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Instagram sx={{ color: '#e4405f' }} /></InputAdornment>
                }}
              />
              <TextField
                fullWidth
                placeholder={t('collegeAdminCollegeProfile.placeholderLinkedIn')}
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
                placeholder={t('collegeAdminCollegeProfile.placeholderYouTube')}
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
              {t('collegeAdminCollegeProfile.sectionDepartments')}
            </Typography>
            <Box sx={{ marginBottom: 3 }}>
              <TextField
                fullWidth
                placeholder={t('collegeAdminCollegeProfile.placeholderDepartment')}
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
                        {t('collegeAdminCollegeProfile.buttonAdd')}
                      </Button>
                    </InputAdornment>
                  )
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {collegeFormData.departments.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  {t('collegeAdminCollegeProfile.noDepartmentsAdded')}
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
              {t('collegeAdminCollegeProfile.sectionStudentLife')}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, marginBottom: 3 }}>
              <TextField
                fullWidth
                label={t('collegeAdminCollegeProfile.labelTotalStudents')}
                type="number"
                value={collegeFormData.studentLife.totalStudents}
                onChange={(e) => handleCollegeFormChange('studentLife.totalStudents', e.target.value)}
                placeholder={t('collegeAdminCollegeProfile.placeholderTotalStudents')}
              />
              <TextField
                fullWidth
                label={t('collegeAdminCollegeProfile.labelInternationalStudents')}
                type="number"
                value={collegeFormData.studentLife.internationalStudents}
                onChange={(e) => handleCollegeFormChange('studentLife.internationalStudents', e.target.value)}
                placeholder={t('collegeAdminCollegeProfile.placeholderInternationalStudents')}
              />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, marginBottom: 3 }}>
              <TextField
                fullWidth
                label={t('collegeAdminCollegeProfile.labelStudentFacultyRatio')}
                value={collegeFormData.studentLife.studentToFacultyRatio}
                onChange={(e) => handleCollegeFormChange('studentLife.studentToFacultyRatio', e.target.value)}
                placeholder={t('collegeAdminCollegeProfile.placeholderStudentFacultyRatio')}
              />
              <TextField
                fullWidth
                label={t('collegeAdminCollegeProfile.labelNumberOfClubs')}
                type="number"
                value={collegeFormData.studentLife.clubs}
                onChange={(e) => handleCollegeFormChange('studentLife.clubs', e.target.value)}
                placeholder={t('collegeAdminCollegeProfile.placeholderNumberOfClubs')}
              />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, marginBottom: 3 }}>
              <TextField
                fullWidth
                label={t('collegeAdminCollegeProfile.labelCampusSize')}
                type="number"
                value={collegeFormData.campusSize.value}
                onChange={(e) => handleCollegeFormChange('campusSize.value', e.target.value)}
                placeholder={t('collegeAdminCollegeProfile.placeholderCampusSize')}
              />
              <TextField
                fullWidth
                select
                label={t('collegeAdminCollegeProfile.labelUnit')}
                value={collegeFormData.campusSize.unit}
                onChange={(e) => handleCollegeFormChange('campusSize.unit', e.target.value)}
              >
                <MenuItem value="acres">{t('collegeAdminCollegeProfile.unitAcres')}</MenuItem>
                <MenuItem value="hectares">{t('collegeAdminCollegeProfile.unitHectares')}</MenuItem>
                <MenuItem value="sq ft">{t('collegeAdminCollegeProfile.unitSquareFeet')}</MenuItem>
                <MenuItem value="sq meters">{t('collegeAdminCollegeProfile.unitSquareMeters')}</MenuItem>
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
              {saveLoading ? t('collegeAdminCollegeProfile.buttonSaving') : t('collegeAdminCollegeProfile.buttonSave')}
            </Button>
          </Box>
        </Paper>
      </Box>
    </DashboardLayout>
  );
};

export default CollegeProfile;
