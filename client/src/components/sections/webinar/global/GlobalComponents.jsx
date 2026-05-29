import React from 'react';
import { Box, Typography, Button, Stack, Card, CardContent } from '@mui/material';
import { motion } from 'framer-motion';

export const GlobalHero = () => (
  <Box sx={{
    minHeight: { xs: 'auto', md: '100vh' },
    display: 'flex',
    alignItems: 'center',
    background: `linear-gradient(135deg, rgba(155, 184, 224, 0.2) 0%, rgba(179, 154, 232, 0.15) 25%, rgba(230, 155, 184, 0.15) 50%, rgba(155, 214, 195, 0.15) 75%, rgba(155, 184, 224, 0.2) 100%)`,
    position: 'relative',
    pt: { xs: 12, md: 0 }
  }}>
    <Box sx={{
      position: 'relative',
      zIndex: 2,
      display: 'flex',
      alignItems: 'center',
      minHeight: { xs: 'auto', md: '100vh' },
      px: { xs: 2, md: 4 },
      py: { xs: 6, md: 0 },
      maxWidth: '1200px',
      mx: 'auto',
      gap: { xs: 4, md: 8 },
      flexDirection: { xs: 'column', md: 'row' },
      justifyContent: { xs: 'center', md: 'space-between' }
    }}>
      <Box sx={{ flex: { xs: 'none', md: '0 0 55%' }, width: { xs: '100%', md: '55%' }, mb: { xs: 4, md: 0 } }}>
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
          <Typography variant="overline" sx={{ color: '#8b5cf6', fontWeight: 700, letterSpacing: 2, mb: 2, display: 'block' }}>
            LIVE BRIEFING · JULY 7, 2026
          </Typography>
          <Typography variant="h1" sx={{ fontSize: { xs: '2.5rem', md: '4.5rem' }, fontWeight: 800, mb: 3, lineHeight: 1.1, color: '#2d3748' }}>
            The Class of 2030 is in{' '}
            <Box component="span" sx={{
              background: 'linear-gradient(135deg, #9bb8e0 0%, #b39ae8 50%, #e69bb8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              eighth grade right now.
            </Box>
          </Typography>
          <Typography sx={{ color: '#718096', fontSize: { xs: '1.1rem', md: '1.25rem' }, lineHeight: 1.6, mb: 4, maxWidth: '600px' }}>
            They have already begun deciding which colleges exist. A briefing on the structural shift reshaping enrollment.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button href="#" variant="contained" size="large" sx={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                color: '#ffffff', px: 4, py: 2, fontSize: '1.125rem', fontWeight: 600,
                textTransform: 'none', borderRadius: '12px', boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)'
              }}>
                Reserve Your Seat
              </Button>
            </motion.div>
          </Stack>
          <Typography sx={{ color: '#a0aec0', fontSize: '0.875rem', mt: 2 }}>
            Free · 90 minutes · Recording sent to all attendees
          </Typography>
        </motion.div>
      </Box>

      <Box sx={{ flex: { xs: 'none', md: '0 0 45%' }, width: { xs: '100%', md: '45%' } }}>
        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
          <Box sx={{
            position: 'relative',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 24px 48px rgba(0,0,0,0.12)',
            border: '1px solid rgba(255,255,255,0.4)',
            '&::after': {
              content: '""',
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.2), transparent)',
              pointerEvents: 'none'
            }
          }}>
            <Box
              component="img"
              src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
              alt="Students"
              sx={{ width: '100%', height: 'auto', display: 'block', aspectRatio: '4/3', objectFit: 'cover' }}
            />
          </Box>
        </motion.div>
      </Box>
    </Box>
  </Box>
);

