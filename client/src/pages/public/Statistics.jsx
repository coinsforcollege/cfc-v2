import {
  EmojiEvents,
  LocalFireDepartment,
  People,
  PersonAdd,
  Public,
  School,
  Settings,
  Token,
  TrendingUp,
  Verified
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';

// Mock data generators
const generateGlobalStats = () => ({
  totalStudents: 45847,
  totalColleges: 234,
  totalTokens: 12847563,
  countries: 28,
});

const generateGrowthData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return months.map((month, index) => ({
    month,
    users: Math.floor((index + 1) * 7500 + Math.random() * 2000),
    colleges: Math.floor((index + 1) * 35 + Math.random() * 10),
  }));
};

const generateTopColleges = () => {
  const colleges = [
    { name: 'MIT', fullName: 'Massachusetts Institute of Technology', state: 'MA' },
    { name: 'Stanford', fullName: 'Stanford University', state: 'CA' },
    { name: 'Harvard', fullName: 'Harvard University', state: 'MA' },
    { name: 'UC Berkeley', fullName: 'University of California, Berkeley', state: 'CA' },
    { name: 'Caltech', fullName: 'California Institute of Technology', state: 'CA' },
    { name: 'Princeton', fullName: 'Princeton University', state: 'NJ' },
    { name: 'Yale', fullName: 'Yale University', state: 'CT' },
    { name: 'Columbia', fullName: 'Columbia University', state: 'NY' },
    { name: 'UChicago', fullName: 'University of Chicago', state: 'IL' },
    { name: 'UPenn', fullName: 'University of Pennsylvania', state: 'PA' },
    { name: 'Cornell', fullName: 'Cornell University', state: 'NY' },
    { name: 'Duke', fullName: 'Duke University', state: 'NC' },
    { name: 'Northwestern', fullName: 'Northwestern University', state: 'IL' },
    { name: 'JHU', fullName: 'Johns Hopkins University', state: 'MD' },
    { name: 'UMich', fullName: 'University of Michigan', state: 'MI' },
    { name: 'NYU', fullName: 'New York University', state: 'NY' },
    { name: 'UT Austin', fullName: 'University of Texas at Austin', state: 'TX' },
    { name: 'UW', fullName: 'University of Washington', state: 'WA' },
    { name: 'Georgia Tech', fullName: 'Georgia Institute of Technology', state: 'GA' },
    { name: 'UIUC', fullName: 'University of Illinois', state: 'IL' },
  ];

  return colleges.map((college, index) => ({
    rank: index + 1,
    ...college,
    studentCount: Math.floor(Math.random() * 3000) + 1500,
    growthRate: (Math.random() * 30).toFixed(1),
    dailyActive: Math.floor(Math.random() * 2000) + 800,
  })).sort((a, b) => b.studentCount - a.studentCount);
};

