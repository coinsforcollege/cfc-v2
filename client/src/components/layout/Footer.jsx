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
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  const footerLinks = {
    platform: [
      { name: t('footer.intuitionExchange'), href: '/exchange' },
      { name: t('footer.collegenzBlockchain'), href: '/blockchain' },
      { name: t('footer.gasManager'), href: '/gas-manager' }
    ],
    resources: [
      { name: t('footer.documentation'), href: '/docs' },
      { name: t('footer.campusAmbassador'), href: '/ambassador/apply' },
      { name: t('footer.communityForum'), href: '/community' },
      { name: t('footer.githubRepo'), href: '/github' }
    ],
    legal: [
      { name: t('footer.privacyPolicy'), href: '/privacy' },
      { name: t('footer.termsOfService'), href: '/terms' },
      { name: t('footer.disclaimer'), href: '/things-to-know' }
    ],
    contact: [
      { name: t('footer.getHelp'), href: '/docs', icon: Email },
      { name: 'hello@coinsforcollege.com', href: 'mailto:hello@coinsforcollege.com', icon: Email },
      { name: t('footer.location'), href: '#', icon: LocationOn }
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

      <Box sx={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        width: '100%', 
        px: { xs: 2, md: 4 } 
      }}>
        {/* Main Footer Content */}
        <Box sx={{ py: 8 }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: 4, md: 6 },
            width: '100%'
          }}>
            {/* Brand Section */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
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
            </Box>

            {/* Platform Links */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
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
                  {t('footer.platform')}
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
            </Box>

            {/* Resources Links */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
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
                  {t('footer.resources')}
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
            </Box>

            {/* Legal Links */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
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
                  {t('footer.legal')}
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
            </Box>

            {/* Contact Section */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
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
                  {t('footer.contact')}
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
            </Box>
          </Box>
        </Box>

        {/* Divider */}
        <Divider sx={{ borderColor: 'rgba(139, 92, 246, 0.2)' }} />

        {/* Bottom Section */}
        <Box sx={{ py: 4 }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2
          }}>
            <Typography
              sx={{
                color: '#718096',
                fontSize: '0.9rem',
                lineHeight: 1.6
              }}
            >
              {t('footer.copyright')}
            </Typography>
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
                {t('footer.poweredBy')}
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
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
