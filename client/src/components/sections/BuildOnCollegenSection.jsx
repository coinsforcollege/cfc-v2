import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Box, Container, Typography, Card, CardContent, Chip, Stack, Button } from '@mui/material';
import { 
  Code, 
  Rocket, 
  School, 
  AttachMoney,
  Security,
  Speed,
  Group,
  Lightbulb,
  ArrowForward
} from '@mui/icons-material';
import { Link } from 'react-router';
import collegenIcon from '../../assets/collegen-icon-blue-transparent-bg.svg';
import dappsIcon from '../../assets/dapps-light-colored-transparent-bg.svg';

const BuildOnCollegenSection = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const features = [
    {
      icon: Code,
      title: 'Deploy dApps on Collegen L2',
      description: 'Students get access to our blockchain infrastructure with negligible gas costs. Build, test, and launch decentralized applications without financial barriers.',
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
      image: '/images/blockchain-development-dark-purple-bg-vector.jpg'
    },
    {
      icon: AttachMoney,
      title: 'Gas Manager Sponsorship',
      description: 'We sponsor transaction fees for standout projects. Demonstrate innovation and impact; we cover your deployment costs.',
      color: '#ec4899',
      gradient: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
      image: '/images/hero-digital-economy.jpg'
    },
    {
      icon: School,
      title: 'Developer Resources',
      description: 'Complete SDK, documentation, code templates, and integration guides. Regular campus hackathons with prize pools.',
      color: '#06b6d4',
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
      image: '/images/students-working-study-group.jpg'
    }
  ];

  const resources = [
    {
      icon: Code,
      title: 'Complete SDK and Documentation',
      description: 'Everything you need to start building'
    },
    {
      icon: Lightbulb,
      title: 'Code Templates and Integration Guides',
      description: 'Jumpstart your development process'
    },
    {
      icon: Group,
      title: 'Regular Campus Hackathons',
      description: 'Compete for prize pools and recognition'
    },
    {
      icon: Rocket,
      title: 'Project Grants for Transformative Ideas',
      description: 'Funding for innovative student projects'
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
              label="For Students"
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
              Build on Collegen
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
              Developer Access: Free Infrastructure for Innovation
            </Typography>
          </Box>
        </motion.div>

        {/* Main Features */}
        <Box sx={{ mb: 8 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 4 }}>
            {features.map((feature, index) => (
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
                        width: 50,
                        height: 50,
                        borderRadius: '12px',
                        background: 'rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(20px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {React.createElement(feature.icon, { sx: { color: 'white', fontSize: '24px' } })}
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
        </Box>

        {/* Developer Resources */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
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
              Developer Resources
            </Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
              {resources.map((resource, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 3,
                      p: 3,
                      borderRadius: '16px',
                      background: 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {React.createElement(resource.icon, { sx: { color: 'white', fontSize: '24px' } })}
                    </Box>
                    <Box>
                      <Typography
                        sx={{
                          fontSize: '1rem',
                          fontWeight: 600,
                          color: '#2d3748',
                          mb: 0.5,
                        }}
                      >
                        {resource.title}
                      </Typography>
                      <Typography
                        sx={{
                          color: '#718096',
                          fontSize: '0.9rem',
                        }}
                      >
                        {resource.description}
                      </Typography>
                    </Box>
                  </Box>
                </motion.div>
              ))}
            </Box>
          </Box>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              p: 6,
              borderRadius: '24px',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              flexDirection: { xs: 'column', lg: 'row' },
            }}
          >
            {/* Left: Collegen Icon */}
            <Box sx={{ flex: 1, textAlign: { xs: 'center', lg: 'left' } }}>
              <Box
                sx={{
                  width: { xs: '120px', md: '150px' },
                  height: { xs: '120px', md: '150px' },
                  mx: { xs: 'auto', lg: 0 },
                  mb: { xs: 3, lg: 0 },
                  backgroundImage: `url(${collegenIcon})`,
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              />
            </Box>

            {/* Right: Text and CTA */}
            <Box sx={{ flex: 2 }}>
              <Typography
                variant="h4"
                sx={{
                  fontSize: { xs: '1.5rem', md: '2rem' },
                  fontWeight: 700,
                  color: '#2d3748',
                  mb: 3,
                }}
              >
                Build The Next Big Thing
              </Typography>
              <Typography
                sx={{
                  color: '#718096',
                  fontSize: '1.1rem',
                  lineHeight: 1.6,
                  mb: 4,
                }}
              >
                Build your next project on Collegen with the help of your college and our gas sponsorship and take an early step towards a career that you control.
              </Typography>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  component={Link}
                  to="/auth/register/student"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                  sx={{
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                    color: '#ffffff',
                    px: 4,
                    py: 2,
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)',
                    '&:hover': {
                      boxShadow: '0 12px 40px rgba(139, 92, 246, 0.4)',
                    },
                  }}
                >
                  Start Building
                </Button>
              </motion.div>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default BuildOnCollegenSection;
