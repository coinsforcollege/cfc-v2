import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Divider,
  alpha,
  useTheme,
  Chip,
} from '@mui/material';
import {
  ExpandMore,
  TrendingUp,
  Settings,
  BarChart,
  Security,
  Group,
  School,
  ArrowForward,
  CheckCircle,
  Verified,
  Token,
  Dashboard,
  Assessment,
  Rocket,
  FlashOn,
  MonetizationOn,
  BusinessCenter,
  Public,
  Star,
  Code,
  Security as SecurityIcon,
  Speed,
  Lightbulb,
  AccountBalance,
  Timeline,
  PersonAdd,
  ContactSupport,
  Assignment,
  CardGiftcard,
  EmojiEvents,
} from '@mui/icons-material';
import { colors, gradients, spacing, typography, shadows, borderRadius } from '../../utils/designTokens';

const getSignupSteps = (t) => [
  {
    icon: School,
    title: t('howItWorksColleges.signupStep1Title'),
    description: t('howItWorksColleges.signupStep1Desc'),
    details: t('howItWorksColleges.signupStep1Details'),
    color: '#ff6b6b',
    gradient: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%)',
    image: '/images/students-working-study-group.jpg'
  },
  {
    icon: Verified,
    title: t('howItWorksColleges.signupStep2Title'),
    description: t('howItWorksColleges.signupStep2Desc'),
    details: t('howItWorksColleges.signupStep2Details'),
    color: '#4ecdc4',
    gradient: 'linear-gradient(135deg, #4ecdc4 0%, #6ee7b7 100%)',
    image: '/images/large-modern-office-building.jpg'
  },
  {
    icon: Settings,
    title: t('howItWorksColleges.signupStep3Title'),
    description: t('howItWorksColleges.signupStep3Desc'),
    details: t('howItWorksColleges.signupStep3Details'),
    color: '#45b7d1',
    gradient: 'linear-gradient(135deg, #45b7d1 0%, #7dd3fc 100%)',
    image: '/images/large-modern-office-building.jpg'
  },
  {
    icon: Token,
    title: t('howItWorksColleges.signupStep4Title'),
    description: t('howItWorksColleges.signupStep4Desc'),
    details: t('howItWorksColleges.signupStep4Details'),
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
    image: '/images/ethereum-cryptocurrency-pixel-art-illustration-600nw-2077265023.webp'
  },
];

const getBenefits = (t) => [
  {
    icon: Group,
    title: t('howItWorksColleges.benefit1Title'),
    description: t('howItWorksColleges.benefit1Desc'),
    metric: t('howItWorksColleges.benefit1Metric'),
    color: '#ff6b6b',
    gradient: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%)',
    image: '/images/students-working-study-group.jpg'
  },
  {
    icon: TrendingUp,
    title: t('howItWorksColleges.benefit2Title'),
    description: t('howItWorksColleges.benefit2Desc'),
    metric: t('howItWorksColleges.benefit2Metric'),
    color: '#4ecdc4',
    gradient: 'linear-gradient(135deg, #4ecdc4 0%, #6ee7b7 100%)',
    image: '/images/pixel-art-cherry-blossom-day-gif.gif'
  },
  {
    icon: BarChart,
    title: t('howItWorksColleges.benefit3Title'),
    description: t('howItWorksColleges.benefit3Desc'),
    metric: t('howItWorksColleges.benefit3Metric'),
    color: '#45b7d1',
    gradient: 'linear-gradient(135deg, #45b7d1 0%, #7dd3fc 100%)',
    image: '/images/akiro-art-nft-square.jpg'
  },
  {
    icon: Security,
    title: t('howItWorksColleges.benefit4Title'),
    description: t('howItWorksColleges.benefit4Desc'),
    metric: t('howItWorksColleges.benefit4Metric'),
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
    image: '/images/pixel-art-mining-cart-with-gold-icon-for-8bit-game-on-white-background-vector.jpg'
  },
];

