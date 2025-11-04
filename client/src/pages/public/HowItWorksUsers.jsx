import React, { useState } from 'react';
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
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper,
  alpha,
  useTheme,
} from '@mui/material';
import {
  ExpandMore,
  TrendingUp,
  Share,
  Token,
  AccountBalance,
  Security,
  EmojiEvents,
  Group,
  ArrowForward,
  CheckCircle,
} from '@mui/icons-material';

const getSteps = (t) => [
  {
    label: t('howItWorksStudents.steps.createAccount.label'),
    description: t('howItWorksStudents.steps.createAccount.description'),
    details: t('howItWorksStudents.steps.createAccount.details'),
  },
  {
    label: t('howItWorksStudents.steps.selectCollege.label'),
    description: t('howItWorksStudents.steps.selectCollege.description'),
    details: t('howItWorksStudents.steps.selectCollege.details'),
  },
  {
    label: t('howItWorksStudents.steps.verifyIdentity.label'),
    description: t('howItWorksStudents.steps.verifyIdentity.description'),
    details: t('howItWorksStudents.steps.verifyIdentity.details'),
  },
  {
    label: t('howItWorksStudents.steps.startMining.label'),
    description: t('howItWorksStudents.steps.startMining.description'),
    details: t('howItWorksStudents.steps.startMining.details'),
  },
];

const getFaqs = (t) => [
  {
    question: t('howItWorksStudents.faq.questions.howOftenCanIMine.question'),
    answer: t('howItWorksStudents.faq.questions.howOftenCanIMine.answer'),
  },
  {
    question: t('howItWorksStudents.faq.questions.areTheseRealTokens.question'),
    answer: t('howItWorksStudents.faq.questions.areTheseRealTokens.answer'),
  },
  {
    question: t('howItWorksStudents.faq.questions.canISwitchCollege.question'),
    answer: t('howItWorksStudents.faq.questions.canISwitchCollege.answer'),
  },
  {
    question: t('howItWorksStudents.faq.questions.isThereACost.question'),
    answer: t('howItWorksStudents.faq.questions.isThereACost.answer'),
  },
  {
    question: t('howItWorksStudents.faq.questions.whatIfIMissDay.question'),
    answer: t('howItWorksStudents.faq.questions.whatIfIMissDay.answer'),
  },
  {
    question: t('howItWorksStudents.faq.questions.howSecureIsInfo.question'),
    answer: t('howItWorksStudents.faq.questions.howSecureIsInfo.answer'),
  },
  {
    question: t('howItWorksStudents.faq.questions.referralLimit.question'),
    answer: t('howItWorksStudents.faq.questions.referralLimit.answer'),
  },
];

