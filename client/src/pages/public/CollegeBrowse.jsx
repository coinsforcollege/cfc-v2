import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Avatar,
  Chip,
  Button,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  Slider
} from '@mui/material';
import {
  Search,
  School,
  People,
  TrendingUp,
  LocationOn,
  ArrowForward,
  CheckCircle,
  Public,
  Groups,
  Sort
} from '@mui/icons-material';
import apiClient from '../../api/apiClient';

const CollegeBrowse = () => {
  const navigate = useNavigate();
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, active, waitlist
  const [typeFilter, setTypeFilter] = useState([]);
  const [studentRange, setStudentRange] = useState([0, 100000]);
  const [sortBy, setSortBy] = useState('miners');

  useEffect(() => {
    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/colleges');
      setColleges(response || []);
    } catch (error) {
      console.error('Error fetching colleges:', error);
    } finally {
      setLoading(false);
    }
  };

  const countries = [...new Set(colleges.map(c => c.country))].filter(Boolean).sort();
  const types = [...new Set(colleges.map(c => c.type))].filter(Boolean).sort();

  let filteredColleges = colleges.filter(college => {
    // Search filter
    const matchesSearch = college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      college.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (college.city && college.city.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Country filter
    const matchesCountry = !countryFilter || college.country === countryFilter;
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && college.isActive) ||
      (statusFilter === 'waitlist' && !college.isActive);
    
    // Type filter
    const matchesType = typeFilter.length === 0 || typeFilter.includes(college.type);
    
    // Student range filter
    const totalStudents = college.studentLife?.totalStudents || 0;
    const matchesStudentRange = totalStudents >= studentRange[0] && totalStudents <= studentRange[1];
    
    return matchesSearch && matchesCountry && matchesStatus && matchesType && matchesStudentRange;
  });

  // Sort colleges
  if (sortBy === 'miners') {
    filteredColleges = filteredColleges.sort((a, b) => (b.stats?.totalMiners || 0) - (a.stats?.totalMiners || 0));
  } else if (sortBy === 'tokens') {
    filteredColleges = filteredColleges.sort((a, b) => (b.stats?.totalTokensMined || 0) - (a.stats?.totalTokensMined || 0));
  } else if (sortBy === 'name') {
    filteredColleges = filteredColleges.sort((a, b) => a.name.localeCompare(b.name));
  }

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        pt: { xs: 12, md: 14 }
      }}>
        <LinearProgress sx={{ width: '50%' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: '#f8fafc',
      pt: { xs: 12, md: 14 },
      pb: 8
    }}>
      <Box sx={{ 
        maxWidth: '1200px',
        mx: 'auto',
        px: { xs: 2, md: 3 }
      }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4, mt: 4 }}>
          <Typography variant="h3" sx={{ 
            fontWeight: 800,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2
          }}>
            Explore Colleges
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Join the future of college tokens and start mining today
          </Typography>
        </Box>

        {/* Stats Banner */}
        <Box sx={{ 
          display: 'flex',
          justifyContent: 'center',
          gap: 4,
          mb: 4,
          flexWrap: 'wrap'
        }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#667eea' }}>
              {colleges.length}+
            </Typography>
            <Typography variant="body2" color="text.secondary">Colleges</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#667eea' }}>
              {colleges.reduce((sum, c) => sum + (c.stats?.totalMiners || 0), 0)}+
            </Typography>
            <Typography variant="body2" color="text.secondary">Active Miners</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#667eea' }}>
              {(() => {
                const total = colleges.reduce((sum, c) => sum + (c.stats?.totalTokensMined || 0), 0);
                return total < 1 ? total.toFixed(2) : total.toFixed(0);
              })()}+
            </Typography>
            <Typography variant="body2" color="text.secondary">Tokens Mined</Typography>
          </Box>
        </Box>

        {/* Main Content with Sidebar */}
        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
          {/* Sidebar Filters */}
          <Box sx={{ 
            width: { xs: '100%', md: '300px' },
            flexShrink: 0
          }}>
            <Card sx={{ 
              borderRadius: 3, 
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)', 
              position: 'sticky', 
              top: 90,
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.02) 0%, rgba(118, 75, 162, 0.02) 100%)'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <Search sx={{ fontSize: 24, color: '#667eea' }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Find Colleges
                  </Typography>
                </Box>

                {/* Search */}
                <TextField
                  fullWidth
                  placeholder="Search by name, city..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  size="small"
                  sx={{ 
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      background: 'white'
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ fontSize: 20, color: '#667eea' }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <Divider sx={{ my: 2.5 }} />

                {/* Status Filter */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <CheckCircle sx={{ fontSize: 18, color: '#667eea' }} />
                    Status
                  </Typography>
                  <ToggleButtonGroup
                    value={statusFilter}
                    exclusive
                    onChange={(e, newValue) => newValue && setStatusFilter(newValue)}
                    fullWidth
                    size="small"
                    sx={{
                      '& .MuiToggleButton-root': {
                        textTransform: 'none',
                        fontWeight: 500,
                        borderRadius: 1.5,
                        '&.Mui-selected': {
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                          }
                        }
                      }
                    }}
                  >
                    <ToggleButton value="all">All</ToggleButton>
                    <ToggleButton value="active">Active</ToggleButton>
                    <ToggleButton value="waitlist">Waitlist</ToggleButton>
                  </ToggleButtonGroup>
                </Box>

                <Divider sx={{ my: 2.5 }} />

                {/* Country Filter */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Public sx={{ fontSize: 18, color: '#667eea' }} />
                    Country
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={countryFilter}
                      onChange={(e) => setCountryFilter(e.target.value)}
                      displayEmpty
                      sx={{ 
                        borderRadius: 2,
                        background: 'white',
                        '& .MuiSelect-select': {
                          py: 1.2
                        }
                      }}
                    >
                      <MenuItem value="">
                        <em>All Countries ({countries.length})</em>
                      </MenuItem>
                      {countries.map(country => (
                        <MenuItem key={country} value={country}>
                          {country}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                <Divider sx={{ my: 2.5 }} />

                {/* Type Filter */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <School sx={{ fontSize: 18, color: '#667eea' }} />
                    Institution Type
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {types.map(type => (
                      <Chip
                        key={type}
                        label={type}
                        onClick={() => {
                          if (typeFilter.includes(type)) {
                            setTypeFilter(typeFilter.filter(t => t !== type));
                          } else {
                            setTypeFilter([...typeFilter, type]);
                          }
                        }}
                        sx={{
                          cursor: 'pointer',
                          fontWeight: 500,
                          ...(typeFilter.includes(type) ? {
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                            }
                          } : {
                            background: 'white',
                            border: '1px solid #e2e8f0',
                            '&:hover': {
                              background: '#f8fafc',
                              borderColor: '#667eea'
                            }
                          })
                        }}
                      />
                    ))}
                  </Box>
                </Box>

                <Divider sx={{ my: 2.5 }} />

                {/* Student Population Range */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Groups sx={{ fontSize: 18, color: '#667eea' }} />
                    Student Population
                  </Typography>
                  <Box sx={{ px: 1 }}>
                    <Slider
                      value={studentRange}
                      onChange={(e, newValue) => setStudentRange(newValue)}
                      valueLabelDisplay="auto"
                      min={0}
                      max={100000}
                      step={5000}
                      valueLabelFormat={(value) => value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}
                      sx={{
                        color: '#667eea',
                        '& .MuiSlider-thumb': {
                          '&:hover, &.Mui-focusVisible': {
                            boxShadow: '0 0 0 8px rgba(102, 126, 234, 0.16)',
                          },
                        },
                      }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        {studentRange[0] >= 1000 ? `${(studentRange[0] / 1000).toFixed(0)}k` : studentRange[0]}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {studentRange[1] >= 1000 ? `${(studentRange[1] / 1000).toFixed(0)}k` : studentRange[1]}+
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Divider sx={{ my: 2.5 }} />

                {/* Sort By */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Sort sx={{ fontSize: 18, color: '#667eea' }} />
                    Sort By
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      sx={{ 
                        borderRadius: 2,
                        background: 'white',
                        '& .MuiSelect-select': {
                          py: 1.2
                        }
                      }}
                    >
                      <MenuItem value="miners">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <People sx={{ fontSize: 18 }} />
                          Most Miners
                        </Box>
                      </MenuItem>
                      <MenuItem value="tokens">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <TrendingUp sx={{ fontSize: 18 }} />
                          Most Tokens
                        </Box>
                      </MenuItem>
                      <MenuItem value="name">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <School sx={{ fontSize: 18 }} />
                          Name (A-Z)
                        </Box>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                {/* Clear Filters */}
                {(searchTerm || countryFilter || statusFilter !== 'all' || typeFilter.length > 0 || studentRange[0] !== 0 || studentRange[1] !== 100000) && (
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => {
                      setSearchTerm('');
                      setCountryFilter('');
                      setStatusFilter('all');
                      setTypeFilter([]);
                      setStudentRange([0, 100000]);
                    }}
                    sx={{ 
                      mt: 2, 
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      fontWeight: 600,
                      '&:hover': {
                        background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
                      }
                    }}
                  >
                    Clear All Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          </Box>

          {/* College List */}
          <Box sx={{ flex: 1 }}>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {filteredColleges.map((college) => (
                <Card 
                  key={college._id}
                  sx={{ 
                    borderRadius: 3,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateX(8px)',
                      boxShadow: '0 8px 32px rgba(102, 126, 234, 0.2)'
                    }
                  }}
                  onClick={() => navigate(`/colleges/${college._id}`)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap' }}>
                      {/* Logo */}
                      <Avatar
                        src={college.logo || '/images/college-logo-placeholder.png'}
                        sx={{ 
                          width: 80,
                          height: 80,
                          border: '3px solid white',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                      >
                        <School sx={{ fontSize: 40 }} />
                      </Avatar>

                      {/* College Info */}
                      <Box sx={{ flex: 1, minWidth: '200px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1, flexWrap: 'wrap' }}>
                          <Typography variant="h5" sx={{ fontWeight: 700 }}>
                            {college.name}
                          </Typography>
                          <Chip 
                            label={college.isActive ? 'Active' : 'Waitlist'}
                            size="small"
                            sx={{ 
                              background: college.isActive 
                                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                                : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                              color: 'white',
                              fontWeight: 600,
                              fontSize: '0.7rem'
                            }}
                          />
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
                          <LocationOn sx={{ fontSize: 16, color: '#64748b' }} />
                          <Typography variant="body2" color="text.secondary">
                            {college.city ? `${college.city}, ` : ''}{college.country}
                          </Typography>
                        </Box>

                        {college.description && (
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ 
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              mb: 2
                            }}
                          >
                            {college.description || college.tagline}
                          </Typography>
                        )}

                        {/* Stats */}
                        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <People sx={{ fontSize: 18, color: '#667eea' }} />
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {college.stats?.totalMiners || 0} miners
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <TrendingUp sx={{ fontSize: 18, color: '#10b981' }} />
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {college.stats?.totalTokensMined ? 
                                (college.stats.totalTokensMined < 1 ? 
                                  college.stats.totalTokensMined.toFixed(2) : 
                                  college.stats.totalTokensMined.toFixed(0)) 
                                : 0} tokens
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      {/* View Button */}
                      <Button
                        variant="contained"
                        endIcon={<ArrowForward />}
                        sx={{ 
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          borderRadius: 2,
                          px: 3,
                          py: 1.5,
                          fontWeight: 600,
                          textTransform: 'none'
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/colleges/${college._id}`);
                        }}
                      >
                        View Details
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>

            {/* No Results */}
            {filteredColleges.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <School sx={{ fontSize: 80, color: '#e2e8f0', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  No colleges found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Try adjusting your filters
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CollegeBrowse;
