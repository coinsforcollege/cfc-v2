import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Typography,
  Stack,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import {
  School,
  Settings,
  RocketLaunch,
  AccountBalance,
  TrendingUp,
  Timeline,
  ArrowForward
} from '@mui/icons-material';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { colors, gradients, spacing, typography, shadows, borderRadius } from '../../utils/designTokens';

const HowItWorksSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const steps = [
    {
      id: 1,
      title: t('howItWorks.step1Title'),
      subtitle: t('howItWorks.step1Subtitle'),
      description: t('howItWorks.step1Desc'),
      icon: <School sx={{ fontSize: '2.5rem' }} />,
      color: colors.primary[500],
      gradient: gradients.primary,
      details: [
        t('howItWorks.step1Detail1'),
        t('howItWorks.step1Detail2'),
        t('howItWorks.step1Detail3'),
        t('howItWorks.step1Detail4'),
        t('howItWorks.step1Detail5')
      ],
      stats: t('howItWorks.step1Stats')
    },
    {
      id: 2,
      title: t('howItWorks.step2Title'),
      subtitle: t('howItWorks.step2Subtitle'),
      description: t('howItWorks.step2Desc'),
      icon: <Settings sx={{ fontSize: '2.5rem' }} />,
      color: colors.secondary[500],
      gradient: gradients.primaryDark,
      details: [
        t('howItWorks.step2Detail1'),
        t('howItWorks.step2Detail2'),
        t('howItWorks.step2Detail3'),
        t('howItWorks.step2Detail4'),
        t('howItWorks.step2Detail5')
      ],
      stats: t('howItWorks.step2Stats')
    },
    {
      id: 3,
      title: t('howItWorks.step3Title'),
      subtitle: t('howItWorks.step3Subtitle'),
      description: t('howItWorks.step3Desc'),
      icon: <RocketLaunch sx={{ fontSize: '2.5rem' }} />,
      color: colors.success[500],
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      details: [
        t('howItWorks.step3Detail1'),
        t('howItWorks.step3Detail2'),
        t('howItWorks.step3Detail3'),
        t('howItWorks.step3Detail4'),
        t('howItWorks.step3Detail5')
      ],
      stats: t('howItWorks.step3Stats')
    },
    {
      id: 4,
      title: t('howItWorks.step4Title'),
      subtitle: t('howItWorks.step4Subtitle'),
      description: t('howItWorks.step4Desc'),
      icon: <AccountBalance sx={{ fontSize: '2.5rem' }} />,
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      details: [
        t('howItWorks.step4Detail1'),
        t('howItWorks.step4Detail2'),
        t('howItWorks.step4Detail3'),
        t('howItWorks.step4Detail4'),
        t('howItWorks.step4Detail5')
      ],
      stats: t('howItWorks.step4Stats')
    }
  ];

  return (
    <Box
      sx={{
        py: { xs: spacing['4xl'], md: spacing['5xl'] },
        background: `linear-gradient(135deg, 
          rgba(14, 165, 233, 0.03) 0%, 
          rgba(139, 92, 246, 0.03) 50%,
          rgba(16, 185, 129, 0.03) 100%
        )`,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 80%, rgba(14, 165, 233, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
          pointerEvents: 'none',
        }
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Box sx={{ textAlign: 'center', mb: { xs: spacing['3xl'], md: spacing['4xl'] } }}>
            <Chip
              label={t('howItWorks.chipLabel')}
              sx={{
                background: gradients.primary,
                color: 'white',
                fontWeight: 600,
                mb: 2,
                px: 2,
                py: 1,
                fontSize: '0.875rem'
              }}
            />
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: typography.fontSize['3xl'], md: typography.fontSize['4xl'] },
                fontWeight: typography.fontWeight.bold,
                color: colors.neutral[800],
                mb: 2,
                lineHeight: typography.lineHeight.tight
              }}
            >
              {t('howItWorks.title')}
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: typography.fontSize.lg, md: typography.fontSize.xl },
                color: colors.neutral[600],
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: typography.lineHeight.relaxed
              }}
            >
              {t('howItWorks.description')}
            </Typography>
          </Box>
        </motion.div>

        {/* Timeline Roadmap */}
        <Box sx={{ position: 'relative' }}>
          {/* Vertical Connecting Line */}
          <Box
            sx={{
              position: 'absolute',
              left: { xs: '40px', md: '60px' },
              top: '60px',
              bottom: '60px',
              width: '2px',
              background: `linear-gradient(180deg, 
                ${colors.primary[500]} 0%, 
                ${colors.secondary[500]} 33%, 
                ${colors.success[500]} 66%, 
                #f59e0b 100%
              )`,
              borderRadius: '1px',
              zIndex: 0,
              display: { xs: 'none', md: 'block' }
            }}
          />

          {/* Timeline Steps */}
          <Stack spacing={{ xs: 4, md: 6 }}>
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card
                  sx={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: borderRadius['2xl'],
                    boxShadow: shadows.lg,
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: shadows.xl,
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                      {/* Step Number & Icon */}
                      <Box sx={{ position: 'relative', flexShrink: 0 }}>
                        <Box
                          sx={{
                            width: { xs: '60px', md: '80px' },
                            height: { xs: '60px', md: '80px' },
                            borderRadius: '50%',
                            background: step.gradient,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '3px solid white',
                            boxShadow: `0 8px 24px ${step.color}40`,
                            position: 'relative',
                            zIndex: 2
                          }}
                        >
                          {React.cloneElement(step.icon, {
                            sx: {
                              color: 'white',
                            }
                          })}
                        </Box>
                        
                        {/* Step Number Badge */}
                        <Box
                          sx={{
                            position: 'absolute',
                            top: -8,
                            right: -8,
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            background: step.color,
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            border: '2px solid white',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                          }}
                        >
                          {step.id}
                        </Box>
                      </Box>

                      {/* Content */}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="h5"
                          sx={{
                            fontSize: { xs: typography.fontSize.xl, md: typography.fontSize['2xl'] },
                            fontWeight: typography.fontWeight.bold,
                            color: colors.neutral[800],
                            lineHeight: typography.lineHeight.tight,
                            mb: 1
                          }}
                        >
                          {step.title}
                        </Typography>
                        
                        <Typography
                          sx={{
                            fontSize: typography.fontSize.lg,
                            fontWeight: typography.fontWeight.medium,
                            color: step.color,
                            mb: 2,
                            lineHeight: typography.lineHeight.snug
                          }}
                        >
                          {step.subtitle}
                        </Typography>

                        <Typography
                          sx={{
                            fontSize: typography.fontSize.base,
                            color: colors.neutral[600],
                            mb: 3,
                            lineHeight: typography.lineHeight.relaxed
                          }}
                        >
                          {step.description}
                        </Typography>

                        {/* Details List */}
                        <Stack spacing={1} sx={{ mb: 3 }}>
                          {step.details.map((detail, detailIndex) => (
                            <Box key={detailIndex} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Box
                                sx={{
                                  width: '6px',
                                  height: '6px',
                                  borderRadius: '50%',
                                  background: step.color,
                                  flexShrink: 0
                                }}
                              />
                              <Typography
                                sx={{
                                  fontSize: typography.fontSize.sm,
                                  color: colors.neutral[600],
                                  lineHeight: typography.lineHeight.normal
                                }}
                              >
                                {detail}
                              </Typography>
                            </Box>
                          ))}
                        </Stack>

                        {/* Stats */}
                        <Box
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 1,
                            px: 2,
                            py: 1,
                            borderRadius: borderRadius.full,
                            background: `${step.color}15`,
                            border: `1px solid ${step.color}30`
                          }}
                        >
                          <TrendingUp sx={{ color: step.color, fontSize: '1rem' }} />
                          <Typography
                            sx={{
                              fontSize: typography.fontSize.sm,
                              fontWeight: typography.fontWeight.medium,
                              color: step.color
                            }}
                          >
                            {step.stats}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Stack>
        </Box>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <Box sx={{ textAlign: 'center', mt: { xs: spacing['3xl'], md: spacing['4xl'] } }}>
            <Typography
              sx={{
                fontSize: { xs: typography.fontSize.lg, md: typography.fontSize.xl },
                color: colors.neutral[600],
                mb: 3,
                lineHeight: typography.lineHeight.relaxed
              }}
            >
              {t('howItWorks.ctaText')}
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              sx={{ justifyContent: 'center', alignItems: 'center' }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Box
                  component="button"
                  onClick={() => navigate('/auth/register/user')}
                  sx={{
                    background: gradients.primary,
                    color: 'white',
                    border: 'none',
                    borderRadius: borderRadius.lg,
                    px: 4,
                    py: 2,
                    fontSize: typography.fontSize.lg,
                    fontWeight: typography.fontWeight.semibold,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    boxShadow: shadows.lg,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: shadows.xl,
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  {t('howItWorks.ctaButton1')}
                  <ArrowForward />
                </Box>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Box
                  component="button"
                  onClick={() => navigate('/auth/register/college')}
                  sx={{
                    background: 'rgba(255, 255, 255, 0.8)',
                    color: colors.neutral[700],
                    border: `2px solid ${colors.neutral[300]}`,
                    borderRadius: borderRadius.lg,
                    px: 4,
                    py: 2,
                    fontSize: typography.fontSize.lg,
                    fontWeight: typography.fontWeight.semibold,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.9)',
                      borderColor: colors.primary[500],
                      color: colors.primary[500]
                    }
                  }}
                >
                  {t('howItWorks.ctaButton2')}
                  <Timeline />
                </Box>
              </motion.div>
            </Stack>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default HowItWorksSection;
