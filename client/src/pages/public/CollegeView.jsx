import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  Box,
  Typography,
  Button,
  Chip,
  Avatar,
  LinearProgress,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress
} from '@mui/material';
import {
  School,
  LocationOn,
  Language,
  Email,
  Phone,
  CalendarToday,
  EmojiEvents,
  Edit,
  PlayArrow,
  CheckCircle,
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  ArrowForward,
  Stop,
  AccessTime
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useMiningWebSocket } from '../../hooks/useMiningWebSocket';
import { useToast } from '../../contexts/ToastContext';
import apiClient from '../../api/apiClient';
import { studentApi } from '../../api/student.api';
import { miningApi } from '../../api/mining.api';

const CollegeView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { miningStatus: wsMiningStatus } = useMiningWebSocket();
  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inMiningList, setInMiningList] = useState(false);
  const [isActivelyMining, setIsActivelyMining] = useState(false);
  const [miningStatus, setMiningStatus] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchCollege();
    if (user && user.role === 'student') {
      checkMiningStatus();
    }
  }, [id, user]);

  // Update mining status from WebSocket
  useEffect(() => {
    if (wsMiningStatus) {
      const miningColleges = wsMiningStatus.miningColleges || [];
      const inList = miningColleges.some(mc => mc.college && (mc.college._id === id || mc.college === id));
      setInMiningList(inList);
      
      // Check if actively mining
      const activeSessions = wsMiningStatus.activeSessions || [];
      const activeSession = activeSessions.find(s => s.college && (s.college._id === id || s.college === id));
      setIsActivelyMining(!!activeSession && activeSession.isActive);
      setMiningStatus(activeSession || null);
    }
  }, [wsMiningStatus, id]);

  const fetchCollege = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/colleges/${id}`);
      setCollege(response);
    } catch (error) {
      console.error('Error fetching college:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkMiningStatus = async () => {
    try {
      const response = await studentApi.getDashboard();
      if (response.success) {
        const miningColleges = response.data.miningColleges || [];
        const inList = miningColleges.some(mc => mc.college && (mc.college._id === id || mc.college === id));
        setInMiningList(inList);
        
        // Check if actively mining
        const activeSessions = response.data.activeSessions || [];
        const activeSession = activeSessions.find(s => s.college && (s.college._id === id || s.college === id));
        setIsActivelyMining(!!activeSession && activeSession.isActive);
        setMiningStatus(activeSession || null);
      }
    } catch (error) {
      console.error('Error checking mining status:', error);
    }
  };

  const handleAddToMiningList = async () => {
    try {
      setActionLoading(true);
      await studentApi.addCollege({ collegeId: id });
      showToast('College added to mining list!', 'success');
      await checkMiningStatus();
    } catch (error) {
      console.error('Error adding to mining list:', error);
      showToast(error.message || 'Failed to add college to mining list', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleStartMining = async () => {
    try {
      setActionLoading(true);
      // First add to mining list if not already
      if (!inMiningList) {
        await studentApi.addCollege({ collegeId: id });
      }
      // Then start mining
      await miningApi.startMining(id);
      showToast('Mining started successfully!', 'success');
      await checkMiningStatus();
    } catch (error) {
      console.error('Error starting mining:', error);
      showToast(error.message || 'Failed to start mining', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleStopMining = async () => {
    try {
      setActionLoading(true);
      await miningApi.stopMining(id);
      showToast('Mining stopped successfully!', 'success');
      await checkMiningStatus();
    } catch (error) {
      console.error('Error stopping mining:', error);
      showToast(error.message || 'Failed to stop mining', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', pt: { xs: 12, md: 14 } }}>
        <LinearProgress sx={{ width: '50%' }} />
      </Box>
    );
  }

  if (!college) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', pt: { xs: 12, md: 14 } }}>
        <School sx={{ fontSize: 80, color: '#e2e8f0', mb: 2 }} />
        <Typography variant="h5" color="text.secondary">College not found</Typography>
      </Box>
    );
  }

  const isCollegeAdmin = user && user.role === 'college_admin' && user.managedCollege === id;
  const isPlatformAdmin = user && user.role === 'platform_admin';
  const isStudent = user && user.role === 'student';

  return (
    <Box sx={{ minHeight: '100vh', background: 'white', pt: { xs: 12, md: 14 }, pb: 8 }}>
      <Box sx={{ maxWidth: '1200px', mx: 'auto', px: { xs: 3, md: 4 } }}>
        
        {/* Hero Banner */}
        <Box sx={{ 
          height: { xs: 250, md: 350 },
          background: college.coverImage 
            ? `linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 100%), url(${college.coverImage})`
            : `linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 100%), url(/images/college-banner-placeholder.jpeg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: 3,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          p: { xs: 3, md: 4 },
          mb: 4,
          position: 'relative'
        }}>
          {/* Logo on top left */}
          <Avatar
            src={college.logo || '/images/college-logo-placeholder.png'}
            sx={{ 
              width: 100,
              height: 100,
              border: '4px solid white',
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              position: 'absolute',
              top: 24,
              left: { xs: 24, md: 32 }
            }}
          >
            <School sx={{ fontSize: 50 }} />
          </Avatar>
          
          <Typography variant="h2" sx={{ fontWeight: 800, color: 'white', textShadow: '0 2px 12px rgba(0,0,0,0.6)', mb: 1 }}>
            {college.name}
          </Typography>
          {college.tagline && (
            <Typography variant="h5" sx={{ color: 'white', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
              {college.tagline}
            </Typography>
          )}
        </Box>

        {/* Top Info Bar */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 3, mb: 5 }}>
          <Box sx={{ flex: 1, minWidth: '300px' }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
              <Chip 
                label={college.isActive ? 'Active' : 'Waitlist'}
                sx={{ 
                  background: college.isActive ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  color: 'white',
                  fontWeight: 600
                }}
              />
              {college.type && <Chip label={college.type} sx={{ fontWeight: 600 }} />}
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
              {(college.city || college.country) && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <LocationOn sx={{ fontSize: 18, color: '#64748b' }} />
                  <Typography variant="body1" color="text.secondary">
                    {college.city ? `${college.city}, ` : ''}{college.country}
                  </Typography>
                </Box>
              )}
              {college.establishedYear && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CalendarToday sx={{ fontSize: 18, color: '#64748b' }} />
                  <Typography variant="body1" color="text.secondary">Est. {college.establishedYear}</Typography>
                </Box>
              )}
            </Box>

            {/* Stats inline */}
            <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              <div>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#667eea' }}>
                  {college.stats?.totalMiners || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">Total Miners</Typography>
              </div>
              <div>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#10b981' }}>
                  {college.stats?.activeMiners || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">Active Now</Typography>
              </div>
              <div>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#f59e0b' }}>
                  {college.stats?.totalTokensMined ? college.stats.totalTokensMined.toFixed(2) : '0.00'}
                </Typography>
                <Typography variant="body2" color="text.secondary">Tokens Mined</Typography>
              </div>
              <div>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EmojiEvents sx={{ color: '#f59e0b', fontSize: 28 }} />
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#f59e0b' }}>
                    #{college.rank || 'N/A'}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">Global Rank</Typography>
              </div>
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: '220px' }}>
            {!user && (
              <>
                <Button
                  variant="contained"
                  onClick={() => navigate('/auth/register/student')}
                  sx={{ 
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                    borderRadius: 3,
                    py: 2,
                    px: 3,
                    fontWeight: 600,
                    textTransform: 'none',
                    flexDirection: 'column',
                    gap: 0,
                    alignItems: 'flex-start',
                    boxShadow: '0 4px 20px rgba(139, 92, 246, 0.3)'
                  }}
                >
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, opacity: 0.95, lineHeight: 1, mb: 0.5 }}>STUDENTS</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    Start Mining
                    <ArrowForward sx={{ fontSize: '1rem' }} />
                  </Box>
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/auth/register/college')}
                  sx={{ 
                    borderRadius: 3,
                    py: 2,
                    px: 3,
                    fontWeight: 600,
                    textTransform: 'none',
                    borderColor: '#667eea',
                    color: '#667eea',
                    flexDirection: 'column',
                    gap: 0,
                    alignItems: 'flex-start',
                    '&:hover': { borderColor: '#764ba2', background: 'rgba(102, 126, 234, 0.05)' }
                  }}
                >
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, opacity: 0.8, lineHeight: 1, mb: 0.5 }}>COLLEGES</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    Join Waitlist
                    <ArrowForward sx={{ fontSize: '1rem' }} />
                  </Box>
                </Button>
              </>
            )}

            {/* Student: Not in mining list */}
            {isStudent && !inMiningList && (
              <Button
                variant="contained"
                onClick={handleAddToMiningList}
                disabled={actionLoading}
                sx={{ 
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                  borderRadius: 3,
                  py: 2,
                  px: 3,
                  fontWeight: 600,
                  textTransform: 'none',
                  flexDirection: 'column',
                  gap: 0,
                  alignItems: 'flex-start',
                  boxShadow: '0 4px 20px rgba(139, 92, 246, 0.3)'
                }}
              >
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, opacity: 0.95, lineHeight: 1, mb: 0.5 }}>STUDENTS</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {actionLoading ? <CircularProgress size={16} sx={{ color: 'white' }} /> : 'Become Early Miner'}
                  {!actionLoading && <ArrowForward sx={{ fontSize: '1rem' }} />}
                </Box>
              </Button>
            )}

            {/* Student: In mining list but not actively mining */}
            {isStudent && inMiningList && !isActivelyMining && (
              <Button
                variant="contained"
                onClick={handleStartMining}
                disabled={actionLoading}
                sx={{ 
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  borderRadius: 3,
                  py: 2,
                  px: 3,
                  fontWeight: 600,
                  textTransform: 'none',
                  flexDirection: 'column',
                  gap: 0,
                  alignItems: 'flex-start',
                  boxShadow: '0 4px 20px rgba(79, 172, 254, 0.3)'
                }}
              >
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, opacity: 0.95, lineHeight: 1, mb: 0.5 }}>MINING ACTION</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {actionLoading ? <CircularProgress size={16} sx={{ color: 'white' }} /> : 'Start Mining'}
                  {!actionLoading && <PlayArrow sx={{ fontSize: '1rem' }} />}
                </Box>
              </Button>
            )}

            {/* Student: Actively mining */}
            {isStudent && isActivelyMining && miningStatus && (
              <>
                <Box sx={{ 
                  background: 'linear-gradient(135deg, rgba(79, 172, 254, 0.1) 0%, rgba(0, 242, 254, 0.1) 100%)', 
                  borderRadius: 3, 
                  p: 2.5,
                  border: '2px solid rgba(79, 172, 254, 0.3)'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        background: '#4facfe',
                        animation: 'blink 1.5s infinite',
                        '@keyframes blink': {
                          '0%, 100%': { opacity: 1 },
                          '50%': { opacity: 0.3 }
                        }
                      }} />
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#4facfe' }}>Mining Active</Typography>
                    </Box>
                    <Chip 
                      icon={<AccessTime sx={{ fontSize: 14 }} />}
                      label={`${miningStatus.remainingHours?.toFixed(1)}h left`}
                      size="small"
                      sx={{ 
                        background: 'rgba(79, 172, 254, 0.2)',
                        color: '#4facfe',
                        fontWeight: 600,
                        fontSize: '0.7rem'
                      }}
                    />
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#4facfe', mb: 0.5 }}>
                    {miningStatus.currentTokens?.toFixed(4) || '0.0000'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">Tokens this session</Typography>
                </Box>
                <Button
                  variant="contained"
                  onClick={handleStopMining}
                  disabled={actionLoading}
                  startIcon={actionLoading ? <CircularProgress size={16} sx={{ color: 'white' }} /> : <Stop />}
                  sx={{ 
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    borderRadius: 3,
                    py: 1.5,
                    fontWeight: 600,
                    textTransform: 'none',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)',
                    }
                  }}
                >
                  {actionLoading ? 'Stopping...' : 'Stop Mining'}
                </Button>
              </>
            )}

            {isCollegeAdmin && (
              <Button
                variant="contained"
                onClick={() => navigate('/college-admin/dashboard')}
                sx={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: 3,
                  py: 2,
                  px: 3,
                  fontWeight: 600,
                  textTransform: 'none',
                  flexDirection: 'column',
                  gap: 0,
                  alignItems: 'flex-start',
                  boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)'
                }}
              >
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, opacity: 0.95, lineHeight: 1, mb: 0.5 }}>ADMIN ACTION</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  Edit College
                  <Edit sx={{ fontSize: '1rem' }} />
                </Box>
              </Button>
            )}

            {isPlatformAdmin && (
              <Button
                variant="contained"
                onClick={() => navigate('/platform-admin/dashboard')}
                sx={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: 3,
                  py: 2,
                  px: 3,
                  fontWeight: 600,
                  textTransform: 'none',
                  flexDirection: 'column',
                  gap: 0,
                  alignItems: 'flex-start',
                  boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)'
                }}
              >
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, opacity: 0.95, lineHeight: 1, mb: 0.5 }}>PLATFORM ADMIN</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  Manage College
                  <Edit sx={{ fontSize: '1rem' }} />
                </Box>
              </Button>
            )}
          </Box>
        </Box>

        <Divider sx={{ mb: 5 }} />

        {/* Main Content - 2 Column Layout */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 6 }}>
          
          {/* Left Column - Main Content */}
          <Box>
            {/* About */}
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
              About {college.shortName || college.name}
            </Typography>
            {college.about ? (
              <Typography variant="body1" sx={{ lineHeight: 1.8, color: '#475569', whiteSpace: 'pre-wrap', mb: 5 }}>
                {college.about}
              </Typography>
            ) : (
              <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic', mb: 5 }}>
                No information available yet.
              </Typography>
            )}

            {/* Mission & Vision */}
            {(college.mission || college.vision) && (
              <>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 4, mb: 5 }}>
                  {college.mission && (
                    <div>
                      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#667eea' }}>Our Mission</Typography>
                      <Typography variant="body1" sx={{ lineHeight: 1.7, color: '#64748b' }}>{college.mission}</Typography>
                    </div>
                  )}
                  {college.vision && (
                    <div>
                      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#667eea' }}>Our Vision</Typography>
                      <Typography variant="body1" sx={{ lineHeight: 1.7, color: '#64748b' }}>{college.vision}</Typography>
                    </div>
                  )}
                </Box>
                <Divider sx={{ mb: 5 }} />
              </>
            )}

            {/* Departments */}
            {college.departments && college.departments.length > 0 && (
              <>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Academic Departments</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 5 }}>
                  {college.departments.map((dept, index) => (
                    <Chip
                      key={index}
                      label={dept}
                      sx={{ 
                        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                        color: '#667eea',
                        fontWeight: 600,
                        fontSize: '14px',
                        py: 2.5
                      }}
                    />
                  ))}
                </Box>
                <Divider sx={{ mb: 5 }} />
              </>
            )}

            {/* Student Life */}
            {college.studentLife && (college.studentLife.totalStudents || college.studentLife.internationalStudents || college.studentLife.clubs) && (
              <>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Student Life</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }, gap: 3, mb: 5 }}>
                  {college.studentLife.totalStudents && (
                    <div>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#667eea' }}>
                        {college.studentLife.totalStudents.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">Total Students</Typography>
                    </div>
                  )}
                  {college.studentLife.internationalStudents && (
                    <div>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#10b981' }}>
                        {college.studentLife.internationalStudents.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">International</Typography>
                    </div>
                  )}
                  {college.studentLife.studentToFacultyRatio && (
                    <div>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#f59e0b' }}>
                        {college.studentLife.studentToFacultyRatio}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">Student:Faculty</Typography>
                    </div>
                  )}
                  {college.studentLife.clubs && (
                    <div>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#ef4444' }}>
                        {college.studentLife.clubs}+
                      </Typography>
                      <Typography variant="body2" color="text.secondary">Clubs</Typography>
                    </div>
                  )}
                </Box>
              </>
            )}
          </Box>

          {/* Right Column - Sidebar */}
          <Box>
            {/* Contact */}
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Contact</Typography>
            {(college.website || college.email || college.phone || (college.socialMedia && Object.values(college.socialMedia).some(v => v))) ? (
              <>
                <List dense sx={{ mb: 3 }}>
                  {college.website && (
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Language sx={{ color: '#667eea' }} />
                      </ListItemIcon>
                      <ListItemText primary={<a href={college.website} target="_blank" rel="noopener noreferrer" style={{ color: '#667eea', textDecoration: 'none' }}>Website</a>} />
                    </ListItem>
                  )}
                  {college.email && (
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Email sx={{ color: '#667eea' }} />
                      </ListItemIcon>
                      <ListItemText primary={college.email} primaryTypographyProps={{ variant: 'body2' }} />
                    </ListItem>
                  )}
                  {college.phone && (
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Phone sx={{ color: '#667eea' }} />
                      </ListItemIcon>
                      <ListItemText primary={college.phone} primaryTypographyProps={{ variant: 'body2' }} />
                    </ListItem>
                  )}
                </List>

                {college.socialMedia && Object.values(college.socialMedia).some(v => v) && (
                  <>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>Follow Us</Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 4 }}>
                      {college.socialMedia.facebook && (
                        <a href={college.socialMedia.facebook} target="_blank" rel="noopener noreferrer">
                          <Avatar sx={{ width: 36, height: 36, background: '#1877f2' }}>
                            <Facebook sx={{ fontSize: 20 }} />
                          </Avatar>
                        </a>
                      )}
                      {college.socialMedia.twitter && (
                        <a href={college.socialMedia.twitter} target="_blank" rel="noopener noreferrer">
                          <Avatar sx={{ width: 36, height: 36, background: '#1da1f2' }}>
                            <Twitter sx={{ fontSize: 20 }} />
                          </Avatar>
                        </a>
                      )}
                      {college.socialMedia.instagram && (
                        <a href={college.socialMedia.instagram} target="_blank" rel="noopener noreferrer">
                          <Avatar sx={{ width: 36, height: 36, background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)' }}>
                            <Instagram sx={{ fontSize: 20 }} />
                          </Avatar>
                        </a>
                      )}
                      {college.socialMedia.linkedin && (
                        <a href={college.socialMedia.linkedin} target="_blank" rel="noopener noreferrer">
                          <Avatar sx={{ width: 36, height: 36, background: '#0a66c2' }}>
                            <LinkedIn sx={{ fontSize: 20 }} />
                          </Avatar>
                        </a>
                      )}
                    </Box>
                  </>
                )}
              </>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mb: 4 }}>
                No contact information available yet.
              </Typography>
            )}

            <Divider sx={{ mb: 3 }} />

            {/* Campus */}
            {college.campusSize && college.campusSize.value && (
              <>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>Campus Size</Typography>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#667eea', mb: 0.5 }}>
                  {college.campusSize.value} {college.campusSize.unit}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 3 }}>Total Area</Typography>
              </>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CollegeView;
