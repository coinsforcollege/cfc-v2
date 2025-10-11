import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Box, Container, Typography, Card, CardContent, Chip, Avatar } from '@mui/material';
import { collegesApi } from '../../api/colleges.api';

const TractionProofSection = () => {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const response = await collegesApi.getAll({ limit: 12, sortBy: 'miners' });
        setColleges(response.colleges);
      } catch (error) {
        console.error('Error fetching colleges:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchColleges();
  }, []);


  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'live': return '#10b981';
      case 'waitlist': return '#f59e0b';
      case 'building': return '#3b82f6';
      case 'unaffiliated': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status) => {
    if (!status) return 'Coming Soon';
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'live': return 'Live';
      case 'waitlist': return 'Waitlist';
      case 'building': return 'Building';
      case 'unaffiliated': return 'Unaffiliated';
      default: return 'Coming Soon';
    }
  };

  const getCollegeLogo = (name) => {
    const words = name.split(' ');
    if (words.length >= 2) {
      return words[0][0] + words[1][0];
    }
    return name.substring(0, 2).toUpperCase();
  };

  if (loading) {
    return null;
  }

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.95) 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Chip
              label="Traction Proof"
              sx={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                color: '#ffffff',
                fontWeight: 600,
                px: 2,
                py: 0.5,
                borderRadius: '20px',
                mb: 3,
              }}
            />
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                fontWeight: 800,
                background: 'linear-gradient(135deg, #2d3748 0%, #4a5568 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                mb: 3,
              }}
            >
              Institutions Already Moving
            </Typography>
            <Typography
              sx={{
                color: '#718096',
                fontSize: { xs: '1.1rem', md: '1.25rem' },
                lineHeight: 1.6,
                maxWidth: '700px',
                mx: 'auto',
              }}
            >
              Top universities worldwide are already building their digital economies with us
            </Typography>
          </Box>
        </motion.div>

        {/* College Table with Progress Bars */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <Card
            sx={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '20px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
              mb: 8,
            }}
          >
            <CardContent sx={{ p: 0 }}>
              {/* Table Header */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 3,
                  borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%)',
                }}
              >
                <Typography
                  sx={{
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: '#2d3748',
                    flex: 1,
                  }}
                >
                  Institution
                </Typography>
                <Typography
                  sx={{
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: '#2d3748',
                    flex: 1,
                    textAlign: 'center',
                  }}
                >
                  Early Supporters
                </Typography>
                <Typography
                  sx={{
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: '#2d3748',
                    flex: 1,
                    textAlign: 'center',
                  }}
                >
                  Status
                </Typography>
              </Box>

              {/* Table Rows */}
              {colleges.map((college, index) => {
                const supporters = college.stats?.totalMiners || 0;
                const maxSupporters = Math.max(...colleges.map(c => c.stats?.totalMiners || 0));
                const progressPercentage = maxSupporters > 0 ? (supporters / maxSupporters) * 100 : 0;
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    viewport={{ once: true }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 3,
                        borderBottom: index < colleges.length - 1 ? '1px solid rgba(0, 0, 0, 0.05)' : 'none',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'rgba(139, 92, 246, 0.02)',
                        },
                      }}
                    >
                      {/* Institution */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                        {college.logo ? (
                          <Box
                            component="img"
                            src={college.logo}
                            alt={college.name}
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: '50%',
                              objectFit: 'cover',
                            }}
                          />
                        ) : (
                          <Avatar
                            sx={{
                              width: 40,
                              height: 40,
                              background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                              color: 'white',
                              fontWeight: 700,
                              fontSize: '0.9rem',
                            }}
                          >
                            {getCollegeLogo(college.name)}
                          </Avatar>
                        )}
                        <Typography
                          sx={{
                            fontSize: '1rem',
                            fontWeight: 600,
                            color: '#2d3748',
                          }}
                        >
                          {college.name}
                        </Typography>
                      </Box>

                      {/* Progress Bar */}
                      <Box sx={{ flex: 1, px: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box
                            sx={{
                              flex: 1,
                              height: 8,
                              borderRadius: '4px',
                              background: 'rgba(139, 92, 246, 0.1)',
                              overflow: 'hidden',
                              position: 'relative',
                            }}
                          >
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
                          <Typography
                            sx={{
                              fontSize: '0.9rem',
                              fontWeight: 600,
                              color: '#8b5cf6',
                              minWidth: '60px',
                              textAlign: 'right',
                            }}
                          >
                            {supporters.toLocaleString()}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Status */}
                      <Box sx={{ flex: 1, textAlign: 'center' }}>
                        <Chip
                          label={getStatusText(college.status)}
                          sx={{
                            background: getStatusColor(college.status),
                            color: 'white',
                            fontWeight: 600,
                            fontSize: '0.8rem',
                          }}
                        />
                      </Box>
                    </Box>
                  </motion.div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>

      </Container>
    </Box>
  );
};

export default TractionProofSection;