const generateLiveActivities = () => {
  const activityTypes = [
    { type: 'mining', icon: <Token fontSize="small" />, color: 'primary' },
    { type: 'join', icon: <PersonAdd fontSize="small" />, color: 'success' },
    { type: 'admin', icon: <Verified fontSize="small" />, color: 'info' },
    { type: 'config', icon: <Settings fontSize="small" />, color: 'warning' },
  ];

  const firstNames = ['John', 'Sarah', 'Michael', 'Emily', 'David', 'Jessica', 'James', 'Amanda', 'Ryan', 'Lisa'];
  const lastInitials = ['S.', 'M.', 'C.', 'R.', 'L.', 'K.', 'P.', 'T.', 'W.', 'B.'];
  const colleges = ['MIT', 'Stanford', 'Harvard', 'UC Berkeley', 'Yale', 'Princeton', 'Columbia', 'Duke'];

  const messages = [
    (name, college) => `${name} from ${college} just started mining`,
    (name, college) => `${name} joined ${college}`,
    (name, college) => `${college} admin ${name} joined the platform`,
    (name, college) => `${college} just configured their token`,
  ];

  return Array.from({ length: 15 }, (_, i) => {
    const activityType = activityTypes[Math.floor(Math.random() * activityTypes.length)];
    const name = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastInitials[Math.floor(Math.random() * lastInitials.length)]}`;
    const college = colleges[Math.floor(Math.random() * colleges.length)];
    const typeIndex = activityTypes.findIndex(a => a.type === activityType.type);
    
    return {
      id: i,
      message: messages[typeIndex](name, college),
      time: `${Math.floor(Math.random() * 60)}s ago`,
      ...activityType,
    };
  });
};

const generateCountryData = () => {
  const countries = [
    'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 
    'France', 'Spain', 'Italy', 'Japan', 'South Korea', 'India', 'China',
    'Brazil', 'Mexico', 'Netherlands', 'Sweden', 'Switzerland', 'Singapore'
  ];
  
  return countries.map((country, index) => ({
    country,
    colleges: Math.floor(Math.random() * 30) + 5,
    students: Math.floor(Math.random() * 3000) + 500,
  })).sort((a, b) => b.students - a.students).slice(0, 10);
};

function Statistics() {
  const theme = useTheme();
  const [globalStats, setGlobalStats] = useState(generateGlobalStats());
  const [growthData] = useState(generateGrowthData());
  const [topColleges] = useState(generateTopColleges());
  const [liveActivities, setLiveActivities] = useState(generateLiveActivities());
  const [countryData] = useState(generateCountryData());
  const [leaderboardTab, setLeaderboardTab] = useState(0);

  // Real-time counter animation
  useEffect(() => {
    const interval = setInterval(() => {
      setGlobalStats(prev => ({
        ...prev,
        totalStudents: prev.totalStudents + Math.floor(Math.random() * 3),
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Live activity feed update
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveActivities(generateLiveActivities());
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleLeaderboardTabChange = (event, newValue) => {
    setLeaderboardTab(newValue);
  };

  const getLeaderboardData = () => {
    switch (leaderboardTab) {
      case 0: // By Student Count
        return [...topColleges].sort((a, b) => b.studentCount - a.studentCount);
      case 1: // Fastest Growing
        return [...topColleges].sort((a, b) => parseFloat(b.growthRate) - parseFloat(a.growthRate));
      case 2: // Most Active
        return [...topColleges].sort((a, b) => b.dailyActive - a.dailyActive);
      default:
        return topColleges;
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', py: { xs: 4, sm: 6 } }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Platform Statistics
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Real-time insights into the Coins for College network
          </Typography>
        </Box>

        {/* Global Network Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 6, sm: 6, md: 3 }}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                textAlign: 'center',
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
              }}
            >
              <People sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
              <Typography variant="h3" fontWeight={700} color="primary.main">
                {globalStats.totalStudents.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Students Mining
              </Typography>
              <Chip
                label="Live"
                size="small"
                color="success"
                sx={{ mt: 1, fontWeight: 600 }}
              />
            </Paper>
          </Grid>

          <Grid size={{ xs: 6, sm: 6, md: 3 }}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                textAlign: 'center',
                background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.05)} 0%, ${alpha(theme.palette.success.main, 0.1)} 100%)`,
              }}
            >
              <School sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />
              <Typography variant="h3" fontWeight={700} color="success.main">
                {globalStats.totalColleges}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Colleges Participating
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 6, sm: 6, md: 3 }}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                textAlign: 'center',
                background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.05)} 0%, ${alpha(theme.palette.warning.main, 0.1)} 100%)`,
              }}
            >
              <Token sx={{ fontSize: 48, color: 'warning.main', mb: 1 }} />
              <Typography variant="h3" fontWeight={700} color="warning.main">
                {(globalStats.totalTokens / 1000000).toFixed(1)}M
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Total Tokens Mined
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 6, sm: 6, md: 3 }}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                textAlign: 'center',
                background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
              }}
            >
              <Public sx={{ fontSize: 48, color: 'secondary.main', mb: 1 }} />
              <Typography variant="h3" fontWeight={700} color="secondary.main">
                {globalStats.countries}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Countries
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* Growth Trends */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Card elevation={2}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                  Network Growth Trends
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Growth over the last 6 months
                </Typography>

                {/* Users Growth Chart */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Total Users Over Time
                  </Typography>
                  <Box sx={{ mt: 2, position: 'relative', height: 200 }}>
                    <Stack direction="row" spacing={1} alignItems="flex-end" sx={{ height: '100%' }}>
                      {growthData.map((data, index) => (
                        <Box key={index} sx={{ flex: 1, textAlign: 'center' }}>
                          <Box
                            sx={{
                              height: `${(data.users / 50000) * 100}%`,
                              bgcolor: alpha(theme.palette.primary.main, 0.7),
                              borderRadius: '8px 8px 0 0',
                              transition: 'all 0.3s ease',
                              mb: 1,
                              '&:hover': {
                                bgcolor: theme.palette.primary.main,
                                transform: 'scaleY(1.05)',
                              },
                            }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {data.month}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Colleges Growth Chart */}
                <Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    New Colleges Joining
                  </Typography>
                  <Box sx={{ mt: 2, position: 'relative', height: 150 }}>
                    <Stack direction="row" spacing={1} alignItems="flex-end" sx={{ height: '100%' }}>
                      {growthData.map((data, index) => (
                        <Box key={index} sx={{ flex: 1, textAlign: 'center' }}>
                          <Box
                            sx={{
                              height: `${(data.colleges / 250) * 100}%`,
                              bgcolor: alpha(theme.palette.success.main, 0.7),
                              borderRadius: '8px 8px 0 0',
                              transition: 'all 0.3s ease',
                              mb: 1,
                              '&:hover': {
                                bgcolor: theme.palette.success.main,
                                transform: 'scaleY(1.05)',
                              },
                            }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {data.month}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Real-Time Activity Feed */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card elevation={2} sx={{ height: '100%' }}>
              <CardContent sx={{ p: 4 }}>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                  <LocalFireDepartment sx={{ fontSize: 32, color: 'error.main' }} />
                  <Box>
                    <Typography variant="h5" fontWeight={700}>
                      Live Activity
                    </Typography>
                    <Chip label="Real-time" size="small" color="success" sx={{ mt: 0.5 }} />
                  </Box>
                </Stack>

                <List sx={{ maxHeight: 500, overflow: 'auto' }}>
                  {liveActivities.map((activity) => (
                    <ListItem
                      key={activity.id}
                      sx={{
                        px: 0,
                        py: 1,
                        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor: alpha(theme.palette[activity.color].main, 0.1),
                            color: `${activity.color}.main`,
                            width: 40,
                            height: 40,
                          }}
                        >
                          {activity.icon}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={activity.message}
                        secondary={activity.time}
                        primaryTypographyProps={{
                          variant: 'body2',
                          fontSize: '0.875rem',
                        }}
                        secondaryTypographyProps={{
                          variant: 'caption',
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Geographic Expansion */}
          <Grid size={12}>
            <Card elevation={2}>
              <CardContent sx={{ p: 4 }}>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                  <Public sx={{ fontSize: 32, color: 'secondary.main' }} />
                  <Typography variant="h5" fontWeight={700}>
                    Geographic Expansion
                  </Typography>
                </Stack>

                <Grid container spacing={2}>
                  {countryData.map((country, index) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          bgcolor: alpha(theme.palette.primary.main, 0.02),
                          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                        }}
                      >
                        <Typography variant="body2" fontWeight={600} gutterBottom>
                          {country.country}
                        </Typography>
                        <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Colleges
                            </Typography>
                            <Typography variant="body2" fontWeight={700} color="success.main">
                              {country.colleges}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Students
                            </Typography>
                            <Typography variant="body2" fontWeight={700} color="primary.main">
                              {country.students.toLocaleString()}
                            </Typography>
                          </Box>
                        </Stack>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Top Performers Leaderboard */}
          <Grid size={12}>
            <Card elevation={2}>
              <CardContent sx={{ p: 4 }}>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                  <EmojiEvents sx={{ fontSize: 32, color: 'warning.main' }} />
                  <Typography variant="h5" fontWeight={700}>
                    Top Performing Colleges
                  </Typography>
                </Stack>

                <Tabs
                  value={leaderboardTab}
                  onChange={handleLeaderboardTabChange}
                  sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
                >
                  <Tab label="By Student Count" sx={{ textTransform: 'none', fontWeight: 600 }} />
                  <Tab label="Fastest Growing" sx={{ textTransform: 'none', fontWeight: 600 }} />
                  <Tab label="Most Active" sx={{ textTransform: 'none', fontWeight: 600 }} />
                </Tabs>

                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                        <TableCell><strong>Rank</strong></TableCell>
                        <TableCell><strong>College</strong></TableCell>
                        <TableCell><strong>Location</strong></TableCell>
                        <TableCell align="right">
                          <strong>
                            {leaderboardTab === 0 && 'Students'}
                            {leaderboardTab === 1 && 'Growth'}
                            {leaderboardTab === 2 && 'Daily Active'}
                          </strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {getLeaderboardData().map((college, index) => (
                        <TableRow
                          key={college.rank}
                          component={Link}
                          to={`/colleges/${college.rank}`}
                          sx={{
                            textDecoration: 'none',
                            cursor: 'pointer',
                            '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.05) },
                          }}
                        >
                          <TableCell>
                            <Chip
                              label={`#${index + 1}`}
                              size="small"
                              sx={{
                                fontWeight: 700,
                                bgcolor: index < 3 ? 'warning.main' : 'default',
                                color: index < 3 ? 'warning.contrastText' : 'text.primary',
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <Avatar
                                sx={{
                                  width: 32,
                                  height: 32,
                                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                                  color: 'primary.main',
                                }}
                              >
                                <School fontSize="small" />
                              </Avatar>
                              <Box>
                                <Typography variant="body2" fontWeight={600}>
                                  {college.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {college.fullName}
                                </Typography>
                              </Box>
                            </Stack>
                          </TableCell>
                          <TableCell>{college.state}</TableCell>
                          <TableCell align="right">
                            {leaderboardTab === 0 && (
                              <Typography variant="body2" fontWeight={700} color="primary.main">
                                {college.studentCount.toLocaleString()}
                              </Typography>
                            )}
                            {leaderboardTab === 1 && (
                              <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={0.5}>
                                <TrendingUp fontSize="small" color="success" />
                                <Typography variant="body2" fontWeight={700} color="success.main">
                                  +{college.growthRate}%
                                </Typography>
                              </Stack>
                            )}
                            {leaderboardTab === 2 && (
                              <Typography variant="body2" fontWeight={700} color="secondary.main">
                                {college.dailyActive.toLocaleString()}
                              </Typography>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Statistics;

