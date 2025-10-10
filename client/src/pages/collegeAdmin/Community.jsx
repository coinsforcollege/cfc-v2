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
  TablePagination,
  Chip,
  Avatar,
  LinearProgress,
  TextField,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  Search,
  Close,
  Refresh,
  Email
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router';
import { collegeAdminApi } from '../../api/collegeAdmin.api';
import DashboardLayout from '../../layouts/DashboardLayout';

const Community = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [community, setCommunity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  useEffect(() => {
    if (!user || user.role !== 'college_admin') {
      navigate('/auth/login');
      return;
    }
    fetchCommunity();
  }, [user, navigate]);

  const fetchCommunity = async () => {
    try {
      setLoading(true);
      const response = await collegeAdminApi.viewCommunity();
      setCommunity(response.data.miners || []);
    } catch (error) {
      console.error('Error fetching community:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(0);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Filter miners
  const filteredMiners = community.filter(miner =>
    miner.name.toLowerCase().includes(search.toLowerCase()) ||
    miner.email?.toLowerCase().includes(search.toLowerCase())
  );

  // Paginate
  const paginatedMiners = filteredMiners.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading && community.length === 0) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LinearProgress sx={{ width: '50%' }} />
      </Box>
    );
  }

  const activeMiners = community.filter(m => m.status === 'active').length;
  const sidebarStats = {
    communityCount: community.length,
  };

  return (
    <DashboardLayout stats={sidebarStats}>
      <Box sx={{ maxWidth: '1400px', width: '100%', mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
              Community Miners
            </Typography>
            <Typography variant="body2" color="text.secondary">
              View all students mining for your college
            </Typography>
          </Box>
          <IconButton
            onClick={fetchCommunity}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a67d8 0%, #6b42a0 100%)',
              }
            }}
          >
            <Refresh />
          </IconButton>
        </Box>

        {/* Stats Cards */}
        <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
          <Card sx={{ flex: '1 1 280px', borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Total Miners</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#667eea' }}>
                    {community.length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ flex: '1 1 280px', borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Active Mining</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#10b981' }}>
                    {activeMiners}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ flex: '1 1 280px', borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Idle</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#64748b' }}>
                    {community.length - activeMiners}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Search Bar */}
        <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <CardContent sx={{ p: 3 }}>
            <TextField
              fullWidth
              placeholder="Search by name or email..."
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
                    <IconButton size="small" onClick={() => { setSearch(''); setPage(0); }}>
                      <Close />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </CardContent>
        </Card>

        {/* Miners Table */}
        <Card sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <CardContent sx={{ p: 0 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f8fafc' }}>
                    <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Miner</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#475569' }} align="right">Tokens Mined</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedMiners.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                        <Typography variant="body2" color="text.secondary">
                          No miners found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedMiners.map((miner, index) => (
                      <TableRow key={index} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              width: 40,
                              height: 40
                            }}>
                              {miner.name.charAt(0).toUpperCase()}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight={600}>{miner.name}</Typography>
                              {miner.email && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <Email sx={{ fontSize: 12, color: '#64748b' }} />
                                  <Typography variant="caption" color="text.secondary">
                                    {miner.email}
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#667eea' }}>
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
                                : '#e5e7eb',
                              color: miner.status === 'active' ? 'white' : '#6b7280',
                              fontWeight: 600
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={filteredMiners.length}
              page={page}
              onPageChange={(e, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[10, 25, 50, 100]}
            />
          </CardContent>
        </Card>
      </Box>
    </DashboardLayout>
  );
};

export default Community;
