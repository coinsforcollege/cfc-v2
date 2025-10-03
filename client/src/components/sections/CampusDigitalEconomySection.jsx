import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Box, Container, Typography, Card, CardContent, Chip, Grid } from '@mui/material';
import { 
  AccountBalanceWallet, 
  CreditCard, 
  ShoppingCart, 
  School,
  Event,
  Sports,
  Store,
  Payment
} from '@mui/icons-material';

const CampusDigitalEconomySection = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const features = [
    {
      icon: AccountBalanceWallet,
      title: 'Campus Wallet System',
      description: 'White-label wallet for students, faculty, and alumni. Send, receive, store tokens and digital credentials in one interface.',
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
      image: '/src/assets/blockchain-development-dark-purple-bg-vector.jpg'
    },
    {
      icon: Event,
      title: 'Event & Sports Ticketing',
      description: 'On-chain ticketing for campus events and sports. Secure, transparent, and fraud-proof ticket management.',
      color: '#ec4899',
      gradient: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
      image: '/src/assets/students-working-study-group.jpg'
    },
    {
      icon: ShoppingCart,
      title: 'Campus Commerce',
      description: 'Merchandise purchases with token discounts. Support for student-run businesses accepting campus currency.',
      color: '#06b6d4',
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
      image: '/src/assets/hero-digital-economy.jpg'
    },
    {
      icon: Payment,
      title: 'Tuition & Fee Settlement',
      description: 'Accept stablecoins or convert fiat to tokens. Reduce transaction costs and settlement delays.',
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      image: '/src/assets/large-modern-office-building.jpg'
    }
  ];

  const utilities = [
    { icon: School, text: 'Integration with existing campus card systems' },
    { icon: Sports, text: 'Sports ticketing with dynamic pricing' },
    { icon: Store, text: 'Student business marketplace' },
    { icon: CreditCard, text: 'Fiat-to-token conversion' }
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
              label="Campus Digital Economy"
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
              Payments, Commerce, Student Enterprise
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
              Transform campus life with integrated digital payments, commerce, and student entrepreneurship
            </Typography>
          </Box>
        </motion.div>

        {/* Feature Cards */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 4, mb: 8 }}>
          {features.map((feature, index) => (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                onHoverStart={() => setHoveredCard(index)}
                onHoverEnd={() => setHoveredCard(null)}
              >
                <Card
                  sx={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '20px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    transform: hoveredCard === index ? 'translateY(-8px)' : 'translateY(0)',
                    overflow: 'hidden',
                    '&:hover': {
                      boxShadow: '0 16px 48px rgba(0, 0, 0, 0.15)',
                    },
                  }}
                >
                  {/* Image Header */}
                  <Box
                    sx={{
                      height: '120px',
                      backgroundImage: `url(${feature.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: feature.gradient,
                        opacity: 0.8,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 12,
                        left: 12,
                        width: 40,
                        height: 40,
                        borderRadius: '12px',
                        background: 'rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(20px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {React.createElement(feature.icon, { sx: { color: 'white', fontSize: '20px' } })}
                    </Box>
                  </Box>

                  <CardContent sx={{ p: 4 }}>
                    <Typography
                      sx={{
                        fontSize: '1.2rem',
                        fontWeight: 600,
                        color: '#2d3748',
                        mb: 2,
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      sx={{
                        color: '#718096',
                        fontSize: '0.9rem',
                        lineHeight: 1.5,
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
          ))}
        </Box>

        {/* Complete Campus Integration */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Box sx={{ display: 'flex', gap: 6, alignItems: 'center', flexDirection: { xs: 'column', lg: 'row' } }}>
            {/* Left Column - Integration Box */}
            <Box sx={{ flex: 1 }}>
              <Box
                sx={{
                  p: 6,
                  borderRadius: '24px',
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontSize: { xs: '1.5rem', md: '2rem' },
                    fontWeight: 700,
                    color: '#2d3748',
                    mb: 4,
                  }}
                >
                  Complete Campus Integration
                </Typography>
                
                <Box>
                  {utilities.map((utility, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '10px',
                          background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {React.createElement(utility.icon, { sx: { color: 'white', fontSize: '20px' } })}
                      </Box>
                      <Typography sx={{ color: '#4a5568', fontSize: '1rem' }}>
                        {utility.text}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>

            {/* Right Column - Image */}
            <Box sx={{ flex: 1 }}>
              <Box
                sx={{
                  width: '100%',
                  height: { xs: '300px', lg: '400px' },
                  borderRadius: '20px',
                  backgroundImage: 'url(/src/assets/large-modern-office-building.jpg)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
                  },
                }}
              />
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default CampusDigitalEconomySection;
