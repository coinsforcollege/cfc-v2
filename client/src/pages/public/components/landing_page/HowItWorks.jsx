import { Avatar, Box, Card, Container, Grid, Stack, Typography, alpha } from '@mui/material'
import React from 'react'

function HowItWorks({ theme }) {
  return (
    <Box sx={{ bgcolor: alpha(theme.palette.primary.main, 0.03), py: 8 }}>
      <Container maxWidth="lg">
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
          How It Works
        </Typography>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card elevation={3} sx={{ height: '100%', p: 3 }}>
              <Typography sx={{ typography: { xs: 'h5', md: 'h4' } }} color="primary" gutterBottom>For Students</Typography>
              <Stack spacing={3} sx={{ mt: 3 }}>
                {[{ step: '1', title: 'Sign Up', desc: 'Create your account with your college email' }, { step: '2', title: 'Select College', desc: 'Choose your college from our list' }, { step: '3', title: 'Start Mining', desc: 'Begin earning tokens for your college daily' }].map((item) => (
                  <Box key={item.step} sx={{ display: 'flex', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48, fontWeight: 600, fontSize: '1.2rem' }}>{item.step}</Avatar>
                    <Box>
                      <Typography variant="h6">{item.title}</Typography>
                      <Typography variant="body2" color="text.secondary">{item.desc}</Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card elevation={3} sx={{ height: '100%', p: 3 }}>
              <Typography sx={{ typography: { xs: 'h5', md: 'h4' } }} color="secondary" gutterBottom>For Colleges</Typography>
              <Stack spacing={3} sx={{ mt: 3 }}>
                {[{ step: '1', title: 'Register', desc: 'Sign up with your official college email' }, { step: '2', title: 'Setup Profile', desc: 'Add your college information and branding' }, { step: '3', title: 'Configure Token', desc: 'Set up your college token parameters' }].map((item) => (
                  <Box key={item.step} sx={{ display: 'flex', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'secondary.main', width: 48, height: 48, fontWeight: 600, fontSize: '1.2rem' }}>{item.step}</Avatar>
                    <Box>
                      <Typography variant="h6">{item.title}</Typography>
                      <Typography variant="body2" color="text.secondary">{item.desc}</Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default HowItWorks