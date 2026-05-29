import React from 'react';
import { Box, Typography, Button, Stack, Card, CardContent } from '@mui/material';
import { motion } from 'framer-motion';

export const IndiaHero = () => (
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
            RESEARCH BRIEFING · JULY 7, 2026 · ONLINE
          </Typography>
          <Typography variant="h1" sx={{ fontSize: { xs: '2.5rem', md: '4rem' }, fontWeight: 800, mb: 3, lineHeight: 1.1, color: '#2d3748' }}>
            The 2030 India{' '}
            <Box component="span" sx={{
              background: 'linear-gradient(135deg, #9bb8e0 0%, #b39ae8 50%, #e69bb8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Enrollment Opportunity
            </Box>
          </Typography>
          <Typography sx={{ color: '#718096', fontSize: { xs: '1.1rem', md: '1.25rem' }, lineHeight: 1.6, mb: 4, maxWidth: '600px' }}>
            The largest higher education enrollment wave in human history is forming. The private universities that position now will capture a disproportionate share of it.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button href="https://events.coinsforcollege.org/events/2030-india-enrollment-opportunity" target="_blank" rel="noopener noreferrer" variant="contained" size="large" sx={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                color: '#ffffff', px: 4, py: 2, fontSize: '1.125rem', fontWeight: 600,
                textTransform: 'none', borderRadius: '12px', boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)'
              }}>
                Register for the Briefing
              </Button>
            </motion.div>
          </Stack>
          <Typography sx={{ color: '#a0aec0', fontSize: '0.875rem', mt: 2 }}>
            Complimentary registration · Live + on-demand
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
              src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
              alt="University"
              sx={{ width: '100%', height: 'auto', display: 'block', aspectRatio: '4/3', objectFit: 'cover' }}
            />
          </Box>
        </motion.div>
      </Box>
    </Box>
  </Box>
);

export const IndiaEvidence = () => {
  const stats = [
    { number: '50%', text: 'National target for gross enrollment ratio by 2035' },
    { number: '4.33 cr', text: 'Current students enrolled, rising past 9 crore by 2035' },
    { number: '1,200+', text: 'Universities operating, with hundreds more expected' },
    { number: 'Largest', text: 'Market for tertiary education students in the world' }
  ];
  return (
    <Box sx={{ py: 12, bgcolor: '#ffffff' }}>
      <Box sx={{ maxWidth: '1200px', mx: 'auto', px: { xs: 2, md: 4 } }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, flexWrap: 'wrap' }}>
          {stats.map((stat, i) => (
            <Box key={i} sx={{ flex: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(25% - 24px)' } }}>
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1 }} style={{ height: '100%' }}>
                <Card sx={{ height: '100%', background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(20px)', border: '1px solid rgba(226, 232, 240, 0.8)', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)' }}>
                  <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, color: '#2d3748' }}>
                      {stat.number}
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

export const IndiaArgument = () => (
  <Box sx={{ py: 16, bgcolor: '#f7fafc' }}>
    <Box sx={{ maxWidth: '800px', mx: 'auto', px: { xs: 2, md: 4 } }}>
      <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
        <Typography variant="overline" sx={{ color: '#8b5cf6', fontWeight: 700, letterSpacing: 2, mb: 2, display: 'block', textAlign: 'center' }}>
          THE STRATEGIC WINDOW
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 800, color: '#2d3748', mb: 6, textAlign: 'center', lineHeight: 1.2 }}>
          India is approaching the largest higher education enrollment wave any country has ever seen.
        </Typography>
        <Box sx={{ '& p': { mb: 4, fontSize: '1.25rem', lineHeight: 1.8, color: '#4a5568' } }}>
          <Typography paragraph>
            The National Education Policy 2020 has set a target of fifty percent gross enrollment ratio by 2035, nearly double the current figure. The 18-year-old population that will fill those seats is the largest cohort in human history.
          </Typography>
          <Box sx={{ my: 6, p: 4, background: 'rgba(139,92,246,0.05)', borderRadius: '16px', borderLeft: '4px solid #8b5cf6' }}>
            <Typography sx={{ fontStyle: 'italic', color: '#2d3748', fontSize: '1.2rem', fontWeight: 600, lineHeight: 1.6 }}>
              "The institutions that act on this wave in the next twenty-four months will spend the rest of the decade absorbing the students the slower movers never reach."
            </Typography>
          </Box>
          <Typography paragraph>
            Inside that opportunity, two distinct dynamics are reshaping the playing field: a generation that is AI-native and willing to evaluate higher education against a wider field of alternatives, and a structural shift in how a generation builds trust with institutions.
          </Typography>
        </Box>
      </motion.div>
    </Box>
  </Box>
);

