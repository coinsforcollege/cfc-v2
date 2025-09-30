import { Group, Public, School } from '@mui/icons-material';
import { alpha, Avatar, Card, Container, Grid, Typography } from '@mui/material';
import React from 'react';

function Statistics({ studentCount, collegeCount, countryCount, theme }) {
  const stats = [
    { icon: Group, label: 'Students Mining', value: studentCount.toLocaleString(), color: 'primary' },
    { icon: School, label: 'Colleges Participating', value: collegeCount, color: 'secondary' },
    { icon: Public, label: 'Countries', value: countryCount, color: 'success' }
  ];

  return (
    <Container sx={{ mt: -6, mb: 8, position: 'relative', zIndex: 2 }}>
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item size={{xs: 12, sm: 4}} key={index}>
            <Card
              elevation={3}
              sx={{
                height: '100%',
                textAlign: 'center',
                py: 4,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                }
              }}
            >
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  mx: 'auto',
                  mb: 2,
                  bgcolor: alpha(theme.palette[stat.color].main, 0.1),
                  color: `${stat.color}.main`
                }}
              >
                <stat.icon fontSize="large" />
              </Avatar>
              <Typography variant='h4' color={`${stat.color}.main`}>
                {stat.value}
              </Typography>
              <Typography variant="body1" color="text.secondary" fontWeight={500}>
                {stat.label}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

export default Statistics