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
  LinearProgress,
  TextField,
  InputAdornment,
  IconButton,
  Avatar,
  Chip
} from '@mui/material';
import {
  Search,
  Close,
  Refresh,
  EmojiEvents,
  TrendingUp
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router';
import { collegeAdminApi } from '../../api/collegeAdmin.api';
import { useToast } from '../../contexts/ToastContext';
import DashboardLayout from '../../layouts/DashboardLayout';
import { getImageUrl } from '../../utils/imageUtils';
import { useTranslation } from 'react-i18next';

const Leaderboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [leaderboardData, setLeaderboardData] = useState({
    top10: [],
    currentCollege: null,
    context: []
  });

  useEffect(() => {
    if (!user || user.role !== 'college_admin') {
      navigate('/auth/login');
      return;
    }
    fetchLeaderboard();
  }, [user, navigate]);

  const fetchLeaderboard = async (searchQuery = '') => {
    try {
      setLoading(true);
      const response = await collegeAdminApi.getLeaderboard(searchQuery);
      setLeaderboardData(response.data || {
        top10: [],
        currentCollege: null,
        context: []
      });
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      showToast(t('collegeAdminLeaderboard.errorLoadFailed'), 'error');
      setLeaderboardData({
        top10: [],
        currentCollege: null,
        context: []
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchLeaderboard(search);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    setSearch('');
    fetchLeaderboard('');
  };

  const renderCollegeRow = (college, isCurrentCollege = false) => (
    <TableRow
      key={college.id}
      sx={{
        '&:hover': { bgcolor: '#f8fafc' },
        bgcolor: isCurrentCollege ? 'rgba(102, 126, 234, 0.08)' : 'transparent',
        borderLeft: isCurrentCollege ? '4px solid #667eea' : 'none'
      }}
    >
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {college.rank <= 3 ? (
            <EmojiEvents
              sx={{
                fontSize: 28,
                color: college.rank === 1 ? '#fbbf24' : college.rank === 2 ? '#9ca3af' : '#d97706'
              }}
            />
          ) : (
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#475569', width: 28 }}>
              {college.rank}
            </Typography>
          )}
        </Box>
      </TableCell>
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            src={getImageUrl(college.logo)}
            sx={{
              width: 40,
              height: 40,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}
          >
            {college.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={600}>
              {college.name}
              {isCurrentCollege && (
                <Chip
                  label={t('collegeAdminLeaderboard.yourCollege')}
                  size="small"
                  sx={{
                    ml: 1,
                    height: 20,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.7rem'
                  }}
                />
              )}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {college.location}
            </Typography>
          </Box>
        </Box>
      </TableCell>
      <TableCell align="right">
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#475569' }}>
          {college.totalStudents}
        </Typography>
      </TableCell>
      <TableCell align="right">
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#10b981' }}>
          {college.activeMiningSessions}
        </Typography>
      </TableCell>
      <TableCell align="right">
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#667eea' }}>
          {college.totalTokensMined.toFixed(4)}
        </Typography>
      </TableCell>
      <TableCell align="right">
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#f59e0b' }}>
          {college.miningRate.toFixed(2)} /hr
        </Typography>
      </TableCell>
    </TableRow>
  );

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LinearProgress sx={{ width: '50%' }} />
      </Box>
    );
  }

  const sidebarStats = {};

  return (
    <DashboardLayout stats={sidebarStats}>
      <Box sx={{ maxWidth: '1400px', width: '100%', mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <TrendingUp sx={{ color: '#667eea', fontSize: 32 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
                {t('collegeAdminLeaderboard.pageTitle')}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {t('collegeAdminLeaderboard.pageDescription')}
            </Typography>
          </Box>
          <IconButton
            onClick={() => fetchLeaderboard(search)}
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

        {/* Search Bar */}
        <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <CardContent sx={{ p: 3 }}>
            <TextField
              fullWidth
              placeholder={t('collegeAdminLeaderboard.searchPlaceholder')}
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
                    <IconButton size="small" onClick={handleClearSearch}>
                      <Close />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </CardContent>
        </Card>

        {/* Top 10 Leaderboard */}
        <Card sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', mb: 3 }}>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ p: 3, bgcolor: '#f8fafc', borderBottom: '2px solid #e5e7eb' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                {t('collegeAdminLeaderboard.top10Colleges')}
              </Typography>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f8fafc' }}>
                    <TableCell sx={{ fontWeight: 700, color: '#475569', width: 80 }}>{t('collegeAdminLeaderboard.headerRank')}</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#475569' }}>{t('collegeAdminLeaderboard.headerCollege')}</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#475569' }} align="right">{t('collegeAdminLeaderboard.headerTotalStudents')}</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#475569' }} align="right">{t('collegeAdminLeaderboard.headerActiveSessions')}</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#475569' }} align="right">{t('collegeAdminLeaderboard.headerTotalTokensMined')}</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#475569' }} align="right">{t('collegeAdminLeaderboard.headerMiningRate')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {!leaderboardData || leaderboardData.top10.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                        <Typography variant="body2" color="text.secondary">
                          {t('collegeAdminLeaderboard.noCollegesFound')}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    leaderboardData.top10.map((college) => renderCollegeRow(college))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Current College Context (if not in top 10) */}
        {leaderboardData && leaderboardData.currentCollege && leaderboardData.context && leaderboardData.context.length > 0 && (
          <Card sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ p: 3, bgcolor: '#f8fafc', borderBottom: '2px solid #e5e7eb' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                  {t('collegeAdminLeaderboard.yourCollegeRanking')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('collegeAdminLeaderboard.yourCollegeRanked', { rank: leaderboardData.currentCollege.rank })}
                </Typography>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#f8fafc' }}>
                      <TableCell sx={{ fontWeight: 700, color: '#475569', width: 80 }}>{t('collegeAdminLeaderboard.headerRank')}</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#475569' }}>{t('collegeAdminLeaderboard.headerCollege')}</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#475569' }} align="right">{t('collegeAdminLeaderboard.headerTotalStudents')}</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#475569' }} align="right">{t('collegeAdminLeaderboard.headerActiveSessions')}</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#475569' }} align="right">{t('collegeAdminLeaderboard.headerTotalTokensMined')}</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#475569' }} align="right">{t('collegeAdminLeaderboard.headerMiningRate')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {leaderboardData.context.map((college) =>
                      renderCollegeRow(
                        college,
                        college.id === leaderboardData.currentCollege.id
                      )
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}
      </Box>
    </DashboardLayout>
  );
};

export default Leaderboard;
