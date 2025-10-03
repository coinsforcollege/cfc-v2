import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Container, Typography, Card, CardContent, Chip, Stack, IconButton } from '@mui/material';
import { 
  TrendingUp, 
  Layers, 
  AccountBalance, 
  ArrowForward,
  ArrowBack,
  Star,
  People,
  AttachMoney,
  Timeline,
  Security,
  Visibility
} from '@mui/icons-material';

const FundraisingSection = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);

  const features = [
    {
      icon: TrendingUp,
      title: 'Alumni Giving Portal',
      description: 'Direct blockchain donations with real-time fund tracking. Donors see exactly how their contributions are deployed.',
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
      stats: { amount: '$2.4M', donors: '1,247', projects: '23' },
      image: '/src/assets/blockchain-development-dark-purple-bg-vector.jpg'
    },
    {
      icon: Layers,
      title: 'NFT-Backed Endowments',
      description: 'Create digital legacy collectibles for major gifts. Build prestige while strengthening long-term alumni relationships.',
      color: '#ec4899',
      gradient: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
      stats: { nfts: '156', value: '$890K', collectors: '89' },
      image: '/src/assets/hero-digital-economy.jpg'
    },
    {
      icon: AccountBalance,
      title: 'InTuition Exchange Listing',
      description: 'Every college token automatically lists on our exchange. Enable liquidity, fundraising, and secondary market activity from day one.',
      color: '#06b6d4',
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
      stats: { volume: '$1.2M', trades: '3,456', liquidity: '98%' },
      image: '/src/assets/students-working-study-group.jpg'
    }
  ];

  const testimonials = [
    {
      name: 'Dr. Sarah Chen',
      role: 'VP Development, MIT',
      quote: 'The transparency in our alumni giving has increased donations by 340%. Donors love seeing exactly where their money goes.',
      avatar: 'SC',
      amount: '$2.4M raised'
    },
    {
      name: 'Michael Rodriguez',
      role: 'Alumni Relations, Stanford',
      quote: 'NFT endowments have created a new generation of digital philanthropists. Our major gift program has never been stronger.',
      avatar: 'MR',
      amount: '$890K in NFTs'
    },
    {
      name: 'Dr. Priya Patel',
      role: 'CFO, IIT Bombay',
      quote: 'The exchange listing gave us instant liquidity and credibility. Our token became a legitimate asset class overnight.',
      avatar: 'PP',
      amount: '$1.2M volume'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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

        {/* 2-Column Layout: Slider + Text */}
        <Box sx={{ display: 'flex', gap: 6, mb: 8, flexDirection: { xs: 'column', lg: 'row' }, alignItems: { xs: 'stretch', lg: 'center' } }}>
          {/* Left: Slider */}
          <Box sx={{ flex: 1, minHeight: { xs: '300px', md: '400px' } }}>
            <Box sx={{ position: 'relative', height: { xs: '300px', md: '400px' }, overflow: 'hidden', borderRadius: '20px' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSlide}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      background: features[activeSlide].gradient,
                      borderRadius: '20px',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <Box>
                        {/* Image */}
                        <Box
                          sx={{
                            width: '100%',
                            height: '120px',
                            borderRadius: '12px',
                            backgroundImage: `url(${features[activeSlide].image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            mb: 3,
                          }}
                        />
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                          <Box
                            sx={{
                              width: 60,
                              height: 60,
                              borderRadius: '16px',
                              background: 'rgba(255, 255, 255, 0.2)',
                              backdropFilter: 'blur(20px)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            {React.createElement(features[activeSlide].icon, { sx: { color: 'white', fontSize: '28px' } })}
                          </Box>
                          <Box>
                            <Typography
                              variant="h4"
                              sx={{
                                fontSize: { xs: '1.5rem', md: '1.8rem' },
                                fontWeight: 700,
                                color: 'white',
                                mb: 1,
                              }}
                            >
                              {features[activeSlide].title}
                            </Typography>
                            <Typography
                              sx={{
                                color: 'rgba(255, 255, 255, 0.9)',
                                fontSize: '1rem',
                                lineHeight: 1.5,
                              }}
                            >
                              {features[activeSlide].description}
                            </Typography>
                          </Box>
                        </Box>

                        {/* Stats */}
                        <Box sx={{ display: 'flex', gap: 3 }}>
                          {Object.entries(features[activeSlide].stats).map(([key, value], index) => (
                            <motion.div
                              key={key}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                              <Box
                                sx={{
                                  background: 'rgba(255, 255, 255, 0.15)',
                                  backdropFilter: 'blur(20px)',
                                  borderRadius: '12px',
                                  p: 2,
                                  textAlign: 'center',
                                  minWidth: '100px',
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontSize: '1.2rem',
                                    fontWeight: 700,
                                    color: 'white',
                                    mb: 0.5,
                                  }}
                                >
                                  {value}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: '0.75rem',
                                    color: 'rgba(255, 255, 255, 0.8)',
                                    textTransform: 'capitalize',
                                  }}
                                >
                                  {key}
                                </Typography>
                              </Box>
                            </motion.div>
                          ))}
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <Box sx={{ position: 'absolute', bottom: 4, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 2 }}>
                {features.map((_, index) => (
                  <Box
                    key={index}
                    onClick={() => setActiveSlide(index)}
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: index === activeSlide ? 'white' : 'rgba(255, 255, 255, 0.4)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'white',
                        transform: 'scale(1.2)',
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Box>

          {/* Right: Existing Text */}
          <Box sx={{ flex: 1, textAlign: { xs: 'center', lg: 'left' } }}>
            <Chip
              label="Fundraising & Alumni Engagement"
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
              Transparent Capital, Digital Legacy
            </Typography>
            <Typography
              sx={{
                color: '#718096',
                fontSize: { xs: '1.1rem', md: '1.25rem' },
                lineHeight: 1.6,
                maxWidth: '700px',
                mx: { xs: 'auto', lg: 0 },
              }}
            >
              Revolutionize alumni engagement with blockchain transparency and digital collectibles
            </Typography>
          </Box>
        </Box>

        {/* Implementation Steps */}
        <Box sx={{ mb: 8 }}>
          <Typography
            variant="h3"
            sx={{
              fontSize: { xs: '1.8rem', md: '2.2rem' },
              fontWeight: 700,
              color: '#2d3748',
              mb: 4,
              textAlign: 'center',
            }}
          >
            Simple 3-Step Implementation
          </Typography>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 4 }}>
            {[
              {
                step: '01',
                title: 'Connect Your Systems',
                description: 'Integrate with existing alumni databases and payment systems in under 24 hours.',
                icon: Security,
                color: '#8b5cf6',
                gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                image: '/src/assets/blockchain-development-dark-purple-bg-vector.jpg',
              },
              {
                step: '02',
                title: 'Launch Token Economy',
                description: 'Deploy your custom token with smart contracts and governance structures.',
                icon: Timeline,
                color: '#ec4899',
                gradient: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
                image: '/src/assets/hero-digital-economy.jpg',
              },
              {
                step: '03',
                title: 'Engage Alumni',
                description: 'Start fundraising campaigns and watch real-time impact tracking.',
                icon: People,
                color: '#06b6d4',
                gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                image: '/src/assets/students-working-study-group.jpg',
              }
            ].map((step, index) => (
              <motion.div
                key={index}
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
                      backgroundImage: `url(${step.image})`,
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
                        background: step.gradient,
                        opacity: 0.8,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.9)',
                        color: step.color,
                        fontSize: '0.875rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      {step.step}
                    </Box>
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
                      {React.createElement(step.icon, { sx: { color: 'white', fontSize: '20px' } })}
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
                      {step.title}
                    </Typography>
                    <Typography
                      sx={{
                        color: '#718096',
                        fontSize: '0.9rem',
                        lineHeight: 1.5,
                        mb: 3,
                      }}
                    >
                      {step.description}
                    </Typography>

                    {/* Progress Indicator */}
                    <Box>
                      <Box
                        sx={{
                          height: 4,
                          borderRadius: '2px',
                          background: 'rgba(0, 0, 0, 0.1)',
                          overflow: 'hidden',
                        }}
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: '100%' }}
                          transition={{ duration: 1, delay: index * 0.2 }}
                          viewport={{ once: true }}
                          style={{
                            height: '100%',
                            background: step.gradient,
                            borderRadius: '2px',
                          }}
                        />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Box>
        </Box>


        {/* Testimonials Slider */}
        <Box sx={{ mb: 8 }}>
          <Typography
            variant="h3"
            sx={{
              fontSize: { xs: '1.8rem', md: '2.2rem' },
              fontWeight: 700,
              color: '#2d3748',
              mb: 4,
              textAlign: 'center',
            }}
          >
            What Leaders Are Saying
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 4, overflowX: 'auto', pb: 2, alignItems: 'stretch', '&::-webkit-scrollbar': { display: 'none' } }}>
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card
                  sx={{
                    minWidth: '350px',
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '20px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    p: 4,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '1.1rem',
                      }}
                    >
                      {testimonial.avatar}
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 600, color: '#2d3748', mb: 0.5 }}>
                        {testimonial.name}
                      </Typography>
                      <Typography sx={{ fontSize: '0.9rem', color: '#718096' }}>
                        {testimonial.role}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Typography
                    sx={{
                      color: '#4a5568',
                      fontSize: '1rem',
                      lineHeight: 1.6,
                      mb: 3,
                      fontStyle: 'italic',
                      flex: 1,
                    }}
                  >
                    "{testimonial.quote}"
                  </Typography>
                  
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      p: 2,
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                      color: 'white',
                      mt: 'auto',
                    }}
                  >
                    <AttachMoney sx={{ fontSize: '20px' }} />
                    <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                      {testimonial.amount}
                    </Typography>
                  </Box>
                </Card>
              </motion.div>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default FundraisingSection;
