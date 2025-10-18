import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Chip,
  LinearProgress,
  Grid
} from '@mui/material';
import {
  Save,
  Token as TokenIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router';
import { collegeAdminApi } from '../../api/collegeAdmin.api';
import { useToast } from '../../contexts/ToastContext';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useTranslation } from 'react-i18next';

const TokenPreferences = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);

  const [tokenFormData, setTokenFormData] = useState({
    name: '',
    ticker: '',
    maximumSupply: '',
    preferredLaunchDate: '',
    needExchangeListing: true,
    allocationForEarlyMiners: '',
    preferredUtilities: []
  });

  useEffect(() => {
    if (!user || user.role !== 'college_admin') {
      navigate('/auth/login');
      return;
    }
    fetchDashboard();
  }, [user, navigate]);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await collegeAdminApi.getDashboard();

      if (response.data.college?.tokenPreferences) {
        setTokenFormData({
          ...tokenFormData,
          ...response.data.college.tokenPreferences
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      showToast(t('collegeAdminTokenPreferences.errorLoadFailed'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTokenPreferences = async () => {
    try {
      setSaveLoading(true);
      await collegeAdminApi.updateTokenPreferences(tokenFormData);
      showToast(t('collegeAdminTokenPreferences.successUpdated'), 'success');
      fetchDashboard();
    } catch (error) {
      console.error('Error saving token preferences:', error);
      showToast(t('collegeAdminTokenPreferences.errorUpdateFailed'), 'error');
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LinearProgress sx={{ width: '50%' }} />
      </Box>
    );
  }

  const sidebarStats = {};

  return (
    <DashboardLayout stats={sidebarStats}>
      <Box sx={{ maxWidth: '1400px', width: '100%', mx: 'auto' }}>
        {/* Header */}
        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', mb: 3 }}>
          <CardContent>
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <TokenIcon sx={{ color: '#667eea', fontSize: 32 }} />
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {t('collegeAdminTokenPreferences.pageTitle')}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {t('collegeAdminTokenPreferences.pageDescription')}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Information Banner */}
        <Card sx={{
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          mb: 3,
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
          border: '2px solid',
          borderColor: '#667eea'
        }}>
          <CardContent>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#667eea', mb: 1 }}>
              {t('collegeAdminTokenPreferences.infoTitle')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('collegeAdminTokenPreferences.infoDescription')}
            </Typography>
          </CardContent>
        </Card>

        {/* Token Form */}
        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, color: '#667eea' }}>
              {t('collegeAdminTokenPreferences.sectionTokenConfiguration')}
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label={t('collegeAdminTokenPreferences.labelTokenName')}
                  fullWidth
                  value={tokenFormData.name}
                  onChange={(e) => setTokenFormData({ ...tokenFormData, name: e.target.value })}
                  placeholder={t('collegeAdminTokenPreferences.placeholderTokenName')}
                  helperText={t('collegeAdminTokenPreferences.helperTokenName')}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label={t('collegeAdminTokenPreferences.labelTokenTicker')}
                  fullWidth
                  value={tokenFormData.ticker}
                  onChange={(e) => setTokenFormData({ ...tokenFormData, ticker: e.target.value.toUpperCase() })}
                  placeholder={t('collegeAdminTokenPreferences.placeholderTokenTicker')}
                  helperText={t('collegeAdminTokenPreferences.helperTokenTicker')}
                  inputProps={{ maxLength: 5 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label={t('collegeAdminTokenPreferences.labelMaximumSupply')}
                  type="number"
                  fullWidth
                  value={tokenFormData.maximumSupply}
                  onChange={(e) => setTokenFormData({ ...tokenFormData, maximumSupply: e.target.value })}
                  placeholder={t('collegeAdminTokenPreferences.placeholderMaximumSupply')}
                  helperText={t('collegeAdminTokenPreferences.helperMaximumSupply')}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label={t('collegeAdminTokenPreferences.labelAllocation')}
                  type="number"
                  fullWidth
                  value={tokenFormData.allocationForEarlyMiners}
                  onChange={(e) => setTokenFormData({ ...tokenFormData, allocationForEarlyMiners: e.target.value })}
                  placeholder={t('collegeAdminTokenPreferences.placeholderAllocation')}
                  helperText={t('collegeAdminTokenPreferences.helperAllocation')}
                  inputProps={{ min: 0, max: 100 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label={t('collegeAdminTokenPreferences.labelLaunchDate')}
                  type="date"
                  fullWidth
                  value={tokenFormData.preferredLaunchDate}
                  onChange={(e) => setTokenFormData({ ...tokenFormData, preferredLaunchDate: e.target.value })}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  helperText={t('collegeAdminTokenPreferences.helperLaunchDate')}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 600 }}>
                    {t('collegeAdminTokenPreferences.labelExchangeListing')}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body2">{t('collegeAdminTokenPreferences.questionExchangeListing')}</Typography>
                    <Chip
                      label={tokenFormData.needExchangeListing ? t('collegeAdminTokenPreferences.yes') : t('collegeAdminTokenPreferences.no')}
                      onClick={() => setTokenFormData({ ...tokenFormData, needExchangeListing: !tokenFormData.needExchangeListing })}
                      sx={{
                        background: tokenFormData.needExchangeListing
                          ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                          : '#e2e8f0',
                        color: tokenFormData.needExchangeListing ? 'white' : '#64748b',
                        fontWeight: 600,
                        cursor: 'pointer',
                        '&:hover': {
                          opacity: 0.9
                        }
                      }}
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                    {t('collegeAdminTokenPreferences.helperExchangeListing')}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #e5e7eb' }}>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleSaveTokenPreferences}
                disabled={saveLoading}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: 2,
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a67d8 0%, #6b42a0 100%)',
                  }
                }}
              >
                {saveLoading ? t('collegeAdminTokenPreferences.buttonSaving') : t('collegeAdminTokenPreferences.buttonSave')}
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Future Features Info */}
        <Card sx={{
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          mt: 3,
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)',
          border: '2px solid #10b981'
        }}>
          <CardContent>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#10b981', mb: 2 }}>
              {t('collegeAdminTokenPreferences.futureUtilitiesTitle')}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>{t('collegeAdminTokenPreferences.utilityCampusPayments')}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {t('collegeAdminTokenPreferences.utilityCampusPaymentsDesc')}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>{t('collegeAdminTokenPreferences.utilityEventTickets')}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {t('collegeAdminTokenPreferences.utilityEventTicketsDesc')}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>{t('collegeAdminTokenPreferences.utilityMerchandise')}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {t('collegeAdminTokenPreferences.utilityMerchandiseDesc')}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>{t('collegeAdminTokenPreferences.utilityScholarships')}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {t('collegeAdminTokenPreferences.utilityScholarshipsDesc')}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>{t('collegeAdminTokenPreferences.utilityGovernance')}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {t('collegeAdminTokenPreferences.utilityGovernanceDesc')}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>{t('collegeAdminTokenPreferences.utilityAlumniBenefits')}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {t('collegeAdminTokenPreferences.utilityAlumniBenefitsDesc')}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </DashboardLayout>
  );
};

export default TokenPreferences;