export const IndiaAgenda = () => {
  const modules = [
    { title: 'The Demographic Wave', text: 'The 50% GER target and the 18-year-old population trajectory.' },
    { title: 'The Behavioral Shift', text: 'What this generation believes about higher education and where beliefs form.' },
    { title: 'AI & The Value Proposition', text: 'Student AI adoption patterns and changing skill expectations.' },
    { title: 'What Universities Still Deliver', text: 'Identity formation, peer networks, mentorship, and citizenship.' },
    { title: 'The Decision Window', text: 'Why university choice forms earlier than admissions cycles assume.' },
    { title: 'Emerging Frameworks', text: 'What early-moving private universities are testing right now.' }
  ];
  return (
    <Box sx={{ py: 16, bgcolor: '#ffffff' }}>
      <Box sx={{ maxWidth: '1200px', mx: 'auto', px: { xs: 2, md: 4 } }}>
        <Typography variant="h2" align="center" sx={{ fontWeight: 800, mb: 8, color: '#2d3748', fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
          The Briefing Agenda
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, flexWrap: 'wrap', gap: 4 }}>
          {modules.map((mod, i) => (
            <Box key={i} sx={{ flex: { xs: '100%', md: 'calc(33.333% - 22px)' } }}>
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} style={{ height: '100%' }}>
                <Card sx={{ height: '100%', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', border: '1px solid rgba(226,232,240,0.8)', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                  <CardContent sx={{ p: 4 }}>
                    <Typography sx={{ color: '#8b5cf6', fontWeight: 800, mb: 1, fontSize: '1rem' }}>0{i + 1}</Typography>
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

export const IndiaAudience = () => (
  <Box sx={{ py: 16, bgcolor: '#f7fafc' }}>
    <Box sx={{ maxWidth: '1200px', mx: 'auto', px: { xs: 2, md: 4 } }}>
      <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
        <Typography variant="h2" align="center" sx={{ fontWeight: 800, mb: 3, color: '#2d3748', fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
          Who is in the room?
        </Typography>
        <Typography align="center" sx={{ color: '#718096', mb: 8, fontSize: '1.15rem', maxWidth: '700px', mx: 'auto' }}>
          From established research universities to ambitious growing institutions, the leaders shaping the next chapter of Indian higher education.
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          {['Academic Leadership', 'Growth & Strategy', 'The Pipeline'].map((title, i) => (
            <Box key={i} sx={{ flex: 1, p: 4, background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#2d3748' }}>{title}</Typography>
              <Box component="ul" sx={{ pl: 2, m: 0, '& li': { mb: 1.5, color: '#4a5568', fontSize: '1rem' } }}>
                {i === 0 && <><li>Vice-chancellors</li><li>Registrars</li><li>Deans of faculty</li><li>Governing council members</li></>}
                {i === 1 && <><li>Directors of admissions</li><li>Directors of marketing</li><li>Vice-presidents of strategy</li><li>Institutional research</li></>}
                {i === 2 && <><li>Principals of CBSE, ICSE, IB</li><li>Career counselors</li><li>Heads of school</li><li>Education consultants</li></>}
              </Box>
            </Box>
          ))}
        </Box>
      </motion.div>
    </Box>
  </Box>
);

export const IndiaDeliverables = () => null;
export const IndiaCredibility = () => null;
export const IndiaTestimonials = () => null;
