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
  Edit,
  Delete,
  Refresh,
  Close
} from '@mui/icons-material';
import { platformAdminApi } from '../../api/platformAdmin.api';
import { useToast } from '../../contexts/ToastContext';
import DashboardLayout from '../../layouts/DashboardLayout';

const Users = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Tab state
  const [currentTab, setCurrentTab] = useState(0);

  // State for students list
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [errorStudents, setErrorStudents] = useState('');
  const [searchStudents, setSearchStudents] = useState('');
  const [pageStudents, setPageStudents] = useState(0);
  const [rowsPerPageStudents, setRowsPerPageStudents] = useState(25);
  const [totalStudents, setTotalStudents] = useState(0);

  // State for college admins list
  const [collegeAdmins, setCollegeAdmins] = useState([]);
  const [loadingCollegeAdmins, setLoadingCollegeAdmins] = useState(true);
  const [errorCollegeAdmins, setErrorCollegeAdmins] = useState('');
  const [searchCollegeAdmins, setSearchCollegeAdmins] = useState('');
  const [pageCollegeAdmins, setPageCollegeAdmins] = useState(0);
  const [rowsPerPageCollegeAdmins, setRowsPerPageCollegeAdmins] = useState(25);
  const [totalCollegeAdmins, setTotalCollegeAdmins] = useState(0);

  // Fetch students
  const fetchStudents = async () => {
    try {
      setLoadingStudents(true);
      setErrorStudents('');
      const response = await platformAdminApi.getAllStudents({
        search: searchStudents,
        page: pageStudents + 1,
        limit: rowsPerPageStudents
      });

      if (response.success) {
        setStudents(response.data);
        setTotalStudents(response.pagination.total);
      }
    } catch (err) {
      setErrorStudents(err.message || 'Failed to load students');
      showToast(err.message || 'Failed to load students', 'error');
    } finally {
      setLoadingStudents(false);
    }
  };

  // Fetch college admins
  const fetchCollegeAdmins = async () => {
    try {
      setLoadingCollegeAdmins(true);
      setErrorCollegeAdmins('');
      const response = await platformAdminApi.getAllCollegeAdmins({
        search: searchCollegeAdmins,
        page: pageCollegeAdmins + 1,
        limit: rowsPerPageCollegeAdmins
      });

      if (response.success) {
        setCollegeAdmins(response.data);
        setTotalCollegeAdmins(response.pagination.total);
      }
    } catch (err) {
      setErrorCollegeAdmins(err.message || 'Failed to load college admins');
      showToast(err.message || 'Failed to load college admins', 'error');
    } finally {
      setLoadingCollegeAdmins(false);
    }
  };

  useEffect(() => {
    if (currentTab === 0) {
      fetchStudents();
    } else {
      fetchCollegeAdmins();
    }
  }, [currentTab, pageStudents, rowsPerPageStudents, pageCollegeAdmins, rowsPerPageCollegeAdmins]);

  const handleSearchStudents = () => {
    setPageStudents(0);
    fetchStudents();
  };

  const handleSearchCollegeAdmins = () => {
    setPageCollegeAdmins(0);
    fetchCollegeAdmins();
  };

  const handleSearchKeyPress = (e, type) => {
    if (e.key === 'Enter') {
      if (type === 'students') {
        handleSearchStudents();
      } else {
        handleSearchCollegeAdmins();
      }
    }
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewStudent = (id) => {
    navigate(`/platform-admin/students/${id}`);
  };

  const handleEditStudent = (id) => {
    navigate(`/platform-admin/students/${id}?edit=true`);
  };

  const handleViewCollegeAdmin = (id) => {
    navigate(`/platform-admin/college-admins/${id}`);
  };

  const handleEditCollegeAdmin = (id) => {
    navigate(`/platform-admin/college-admins/${id}?edit=true`);
  };

  const sidebarStats = {
    studentsCount: totalStudents,
    collegeAdminsCount: totalCollegeAdmins
  };

  return (
    <DashboardLayout stats={sidebarStats}>
      <Box sx={{ maxWidth: '1400px', width: '100%', mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
              Users
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage all platform users
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={currentTab === 0 ? fetchStudents : fetchCollegeAdmins}
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

        {/* Tabs */}
        <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              px: 3,
              '& .MuiTab-root': {
                fontWeight: 600,
                fontSize: '0.95rem',
                textTransform: 'none'
              }
            }}
          >
            <Tab label={`Students (${totalStudents})`} />
            <Tab label={`College Admins (${totalCollegeAdmins})`} />
          </Tabs>
        </Card>

        {/* Search Bar */}
        <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <CardContent sx={{ p: 3 }}>
            <TextField
              fullWidth
              placeholder={currentTab === 0 ? 'Search students by name or email...' : 'Search college admins by name or email...'}
              value={currentTab === 0 ? searchStudents : searchCollegeAdmins}
              onChange={(e) => currentTab === 0 ? setSearchStudents(e.target.value) : setSearchCollegeAdmins(e.target.value)}
              onKeyPress={(e) => handleSearchKeyPress(e, currentTab === 0 ? 'students' : 'college-admins')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
                endAdornment: ((currentTab === 0 && searchStudents) || (currentTab === 1 && searchCollegeAdmins)) && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => {
                        if (currentTab === 0) {
                          setSearchStudents('');
                          setPageStudents(0);
                          fetchStudents();
                        } else {
                          setSearchCollegeAdmins('');
                          setPageCollegeAdmins(0);
                          fetchCollegeAdmins();
                        }
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
        {currentTab === 0 && (
          <Card sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ p: 0 }}>
              {errorStudents && (
                <Alert severity="error" sx={{ m: 3 }}>
                  {errorStudents}
                </Alert>
              )}

              {loadingStudents ? (
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
                          <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Contact</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: '#475569' }}>College</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Referrals</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Joined</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 700, color: '#475569' }}>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {students.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                              <Typography variant="body2" color="text.secondary">
                                No students found
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ) : (
                          students.map((student) => (
                            <TableRow key={student._id} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                              <TableCell>
                                <Box>
                                  <Typography variant="body2" fontWeight={600}>
                                    {student.name}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    ID: {student._id.slice(-8)}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box>
                                  <Typography variant="body2">{student.email}</Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {student.phone}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">
                                  {student.college?.name || 'N/A'}
                                </Typography>
                                {student.college?.country && (
                                  <Typography variant="caption" color="text.secondary">
                                    {student.college.country}
                                  </Typography>
                                )}
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={student.studentProfile?.totalReferrals || 0}
                                  size="small"
                                  color="primary"
                                  sx={{ fontWeight: 600 }}
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
                                  onClick={() => handleViewStudent(student._id)}
                                  sx={{ color: '#667eea' }}
                                >
                                  <Visibility fontSize="small" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() => handleEditStudent(student._id)}
                                  sx={{ color: '#06b6d4' }}
                                >
                                  <Edit fontSize="small" />
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
                    count={totalStudents}
                    page={pageStudents}
                    onPageChange={(e, newPage) => setPageStudents(newPage)}
                    rowsPerPage={rowsPerPageStudents}
                    onRowsPerPageChange={(e) => {
                      setRowsPerPageStudents(parseInt(e.target.value, 10));
                      setPageStudents(0);
                    }}
                    rowsPerPageOptions={[10, 25, 50, 100]}
                  />
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* College Admins Table */}
        {currentTab === 1 && (
          <Card sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ p: 0 }}>
              {errorCollegeAdmins && (
                <Alert severity="error" sx={{ m: 3 }}>
                  {errorCollegeAdmins}
                </Alert>
              )}

              {loadingCollegeAdmins ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                  <CircularProgress />
                </Box>
              ) : (
                <>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ bgcolor: '#f8fafc' }}>
                          <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Admin</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Contact</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Managed College</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Status</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Joined</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 700, color: '#475569' }}>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {collegeAdmins.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                              <Typography variant="body2" color="text.secondary">
                                No college admins found
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ) : (
                          collegeAdmins.map((admin) => (
                            <TableRow key={admin._id} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                              <TableCell>
                                <Box>
                                  <Typography variant="body2" fontWeight={600}>
                                    {admin.name}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    ID: {admin._id.slice(-8)}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box>
                                  <Typography variant="body2">{admin.email}</Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {admin.phone}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">
                                  {admin.managedCollege?.name || 'N/A'}
                                </Typography>
                                {admin.managedCollege?.country && (
                                  <Typography variant="caption" color="text.secondary">
                                    {admin.managedCollege.country}
                                  </Typography>
                                )}
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={admin.isActive ? 'Active' : 'Inactive'}
                                  size="small"
                                  color={admin.isActive ? 'success' : 'default'}
                                  sx={{ fontWeight: 600 }}
                                />
                              </TableCell>
                              <TableCell>
                                <Typography variant="caption" color="text.secondary">
                                  {formatDate(admin.createdAt)}
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <IconButton
                                  size="small"
                                  onClick={() => handleViewCollegeAdmin(admin._id)}
                                  sx={{ color: '#667eea' }}
                                >
                                  <Visibility fontSize="small" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() => handleEditCollegeAdmin(admin._id)}
                                  sx={{ color: '#06b6d4' }}
                                >
                                  <Edit fontSize="small" />
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
                    count={totalCollegeAdmins}
                    page={pageCollegeAdmins}
                    onPageChange={(e, newPage) => setPageCollegeAdmins(newPage)}
                    rowsPerPage={rowsPerPageCollegeAdmins}
                    onRowsPerPageChange={(e) => {
                      setRowsPerPageCollegeAdmins(parseInt(e.target.value, 10));
                      setPageCollegeAdmins(0);
                    }}
                    rowsPerPageOptions={[10, 25, 50, 100]}
                  />
                </>
              )}
            </CardContent>
          </Card>
        )}
      </Box>
    </DashboardLayout>
  );
};

export default Users;
