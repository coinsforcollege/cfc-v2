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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Collapse,
  Avatar
} from '@mui/material';
import {
  Search,
  Visibility,
  Refresh,
  Close,
  FilterList,
  ExpandMore,
  ExpandLess,
  School,
  EmojiEvents
} from '@mui/icons-material';
import { collegeAdminApi } from '../../api/collegeAdmin.api';
import { useToast } from '../../contexts/ToastContext';
import DashboardLayout from '../../layouts/DashboardLayout';

// List of countries
const COUNTRIES = [
  'All Countries',
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'Netherlands',
  'Singapore',
  'Japan',
  'India',
  'China',
  'South Korea',
  'Brazil',
  'Mexico',
  'Other'
];

// Grade levels
const GRADE_LEVELS = [
  { value: '', label: 'All Grades' },
  { value: 'K', label: 'Kindergarten' },
  { value: '1', label: 'Grade 1' },
  { value: '2', label: 'Grade 2' },
  { value: '3', label: 'Grade 3' },
  { value: '4', label: 'Grade 4' },
  { value: '5', label: 'Grade 5' },
  { value: '6', label: 'Grade 6' },
  { value: '7', label: 'Grade 7' },
  { value: '8', label: 'Grade 8' },
  { value: '9', label: 'Grade 9' },
  { value: '10', label: 'Grade 10' },
  { value: '11', label: 'Grade 11' },
  { value: '12', label: 'Grade 12' },
];

const Students = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();

  // State for students list
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [total, setTotal] = useState(0);

  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [country, setCountry] = useState('All Countries');
  const [gradeLevel, setGradeLevel] = useState('');
  const [minPoints, setMinPoints] = useState('');
  const [maxPoints, setMaxPoints] = useState('');

  // Fetch students
  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError('');

      const params = {
        search,
        page: page + 1,
        limit: rowsPerPage,
      };

      // Add filters if set
      if (country && country !== 'All Countries') {
        params.country = country;
      }
      if (gradeLevel) {
        params.gradeLevel = gradeLevel;
      }
      if (minPoints !== '') {
        params.minPoints = parseInt(minPoints, 10);
      }
      if (maxPoints !== '') {
        params.maxPoints = parseInt(maxPoints, 10);
      }

      const response = await collegeAdminApi.getStudents(params);

      if (response.success) {
        setStudents(response.data || []);
        setTotal(response.pagination?.total || 0);
      }
    } catch (err) {
      setError(err.message || 'Failed to load students');
      showToast(err.message || 'Failed to load students', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [page, rowsPerPage]);

  const handleSearch = () => {
    setPage(0);
    fetchStudents();
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleApplyFilters = () => {
    setPage(0);
    fetchStudents();
  };

  const handleClearFilters = () => {
    setCountry('All Countries');
    setGradeLevel('');
    setMinPoints('');
    setMaxPoints('');
    setSearch('');
    setPage(0);
    setTimeout(fetchStudents, 0);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleViewStudent = (id) => {
    navigate(`/college-admin/students/${id}`);
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

  const sidebarStats = {
    studentsCount: total,
  };

  return (
    <DashboardLayout stats={sidebarStats}>
      <Box sx={{ maxWidth: '1400px', width: '100%', mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
              Browse Students
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Find and view student profiles to send scholarship offers
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={showFilters ? <ExpandLess /> : <FilterList />}
              onClick={() => setShowFilters(!showFilters)}
              sx={{
                borderColor: '#667eea',
                color: '#667eea',
                fontWeight: 600,
                '&:hover': {
                  borderColor: '#5a67d8',
                  background: 'rgba(102, 126, 234, 0.08)',
                }
              }}
            >
              Filters
            </Button>
            <Button
              variant="contained"
              startIcon={<Refresh />}
              onClick={fetchStudents}
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

        {/* Filters Panel */}
        <Collapse in={showFilters}>
          <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <FilterList fontSize="small" />
                Filter Students
              </Typography>
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <FormControl sx={{ minWidth: 180 }} size="small">
                  <InputLabel>Country</InputLabel>
                  <Select
                    value={country}
                    label="Country"
                    onChange={(e) => setCountry(e.target.value)}
                  >
                    {COUNTRIES.map((c) => (
                      <MenuItem key={c} value={c}>{c}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl sx={{ minWidth: 150 }} size="small">
                  <InputLabel>Grade Level</InputLabel>
                  <Select
                    value={gradeLevel}
                    label="Grade Level"
                    onChange={(e) => setGradeLevel(e.target.value)}
                  >
                    {GRADE_LEVELS.map((g) => (
                      <MenuItem key={g.value} value={g.value}>{g.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  label="Min Points"
                  type="number"
                  size="small"
                  value={minPoints}
                  onChange={(e) => setMinPoints(e.target.value)}
                  placeholder="0"
                  sx={{ width: 120 }}
                  inputProps={{ min: 0 }}
                />

                <TextField
                  label="Max Points"
                  type="number"
                  size="small"
                  value={maxPoints}
                  onChange={(e) => setMaxPoints(e.target.value)}
                  placeholder="No limit"
                  sx={{ width: 120 }}
                  inputProps={{ min: 0 }}
                />

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    onClick={handleApplyFilters}
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      fontWeight: 600,
                    }}
                  >
                    Apply
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleClearFilters}
                    sx={{ color: '#64748b', borderColor: '#e2e8f0' }}
                  >
                    Clear
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Collapse>

        {/* Search Bar */}
        <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <CardContent sx={{ p: 3 }}>
            <TextField
              fullWidth
              placeholder="Search students by name or email..."
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
                        fetchStudents();
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
                        <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Location</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Grade</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#475569' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <EmojiEvents fontSize="small" sx={{ color: '#f59e0b' }} />
                            Points
                          </Box>
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Joined</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, color: '#475569' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {students.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                            <School sx={{ fontSize: 48, color: '#cbd5e1', mb: 2 }} />
                            <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 600 }}>
                              No students found
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Try adjusting your search or filters
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        students.map((student) => (
                          <TableRow
                            key={student._id}
                            sx={{
                              '&:hover': { bgcolor: '#f8fafc', cursor: 'pointer' },
                              transition: 'background 0.2s'
                            }}
                            onClick={() => handleViewStudent(student._id)}
                          >
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar
                                  sx={{
                                    width: 40,
                                    height: 40,
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    fontWeight: 700,
                                    fontSize: '0.85rem'
                                  }}
                                >
                                  {getInitials(student.name)}
                                </Avatar>
                                <Box>
                                  <Typography variant="body2" fontWeight={600}>
                                    {student.name}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {student.email}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {student.userProfile?.country || 'Not specified'}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={student.userProfile?.gradeLevel ? `Grade ${student.userProfile.gradeLevel}` : 'N/A'}
                                size="small"
                                sx={{
                                  bgcolor: student.userProfile?.gradeLevel ? 'rgba(102, 126, 234, 0.1)' : '#f1f5f9',
                                  color: student.userProfile?.gradeLevel ? '#667eea' : '#94a3b8',
                                  fontWeight: 600
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <Chip
                                icon={<EmojiEvents sx={{ fontSize: 16, color: '#f59e0b !important' }} />}
                                label={`${student.scholarshipWallet?.balance || 0} SP`}
                                size="small"
                                sx={{
                                  bgcolor: 'rgba(245, 158, 11, 0.1)',
                                  color: '#b45309',
                                  fontWeight: 700,
                                  '& .MuiChip-icon': {
                                    marginLeft: '8px'
                                  }
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <Typography variant="caption" color="text.secondary">
                                {formatDate(student.createdAt)}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewStudent(student._id);
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

export default Students;
