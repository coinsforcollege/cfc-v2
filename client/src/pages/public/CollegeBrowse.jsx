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
  Slider,
  Paper,
  InputBase,
  IconButton,
  Collapse
} from '@mui/material';
import {
  Search,
  School,
  People,
  TrendingUp,
  LocationOn,
  CheckCircle,
  Public,
  Groups,
  Sort,
  FilterList,
  ExpandMore,
  ExpandLess
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  
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

  // Mobile filters state
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Count active filters
  const getActiveFilterCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if (countryFilter) count++;
    if (statusFilter && statusFilter !== 'all') count++;
    if (typeFilter) count++;
    if (sortBy && sortBy !== 'tokens') count++;
    return count;
  };

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
        {/* Row 1: Header with Title/Tagline and Stats */}
        <Box sx={{ mb: 4, mt: 4, display: 'flex', width: '100%', flexDirection: { xs: 'column', md: 'row' }, gap: 3, alignItems: { xs: 'center', md: 'stretch' } }}>
          {/* Column 1: Title & Tagline - 50% */}
          <Box sx={{ width: { xs: '100%', md: '50%' }, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: { xs: 'center', md: 'flex-start' }, textAlign: { xs: 'center', md: 'left' } }}>
            <Typography variant="h5" sx={{
              fontWeight: 700,
              color: '#000',
              mb: 1
            }}>
              {t('auth.exploreColleges')}
            </Typography>
            <Typography variant={{ xs: 'body1', md: 'h6' }} color="text.secondary">
              {t('auth.joinFutureCollegeTokens')}
            </Typography>
          </Box>

          {/* Column 2: Stat Cards - 50% */}
          <Box sx={{ width: { xs: '100%', md: '50%' }, display: 'flex', gap: 4, justifyContent: { xs: 'center', md: 'flex-end' }, alignItems: 'center' }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#8b5cf6', mb: 0.5 }}>
                {globalStats.totalColleges || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                {t('auth.colleges')}
              </Typography>
            </Box>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#ec4899', mb: 0.5 }}>
                {globalStats.totalMiners || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                {t('auth.totalMiners')}
              </Typography>
            </Box>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#06b6d4', mb: 0.5 }}>
                {(() => {
                  const total = globalStats.totalTokensMined || 0;
                  return total < 1 ? total.toFixed(2) : total.toFixed(0);
                })()}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                {t('auth.tokensMined')}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Row 2: Search Bar */}
        <Box sx={{ mb: 4, width: '100%' }}>
          <Paper
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              updateFilters({ search: searchInput });
            }}
            sx={{
              p: '2px 4px',
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: '1px solid #e2e8f0'
            }}
          >
            <IconButton
              type="submit"
              sx={{ p: '10px' }}
              aria-label="search"
            >
              <Search />
            </IconButton>
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder={t('auth.searchByNameCityCountry')}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <Typography
              onClick={() => updateFilters({ search: searchInput })}
              sx={{
                px: 2,
                py: 1,
                cursor: 'pointer',
                color: '#667eea',
                fontWeight: 600,
                '&:hover': {
                  color: '#764ba2'
                }
              }}
            >
              {t('auth.search')}
            </Typography>
          </Paper>
        </Box>

        {/* Mobile Filters - Only visible on mobile */}
        <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 3 }}>
          {/* Filter Toggle Button */}
          <Button
            fullWidth
            variant="outlined"
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            endIcon={mobileFiltersOpen ? <ExpandLess /> : <ExpandMore />}
            startIcon={<FilterList />}
            sx={{
              py: 1.5,
              borderRadius: 2,
              borderColor: '#e2e8f0',
              color: '#2d3748',
              fontWeight: 600,
              justifyContent: 'space-between',
              '&:hover': {
                borderColor: '#667eea',
                background: 'rgba(102, 126, 234, 0.02)'
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {t('auth.filters')}
              {getActiveFilterCount() > 0 && (
                <Chip
                  label={getActiveFilterCount()}
                  size="small"
                  sx={{
                    height: 20,
                    minWidth: 20,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '0.7rem'
                  }}
                />
              )}
            </Box>
          </Button>

          {/* Collapsible Filter Content */}
          <Collapse in={mobileFiltersOpen}>
            <Card sx={{
              mt: 2,
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.02) 0%, rgba(118, 75, 162, 0.02) 100%)'
            }}>
              <CardContent>
                {/* Clear Filters */}
                {getActiveFilterCount() > 0 && (
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => {
                      setSearchParams({});
                    }}
                    sx={{
                      mb: 2,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      fontWeight: 600,
                      '&:hover': {
                        background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
                      }
                    }}
                  >
                    {t('auth.clearAllFilters')}
                  </Button>
                )}

                {/* Sort By - Compact */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, mb: 1, display: 'block', color: '#64748b' }}>
                    {t('auth.sortBy').toUpperCase()}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {[
                      { value: 'miners', label: t('auth.miners'), icon: People },
                      { value: 'tokens', label: t('auth.tokens'), icon: TrendingUp },
                      { value: 'name', label: t('auth.name'), icon: School }
                    ].map(({ value, label, icon: Icon }) => (
                      <Chip
                        key={value}
                        icon={<Icon sx={{ fontSize: 16 }} />}
                        label={label}
                        onClick={() => updateFilters({ sort: value })}
                        sx={{
                          cursor: 'pointer',
                          fontWeight: 500,
                          ...(sortBy === value ? {
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            '& .MuiChip-icon': { color: 'white' },
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

                {/* Status Filter - Compact */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, mb: 1, display: 'block', color: '#64748b' }}>
                    {t('auth.status').toUpperCase()}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {['all', 'Unaffiliated', 'Waitlist', 'Building', 'Live'].map(status => (
                      <Chip
                        key={status}
                        label={status === 'all' ? t('auth.all') : status}
                        size="small"
                        onClick={() => updateFilters({ status: status })}
                        sx={{
                          cursor: 'pointer',
                          fontWeight: 500,
                          ...(statusFilter === status ? {
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

                {/* Country and Type - Side by Side */}
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  {/* Country Filter */}
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: 600, mb: 1, display: 'block', color: '#64748b' }}>
                      {t('auth.country').toUpperCase()}
                    </Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        value={countryFilter}
                        onChange={(e) => updateFilters({ country: e.target.value })}
                        displayEmpty
                        sx={{
                          borderRadius: 2,
                          background: 'white',
                          fontSize: '0.875rem'
                        }}
                      >
                        <MenuItem value="">
                          <em>{t('auth.all')}</em>
                        </MenuItem>
                        {allCountries.map(country => (
                          <MenuItem key={country} value={country} sx={{ fontSize: '0.875rem' }}>
                            {country}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>

                  {/* Type Filter */}
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: 600, mb: 1, display: 'block', color: '#64748b' }}>
                      {t('auth.institutionType').toUpperCase()}
                    </Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        value={typeFilter}
                        onChange={(e) => updateFilters({ type: e.target.value })}
                        displayEmpty
                        sx={{
                          borderRadius: 2,
                          background: 'white',
                          fontSize: '0.875rem'
                        }}
                      >
                        <MenuItem value="">
                          <em>{t('auth.all')}</em>
                        </MenuItem>
                        {allTypes.map(type => (
                          <MenuItem key={type} value={type} sx={{ fontSize: '0.875rem' }}>
                            {type}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Collapse>
        </Box>

        {/* Main Content with Sidebar */}
        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
          {/* Sidebar Filters - Desktop Only */}
          <Box sx={{
            display: { xs: 'none', md: 'block' },
            width: '300px',
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
                

                {/* Clear Filters */}
                {(searchTerm || countryFilter || statusFilter !== 'all' || typeFilter) && (
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => {
                      setSearchParams({});
                    }}
                    sx={{
                      mb: 3,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      fontWeight: 600,
                      '&:hover': {
                        background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
                      }
                    }}
                  >
                    {t('auth.clearAllFilters')}
                  </Button>
                )}

                {/* Sort By */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Sort sx={{ fontSize: 18, color: '#667eea' }} />
                    {t('auth.sortBy')}
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
                          {t('auth.mostMiners')}
                        </Box>
                      </MenuItem>
                      <MenuItem value="tokens">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <TrendingUp sx={{ fontSize: 18 }} />
                          {t('auth.mostTokens')}
                        </Box>
                      </MenuItem>
                      <MenuItem value="name">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <School sx={{ fontSize: 18 }} />
                          {t('auth.nameAZ')}
                        </Box>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Divider sx={{ my: 2.5 }} />

                {/* Status Filter */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <CheckCircle sx={{ fontSize: 18, color: '#667eea' }} />
                    {t('auth.status')}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {['all', 'Unaffiliated', 'Waitlist', 'Building', 'Live'].map(status => (
                      <Chip
                        key={status}
                        label={status === 'all' ? t('auth.all') : status}
                        onClick={() => updateFilters({ status: status })}
                        sx={{
                          cursor: 'pointer',
                          fontWeight: 500,
                          ...(statusFilter === status ? {
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

                {/* Country Filter */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Public sx={{ fontSize: 18, color: '#667eea' }} />
                    {t('auth.country')}
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
                        <em>{t('auth.allCountries')}</em>
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
                    {t('auth.institutionType')}
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
              </CardContent>
            </Card>
          </Box>

          {/* College List */}
          <Box sx={{ flex: 1 }}>

            {/* Results Summary */}
            {colleges.length > 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {t('auth.showingResults', { 
                  start: ((pagination.currentPage - 1) * collegesPerPage) + 1,
                  end: Math.min(pagination.currentPage * collegesPerPage, pagination.totalCount),
                  total: pagination.totalCount
                })}
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
                          <Typography variant="body1" sx={{ fontWeight: 700 }}>
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
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <People sx={{ fontSize: 18, color: '#667eea' }} />
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {college.stats?.totalMiners || 0} {t('auth.minersLabel')}
                            </Typography>
                          </Box>
                          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.5 }}>
                            <TrendingUp sx={{ fontSize: 18, color: '#10b981' }} />
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {college.stats?.totalTokensMined ?
                                (college.stats.totalTokensMined < 1 ?
                                  college.stats.totalTokensMined.toFixed(2) :
                                  college.stats.totalTokensMined.toFixed(0))
                                : 0} {t('auth.tokensLabel')}
                            </Typography>
                          </Box>
                          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
                            <Chip
                              label={`${college.baseRate || 0.25} ${t('auth.tokenPerHour')}`}
                              size="small"
                              sx={{
                                background: 'rgba(16, 185, 129, 0.1)',
                                color: '#059669',
                                fontWeight: 600,
                                fontSize: '0.7rem'
                              }}
                            />
                            {college.referralBonusRate && (
                              <Chip
                                label={t('auth.tokenPerHourPerRef', { rate: college.referralBonusRate })}
                                size="small"
                                sx={{
                                  background: 'rgba(59, 130, 246, 0.1)',
                                  color: '#2563eb',
                                  fontWeight: 600,
                                  fontSize: '0.7rem'
                                }}
                              />
                            )}
                          </Box>
                        </Box>
                      </Box>
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
                  {t('auth.previous')}
                </Button>
                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', px: 2 }}>
                  {t('auth.pageOf', { current: pagination.currentPage, total: pagination.totalPages })}
                </Typography>
                <Button
                  variant="outlined"
                  disabled={!pagination.hasNextPage}
                  onClick={() => updateFilters({ page: currentPage + 1 })}
                  sx={{ minWidth: 100 }}
                >
                  {t('auth.next')}
                </Button>
              </Box>
            )}

            {/* No Results */}
            {!loading && colleges.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <School sx={{ fontSize: 80, color: '#e2e8f0', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  {t('auth.noCollegesFound')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('auth.tryAdjustingFilters')}
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
