import React, { useState } from 'react';
import { Link } from 'react-router';
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

const steps = [
  {
    label: 'Create Your Account',
    description: 'Sign up with your email and verify your student status',
    details: 'Enter your basic information including name, email, and phone number. You\'ll receive verification codes to confirm your identity.',
  },
  {
    label: 'Select Your College',
    description: 'Choose your college from our comprehensive list',
    details: 'Search for your college in our database. If it\'s not listed, you can add it and be the first miner from your institution!',
  },
  {
    label: 'Verify Your Identity',
    description: 'Complete email and phone verification',
    details: 'We send verification codes to your email and phone to ensure account security and prevent fraud.',
  },
  {
    label: 'Start Mining',
    description: 'Begin earning tokens every 24 hours',
    details: 'Click the "Mine Now" button daily to earn tokens for your college. Build your streak for bonus rewards!',
  },
];

const faqs = [
  {
    question: 'How often can I mine tokens?',
    answer: 'You can mine tokens once every 24 hours. The more consecutive days you mine, the higher your mining streak and potential bonuses.',
  },
  {
    question: 'Are these real cryptocurrency tokens?',
    answer: 'Currently, these are interest tokens that represent student engagement. When your college admin configures the token and launches it, these may be converted to actual blockchain tokens.',
  },
  {
    question: 'Can I switch to a different college?',
    answer: 'Yes, but switching colleges will reset your mining progress and tokens. We recommend staying with your actual college for the best experience.',
  },
  {
    question: 'Is there a cost to participate?',
    answer: 'No! Mining tokens is completely free. We never ask for payment or credit card information from students.',
  },
  {
    question: 'What happens if I miss a day of mining?',
    answer: 'Your streak will reset, but you won\'t lose your accumulated tokens. You can start building your streak again from day one.',
  },
  {
    question: 'How secure is my information?',
    answer: 'We use industry-standard encryption and security practices. We never share your personal information without your consent.',
  },
];

function HowItWorksStudents() {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);

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
            How It Works for Students
          </Typography>
          <Typography
            variant="h6"
            align="center"
            color="text.secondary"
            sx={{ maxWidth: '700px', mx: 'auto' }}
          >
            Everything you need to know about mining college tokens and building your crypto future
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
          Step-by-Step Process
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
                        {index === steps.length - 1 ? 'Finish' : 'Continue'}
                      </Button>
                      <Button
                        disabled={index === 0}
                        onClick={handleBack}
                        sx={{ mt: 1, mr: 1, textTransform: 'none' }}
                      >
                        Back
                      </Button>
                    </Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
            {activeStep === steps.length && (
              <Paper square elevation={0} sx={{ p: 3 }}>
                <Typography sx={{ mb: 2 }}>
                  All steps completed - you&apos;re ready to start mining!
                </Typography>
                <Button onClick={handleReset} sx={{ textTransform: 'none' }}>
                  Reset
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
            What is Token Mining?
          </Typography>
          <Typography color="text.secondary" align="center" sx={{ mb: 6, maxWidth: '800px', mx: 'auto', fontSize: '1.1rem' }}>
            Token mining is your way to earn and support your college&apos;s cryptocurrency
          </Typography>

          <Grid container spacing={4}>
            {[
              {
                icon: Token,
                title: 'Daily Mining',
                description: 'Mine tokens once every 24 hours by clicking the "Mine Now" button. It takes just seconds!',
              },
              {
                icon: TrendingUp,
                title: 'Build Your Streak',
                description: 'Consecutive days of mining increase your rewards. The longer your streak, the more you earn!',
              },
              {
                icon: EmojiEvents,
                title: 'Compete & Earn',
                description: 'Climb the leaderboard and earn bonus tokens. Top miners get special recognition and rewards.',
              },
              {
                icon: Security,
                title: 'Secure & Safe',
                description: 'Your tokens are tracked securely. When your college launches, you\'ll be first in line to receive real tokens.',
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
          What Can I Do with Tokens?
        </Typography>
        <Typography color="text.secondary" align="center" sx={{ mb: 6, maxWidth: '800px', mx: 'auto', fontSize: '1.1rem' }}>
          Your tokens have real value and utility on your campus
        </Typography>

        <Grid container spacing={4}>
          {[
            {
              icon: AccountBalance,
              title: 'Campus Purchases',
              description: 'Use tokens at campus dining halls, bookstores, and vending machines.',
              color: 'primary',
            },
            {
              icon: EmojiEvents,
              title: 'Event Access',
              description: 'Get priority access to sports events, concerts, and exclusive campus activities.',
              color: 'secondary',
            },
            {
              icon: Share,
              title: 'Trade & Share',
              description: 'Trade tokens with other students or gift them to friends on campus.',
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
            How Do Referrals Work?
          </Typography>
          <Typography variant="h6" color="text.secondary" align="center" sx={{ mb: 6, maxWidth: '800px', mx: 'auto', fontSize: '1.1rem' }}>
            Earn bonus tokens by inviting your friends to join
          </Typography>

          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Card elevation={2} sx={{ p: 4 }}>
                <Stack spacing={3}>
                  {[
                    {
                      step: '1',
                      title: 'Get Your Referral Code',
                      desc: 'Find your unique referral code in your dashboard',
                    },
                    {
                      step: '2',
                      title: 'Share with Friends',
                      desc: 'Send your code via text, social media, or email',
                    },
                    {
                      step: '3',
                      title: 'They Sign Up',
                      desc: 'Your friend creates an account using your code',
                    },
                    {
                      step: '4',
                      title: 'Both Earn Bonus',
                      desc: 'You and your friend both receive bonus tokens!',
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
                  Unlimited Referrals
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  There&apos;s no limit to how many friends you can invite. The more you share, the more you earn!
                </Typography>
                <Button
                  component={Link}
                  to="/auth/register/student"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                  sx={{ textTransform: 'none', py: 1.5, px: 4 }}
                >
                  Get Started Now
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
          Frequently Asked Questions
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
            Ready to Start Mining?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Join thousands of students already earning tokens for their college
          </Typography>
          <Button
            component={Link}
            to="/auth/register/student"
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
            Create Your Account
          </Button>
        </Container>
      </Box>
    </Box>
  );
}

export default HowItWorksStudents;

