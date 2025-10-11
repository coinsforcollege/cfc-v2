import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress
} from '@mui/material';
import {
  TrendingUp,
  People,
  School,
  LocalFireDepartment,
  Public,
  EmojiEvents,
  Timeline,
  Token,
  Speed
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { collegesApi } from '@/api/colleges.api';
import NetworkMapSection from '@/components/sections/NetworkMapSection';

const NetworkMap = () => {
  const [globalStats, setGlobalStats] = useState(null);
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [statsRes, collegesRes] = await Promise.all([
        collegesApi.getGlobalStats(),
        collegesApi.getAll({ limit: 100 })
      ]);

      setGlobalStats(statsRes.data);
      setColleges(collegesRes.colleges);
    } catch (error) {
      console.error('Error fetching network data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate growth data by day (last 7 days)
  const growthData = useMemo(() => {
    if (!colleges.length) return [];

    // Get last 7 days
    const today = new Date();
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      last7Days.push({
        key: dayKey,
        display: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count: 0
      });
    }

    // Count colleges created on each day
    colleges.forEach(college => {
      if (!college.createdAt) return;
      const date = new Date(college.createdAt);
      if (isNaN(date.getTime())) return;
      const dayKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

      const dayData = last7Days.find(d => d.key === dayKey);
      if (dayData) {
        dayData.count++;
      }
    });

    // Calculate cumulative
    let cumulative = colleges.filter(c => {
      if (!c.createdAt) return false;
      const date = new Date(c.createdAt);
      return date < new Date(last7Days[0].key);
    }).length;

    return last7Days.map(day => {
      cumulative += day.count;
      return {
        month: day.display,
        new: day.count,
        total: cumulative
      };
    });
  }, [colleges]);

  // Calculate geographic distribution
  const geoData = useMemo(() => {
    if (!colleges.length) return [];

    const countryCount = {};
    colleges.forEach(college => {
      const country = college.country || 'Unknown';
      countryCount[country] = (countryCount[country] || 0) + 1;
    });

    return Object.entries(countryCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [colleges]);

  // Calculate status breakdown
  const statusData = useMemo(() => {
    if (!globalStats?.statusCounts) return [];

    return globalStats.statusCounts.map(item => ({
      name: item._id || 'Unknown',
      value: item.count
    }));
  }, [globalStats]);

  // Mining activity data - daily growth (last 7 days)
  const miningActivityData = useMemo(() => {
    if (!colleges.length) return [];

    // Get last 7 days
    const today = new Date();
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      last7Days.push({
        key: dayKey,
        display: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        miners: 0
      });
    }

    // Aggregate miners from colleges created on each day
    colleges.forEach(college => {
      if (!college.createdAt) return;
      const date = new Date(college.createdAt);
      if (isNaN(date.getTime())) return;
      const dayKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

      const dayData = last7Days.find(d => d.key === dayKey);
      if (dayData) {
        dayData.miners += college.stats?.totalMiners || 0;
      }
    });

    // Calculate cumulative miners from colleges before first day
    let cumulative = colleges
      .filter(c => {
        if (!c.createdAt) return false;
        const date = new Date(c.createdAt);
        return date < new Date(last7Days[0].key);
      })
      .reduce((sum, c) => sum + (c.stats?.totalMiners || 0), 0);

    return last7Days.map(day => {
      cumulative += day.miners;
      return {
        day: day.display,
        total: cumulative
      };
    });
  }, [colleges]);

  if (loading) {
    return (
      <Box sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pt: { xs: 12, md: 14 }
      }}>
        <LinearProgress sx={{ width: '50%' }} />
      </Box>
    );
  }

  const COLORS = ['#667eea', '#764ba2', '#a8c8ec', '#c4a8f2', '#f2a8c8', '#9bd6c3'];

  return (
    <Box sx={{
      minHeight: '100vh',
      background: '#f8fafc',
      pt: { xs: 12, md: 14 },
      pb: 8
    }}>
      {/* Hero Banner */}
      <Box sx={{
        background: `linear-gradient(135deg,
          rgba(155, 184, 224, 0.4) 0%,
          rgba(179, 154, 232, 0.3) 25%,
          rgba(230, 155, 184, 0.3) 50%,
          rgba(155, 214, 195, 0.3) 75%
        )`,
        py: 8,
        mb: 6
      }}>
        <Box sx={{ maxWidth: '1200px', mx: 'auto', px: '10px' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            

            {/* Hero Stats - Desktop: Flexbox row, Mobile: Auto-scroll slider showing 3 cards */}
            <Box
              sx={{
                display: { xs: 'block', sm: 'flex' },
                gap: { sm: 3 },
                width: '100%',
                overflow: { xs: 'hidden', sm: 'visible' },
                overflowX: 'hidden',
                position: 'relative'
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  width: { xs: 'max-content', sm: '100%' },
                  animation: { xs: 'scroll 20s linear infinite', sm: 'none' },
                  '@keyframes scroll': {
                    '0%': {
                      transform: 'translateX(0)'
                    },
                    '100%': {
                      transform: 'translateX(calc(-50% - 8px))'
                    }
                  }
                }}
              >
                {[
                  { icon: School, label: 'Total Colleges', value: globalStats?.global.totalColleges || 0, color: '#667eea' },
                  { icon: People, label: 'Total Miners', value: globalStats?.global.totalMiners || 0, color: '#764ba2' },
                  { icon: LocalFireDepartment, label: 'Active Sessions', value: globalStats?.global.activeMiningSessions || 0, color: '#f59e0b' },
                  { icon: Token, label: 'Tokens Mined', value: Math.round(globalStats?.global.totalTokensMined || 0).toLocaleString(), color: '#10b981' },
                  { icon: Speed, label: 'Active Miners', value: globalStats?.global.activeMiners || 0, color: '#ec4899' },
                ].map((stat, index) => (
                  <Card
                    key={index}
                    sx={{
                      flex: { xs: '0 0 25%', sm: 1 },
                      minWidth: { xs: '25%', sm: 'auto' },
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '16px',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                      textAlign: 'center'
                    }}
                  >
                    <CardContent sx={{ py: 1.5, px: 1 }}>
                      <stat.icon sx={{ fontSize: { xs: 28, sm: 40 }, color: stat.color, mb: 0.5 }} />
                      <Typography variant="h5" sx={{ fontSize: { xs: '1.25rem', sm: '2.125rem' }, fontWeight: 700, color: '#2d3748', mb: 0.25 }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="caption" sx={{ fontSize: { xs: '0.6rem', sm: '0.75rem' }, color: '#718096', lineHeight: 1.2 }}>
                        {stat.label}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
                {/* Duplicate cards for seamless loop on mobile */}
                {[
                  { icon: School, label: 'Total Colleges', value: globalStats?.global.totalColleges || 0, color: '#667eea' },
                  { icon: People, label: 'Total Miners', value: globalStats?.global.totalMiners || 0, color: '#764ba2' },
                  { icon: LocalFireDepartment, label: 'Active Sessions', value: globalStats?.global.activeMiningSessions || 0, color: '#f59e0b' },
                  { icon: Token, label: 'Tokens Mined', value: Math.round(globalStats?.global.totalTokensMined || 0).toLocaleString(), color: '#10b981' },
                  { icon: Speed, label: 'Active Miners', value: globalStats?.global.activeMiners || 0, color: '#ec4899' },
                ].map((stat, index) => (
                  <Card
                    key={`duplicate-${index}`}
                    sx={{
                      display: { xs: 'block', sm: 'none' },
                      flex: '0 0 25%',
                      minWidth: '25%',
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '16px',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                      textAlign: 'center'
                    }}
                  >
                    <CardContent sx={{ py: 1.5, px: 1 }}>
                      <stat.icon sx={{ fontSize: 28, color: stat.color, mb: 0.5 }} />
                      <Typography variant="h5" sx={{ fontSize: '1.25rem', fontWeight: 700, color: '#2d3748', mb: 0.25 }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="caption" sx={{ fontSize: '0.6rem', color: '#718096', lineHeight: 1.2 }}>
                        {stat.label}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Box>
          </motion.div>
        </Box>
      </Box>

      {/* Network Map Visualization */}
      <NetworkMapSection />

      {/* Stats and Analytics Sections */}
      <Box sx={{
        py: { xs: 8, md: 12 },
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.95) 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 20% 20%, rgba(139, 92, 246, 0.05) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.05) 0%, transparent 50%),
              radial-gradient(circle at 40% 60%, rgba(6, 182, 212, 0.05) 0%, transparent 50%)
            `,
            pointerEvents: 'none',
          }}
        />

        <Container maxWidth="lg">
          {/* Growth Metrics & Geographic Distribution */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 3 }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              style={{ flex: 1 }}
            >
              <Card sx={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '20px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                p: 3,
                height: '100%'
              }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, color: '#2d3748' }}>
                  Network Growth
                </Typography>
                {growthData.length > 0 ? (
                  <Box sx={{ height: '300px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={growthData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                        <XAxis dataKey="month" stroke="#718096" style={{ fontSize: '12px' }} />
                        <YAxis stroke="#718096" style={{ fontSize: '12px' }} />
                        <Tooltip contentStyle={{
                          background: 'rgba(255, 255, 255, 0.95)',
                          border: '1px solid rgba(139, 92, 246, 0.2)',
                          borderRadius: '8px'
                        }} />
                        <Area type="monotone" dataKey="total" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} name="Total Colleges" />
                        <Area type="monotone" dataKey="new" stroke="#ec4899" fill="#ec4899" fillOpacity={0.4} name="New Colleges" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Box>
                ) : (
                  <Box sx={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography color="text.secondary">No data available</Typography>
                  </Box>
                )}
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              style={{ flex: 1 }}
            >
              <Card sx={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '20px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                p: 3,
                height: '100%'
              }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, color: '#2d3748' }}>
                  Geographic Distribution
                </Typography>
                {geoData.length > 0 ? (
                  <Box sx={{ height: '300px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={geoData.slice(0, 6)}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {geoData.slice(0, 6).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{
                          background: 'rgba(255, 255, 255, 0.95)',
                          border: '1px solid rgba(139, 92, 246, 0.2)',
                          borderRadius: '8px'
                        }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                ) : (
                  <Box sx={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography color="text.secondary">No data available</Typography>
                  </Box>
                )}
              </Card>
            </motion.div>
          </Box>

          {/* Status Breakdown & Mining Activity */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 3 }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              style={{ flex: 1 }}
            >
              <Card sx={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '20px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                p: 3,
                height: '100%'
              }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, color: '#2d3748' }}>
                  College Status Breakdown
                </Typography>
                {statusData.length > 0 ? (
                  <Box sx={{ height: '300px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{
                          background: 'rgba(255, 255, 255, 0.95)',
                          border: '1px solid rgba(139, 92, 246, 0.2)',
                          borderRadius: '8px'
                        }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                ) : (
                  <Box sx={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography color="text.secondary">No data available</Typography>
                  </Box>
                )}
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              style={{ flex: 1 }}
            >
              <Card sx={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '20px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                p: 3,
                height: '100%'
              }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, color: '#2d3748' }}>
                  Mining Activity
                </Typography>
                {miningActivityData.length > 0 ? (
                  <Box sx={{ height: '300px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={miningActivityData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                        <XAxis dataKey="day" stroke="#718096" style={{ fontSize: '12px' }} />
                        <YAxis stroke="#718096" style={{ fontSize: '12px' }} />
                        <Tooltip contentStyle={{
                          background: 'rgba(255, 255, 255, 0.95)',
                          border: '1px solid rgba(139, 92, 246, 0.2)',
                          borderRadius: '8px'
                        }} />
                        <Area type="monotone" dataKey="total" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Total Miners" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Box>
                ) : (
                  <Box sx={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography color="text.secondary">No data available</Typography>
                  </Box>
                )}
              </Card>
            </motion.div>
          </Box>

          {/* Top Performers Table */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Card sx={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '20px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
              mb: 3
            }}>
              <CardContent sx={{ p: 0 }}>
                {/* Table Title */}
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 3,
                  borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%)',
                }}>
                  <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#2d3748', flex: 1 }}>
                    Top Performing Colleges
                  </Typography>
                </Box>

                {/* Table Header Row */}
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  px: 3,
                  py: 2,
                  borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                  background: '#f8fafc'
                }}>
                  <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: '#475569', minWidth: '40px' }}>
                    Rank
                  </Typography>
                  <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: '#475569', flex: 1, mx: 2 }}>
                    College
                  </Typography>
                  <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: '#475569', flex: 1, px: 2 }}>
                    Supporters
                  </Typography>
                  <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: '#475569', minWidth: '100px' }}>
                    Status
                  </Typography>
                </Box>

                {/* Table Content */}
                <Box sx={{ px: 3 }}>
                  {colleges.slice(0, 10).map((college, index) => {
                    const supporters = college.stats?.totalMiners || 0;
                    const maxSupporters = Math.max(...colleges.map(c => c.stats?.totalMiners || 0));
                    const progressPercentage = maxSupporters > 0 ? (supporters / maxSupporters) * 100 : 0;

                    return (
                      <motion.div
                        key={college._id}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                        viewport={{ once: true }}
                      >
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          py: 2.5,
                          borderBottom: index < 9 ? '1px solid rgba(0, 0, 0, 0.05)' : 'none',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            background: 'rgba(139, 92, 246, 0.02)',
                          }
                        }}>
                          {/* Rank */}
                          <Typography sx={{
                            fontSize: '1.2rem',
                            fontWeight: 700,
                            color: '#8b5cf6',
                            minWidth: '40px'
                          }}>
                            #{index + 1}
                          </Typography>

                          {/* College Name */}
                          <Box sx={{ flex: 1, mx: 2 }}>
                            <Typography sx={{ fontWeight: 600, color: '#2d3748' }}>
                              {college.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#718096' }}>
                              {college.country || 'N/A'}
                            </Typography>
                          </Box>

                          {/* Progress Bar */}
                          <Box sx={{ flex: 1, px: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Box sx={{
                                flex: 1,
                                height: 8,
                                borderRadius: '4px',
                                background: 'rgba(139, 92, 246, 0.1)',
                                overflow: 'hidden',
                              }}>
                                <motion.div
                                  initial={{ width: 0 }}
                                  whileInView={{ width: `${progressPercentage}%` }}
                                  transition={{ duration: 1, delay: index * 0.1 }}
                                  viewport={{ once: true }}
                                  style={{
                                    height: '100%',
                                    background: 'linear-gradient(90deg, #8b5cf6 0%, #ec4899 100%)',
                                    borderRadius: '4px',
                                  }}
                                />
                              </Box>
                              <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#8b5cf6', minWidth: '60px' }}>
                                {supporters.toLocaleString()}
                              </Typography>
                            </Box>
                          </Box>

                          {/* Status */}
                          <Chip
                            label={college.status || 'Unknown'}
                            sx={{
                              background:
                                college.status === 'Live' ? '#10b981' :
                                college.status === 'Waitlist' || college.status === 'Building' ? '#f59e0b' :
                                '#6b7280',
                              color: 'white',
                              fontWeight: 600,
                              fontSize: '0.8rem',
                            }}
                          />
                        </Box>
                      </motion.div>
                    );
                  })}
                </Box>
              </CardContent>
            </Card>
          </motion.div>

        </Container>
      </Box>
    </Box>
  );
};

export default NetworkMap;
