import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Box, Container, Typography, Card, CardContent, Grid, Chip, Stack } from '@mui/material';
import {
  Build,
  Security,
  Api,
  Analytics,
  CheckCircle,
  Settings,
  AccountBalance,
  Token
} from '@mui/icons-material';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

const InfrastructureSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const controlItems = [
    {
      icon: Token,
      title: t('infrastructure.tokenConfiguration'),
      description: t('infrastructure.tokenConfigurationDesc'),
      color: '#a8c8ec'
    },
    {
      icon: Analytics,
      title: t('infrastructure.miningAllocation'),
      description: t('infrastructure.miningAllocationDesc'),
      color: '#c4a8f2'
    },
    {
      icon: Settings,
      title: t('infrastructure.utilityDesign'),
      description: t('infrastructure.utilityDesignDesc'),
      color: '#f2a8c8'
    },
    {
      icon: AccountBalance,
      title: t('infrastructure.daoStructure'),
      description: t('infrastructure.daoStructureDesc'),
      color: '#a8e6cf'
    }
  ];

  const deliveryItems = [
    {
      icon: Security,
      title: t('infrastructure.auditedSmartContracts'),
      description: t('infrastructure.auditedSmartContractsDesc'),
      color: '#68d391'
    },
    {
      icon: Api,
      title: t('infrastructure.interoperabilityLayer'),
      description: t('infrastructure.interoperabilityLayerDesc'),
      color: '#fbbf24'
    },
    {
      icon: Build,
      title: t('infrastructure.apiIntegrations'),
      description: t('infrastructure.apiIntegrationsDesc'),
      color: '#ffd3a5'
    },
    {
      icon: Analytics,
      title: t('infrastructure.tokenomicsModeling'),
      description: t('infrastructure.tokenomicsModelingDesc'),
      color: '#a8c8ec'
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
            radial-gradient(circle at 70% 80%, rgba(196, 168, 242, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(242, 168, 200, 0.08) 0%, transparent 50%)
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
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Chip
              label={t('infrastructure.forColleges')}
              sx={{
                background: 'linear-gradient(135deg, #a8c8ec 0%, #c4a8f2 100%)',
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
              {t('infrastructure.title')}
            </Typography>
            <Typography
              sx={{
                color: '#718096',
                fontSize: { xs: '1.1rem', md: '1.25rem' },
                lineHeight: 1.6,
                maxWidth: '700px',
                mx: 'auto',
                mb: 4,
              }}
            >
              {t('infrastructure.subtitle')}
            </Typography>
            <Typography
              sx={{
                color: '#4a5568',
                fontSize: { xs: '1rem', md: '1.1rem' },
                lineHeight: 1.6,
                maxWidth: '800px',
                mx: 'auto',
              }}
            >
              {t('infrastructure.description')}
            </Typography>
          </Box>
        </motion.div>

        <Box sx={{ display: 'flex', gap: 6, mb: 8, flexDirection: { xs: 'column', lg: 'row' }, alignItems: 'stretch' }}>
          {/* What You Control */}
          <Box sx={{ flex: 1, display: 'flex' }}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              style={{ display: 'flex', flex: 1 }}
            >
              <Card
                sx={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '24px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  height: '100%',
                  width: '100%',
                  p: 4,
                }}
              >
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="h3"
                    sx={{
                      fontSize: { xs: '1.5rem', md: '2rem' },
                      fontWeight: 700,
                      color: '#2d3748',
                      mb: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <CheckCircle sx={{ color: '#68d391', fontSize: '2rem' }} />
                    {t('infrastructure.whatYouControl')}
                  </Typography>
                  <Typography sx={{ color: '#718096', fontSize: '1rem' }}>
                    {t('infrastructure.whatYouControlDesc')}
                  </Typography>
                </Box>

                <Stack spacing={3}>
                  {controlItems.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 3,
                          p: 3,
                          borderRadius: '16px',
                          background: 'rgba(255, 255, 255, 0.6)',
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
                            borderRadius: '16px',
                            background: `linear-gradient(135deg, ${item.color} 0%, ${item.color}80 100%)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <item.icon sx={{ color: 'white', fontSize: '24px' }} />
                        </Box>
                        <Box>
                          <Typography
                            sx={{
                              fontSize: '1.1rem',
                              fontWeight: 600,
                              color: '#2d3748',
                              mb: 0.5,
                            }}
                          >
                            {item.title}
                          </Typography>
                          <Typography
                            sx={{
                              color: '#718096',
                              fontSize: '0.95rem',
                              lineHeight: 1.4,
                            }}
                          >
                            {item.description}
                          </Typography>
                        </Box>
                      </Box>
                    </motion.div>
                  ))}
                </Stack>
              </Card>
            </motion.div>
          </Box>

          {/* What We Deliver */}
          <Box sx={{ flex: 1, display: 'flex' }}>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              style={{ display: 'flex', flex: 1 }}
            >
              <Card
                sx={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '24px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  height: '100%',
                  width: '100%',
                  p: 4,
                }}
              >
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="h3"
                    sx={{
                      fontSize: { xs: '1.5rem', md: '2rem' },
                      fontWeight: 700,
                      color: '#2d3748',
                      mb: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <Build sx={{ color: '#fbbf24', fontSize: '2rem' }} />
                    {t('infrastructure.whatWeDeliver')}
                  </Typography>
                  <Typography sx={{ color: '#718096', fontSize: '1rem' }}>
                    {t('infrastructure.whatWeDeliverDesc')}
                  </Typography>
                </Box>

                <Stack spacing={3}>
                  {deliveryItems.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 3,
                          p: 3,
                          borderRadius: '16px',
                          background: 'rgba(255, 255, 255, 0.6)',
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
                            borderRadius: '16px',
                            background: `linear-gradient(135deg, ${item.color} 0%, ${item.color}80 100%)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <item.icon sx={{ color: 'white', fontSize: '24px' }} />
                        </Box>
                        <Box>
                          <Typography
                            sx={{
                              fontSize: '1.1rem',
                              fontWeight: 600,
                              color: '#2d3748',
                              mb: 0.5,
                            }}
                          >
                            {item.title}
                          </Typography>
                          <Typography
                            sx={{
                              color: '#718096',
                              fontSize: '0.95rem',
                              lineHeight: 1.4,
                            }}
                          >
                            {item.description}
                          </Typography>
                        </Box>
                      </Box>
                    </motion.div>
                  ))}
                </Stack>
              </Card>
            </motion.div>
          </Box>
        </Box>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Box
            sx={{
              textAlign: 'center',
              p: 6,
              borderRadius: '24px',
              background: 'linear-gradient(135deg, rgba(168, 200, 236, 0.1) 0%, rgba(196, 168, 242, 0.1) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
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
              {t('infrastructure.ctaTitle')}
            </Typography>
            <Typography
              sx={{
                color: '#718096',
                fontSize: '1.1rem',
                mb: 4,
                maxWidth: '600px',
                mx: 'auto',
              }}
            >
              {t('infrastructure.ctaDescription')}
            </Typography>
            <Box
              onClick={() => navigate('/auth/register/college')}
              sx={{
                display: 'inline-block',
                px: 4,
                py: 2,
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #a8c8ec 0%, #c4a8f2 100%)',
                color: 'white',
                fontWeight: 600,
                fontSize: '1.1rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 24px rgba(168, 200, 236, 0.4)',
                },
              }}
            >
              {t('hero.joinWaitlist')}
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default InfrastructureSection;
