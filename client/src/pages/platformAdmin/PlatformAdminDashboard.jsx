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
  Chip,
  Avatar,
  TextField,
  InputAdornment,
  IconButton,
  LinearProgress,
  Button,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Grid,
  MenuItem
} from '@mui/material';
import { 
  School, 
  People, 
  TrendingUp, 
  AccountBalance,
  Search,
  Verified,
  Email,
  Phone,
  CalendarToday,
  Add,
  Edit,
  Dashboard as DashboardIcon,
  Settings,
  Delete,
  ArrowBack,
  Save,
  Campaign,
  CheckCircle,
  Cancel,
  HourglassEmpty,
  Visibility
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router';
import { platformAdminApi } from '../../api/platformAdmin.api';
import { ambassadorApi } from '../../api/ambassador.api';

const SIDEBAR_WIDTH = 260;

const PlatformAdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [applications, setApplications] = useState([]);
  const [applicationStats, setApplicationStats] = useState(null);
  const [activeSection, setActiveSection] = useState('overview');
  const [studentSearch, setStudentSearch] = useState('');
  const [collegeSearch, setCollegeSearch] = useState('');
  const [applicationSearch, setApplicationSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCollegeForm, setShowCollegeForm] = useState(false);
  const [editingCollege, setEditingCollege] = useState(null);
  const [tempInput, setTempInput] = useState('');
  
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
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, studentsRes, collegesRes, applicationsRes] = await Promise.all([
        platformAdminApi.getStats(),
        platformAdminApi.getAllStudents(),
        platformAdminApi.getAllColleges(),
        ambassadorApi.getAllApplications()
      ]);
      setStats(statsRes.data.stats);
      setStudents(studentsRes.data);
      setColleges(collegesRes.data);
      if (applicationsRes.success) {
        setApplications(applicationsRes.data.applications);
        setApplicationStats(applicationsRes.data.stats);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
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
    setShowCollegeForm(true);
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
    setShowCollegeForm(true);
  };

  const handleSaveCollege = async () => {
    try {
      setLoading(true);
      if (editingCollege) {
        await platformAdminApi.updateCollege(editingCollege._id, collegeFormData);
      } else {
        await platformAdminApi.createCollege(collegeFormData);
      }
      await fetchData();
      setShowCollegeForm(false);
      setEditingCollege(null);
    } catch (error) {
      console.error('Error saving college:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelCollegeForm = () => {
    setShowCollegeForm(false);
    setEditingCollege(null);
  };

  const handleUpdateApplicationStatus = async (applicationId, status, reviewNotes = '') => {
    try {
      await ambassadorApi.updateApplicationStatus(applicationId, status, reviewNotes);
      await fetchData();
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
    student.email.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const filteredColleges = colleges.filter(college =>
    college.name.toLowerCase().includes(collegeSearch.toLowerCase()) ||
    college.country.toLowerCase().includes(collegeSearch.toLowerCase())
  );

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(applicationSearch.toLowerCase()) ||
      app.email.toLowerCase().includes(applicationSearch.toLowerCase()) ||
      (app.college?.name || '').toLowerCase().includes(applicationSearch.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading && !stats) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LinearProgress sx={{ width: '50%' }} />
      </Box>
    );
  }

  const renderOverview = () => (
    <>
      {/* Stats Cards */}
      <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
        <Card sx={{ flex: '1 1 220px', borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                p: 1.5,
                borderRadius: 2,
                display: 'flex'
              }}>
                <People sx={{ color: 'white', fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Total Students</Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>{stats?.totalStudents || 0}</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ flex: '1 1 220px', borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ 
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                p: 1.5,
                borderRadius: 2,
                display: 'flex'
              }}>
                <School sx={{ color: 'white', fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Total Colleges</Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>{stats?.totalColleges || 0}</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ flex: '1 1 220px', borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ 
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                p: 1.5,
                borderRadius: 2,
                display: 'flex'
              }}>
                <TrendingUp sx={{ color: 'white', fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Active Miners</Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>{stats?.activeMiningSessions || 0}</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ flex: '1 1 220px', borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ 
                background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                p: 1.5,
                borderRadius: 2,
                display: 'flex'
              }}>
                <AccountBalance sx={{ color: 'white', fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Total Tokens</Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {stats?.totalTokensMined ? stats.totalTokensMined.toFixed(2) : '0.00'}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Quick Stats */}
      <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Platform Overview</Typography>
          <Typography variant="body2" color="text.secondary">
            Manage students, colleges, and monitor the entire platform from this dashboard.
          </Typography>
        </CardContent>
      </Card>
    </>
  );

  const renderStudents = () => (
    <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Students ({students.length})</Typography>
        </Box>
        
        <TextField
          placeholder="Search students..."
          fullWidth
          value={studentSearch}
          onChange={(e) => setStudentSearch(e.target.value)}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Student</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>College</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">Mining Colleges</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">Referrals</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Joined</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow 
                  key={student._id}
                  sx={{ '&:hover': { background: 'rgba(0,0,0,0.02)' } }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                        {student.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{student.name}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Email sx={{ fontSize: 12, color: '#64748b' }} />
                          <Typography variant="caption" color="text.secondary">{student.email}</Typography>
                        </Box>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{student.college?.name || 'N/A'}</Typography>
                    <Typography variant="caption" color="text.secondary">{student.college?.country || ''}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Chip 
                      label={student.studentProfile?.miningColleges?.length || 0}
                      size="small"
                      sx={{ 
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        fontWeight: 600 
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">{student.studentProfile?.totalReferrals || 0}</Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <CalendarToday sx={{ fontSize: 14, color: '#64748b' }} />
                      <Typography variant="caption">
                        {new Date(student.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {filteredStudents.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">No students found</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  const renderColleges = () => {
    if (showCollegeForm) {
      return (
        <>
          {/* Fixed Header */}
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', mb: 3 }}>
            <CardContent>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center'
              }}>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {editingCollege ? 'Edit College' : 'Add New College'}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={handleCancelCollegeForm}
                    sx={{ borderRadius: 2 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSaveCollege}
                    disabled={!collegeFormData.name || !collegeFormData.country}
                    sx={{ 
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      borderRadius: 2
                    }}
                  >
                    {editingCollege ? 'Update' : 'Create'}
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Form Sections - No scroll container */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* BASIC INFORMATION */}
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
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
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
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
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#667eea' }}>
                  Media & Branding
                </Typography>
                <Grid container spacing={2.5}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Logo URL"
                      fullWidth
                      value={collegeFormData.logo}
                      onChange={(e) => handleCollegeFormChange('logo', e.target.value)}
                      placeholder="https://..."
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Cover Image URL"
                      fullWidth
                      value={collegeFormData.coverImage}
                      onChange={(e) => handleCollegeFormChange('coverImage', e.target.value)}
                      placeholder="https://..."
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Video URL"
                      fullWidth
                      value={collegeFormData.videoUrl}
                      onChange={(e) => handleCollegeFormChange('videoUrl', e.target.value)}
                      placeholder="YouTube/Vimeo"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* ABOUT & MISSION */}
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
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
                      rows={15}
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
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
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
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
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
        </>
      );
    }

    // College list view
    return (
      <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Colleges ({colleges.length})</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddCollege}
              sx={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }}
            >
              Add College
            </Button>
          </Box>
          
          <TextField
            placeholder="Search colleges..."
            fullWidth
            value={collegeSearch}
            onChange={(e) => setCollegeSearch(e.target.value)}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>College</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Admin</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">Total Miners</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">Active Miners</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">Tokens Mined</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredColleges.map((college) => (
                  <TableRow 
                    key={college._id}
                    sx={{ '&:hover': { background: 'rgba(0,0,0,0.02)' } }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                          {college.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{college.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{college.country}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {college.admin ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Verified sx={{ fontSize: 14, color: '#10b981' }} />
                          <Typography variant="caption">Claimed</Typography>
                        </Box>
                      ) : (
                        <Typography variant="caption" color="text.secondary">Unclaimed</Typography>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2">{college.stats?.totalMiners || 0}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2">{college.stats?.activeMiners || 0}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2">
                        {college.stats?.totalTokensMined ? college.stats.totalTokensMined.toFixed(2) : '0.00'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={college.isActive ? 'Active' : 'Inactive'}
                        size="small"
                        sx={{ 
                          background: college.isActive 
                            ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                            : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                          color: 'white',
                          fontWeight: 600 
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleEditCollege(college)}
                        sx={{ color: '#667eea' }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {filteredColleges.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body2" color="text.secondary">No colleges found</Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderSubmissions = () => {
    const getStatusIcon = (status) => {
      switch (status) {
        case 'approved': return <CheckCircle sx={{ color: '#10b981' }} />;
        case 'rejected': return <Cancel sx={{ color: '#ef4444' }} />;
        case 'under_review': return <HourglassEmpty sx={{ color: '#f59e0b' }} />;
        default: return <Visibility sx={{ color: '#6b7280' }} />;
      }
    };

    const getStatusColor = (status) => {
      switch (status) {
        case 'approved': return { background: '#dcfce7', color: '#166534' };
        case 'rejected': return { background: '#fee2e2', color: '#991b1b' };
        case 'under_review': return { background: '#fef3c7', color: '#92400e' };
        default: return { background: '#e5e7eb', color: '#374151' };
      }
    };

    return (
      <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Campus Ambassador Applications ({applications.length})
            </Typography>
          </Box>

          {/* Stats Row */}
          {applicationStats && (
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
              <Chip 
                label={`Pending: ${applicationStats.pending}`} 
                sx={{ background: '#e5e7eb', fontWeight: 600 }} 
              />
              <Chip 
                label={`Under Review: ${applicationStats.under_review}`} 
                sx={{ background: '#fef3c7', color: '#92400e', fontWeight: 600 }} 
              />
              <Chip 
                label={`Approved: ${applicationStats.approved}`} 
                sx={{ background: '#dcfce7', color: '#166534', fontWeight: 600 }} 
              />
              <Chip 
                label={`Rejected: ${applicationStats.rejected}`} 
                sx={{ background: '#fee2e2', color: '#991b1b', fontWeight: 600 }} 
              />
            </Box>
          )}

          {/* Filters */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              placeholder="Search applications..."
              value={applicationSearch}
              onChange={(e) => setApplicationSearch(e.target.value)}
              size="small"
              sx={{ flex: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              select
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              size="small"
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="under_review">Under Review</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </TextField>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Applicant</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>College</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Year</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Submitted</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredApplications.map((application) => (
                  <TableRow 
                    key={application._id}
                    sx={{ '&:hover': { background: '#f9fafb' } }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)' }}>
                          {application.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography sx={{ fontWeight: 600 }}>{application.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {application.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography sx={{ fontWeight: 500 }}>
                          {application.college?.name || 'N/A'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {application.college?.country}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={application.yearOfStudy} 
                        size="small"
                        sx={{ background: '#e0f2fe', color: '#075985' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(application.submittedAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(application.status)}
                        label={application.status.replace('_', ' ').toUpperCase()}
                        size="small"
                        sx={{
                          ...getStatusColor(application.status),
                          fontWeight: 600,
                          textTransform: 'capitalize'
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        {application.status === 'pending' && (
                          <>
                            <Button
                              size="small"
                              variant="outlined"
                              color="warning"
                              onClick={() => handleUpdateApplicationStatus(application._id, 'under_review')}
                            >
                              Review
                            </Button>
                            <Button
                              size="small"
                              variant="contained"
                              color="success"
                              onClick={() => handleUpdateApplicationStatus(application._id, 'approved')}
                            >
                              Approve
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              onClick={() => handleUpdateApplicationStatus(application._id, 'rejected')}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        {application.status === 'under_review' && (
                          <>
                            <Button
                              size="small"
                              variant="contained"
                              color="success"
                              onClick={() => handleUpdateApplicationStatus(application._id, 'approved')}
                            >
                              Approve
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              onClick={() => handleUpdateApplicationStatus(application._id, 'rejected')}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {filteredApplications.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body2" color="text.secondary">No applications found</Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return renderOverview();
      case 'students':
        return renderStudents();
      case 'colleges':
        return renderColleges();
      case 'submissions':
        return renderSubmissions();
      default:
        return renderOverview();
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: '#f8fafc', 
      pt: { xs: 12, md: 14 },
      pb: 4,
      px: { xs: 2, md: 3 }
    }}>
      <Box sx={{ 
        maxWidth: '1200px',
        mx: 'auto',
        display: 'flex',
        gap: 3,
        minHeight: 'calc(100vh - 200px)'
      }}>
        {/* Sidebar */}
        <Box
          sx={{
            width: SIDEBAR_WIDTH,
            flexShrink: 0,
            background: 'white',
            borderRadius: 3,
            border: '1px solid #e2e8f0',
            height: 'fit-content',
            position: 'sticky',
            top: '100px'
          }}
        >
          <Box sx={{ p: 3, borderBottom: '1px solid #e2e8f0' }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>Platform Admin</Typography>
            <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
          </Box>
        
        <List sx={{ px: 2, py: 2 }}>
          <ListItemButton
            selected={activeSection === 'overview'}
            onClick={() => setActiveSection('overview')}
            sx={{
              borderRadius: 2,
              mb: 1,
              '&.Mui-selected': {
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                '&:hover': {
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                },
                '& .MuiListItemIcon-root': { color: 'white' }
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Overview" />
          </ListItemButton>

          <ListItemButton
            selected={activeSection === 'students'}
            onClick={() => {
              setActiveSection('students');
              setShowCollegeForm(false);
            }}
            sx={{
              borderRadius: 2,
              mb: 1,
              '&.Mui-selected': {
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                '&:hover': {
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                },
                '& .MuiListItemIcon-root': { color: 'white' }
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <People />
            </ListItemIcon>
            <ListItemText primary="Students" />
            <Chip 
              label={students.length} 
              size="small" 
              sx={{ 
                ml: 1,
                background: activeSection === 'students' ? 'rgba(255,255,255,0.2)' : '#e2e8f0',
                color: activeSection === 'students' ? 'white' : '#64748b',
                fontWeight: 600
              }} 
            />
          </ListItemButton>

          <ListItemButton
            selected={activeSection === 'colleges'}
            onClick={() => {
              setActiveSection('colleges');
              setShowCollegeForm(false);
            }}
            sx={{
              borderRadius: 2,
              mb: 1,
              '&.Mui-selected': {
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                '&:hover': {
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                },
                '& .MuiListItemIcon-root': { color: 'white' }
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <School />
            </ListItemIcon>
            <ListItemText primary="Colleges" />
            <Chip 
              label={colleges.length} 
              size="small" 
              sx={{ 
                ml: 1,
                background: activeSection === 'colleges' ? 'rgba(255,255,255,0.2)' : '#e2e8f0',
                color: activeSection === 'colleges' ? 'white' : '#64748b',
                fontWeight: 600
              }} 
            />
          </ListItemButton>

          <ListItemButton
            selected={activeSection === 'submissions'}
            onClick={() => {
              setActiveSection('submissions');
              setShowCollegeForm(false);
            }}
            sx={{
              borderRadius: 2,
              mb: 1,
              '&.Mui-selected': {
                background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                color: 'white',
                '&:hover': {
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                },
                '& .MuiListItemIcon-root': { color: 'white' }
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Campaign />
            </ListItemIcon>
            <ListItemText primary="Submissions" />
            <Chip 
              label={applications.length} 
              size="small" 
              sx={{ 
                ml: 1,
                background: activeSection === 'submissions' ? 'rgba(255,255,255,0.2)' : '#e2e8f0',
                color: activeSection === 'submissions' ? 'white' : '#64748b',
                fontWeight: 600
              }} 
            />
          </ListItemButton>

          <Divider sx={{ my: 2 }} />

          <ListItemButton
            sx={{
              borderRadius: 2,
              mb: 1,
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Settings />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItemButton>
        </List>
        </Box>

        {/* Main Content */}
        <Box sx={{ 
          flexGrow: 1,
          minWidth: 0
        }}>
          {renderContent()}
        </Box>
      </Box>
    </Box>
  );
};

export default PlatformAdminDashboard;
