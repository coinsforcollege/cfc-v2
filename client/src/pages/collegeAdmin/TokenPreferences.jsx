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

const TokenPreferences = () => {
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
      showToast('Failed to load token preferences', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTokenPreferences = async () => {
    try {
      setSaveLoading(true);
      await collegeAdminApi.updateTokenPreferences(tokenFormData);
      showToast('Token preferences updated successfully', 'success');
      fetchDashboard();
    } catch (error) {
      console.error('Error saving token preferences:', error);
      showToast('Failed to update token preferences', 'error');
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
                    Token Preferences
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Configure your college token details for future launch
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
              About Token Launch
            </Typography>
            <Typography variant="body2" color="text.secondary">
              These preferences will be used when your college token launches on the Collegen platform. You can update these settings at any time before the official launch date (Q2 2026).
            </Typography>
          </CardContent>
        </Card>

        {/* Token Form */}
        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, color: '#667eea' }}>
              Token Configuration
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Token Name"
                  fullWidth
                  value={tokenFormData.name}
                  onChange={(e) => setTokenFormData({ ...tokenFormData, name: e.target.value })}
                  placeholder="e.g., MIT Coin"
                  helperText="The full name of your college token"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Token Ticker/Symbol"
                  fullWidth
                  value={tokenFormData.ticker}
                  onChange={(e) => setTokenFormData({ ...tokenFormData, ticker: e.target.value.toUpperCase() })}
                  placeholder="e.g., MITC"
                  helperText="3-5 character ticker symbol (uppercase)"
                  inputProps={{ maxLength: 5 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Maximum Supply"
                  type="number"
                  fullWidth
                  value={tokenFormData.maximumSupply}
                  onChange={(e) => setTokenFormData({ ...tokenFormData, maximumSupply: e.target.value })}
                  placeholder="e.g., 1000000"
                  helperText="Total number of tokens that will ever exist"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Allocation for Early Miners (%)"
                  type="number"
                  fullWidth
                  value={tokenFormData.allocationForEarlyMiners}
                  onChange={(e) => setTokenFormData({ ...tokenFormData, allocationForEarlyMiners: e.target.value })}
                  placeholder="e.g., 30"
                  helperText="Percentage of total supply reserved for early miners"
                  inputProps={{ min: 0, max: 100 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Preferred Launch Date"
                  type="date"
                  fullWidth
                  value={tokenFormData.preferredLaunchDate}
                  onChange={(e) => setTokenFormData({ ...tokenFormData, preferredLaunchDate: e.target.value })}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  helperText="Your ideal token launch date (indicative)"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 600 }}>
                    Exchange Listing Preference
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body2">List on InTuition Exchange?</Typography>
                    <Chip
                      label={tokenFormData.needExchangeListing ? 'Yes' : 'No'}
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
                    InTuition Exchange provides liquidity and trading for college tokens
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
                {saveLoading ? 'Saving...' : 'Save Token Preferences'}
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
              Future Token Utilities
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>Campus Payments</Typography>
                <Typography variant="caption" color="text.secondary">
                  Use tokens for cafeteria, bookstore, and campus services
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>Event Tickets</Typography>
                <Typography variant="caption" color="text.secondary">
                  Purchase tickets for campus events and activities
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>Merchandise</Typography>
                <Typography variant="caption" color="text.secondary">
                  Buy official college merchandise with tokens
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>Scholarships</Typography>
                <Typography variant="caption" color="text.secondary">
                  Earn scholarships and financial aid through tokens
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>Governance</Typography>
                <Typography variant="caption" color="text.secondary">
                  Vote on college initiatives and decisions
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>Alumni Benefits</Typography>
                <Typography variant="caption" color="text.secondary">
                  Access exclusive alumni perks and networking
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
