import { ArrowBack, Email, LocationOn, OpenInNew, Phone, Public, School, Star } from '@mui/icons-material'
import { Alert, AlertTitle, alpha, Avatar, Box, Button, Card, CardContent, Chip, CircularProgress, Container, Grid, Stack, styled, Typography } from '@mui/material'
import React from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { useGetCollegeById } from '../../api/college/college.queries'
import collegePlaceholder from '../../assets/college_placeholder.webp'
import { useAuth } from '../../contexts/AuthContext'

// Styled Badge for Featured indicator
const StyledBadge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  right: theme.spacing(2),
  zIndex: 20,
  backgroundColor: '#fbbf24',
  color: '#000',
  padding: theme.spacing(0.5, 1.5),
  borderRadius: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  fontWeight: 600,
  fontSize: '0.875rem'
}))

function CollegeDetails() {
  const { isAuthenticated, user } = useAuth()
  const { id } = useParams()
  const { data, isLoading, error, isError, refetch } = useGetCollegeById(id)
  const college = data?.data?.college
  const navigate = useNavigate()

  // Loading
  if (isLoading) {
    return (
      <Box sx={{ minHeight: '100vh', py: { xs: 4, sm: 6 } }}>
        <Container maxWidth="lg">
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

  const getTierColor = (tier) => {
    switch (tier) {
      case 'Ivy League': return 'secondary'
      case 'tier1': return 'primary'
      case 'tier2': return 'success'
      default: return 'default'
    }
  }

  const getTierLabel = (tier) => {
    switch (tier) {
      case 'Ivy League': return 'Ivy League'
      case 'tier1': return 'Tier 1'
      case 'tier2': return 'Tier 2'
      default: return 'Tier 3'
    }
  }

  const handleJoinMining = () => {
    if (!isAuthenticated && user?.role === 'student') {
      navigate('/auth/register/student')
    } else {
      navigate(`/student`)
    }
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, py: { xs: 4, sm: 6 } }}>
        <Button
          component={Link}
          to="/colleges"
          variant="text"
          color="inherit"
          startIcon={<ArrowBack />}
          sx={{ alignSelf: 'flex-start' }}
          size='small'
          className='capitalize'
        >
          Back to Colleges
        </Button>

        {/* Hero Section */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* College Header Info */}
          <Grid container spacing={3}>

            <Grid size={{ xs: 12, md: 9 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  {/* College Logo */}
                  <Box sx={{ flexShrink: 0 }}>
                    <Avatar
                      src={college.logo}
                      alt={`${college.name} logo`}
                      sx={(theme) => ({
                        width: 80,
                        height: 80,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: 'primary.main',
                      })}
                    >
                      <School sx={{ fontSize: 32 }} />
                    </Avatar>
                  </Box>

                  {/* College Info */}
                  <Stack sx={{ flex: 1 }} spacing={1}>
                    <Typography
                      variant="h4"
                      sx={{
                        fontSize: { xs: '1.5rem', sm: '2rem' }
                      }}
                      fontWeight={700}
                      component="h1"
                      gutterBottom
                    >
                      {college.name}
                    </Typography>

                    {college.address && (
                      <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 1.5 }}>
                        <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body1" color="text.secondary">
                          {college.address.city}, {college.address.state}, {college.address.country}
                        </Typography>
                      </Stack>
                    )}
                  </Stack>
                </Stack>

                <Typography
                  variant="body1"
                  color={!college.shortDescription ? 'text.secondary' : 'text.primary'}
                  sx={{
                    fontStyle: !college.shortDescription ? 'italic' : 'normal'
                  }}
                >
                  {college.shortDescription || 'No description available'}
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              {user?.role === 'student' && <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleJoinMining}
                sx={{
                  textTransform: 'none',
                }}
              >
                {!isAuthenticated ? 'Join Mining' : 'Switch to This College'}
              </Button>}
            </Grid>

          </Grid>
          {/* Banner Image */}
          <Box sx={{ position: 'relative', width: '100%', aspectRatio: '3/1', overflow: 'hidden', borderRadius: 2 }}>
            {/* Background image */}
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                zIndex: 0,
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `url(${college.bannerImage || collegePlaceholder})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: 'blur(4px) grayscale(100%)',
                  transform: 'scale(1.1)',
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'rgba(0,0,0,0.7)',
                },
              }}
            />

            {/* Foreground Image (clear) */}
            <Box
              component="img"
              src={college.bannerImage || collegePlaceholder}
              alt={`${college.name} banner`}
              sx={{
                position: 'relative',
                zIndex: 10,
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                filter: 'grayscale(100%)'
              }}
            />

            {/* Featured Badge */}
            {college.isFeatured && (
              <StyledBadge>
                <Star sx={{ fontSize: 12 }} />
                Featured College
              </StyledBadge>
            )}
          </Box>
        </Box>

        {/* Main Content */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 3 }}>
          {/* Left Column - Main Content */}
          <Stack spacing={3}>
            {/* About Section */}
            <Card elevation={2}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h6" fontWeight={600} component="h2">
                  About {college.name}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    textAlign: 'justify',
                    whiteSpace: 'pre-line',
                    color: !college.description ? 'text.secondary' : 'text.primary',
                    fontStyle: !college.description ? 'italic' : 'normal'
                  }}
                >
                  {college.description || 'No description available'}
                </Typography>
              </CardContent>
            </Card>

            {/* Programs & Courses */}
            <Card elevation={2}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h6" fontWeight={600} component="h2">
                  Programs & Courses
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Explore the academic programs offered at {college.name}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {college?.courses?.map((course, index) => (
                    <Chip key={index} label={course} variant="outlined" />
                  ))}
                </Box>
                {college?.courses?.length === 0 && (
                  <Typography fontStyle='italic' variant="body2" color="text.secondary">
                    No programs & courses available
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Stack>

          {/* Right Column - Sidebar */}
          <Stack spacing={3}>
            {/* Contact Information */}
            {(college.email || college.phone || college.website || college.address) && (
              <Card elevation={2}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Typography variant="h6" fontWeight={600} component="h2">
                    Contact Information
                  </Typography>
                  <Stack spacing={2}>
                    {college.address && (
                      <Stack direction="row" spacing={1.5} alignItems="flex-start">
                        <LocationOn sx={{ fontSize: 16, color: 'text.secondary', mt: 0.25, flexShrink: 0 }} />
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            Location
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {college.address.city}, {college.address.state}, {college.address.country}
                          </Typography>
                        </Box>
                      </Stack>
                    )}

                    {college.email && (
                      <Stack direction="row" spacing={1.5} alignItems="flex-start">
                        <Email sx={{ fontSize: 16, color: 'text.secondary', mt: 0.25, flexShrink: 0 }} />
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            Email
                          </Typography>
                          <Typography
                            component="a"
                            href={`mailto:${college.email}`}
                            variant="body2"
                            color="primary"
                            sx={{ '&:hover': { textDecoration: 'underline' } }}
                          >
                            {college.email}
                          </Typography>
                        </Box>
                      </Stack>
                    )}

                    {college.phone && (
                      <Stack direction="row" spacing={1.5} alignItems="flex-start">
                        <Phone sx={{ fontSize: 16, color: 'text.secondary', mt: 0.25, flexShrink: 0 }} />
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            Phone
                          </Typography>
                          <Typography
                            component="a"
                            href={`tel:${college.phone}`}
                            variant="body2"
                            color="primary"
                            sx={{ '&:hover': { textDecoration: 'underline' } }}
                          >
                            {college.phone}
                          </Typography>
                        </Box>
                      </Stack>
                    )}

                    {college.website && (
                      <Stack direction="row" spacing={1.5} alignItems="flex-start">
                        <Public sx={{ fontSize: 16, color: 'text.secondary', mt: 0.25, flexShrink: 0 }} />
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            Website
                          </Typography>
                          <Typography
                            component="a"
                            href={college.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="body2"
                            color="primary"
                            sx={{ display: 'flex', alignItems: 'center', gap: 0.5, '&:hover': { textDecoration: 'underline' } }}
                          >
                            Visit Website
                            <OpenInNew sx={{ fontSize: 12 }} />
                          </Typography>
                        </Box>
                      </Stack>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            )}

            {/* Quick Stats */}
            {college.courses && college?.courses?.length > 0 && (
              <Card elevation={2}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Typography variant="h6" fontWeight={600} component="h2">
                    Quick Facts
                  </Typography>
                  <Stack spacing={2}>
                    {college.type && (
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2" color="text.secondary">Tier</Typography>
                        <Chip
                          label={getTierLabel(college.type)}
                          color={getTierColor(college.type)}
                          size="small"
                        />
                      </Stack>
                    )}

                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" color="text.secondary">Status</Typography>
                      <Chip
                        label={college.status === 'published' ? 'Active' : 'Draft'}
                        color={college.status === 'published' ? 'success' : 'warning'}
                        size="small"
                      />
                    </Stack>

                    {college.isFeatured && (
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2" color="text.secondary">Recognition</Typography>
                        <Chip
                          icon={<Star sx={{ fontSize: 12 }} />}
                          label="Featured"
                          sx={{ bgcolor: '#fbbf24', color: '#000' }}
                          size="small"
                        />
                      </Stack>
                    )}

                    {college.courses && college?.courses?.length > 0 && (
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2" color="text.secondary">Programs</Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {college?.courses?.length} Available
                        </Typography>
                      </Stack>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            )}

            {/* Apply Now CTA */}
            {(college.website || college.email) && (
              <Card elevation={2}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Typography variant="h6" fontWeight={600} component="h2">
                    Interested in {college.name}?
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Take the next step in your educational journey
                  </Typography>
                  <Stack spacing={1.5}>
                    {college.website && (
                      <Button
                        component="a"
                        href={college.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="contained"
                        fullWidth
                        startIcon={<OpenInNew />}
                      >
                        Visit College Website
                      </Button>
                    )}
                    {college.email && (
                      <Button
                        component="a"
                        href={`mailto:${college.email}`}
                        variant="outlined"
                        fullWidth
                        startIcon={<Email />}
                      >
                        Contact Admissions
                      </Button>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            )}
          </Stack>
        </Box>
      </Box>
    </Container>
  )
}

export default CollegeDetails