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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Grid,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import { 
  School, 
  People, 
  TrendingUp, 
  EmojiEvents,
  Edit,
  Dashboard as DashboardIcon,
  Settings,
  Add,
  Delete,
  ArrowBack,
  Save,
  Check,
  LocalGasStation,
  ShowChart,
  Code,
  Api,
  Security,
  CloudDone,
  Rocket,
  Stars,
  Speed,
  AttachMoney,
  AccountBalance,
  Token as TokenIcon,
  CloudUpload,
  Link as LinkIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router';
import { collegeAdminApi } from '../../api/collegeAdmin.api';
import { getImageUrl } from '../../utils/imageUtils';

// Helper function to get chip style based on status
const getStatusChipStyle = (status) => {
  switch(status) {
    case 'Unaffiliated':
      return {
        background: 'rgba(148, 163, 184, 0.9)',
        color: 'white'
      };
    case 'Waitlist':
      return {
        background: 'rgba(245, 158, 11, 0.9)',
        color: 'white'
      };
    case 'Building':
      return {
        background: 'rgba(59, 130, 246, 0.9)',
        color: 'white'
      };
    case 'Live':
      return {
        background: 'rgba(16, 185, 129, 0.9)',
        color: 'white'
      };
    default:
      return {
        background: 'rgba(229, 231, 235, 0.9)',
        color: '#6b7280'
      };
  }
};

const SIDEBAR_WIDTH = 260;

const CollegeAdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [community, setCommunity] = useState([]);
  const [activeSection, setActiveSection] = useState('overview');
  const [showCollegeForm, setShowCollegeForm] = useState(false);
  const [showTokenForm, setShowTokenForm] = useState(false);
  const [tempInput, setTempInput] = useState('');
  
  const [tokenFormData, setTokenFormData] = useState({
    name: '',
    ticker: '',
    maximumSupply: '',
    preferredLaunchDate: '',
    needExchangeListing: true,
    allocationForEarlyMiners: '',
    preferredUtilities: []
  });
  
  const [logoInputType, setLogoInputType] = useState('url');
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [coverInputType, setCoverInputType] = useState('url');
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
    fetchCommunity();
  }, [user, navigate]);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await collegeAdminApi.getDashboard();
      setDashboard(response.data);
      
      // Pre-fill form with existing college data
      if (response.data.college) {
        const college = response.data.college;
        setCollegeFormData({
          ...college,
          socialMedia: college.socialMedia || { facebook: '', twitter: '', instagram: '', linkedin: '', youtube: '' },
          studentLife: college.studentLife || { totalStudents: '', internationalStudents: '', studentToFacultyRatio: '', clubs: '' },
          departments: college.departments || [],
          campusSize: college.campusSize || { value: '', unit: 'acres' }
        });
        
        // Set existing image previews
        if (college.logo) {
          setLogoPreview(getImageUrl(college.logo));
          setLogoInputType('url');
        }
        if (college.coverImage) {
          setCoverPreview(getImageUrl(college.coverImage));
          setCoverInputType('url');
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      // If no college associated, redirect to college selection
      if (error.status === 404 || error.message?.includes('No college associated')) {
        navigate('/auth/college-admin-selection');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchCommunity = async () => {
    try {
      const response = await collegeAdminApi.viewCommunity();
      setCommunity(response.data.miners || []);
    } catch (error) {
      console.error('Error fetching community:', error);
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
        alert('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
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
        alert('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
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
      setLoading(true);
      
      const formData = new FormData();
      
      // Add all text fields
      const objectFields = ['socialMedia', 'departments', 'tokenPreferences', 'campusSize', 'studentLife'];
      Object.keys(collegeFormData).forEach(key => {
        if (objectFields.includes(key)) {
          formData.append(key, JSON.stringify(collegeFormData[key]));
        } else if (collegeFormData[key] !== '' && collegeFormData[key] !== null) {
          formData.append(key, collegeFormData[key]);
        }
      });
      
      // Add files if uploaded
      if (logoInputType === 'file' && logoFile) {
        formData.append('logoFile', logoFile);
      }
      if (coverInputType === 'file' && coverFile) {
        formData.append('coverFile', coverFile);
      }
      
      await collegeAdminApi.updateCollegeDetails(formData);
      await fetchDashboard();
      setShowCollegeForm(false);
      setLogoFile(null);
      setLogoPreview('');
      setCoverFile(null);
      setCoverPreview('');
    } catch (error) {
      console.error('Error saving college:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !dashboard) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LinearProgress sx={{ width: '50%' }} />
      </Box>
    );
  }

  const college = dashboard?.college || {};
  const stats = college?.stats || {};

  // Timeline data
  const timelineSteps = [
    { label: 'College Registration', completed: true },
    { label: 'Profile Setup', completed: true },
    { label: 'Community Building', completed: false },
    { label: 'Token Launch', completed: false },
  ];

  // Platform features
  const platformFeatures = [
    { icon: <LocalGasStation />, title: 'Gas Sponsorship', description: 'Zero transaction fees', enabled: true },
    { icon: <ShowChart />, title: 'Exchange Listing', description: 'InTuition Exchange', enabled: true },
    { icon: <Code />, title: 'Smart Contracts', description: 'Pre-built & audited', enabled: true },
    { icon: <Api />, title: 'API Access', description: 'Full platform API', enabled: true },
    { icon: <Security />, title: 'Security Audits', description: 'Professional audits', enabled: true },
    { icon: <CloudDone />, title: 'Cloud Infra', description: 'Scalable hosting', enabled: true },
    { icon: <AttachMoney />, title: 'Fiat On-Ramp', description: 'Easy token purchase', enabled: true },
    { icon: <Speed />, title: 'Fast Settlements', description: 'Instant transfers', enabled: true },
    { icon: <AccountBalance />, title: 'Multi-sig Wallets', description: 'Enhanced security', enabled: true },
  ];

  // Leaderboard data
  const leaderboardData = [
    { rank: 1, name: 'MIT', country: 'USA', miners: 8420, tokens: 12580.50 },
    { rank: 2, name: 'Stanford University', country: 'USA', miners: 7890, tokens: 11234.20 },
    { rank: 3, name: 'Harvard University', country: 'USA', miners: 7235, tokens: 10852.75 },
    { rank: 4, name: 'Oxford University', country: 'UK', miners: 6890, tokens: 10335.60 },
    { rank: 5, name: college.name, country: college.country, miners: stats.totalMiners || 0, tokens: stats.totalTokensMined || 0, highlight: true },
    { rank: 6, name: 'Cambridge University', country: 'UK', miners: 5890, tokens: 8835.40 },
  ];

  const renderOverview = () => (
    <>
      {/* Celebration Banner */}
      <Card sx={{ 
        borderRadius: 3, 
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)', 
        mb: 3,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                🎉 Welcome to Collegen, {college.name}!
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                You're part of something big. Your college token journey starts here.
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip 
                label={dashboard?.college?.status || 'Unaffiliated'}
                sx={{ 
                  ...getStatusChipStyle(dashboard?.college?.status),
                  fontWeight: 600
                }} 
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

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
                <Typography variant="body2" color="text.secondary">Total Miners</Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>{stats.totalMiners || 0}</Typography>
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
                <Typography variant="h5" sx={{ fontWeight: 700 }}>{stats.activeMiners || 0}</Typography>
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
                <EmojiEvents sx={{ color: 'white', fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Tokens Mined</Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {stats.totalTokensMined ? stats.totalTokensMined.toFixed(2) : '0.00'}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Launch Timeline */}
      <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <Rocket sx={{ color: '#667eea', fontSize: 28 }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Launch Timeline</Typography>
          </Box>
          <Box sx={{ position: 'relative', px: 2 }}>
            {/* Timeline line */}
            <Box sx={{ 
              position: 'absolute',
              top: 20,
              left: '10%',
              right: '10%',
              height: 4,
              background: '#e2e8f0',
              borderRadius: 2,
              zIndex: 0
            }}>
              {/* Animated progress line */}
              <Box sx={{ 
                height: '100%',
                width: '50%',
                background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
                borderRadius: 2,
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  right: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: '#10b981',
                  boxShadow: '0 0 0 4px rgba(16, 185, 129, 0.2)',
                  animation: 'pulse 2s infinite'
                }
              }} />
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
              {timelineSteps.map((step, index) => (
                <Box key={index} sx={{ flex: 1, textAlign: 'center' }}>
                  <Box sx={{ 
                    width: 44, 
                    height: 44, 
                    borderRadius: '50%',
                    background: step.completed 
                      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
                      : (!timelineSteps[index - 1]?.completed && index > 0) 
                        ? '#e2e8f0' 
                        : '#e2e8f0',
                    border: !step.completed && timelineSteps[index - 1]?.completed ? '3px solid #10b981' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    mb: 2,
                    boxShadow: step.completed 
                      ? '0 4px 12px rgba(16, 185, 129, 0.3)' 
                      : !step.completed && timelineSteps[index - 1]?.completed
                        ? '0 0 0 4px rgba(16, 185, 129, 0.2)'
                        : 'none',
                    animation: !step.completed && timelineSteps[index - 1]?.completed ? 'pulse 2s infinite' : 'none'
                  }}>
                    {step.completed ? (
                      <Check sx={{ color: 'white', fontSize: 24 }} />
                    ) : (
                      <Typography sx={{ 
                        color: timelineSteps[index - 1]?.completed ? '#10b981' : '#64748b',
                        fontWeight: 700
                      }}>
                        {index + 1}
                      </Typography>
                    )}
                  </Box>
                  <Typography variant="body2" sx={{ 
                    fontWeight: 600, 
                    color: step.completed ? '#10b981' : '#64748b',
                    mb: 0.5
                  }}>
                    {step.label}
                  </Typography>
                  {!step.completed && timelineSteps[index - 1]?.completed && (
                    <Chip 
                      label="In Progress" 
                      size="small" 
                      sx={{ 
                        background: 'rgba(16, 185, 129, 0.1)',
                        color: '#10b981',
                        fontWeight: 600,
                        fontSize: '10px'
                      }} 
                    />
                  )}
                </Box>
              ))}
            </Box>
          </Box>
          <Box sx={{ 
            mt: 4, 
            p: 2, 
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
            borderRadius: 2,
            textAlign: 'center'
          }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#667eea' }}>
              🚀 Expected Token Launch: Q2 2026
            </Typography>
          </Box>
          
          {/* Add keyframes for pulse animation */}
          <style>
            {`
              @keyframes pulse {
                0%, 100% {
                  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.2);
                }
                50% {
                  box-shadow: 0 0 0 8px rgba(16, 185, 129, 0.1);
                }
              }
            `}
          </style>
        </CardContent>
      </Card>

      {/* Platform Features */}
      <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Stars sx={{ color: '#667eea', fontSize: 28 }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Platform Features Enabled</Typography>
          </Box>
          <Grid container spacing={2.5}>
            {platformFeatures.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box sx={{ 
                  p: 2.5, 
                  borderRadius: 2.5, 
                  border: '2px solid',
                  borderColor: '#e2e8f0',
                  background: 'white',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.5,
                  transition: 'all 0.3s',
                  '&:hover': {
                    borderColor: '#667eea',
                    boxShadow: '0 4px 20px rgba(102, 126, 234, 0.15)',
                    transform: 'translateY(-2px)'
                  }
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      p: 1.5,
                      borderRadius: 2,
                      display: 'flex',
                      color: 'white'
                    }}>
                      {feature.icon}
                    </Box>
                    <Chip 
                      label="Enabled" 
                      size="small" 
                      sx={{ 
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '10px'
                      }} 
                    />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>{feature.title}</Typography>
                    <Typography variant="caption" color="text.secondary">{feature.description}</Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Global Leaderboard */}
      <Card id="leaderboard" sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <EmojiEvents sx={{ color: '#f59e0b', fontSize: 28 }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Global Leaderboard</Typography>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Rank</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>College</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">Miners</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">Tokens</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leaderboardData.map((item, index) => (
                  <TableRow 
                    key={index}
                    sx={{ 
                      background: item.highlight ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
                      '&:hover': { background: item.highlight ? 'rgba(102, 126, 234, 0.15)' : 'rgba(0,0,0,0.02)' }
                    }}
                  >
                    <TableCell>
                      <Chip 
                        label={item.rank}
                        size="small"
                        sx={{ 
                          background: item.rank <= 3 ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : '#e2e8f0',
                          color: item.rank <= 3 ? 'white' : '#64748b',
                          fontWeight: 700
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: item.highlight ? 700 : 600 }}>
                          {item.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">{item.country}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.miners}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.tokens.toFixed(2)}</Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </>
  );

  const renderCommunity = () => (
    <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>Active Miners</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Miner</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">Tokens Mined</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {community.map((miner, index) => (
                <TableRow key={index} sx={{ '&:hover': { background: 'rgba(0,0,0,0.02)' } }}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                        {miner.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{miner.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {miner.tokensMined ? miner.tokensMined.toFixed(4) : '0.0000'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={miner.status === 'active' ? 'Mining' : 'Idle'}
                      size="small"
                      sx={{ 
                        background: miner.status === 'active' 
                          ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                          : 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
                        color: 'white',
                        fontWeight: 600 
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {community.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">No miners yet</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  const renderCollegeManagement = () => {
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
                  Edit College Profile
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={() => setShowCollegeForm(false)}
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
                    Save Changes
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Form Sections */}
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
                      disabled
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
                      disabled
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

    // Show college info view
    return (
      <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>College Profile</Typography>
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={() => setShowCollegeForm(true)}
              sx={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }}
            >
              Edit Profile
            </Button>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Manage your college profile, add detailed information, and keep your community updated.
          </Typography>
        </CardContent>
      </Card>
    );
  };

  const renderTokenPreferences = () => {
    return (
      <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>Token Preferences</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Configure your college token details. These preferences will be used when your token launches.
          </Typography>
          <Grid container spacing={2.5}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Token Name"
                fullWidth
                value={tokenFormData.name}
                onChange={(e) => setTokenFormData({ ...tokenFormData, name: e.target.value })}
                placeholder="e.g., MIT Coin"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Token Ticker"
                fullWidth
                value={tokenFormData.ticker}
                onChange={(e) => setTokenFormData({ ...tokenFormData, ticker: e.target.value.toUpperCase() })}
                placeholder="e.g., MITC"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Maximum Supply"
                type="number"
                fullWidth
                value={tokenFormData.maximumSupply}
                onChange={(e) => setTokenFormData({ ...tokenFormData, maximumSupply: e.target.value })}
                placeholder="e.g., 1000000"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Allocation for Early Miners (%)"
                type="number"
                fullWidth
                value={tokenFormData.allocationForEarlyMiners}
                onChange={(e) => setTokenFormData({ ...tokenFormData, allocationForEarlyMiners: e.target.value })}
                placeholder="e.g., 30"
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2">List on InTuition Exchange?</Typography>
                <Chip 
                  label={tokenFormData.needExchangeListing ? 'Yes' : 'No'}
                  onClick={() => setTokenFormData({ ...tokenFormData, needExchangeListing: !tokenFormData.needExchangeListing })}
                  sx={{ 
                    background: tokenFormData.needExchangeListing 
                      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                      : '#e2e8f0',
                    color: tokenFormData.needExchangeListing ? 'white' : '#64748b',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Button 
                variant="contained" 
                startIcon={<Save />}
                sx={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: 2
                }}
              >
                Save Token Preferences
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return renderOverview();
      case 'community':
        return renderCommunity();
      case 'college':
        return renderCollegeManagement();
      case 'token':
        return renderTokenPreferences();
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
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>College Admin</Typography>
            <Typography variant="caption" color="text.secondary">{college.name}</Typography>
          </Box>
          
          <List sx={{ px: 2, py: 2 }}>
            <ListItemButton
              selected={activeSection === 'overview'}
              onClick={() => {
                setActiveSection('overview');
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
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Overview" />
            </ListItemButton>

            <ListItemButton
              selected={activeSection === 'college'}
              onClick={() => {
                setActiveSection('college');
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
              <ListItemText primary="College Profile" />
            </ListItemButton>

            <ListItemButton
              selected={activeSection === 'token'}
              onClick={() => {
                setActiveSection('token');
                setShowCollegeForm(false);
                setShowTokenForm(false);
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
                <TokenIcon />
              </ListItemIcon>
              <ListItemText primary="Token Preferences" />
            </ListItemButton>

            <ListItemButton
              selected={activeSection === 'community'}
              onClick={() => {
                setActiveSection('community');
                setShowCollegeForm(false);
                setShowTokenForm(false);
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
              <ListItemText primary="Community" />
              <Chip 
                label={community.length} 
                size="small" 
                sx={{ 
                  ml: 1,
                  background: activeSection === 'community' ? 'rgba(255,255,255,0.2)' : '#e2e8f0',
                  color: activeSection === 'community' ? 'white' : '#64748b',
                  fontWeight: 600
                }} 
              />
            </ListItemButton>

            <ListItemButton
              onClick={() => {
                setActiveSection('overview');
                setShowCollegeForm(false);
                setShowTokenForm(false);
                setTimeout(() => {
                  document.getElementById('leaderboard')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
              }}
              sx={{
                borderRadius: 2,
                mb: 1,
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <EmojiEvents />
              </ListItemIcon>
              <ListItemText primary="Leaderboard" />
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

export default CollegeAdminDashboard;
