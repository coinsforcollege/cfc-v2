import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Person,
  Lock,
  Email,
  School,
  Save,
  Logout,
  ExitToApp
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { authApi } from '../../api/auth.api';
import DashboardLayout from '../../layouts/DashboardLayout';
import OTPDialog from '../../components/OTPDialog';

const Settings = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, logout: logoutAuth, updateUser } = useAuth();
  const { showToast } = useToast();

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || ''
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const [showOTPDialog, setShowOTPDialog] = useState(false);
  const [verificationToken, setVerificationToken] = useState(null);

  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
    setProfileError('');
    setProfileSuccess('');
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');

    if (!profileData.name || !profileData.phone) {
      setProfileError(t('collegeAdminSettings.updateProfile.fillAllFields'));
      return;
    }

    try {
      setProfileLoading(true);
      const response = await authApi.updateProfile({
        name: profileData.name,
        phone: profileData.phone
      });

      if (response.success) {
        updateUser(response.data);
        setProfileSuccess(t('collegeAdminSettings.updateProfile.profileUpdatedSuccess'));
        showToast(t('collegeAdminSettings.updateProfile.profileUpdatedSuccess'), 'success');
      }
    } catch (err) {
      setProfileError(err.message || t('collegeAdminSettings.updateProfile.profileUpdateError'));
      showToast(err.message || t('collegeAdminSettings.updateProfile.profileUpdateError'), 'error');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
    setPasswordError('');
    setPasswordSuccess('');
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError(t('collegeAdminSettings.changePassword.fillAllFields'));
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError(t('collegeAdminSettings.changePassword.passwordTooShort'));
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError(t('collegeAdminSettings.changePassword.passwordsDoNotMatch'));
      return;
    }

    try {
      setPasswordLoading(true);
      const response = await authApi.sendOTPForPasswordChange({
        currentPassword: passwordData.currentPassword
      });

      if (response.success) {
        setShowOTPDialog(true);
      }
    } catch (err) {
      setPasswordError(err.message || t('collegeAdminSettings.changePassword.sendVerificationError'));
      showToast(err.message || t('collegeAdminSettings.changePassword.sendVerificationError'), 'error');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleOTPVerified = async (token) => {
    setVerificationToken(token);
    setShowOTPDialog(false);
    setPasswordLoading(true);

    try {
      const response = await authApi.changePasswordWithOTP({
        newPassword: passwordData.newPassword,
        verificationToken: token
      });

      if (response.success) {
        setPasswordSuccess(t('collegeAdminSettings.changePassword.passwordChangedSuccess'));
        showToast(t('collegeAdminSettings.changePassword.passwordChangedSuccess'), 'success');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (err) {
      setPasswordError(err.message || t('collegeAdminSettings.changePassword.passwordChangeError'));
      showToast(err.message || t('collegeAdminSettings.changePassword.passwordChangeError'), 'error');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleCloseOTPDialog = () => {
    setShowOTPDialog(false);
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
      logoutAuth();
      navigate('/auth/login');
    } catch (err) {
      console.error('Logout error:', err);
      logoutAuth();
      navigate('/auth/login');
    }
  };

  const sidebarStats = {};

  return (
    <DashboardLayout stats={sidebarStats}>
      <Box sx={{ maxWidth: '900px', width: '100%', marginLeft: 'auto', marginRight: 'auto' }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', marginBottom: 1 }}>
          {t('collegeAdminSettings.title')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 4 }}>
          {t('collegeAdminSettings.subtitle')}
        </Typography>

        <Card sx={{ marginBottom: 4, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <CardContent sx={{ padding: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 3 }}>
              <Box sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Person sx={{ color: 'white', fontSize: 24 }} />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                  {t('collegeAdminSettings.accountInformation.title')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('collegeAdminSettings.accountInformation.subtitle')}
                </Typography>
              </Box>
            </Box>

            <TableContainer>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: '#64748b', borderBottom: '1px solid #f1f5f9', width: '30%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Email sx={{ fontSize: 18, color: '#667eea' }} />
                        Email
                      </Box>
                    </TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #f1f5f9' }}>{user?.email}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: '#64748b', borderBottom: '1px solid #f1f5f9' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <School sx={{ fontSize: 18, color: '#667eea' }} />
                        {t('collegeAdminSettings.accountInformation.managedCollege')}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #f1f5f9' }}>
                      {user?.managedCollegeName || t('collegeAdminSettings.accountInformation.notSet')}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>
                      {t('collegeAdminSettings.accountInformation.role')}
                    </TableCell>
                    <TableCell>
                      <Box sx={{
                        display: 'inline-block',
                        paddingLeft: 2,
                        paddingRight: 2,
                        paddingTop: 0.5,
                        paddingBottom: 0.5,
                        borderRadius: 1,
                        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                        color: '#667eea',
                        fontWeight: 600,
                        fontSize: '0.85rem'
                      }}>
                        {t('collegeAdminSettings.accountInformation.collegeAdmin')}
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        <Card sx={{ marginBottom: 4, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <CardContent sx={{ padding: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 3 }}>
              <Box sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Person sx={{ color: 'white', fontSize: 24 }} />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                  {t('collegeAdminSettings.updateProfile.title')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('collegeAdminSettings.updateProfile.subtitle')}
                </Typography>
              </Box>
            </Box>

            {profileError && (
              <Alert severity="error" sx={{ marginBottom: 2 }} onClose={() => setProfileError('')}>
                {profileError}
              </Alert>
            )}
            {profileSuccess && (
              <Alert severity="success" sx={{ marginBottom: 2 }} onClose={() => setProfileSuccess('')}>
                {profileSuccess}
              </Alert>
            )}

            <Box component="form" onSubmit={handleProfileSubmit}>
              <TextField
                fullWidth
                label={t('collegeAdminSettings.updateProfile.fullName')}
                name="name"
                value={profileData.name}
                onChange={handleProfileChange}
                required
                sx={{ marginBottom: 2 }}
              />
              <TextField
                fullWidth
                label={t('collegeAdminSettings.updateProfile.phoneNumber')}
                name="phone"
                value={profileData.phone}
                onChange={handleProfileChange}
                required
                sx={{ marginBottom: 3 }}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={profileLoading ? <CircularProgress size={20} /> : <Save />}
                disabled={profileLoading}
                sx={{
                  background: 'linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%)',
                  paddingLeft: 4,
                  paddingRight: 4,
                  fontWeight: 700,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)',
                  }
                }}
              >
                {profileLoading ? t('collegeAdminSettings.updateProfile.saving') : t('collegeAdminSettings.updateProfile.saveChanges')}
              </Button>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ marginBottom: 4, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <CardContent sx={{ padding: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 3 }}>
              <Box sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Lock sx={{ color: 'white', fontSize: 24 }} />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                  {t('collegeAdminSettings.changePassword.title')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('collegeAdminSettings.changePassword.subtitle')}
                </Typography>
              </Box>
            </Box>

            {passwordError && (
              <Alert severity="error" sx={{ marginBottom: 2 }} onClose={() => setPasswordError('')}>
                {passwordError}
              </Alert>
            )}
            {passwordSuccess && (
              <Alert severity="success" sx={{ marginBottom: 2 }} onClose={() => setPasswordSuccess('')}>
                {passwordSuccess}
              </Alert>
            )}

            <Box component="form" onSubmit={handlePasswordSubmit}>
              <TextField
                fullWidth
                type="password"
                label={t('collegeAdminSettings.changePassword.currentPassword')}
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
                sx={{ marginBottom: 2 }}
              />
              <TextField
                fullWidth
                type="password"
                label={t('collegeAdminSettings.changePassword.newPassword')}
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
                helperText={t('collegeAdminSettings.changePassword.passwordHelperText')}
                sx={{ marginBottom: 2 }}
              />
              <TextField
                fullWidth
                type="password"
                label={t('collegeAdminSettings.changePassword.confirmNewPassword')}
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
                sx={{ marginBottom: 3 }}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={passwordLoading ? <CircularProgress size={20} /> : <Lock />}
                disabled={passwordLoading}
                sx={{
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                  paddingLeft: 4,
                  paddingRight: 4,
                  fontWeight: 700,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)',
                  }
                }}
              >
                {passwordLoading ? t('collegeAdminSettings.changePassword.changing') : t('collegeAdminSettings.changePassword.changePassword')}
              </Button>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <CardContent sx={{ padding: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 0 }}>
              <Box sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ExitToApp sx={{ color: 'white', fontSize: 24 }} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                  {t('collegeAdminSettings.logout.title')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('collegeAdminSettings.logout.subtitle')}
                </Typography>
              </Box>
              <Button
                variant="outlined"
                size="large"
                startIcon={<Logout />}
                onClick={() => setShowLogoutDialog(true)}
                sx={{
                  borderColor: '#ef4444',
                  color: '#ef4444',
                  fontWeight: 700,
                  paddingLeft: 3,
                  paddingRight: 3,
                  '&:hover': {
                    borderColor: '#dc2626',
                    background: 'rgba(239, 68, 68, 0.04)'
                  }
                }}
              >
                {t('collegeAdminSettings.logout.logout')}
              </Button>
            </Box>
          </CardContent>
        </Card>

        <Dialog
          open={showLogoutDialog}
          onClose={() => setShowLogoutDialog(false)}
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
            }
          }}
        >
          <DialogTitle sx={{ fontWeight: 700 }}>
            {t('collegeAdminSettings.logout.confirmLogout')}
          </DialogTitle>
          <DialogContent>
            <Typography>
              {t('collegeAdminSettings.logout.confirmMessage')}
            </Typography>
          </DialogContent>
          <DialogActions sx={{ padding: 2.5 }}>
            <Button
              onClick={() => setShowLogoutDialog(false)}
              sx={{ color: '#64748b', fontWeight: 600 }}
            >
              {t('collegeAdminSettings.logout.cancel')}
            </Button>
            <Button
              onClick={handleLogout}
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                fontWeight: 700,
                '&:hover': {
                  background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                }
              }}
            >
              {t('collegeAdminSettings.logout.logout')}
            </Button>
          </DialogActions>
        </Dialog>

        <OTPDialog
          open={showOTPDialog}
          email={user?.email}
          role="password_change"
          onVerified={handleOTPVerified}
          onClose={handleCloseOTPDialog}
        />
      </Box>
    </DashboardLayout>
  );
};

export default Settings;
