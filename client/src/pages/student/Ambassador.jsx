import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper
} from '@mui/material';
import {
  Campaign,
  CheckCircle,
  HourglassEmpty,
  Cancel,
  Send,
  EmojiEvents,
  TrendingUp,
  Groups,
  AutoAwesome,
  CheckCircleOutline,
  Schedule,
  Instagram,
  Twitter,
  LinkedIn
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { ambassadorApi } from '../../api/ambassador.api';
import DashboardLayout from '../../layouts/DashboardLayout';

const Ambassador = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'student') {
      navigate('/auth/login');
      return;
    }

    fetchApplication();
  }, [user, navigate]);

  const fetchApplication = async () => {
    try {
      setLoading(true);
      const response = await ambassadorApi.getMyApplication();
      if (response.success && response.data) {
        setApplication(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch application:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'pending':
      case 'under_review':
        return {
          icon: HourglassEmpty,
          color: '#f59e0b',
          bg: 'rgba(245, 158, 11, 0.1)',
          text: 'Application Under Review',
          description: 'Our team is reviewing your application. We\'ll get back to you soon!'
        };
      case 'approved':
        return {
          icon: CheckCircle,
          color: '#22c55e',
          bg: 'rgba(34, 197, 94, 0.1)',
          text: 'Application Approved',
          description: 'Congratulations! You are now an official Campus Ambassador.'
        };
      case 'rejected':
        return {
          icon: Cancel,
          color: '#ef4444',
          bg: 'rgba(239, 68, 68, 0.1)',
          text: 'Application Not Approved',
          description: 'Unfortunately, your application was not approved this time.'
        };
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <DashboardLayout stats={{}}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }

  const sidebarStats = {
    collegesCount: 0,
    referralsCount: 0,
  };

  // No Application - Show Program Benefits
  if (!application) {
    return (
      <DashboardLayout stats={sidebarStats} searchPlaceholder="Search...">
        <Box sx={{ maxWidth: '1000px', width: '100%', mx: 'auto' }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
            Campus Ambassador Program
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Lead the future of campus digital economies and earn exclusive rewards
          </Typography>

          {/* Hero Card */}
          <Card sx={{
            mb: 4,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)',
            overflow: 'hidden',
            position: 'relative'
          }}>
            <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Box sx={{
                  width: 64,
                  height: 64,
                  borderRadius: 2,
                  background: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(10px)'
                }}>
                  <Campaign sx={{ fontSize: 36, color: 'white' }} />
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                    Become a Campus Ambassador
                  </Typography>
                  <Typography sx={{ opacity: 0.95, fontSize: '0.95rem' }}>
                    Join an elite network of student leaders
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="contained"
                size="large"
                startIcon={<Send />}
                onClick={() => navigate('/ambassador/apply')}
                sx={{
                  background: 'white',
                  color: '#667eea',
                  fontWeight: 700,
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.95)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)'
                  }
                }}
              >
                Apply Now
              </Button>
            </CardContent>
          </Card>

          {/* Benefits Grid */}
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
            gap: 3,
            mb: 4
          }}>
            {[
              {
                icon: EmojiEvents,
                title: 'Exclusive Perks',
                description: 'Early access to features, special events, and ambassador-only rewards',
                color: '#f59e0b',
                bg: 'rgba(245, 158, 11, 0.1)'
              },
              {
                icon: TrendingUp,
                title: 'Build Your Resume',
                description: 'Gain valuable leadership experience and professional development',
                color: '#8b5cf6',
                bg: 'rgba(139, 92, 246, 0.1)'
              },
              {
                icon: Groups,
                title: 'Growing Network',
                description: 'Connect with ambassadors from colleges across the country',
                color: '#ec4899',
                bg: 'rgba(236, 72, 153, 0.1)'
              },
              {
                icon: AutoAwesome,
                title: 'Extra Token Rewards',
                description: 'Earn bonus tokens and special mining rate boosts',
                color: '#06b6d4',
                bg: 'rgba(6, 182, 212, 0.1)'
              }
            ].map((benefit, index) => (
              <Card key={index} sx={{
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
                }
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    background: benefit.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2
                  }}>
                    <benefit.icon sx={{ fontSize: 28, color: benefit.color }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#1e293b' }}>
                    {benefit.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.6 }}>
                    {benefit.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* Requirements */}
          <Card sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#1e293b' }}>
                What We're Looking For
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  'Active student with strong campus presence',
                  'Leadership experience in clubs, organizations, or events',
                  'Passionate about blockchain and student empowerment',
                  'Excellent communication and social media skills',
                  'Available for 5-20 hours per week'
                ].map((requirement, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CheckCircleOutline sx={{ color: '#22c55e', fontSize: 24 }} />
                    <Typography variant="body1" sx={{ color: '#475569' }}>
                      {requirement}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Box>
      </DashboardLayout>
    );
  }

  // Has Application - Show Status
  const statusConfig = getStatusConfig(application.status);
  const StatusIcon = statusConfig.icon;

  return (
    <DashboardLayout stats={sidebarStats} searchPlaceholder="Search...">
      <Box sx={{ maxWidth: '900px', width: '100%', mx: 'auto' }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
          Ambassador Program
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Your application status and details
        </Typography>

        {/* Status Card */}
        <Card sx={{
          mb: 4,
          borderRadius: 3,
          background: statusConfig.bg,
          border: `2px solid ${statusConfig.color}`,
          boxShadow: `0 8px 32px ${statusConfig.color}40`
        }}>
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <Box sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: statusConfig.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              mb: 3,
              boxShadow: `0 8px 24px ${statusConfig.color}60`
            }}>
              <StatusIcon sx={{ fontSize: 48, color: 'white' }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: statusConfig.color, mb: 1 }}>
              {statusConfig.text}
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b', mb: 3 }}>
              {statusConfig.description}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Chip
                icon={<Schedule />}
                label={`Submitted ${new Date(application.submittedAt).toLocaleDateString()}`}
                sx={{
                  background: 'white',
                  border: `1px solid ${statusConfig.color}30`,
                  color: '#475569'
                }}
              />
              {application.reviewedAt && (
                <Chip
                  icon={<CheckCircle />}
                  label={`Reviewed ${new Date(application.reviewedAt).toLocaleDateString()}`}
                  sx={{
                    background: 'white',
                    border: `1px solid ${statusConfig.color}30`,
                    color: '#475569'
                  }}
                />
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Application Details */}
        <Card sx={{ mb: 4, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#1e293b' }}>
              Application Details
            </Typography>
            <TableContainer>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: '#64748b', borderBottom: '1px solid #f1f5f9' }}>
                      Name
                    </TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #f1f5f9' }}>{application.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: '#64748b', borderBottom: '1px solid #f1f5f9' }}>
                      Email
                    </TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #f1f5f9' }}>{application.email}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: '#64748b', borderBottom: '1px solid #f1f5f9' }}>
                      College
                    </TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #f1f5f9' }}>
                      {application.college?.name || 'N/A'}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: '#64748b', borderBottom: '1px solid #f1f5f9' }}>
                      Year of Study
                    </TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #f1f5f9' }}>{application.yearOfStudy}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: '#64748b', borderBottom: '1px solid #f1f5f9' }}>
                      Major
                    </TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #f1f5f9' }}>{application.major}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: '#64748b', borderBottom: '1px solid #f1f5f9' }}>
                      Availability
                    </TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #f1f5f9' }}>
                      {application.availability.hoursPerWeek}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: '#64748b', borderBottom: '1px solid #f1f5f9' }}>
                      Preferred Activities
                    </TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #f1f5f9' }}>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {application.availability.preferredActivities.map((activity, index) => (
                          <Chip
                            key={index}
                            label={activity}
                            size="small"
                            sx={{
                              background: 'rgba(102, 126, 234, 0.1)',
                              color: '#667eea',
                              fontWeight: 600
                            }}
                          />
                        ))}
                      </Box>
                    </TableCell>
                  </TableRow>
                  {(application.socialMediaHandles?.instagram ||
                    application.socialMediaHandles?.twitter ||
                    application.socialMediaHandles?.linkedin) && (
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, color: '#64748b', borderBottom: '1px solid #f1f5f9' }}>
                        Social Media
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #f1f5f9' }}>
                        <Box sx={{ display: 'flex', gap: 1.5 }}>
                          {application.socialMediaHandles.instagram && (
                            <Chip
                              icon={<Instagram sx={{ fontSize: 16 }} />}
                              label={application.socialMediaHandles.instagram}
                              size="small"
                              sx={{ background: '#E130691A', color: '#E1306C' }}
                            />
                          )}
                          {application.socialMediaHandles.twitter && (
                            <Chip
                              icon={<Twitter sx={{ fontSize: 16 }} />}
                              label={application.socialMediaHandles.twitter}
                              size="small"
                              sx={{ background: '#1DA1F21A', color: '#1DA1F2' }}
                            />
                          )}
                          {application.socialMediaHandles.linkedin && (
                            <Chip
                              icon={<LinkedIn sx={{ fontSize: 16 }} />}
                              label="LinkedIn"
                              size="small"
                              sx={{ background: '#0077B51A', color: '#0077B5' }}
                            />
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Responses */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
          <Card sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#667eea' }}>
                Leadership Experience
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', whiteSpace: 'pre-wrap' }}>
                {application.leadershipExperience}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#667eea' }}>
                Campus Involvement
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', whiteSpace: 'pre-wrap' }}>
                {application.campusInvolvement}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', gridColumn: { md: 'span 2' } }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#667eea' }}>
                Why Ambassador
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', whiteSpace: 'pre-wrap' }}>
                {application.whyAmbassador}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Review Notes */}
        {application.reviewNotes && (
          <Card sx={{ mt: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#ec4899' }}>
                Review Notes
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', whiteSpace: 'pre-wrap' }}>
                {application.reviewNotes}
              </Typography>
            </CardContent>
          </Card>
        )}
      </Box>
    </DashboardLayout>
  );
};

export default Ambassador;
