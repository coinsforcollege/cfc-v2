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
  Avatar
} from '@mui/material';
import {
  Search,
  Visibility,
  Refresh,
  Close,
  CheckCircle,
  EmojiEvents,
  ArrowBack
} from '@mui/icons-material';
import { collegeAdminApi } from '../../api/collegeAdmin.api';
import { useToast } from '../../contexts/ToastContext';
import DashboardLayout from '../../layouts/DashboardLayout';

const AcceptedStudents = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [total, setTotal] = useState(0);

  const fetchAcceptedStudents = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await collegeAdminApi.getAcceptedStudents({
        search,
        page: page + 1,
        limit: rowsPerPage,
      });

      if (response.success) {
        setStudents(response.data || []);
        setTotal(response.pagination?.total || 0);
      }
    } catch (err) {
      setError(err.message || 'Failed to load accepted students');
      showToast(err.message || 'Failed to load accepted students', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAcceptedStudents();
  }, [page, rowsPerPage]);

  const handleSearch = () => {
    setPage(0);
    fetchAcceptedStudents();
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const formatDate = (date) => {
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

  const handleViewStudent = (studentId) => {
    navigate(`/college-admin/students/${studentId}`);
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

  return (
    <DashboardLayout>
      <Box sx={{ maxWidth: '1400px', width: '100%', mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => navigate('/college-admin/students')}>
              <ArrowBack />
            </IconButton>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
                Accepted Students
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Students who have accepted your scholarship offers
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={fetchAcceptedStudents}
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

        {/* Search Bar */}
        <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <CardContent sx={{ p: 3 }}>
            <TextField
              fullWidth
              placeholder="Search by student name or email..."
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
                        fetchAcceptedStudents();
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

        {/* Students Table */}
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
                        <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Student</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Offer</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#475569' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <EmojiEvents fontSize="small" sx={{ color: '#f59e0b' }} />
                            Scholarship Value
                          </Box>
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Accepted On</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Status</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, color: '#475569' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {students.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                            <CheckCircle sx={{ fontSize: 48, color: '#cbd5e1', mb: 2 }} />
                            <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 600 }}>
                              No accepted students yet
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Students who accept your offers will appear here
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        students.map((item) => (
                          <TableRow
                            key={item._id}
                            sx={{
                              '&:hover': { bgcolor: '#f8fafc', cursor: 'pointer' },
                              transition: 'background 0.2s'
                            }}
                            onClick={() => handleViewStudent(item.student?._id)}
                          >
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar
                                  sx={{
                                    width: 40,
                                    height: 40,
                                    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                                    fontWeight: 700,
                                    fontSize: '0.85rem'
                                  }}
                                >
                                  {getInitials(item.student?.name)}
                                </Avatar>
                                <Box>
                                  <Typography variant="body2" fontWeight={600}>
                                    {item.student?.name}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {item.student?.email}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" fontWeight={600}>
                                {item.offer?.title}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                icon={<EmojiEvents sx={{ fontSize: 16, color: '#22c55e !important' }} />}
                                label={formatCurrency(item.offer?.totalValue || 0, item.offer?.currency)}
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
                              <Typography variant="caption" color="text.secondary">
                                {formatDate(item.respondedAt || item.updatedAt)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label="Accepted"
                                size="small"
                                sx={{
                                  bgcolor: 'rgba(34, 197, 94, 0.1)',
                                  color: '#22c55e',
                                  fontWeight: 600
                                }}
                              />
                            </TableCell>
                            <TableCell align="right">
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewStudent(item.student?._id);
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

export default AcceptedStudents;
