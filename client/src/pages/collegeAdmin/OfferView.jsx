import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
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
  Chip,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Divider,
  Grid,
  Avatar,
  Collapse
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  Visibility,
  EmojiEvents,
  Description,
  People,
  CheckCircle,
  Schedule,
  Cancel,
  Star,
  ExpandMore,
  ExpandLess,
  Public,
  School,
  AttachFile
} from '@mui/icons-material';
import { collegeAdminApi } from '../../api/collegeAdmin.api';
import { useToast } from '../../contexts/ToastContext';
import DashboardLayout from '../../layouts/DashboardLayout';

const RESPONSE_TABS = [
  { value: '', label: 'All Responses' },
  { value: 'pending', label: 'Pending' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'rejected', label: 'Rejected' },
];

const OfferView = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();

  const [offer, setOffer] = useState(null);
  const [responseCounts, setResponseCounts] = useState({ pending: 0, accepted: 0, rejected: 0 });
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [responsesLoading, setResponsesLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [total, setTotal] = useState(0);
  const [showLetter, setShowLetter] = useState(false);

  useEffect(() => {
    fetchOfferDetails();
  }, [id]);

  useEffect(() => {
    fetchResponses();
  }, [id, activeTab, page, rowsPerPage]);

  const fetchOfferDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await collegeAdminApi.getOfferDetails(id);

      if (response.success) {
        setOffer(response.data.offer);
        setResponseCounts(response.data.responseCounts || { pending: 0, accepted: 0, rejected: 0 });
      }
    } catch (err) {
      setError(err.message || 'Failed to load offer details');
      showToast(err.message || 'Failed to load offer details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchResponses = async () => {
    try {
      setResponsesLoading(true);
      const params = {
        page: page + 1,
        limit: rowsPerPage,
      };

      const statusFilter = RESPONSE_TABS[activeTab].value;
      if (statusFilter) {
        params.status = statusFilter;
      }

      const response = await collegeAdminApi.getOfferResponses(id, params);

      if (response.success) {
        setResponses(response.data || []);
        setTotal(response.pagination?.total || 0);
      }
    } catch (err) {
      console.error('Failed to load responses:', err);
    } finally {
      setResponsesLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (value, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      active: { color: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)', icon: <CheckCircle sx={{ fontSize: 14 }} /> },
      draft: { color: '#64748b', bg: 'rgba(100, 116, 139, 0.1)', icon: <Edit sx={{ fontSize: 14 }} /> },
      expired: { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', icon: <Schedule sx={{ fontSize: 14 }} /> },
      cancelled: { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', icon: <Cancel sx={{ fontSize: 14 }} /> },
    };

    const config = statusConfig[status] || statusConfig.draft;

    return (
      <Chip
        icon={config.icon}
        label={status.charAt(0).toUpperCase() + status.slice(1)}
        size="small"
        sx={{
          bgcolor: config.bg,
          color: config.color,
          fontWeight: 600,
          '& .MuiChip-icon': {
            color: config.color,
            marginLeft: '8px'
          }
        }}
      />
    );
  };

  const getResponseStatusChip = (status) => {
    const statusConfig = {
      pending: { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
      accepted: { color: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)' },
      rejected: { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <Chip
        label={status.charAt(0).toUpperCase() + status.slice(1)}
        size="small"
        sx={{
          bgcolor: config.bg,
          color: config.color,
          fontWeight: 600,
        }}
      />
    );
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

  const getTargetingDescription = (targeting) => {
    if (!targeting || targeting.type === 'all') return 'All Students';

    const parts = [];

    if (targeting.countries?.length > 0) {
      parts.push(`Countries: ${targeting.countries.join(', ')}`);
    }
    if (targeting.gradeLevels?.length > 0) {
      parts.push(`Grades: ${targeting.gradeLevels.join(', ')}`);
    }
    if (targeting.pointsRange?.min !== null || targeting.pointsRange?.max !== null) {
      const min = targeting.pointsRange?.min ?? 0;
      const max = targeting.pointsRange?.max ?? 'No limit';
      parts.push(`Points: ${min} - ${max}`);
    }

    return parts.length > 0 ? parts.join(' | ') : 'All Students';
  };

  const handleViewStudent = (studentId) => {
    navigate(`/college-admin/students/${studentId}`);
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

  if (error && !offer) {
    return (
      <DashboardLayout>
        <Box sx={{ maxWidth: '1200px', width: '100%', mx: 'auto' }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/college-admin/offers')}
          >
            Back to Offers
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
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <IconButton onClick={() => navigate('/college-admin/offers')}>
              <ArrowBack />
            </IconButton>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
                  {offer?.title}
                </Typography>
                {offer?.isRecommended && (
                  <Star sx={{ color: '#f59e0b', fontSize: 28 }} />
                )}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {getStatusChip(offer?.status)}
                <Typography variant="body2" color="text.secondary">
                  Created {formatDate(offer?.createdAt)}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={() => navigate(`/college-admin/offers/${id}/edit`)}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              fontWeight: 600,
              '&:hover': {
                background: 'linear-gradient(135deg, #5a67d8 0%, #6b42a0 100%)',
              }
            }}
          >
            Edit Offer
          </Button>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(22, 163, 74, 0.1) 100%)'
                  }}>
                    <EmojiEvents sx={{ color: '#22c55e' }} />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Scholarship Value
                    </Typography>
                    <Typography variant="h5" fontWeight={700} sx={{ color: '#22c55e' }}>
                      {formatCurrency(offer?.totalValue || 0, offer?.currency)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)'
                  }}>
                    <People sx={{ color: '#667eea' }} />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Total Responses
                    </Typography>
                    <Typography variant="h5" fontWeight={700}>
                      {responseCounts.pending + responseCounts.accepted + responseCounts.rejected}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(34, 197, 94, 0.1)'
                  }}>
                    <CheckCircle sx={{ color: '#22c55e' }} />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Accepted
                    </Typography>
                    <Typography variant="h5" fontWeight={700} sx={{ color: '#22c55e' }}>
                      {responseCounts.accepted}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(245, 158, 11, 0.1)'
                  }}>
                    <Schedule sx={{ color: '#f59e0b' }} />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Pending
                    </Typography>
                    <Typography variant="h5" fontWeight={700} sx={{ color: '#f59e0b' }}>
                      {responseCounts.pending}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Offer Details Card */}
        <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Offer Details
            </Typography>

            <Grid container spacing={3}>
              {offer?.description && (
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Description
                  </Typography>
                  <Typography variant="body1">
                    {offer.description}
                  </Typography>
                </Grid>
              )}

              {offer?.terms && (
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Terms and Conditions
                  </Typography>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {offer.terms}
                  </Typography>
                </Grid>
              )}

              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Expiry Date
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {offer?.expiryDate ? formatDate(offer.expiryDate) : 'No expiry date'}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Target Audience
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {getTargetingDescription(offer?.targeting)}
                </Typography>
              </Grid>

              {offer?.requiredDocuments?.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Required Documents
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {offer.requiredDocuments.map((doc, index) => (
                      <Chip
                        key={index}
                        icon={<AttachFile sx={{ fontSize: 16 }} />}
                        label={doc.name}
                        size="small"
                        sx={{
                          bgcolor: doc.required ? 'rgba(239, 68, 68, 0.1)' : 'rgba(100, 116, 139, 0.1)',
                          color: doc.required ? '#ef4444' : '#64748b',
                          fontWeight: 600,
                        }}
                      />
                    ))}
                  </Box>
                </Grid>
              )}
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Formal Letter */}
            <Box>
              <Button
                onClick={() => setShowLetter(!showLetter)}
                endIcon={showLetter ? <ExpandLess /> : <ExpandMore />}
                sx={{ color: '#667eea', fontWeight: 600, mb: 2 }}
              >
                {showLetter ? 'Hide' : 'Show'} Formal Letter
              </Button>
              <Collapse in={showLetter}>
                <Box sx={{
                  p: 3,
                  borderRadius: 2,
                  bgcolor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'serif'
                }}>
                  {offer?.formalLetter || 'No formal letter provided'}
                </Box>
              </Collapse>
            </Box>
          </CardContent>
        </Card>

        {/* Responses Section */}
        <Card sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ p: 3, pb: 0 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Student Responses
              </Typography>
            </Box>

            {/* Response Status Tabs */}
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => {
                setActiveTab(newValue);
                setPage(0);
              }}
              sx={{
                px: 3,
                borderBottom: '1px solid #e2e8f0',
                '& .MuiTab-root': {
                  fontWeight: 600,
                  textTransform: 'none',
                  minWidth: 100,
                },
                '& .Mui-selected': {
                  color: '#667eea',
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#667eea',
                },
              }}
            >
              {RESPONSE_TABS.map((tab, index) => (
                <Tab key={tab.value} label={tab.label} />
              ))}
            </Tabs>

            {responsesLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: '#f8fafc' }}>
                        <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Student</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Documents</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Response Date</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, color: '#475569' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {responses.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                            <People sx={{ fontSize: 48, color: '#cbd5e1', mb: 2 }} />
                            <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 600 }}>
                              No responses yet
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Students who respond to this offer will appear here
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        responses.map((response) => (
                          <TableRow
                            key={response._id}
                            sx={{
                              '&:hover': { bgcolor: '#f8fafc', cursor: 'pointer' },
                              transition: 'background 0.2s'
                            }}
                            onClick={() => handleViewStudent(response.student?._id)}
                          >
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar
                                  sx={{
                                    width: 40,
                                    height: 40,
                                    background: response.status === 'accepted'
                                      ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
                                      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    fontWeight: 700,
                                    fontSize: '0.85rem'
                                  }}
                                >
                                  {getInitials(response.student?.name)}
                                </Avatar>
                                <Box>
                                  <Typography variant="body2" fontWeight={600}>
                                    {response.student?.name}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {response.student?.email}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              {getResponseStatusChip(response.status)}
                            </TableCell>
                            <TableCell>
                              {response.submittedDocuments?.length > 0 ? (
                                <Chip
                                  icon={<AttachFile sx={{ fontSize: 14 }} />}
                                  label={`${response.submittedDocuments.length} document(s)`}
                                  size="small"
                                  sx={{
                                    bgcolor: 'rgba(102, 126, 234, 0.1)',
                                    color: '#667eea',
                                    fontWeight: 600
                                  }}
                                />
                              ) : (
                                <Typography variant="caption" color="text.secondary">
                                  No documents
                                </Typography>
                              )}
                            </TableCell>
                            <TableCell>
                              <Typography variant="caption" color="text.secondary">
                                {formatDate(response.respondedAt || response.updatedAt)}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewStudent(response.student?._id);
                                }}
                                sx={{ color: '#667eea' }}
                              >
                                <Visibility fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>

                {responses.length > 0 && (
                  <TablePagination
                    component="div"
                    count={total}
                    page={page}
                    onPageChange={(e, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(e) => {
                      setRowsPerPage(parseInt(e.target.value, 10));
                      setPage(0);
                    }}
                    rowsPerPageOptions={[10, 25, 50, 100]}
                  />
                )}
              </>
            )}
          </CardContent>
        </Card>
      </Box>
    </DashboardLayout>
  );
};

export default OfferView;