const getFaqs = (t) => [
  {
    question: t('howItWorksColleges.faq1Question'),
    answer: t('howItWorksColleges.faq1Answer'),
  },
  {
    question: t('howItWorksColleges.faq2Question'),
    answer: t('howItWorksColleges.faq2Answer'),
  },
  {
    question: t('howItWorksColleges.faq3Question'),
    answer: t('howItWorksColleges.faq3Answer'),
  },
  {
    question: t('howItWorksColleges.faq4Question'),
    answer: t('howItWorksColleges.faq4Answer'),
  },
  {
    question: t('howItWorksColleges.faq5Question'),
    answer: t('howItWorksColleges.faq5Answer'),
  },
  {
    question: t('howItWorksColleges.faq6Question'),
    answer: t('howItWorksColleges.faq6Answer'),
  },
];

function HowItWorksColleges() {
  const theme = useTheme();
  const { t } = useTranslation();

  const signupSteps = getSignupSteps(t);
  const benefits = getBenefits(t);
  const faqs = getFaqs(t);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `
          linear-gradient(135deg, 
            rgba(255, 107, 107, 0.1) 0%, 
            rgba(78, 205, 196, 0.1) 25%,
            rgba(69, 183, 209, 0.1) 50%,
            rgba(139, 92, 246, 0.1) 75%,
            rgba(255, 107, 107, 0.1) 100%
          )
        `,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Pixel Art Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '10%',
            left: '5%',
            width: '60px',
            height: '60px',
            background: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Crect x=\'20\' y=\'20\' width=\'60\' height=\'60\' fill=\'%23ff6b6b\'/%3E%3C/svg%3E")',
            backgroundSize: 'contain',
            animation: 'float 3s ease-in-out infinite',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '20%',
            right: '10%',
            width: '40px',
            height: '40px',
            background: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Ccircle cx=\'50\' cy=\'50\' r=\'30\' fill=\'%234ecdc4\'/%3E%3C/svg%3E")',
            backgroundSize: 'contain',
            animation: 'float 2s ease-in-out infinite reverse',
          },
        }}
      />

      <Container maxWidth="lg" sx={{ pt: 8, pb: 8 }}>
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Chip
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <School sx={{ fontSize: '1rem' }} />
                  {t('howItWorksColleges.chipLabel')}
                </Box>
              }
              sx={{
                background: 'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%)',
                color: '#ffffff',
                fontWeight: 600,
                px: 2,
                py: 0.5,
                borderRadius: '20px',
                mb: 3,
                fontSize: '1rem',
              }}
            />
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '3rem', md: '3rem' },
                fontWeight: 800,
                background: 'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 50%, #45b7d1 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                mb: 3,
                textShadow: '0 4px 8px rgba(0,0,0,0.1)',
              }}
            >
              {t('howItWorksColleges.title')}
            </Typography>
            <Typography
              sx={{
                color: '#2d3748',
                fontSize: { xs: '1.2rem', md: '1.2rem' },
                lineHeight: 1.6,
                maxWidth: '800px',
                mx: 'auto',
                fontWeight: 500,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Rocket sx={{ color: '#4ecdc4', fontSize: '1.2rem' }} />
                  {t('howItWorksColleges.heroTagline1')}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FlashOn sx={{ color: '#4ecdc4', fontSize: '1.2rem' }} />
                  {t('howItWorksColleges.heroTagline2')}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Security sx={{ color: '#4ecdc4', fontSize: '1.2rem' }} />
                  {t('howItWorksColleges.heroTagline3')}
                </Box>
              </Box>
            </Typography>
          </Box>
        </motion.div>

        {/* Admin Signup Process */}
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
                fontSize: { xs: '2rem', md: '2rem' },
                fontWeight: 700,
                color: '#2d3748',
                mb: 4,
                textAlign: 'center',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center' }}>
                <Rocket sx={{ color: '#8b5cf6', fontSize: '2rem' }} />
                {t('howItWorksColleges.signupSectionTitle')}
              </Box>
            </Typography>
            <Typography
              sx={{
                color: '#718096',
                fontSize: { xs: '1.1rem', md: '1.3rem' },
                textAlign: 'center',
                mb: 6,
                maxWidth: '800px',
                mx: 'auto',
                lineHeight: 1.6,
              }}
            >
              {t('howItWorksColleges.signupSectionSubtitle')}
            </Typography>

            <Grid container spacing={4}>
              {signupSteps.map((step, index) => (
                <Grid size={{ xs: 12, md: 6 }} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.02, y: -5 }}
                  >
                    <Card
                      sx={{
                        height: '100%',
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        border: `2px solid ${step.color}30`,
                        borderRadius: '24px',
                        p: 4,
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: `0 10px 30px ${step.color}20`,
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {/* Visual Image Element */}
                      <Box
                        component="img"
                        src={step.image}
                        sx={{
                          width: '100%',
                          height: '200px',
                          objectFit: 'cover',
                          borderRadius: '16px',
                          mb: 3,
                          boxShadow: `0 8px 24px ${step.color}20`,
                        }}
                      />
                      
                      <Box>
                        <Chip
                          label={t('howItWorksColleges.stepLabel', { number: index + 1 })}
                          sx={{
                            background: step.gradient,
                            color: 'white',
                            fontWeight: 600,
                            fontSize: '0.8rem',
                            mb: 3,
                          }}
                        />
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                          <Box
                            sx={{
                              width: '80px',
                              height: '80px',
                              borderRadius: '50%',
                              background: step.gradient,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: `0 8px 24px ${step.color}40`,
                            }}
                          >
                            <step.icon sx={{ color: 'white', fontSize: '2rem' }} />
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              variant="h5"
                              sx={{
                                fontWeight: 700,
                                color: '#2d3748',
                                mb: 1,
                                fontSize: '1.3rem',
                              }}
                            >
                              {step.title}
                            </Typography>
                            <Typography
                              sx={{
                                color: step.color,
                                fontWeight: 600,
                                fontSize: '1rem',
                              }}
                            >
                              {step.description}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Divider sx={{ my: 3, borderColor: `${step.color}30` }} />
                        
                        <Typography
                          sx={{
                            color: '#718096',
                            lineHeight: 1.6,
                            fontSize: '0.95rem',
                          }}
                        >
                          {step.details}
                        </Typography>
                      </Box>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>
        </motion.div>

        {/* Token Configuration Walkthrough */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Box sx={{ 
            width: '100vw',
            marginLeft: 'calc(-50vw + 50%)',
            marginRight: 'calc(-50vw + 50%)',
            py: 8, 
            px: 4,
            background: `
              linear-gradient(135deg, 
                rgba(155, 184, 224, 0.4) 0%, 
                rgba(179, 154, 232, 0.3) 25%,
                rgba(230, 155, 184, 0.3) 50%,
                rgba(155, 214, 195, 0.3) 75%,
                rgba(155, 184, 224, 0.4) 100%
              )
            `,
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(20px)',
            mb: 6
          }}>
            <Container maxWidth="lg">
              <Typography
                variant="h3"
                sx={{
                  fontSize: { xs: '2rem', md: '2rem' },
                  fontWeight: 700,
                  color: '#2d3748',
                  mb: 4,
                  textAlign: 'center',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center' }}>
                  <Settings sx={{ color: '#8b5cf6', fontSize: '2rem' }} />
                  {t('howItWorksColleges.tokenConfigSectionTitle')}
                </Box>
              </Typography>
              <Typography
                sx={{
                  color: '#718096',
                  fontSize: { xs: '1.1rem', md: '1.3rem' },
                  textAlign: 'center',
                  mb: 6,
                  maxWidth: '800px',
                  mx: 'auto',
                  lineHeight: 1.6,
                }}
              >
                {t('howItWorksColleges.tokenConfigSectionSubtitle')}
              </Typography>

              <Grid container spacing={4}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Stack spacing={3}>
                    {[
                      {
                        title: t('howItWorksColleges.tokenIdentityTitle'),
                        items: [
                          t('howItWorksColleges.tokenIdentityItem1'),
                          t('howItWorksColleges.tokenIdentityItem2'),
                          t('howItWorksColleges.tokenIdentityItem3')
                        ],
                        color: '#ff6b6b',
                        icon: Token
                      },
                      {
                        title: t('howItWorksColleges.tokenEconomicsTitle'),
                        items: [
                          t('howItWorksColleges.tokenEconomicsItem1'),
                          t('howItWorksColleges.tokenEconomicsItem2'),
                          t('howItWorksColleges.tokenEconomicsItem3')
                        ],
                        color: '#4ecdc4',
                        icon: MonetizationOn
                      },
                      {
                        title: t('howItWorksColleges.earningMechanismsTitle'),
                        items: [
                          t('howItWorksColleges.earningMechanismsItem1'),
                          t('howItWorksColleges.earningMechanismsItem2'),
                          t('howItWorksColleges.earningMechanismsItem3'),
                          t('howItWorksColleges.earningMechanismsItem4')
                        ],
                        color: '#45b7d1',
                        icon: EmojiEvents
                      },
                      {
                        title: t('howItWorksColleges.spendingOptionsTitle'),
                        items: [
                          t('howItWorksColleges.spendingOptionsItem1'),
                          t('howItWorksColleges.spendingOptionsItem2'),
                          t('howItWorksColleges.spendingOptionsItem3'),
                          t('howItWorksColleges.spendingOptionsItem4')
                        ],
                        color: '#8b5cf6',
                        icon: BusinessCenter
                      },
                    ].map((section, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.02, x: 5 }}
                      >
                        <Paper
                          elevation={0}
                          sx={{
                            p: 4,
                            background: 'rgba(255, 255, 255, 0.9)',
                            borderRadius: '20px',
                            border: `2px solid ${section.color}30`,
                            backdropFilter: 'blur(10px)',
                            boxShadow: `0 8px 24px ${section.color}20`,
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <Box
                              sx={{
                                p: 1.5,
                                background: `${section.color}20`,
                                borderRadius: '12px',
                              }}
                            >
                              <section.icon sx={{ color: section.color, fontSize: '24px' }} />
                            </Box>
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 700,
                                color: '#2d3748',
                                fontSize: '1.1rem',
                              }}
                            >
                              {section.title}
                            </Typography>
                          </Box>
                          <Stack spacing={1.5}>
                            {section.items.map((item, idx) => (
                              <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <CheckCircle sx={{ color: section.color, fontSize: '18px' }} />
                                <Typography
                                  sx={{
                                    color: '#718096',
                                    fontSize: '0.9rem',
                                    lineHeight: 1.4,
                                  }}
                                >
                                  {item}
                                </Typography>
                              </Box>
                            ))}
                          </Stack>
                        </Paper>
                      </motion.div>
                    ))}
                  </Stack>
                </Grid>

                <Grid size={{ xs: 12, md: 8 }}>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    <Card
                      elevation={0}
                      sx={{
                        height: '100%',
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        border: '2px solid rgba(139, 92, 246, 0.2)',
                        borderRadius: '24px',
                        p: 5,
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: '0 20px 40px rgba(139, 92, 246, 0.1)',
                      }}
                    >
                      {/* Visual Image Element */}
                      <Box
                        component="img"
                        src="/images/animated-pixel-art-programmer.gif"
                        sx={{
                          width: '100%',
                          height: '200px',
                          objectFit: 'cover',
                          borderRadius: '16px',
                          mb: 4,
                          boxShadow: '0 8px 24px rgba(139, 92, 246, 0.2)',
                        }}
                      />
                      
                      <Box>
                        <Typography
                          variant="h4"
                          sx={{
                            fontWeight: 700,
                            color: '#2d3748',
                            mb: 3,
                            fontSize: '1.8rem',
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Lightbulb sx={{ color: '#8b5cf6', fontSize: '2rem' }} />
                            {t('howItWorksColleges.configTipsTitle')}
                          </Box>
                        </Typography>
                        <Divider sx={{ my: 3, borderColor: 'rgba(139, 92, 246, 0.2)' }} />
                        <Stack spacing={4}>
                          {[
                            {
                              title: t('howItWorksColleges.configTip1Title'),
                              description: t('howItWorksColleges.configTip1Desc'),
                              color: '#ff6b6b'
                            },
                            {
                              title: t('howItWorksColleges.configTip2Title'),
                              description: t('howItWorksColleges.configTip2Desc'),
                              color: '#4ecdc4'
                            },
                            {
                              title: t('howItWorksColleges.configTip3Title'),
                              description: t('howItWorksColleges.configTip3Desc'),
                              color: '#45b7d1'
                            },
                            {
                              title: t('howItWorksColleges.configTip4Title'),
                              description: t('howItWorksColleges.configTip4Desc'),
                              color: '#8b5cf6'
                            },
                          ].map((tip, index) => (
                            <motion.div
                              key={index}
                              whileHover={{ scale: 1.02, x: 5 }}
                              transition={{ duration: 0.3 }}
                            >
                              <Box
                                sx={{
                                  p: 3,
                                  background: `${tip.color}10`,
                                  borderRadius: '16px',
                                  border: `1px solid ${tip.color}30`,
                                }}
                              >
                                <Typography
                                  variant="h6"
                                  sx={{
                                    fontWeight: 600,
                                    color: '#2d3748',
                                    mb: 1,
                                    fontSize: '1.1rem',
                                  }}
                                >
                                  {tip.title}
                                </Typography>
                                <Typography
                                  sx={{
                                    color: '#718096',
                                    lineHeight: 1.6,
                                    fontSize: '0.95rem',
                                  }}
                                >
                                  {tip.description}
                                </Typography>
                              </Box>
                            </motion.div>
                          ))}
                        </Stack>
                      </Box>
                    </Card>
                  </motion.div>
                </Grid>
              </Grid>
            </Container>
          </Box>
        </motion.div>

        {/* Student Data & Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <Box sx={{ mb: 8 }}>
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: '2rem', md: '2rem' },
                fontWeight: 700,
                color: '#2d3748',
                mb: 4,
                textAlign: 'center',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center' }}>
                <BarChart sx={{ color: '#4ecdc4', fontSize: '2rem' }} />
                {t('howItWorksColleges.analyticsSectionTitle')}
              </Box>
            </Typography>
            <Typography
              sx={{
                color: '#718096',
                fontSize: { xs: '1.1rem', md: '1.3rem' },
                textAlign: 'center',
                mb: 6,
                maxWidth: '800px',
                mx: 'auto',
                lineHeight: 1.6,
              }}
            >
              {t('howItWorksColleges.analyticsSectionSubtitle')}
            </Typography>

            <Grid container spacing={4}>
              {[
                {
                  icon: Dashboard,
                  title: t('howItWorksColleges.analyticsCard1Title'),
                  metrics: [
                    t('howItWorksColleges.analyticsCard1Metric1'),
                    t('howItWorksColleges.analyticsCard1Metric2'),
                    t('howItWorksColleges.analyticsCard1Metric3'),
                    t('howItWorksColleges.analyticsCard1Metric4')
                  ],
                  color: '#ff6b6b',
                  gradient: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%)',
                  image: '/images/hero-digital-economy.jpg'
                },
                {
                  icon: Assessment,
                  title: t('howItWorksColleges.analyticsCard2Title'),
                  metrics: [
                    t('howItWorksColleges.analyticsCard2Metric1'),
                    t('howItWorksColleges.analyticsCard2Metric2'),
                    t('howItWorksColleges.analyticsCard2Metric3'),
                    t('howItWorksColleges.analyticsCard2Metric4')
                  ],
                  color: '#4ecdc4',
                  gradient: 'linear-gradient(135deg, #4ecdc4 0%, #6ee7b7 100%)',
                  image: '/images/pixel-art-game-arcade-pink.gif'
                },
                {
                  icon: BarChart,
                  title: t('howItWorksColleges.analyticsCard3Title'),
                  metrics: [
                    t('howItWorksColleges.analyticsCard3Metric1'),
                    t('howItWorksColleges.analyticsCard3Metric2'),
                    t('howItWorksColleges.analyticsCard3Metric3'),
                    t('howItWorksColleges.analyticsCard3Metric4')
                  ],
                  color: '#45b7d1',
                  gradient: 'linear-gradient(135deg, #45b7d1 0%, #7dd3fc 100%)',
                  image: '/images/immutable-place-game-screen-pixel-art.jpeg'
                },
              ].map((item, index) => (
                <Grid size={{ xs: 12, md: 4 }} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05, y: -8 }}
                  >
                    <Card
                      elevation={0}
                      sx={{
                        height: '100%',
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        border: `2px solid ${item.color}30`,
                        borderRadius: '24px',
                        p: 4,
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: `0 15px 35px ${item.color}20`,
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {/* Visual Image Element */}
                      <Box
                        component="img"
                        src={item.image}
                        sx={{
                          width: '100%',
                          height: '150px',
                          objectFit: 'cover',
                          borderRadius: '16px',
                          mb: 3,
                          boxShadow: `0 8px 24px ${item.color}20`,
                        }}
                      />
                      
                      <Box>
                        <Box
                          sx={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            background: item.gradient,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 3,
                            boxShadow: `0 8px 24px ${item.color}40`,
                          }}
                        >
                          <item.icon sx={{ color: 'white', fontSize: '2rem' }} />
                        </Box>
                        
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: 700,
                            color: '#2d3748',
                            mb: 3,
                            fontSize: '1.4rem',
                          }}
                        >
                          {item.title}
                        </Typography>
                        
                        <Stack spacing={2}>
                          {item.metrics.map((metric, idx) => (
                            <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <CheckCircle sx={{ color: item.color, fontSize: '18px' }} />
                              <Typography
                                sx={{
                                  color: '#718096',
                                  fontSize: '0.95rem',
                                  lineHeight: 1.4,
                                }}
                              >
                                {metric}
                              </Typography>
                            </Box>
                          ))}
                        </Stack>
                      </Box>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>
        </motion.div>

        {/* Why Should Colleges Participate */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <Box sx={{ 
            width: '100vw',
            marginLeft: 'calc(-50vw + 50%)',
            marginRight: 'calc(-50vw + 50%)',
            py: 8, 
            px: 4,
            background: `
              linear-gradient(135deg, 
                rgba(78, 205, 196, 0.15) 0%, 
                rgba(139, 92, 246, 0.15) 25%,
                rgba(236, 72, 153, 0.15) 50%,
                rgba(69, 183, 209, 0.15) 75%,
                rgba(78, 205, 196, 0.15) 100%
              )
            `,
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(20px)',
            mb: 6
          }}>
            <Container maxWidth="lg">
              <Typography
                variant="h3"
                sx={{
                  fontSize: { xs: '2rem', md: '2rem' },
                  fontWeight: 700,
                  color: '#2d3748',
                  mb: 6,
                  textAlign: 'center',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center' }}>
                  <Star sx={{ color: '#8b5cf6', fontSize: '2rem' }} />
                  {t('howItWorksColleges.benefitsSectionTitle')}
                </Box>
              </Typography>

              <Grid container spacing={4}>
                {benefits.map((benefit, index) => (
                  <Grid size={{ xs: 12, md: 6 }} key={index}>
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.02, y: -5 }}
                    >
                      <Card
                        elevation={0}
                        sx={{
                          p: 4,
                          height: '100%',
                          background: 'rgba(255, 255, 255, 0.95)',
                          backdropFilter: 'blur(20px)',
                          border: `2px solid ${benefit.color}30`,
                          borderRadius: '24px',
                          position: 'relative',
                          overflow: 'hidden',
                          boxShadow: `0 15px 35px ${benefit.color}20`,
                          transition: 'all 0.3s ease',
                        }}
                      >
                        {/* Visual Image Element */}
                        <Box
                          component="img"
                          src={benefit.image}
                          sx={{
                            width: '100%',
                            height: '180px',
                            objectFit: 'cover',
                            borderRadius: '16px',
                            mb: 3,
                            boxShadow: `0 8px 24px ${benefit.color}20`,
                          }}
                        />
                        
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                            <Box
                              sx={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                background: benefit.gradient,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: `0 8px 24px ${benefit.color}40`,
                                flexShrink: 0,
                              }}
                            >
                              <benefit.icon sx={{ color: 'white', fontSize: '2rem' }} />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                              <Typography
                                variant="h5"
                                sx={{
                                  fontWeight: 700,
                                  color: '#2d3748',
                                  mb: 2,
                                  fontSize: '1.3rem',
                                }}
                              >
                                {benefit.title}
                              </Typography>
                              <Typography
                                sx={{
                                  color: '#718096',
                                  mb: 3,
                                  lineHeight: 1.6,
                                  fontSize: '1rem',
                                }}
                              >
                                {benefit.description}
                              </Typography>
                              <Chip
                                label={benefit.metric}
                                sx={{
                                  background: benefit.gradient,
                                  color: 'white',
                                  fontWeight: 600,
                                  fontSize: '0.85rem',
                                }}
                              />
                            </Box>
                          </Box>
                        </Box>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Container>
          </Box>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          viewport={{ once: true }}
        >
          <Box sx={{ mb: 8 }}>
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: '2rem', md: '2rem' },
                fontWeight: 700,
                color: '#2d3748',
                mb: 6,
                textAlign: 'center',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center' }}>
                <ContactSupport sx={{ color: '#8b5cf6', fontSize: '2rem' }} />
                {t('howItWorksColleges.faqSectionTitle')}
              </Box>
            </Typography>

            <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Accordion
                    sx={{
                      mb: 2,
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(139, 92, 246, 0.2)',
                      borderRadius: '16px !important',
                      boxShadow: '0 8px 24px rgba(139, 92, 246, 0.1)',
                      '&:before': {
                        display: 'none',
                      },
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMore sx={{ color: '#8b5cf6' }} />}
                      sx={{
                        '& .MuiAccordionSummary-content': {
                          margin: '16px 0',
                        },
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 600,
                          color: '#2d3748',
                          fontSize: '1.1rem',
                        }}
                      >
                        {faq.question}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography
                        sx={{
                          color: '#718096',
                          lineHeight: 1.6,
                          fontSize: '1rem',
                        }}
                      >
                        {faq.answer}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                </motion.div>
              ))}
            </Box>
          </Box>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          viewport={{ once: true }}
        >
          <Box
            sx={{
              width: '100vw',
              marginLeft: 'calc(-50vw + 50%)',
              marginRight: 'calc(-50vw + 50%)',
              py: 10,
              px: 4,
              background: `
                linear-gradient(135deg, 
                  rgba(14, 165, 233, 0.1) 0%, 
                  rgba(139, 92, 246, 0.1) 50%,
                  rgba(16, 185, 129, 0.1) 100%
                )
              `,
              color: '#2d3748',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Container maxWidth="md">
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '2rem', md: '3rem' },
                  fontWeight: 800,
                  mb: 4,
                }}
              >
                {t('howItWorksColleges.ctaTitle')}
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: '1.2rem', md: '1.5rem' },
                  mb: 6,
                  lineHeight: 1.6,
                }}
              >
                {t('howItWorksColleges.ctaSubtitle')}
              </Typography>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  component={Link}
                  to="/auth/register/admin"
                  variant="contained"
                  size="large"
                  endIcon={<Rocket />}
                  sx={{
                    background: 'linear-gradient(135deg, #0EA5E9 0%, #8B5CF6 100%)',
                    color: 'white',
                    py: 2,
                    px: 6,
                    fontSize: '1.2rem',
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: '20px',
                    boxShadow: '0 15px 40px rgba(14, 165, 233, 0.3)',
                    '&:hover': {
                      boxShadow: '0 20px 50px rgba(14, 165, 233, 0.4)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <School sx={{ fontSize: '1.3rem' }} />
                    {t('howItWorksColleges.ctaButton')}
                  </Box>
                </Button>
              </motion.div>
            </Container>
          </Box>
        </motion.div>
      </Container>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.2); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.2; }
        }
      `}</style>
    </Box>
  );
}

export default HowItWorksColleges;

