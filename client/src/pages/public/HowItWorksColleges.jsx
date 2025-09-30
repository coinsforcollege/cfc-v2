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
} from '@mui/icons-material';

const signupSteps = [
  {
    icon: School,
    title: 'Verify Your College',
    description: 'Search for your college or add it to our database',
    details: 'Use your official college email address (@collegename.edu) to verify your affiliation with the institution.',
  },
  {
    icon: Verified,
    title: 'Complete Admin Profile',
    description: 'Provide your position and contact information',
    details: 'We verify your role at the college to ensure legitimate administration access. This process typically takes 24-48 hours.',
  },
  {
    icon: Settings,
    title: 'Configure College Profile',
    description: 'Upload logo and set basic information',
    details: 'Add your college logo, website, address, and other essential details that students will see on your profile page.',
  },
  {
    icon: Token,
    title: 'Setup Your Token',
    description: 'Define token parameters and use cases',
    details: 'Configure your token name, ticker symbol, supply, and explain how students can earn and spend tokens on campus.',
  },
];

const benefits = [
  {
    icon: Group,
    title: 'Student Engagement',
    description: 'Build a vibrant community of engaged students before token launch',
    metric: '2,847 avg students per college',
  },
  {
    icon: TrendingUp,
    title: 'Growth Tracking',
    description: 'Monitor student interest and engagement in real-time',
    metric: '15-20% monthly growth',
  },
  {
    icon: BarChart,
    title: 'Data & Analytics',
    description: 'Access detailed insights about student demographics and behavior',
    metric: '50+ data points tracked',
  },
  {
    icon: Security,
    title: 'Secure Platform',
    description: 'Enterprise-grade security and compliance standards',
    metric: 'Bank-level encryption',
  },
];

const caseStudies = [
  {
    college: 'MIT',
    students: 2847,
    status: 'Token Configured',
    achievement: 'Reached 2,000 students in first 3 months',
    quote: 'The platform helped us gauge student interest before making significant investments in blockchain infrastructure.',
  },
  {
    college: 'Stanford University',
    students: 2653,
    status: 'Admin Verified',
    achievement: '90% student retention rate',
    quote: 'Our students are excited about the future of campus tokens. The engagement metrics are incredible.',
  },
  {
    college: 'UC Berkeley',
    students: 2287,
    status: 'Token Configured',
    achievement: 'Integrated with campus payment systems',
    quote: 'This platform provides the perfect bridge between student interest and actual token deployment.',
  },
];

const faqs = [
  {
    question: 'What is the cost to participate?',
    answer: 'The platform is completely free for colleges during the beta phase. We help you build student engagement at no cost while you prepare for token launch.',
  },
  {
    question: 'How do we verify our college admin status?',
    answer: 'You must sign up with an official college email address and provide your position/title. Our team reviews applications within 24-48 hours.',
  },
  {
    question: 'Can we customize our token parameters later?',
    answer: 'Yes! You can update token name, supply, use cases, and other parameters at any time before the official launch.',
  },
  {
    question: 'What data do we get access to?',
    answer: 'You can see student mining activity, demographics, referral networks, engagement metrics, and export all data to CSV for analysis.',
  },
  {
    question: 'How do we launch the actual token?',
    answer: 'Once you\'ve configured your token and built sufficient student interest, we provide guidance on blockchain deployment and token distribution.',
  },
  {
    question: 'What if students leave or graduate?',
    answer: 'Student accounts remain active as long as they maintain engagement. Graduated students can optionally keep their tokens or transfer them.',
  },
];