function HowItWorksStudents() {
  const theme = useTheme();
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);
  
  const steps = getSteps(t);
  const faqs = getFaqs(t);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
          py: { xs: 6, md: 10 },
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h1"
            align="center"
            fontWeight={800}
            sx={{
              fontSize: { xs: '2rem', md: '2.5rem', lg: '3rem' },
              fontWeight: 700,
              mb: 2,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {t('howItWorksStudents.title')}
          </Typography>
          <Typography
            variant="h6"
            align="center"
            color="text.secondary"
            sx={{ maxWidth: '700px', mx: 'auto' }}
          >
            {t('howItWorksStudents.subtitle')}
          </Typography>
        </Container>
      </Box>

      {/* Step by Step Process */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          align="center"
          sx={{
            mb: 4,
            typography: { xs: 'h5', md: 'h4' },
            '&&': {
              fontWeight: 700,
            }
          }}
        >
          {t('howItWorksStudents.stepByStepProcess')}
        </Typography>

        <Grid container spacing={4} alignContent={'center'} >
          <Grid size={12} sx={{ maxWidth: '800px', mx: 'auto' }}>
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel>
                    <Typography variant="h6" fontWeight={600}>
                      {step.label}
                    </Typography>
                  </StepLabel>
                  <StepContent>
                    <Typography color="text.secondary" sx={{ mb: 2 }}>
                      {step.details}
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        sx={{ mt: 1, mr: 1, textTransform: 'none' }}
                      // disabled={index === steps.length - 1}
                      >
                        {index === steps.length - 1 ? t('howItWorksStudents.buttons.finish') : t('howItWorksStudents.buttons.continue')}
                      </Button>
                      <Button
                        disabled={index === 0}
                        onClick={handleBack}
                        sx={{ mt: 1, mr: 1, textTransform: 'none' }}
                      >
                        {t('howItWorksStudents.buttons.back')}
                      </Button>
                    </Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
            {activeStep === steps.length && (
              <Paper square elevation={0} sx={{ p: 3 }}>
                <Typography sx={{ mb: 2 }}>
                  {t('howItWorksStudents.buttons.allStepsCompleted')}
                </Typography>
                <Button onClick={handleReset} sx={{ textTransform: 'none' }}>
                  {t('howItWorksStudents.buttons.reset')}
                </Button>
              </Paper>
            )}
          </Grid>

        </Grid>
      </Container>

      {/* What is Token Mining */}
      <Box sx={{ bgcolor: 'background.default', py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            align="center"
            sx={{
              typography: { xs: 'h5', md: 'h4' },
              '&&': {
                fontWeight: 700,
              }
            }}
            gutterBottom
          >
            {t('howItWorksStudents.whatIsTokenMining.title')}
          </Typography>
          <Typography color="text.secondary" align="center" sx={{ mb: 6, maxWidth: '800px', mx: 'auto', fontSize: '1.1rem' }}>
            {t('howItWorksStudents.whatIsTokenMining.subtitle')}
          </Typography>

          <Grid container spacing={4}>
            {[
              {
                icon: Token,
                title: t('howItWorksStudents.whatIsTokenMining.dailyMining.title'),
                description: t('howItWorksStudents.whatIsTokenMining.dailyMining.description'),
              },
              {
                icon: TrendingUp,
                title: t('howItWorksStudents.whatIsTokenMining.buildStreak.title'),
                description: t('howItWorksStudents.whatIsTokenMining.buildStreak.description'),
              },
              {
                icon: EmojiEvents,
                title: t('howItWorksStudents.whatIsTokenMining.competeEarn.title'),
                description: t('howItWorksStudents.whatIsTokenMining.competeEarn.description'),
              },
              {
                icon: Security,
                title: t('howItWorksStudents.whatIsTokenMining.secureSafe.title'),
                description: t('howItWorksStudents.whatIsTokenMining.secureSafe.description'),
              },
            ].map((item, index) => (
              <Grid size={{ xs: 12, md: 6 }} key={index}>
                <Card
                  elevation={2}
                  sx={{
                    height: '100%',
                    textAlign: 'center',
                    p: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      width: 64,
                      height: 64,
                      mx: 'auto',
                      mb: 2,
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: 'primary.main',
                    }}
                  >
                    <item.icon fontSize="large" />
                  </Avatar>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {item.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* What Can I Do with Tokens */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          align="center"
          sx={{
            typography: { xs: 'h5', md: 'h4' },
            '&&': {
              fontWeight: 700,
            }
          }}
          gutterBottom
        >
          {t('howItWorksStudents.whatCanIDoWithTokens.title')}
        </Typography>
        <Typography color="text.secondary" align="center" sx={{ mb: 6, maxWidth: '800px', mx: 'auto', fontSize: '1.1rem' }}>
          {t('howItWorksStudents.whatCanIDoWithTokens.subtitle')}
        </Typography>

        <Grid container spacing={4}>
          {[
            {
              icon: AccountBalance,
              title: t('howItWorksStudents.whatCanIDoWithTokens.campusPurchases.title'),
              description: t('howItWorksStudents.whatCanIDoWithTokens.campusPurchases.description'),
              color: 'primary',
            },
            {
              icon: EmojiEvents,
              title: t('howItWorksStudents.whatCanIDoWithTokens.eventAccess.title'),
              description: t('howItWorksStudents.whatCanIDoWithTokens.eventAccess.description'),
              color: 'secondary',
            },
            {
              icon: Share,
              title: t('howItWorksStudents.whatCanIDoWithTokens.tradeShare.title'),
              description: t('howItWorksStudents.whatCanIDoWithTokens.tradeShare.description'),
              color: 'success',
            },
          ].map((item, index) => (
            <Grid size={{ xs: 12, md: 4 }} key={index}>
              <Card elevation={2} sx={{ height: '100%', p: 3 }}>
                <Avatar
                  sx={{
                    width: 56,
                    height: 56,
                    mb: 2,
                    bgcolor: `${item.color}.main`,
                  }}
                >
                  <item.icon fontSize="large" />
                </Avatar>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  {item.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {item.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* How Referrals Work */}
      <Box sx={{ bgcolor: alpha(theme.palette.primary.main, 0.03), py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            align="center"
            sx={{
              typography: { xs: 'h5', md: 'h4' },
              '&&': {
                fontWeight: 700,
              }
            }}
            gutterBottom
          >
            {t('howItWorksStudents.howReferralsWork.title')}
          </Typography>
          <Typography variant="h6" color="text.secondary" align="center" sx={{ mb: 6, maxWidth: '800px', mx: 'auto', fontSize: '1.1rem' }}>
            {t('howItWorksStudents.howReferralsWork.subtitle')}
          </Typography>

          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Card elevation={2} sx={{ p: 4 }}>
                <Stack spacing={3}>
                  {[
                    {
                      step: '1',
                      title: t('howItWorksStudents.howReferralsWork.steps.getReferralCode.title'),
                      desc: t('howItWorksStudents.howReferralsWork.steps.getReferralCode.description'),
                    },
                    {
                      step: '2',
                      title: t('howItWorksStudents.howReferralsWork.steps.shareWithFriends.title'),
                      desc: t('howItWorksStudents.howReferralsWork.steps.shareWithFriends.description'),
                    },
                    {
                      step: '3',
                      title: t('howItWorksStudents.howReferralsWork.steps.theySignUp.title'),
                      desc: t('howItWorksStudents.howReferralsWork.steps.theySignUp.description'),
                    },
                    {
                      step: '4',
                      title: t('howItWorksStudents.howReferralsWork.steps.bothEarnBonus.title'),
                      desc: t('howItWorksStudents.howReferralsWork.steps.bothEarnBonus.description'),
                    },
                  ].map((item) => (
                    <Box key={item.step} sx={{ display: 'flex', gap: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: 'secondary.main',
                          width: 48,
                          height: 48,
                          fontWeight: 700,
                          fontSize: '1.2rem',
                        }}
                      >
                        {item.step}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight={600}>
                          {item.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.desc}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Group sx={{ fontSize: 120, color: 'primary.main', mb: 3 }} />
                <Typography
                  variant="h3"
                  align="center"
                  sx={{
                    typography: { xs: 'h5', md: 'h4' },
                    '&&': {
                      fontWeight: 700,
                    }
                  }}
                  gutterBottom
                >
                  {t('howItWorksStudents.howReferralsWork.unlimitedReferrals.title')}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  {t('howItWorksStudents.howReferralsWork.unlimitedReferrals.description')}
                </Typography>
                <Button
                  component={Link}
                  to="/auth/register/user"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                  sx={{ textTransform: 'none', py: 1.5, px: 4 }}
                >
                  {t('howItWorksStudents.howReferralsWork.getStartedNow')}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* FAQ Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          align="center"
          sx={{
            typography: { xs: 'h5', md: 'h4' },
            '&&': {
              fontWeight: 700,
            },
            mb: 6,
          }}
        >
          {t('howItWorksStudents.faq.title')}
        </Typography>

        <div>
          {faqs.map((faq, index) => (
            <Accordion
              key={index}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="panel1-content"
              >
                <Typography fontWeight={600}>
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography color='text.secondary'>
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          py: 8,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.6)} 0%, ${alpha(theme.palette.secondary.main, 0.6)} 100%)`,
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h3"
            align="center"
            sx={{
              typography: { xs: 'h5', md: 'h4' },
              '&&': {
                fontWeight: 700,
              }
            }}
            gutterBottom
          >
            {t('howItWorksStudents.cta.title')}
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            {t('howItWorksStudents.cta.subtitle')}
          </Typography>
          <Button
            component={Link}
            to="/auth/register/user"
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            sx={{
              bgcolor: 'white',
              color: 'primary.dark',
              py: 1.5,
              px: 4,
              fontSize: '1.1rem',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                bgcolor: alpha('#ffffff', 0.9),
              },
            }}
          >
            {t('howItWorksStudents.cta.createAccount')}
          </Button>
        </Container>
      </Box>
    </Box>
  );
}

export default HowItWorksStudents;

