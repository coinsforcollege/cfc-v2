import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Container, Typography, Button, Stack, Grid, Card, CardContent, Skeleton } from '@mui/material';
import { ArrowForward, TrendingUp, School, Security, Timer } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { collegesApi } from '../../api/colleges.api';
import { blogApi } from '../../api/blog.api';
import collegenIcon from '../../assets/collegen-icon-blue-transparent-bg.svg';
import { useTranslation } from 'react-i18next';

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentActivity, setCurrentActivity] = useState(0);
  const [globalStats, setGlobalStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const rotatingTexts = [
    t('hero.digitalEconomy'),
    t('hero.alumniNetwork'),
    t('hero.blockchainGateway')
  ];

  const getDashboardPath = () => {
    if (!user) return '/auth/register/user';
    if (user.role === 'user') return '/user/dashboard';
    if (user.role === 'college_admin') return '/college-admin/dashboard';
    if (user.role === 'platform_admin') return '/platform-admin/dashboard';
    return '/';
  };

  const getImageUrl = (image) => {
    if (!image) return null;
    const baseUrl = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';
    return image.url?.startsWith('http') ? image.url : `${baseUrl}${image.url}`;
  };

  const truncateText = (text, lines) => {
    if (!text) return '';
    return text;
  };

  // Fetch global stats and generate activities
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await collegesApi.getGlobalStats();
        const stats = response.data;
        setGlobalStats(stats);
        generateActivities(stats);
      } catch (error) {
        console.error('Error fetching global stats:', error);
      }
    };

    const fetchFeaturedPosts = async () => {
      try {
        const response = await blogApi.getPosts({ showOnHomepage: 'true', pageSize: 3 });
        if (response.success) {
          setFeaturedPosts(response.data.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching featured posts:', error);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchStats();
    fetchFeaturedPosts();
  }, []);

  const generateActivities = (stats) => {
    const activityList = [];

    if (stats.topColleges?.byMiners?.[0]) {
      const top = stats.topColleges.byMiners[0];
      activityList.push({
        text: t('hero.earlySupporters', { college: `${top.name} (unaffiliated)`, count: top.stats.totalMiners.toLocaleString() }),
        type: 'supporters',
        college: `${top.name} (unaffiliated)`
      });
    }

    if (stats.recentColleges?.[0]) {
      activityList.push({
        text: t('hero.joinedWaitlist', { college: `${stats.recentColleges[0].name} (unaffiliated)` }),
        type: 'waitlist',
        college: `${stats.recentColleges[0].name} (unaffiliated)`
      });
    }

    if (stats.global?.activeMiners > 0) {
      activityList.push({
        text: t('hero.studentsActiveMining', { count: stats.global.activeMiners.toLocaleString() }),
        type: 'mining',
        college: 'Global'
      });
    }

    if (stats.topColleges?.byTokens?.[0]) {
      const top = stats.topColleges.byTokens[0];
      activityList.push({
        text: t('hero.tokensMined', { college: `${top.name} (unaffiliated)`, tokens: Math.round(top.stats.totalTokensMined).toLocaleString() }),
        type: 'tokens',
        college: `${top.name} (unaffiliated)`
      });
    }

    if (stats.global?.totalColleges > 0) {
      activityList.push({
        text: t('hero.institutionsBuilding', { count: stats.global.totalColleges }),
        type: 'growth',
        college: 'Network'
      });
    }

    if (stats.topColleges?.byMiners?.[1]) {
      const second = stats.topColleges.byMiners[1];
      activityList.push({
        text: t('hero.reachingSupporters', { college: `${second.name} (unaffiliated)`, count: second.stats.totalMiners.toLocaleString() }),
        type: 'milestone',
        college: `${second.name} (unaffiliated)`
      });
    }

    if (stats.global?.activeMiningSessions > 0) {
      activityList.push({
        text: t('hero.activeSessionsNow', { count: stats.global.activeMiningSessions.toLocaleString() }),
        type: 'sessions',
        college: 'Platform'
      });
    }

    if (stats.topColleges?.byTokens?.[1]) {
      const second = stats.topColleges.byTokens[1];
      activityList.push({
        text: t('hero.tokensDistributed', { college: `${second.name} (unaffiliated)`, tokens: Math.round(second.stats.totalTokensMined).toLocaleString() }),
        type: 'distribution',
        college: `${second.name} (unaffiliated)`
      });
    }

    setActivities(activityList.length > 0 ? activityList : [{
      text: t('hero.platformLaunching'),
      type: 'announcement',
      college: 'Platform'
    }]);
  };

  useEffect(() => {
    const textInterval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % rotatingTexts.length);
    }, 3000); // Change text every 3 seconds

    return () => {
      clearInterval(textInterval);
    };
  }, []);

  useEffect(() => {
    if (activities.length === 0) return;

    const activityInterval = setInterval(() => {
      setCurrentActivity((prev) => (prev + 1) % activities.length);
    }, 3000);

    return () => {
      clearInterval(activityInterval);
    };
  }, [activities]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: `url(${collegenIcon})`,
        background: `
          linear-gradient(135deg,
            rgba(155, 184, 224, 0.4) 0%,
            rgba(179, 154, 232, 0.3) 25%,
            rgba(230, 155, 184, 0.3) 50%,
            rgba(155, 214, 195, 0.3) 75%,
            rgba(155, 184, 224, 0.4) 100%
          )
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center, center',
        backgroundRepeat: 'no-repeat, no-repeat',
        filter: 'none',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `url(${collegenIcon})`,
          backgroundSize: '300px 300px',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.15,
          pointerEvents: 'none',
        }
      }}
    >
      <Box sx={{
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        alignItems: 'center',
        minHeight: '100vh',
        px: { xs: 2, md: 4 },
        maxWidth: '1200px',
        mx: 'auto',
        gap: { xs: 2, md: 4 },
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: { xs: 'center', md: 'flex-start' }
      }}>
        <Box sx={{ 
          flex: { xs: 'none', md: '0 0 60%' },
          width: { xs: '100%', md: '60%' },
          mb: { xs: 4, md: 0 }
        }}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Box sx={{ position: 'relative', mb: 3 }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <Typography
                    variant="h1"
                    sx={{
                      fontSize: { xs: '2.5rem', md: '4rem' },
                      fontWeight: 800,
                      color: '#2d3748',
                      lineHeight: 1.1,
                      textShadow: 'none',
                      position: 'relative',
                    }}
                  >
                    {t('hero.launchYourCollege')}{' '}
                    <Box
                      component="span"
                      sx={{
                        position: 'relative',
                        display: 'inline-block',
                        minWidth: { xs: '280px', md: '350px' },
                        height: '1.2em',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={currentTextIndex}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.5 }}
                          style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            background: currentTextIndex === 0 
                              ? 'linear-gradient(135deg, #9bb8e0 0%, #b39ae8 50%, #e69bb8 100%)' // Digital Economy - darker blue to purple to pink
                              : currentTextIndex === 1 
                              ? 'linear-gradient(135deg, #b39ae8 0%, #e69bb8 50%, #9bd6c3 100%)' // Alumni Network - purple to pink to mint
                              : 'linear-gradient(135deg, #ffb347 0%, #ff8c42 50%, #ff6b35 100%)', // Blockchain Gateway - orange to red-orange
                            backgroundSize: '200% 200%',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            animation: 'gradientShift 3s ease-in-out infinite',
                          }}
                        >
                          {rotatingTexts[currentTextIndex]}
                        </motion.span>
                      </AnimatePresence>
                    </Box>
                  </Typography>
                </motion.div>
                
                {/* Floating particles around title */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    pointerEvents: 'none',
                  }}
                >
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      style={{
                        position: 'absolute',
                        width: '4px',
                        height: '4px',
                        borderRadius: '50%',
                        background: 'rgba(155, 184, 224, 0.7)',
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        y: [-10, 10, -10],
                        opacity: [0.3, 1, 0.3],
                      }}
                      transition={{
                        duration: 2 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                      }}
                    />
                  ))}
                </Box>
              </Box>

              <Typography
                sx={{
                  color: '#718096',
                  mb: 4,
                  fontSize: { xs: '1.1rem', md: '1.25rem' },
                  lineHeight: 1.6,
                  maxWidth: '500px',
                }}
              >
                {t('hero.turnkeyInfrastructure')}{' '}
                <Box component="span" sx={{ color: '#8b5cf6', fontWeight: 600 }}>
                  CollegenZ L2
                </Box>
                . {t('hero.weeksNotMonths')}
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4, alignItems: 'center' }}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    component={Link}
                    to="/webinar"
                    variant="contained"
                    size="large"
                    sx={{
                      background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
                      color: '#ffffff',
                      px: 4,
                      py: 2,
                      fontSize: '1.125rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)',
                      flexDirection: 'column',
                      gap: 0,
                      alignItems: 'flex-start'
                    }}
                  >
                    <Box sx={{ fontSize: '0.75rem', fontWeight: 500, opacity: 0.9, lineHeight: 1 }}>
                      Live Briefing
                    </Box>
                    <Box sx={{ lineHeight: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      Enrollment 2030
                      <ArrowForward sx={{ fontSize: '1rem' }} />
                    </Box>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    component={Link}
                    to="/wings-scholarship"
                    variant="contained"
                    size="large"
                    sx={{
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                      color: '#ffffff',
                      px: 4,
                      py: 2,
                      fontSize: '1.125rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)',
                      flexDirection: 'column',
                      gap: 0,
                      alignItems: 'flex-start'
                    }}
                  >
                    <Box sx={{ fontSize: '0.75rem', fontWeight: 500, opacity: 0.9, lineHeight: 1 }}>
                      Apply Now
                    </Box>
                    <Box sx={{ lineHeight: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      CFC Wings Scholarship
                      <ArrowForward sx={{ fontSize: '1rem' }} />
                    </Box>
                  </Button>
                </motion.div>
                {!user && (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      component={Link}
                      to="/auth/register/college"
                      variant="text"
                      size="large"
                      sx={{
                        color: '#718096',
                        px: 2,
                        py: 2,
                        fontSize: '1rem',
                        fontWeight: 600,
                        textTransform: 'none',
                        '&:hover': {
                          color: '#4a5568',
                          backgroundColor: 'transparent',
                          textDecoration: 'underline'
                        },
                      }}
                    >
                      {t('hero.colleges')}: {t('hero.joinWaitlist')}
                    </Button>
                  </motion.div>
                )}
              </Box>
            </motion.div>
        </Box>
        
        <Box sx={{ 
          flex: { xs: 'none', md: '0 0 40%' },
          width: { xs: '100%', md: '40%' },
          display: { xs: 'none', md: 'block' }
        }}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Stack spacing={3}>
                {loadingPosts ? (
                  <>
                    {[1, 2, 3].map((i) => (
                      <Card
                        key={i}
                        sx={{
                          background: 'rgba(255, 255, 255, 0.9)',
                          backdropFilter: 'blur(20px)',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          borderRadius: '16px',
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                        }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                            <Skeleton variant="rectangular" width={64} height={64} sx={{ borderRadius: '12px' }} />
                            <Box sx={{ flex: 1 }}>
                              <Skeleton variant="text" width="80%" height={24} sx={{ mb: 0.5 }} />
                              <Skeleton variant="text" width="100%" height={20} />
                              <Skeleton variant="text" width="60%" height={20} />
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </>
                ) : featuredPosts.length > 0 ? (
                  featuredPosts.map((post, index) => (
                    <Card
                      key={post.id}
                      onClick={() => navigate(`/blog/${post.slug}`)}
                      sx={{
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '16px',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                        cursor: 'pointer',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                        },
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                          {post.featuredImage && (
                            <Box
                              component="img"
                              src={getImageUrl(post.featuredImage)}
                              alt={post.title}
                              sx={{
                                width: '64px',
                                height: '64px',
                                objectFit: 'cover',
                                borderRadius: '12px',
                                flexShrink: 0,
                              }}
                            />
                          )}
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                              variant="h6"
                              sx={{
                                color: '#2d3748',
                                fontWeight: 600,
                                mb: 0.5,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: 'vertical',
                                fontSize: '1rem',
                              }}
                            >
                              {post.title}
                            </Typography>
                            <Typography
                              sx={{
                                color: '#718096',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                lineHeight: 1.4,
                                fontSize: '0.875rem',
                              }}
                            >
                              {post.excerpt || 'Click to read more...'}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <>
                    <Card
                      sx={{
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '16px',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <School sx={{ color: '#9bb8e0', fontSize: '2rem' }} />
                          <Typography variant="h6" sx={{ color: '#2d3748', fontWeight: 600 }}>
                            {t('hero.collegesCount')}
                          </Typography>
                        </Box>
                        <Typography sx={{ color: '#718096' }}>
                          {t('hero.leadingInstitutions')}
                        </Typography>
                      </CardContent>
                    </Card>

                    <Card
                      sx={{
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '16px',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <TrendingUp sx={{ color: '#b39ae8', fontSize: '2rem' }} />
                          <Typography variant="h6" sx={{ color: '#2d3748', fontWeight: 600 }}>
                            {t('hero.tokensDeployed')}
                          </Typography>
                        </Box>
                        <Typography sx={{ color: '#718096' }}>
                          {t('hero.tokensInCirculation')}
                        </Typography>
                      </CardContent>
                    </Card>

                    <Card
                      sx={{
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '16px',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <Security sx={{ color: '#e69bb8', fontSize: '2rem' }} />
                          <Typography variant="h6" sx={{ color: '#2d3748', fontWeight: 600 }}>
                            {t('hero.enterpriseGrade')}
                          </Typography>
                        </Box>
                        <Typography sx={{ color: '#718096' }}>
                          {t('hero.auditedContracts')}
                        </Typography>
                      </CardContent>
                    </Card>
                  </>
                )}
              </Stack>
            </motion.div>
        </Box>
      </Box>
      
      {/* Live Activity Feed - Bottom of Hero */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '90%',
          maxWidth: '800px',
          zIndex: 3,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              p: 2,
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#10b981',
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%': { opacity: 1 },
                    '50%': { opacity: 0.5 },
                    '100%': { opacity: 1 },
                  },
                }}
              />
              <Typography sx={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>
                {t('hero.live')}
              </Typography>
            </Box>
            
            {activities.length > 0 && (
              <motion.div
                key={currentActivity}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
                style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}
              >
                <Timer sx={{ color: '#8b5cf6', fontSize: '16px' }} />
                <Typography
                  sx={{
                    fontSize: '0.9rem',
                    color: '#4a5568',
                    fontWeight: 500,
                  }}
                >
                  {activities[currentActivity]?.text || 'Loading...'}
                </Typography>
              </motion.div>
            )}

            {/* Activity Indicators */}
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {activities.map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    background: index === currentActivity ? '#8b5cf6' : 'rgba(139, 92, 246, 0.3)',
                    transition: 'all 0.3s ease',
                  }}
                />
              ))}
            </Box>
          </Box>
        </motion.div>
      </Box>
    </Box>
  );
};

export default HeroSection;
