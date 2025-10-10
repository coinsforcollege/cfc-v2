import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Paper,
  CircularProgress,
  Alert,
  IconButton,
  Divider,
  Chip,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  ContentCopy,
  CheckCircle,
  People,
  TrendingUp,
  Link as LinkIcon,
  PersonAdd,
  EmojiEvents,
  FiberManualRecord
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { studentApi } from '../../api/student.api';
import DashboardLayout from '../../layouts/DashboardLayout';

const Referrals = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await studentApi.getDashboard();
      if (response.success) {
        setDashboard(response.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || user.role !== 'student') {
      navigate('/auth/login');
      return;
    }

    fetchDashboard();
  }, [user, navigate]);

  const copyReferralCode = () => {
    if (dashboard?.student?.referralCode) {
      navigator.clipboard.writeText(dashboard.student.referralCode);
      setCopiedCode(true);
      showToast('Referral code copied!', 'success');
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const copyReferralLink = () => {
    if (dashboard?.student?.referralCode) {
      const baseUrl = window.location.origin;
      const referralLink = `${baseUrl}/auth/register/student?ref=${dashboard.student.referralCode}`;
      navigator.clipboard.writeText(referralLink);
      setCopiedLink(true);
      showToast('Referral link copied!', 'success');
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const getTotalReferralBonus = () => {
    if (!dashboard?.miningColleges || !dashboard?.student?.totalReferrals) return 0;
    return dashboard.miningColleges.reduce((sum, mc) => {
      if (mc.college && mc.college.referralBonusRate) {
        const collegeReferrals = mc.referredStudents?.length || 0;
        return sum + (mc.college.referralBonusRate * collegeReferrals);
      }
      return sum;
    }, 0);
  };

  const getAllReferredStudents = () => {
    if (!dashboard?.miningColleges) return [];
    const studentsMap = new Map();

    dashboard.miningColleges.forEach(mc => {
      if (mc.referredStudents && mc.referredStudents.length > 0) {
        mc.referredStudents.forEach(ref => {
          if (ref.student) {
            const studentId = ref.student._id || ref.student;
            if (!studentsMap.has(studentId)) {
              studentsMap.set(studentId, {
                student: ref.student,
                referredAt: ref.referredAt,
                colleges: [mc.college],
                activeMiningCount: ref.activeMiningCount || 0,
                totalTokens: ref.totalTokens || 0
              });
            } else {
              studentsMap.get(studentId).colleges.push(mc.college);
            }
          }
        });
      }
    });

    return Array.from(studentsMap.values()).sort((a, b) =>
      new Date(b.referredAt) - new Date(a.referredAt)
    );
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

  if (error) {
    return (
      <DashboardLayout stats={{}}>
        <Alert severity="error">{error}</Alert>
      </DashboardLayout>
    );
  }

  const sidebarStats = {
    collegesCount: dashboard?.miningColleges?.filter(mc => mc.college).length || 0,
    referralsCount: dashboard?.student?.totalReferrals || 0,
  };

  const totalBonus = getTotalReferralBonus();
  const referredStudents = getAllReferredStudents();

  return (
    <DashboardLayout
      stats={sidebarStats}
      searchPlaceholder="Search..."
    >
      <Box sx={{ maxWidth: '1200px', width: '100%', mx: 'auto' }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
          Community
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Grow your community and earn bonus tokens for every friend who joins with your code
        </Typography>

        {/* Summary Cards */}
        <Box sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          mb: 3
        }}>
          <Card sx={{
            flex: { xs: 'calc(50% - 8px)', md: 'calc(25% - 12px)' },
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)'
          }}>
            <CardContent>
              <People sx={{ color: 'white', fontSize: 24, mb: 1 }} />
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)', display: 'block', mb: 0.5 }}>
                Total Community Members
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {dashboard?.student?.totalReferrals || 0}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{
            flex: { xs: 'calc(50% - 8px)', md: 'calc(25% - 12px)' },
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(240, 147, 251, 0.3)'
          }}>
            <CardContent>
              <TrendingUp sx={{ color: 'white', fontSize: 24, mb: 1 }} />
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)', display: 'block', mb: 0.5 }}>
                Total Bonus Rate
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                +{totalBonus.toFixed(2)} Token/hr
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{
            flex: { xs: 'calc(50% - 8px)', md: 'calc(25% - 12px)' },
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white',
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(79, 172, 254, 0.3)'
          }}>
            <CardContent>
              <EmojiEvents sx={{ color: 'white', fontSize: 24, mb: 1 }} />
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)', display: 'block', mb: 0.5 }}>
                Active Colleges
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {dashboard?.miningColleges?.filter(mc => mc.college).length || 0}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{
            flex: { xs: 'calc(50% - 8px)', md: 'calc(25% - 12px)' },
            background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            color: 'white',
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(250, 112, 154, 0.3)'
          }}>
            <CardContent>
              <PersonAdd sx={{ color: 'white', fontSize: 24, mb: 1 }} />
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)', display: 'block', mb: 0.5 }}>
                Avg. Bonus per College
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                +{dashboard?.miningColleges?.length > 0
                  ? (totalBonus / dashboard.miningColleges.filter(mc => mc.college).length).toFixed(2)
                  : '0.00'} Token/hr
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* How It Works & Referral Code Section - Side by Side */}
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3,
          mb: 4
        }}>
          {/* How It Works */}
          <Card sx={{ flex: 1, p: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 2 }}>
              How Community Rewards Work
            </Typography>
            <Box component="ul" sx={{ m: 0, pl: 2.5, '& li': { mb: 1.5, color: '#64748b', fontSize: '0.9rem' } }}>
              <li>
                <strong>Share Your Code:</strong> Every student gets a unique referral code to share with friends.
              </li>
              <li>
                <strong>Earn Bonus Rates:</strong> When someone signs up with your code for a college, you earn extra tokens per hour for that college.
              </li>
              <li>
                <strong>College-Specific:</strong> Each college sets its own bonus rate per referral (usually 0.10 tokens/hour).
              </li>
              <li>
                <strong>Compound Earnings:</strong> More referrals = higher mining rate for each college.
              </li>
            </Box>
          </Card>

          {/* Referral Code Section */}
          <Card sx={{ flex: 1, borderRadius: 2, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <Box sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            p: 3,
            color: 'white'
          }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <LinkIcon />
              Your Community Code
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.95 }}>
              Share this code or link with friends to grow your community
            </Typography>
          </Box>
          <CardContent sx={{ p: 3 }}>
            {/* Referral Code */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#475569', mb: 1.5 }}>
                Your Unique Code
              </Typography>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 2,
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                borderRadius: 2,
                transition: 'all 0.2s',
                '&:hover': {
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)'
                }
              }}>
                <Typography variant="h5" sx={{
                  flex: 1,
                  fontWeight: 700,
                  fontFamily: 'Monaco, monospace',
                  color: '#667eea',
                  letterSpacing: 2
                }}>
                  {dashboard?.student?.referralCode}
                </Typography>
                <IconButton
                  onClick={copyReferralCode}
                  sx={{
                    background: copiedCode ? 'rgba(34, 197, 94, 0.15)' : 'rgba(102, 126, 234, 0.15)',
                    color: copiedCode ? '#22c55e' : '#667eea',
                    '&:hover': {
                      background: copiedCode ? 'rgba(34, 197, 94, 0.25)' : 'rgba(102, 126, 234, 0.25)'
                    }
                  }}
                >
                  {copiedCode ? <CheckCircle /> : <ContentCopy />}
                </IconButton>
              </Box>
            </Box>

            {/* Referral Link */}
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#475569', mb: 1.5 }}>
                Quick Share Link
              </Typography>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 2,
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                borderRadius: 2,
                transition: 'all 0.2s',
                '&:hover': {
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)'
                }
              }}>
                <Typography sx={{
                  flex: 1,
                  fontSize: '0.9rem',
                  fontFamily: 'Monaco, monospace',
                  color: '#64748b',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {`${window.location.origin}/auth/register/student?ref=${dashboard?.student?.referralCode}`}
                </Typography>
                <IconButton
                  onClick={copyReferralLink}
                  sx={{
                    background: copiedLink ? 'rgba(34, 197, 94, 0.15)' : 'rgba(102, 126, 234, 0.15)',
                    color: copiedLink ? '#22c55e' : '#667eea',
                    '&:hover': {
                      background: copiedLink ? 'rgba(34, 197, 94, 0.25)' : 'rgba(102, 126, 234, 0.25)'
                    }
                  }}
                >
                  {copiedLink ? <CheckCircle /> : <ContentCopy />}
                </IconButton>
              </Box>
            </Box>
          </CardContent>
        </Card>
        </Box>

        {/* Community Members Table */}
        <Card sx={{ mb: 4, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
              Your Community Members
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {referredStudents.length} {referredStudents.length === 1 ? 'person has' : 'people have'} joined using your code
            </Typography>
            {referredStudents.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <People style={{ fontSize: 64, color: '#cbd5e1', marginBottom: 16 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#475569', mb: 1 }}>
                  No community members yet
                </Typography>
                <Typography color="text.secondary">
                  Share your referral code with friends to start building your community
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ background: '#f8fafc' }}>
                      <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Member</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Joined Date</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Colleges</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#475569' }} align="center">Mining Status</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#475569' }} align="right">Total Tokens</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {referredStudents.map((ref, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          '&:hover': {
                            background: 'rgba(102, 126, 234, 0.04)'
                          }
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar sx={{
                              width: 36,
                              height: 36,
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              fontSize: '0.9rem',
                              fontWeight: 700
                            }}>
                              {ref.student?.name?.charAt(0).toUpperCase() || '?'}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                {ref.student?.name || 'Unknown User'}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#64748b' }}>
                                {ref.student?.email || ''}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ color: '#64748b' }}>
                            {new Date(ref.referredAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {ref.colleges.map((college, idx) => (
                              <Chip
                                key={idx}
                                label={college?.name || 'Unknown'}
                                size="small"
                                sx={{
                                  fontSize: '0.7rem',
                                  height: 24,
                                  background: 'rgba(102, 126, 234, 0.1)',
                                  color: '#667eea',
                                  fontWeight: 600
                                }}
                              />
                            ))}
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          {ref.activeMiningCount > 0 ? (
                            <Chip
                              icon={<FiberManualRecord sx={{ fontSize: 12 }} />}
                              label={`${ref.activeMiningCount} active`}
                              size="small"
                              sx={{
                                background: 'rgba(34, 197, 94, 0.1)',
                                color: '#22c55e',
                                fontWeight: 600,
                                fontSize: '0.75rem',
                                height: 24,
                                '& .MuiChip-icon': {
                                  color: '#22c55e'
                                }
                              }}
                            />
                          ) : (
                            <Chip
                              label="Inactive"
                              size="small"
                              sx={{
                                background: '#f1f5f9',
                                color: '#64748b',
                                fontWeight: 600,
                                fontSize: '0.75rem',
                                height: 24
                              }}
                            />
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" sx={{ fontWeight: 700, color: '#667eea' }}>
                            {ref.totalTokens?.toFixed(2) || '0.00'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>

        {/* Community Earnings by College Table */}
        <Card sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
              Community Earnings by College
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              See how many community members joined each college and your bonus mining rate
            </Typography>
            {dashboard?.miningColleges?.filter(mc => mc.college).length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="text.secondary">
                  No colleges added yet. Add colleges to start earning bonus rates!
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ background: '#f8fafc' }}>
                      <TableCell sx={{ fontWeight: 700, color: '#475569' }}>College</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#475569' }} align="center">Members</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#475569' }} align="center">Rate/Member</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#475569' }} align="right">Your Bonus</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dashboard?.miningColleges?.filter(mc => mc.college).map((mc) => {
                      const collegeReferrals = mc.referredStudents?.length || 0;
                      const bonusRate = mc.college.referralBonusRate || 0.1;
                      const totalCollegeBonus = bonusRate * collegeReferrals;

                      return (
                        <TableRow
                          key={mc.college._id}
                          sx={{
                            background: collegeReferrals > 0
                              ? 'rgba(102, 126, 234, 0.02)'
                              : 'transparent',
                            '&:hover': {
                              background: 'rgba(102, 126, 234, 0.04)'
                            }
                          }}
                        >
                          <TableCell>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b' }}>
                                {mc.college.name}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#64748b' }}>
                                {mc.college.country}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b' }}>
                              {collegeReferrals}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#667eea' }}>
                              {bonusRate.toFixed(2)} Token/hr
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" sx={{
                              fontWeight: 700,
                              color: collegeReferrals > 0 ? '#22c55e' : '#94a3b8'
                            }}>
                              +{totalCollegeBonus.toFixed(2)} Token/hr
                            </Typography>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      </Box>
    </DashboardLayout>
  );
};

export default Referrals;
