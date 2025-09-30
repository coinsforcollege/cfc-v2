import { Avatar, Box, Container, Paper, Typography } from '@mui/material'
import React from 'react'

function ActivityFeed({ theme, activities }) {
  return (
    <Box sx={{ bgcolor: 'background.default', py: 8 }}>
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
          Live Activity Feed
        </Typography>

        <Paper elevation={3}>
          {/* <Box sx={{ maxHeight: 300, overflow: 'hidden' }}> */}
          <Box>
            {activities.map((activity, index) => (
              <Box key={activity.id} sx={{ px: 3, py: 2, borderBottom: index < activities.length - 1 ? '1px solid' : 'none', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 40, height: 40 }}>
                  {activity.name ? activity.name.charAt(0) : activity.college.charAt(0)}
                </Avatar>
                <Typography variant="body1">
                  {activity.name ? <><strong>{activity.name}</strong> from <strong>{activity.college}</strong> just {activity.action}</> : <><strong>{activity.college}</strong> just {activity.action}</>}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default ActivityFeed