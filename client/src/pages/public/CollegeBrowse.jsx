import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
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
import { getImageUrl } from '../../utils/imageUtils';

// Helper function to get chip style based on status
const getStatusChipStyle = (status) => {
  switch(status) {
    case 'Unaffiliated':
      return {
        background: 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)',
        color: 'white'
      };
    case 'Waitlist':
      return {
        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        color: 'white'
      };
    case 'Building':
      return {
        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        color: 'white'
      };
    case 'Live':
      return {
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: 'white'
      };
    default:
      return {
        background: '#e5e7eb',
        color: '#6b7280'
      };
  }
};

const CollegeBrowse = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [colleges, setColleges] = useState([]);
  const [allCountries, setAllCountries] = useState([]);
  const [allTypes, setAllTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    totalCount: 0,
    totalPages: 0,
    currentPage: 1,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [globalStats, setGlobalStats] = useState({
    totalColleges: 0,
    totalMiners: 0,
    totalTokensMined: 0
  });
  const collegesPerPage = 20;

  // Read from URL params
  const currentPage = parseInt(searchParams.get('page') || '1');
  const searchTerm = searchParams.get('search') || '';
  const countryFilter = searchParams.get('country') || '';
  const statusFilter = searchParams.get('status') || 'all';
  const typeFilter = searchParams.get('type') || '';
  const sortBy = searchParams.get('sort') || 'tokens';
  
  // Local state for search input (to prevent focus loss)
  const [searchInput, setSearchInput] = useState(searchTerm);

  // Update URL params
  const updateFilters = (updates) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== 'all' && value !== '') {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    // Reset to page 1 when filters change (unless page is being updated)
    if (!('page' in updates)) {
      newParams.set('page', '1');
    }
    setSearchParams(newParams);
  };

  // Sync searchInput with URL searchTerm
  useEffect(() => {
    setSearchInput(searchTerm);
  }, [searchTerm]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== searchTerm) {
        updateFilters({ search: searchInput });
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    fetchColleges();
  }, [searchParams]);

  useEffect(() => {
    // Fetch metadata for filters
    fetchFilterOptions();
  }, []);

  const fetchFilterOptions = async () => {
    try {
      // Fetch ONLY metadata (countries and types) - no college data
      const response = await apiClient.get('/colleges/metadata');
      if (response.success && response.data) {
        setAllCountries(response.data.countries);
        setAllTypes(response.data.types);
      }
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };

  const fetchColleges = async () => {
    try {
      setLoading(true);
      
      // Build query params
      const params = new URLSearchParams({
        page: currentPage,
        limit: collegesPerPage,
        sortBy: sortBy
      });

      if (searchTerm) params.append('search', searchTerm);
      if (countryFilter && countryFilter !== 'all') params.append('country', countryFilter);
      if (statusFilter && statusFilter !== 'all') params.append('status', statusFilter);
      if (typeFilter && typeFilter !== 'all') params.append('type', typeFilter);

      const response = await apiClient.get(`/colleges?${params.toString()}`);
      
      console.log('📡 API Response:', {
        url: `/colleges?${params.toString()}`,
        collegesCount: response.colleges?.length || response?.length,
        totalCount: response.pagination?.totalCount,
        globalMiners: response.globalStats?.totalMiners
      });
      
      if (response.colleges) {
        setColleges(response.colleges);
        setPagination(response.pagination);
        setGlobalStats(response.globalStats);
      } else {
        // Fallback for old API format
        setColleges(response || []);
      }
    } catch (error) {
      console.error('Error fetching colleges:', error);
    } finally {
      setLoading(false);
    }
  };

  // Backend handles filtering, sorting, and pagination
  // No frontend filtering needed!

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
              {globalStats.totalColleges || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">Colleges</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#667eea' }}>
              {globalStats.totalMiners || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">Active Miners</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#667eea' }}>
              {(() => {
                const total = globalStats.totalTokensMined || 0;
                return total < 1 ? total.toFixed(2) : total.toFixed(0);
              })()}
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
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
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
                    onChange={(e, newValue) => newValue && updateFilters({ status: newValue })}
                    orientation="vertical"
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
                    <ToggleButton value="Unaffiliated">Unaffiliated</ToggleButton>
                    <ToggleButton value="Waitlist">Waitlist</ToggleButton>
                    <ToggleButton value="Building">Building</ToggleButton>
                    <ToggleButton value="Live">Live</ToggleButton>
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
                      onChange={(e) => updateFilters({ country: e.target.value })}
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
                        <em>All Countries</em>
                      </MenuItem>
                      {allCountries.map(country => (
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
                    {allTypes.map(type => (
                      <Chip
                        key={type}
                        label={type}
                        onClick={() => {
                          updateFilters({ type: typeFilter === type ? '' : type });
                        }}
                        sx={{
                          cursor: 'pointer',
                          fontWeight: 500,
                          ...(typeFilter === type ? {
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


                {/* Sort By */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Sort sx={{ fontSize: 18, color: '#667eea' }} />
                    Sort By
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={sortBy}
                      onChange={(e) => updateFilters({ sort: e.target.value })}
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
                {(searchInput || countryFilter || statusFilter !== 'all' || typeFilter) && (
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => {
                      setSearchParams({});
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

            {/* Results Summary */}
            {colleges.length > 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Showing {((pagination.currentPage - 1) * collegesPerPage) + 1}-{Math.min(pagination.currentPage * collegesPerPage, pagination.totalCount)} of {pagination.totalCount} colleges
              </Typography>
            )}

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {colleges.map((college) => (
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
                        src={getImageUrl(college.logo) || '/images/college-logo-placeholder.png'}
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
                            label={college.status || 'Unaffiliated'}
                            size="small"
                            sx={{ 
                              ...getStatusChipStyle(college.status),
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

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 4, gap: 2 }}>
                <Button
                  variant="outlined"
                  disabled={!pagination.hasPrevPage}
                  onClick={() => updateFilters({ page: currentPage - 1 })}
                  sx={{ minWidth: 100 }}
                >
                  Previous
                </Button>
                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', px: 2 }}>
                  Page {pagination.currentPage} of {pagination.totalPages}
                </Typography>
                <Button
                  variant="outlined"
                  disabled={!pagination.hasNextPage}
                  onClick={() => updateFilters({ page: currentPage + 1 })}
                  sx={{ minWidth: 100 }}
                >
                  Next
                </Button>
              </Box>
            )}

            {/* No Results */}
            {!loading && colleges.length === 0 && (
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
