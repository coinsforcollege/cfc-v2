import { ArrowBack, Home } from '@mui/icons-material';
import { Box, Button, Container, Stack, Typography, } from '@mui/material';
import React from 'react';
import { Link } from 'react-router';

const NotFoundPage = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '4rem', md: '6rem' },
              fontWeight: 700,
              color: 'primary.main',
              mb: 2,
            }}
          >
            404
          </Typography>

          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              mb: 2,
            }}
          >
            Page Not Found
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              mb: 4,
              fontSize: '1.1rem',
            }}
          >
            The page you're looking for doesn't exist.
          </Typography>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
          >
            <Button
              component={Link}
              to="/"
              variant="contained"
              size="large"
              startIcon={<Home />}
            >
              Go Home
            </Button>

            <Button
              component={Link}
              to={-1}
              variant="outlined"
              size="large"
              startIcon={<ArrowBack />}
            >
              Go Back
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default NotFoundPage;