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
  TableRow,
  Button
} from '@mui/material';
import {
  ContentCopy,
  CheckCircle,
  People,
  TrendingUp,
  Link as LinkIcon,
  PersonAdd,
  EmojiEvents,
  FiberManualRecord,
  Share
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { studentApi } from '../../api/student.api';
import DashboardLayout from '../../layouts/DashboardLayout';
import ShareDialog from '../../components/ShareDialog';

const Community = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareDialogData, setShareDialogData] = useState(null);

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

  const handleShareGeneral = () => {
    const primaryCollege = dashboard?.student?.college;
    const totalBalance = dashboard?.summary?.totalBalance || 0;
    const baseUrl = window.location.origin;

    setShareDialogData({
      collegeName: primaryCollege?.name || 'My College',
      collegeLogo: primaryCollege?.logo,
      balance: totalBalance,
      isGeneral: true,
      text: "I'm earning tokens on Coins For College. Join the community!",
      url: `${baseUrl}/auth/register/student?ref=${dashboard?.student?.referralCode}`
    });
    setShowShareDialog(true);
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
        <Typography variant="h5" sx={{ fontWeight: 600, color: '#1e293b', mb: 1 }}>
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
          {/* Referral Code Section */}
          <Card sx={{
            flex: 1,
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
            }
          }}>
            <CardContent sx={{ p: 3, pt: 4 }}>
              {/* Header */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                  <Box sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
                  }}>
                    <LinkIcon sx={{ color: 'white', fontSize: 20 }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'white', lineHeight: 1.2 }}>
                      Community Code
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                      Grow your network & earn bonuses
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Referral Code and Share Button - Side by Side */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', display: 'block', mb: 1.5, textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
                  Your Unique Code
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {/* Code Box */}
                  <Box sx={{ width: '50%' }}>
                    <Box sx={{
                      height: '100%',
                      p: 2,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)',
                      border: '1px solid rgba(102, 126, 234, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 1.5,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)',
                        border: '1px solid rgba(102, 126, 234, 0.4)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)'
                      }
                    }}>
                      <Typography sx={{
                        flex: 1,
                        fontWeight: 700,
                        fontFamily: 'Monaco, Courier, monospace',
                        color: 'white',
                        fontSize: '1rem',
                        letterSpacing: '1px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {dashboard?.student?.referralCode}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={copyReferralCode}
                        sx={{
                          background: copiedCode ? 'rgba(34, 197, 94, 0.2)' : 'rgba(102, 126, 234, 0.2)',
                          color: copiedCode ? '#22c55e' : 'white',
                          border: copiedCode ? '1px solid rgba(34, 197, 94, 0.4)' : '1px solid rgba(102, 126, 234, 0.4)',
                          '&:hover': {
                            background: copiedCode ? 'rgba(34, 197, 94, 0.3)' : 'rgba(102, 126, 234, 0.3)',
                          }
                        }}
                      >
                        {copiedCode ? <CheckCircle fontSize="small" /> : <ContentCopy fontSize="small" />}
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Share Button */}
                  <Box sx={{ width: '50%' }}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<Share />}
                      onClick={handleShareGeneral}
                      sx={{
                        height: '100%',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        borderRadius: 2,
                        textTransform: 'none',
                        border: '1px solid rgba(102, 126, 234, 0.5)',
                        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5568d3 0%, #633a8a 100%)',
                          boxShadow: '0 6px 25px rgba(102, 126, 234, 0.5)',
                          transform: 'translateY(-2px)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Share With Friends
                    </Button>
                  </Box>
                </Box>
              </Box>

              {/* Share Link */}
              <Box>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', display: 'block', mb: 1.5, textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
                  Quick Share Link
                </Typography>
                <Box sx={{
                  p: 2,
                  borderRadius: 2,
                  background: 'rgba(30, 41, 59, 0.5)',
                  border: '1px solid rgba(71, 85, 105, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(30, 41, 59, 0.7)',
                    border: '1px solid rgba(71, 85, 105, 0.5)',
                  }
                }}>
                  <Typography sx={{
                    flex: 1,
                    fontSize: '0.8rem',
                    fontFamily: 'Monaco, Courier, monospace',
                    color: 'rgba(255,255,255,0.7)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {`${window.location.origin}/auth/register/student?ref=${dashboard?.student?.referralCode}`}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={copyReferralLink}
                    sx={{
                      background: copiedLink ? 'rgba(34, 197, 94, 0.2)' : 'rgba(100, 116, 139, 0.2)',
                      color: copiedLink ? '#22c55e' : 'rgba(255,255,255,0.7)',
                      border: copiedLink ? '1px solid rgba(34, 197, 94, 0.4)' : '1px solid rgba(100, 116, 139, 0.4)',
                      '&:hover': {
                        background: copiedLink ? 'rgba(34, 197, 94, 0.3)' : 'rgba(100, 116, 139, 0.3)',
                      }
                    }}
                  >
                    {copiedLink ? <CheckCircle fontSize="small" /> : <ContentCopy fontSize="small" />}
                  </IconButton>
                </Box>
              </Box>
            </CardContent>
          </Card>

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

        {/* Share Dialog */}
        <ShareDialog
          open={showShareDialog}
          onClose={() => setShowShareDialog(false)}
          shareData={shareDialogData}
        />
      </Box>
    </DashboardLayout>
  );
};

export default Community;
