import { CheckCircle, Settings, TrendingUp, Verified } from '@mui/icons-material';
import { Avatar, Box, Card, Chip, Container, Grid, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, alpha, useMediaQuery, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import CallToAction from './components/landing_page/CallToAction';
import HeroSection from './components/landing_page/HeroSection';
import Statistics from './components/landing_page/Statistics';
import HowItWorks from './components/landing_page/HowItWorks';
import LeaderBoard from './components/landing_page/LeaderBoard';
import ActivityFeed from './components/landing_page/ActivityFeed';

const generateMockActivities = () => [
  { id: 1, name: 'Sarah M.', college: 'MIT', action: 'started mining' },
  { id: 2, name: 'John D.', college: 'Stanford', action: 'started mining' },
  { id: 3, college: 'Harvard University', action: 'joined the waitlist' },
  { id: 4, name: 'Emily R.', college: 'UC Berkeley', action: 'started mining' },
  { id: 5, college: 'Yale University', action: 'joined the waitlist' },
];

const generateMockColleges = () => [
  { rank: 1, name: 'MIT', students: 2847, growth: '+234', status: 'Token Configured' },
  { rank: 2, name: 'Stanford University', students: 2653, growth: '+198', status: 'Admin Verified' },
  { rank: 3, name: 'Harvard University', students: 2401, growth: '+176', status: 'Token Configured' },
  { rank: 4, name: 'UC Berkeley', students: 2287, growth: '+203', status: 'Admin Verified' },
  { rank: 5, name: 'Princeton University', students: 1923, growth: '+145', status: 'Students Only' },
  { rank: 6, name: 'Yale University', students: 1876, growth: '+132', status: 'Admin Verified' },
  { rank: 7, name: 'Columbia University', students: 1654, growth: '+128', status: 'Students Only' },
  { rank: 8, name: 'Cornell University', students: 1543, growth: '+115', status: 'Token Configured' },
  { rank: 9, name: 'University of Chicago', students: 1432, growth: '+98', status: 'Students Only' },
  { rank: 10, name: 'CalTech', students: 1289, growth: '+87', status: 'Admin Verified' },
];

function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [studentCount, setStudentCount] = useState(12847);
  const [collegeCount] = useState(234);
  const [countryCount] = useState(28);
  const [activities, setActivities] = useState(generateMockActivities());
  const [topColleges] = useState(generateMockColleges());

  useEffect(() => {
    const interval = setInterval(() => {
      setStudentCount(prev => prev + Math.floor(Math.random() * 3));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActivities(generateMockActivities());
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box>
      {/* Hero Section */}
      <HeroSection
        studentCount={studentCount}
        setStudentCount={setStudentCount}
        theme={theme}
      />

      {/* Statistics */}
      <Statistics
        studentCount={studentCount}
        collegeCount={collegeCount}
        countryCount={countryCount}
        theme={theme}
      />

      {/* Activity Feed */}
      <ActivityFeed theme={theme} activities={activities} />

      {/* Leaderboard */}
      <LeaderBoard theme={theme} topColleges={topColleges} />

      {/* How It Works */}
      <HowItWorks theme={theme} />

      {/* CTA */}
      <CallToAction theme={theme} />
    </Box>
  );
}

export default Home;
