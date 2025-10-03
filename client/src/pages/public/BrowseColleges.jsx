import { FiberNew, LocalFireDepartment, LocationOn, School, Search, TrendingUp } from '@mui/icons-material';
import { Alert, AlertTitle, Avatar, Box, Button, Card, CardActionArea, CardContent, CardMedia, Chip, CircularProgress, Container, Grid, InputAdornment, MenuItem, Pagination, Paper, Stack, TextField, Typography, alpha, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { Link } from 'react-router';
import { useGetColleges } from '../../api/college/college.queries';
import collegePlaceholder from '../../assets/college_placeholder.webp';
import useDebounce from '../../hooks/useDebounce';

function BrowseColleges() {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [page, setPage] = useState(1);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const { data: colleges, isLoading, isFetching, isError, error, refetch } = useGetColleges({
    ...(debouncedSearchTerm.length >= 2 ? { q: debouncedSearchTerm } : {}),
    ...(filterType !== 'all' ? { type: filterType } : {}),
    sort: sortBy,
    order: 'asc',
    page: page,
    limit: 15,
  });
  console.log(isLoading);

  const collegesData = colleges?.data?.colleges || [];
  const pagination = colleges?.data?.pagination || {};
  const start = (page - 1) * pagination.limit + 1;
  const end = Math.min(page * pagination.limit, pagination.totalDocs);

  const getBadges = (college) => {
    const badges = [];
    if (college.adminStatus === 'Admin Verified' || college.adminStatus === 'Token Configured') {
      badges.push({ label: 'Hot', color: 'error', icon: <LocalFireDepartment fontSize="small" /> });
    }
    if (college.daysOld <= 7) {
      badges.push({ label: 'New', color: 'info', icon: <FiberNew fontSize="small" /> });
    }
    if (college.growth >= 50) {
      badges.push({ label: 'Growing', color: 'warning', icon: <TrendingUp fontSize="small" /> });
    }
    return badges;
  };

  // Loading
  if (isLoading) {
    return (
      <Box sx={{ minHeight: '100vh', py: { xs: 4, sm: 6 } }}>
        <Container maxWidth="lg">
          <CollegeHeader />
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        </Container>
      </Box>
    )
  };

  // Error
  if (isError) {
    return (
      <Box sx={{ minHeight: '100vh', py: { xs: 4, sm: 6 } }}>
        <Container maxWidth="lg">
          <CollegeHeader />
          <Alert
            severity="error"
            action={
              <Button color="inherit" onClick={() => refetch()}>
                Retry
              </Button>
            }
          >
            <AlertTitle>Error</AlertTitle>
            {error.message || 'Failed to fetch colleges. Please try again.'}
          </Alert>
        </Container>
      </Box>
    )
  };

  // Success
  return (
    <Box sx={{ minHeight: '100vh', py: { xs: 4, sm: 6 } }}>
      <Container maxWidth="lg">
        {/* Header */}
        <CollegeHeader />

        {/* Search and Filter */}
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={2}>
            {/* Search Bar */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                placeholder="Find your college by name, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        {isFetching ? (
                          <CircularProgress size={24} color='inherit' />
                        ) : (
                          <Search color="action" />
                        )}
                      </InputAdornment>
                    ),
                  },
                }}
                variant="outlined"
              />
            </Grid>

            {/* Filters */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                fullWidth
                select
                label="College Type"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                variant="outlined"
              >
                <MenuItem value="all">All Tiers</MenuItem>
                <MenuItem value="Ivy League">Ivy League</MenuItem>
                <MenuItem value="tier1">Tier 1</MenuItem>
                <MenuItem value="tier2">Tier 2</MenuItem>
                <MenuItem value="tier3">Tier 3</MenuItem>
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                fullWidth
                select
                label="Sort By"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                variant="outlined"
              >
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="address.city">Location</MenuItem>
                <MenuItem value="tier">Tier</MenuItem>
                <MenuItem value="createdAt">Recently Added</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </Paper>

        {/* Results Count */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary">
            {`Showing ${start}-${end} of ${pagination.totalDocs} colleges`}
          </Typography>
        </Box>

        {/* College Grid */}
        <Grid container spacing={3}>
          {collegesData.map((college) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={college.id}>
              <Card
                elevation={2}
                sx={{
                  height: '100%',
                }}
              >
                <CardActionArea
                  component={Link}
                  to={`/colleges/${college._id}`}
                  sx={{ height: '100%' }}
                >
                  <CardMedia
                    sx={{
                      aspectRatio: '2 / 1',
                      width: '100%',
                      objectFit: 'cover',
                    }}
                    image={college.banner || collegePlaceholder}
                    title="green iguana"
                    className='grayscale-100'
                  />
                  <CardContent sx={{ p: 2 }}>
                    <Stack spacing={2}>
                      {/* College Logo/Icon */}
                      <Stack direction="row" alignItems="start" spacing={2}>
                        <Avatar
                          src={college.logo}
                          sx={{
                            width: 56,
                            height: 56,
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: 'primary.main',
                          }}
                        >
                          {!college.logo && <School sx={{ fontSize: 32 }} />}
                        </Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            fontWeight={700}
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              fontSize: '18px'
                            }}
                          >
                            {college.name}
                          </Typography>
                          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.5 }}>
                            <LocationOn fontSize="small" color="action" />
                            <Typography variant="caption" color="text.secondary">
                              {college.address?.city}, {college.address?.state}, {college.address?.country}
                            </Typography>
                          </Stack>
                        </Box>
                      </Stack>

                      {/* college short description */}
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontStyle: !college.shortDescription ? 'italic' : 'normal' }}
                      >
                        {college.shortDescription || 'No description available'}
                      </Typography>

                      {/* Stats */}
                      <Stack spacing={1.5} alignItems="flex-start">
                        {/* tier badge */}
                        {college.type && (
                          <Chip
                            size='small'
                            variant="filled"
                            color={
                              college.type === 'Ivy League' ? 'secondary' :
                                college.type === 'tier1' ? 'primary' :
                                  college.type === 'tier2' ? 'success' : 'default'
                            }
                            label={
                              college.type === 'Ivy League' ? 'Ivy League' :
                                college.type === 'tier1' ? 'Tier 1' :
                                  college.type === 'tier2' ? 'Tier 2' : 'Tier 3'
                            }
                          />
                        )}
                      </Stack>
                    </Stack>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
          {pagination.totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <Pagination
                size='large'
                count={pagination.totalPages}
                showFirstButton
                showLastButton
                page={page}
                onChange={(event, value) => setPage(value)}
                disabled={isFetching}
              />
            </Box>
          )}
        </Grid>

        {/* No Results */}
        {collegesData.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <School sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No colleges found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your search or filters
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default BrowseColleges;

function CollegeHeader() {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography fontWeight={600} variant="h4" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }} gutterBottom>
        Explore Colleges
      </Typography>
      <Typography color="text.secondary">
        Discover colleges and join the mining community
      </Typography>
    </Box>
  )
}

