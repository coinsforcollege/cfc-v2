import { Box, Button, Container, Stack, Typography, alpha } from '@mui/material'
import React from 'react'
import { Link } from 'react-router'

function CallToAction({ theme }) {
  return (
    <Box sx={{ py: 10, background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.6)} 0%, ${alpha(theme.palette.secondary.main, 0.6)} 100%)`, color: 'white', textAlign: 'center' }}>
      <Container maxWidth="md">
        <Typography
          variant="h3"
          align="center"
          sx={{
            mb: 4,
            typography: { xs: 'h4', md: 'h3' },
            '&&': {
              fontWeight: 700,
            }
          }}
        >
          Ready to Get Started?
        </Typography>
        <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>Join the growing community of students and colleges building the future</Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
          <Button component={Link} to="/auth/register/student" variant="contained" size="large" sx={{ bgcolor: 'white', color: 'primary.dark', py: 1.5, px: 4, fontSize: '1.1rem', textTransform: 'none', fontWeight: 600, '&:hover': { bgcolor: alpha('#ffffff', 0.9) } }}>
            Start Mining Tokens
          </Button>
          <Button component={Link} to="/browse-colleges" variant="outlined" size="large" sx={{ borderColor: 'white', color: 'white', py: 1.5, px: 4, fontSize: '1.1rem', textTransform: 'none', fontWeight: 600, '&:hover': { borderColor: 'white', bgcolor: alpha('#ffffff', 0.1) } }}>
            Browse Colleges
          </Button>
        </Stack>
      </Container>
    </Box>
  )
}

export default CallToAction