import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Box, Container, Typography, Card, CardContent, Chip, Button, Stack } from '@mui/material';
import { 
  Settings, 
  Support, 
  CloudDone,
  CheckCircle,
  Star,
  TrendingUp
} from '@mui/icons-material';

const OperationsModelSection = () => {
  const [selectedModel, setSelectedModel] = useState(0);

  const models = [
    {
      icon: Settings,
      title: 'Self-Managed',
      description: 'Full technical documentation and admin access. Your IT team maintains complete control.',
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
      features: [
        'Complete technical documentation',
        'Full admin access and control',
        'Your IT team manages everything',
        'Maximum customization options'
      ],
      image: '/src/assets/blockchain-development-dark-purple-bg-vector.jpg'
    },
    {
      icon: Support,
      title: 'Guided Implementation',
      description: 'Free consultation on third-party service providers. We map the architecture; you execute with vetted partners.',
      color: '#ec4899',
      gradient: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
      features: [
        'Free consultation and planning',
        'Vetted partner recommendations',
        'Architecture mapping and guidance',
        'You execute with our support'
      ],
      image: '/src/assets/hero-digital-economy.jpg'
    },
    {
      icon: CloudDone,
      title: 'Fully Managed AMC',
      description: 'We handle infrastructure, monitoring, scaling, and updates. Fixed annual contract, predictable costs.',
      color: '#06b6d4',
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
      features: [
        'Complete infrastructure management',
        '24/7 monitoring and support',
        'Automatic scaling and updates',
        'Fixed annual contract pricing'
      ],
      image: '/src/assets/large-modern-office-building.jpg'
    }
  ];

  const earlyAdopterTerms = [
    { icon: CheckCircle, text: 'Pay upfront development fee, OR' },
    { icon: Star, text: 'Allocate up to 5% of tokens to Coins For College' },
    { icon: TrendingUp, text: 'Free setup package for waitlisted institutions choosing token allocation model' }
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
              label="Your Infrastructure, Your Choice"
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
              Flexible Operations Model
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
              Choose the level of control and support that fits your institution's needs and capabilities
            </Typography>
          </Box>
        </motion.div>

        {/* Model Cards - Desktop/Tablet: 3 cards side by side, Mobile: Horizontal slider */}
        <Box sx={{ mb: 8 }}>
          {/* Desktop/Tablet Layout */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 4, alignItems: 'stretch', justifyContent: 'center' }}>
            {models.map((model, index) => {
              const isHighlighted = index === 2; // Fully Managed (index 2)
              const isLeft = index === 0;
              const isRight = index === 2;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  style={{ 
                    flex: isHighlighted ? '1.2' : '1',
                    transform: isHighlighted ? 'scale(1.05)' : 'scale(1)',
                    zIndex: isHighlighted ? 10 : 1,
                  }}
                >
                  <Card
                    sx={{
                      background: isHighlighted 
                        ? `linear-gradient(135deg, #9bb8e0 0%, #b39ae8 50%, #9bd6c3 100%)` 
                        : index === 0 
                          ? `linear-gradient(135deg, #9bb8e0 0%, #a6c8e6 100%)`
                          : index === 1 
                          ? `linear-gradient(135deg, #e69bb8 0%, #ebabc8 100%)`
                          : `linear-gradient(135deg, #9bd6c3 0%, #a6e0d1 100%)`,
                      backdropFilter: 'blur(20px)',
                      border: isHighlighted 
                        ? `2px solid rgba(255, 255, 255, 0.3)` 
                        : `1px solid rgba(255, 255, 255, 0.2)`,
                      borderRadius: '24px',
                      boxShadow: isHighlighted 
                        ? `0 15px 40px rgba(0, 0, 0, 0.2), 0 0 20px rgba(139, 92, 246, 0.3)` 
                        : `0 8px 25px rgba(0, 0, 0, 0.1), 0 0 10px rgba(139, 92, 246, 0.2)`,
                      overflow: 'hidden',
                      height: '100%',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      '&:hover': {
                        transform: isHighlighted ? 'scale(1.08) translateY(-8px)' : 'scale(1.03) translateY(-5px)',
                        boxShadow: isHighlighted 
                          ? `0 20px 50px rgba(0, 0, 0, 0.25), 0 0 30px rgba(139, 92, 246, 0.4)` 
                          : `0 12px 35px rgba(0, 0, 0, 0.15), 0 0 15px rgba(139, 92, 246, 0.3)`,
                        border: isHighlighted 
                          ? `2px solid rgba(255, 255, 255, 0.4)` 
                          : `1px solid rgba(255, 255, 255, 0.3)`,
                      },
                    }}
                  >
                    {/* Subtle Glass Reflection Effect for Highlighted Card */}
                    {isHighlighted && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, transparent 50%, rgba(255, 255, 255, 0.1) 100%)',
                          pointerEvents: 'none',
                          zIndex: 2,
                        }}
                      />
                    )}

                    {/* Colorful Accent Lines */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        background: isHighlighted 
                          ? 'linear-gradient(90deg, #9bb8e0 0%, #b39ae8 50%, #9bd6c3 100%)'
                          : index === 0 
                            ? 'linear-gradient(90deg, #9bb8e0 0%, #a6c8e6 100%)'
                            : index === 1 
                            ? 'linear-gradient(90deg, #e69bb8 0%, #ebabc8 100%)'
                            : 'linear-gradient(90deg, #9bd6c3 0%, #a6e0d1 100%)',
                        zIndex: 3,
                      }}
                    />

                    {/* Popular Badge for Highlighted Card */}
                    {isHighlighted && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 16,
                          right: 16,
                          background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                          color: 'white',
                          px: 2,
                          py: 0.5,
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          zIndex: 4,
                          boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                        }}
                      >
                        POPULAR
                      </Box>
                    )}

                    {/* Image Header */}
                    <Box
                      sx={{
                        height: isHighlighted ? '180px' : '160px',
                        backgroundImage: `url(${model.image})`,
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
                          background: isHighlighted 
                            ? `linear-gradient(135deg, ${model.color}80 0%, ${model.color}60 100%)` 
                            : `linear-gradient(135deg, ${model.color}60 0%, ${model.color}40 100%)`,
                          opacity: 0.8,
                        },
                      }}
                    >
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 16,
                          left: 16,
                          width: isHighlighted ? 60 : 50,
                          height: isHighlighted ? 60 : 50,
                          borderRadius: isHighlighted ? '16px' : '12px',
                          background: `rgba(255, 255, 255, 0.25)`,
                          backdropFilter: 'blur(20px)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: `1px solid ${model.color}40`,
                          boxShadow: `0 6px 20px rgba(0, 0, 0, 0.2)`,
                        }}
                      >
                        {React.createElement(model.icon, { 
                          sx: { 
                            color: 'white', 
                            fontSize: isHighlighted ? '28px' : '24px',
                            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                          } 
                        })}
                      </Box>
                    </Box>

                    <CardContent sx={{ p: isHighlighted ? 5 : 4, position: 'relative', zIndex: 2 }}>
                      <Typography
                        variant="h4"
                        sx={{
                          fontSize: isHighlighted ? '1.7rem' : '1.5rem',
                          fontWeight: 700,
                          color: 'white',
                          mb: 2,
                          textAlign: 'center',
                        }}
                      >
                        {model.title}
                      </Typography>
                      <Typography
                        sx={{
                          color: 'rgba(255, 255, 255, 0.9)',
                          fontSize: isHighlighted ? '1rem' : '0.95rem',
                          lineHeight: 1.5,
                          mb: 3,
                          textAlign: 'center',
                        }}
                      >
                        {model.description}
                      </Typography>

                      <Box>
                        {model.features.map((feature, featureIndex) => (
                          <Box key={featureIndex} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
                            <CheckCircle sx={{ 
                              color: 'white', 
                              fontSize: isHighlighted ? '18px' : '16px', 
                              flexShrink: 0,
                            }} />
                            <Typography sx={{ 
                              color: 'rgba(255, 255, 255, 0.95)', 
                              fontSize: isHighlighted ? '0.95rem' : '0.9rem',
                              fontWeight: isHighlighted ? 500 : 400,
                            }}>
                              {feature}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </Box>

          {/* Mobile Layout - Horizontal Slider */}
          <Box sx={{ display: { xs: 'block', md: 'none' } }}>
            <Box
              sx={{
                display: 'flex',
                gap: 3,
                overflowX: 'auto',
                pb: 2,
                '&::-webkit-scrollbar': {
                  height: '6px',
                },
                '&::-webkit-scrollbar-track': {
                  background: 'rgba(0, 0, 0, 0.1)',
                  borderRadius: '3px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                  borderRadius: '3px',
                },
              }}
            >
              {models.map((model, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  style={{ minWidth: '280px' }}
                >
                  <Card
                    sx={{
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '20px',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                      overflow: 'hidden',
                      height: '100%',
                    }}
                  >
                    {/* Image Header */}
                    <Box
                      sx={{
                        height: '140px',
                        backgroundImage: `url(${model.image})`,
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
                          background: model.gradient,
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
                          borderRadius: '10px',
                          background: 'rgba(255, 255, 255, 0.2)',
                          backdropFilter: 'blur(20px)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {React.createElement(model.icon, { sx: { color: 'white', fontSize: '20px' } })}
                      </Box>
                    </Box>

                    <CardContent sx={{ p: 3 }}>
                      <Typography
                        variant="h5"
                        sx={{
                          fontSize: '1.3rem',
                          fontWeight: 700,
                          color: '#2d3748',
                          mb: 2,
                        }}
                      >
                        {model.title}
                      </Typography>
                      <Typography
                        sx={{
                          color: '#718096',
                          fontSize: '0.9rem',
                          lineHeight: 1.4,
                          mb: 3,
                        }}
                      >
                        {model.description}
                      </Typography>

                      <Box>
                        {model.features.map((feature, featureIndex) => (
                          <Box key={featureIndex} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                            <CheckCircle sx={{ color: model.color, fontSize: '14px', flexShrink: 0 }} />
                            <Typography sx={{ color: '#4a5568', fontSize: '0.85rem' }}>
                              {feature}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Early Adopter Terms */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Box sx={{ display: 'flex', gap: 6, alignItems: 'center', flexDirection: { xs: 'column', lg: 'row' } }}>
            {/* Left Column - Image */}
            <Box sx={{ flex: 1 }}>
              <Box
                sx={{
                  width: '100%',
                  height: { xs: '300px', lg: '400px' },
                  borderRadius: '20px',
                  backgroundImage: 'url(/src/assets/students-working-study-group.jpg)',
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

            {/* Right Column - Terms Box */}
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
                    mb: 3,
                  }}
                >
                  Early Adopter Terms
                </Typography>
                <Typography
                  sx={{
                    color: '#718096',
                    fontSize: '1.1rem',
                    mb: 4,
                    lineHeight: 1.6,
                  }}
                >
                  Join the waitlist now and choose your preferred payment model
                </Typography>
                
                <Box>
                  {earlyAdopterTerms.map((term, index) => (
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
                        {React.createElement(term.icon, { sx: { color: 'white', fontSize: '20px' } })}
                      </Box>
                      <Typography sx={{ color: '#4a5568', fontSize: '1rem' }}>
                        {term.text}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default OperationsModelSection;
