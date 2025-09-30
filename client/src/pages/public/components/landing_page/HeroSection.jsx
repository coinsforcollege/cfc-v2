import { ArrowForward } from '@mui/icons-material'
import { alpha, Box, Button, Container, Stack, Typography } from '@mui/material'
import React from 'react'
import { Link } from 'react-router'

function HeroSection({ theme, studentCount, setStudentCount }) {

  return (
    <Box sx={{ background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`, pt: { xs: 8, md: 12 }, pb: 12, position: 'relative', overflow: 'hidden' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
              fontWeight: 700,
              mb: 2,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text', 
              maxWidth: '800px',
              mx: 'auto'
            }}
          >
            Start Mining Your College Token Today
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ mb: 4, maxWidth: '800px', mx: 'auto' }}>
            Join thousands of students building the future of college tokens
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" sx={{ mb: 6 }}>
            <Button
              component={Link}
              to="/auth/register/student"
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              sx={{ py: 1.5, px: 4, fontSize: '1.1rem', textTransform: 'none', fontWeight: 600 }}
            >
              Join as Student
            </Button>
            <Button
              component={Link}
              to="/auth/register/admin"
              variant="outlined"
              size="large"
              sx={{ py: 1.5, px: 4, fontSize: '1.1rem', textTransform: 'none', fontWeight: 600 }}
            >
              Join as College
            </Button>
          </Stack>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              px: 3,
              py: 1.5,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              borderRadius: 50,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: 'success.main',
                animation: 'pulse 2s infinite', '@keyframes pulse': { '0%, 100%': { opacity: 1 }, '50%': { opacity: 0.5 } }
              }} />
            <Typography variant="body1" fontWeight={600}>
              {studentCount.toLocaleString()} students mining now
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default HeroSection