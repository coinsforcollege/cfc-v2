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
  Button,
  TextField,
  MenuItem
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
import { userApi } from '../../api/user.api';
import DashboardLayout from '../../layouts/DashboardLayout';
import ShareDialog from '../../components/ShareDialog';
import { useTranslation } from 'react-i18next';

const Community = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareDialogData, setShareDialogData] = useState(null);

  const [selectedCollegeId, setSelectedCollegeId] = useState('');

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await userApi.getDashboard();
      if (response.success) {
        setDashboard(response.data);
        
        // Set default selected college (prefer primary, then first available)
        const colleges = response.data.miningColleges?.filter(mc => mc.college) || [];
        if (colleges.length > 0) {
          const primaryId = response.data.user?.college?._id || response.data.user?.college;
          const primaryInList = colleges.find(mc => mc.college._id === primaryId);
          
          if (primaryInList) {
            setSelectedCollegeId(primaryId);
          } else {
            setSelectedCollegeId(colleges[0].college._id);
          }
        }
      }
    } catch (err) {
      setError(err.message || t('user.failedToLoadData'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || user.role !== 'user') {
      navigate('/auth/login');
      return;
    }

    fetchDashboard();
  }, [user, navigate]);

  const copyReferralCode = () => {
    if (dashboard?.user?.referralCode) {
      navigator.clipboard.writeText(dashboard.user.referralCode);
      setCopiedCode(true);
      showToast(t('user.referralCodeCopied'), 'success');
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const copyReferralLink = () => {
    if (dashboard?.user?.referralCode) {
      const baseUrl = window.location.origin;
      let referralLink = `${baseUrl}/auth/register/user?ref=${dashboard.user.referralCode}`;
      
      if (selectedCollegeId) {
        referralLink += `&college=${selectedCollegeId}`;
      }
      
      navigator.clipboard.writeText(referralLink);
      setCopiedLink(true);
      showToast(t('user.referralLinkCopied'), 'success');
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const getTotalReferralBonus = () => {
    if (!dashboard?.miningColleges || !dashboard?.user?.totalReferrals) return 0;
    const REFERRAL_LIMIT_PER_COLLEGE = 10;
    return dashboard.miningColleges.reduce((sum, mc) => {
      if (mc.college && mc.college.referralBonusRate) {
        const collegeReferrals = mc.referredUsers?.length || 0;
        const cappedReferrals = Math.min(collegeReferrals, REFERRAL_LIMIT_PER_COLLEGE);
        return sum + (mc.college.referralBonusRate * cappedReferrals);
      }
      return sum;
    }, 0);
  };

  const handleShareGeneral = () => {
    // Find the selected college object
    const selectedCollege = dashboard?.miningColleges?.find(mc => mc.college?._id === selectedCollegeId)?.college;
    const totalBalance = dashboard?.summary?.totalBalance || 0;
    const baseUrl = window.location.origin;

    let shareUrl = `${baseUrl}/auth/register/user?ref=${dashboard?.user?.referralCode}`;
    if (selectedCollegeId) {
      shareUrl += `&college=${selectedCollegeId}`;
    }

    setShareDialogData({
      collegeName: selectedCollege?.name || 'My College',
      collegeLogo: selectedCollege?.logo,
      balance: totalBalance,
      isGeneral: true,
      text: `Join me in mining tokens for ${selectedCollege?.name || 'Costs For College'}!`,
      url: shareUrl
    });
    setShowShareDialog(true);
  };

  const getAllReferredStudents = () => {
    if (!dashboard?.miningColleges) return [];
    const usersMap = new Map();

    dashboard.miningColleges.forEach(mc => {
      if (mc.referredUsers && mc.referredUsers.length > 0) {
        mc.referredUsers.forEach(ref => {
          if (ref.user) {
            const userId = ref.user._id || ref.user;
            if (!usersMap.has(userId)) {
              usersMap.set(userId, {
                user: ref.user,
                referredAt: ref.referredAt,
                colleges: [mc.college],
                activeMiningCount: ref.activeMiningCount || 0,
                totalTokens: ref.totalTokens || 0
              });
            } else {
              usersMap.get(userId).colleges.push(mc.college);
            }
          }
        });
      }
    });

    return Array.from(usersMap.values()).sort((a, b) =>
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
    referralsCount: dashboard?.user?.totalReferrals || 0,
  };

  const totalBonus = getTotalReferralBonus();
  const referredUsers = getAllReferredStudents();

  return (
    <DashboardLayout
      stats={sidebarStats}
      searchPlaceholder="Search..."
    >
      <Box sx={{ maxWidth: '1200px', width: '100%', mx: 'auto' }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: '#1e293b', mb: 1 }}>
          {t('user.community')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          {t('user.communityDesc')}
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
                {t('user.totalCommunityMembers')}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {dashboard?.user?.totalReferrals || 0}
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
                {t('user.totalBonusRate')}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                +{totalBonus.toFixed(2)} {t('user.tokenPerHr')}
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
                {t('user.activeColleges')}
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
                {t('user.avgBonusPerCollege')}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                +{dashboard?.miningColleges?.length > 0
                  ? (totalBonus / dashboard.miningColleges.filter(mc => mc.college).length).toFixed(2)
                  : '0.00'} {t('user.tokenPerHr')}
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
                      {t('user.communityCode')}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                      {t('user.growYourNetwork')}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Referral Code and Share Button - Side by Side */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', display: 'block', mb: 1.5, textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
                  {t('user.selectCollegeToShare')}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {/* College Selector */}
                  <Box sx={{ width: '60%' }}>
                    <TextField
                      select
                      fullWidth
                      value={selectedCollegeId}
                      onChange={(e) => setSelectedCollegeId(e.target.value)}
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          background: 'rgba(15, 23, 42, 0.6)',
                          color: 'white',
                          borderRadius: 2,
                          '& fieldset': { border: '1px solid rgba(148, 163, 184, 0.3)' },
                          '&:hover fieldset': { border: '1px solid rgba(148, 163, 184, 0.5)' },
                          '&.Mui-focused fieldset': { border: '1px solid #8b5cf6' }
                        },
                        '& .MuiSelect-icon': { color: 'white' }
                      }}
                    >
                      {dashboard?.miningColleges?.filter(mc => mc.college).map((mc) => (
                        <MenuItem key={mc.college._id} value={mc.college._id}>
                          {mc.college.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>

                  {/* Share Button */}
                  <Box sx={{ width: '40%' }}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<Share />}
                      onClick={handleShareGeneral}
                      disabled={!selectedCollegeId}
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
                        '&.Mui-disabled': {
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: 'rgba(255, 255, 255, 0.3)',
                          border: 'none',
                          boxShadow: 'none'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {t('user.share')}
                    </Button>
                  </Box>
                </Box>
              </Box>

              {/* Share Link */}
              <Box>
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
                    wordBreak: 'break-all',
                    lineHeight: 1.5
                  }}>
                    {`${window.location.origin}/auth/register/user?ref=${dashboard?.user?.referralCode}${selectedCollegeId ? `&college=${selectedCollegeId}` : ''}`}
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
              {t('user.howCommunityRewardsWork')}
            </Typography>
            <Box component="ul" sx={{ m: 0, pl: 2.5, '& li': { mb: 1.5, color: '#64748b', fontSize: '0.9rem' } }}>
              <li>
                <strong>{t('user.shareYourCode')}:</strong> {t('user.shareYourCodeDesc')}
              </li>
              <li>
                <strong>{t('user.earnBonusRates')}:</strong> {t('user.earnBonusRatesDesc')}
              </li>
              <li>
                <strong>{t('user.collegeSpecific')}:</strong> {t('user.collegeSpecificDesc')}
              </li>
              <li>
                <strong>{t('user.compoundEarnings')}:</strong> {t('user.compoundEarningsDesc')}
              </li>
            </Box>
          </Card>
        </Box>

        {/* Community Members Table */}
        <Card sx={{ mb: 4, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
              {t('user.yourCommunityMembers')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {t('user.peopleJoined', { count: referredUsers.length, plural: referredUsers.length === 1 ? t('user.personHas') : t('user.peopleHave') })}
            </Typography>
            {referredUsers.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <People style={{ fontSize: 64, color: '#cbd5e1', marginBottom: 16 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#475569', mb: 1 }}>
                  {t('user.noCommunityMembers')}
                </Typography>
                <Typography color="text.secondary">
                  {t('user.sharReferralToStart')}
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ background: '#f8fafc' }}>
                      <TableCell sx={{ fontWeight: 700, color: '#475569' }}>{t('user.member')}</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#475569' }}>{t('user.joinedDate')}</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#475569' }}>{t('user.colleges')}</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#475569' }} align="center">{t('user.miningStatus')}</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#475569' }} align="right">{t('user.totalTokens')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {referredUsers.map((ref, index) => (
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
                              {ref.user?.name?.charAt(0).toUpperCase() || '?'}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                {ref.user?.name || 'Unknown User'}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#64748b' }}>
                                {ref.user?.email || ''}
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
                              label={`${ref.activeMiningCount} ${t('user.active')}`}
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
                              label={t('user.inactive')}
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
              {t('user.communityEarningsByCollege')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {t('user.communityEarningsByCollegeDesc')}
            </Typography>
            {dashboard?.miningColleges?.filter(mc => mc.college).length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="text.secondary">
                  {t('user.noCollegesAddedYet')}
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ background: '#f8fafc' }}>
                      <TableCell sx={{ fontWeight: 700, color: '#475569' }}>{t('user.college')}</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#475569' }} align="center">{t('user.members')}</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#475569' }} align="center">{t('user.rateMember')}</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#475569' }} align="right">{t('user.yourBonus')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dashboard?.miningColleges?.filter(mc => mc.college).map((mc) => {
                      const REFERRAL_LIMIT_PER_COLLEGE = 10;
                      const collegeReferrals = mc.referredUsers?.length || 0;
                      const cappedReferrals = Math.min(collegeReferrals, REFERRAL_LIMIT_PER_COLLEGE);
                      const bonusRate = mc.college.referralBonusRate || 0.1;
                      const totalCollegeBonus = bonusRate * cappedReferrals;

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
                              {cappedReferrals}/10{collegeReferrals > REFERRAL_LIMIT_PER_COLLEGE ? ` (${collegeReferrals} total)` : ''}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#667eea' }}>
                              {bonusRate.toFixed(2)} {t('user.tokenPerHr')}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" sx={{
                              fontWeight: 700,
                              color: collegeReferrals > 0 ? '#22c55e' : '#94a3b8'
                            }}>
                              +{totalCollegeBonus.toFixed(2)} {t('user.tokenPerHr')}
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
