import React from 'react';
import { motion } from 'framer-motion';
import { Box, Container, Typography, Button } from '@mui/material';
import { School, TrendingUp, Shield, Bolt, ArrowForward } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

const CollegeCoinsSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const features = [
    {
      icon: School,
      title: t('home.collegeCoinsSection.features.attractStudents.title'),
      description: t('home.collegeCoinsSection.features.attractStudents.desc'),
      color: '#3b82f6'
    },
    {
      icon: TrendingUp,
      title: t('home.collegeCoinsSection.features.tradeable.title'),
      description: t('home.collegeCoinsSection.features.tradeable.desc'),
      color: '#8b5cf6'
    },
    {
      icon: Shield,
      title: t('home.collegeCoinsSection.features.blockchain.title'),
      description: t('home.collegeCoinsSection.features.blockchain.desc'),
      color: '#10b981'
    },
    {
      icon: Bolt,
      title: t('home.collegeCoinsSection.features.instantDistribution.title'),
      description: t('home.collegeCoinsSection.features.instantDistribution.desc'),
      color: '#f59e0b'
    }
  ];

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
            radial-gradient(circle at 30% 20%, rgba(168, 200, 236, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 70% 80%, rgba(196, 168, 242, 0.08) 0%, transparent 50%)
          `,
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: 6, md: 8 },
            alignItems: 'center' 
          }}>
            {/* Left Column - Content */}
            <Box sx={{ flex: 1 }}>
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
                {t('home.collegeCoinsSection.title')}
              </Typography>
              
              <Typography
                sx={{
                  color: '#718096',
                  fontSize: { xs: '1.1rem', md: '1.25rem' },
                  lineHeight: 1.6,
                  mb: 4,
                }}
              >
                {t('home.collegeCoinsSection.description')}
              </Typography>

              <Box sx={{ mb: 4 }}>
                <Typography
                  sx={{
                    color: '#4a5568',
                    fontSize: '1rem',
                    mb: 2,
                    fontWeight: 500,
                  }}
                >
                  {t('home.collegeCoinsSection.perfectFor')}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {t('home.collegeCoinsSection.perfectForList', { returnObjects: true }).map((item, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #a8c8ec 0%, #c4a8f2 100%)',
                        }}
                      />
                      <Typography sx={{ color: '#718096', fontSize: '0.95rem' }}>
                        {item}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>

              <Button
                onClick={() => navigate('/college-coins')}
                endIcon={<ArrowForward />}
                sx={{
                  px: 4,
                  py: 2,
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  textTransform: 'none',
                  boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 40px rgba(139, 92, 246, 0.4)',
                  },
                }}
              >
                {t('home.collegeCoinsSection.learnMore')}
              </Button>
            </Box>

            {/* Right Column - Features Grid */}
            <Box sx={{ flex: 1 }}>
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                gap: 3 
              }}>
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Box
                      sx={{
                        p: 3,
                        borderRadius: '16px',
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: '12px',
                          background: `${feature.color}15`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 2,
                        }}
                      >
                        <feature.icon sx={{ color: feature.color, fontSize: '24px' }} />
                      </Box>
                      <Typography
                        sx={{
                          fontSize: '1.1rem',
                          fontWeight: 600,
                          color: '#1e293b',
                          mb: 1,
                        }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography
                        sx={{
                          color: '#64748b',
                          fontSize: '0.9rem',
                          lineHeight: 1.5,
                        }}
                      >
                        {feature.description}
                      </Typography>
                    </Box>
                  </motion.div>
                ))}
              </Box>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default CollegeCoinsSection;