export const GlobalStats = () => {
  const numbers = [
    { num: '576K', text: 'Fewer college students between 2025 and 2029' },
    { num: '36%', text: 'Americans with confidence in higher education' },
    { num: '5.8%', text: 'Recent graduate unemployment, a 40-year high' },
    { num: '92%', text: 'University students using AI tools' }
  ];
  return (
    <Box sx={{ py: 12, bgcolor: '#ffffff' }}>
      <Box sx={{ maxWidth: '1200px', mx: 'auto', px: { xs: 2, md: 4 } }}>
        <Typography align="center" sx={{ color: '#8b5cf6', fontWeight: 700, letterSpacing: 2, mb: 8, fontSize: '0.9rem', textTransform: 'uppercase' }}>
          The data has moved. Most planning has not.
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, flexWrap: 'wrap' }}>
          {numbers.map((stat, i) => (
            <Box key={i} sx={{ flex: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(25% - 24px)' } }}>
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1 }} style={{ height: '100%' }}>
                <Card sx={{ height: '100%', background: '#f7fafc', border: '1px solid rgba(226, 232, 240, 0.8)', borderRadius: '16px', boxShadow: 'none' }}>
                  <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, color: '#2d3748' }}>
                      {stat.num}
                    </Typography>
                    <Typography sx={{ color: '#718096', fontSize: '0.95rem', lineHeight: 1.5 }}>{stat.text}</Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export const GlobalStatement = () => (
  <Box sx={{ py: 16, bgcolor: '#f7fafc' }}>
    <Box sx={{ maxWidth: '800px', mx: 'auto', px: { xs: 2, md: 4 } }}>
      <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
        <Box sx={{ '& p': { mb: 4, fontSize: '1.5rem', lineHeight: 1.6, color: '#4a5568', textAlign: 'center', fontWeight: 500 } }}>
          <Typography paragraph>
            College has never been about academics alone. The lecture was always the part technology could eventually copy.
          </Typography>
          <Typography paragraph sx={{ fontWeight: 800, color: '#2d3748', fontSize: '2rem' }}>
            That product still works.
          </Typography>
          <Typography paragraph>
            The buyer simply stopped believing she needs to walk through your door to get it.
          </Typography>
        </Box>
      </motion.div>
    </Box>
  </Box>
);

export const GlobalShift = () => null;

export const GlobalAgenda = () => {
  const modules = [
    { title: 'The Demographic Floor', text: 'The WICHE projections and the 576,000-student gap.' },
    { title: 'The Behavioral Shift', text: 'The gap between what families say and what they do.' },
    { title: 'AI & The Value Proposition', text: 'Student AI adoption data and entry-level job displacement.' },
    { title: 'What College Still Delivers', text: 'Friendships, marriage formation, mobility, and identity.' },
    { title: 'The Decision Window', text: 'Why college choice forms earlier than cycles assume.' },
    { title: 'Emerging Frameworks', text: 'What early-moving institutions are testing right now.' }
  ];
  return (
    <Box sx={{ py: 16, bgcolor: '#ffffff' }}>
      <Box sx={{ maxWidth: '1200px', mx: 'auto', px: { xs: 2, md: 4 } }}>
        <Typography variant="h2" align="center" sx={{ fontWeight: 800, mb: 8, color: '#2d3748', fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
          What we will walk through.
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, flexWrap: 'wrap', gap: 4 }}>
          {modules.map((mod, i) => (
            <Box key={i} sx={{ flex: { xs: '100%', md: 'calc(33.333% - 22px)' } }}>
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} style={{ height: '100%' }}>
                <Card sx={{ height: '100%', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: 'none' }}>
                  <CardContent sx={{ p: 4 }}>
                    <Typography sx={{ color: '#8b5cf6', fontWeight: 800, mb: 1, fontSize: '1rem', opacity: 0.8 }}>0{i + 1}</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5, color: '#2d3748' }}>{mod.title}</Typography>
                    <Typography sx={{ color: '#718096', lineHeight: 1.6, fontSize: '0.95rem' }}>{mod.text}</Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export const GlobalAudience = () => (
  <Box sx={{ py: 16, bgcolor: '#f7fafc' }}>
    <Box sx={{ maxWidth: '1200px', mx: 'auto', px: { xs: 2, md: 4 } }}>
      <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
        <Typography variant="h2" align="center" sx={{ fontWeight: 800, mb: 8, color: '#2d3748', fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
          Built for leaders.
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          {['Leadership', 'Enrollment & Strategy', 'The Pipeline'].map((title, i) => (
            <Box key={i} sx={{ flex: 1, p: 4, background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#2d3748' }}>{title}</Typography>
              <Box component="ul" sx={{ pl: 2, m: 0, '& li': { mb: 1.5, color: '#4a5568', fontSize: '1rem' } }}>
                {i === 0 && <><li>Presidents</li><li>Provosts</li><li>Board members</li></>}
                {i === 1 && <><li>VPs of enrollment</li><li>Directors of admissions</li><li>VPs of advancement</li></>}
                {i === 2 && <><li>High school counselors</li><li>Middle school counselors</li><li>Educational consultants</li></>}
              </Box>
            </Box>
          ))}
        </Box>
      </motion.div>
    </Box>
  </Box>
);

export const GlobalDeliverables = () => null;
