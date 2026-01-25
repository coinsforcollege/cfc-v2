import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Avatar,
  TablePagination,
  Tabs,
  Tab
} from '@mui/material';
import {
  ArrowBack,
  EmojiEvents,
  School,
  LocationOn,
  CalendarToday,
  Description,
  Send,
  Visibility,
  Download,
  Lock,
  LockOpen
} from '@mui/icons-material';
import { collegeAdminApi } from '../../api/collegeAdmin.api';
import { useToast } from '../../contexts/ToastContext';

// Get server base URL for static files (remove /api from API URL)
const SERVER_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000/api').replace('/api', '');
import DashboardLayout from '../../layouts/DashboardLayout';

const StudentView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [student, setStudent] = useState(null);
  const [scholarshipWallet, setScholarshipWallet] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  // Points history state
  const [pointsHistory, setPointsHistory] = useState([]);
  const [pointsLoading, setPointsLoading] = useState(false);
  const [pointsPage, setPointsPage] = useState(0);
  const [pointsRowsPerPage, setPointsRowsPerPage] = useState(10);
  const [pointsTotal, setPointsTotal] = useState(0);

  // Documents state
  const [documents, setDocuments] = useState([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);

  // Fetch student details
  const fetchStudentDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await collegeAdminApi.getStudentDetails(id);

      if (response.success) {
        setStudent(response.data.student);
        setScholarshipWallet(response.data.scholarshipWallet);
      }
    } catch (err) {
      setError(err.message || 'Failed to load student details');
      showToast(err.message || 'Failed to load student details', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch points history
  const fetchPointsHistory = async () => {
    try {
      setPointsLoading(true);
      const response = await collegeAdminApi.getStudentPointsHistory(id, {
        page: pointsPage + 1,
        limit: pointsRowsPerPage
      });

      if (response.success) {
        setPointsHistory(response.data?.transactions || []);
        setPointsTotal(response.pagination?.total || 0);
      }
    } catch (err) {
      console.error('Failed to load points history:', err);
    } finally {
      setPointsLoading(false);
    }
  };

  // Fetch documents
  const fetchDocuments = async () => {
    try {
      setDocumentsLoading(true);
      const response = await collegeAdminApi.getStudentDocuments(id);

      if (response.success) {
        setDocuments(response.data?.documents || []);
      }
    } catch (err) {
      console.error('Failed to load documents:', err);
    } finally {
      setDocumentsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentDetails();
  }, [id]);

  useEffect(() => {
    if (activeTab === 1) {
      fetchPointsHistory();
    } else if (activeTab === 2) {
      fetchDocuments();
    }
  }, [activeTab, pointsPage, pointsRowsPerPage]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getFileIcon = (fileType) => {
    if (fileType?.startsWith('image/')) return 'image';
    if (fileType?.includes('pdf')) return 'pdf';
    if (fileType?.includes('word') || fileType?.includes('document')) return 'doc';
    return 'file';
  };

  const handleSendOffer = () => {
    // Navigate to offer creation with pre-selected student
    navigate(`/college-admin/offers/create?studentId=${id}`);
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

  if (error || !student) {
    return (
      <DashboardLayout>
        <Box sx={{ maxWidth: '1200px', width: '100%', mx: 'auto' }}>
          <Alert severity="error">{error || 'Student not found'}</Alert>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/college-admin/students')}
            sx={{ mt: 2 }}
          >
            Back to Students
          </Button>
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Box sx={{ maxWidth: '1200px', width: '100%', mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => navigate('/college-admin/students')}>
              <ArrowBack />
            </IconButton>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                fontWeight: 700,
                fontSize: '1.5rem'
              }}
            >
              {getInitials(student.name)}
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
                {student.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {student.email}
              </Typography>
            </Box>
          </Box>

          <Button
            variant="contained"
            startIcon={<Send />}
            onClick={handleSendOffer}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              fontWeight: 600,
              px: 3,
              '&:hover': {
                background: 'linear-gradient(135deg, #5a67d8 0%, #6b42a0 100%)',
              }
            }}
          >
            Send Scholarship Offer
          </Button>
        </Box>

        {/* Quick Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    background: 'rgba(245, 158, 11, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <EmojiEvents sx={{ color: '#f59e0b' }} />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Scholarship Points
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#f59e0b' }}>
                      {scholarshipWallet?.balance || 0} SP
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    background: 'rgba(102, 126, 234, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <School sx={{ color: '#667eea' }} />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Grade Level
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#667eea' }}>
                      {student.gradeLevel ? `Grade ${student.userProfile.gradeLevel}` : 'N/A'}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    background: 'rgba(34, 197, 94, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <LocationOn sx={{ color: '#22c55e' }} />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Country
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#22c55e' }}>
                      {student.country || 'Not specified'}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    background: 'rgba(139, 92, 246, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <CalendarToday sx={{ color: '#8b5cf6' }} />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Joined
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 700, color: '#8b5cf6' }}>
                      {formatDate(student.createdAt)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tabs */}
        <Card sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              sx={{
                px: 2,
                '& .MuiTab-root': {
                  fontWeight: 600,
                  textTransform: 'none',
                  minHeight: 56
                },
                '& .Mui-selected': {
                  color: '#667eea'
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#667eea'
                }
              }}
            >
              <Tab label="Overview" />
              <Tab label="Points History" />
              <Tab label="Documents" />
            </Tabs>
          </Box>

          <CardContent sx={{ p: 3 }}>
            {/* Overview Tab */}
            {activeTab === 0 && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Full Name
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {student.name}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Email Address
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {student.email}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Phone Number
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {student.phone || 'Not provided'}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Country
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {student.country || 'Not specified'}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Grade Level
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {student.gradeLevel ? `Grade ${student.userProfile.gradeLevel}` : 'Not specified'}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Referral Code
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {student.referralCode || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Total Referrals
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {student.totalReferrals || 0}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Last Login
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {student.lastLogin ? formatDateTime(student.lastLogin) : 'Never'}
                  </Typography>
                </Grid>
              </Grid>
            )}

            {/* Points History Tab */}
            {activeTab === 1 && (
              <>
                {pointsLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : pointsHistory.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <EmojiEvents sx={{ fontSize: 48, color: '#cbd5e1', mb: 2 }} />
                    <Typography variant="body1" color="text.secondary">
                      No points history yet
                    </Typography>
                  </Box>
                ) : (
                  <>
                    <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e5e7eb' }}>
                      <Table>
                        <TableHead>
                          <TableRow sx={{ bgcolor: '#f8fafc' }}>
                            <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Source</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700 }}>Points</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {pointsHistory.map((record) => (
                            <TableRow key={record._id}>
                              <TableCell>
                                <Typography variant="body2">
                                  {formatDateTime(record.createdAt)}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">
                                  {record.description || 'Points earned'}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={record.source || 'System'}
                                  size="small"
                                  sx={{
                                    bgcolor: 'rgba(102, 126, 234, 0.1)',
                                    color: '#667eea',
                                    fontWeight: 600
                                  }}
                                />
                              </TableCell>
                              <TableCell align="right">
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: 700,
                                    color: record.amount >= 0 ? '#22c55e' : '#ef4444'
                                  }}
                                >
                                  {record.amount >= 0 ? '+' : ''}{record.amount} SP
                                </Typography>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <TablePagination
                      component="div"
                      count={pointsTotal}
                      page={pointsPage}
                      onPageChange={(e, newPage) => setPointsPage(newPage)}
                      rowsPerPage={pointsRowsPerPage}
                      onRowsPerPageChange={(e) => {
                        setPointsRowsPerPage(parseInt(e.target.value, 10));
                        setPointsPage(0);
                      }}
                      rowsPerPageOptions={[10, 25, 50]}
                    />
                  </>
                )}
              </>
            )}

            {/* Documents Tab */}
            {activeTab === 2 && (
              <>
                {documentsLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : documents.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Description sx={{ fontSize: 48, color: '#cbd5e1', mb: 2 }} />
                    <Typography variant="body1" color="text.secondary">
                      No public documents available
                    </Typography>
                  </Box>
                ) : (
                  <Grid container spacing={2}>
                    {documents.map((doc) => (
                      <Grid item xs={12} sm={6} md={4} key={doc._id}>
                        <Card
                          sx={{
                            borderRadius: 2,
                            border: '1px solid #e5e7eb',
                            boxShadow: 'none',
                            transition: 'all 0.2s',
                            '&:hover': {
                              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                              borderColor: '#667eea'
                            }
                          }}
                        >
                          <CardContent sx={{ p: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                              <Box
                                sx={{
                                  width: 48,
                                  height: 48,
                                  borderRadius: 1.5,
                                  background: 'rgba(102, 126, 234, 0.1)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexShrink: 0
                                }}
                              >
                                <Description sx={{ color: '#667eea' }} />
                              </Box>
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography
                                  variant="body2"
                                  fontWeight={600}
                                  sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                  }}
                                >
                                  {doc.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {doc.size ? `${(doc.size / 1024).toFixed(1)} KB` : 'Unknown size'}
                                </Typography>
                                <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  {doc.isPublic ? (
                                    <Chip
                                      icon={<LockOpen sx={{ fontSize: 14 }} />}
                                      label="Public"
                                      size="small"
                                      sx={{
                                        height: 22,
                                        bgcolor: 'rgba(34, 197, 94, 0.1)',
                                        color: '#22c55e',
                                        fontSize: '0.7rem',
                                        fontWeight: 600,
                                        '& .MuiChip-icon': { color: '#22c55e' }
                                      }}
                                    />
                                  ) : (
                                    <Chip
                                      icon={<Lock sx={{ fontSize: 14 }} />}
                                      label="Private"
                                      size="small"
                                      sx={{
                                        height: 22,
                                        bgcolor: 'rgba(239, 68, 68, 0.1)',
                                        color: '#ef4444',
                                        fontSize: '0.7rem',
                                        fontWeight: 600,
                                        '& .MuiChip-icon': { color: '#ef4444' }
                                      }}
                                    />
                                  )}
                                </Box>
                              </Box>
                              <Box>
                                <IconButton
                                  size="small"
                                  href={`${SERVER_BASE_URL}${doc.url}`}
                                  target="_blank"
                                  sx={{ color: '#667eea' }}
                                >
                                  <Visibility fontSize="small" />
                                </IconButton>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </Box>
    </DashboardLayout>
  );
};

export default StudentView;