function HowItWorksColleges() {
  const theme = useTheme();

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
            How It Works for Colleges
          </Typography>
          <Typography
            variant="h6"
            align="center"
            color="text.secondary"
            sx={{ maxWidth: '700px', mx: 'auto' }}
          >
            Launch your college token with confidence by building student engagement first
          </Typography>
        </Container>
      </Box>

      {/* Admin Signup Process */}
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
          Admin Signup Process
        </Typography>
        <Typography variant="h6" color="text.secondary" align="center" sx={{ mb: 6, maxWidth: '800px', mx: 'auto', fontSize: '1.1rem' }}>
          Get started in minutes with our streamlined onboarding process
        </Typography>

        <Grid container spacing={4}>
          {signupSteps.map((step, index) => (
            <Grid size={{ xs: 12, md: 6 }} key={index}>
              <Card
                elevation={2}
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  p: 3,
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                  },
                }}
              >
                <Chip
                  label={`Step ${index + 1}`}
                  color="primary"
                  sx={{ position: 'absolute', top: 16, right: 16, fontWeight: 600 }}
                />
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    mx: 'auto',
                    mb: 2,
                    bgcolor: alpha(theme.palette.secondary.main, 0.1),
                    color: 'secondary.main',
                  }}
                >
                  <step.icon fontSize="large" />
                </Avatar>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {step.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {step.description}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="caption" color="text.secondary">
                  {step.details}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Token Configuration Walkthrough */}
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
            Token Configuration Walkthrough
          </Typography>
          <Typography color="text.secondary" align="center" sx={{ mb: 6, maxWidth: '800px', mx: 'auto', fontSize: '1.1rem' }}>
            Design your token with complete flexibility
          </Typography>

          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Stack spacing={3}>
                {[
                  {
                    title: 'Token Identity',
                    items: ['Choose token name', 'Set ticker symbol (3-5 characters)', 'Upload token logo'],
                  },
                  {
                    title: 'Token Economics',
                    items: ['Define max supply', 'Set initial distribution', 'Configure mining rewards'],
                  },
                  {
                    title: 'Earning Mechanisms',
                    items: ['Daily login rewards', 'Event attendance', 'Academic achievements', 'Community service'],
                  },
                  {
                    title: 'Spending Options',
                    items: ['Campus dining', 'Bookstore purchases', 'Event tickets', 'Parking fees'],
                  },
                ].map((section, index) => (
                  <Paper key={index} elevation={2} sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight={700} gutterBottom color="primary">
                      {section.title}
                    </Typography>
                    <Stack spacing={1}>
                      {section.items.map((item, idx) => (
                        <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CheckCircle fontSize="small" color="success" />
                          <Typography variant="body2">{item}</Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 8 }}>
              <Card
                elevation={2}
                sx={{
                  height: '100%',
                  background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
                  p: 4,
                }}
              >
                <Typography variant="h5" fontWeight={700} gutterBottom>
                  Configuration Tips
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                      💡 Start Simple
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      You can always add more features later. Begin with basic earning and spending options.
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                      🎯 Be Specific
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Clearly define how students earn and spend tokens. Transparency builds trust and engagement.
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                      📊 Monitor & Adjust
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Use our analytics to see what resonates with students and adjust your token parameters accordingly.
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                      🚀 Plan for Growth
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Set a token supply that can accommodate future growth while maintaining value.
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Student Data & Analytics */}
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
          Student Data & Analytics Overview
        </Typography>
        <Typography color="text.secondary" align="center" sx={{ mb: 6, maxWidth: '800px', mx: 'auto', fontSize: '1.1rem' }}>
          Make data-driven decisions with comprehensive insights
        </Typography>

        <Grid container spacing={4}>
          {[
            {
              icon: Dashboard,
              title: 'Real-Time Dashboard',
              metrics: ['Active students', 'Daily mining rate', 'Engagement trends', 'Referral activity'],
            },
            {
              icon: Assessment,
              title: 'Detailed Reports',
              metrics: ['Student demographics', 'Graduation year breakdown', 'Geographic distribution', 'Activity heatmaps'],
            },
            {
              icon: BarChart,
              title: 'Growth Analytics',
              metrics: ['Week-over-week growth', 'Retention rates', 'Peak activity times', 'Viral coefficient'],
            },
          ].map((item, index) => (
            <Grid size={{ xs: 12, md: 4 }} key={index}>
              <Card elevation={2} sx={{ height: '100%', p: 3 }}>
                <Avatar
                  sx={{
                    width: 56,
                    height: 56,
                    mb: 2,
                    bgcolor: 'primary.main',
                  }}
                >
                  <item.icon fontSize="large" />
                </Avatar>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                  {item.title}
                </Typography>
                <Stack spacing={1} sx={{ mt: 2 }}>
                  {item.metrics.map((metric, idx) => (
                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircle fontSize="small" color="success" />
                      <Typography variant="body2">{metric}</Typography>
                    </Box>
                  ))}
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Why Should Colleges Participate */}
      <Box sx={{ bgcolor: alpha(theme.palette.primary.main, 0.03), py: 8 }}>
        <Container maxWidth="lg">
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
            Why Should Colleges Participate?
          </Typography>

          <Grid container spacing={4}>
            {benefits.map((benefit, index) => (
              <Grid size={{ xs: 12, md: 6 }} key={index}>
                <Card
                  elevation={2}
                  sx={{
                    p: 3,
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: alpha(theme.palette.secondary.main, 0.1),
                        color: 'secondary.main',
                        width: 56,
                        height: 56,
                      }}
                    >
                      <benefit.icon fontSize="large" />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" fontWeight={700} gutterBottom>
                        {benefit.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {benefit.description}
                      </Typography>
                      <Chip label={benefit.metric} color="primary" size="small" />
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Case Studies */}
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
          Success Stories
        </Typography>
        <Typography color="text.secondary" align="center" sx={{ mb: 6, maxWidth: '800px', mx: 'auto', fontSize: '1.1rem' }}>
          See how leading colleges are building their token communities
        </Typography>

        <Grid container spacing={4}>
          {caseStudies.map((study, index) => (
            <Grid size={{ xs: 12, md: 4 }} key={index}>
              <Card
                elevation={2}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <CardContent sx={{ flex: 1, p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h5" fontWeight={700}>
                      {study.college}
                    </Typography>
                    <Chip label={study.status} color="success" size="small" />
                  </Box>
                  <Typography variant="h4" fontWeight={700} color="primary.main" gutterBottom>
                    {study.students.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Students Mining
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom color="success.main">
                    🎯 {study.achievement}
                  </Typography>
                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                      borderRadius: 2,
                      borderLeft: `4px solid ${theme.palette.primary.main}`,
                    }}
                  >
                    <Typography variant="body2" fontStyle="italic" color="text.secondary">
                      &quot;{study.quote}&quot;
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

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
          FAQ for Administrators
        </Typography>

        <div>
          {faqs.map((faq, index) => (
            <Accordion
              key={index}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
              >
                <Typography fontWeight={600}>
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography color="text.secondary">
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      </Container >

      {/* CTA Section */}
      < Box
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
            Ready to Launch Your College Token?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Join leading colleges building the future of campus tokens
          </Typography>
          <Button
            component={Link}
            to="/auth/register/admin"
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
            Register Your College
          </Button>
        </Container>
      </Box >
    </Box >
  );
}

export default HowItWorksColleges;

