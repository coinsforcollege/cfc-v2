import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
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
  Chip,
  CircularProgress,
  Alert,
  InputAdornment,
  Tabs,
  Tab
} from '@mui/material';
import {
  Search,
  Visibility,
  Refresh,
  Close,
  Add,
  Edit,
  Delete,
  EmojiEvents,
  Description,
  People,
  CheckCircle,
  Schedule,
  Cancel,
  Star
} from '@mui/icons-material';
import { collegeAdminApi } from '../../api/collegeAdmin.api';
import { useToast } from '../../contexts/ToastContext';
import DashboardLayout from '../../layouts/DashboardLayout';

const STATUS_TABS = [
  { value: '', label: 'All Offers' },
  { value: 'active', label: 'Active' },
  { value: 'draft', label: 'Draft' },
  { value: 'expired', label: 'Expired' },
  { value: 'cancelled', label: 'Cancelled' },
];

const Offers = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [total, setTotal] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [deleting, setDeleting] = useState(null);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      setError('');

      const params = {
        page: page + 1,
        limit: rowsPerPage,
      };

      const statusFilter = STATUS_TABS[activeTab].value;
      if (statusFilter) {
        params.status = statusFilter;
      }

      const response = await collegeAdminApi.getOffers(params);

      if (response.success) {
        let filteredOffers = response.data || [];

        // Client-side search filter
        if (search) {
          const searchLower = search.toLowerCase();
          filteredOffers = filteredOffers.filter(offer =>
            offer.title?.toLowerCase().includes(searchLower) ||
            offer.description?.toLowerCase().includes(searchLower)
          );
        }

        setOffers(filteredOffers);
        setTotal(response.pagination?.total || 0);
      }
    } catch (err) {
      setError(err.message || 'Failed to load offers');
      showToast(err.message || 'Failed to load offers', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, [page, rowsPerPage, activeTab]);

  const handleSearch = () => {
    setPage(0);
    fetchOffers();
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setPage(0);
  };

  const handleDeleteOffer = async (id, e) => {
    e.stopPropagation();

    if (!window.confirm('Are you sure you want to delete this offer?')) {
      return;
    }

    try {
      setDeleting(id);
      const response = await collegeAdminApi.deleteOffer(id);

      if (response.success) {
        showToast(response.message || 'Offer deleted successfully', 'success');
        fetchOffers();
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete offer', 'error');
    } finally {
      setDeleting(null);
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

  const handleViewOffer = (id) => {
    navigate(`/college-admin/offers/${id}`);
  };

  const handleEditOffer = (id, e) => {
    e.stopPropagation();
    navigate(`/college-admin/offers/${id}/edit`);
  };

  const sidebarStats = {
    offersCount: total,
  };

  return (
    <DashboardLayout stats={sidebarStats}>
      <Box sx={{ maxWidth: '1400px', width: '100%', mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
              Scholarship Offers
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage and track your scholarship offers to students
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate('/college-admin/offers/create')}
              sx={{
                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                fontWeight: 600,
                '&:hover': {
                  background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                }
              }}
            >
              Create Offer
            </Button>
            <Button
              variant="contained"
              startIcon={<Refresh />}
              onClick={fetchOffers}
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
        </Box>

        {/* Status Tabs */}
        <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              px: 2,
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
            {STATUS_TABS.map((tab, index) => (
              <Tab key={tab.value} label={tab.label} />
            ))}
          </Tabs>
        </Card>

        {/* Search Bar */}
        <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <CardContent sx={{ p: 3 }}>
            <TextField
              fullWidth
              placeholder="Search offers by title or description..."
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
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSearch('');
                        setPage(0);
                        fetchOffers();
                      }}
                    >
                      <Close />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </CardContent>
        </Card>

        {/* Offers Table */}
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
                        <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Offer</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#475569' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <EmojiEvents fontSize="small" sx={{ color: '#f59e0b' }} />
                            Value
                          </Box>
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#475569' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <People fontSize="small" />
                            Responses
                          </Box>
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Expiry</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Created</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, color: '#475569' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {offers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                            <Description sx={{ fontSize: 48, color: '#cbd5e1', mb: 2 }} />
                            <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 600 }}>
                              No offers found
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              Create your first scholarship offer to attract students
                            </Typography>
                            <Button
                              variant="contained"
                              startIcon={<Add />}
                              onClick={() => navigate('/college-admin/offers/create')}
                              sx={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              }}
                            >
                              Create Offer
                            </Button>
                          </TableCell>
                        </TableRow>
                      ) : (
                        offers.map((offer) => (
                          <TableRow
                            key={offer._id}
                            sx={{
                              '&:hover': { bgcolor: '#f8fafc', cursor: 'pointer' },
                              transition: 'background 0.2s'
                            }}
                            onClick={() => handleViewOffer(offer._id)}
                          >
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography variant="body2" fontWeight={600}>
                                      {offer.title}
                                    </Typography>
                                    {offer.isRecommended && (
                                      <Star sx={{ fontSize: 16, color: '#f59e0b' }} />
                                    )}
                                  </Box>
                                  <Typography variant="caption" color="text.secondary" sx={{
                                    display: '-webkit-box',
                                    WebkitLineClamp: 1,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    maxWidth: 250
                                  }}>
                                    {offer.description || 'No description'}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Chip
                                icon={<EmojiEvents sx={{ fontSize: 16, color: '#22c55e !important' }} />}
                                label={formatCurrency(offer.totalValue || 0, offer.currency)}
                                size="small"
                                sx={{
                                  bgcolor: 'rgba(34, 197, 94, 0.1)',
                                  color: '#16a34a',
                                  fontWeight: 700,
                                  '& .MuiChip-icon': {
                                    marginLeft: '8px'
                                  }
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              {getStatusChip(offer.status)}
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Chip
                                  label={`${offer.responseCounts?.accepted || 0} accepted`}
                                  size="small"
                                  sx={{
                                    bgcolor: 'rgba(34, 197, 94, 0.1)',
                                    color: '#22c55e',
                                    fontWeight: 600,
                                    fontSize: '0.7rem'
                                  }}
                                />
                                <Chip
                                  label={`${offer.responseCounts?.pending || 0} pending`}
                                  size="small"
                                  sx={{
                                    bgcolor: 'rgba(245, 158, 11, 0.1)',
                                    color: '#f59e0b',
                                    fontWeight: 600,
                                    fontSize: '0.7rem'
                                  }}
                                />
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="caption" color="text.secondary">
                                {formatDate(offer.expiryDate)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="caption" color="text.secondary">
                                {formatDate(offer.createdAt)}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewOffer(offer._id);
                                  }}
                                  sx={{ color: '#667eea' }}
                                >
                                  <Visibility fontSize="small" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={(e) => handleEditOffer(offer._id, e)}
                                  sx={{ color: '#64748b' }}
                                >
                                  <Edit fontSize="small" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={(e) => handleDeleteOffer(offer._id, e)}
                                  disabled={deleting === offer._id}
                                  sx={{ color: '#ef4444' }}
                                >
                                  {deleting === offer._id ? (
                                    <CircularProgress size={18} />
                                  ) : (
                                    <Delete fontSize="small" />
                                  )}
                                </IconButton>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>

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
              </>
            )}
          </CardContent>
        </Card>
      </Box>
    </DashboardLayout>
  );
};

export default Offers;
