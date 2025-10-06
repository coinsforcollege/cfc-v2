import React from 'react';
import { Box, Container, Typography, Grid, Link, IconButton, Divider } from '@mui/material';
import { 
  Facebook, 
  Twitter, 
  LinkedIn, 
  GitHub, 
  Email, 
  Phone, 
  LocationOn,
  ArrowForward,
  School,
  Code,
  Security,
  Rocket
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const Footer = () => {
  const footerLinks = {
    platform: [
      { name: 'InTuition Exchange', href: '/exchange' },
      { name: 'Collegen Blockchain', href: '/blockchain' },
      { name: 'Gas Manager', href: '/gas-manager' }
    ],
    resources: [
      { name: 'Documentation', href: '/docs' },
      { name: 'Campus Ambassador Portal', href: '/ambassador/apply' },
      { name: 'Community Forum', href: '/community' },
      { name: 'GitHub Repository', href: '/github' }
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Disclaimer', href: '/disclaimer' }
    ],
    contact: [
      { name: 'hello@coinsforcollege.com', href: 'mailto:hello@coinsforcollege.com', icon: Email },
      { name: 'San Francisco, CA', href: '#', icon: LocationOn }
    ]
  };

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'LinkedIn', icon: LinkedIn, href: '#' },
    { name: 'GitHub', icon: GitHub, href: '#' }
  ];

  return (
    <Box
      component="footer"
      sx={{
        background: `
          linear-gradient(135deg, 
            rgba(139, 92, 246, 0.05) 0%, 
            rgba(236, 72, 153, 0.05) 25%,
            rgba(78, 205, 196, 0.05) 50%,
            rgba(69, 183, 209, 0.05) 75%,
            rgba(139, 92, 246, 0.05) 100%
          )
        `,
        borderTop: '1px solid rgba(139, 92, 246, 0.1)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        {/* Main Footer Content */}
        <Box sx={{ py: 8 }}>
          <Grid container spacing={6}>
            {/* Brand Section */}
            <Grid item xs={12} sm={4} md={2.4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: '#2d3748',
                      mb: 3,
                      background: 'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 50%, #45b7d1 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      fontSize: '1.2rem'
                    }}
                  >
                    COINS FOR COLLEGE
                  </Typography>
                  
                  {/* Social Links */}
                  <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    {socialLinks.map((social, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.1, y: -2 }}
                        transition={{ duration: 0.2 }}
                      >
                        <IconButton
                          component={Link}
                          href={social.href}
                          sx={{
                            background: 'rgba(255, 255, 255, 0.8)',
                            border: '1px solid rgba(139, 92, 246, 0.2)',
                            '&:hover': {
                              background: 'rgba(139, 92, 246, 0.1)',
                              borderColor: 'rgba(139, 92, 246, 0.4)',
                            }
                          }}
                        >
                          {React.createElement(social.icon, { sx: { color: '#8b5cf6', fontSize: '20px' } })}
                        </IconButton>
                      </motion.div>
                    ))}
                  </Box>
                </Box>
              </motion.div>
            </Grid>

            {/* Platform Links */}
            <Grid item xs={12} sm={4} md={2.4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: '#2d3748',
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <Rocket sx={{ color: '#8b5cf6', fontSize: '20px' }} />
                  Platform
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {footerLinks.platform.map((link, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link
                        href={link.href}
                        sx={{
                          color: '#718096',
                          textDecoration: 'none',
                          fontSize: '0.95rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          '&:hover': {
                            color: '#8b5cf6',
                          }
                        }}
                      >
                        <ArrowForward sx={{ fontSize: '16px' }} />
                        {link.name}
                      </Link>
                    </motion.div>
                  ))}
                </Box>
              </motion.div>
            </Grid>

            {/* Resources Links */}
            <Grid item xs={12} sm={4} md={2.4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: '#2d3748',
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <Code sx={{ color: '#ec4899', fontSize: '20px' }} />
                  Resources
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {footerLinks.resources.map((link, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link
                        href={link.href}
                        sx={{
                          color: '#718096',
                          textDecoration: 'none',
                          fontSize: '0.95rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          '&:hover': {
                            color: '#ec4899',
                          }
                        }}
                      >
                        <ArrowForward sx={{ fontSize: '16px' }} />
                        {link.name}
                      </Link>
                    </motion.div>
                  ))}
                </Box>
              </motion.div>
            </Grid>

            {/* Legal Links */}
            <Grid item xs={12} sm={6} md={2.4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: '#2d3748',
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <Security sx={{ color: '#4ecdc4', fontSize: '20px' }} />
                  Legal
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {footerLinks.legal.map((link, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link
                        href={link.href}
                        sx={{
                          color: '#718096',
                          textDecoration: 'none',
                          fontSize: '0.95rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          '&:hover': {
                            color: '#4ecdc4',
                          }
                        }}
                      >
                        <ArrowForward sx={{ fontSize: '16px' }} />
                        {link.name}
                      </Link>
                    </motion.div>
                  ))}
                </Box>
              </motion.div>
            </Grid>

            {/* Contact Section */}
            <Grid item xs={12} sm={6} md={2.4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: '#2d3748',
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <School sx={{ color: '#45b7d1', fontSize: '20px' }} />
                  Contact
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {footerLinks.contact.map((link, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link
                        href={link.href}
                        sx={{
                          color: '#718096',
                          textDecoration: 'none',
                          fontSize: '0.95rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          '&:hover': {
                            color: '#45b7d1',
                          }
                        }}
                      >
                        {React.createElement(link.icon, { sx: { fontSize: '16px' } })}
                        {link.name}
                      </Link>
                    </motion.div>
                  ))}
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Box>

        {/* Divider */}
        <Divider sx={{ borderColor: 'rgba(139, 92, 246, 0.2)' }} />

        {/* Bottom Section */}
        <Box sx={{ py: 4 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                sx={{
                  color: '#718096',
                  fontSize: '0.9rem',
                  lineHeight: 1.6
                }}
              >
                © 2024 Coins For College. All rights reserved. Token release subject to KYC verification 
                and proof of college association. Mining rates and conversion ratios determined by 
                individual college allocation policies.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: { xs: 'center', md: 'flex-end' },
                alignItems: 'center',
                gap: 2
              }}>
                <Typography
                  sx={{
                    color: '#718096',
                    fontSize: '0.9rem',
                    fontWeight: 500
                  }}
                >
                  Powered by
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    component="img"
                    src="/images/collegen-icon.svg"
                    sx={{ width: 24, height: 24 }}
                  />
                  <Typography
                    sx={{
                      color: '#8b5cf6',
                      fontSize: '0.9rem',
                      fontWeight: 600
                    }}
                  >
                    Collegen L2
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
