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
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { authApi } from '../../api/auth.api';
import DashboardLayout from '../../layouts/DashboardLayout';
import OTPDialog from '../../components/OTPDialog';
import { useTranslation } from 'react-i18next';

const Settings = () => {
  const navigate = useNavigate();
  const { user, logout: logoutAuth, updateUser } = useAuth();
  const { showToast } = useToast();
  const { t } = useTranslation();

  // Profile update state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || ''
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // OTP dialog state
  const [showOTPDialog, setShowOTPDialog] = useState(false);
  const [verificationToken, setVerificationToken] = useState(null);

  // Logout confirmation dialog
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
      setProfileError(t('settings.fillAllFields'));
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
        setProfileSuccess(t('settings.profileUpdatedSuccess'));
        showToast(t('settings.profileUpdatedSuccess'), 'success');
      }
    } catch (err) {
      setProfileError(err.message || t('settings.failedToUpdateProfile'));
      showToast(err.message || t('settings.failedToUpdateProfile'), 'error');
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
      setPasswordError(t('settings.fillAllFields'));
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError(t('settings.passwordMinLength'));
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError(t('settings.passwordsDoNotMatch'));
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
      setPasswordError(err.message || t('settings.failedToSendVerification'));
      showToast(err.message || t('settings.failedToSendVerification'), 'error');
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
        setPasswordSuccess(t('settings.passwordChangedSuccess'));
        showToast(t('settings.passwordChangedSuccess'), 'success');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (err) {
      setPasswordError(err.message || t('settings.failedToChangePassword'));
      showToast(err.message || t('settings.failedToChangePassword'), 'error');
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

  const sidebarStats = {
    collegesCount: 0,
    referralsCount: 0,
  };

  return (
    <DashboardLayout stats={sidebarStats} searchPlaceholder="Search...">
      <Box sx={{ maxWidth: '900px', width: '100%', mx: 'auto' }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
          {t('settings.accountSettings')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          {t('settings.manageAccountInfo')}
        </Typography>

        {/* Account Information */}
        <Card sx={{ mb: 4, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
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
                  {t('settings.accountInformation')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('settings.viewAccountDetails')}
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
                        {t('auth.email')}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #f1f5f9' }}>{user?.email}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: '#64748b', borderBottom: '1px solid #f1f5f9' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <School sx={{ fontSize: 18, color: '#667eea' }} />
                        {t('settings.primaryCollege')}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #f1f5f9' }}>
                      {user?.college?.name || t('settings.notSet')}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>
                      {t('settings.role')}
                    </TableCell>
                    <TableCell>
                      <Box sx={{
                        display: 'inline-block',
                        px: 2,
                        py: 0.5,
                        borderRadius: 1,
                        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                        color: '#667eea',
                        fontWeight: 600,
                        fontSize: '0.85rem'
                      }}>
                        {user?.role === 'user' ? t('settings.user') : user?.role}
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Update Profile */}
        <Card sx={{ mb: 4, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
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
                  {t('settings.updateProfile')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('settings.changeNamePhone')}
                </Typography>
              </Box>
            </Box>

            {profileError && (
              <Alert severity="error" sx={{ mb: 2 }} onClose={() => setProfileError('')}>
                {profileError}
              </Alert>
            )}
            {profileSuccess && (
              <Alert severity="success" sx={{ mb: 2 }} onClose={() => setProfileSuccess('')}>
                {profileSuccess}
              </Alert>
            )}

            <Box component="form" onSubmit={handleProfileSubmit}>
              <TextField
                fullWidth
                label={t('auth.fullName')}
                name="name"
                value={profileData.name}
                onChange={handleProfileChange}
                required
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label={t('auth.phoneNumber')}
                name="phone"
                value={profileData.phone}
                onChange={handleProfileChange}
                required
                sx={{ mb: 3 }}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={profileLoading ? <CircularProgress size={20} /> : <Save />}
                disabled={profileLoading}
                sx={{
                  background: 'linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%)',
                  px: 4,
                  fontWeight: 700,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)',
                  }
                }}
              >
                {profileLoading ? t('settings.saving') : t('settings.saveChanges')}
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card sx={{ mb: 4, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
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
                  {t('settings.changePassword')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('settings.updatePasswordSecure')}
                </Typography>
              </Box>
            </Box>

            {passwordError && (
              <Alert severity="error" sx={{ mb: 2 }} onClose={() => setPasswordError('')}>
                {passwordError}
              </Alert>
            )}
            {passwordSuccess && (
              <Alert severity="success" sx={{ mb: 2 }} onClose={() => setPasswordSuccess('')}>
                {passwordSuccess}
              </Alert>
            )}

            <Box component="form" onSubmit={handlePasswordSubmit}>
              <TextField
                fullWidth
                type="password"
                label={t('settings.currentPassword')}
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                type="password"
                label={t('settings.newPassword')}
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
                helperText={t('settings.passwordHelperText')}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                type="password"
                label={t('settings.confirmNewPassword')}
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
                sx={{ mb: 3 }}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={passwordLoading ? <CircularProgress size={20} /> : <Lock />}
                disabled={passwordLoading}
                sx={{
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                  px: 4,
                  fontWeight: 700,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)',
                  }
                }}
              >
                {passwordLoading ? t('settings.changing') : t('settings.changePassword')}
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Logout */}
        <Card sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 0 }}>
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
                  {t('header.logout')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('settings.signOutAccount')}
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
                  px: 3,
                  '&:hover': {
                    borderColor: '#dc2626',
                    background: 'rgba(239, 68, 68, 0.04)'
                  }
                }}
              >
                {t('header.logout')}
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Logout Confirmation Dialog */}
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
            {t('settings.confirmLogout')}
          </DialogTitle>
          <DialogContent>
            <Typography>
              {t('settings.confirmLogoutMessage')}
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button
              onClick={() => setShowLogoutDialog(false)}
              sx={{ color: '#64748b', fontWeight: 600 }}
            >
              {t('common.cancel')}
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
              {t('header.logout')}
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
