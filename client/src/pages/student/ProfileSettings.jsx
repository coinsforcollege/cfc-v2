import {
  CheckCircle,
  Delete,
  Lock,
  Notifications,
  Person,
  Save,
  School,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
  alpha,
  useTheme
} from '@mui/material';
import React, { useState } from 'react';

// Mock user data
const mockUserData = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@mit.edu',
  phone: '+1 (555) 123-4567',
  graduationYear: 2025,
  college: 'MIT',
};

function ProfileSettings() {
  const theme = useTheme();

  // Personal Information State
  const [personalInfo, setPersonalInfo] = useState({
    firstName: mockUserData.firstName,
    lastName: mockUserData.lastName,
    email: mockUserData.email,
    phone: mockUserData.phone,
    graduationYear: mockUserData.graduationYear,
  });

  // Password State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Notification Preferences State
  const [notifications, setNotifications] = useState({
    emailMiningReminders: true,
    referralSuccess: true,
    collegeAdminUpdates: false,
    weeklySummary: true,
  });

  // Dialog States
  const [openCollegeSwitch, setOpenCollegeSwitch] = useState(false);
  const [openDeleteAccount, setOpenDeleteAccount] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  // Success States
  const [successMessage, setSuccessMessage] = useState('');

  const handlePersonalInfoChange = (field) => (event) => {
    setPersonalInfo({ ...personalInfo, [field]: event.target.value });
  };

  const handlePasswordChange = (field) => (event) => {
    setPasswordData({ ...passwordData, [field]: event.target.value });
  };

  const handleNotificationChange = (field) => (event) => {
    setNotifications({ ...notifications, [field]: event.target.checked });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] });
  };

  const handleSavePersonalInfo = () => {
    setSuccessMessage('Personal information updated successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    setSuccessMessage('Password changed successfully!');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleSwitchCollege = () => {
    setOpenCollegeSwitch(true);
  };

  const confirmSwitchCollege = () => {
    setOpenCollegeSwitch(false);
    setSuccessMessage('College switch request submitted!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmText === 'DELETE') {
      setOpenDeleteAccount(false);
      setSuccessMessage('Account deletion request submitted!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const graduationYears = Array.from({ length: 7 }, (_, i) => new Date().getFullYear() + i);

  return (
    <Box sx={{ py: { xs: 4, sm: 6 } }}>
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Profile Settings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your account information and preferences
          </Typography>
        </Box>

        {/* Success Message */}
        {successMessage && (
          <Alert
            icon={<CheckCircle />}
            severity="success"
            sx={{ mb: 3 }}
            onClose={() => setSuccessMessage('')}
          >
            {successMessage}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Personal Information */}
          <Grid size={12}>
            <Paper elevation={2} sx={{ p: { xs: 2, sm: 4 } }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <Person sx={{ fontSize: 32, color: 'primary.main' }} />
                <Typography variant="h5" fontWeight={600}>
                  Personal Information
                </Typography>
              </Stack>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="First Name"
                    value={personalInfo.firstName}
                    onChange={handlePersonalInfoChange('firstName')}
                    variant="outlined"
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    value={personalInfo.lastName}
                    onChange={handlePersonalInfoChange('lastName')}
                    variant="outlined"
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={personalInfo.email}
                    onChange={handlePersonalInfoChange('email')}
                    variant="outlined"
                    helperText="Changing email requires verification"
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    type="tel"
                    value={personalInfo.phone}
                    onChange={handlePersonalInfoChange('phone')}
                    variant="outlined"
                    helperText="Changing phone requires verification"
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    select
                    label="Graduation Year"
                    value={personalInfo.graduationYear}
                    onChange={handlePersonalInfoChange('graduationYear')}
                    variant="outlined"
                  >
                    {graduationYears.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Save />}
                  onClick={handleSavePersonalInfo}
                  sx={{ textTransform: 'none' }}
                >
                  Save Changes
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Account Settings */}
          <Grid size={12}>
            <Paper elevation={2} sx={{ p: { xs: 2, sm: 4 } }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <Lock sx={{ fontSize: 32, color: 'secondary.main' }} />
                <Typography variant="h5" fontWeight={600}>
                  Account Settings
                </Typography>
              </Stack>

              {/* Password Change */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Change Password
                </Typography>
                <Grid container spacing={3} sx={{ mt: 1 }}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      fullWidth
                      label="Current Password"
                      type={showPasswords.current ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange('currentPassword')}
                      variant="outlined"
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => togglePasswordVisibility('current')}
                                edge="end"
                              >
                                {showPasswords.current ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      fullWidth
                      label="New Password"
                      type={showPasswords.new ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange('newPassword')}
                      variant="outlined"
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => togglePasswordVisibility('new')}
                                edge="end"
                              >
                                {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      fullWidth
                      label="Confirm New Password"
                      type={showPasswords.confirm ? 'text' : 'password'}
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange('confirmPassword')}
                      variant="outlined"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => togglePasswordVisibility('confirm')}
                              edge="end"
                            >
                              {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    onClick={handleChangePassword}
                    sx={{ textTransform: 'none' }}
                    size="large"
                  >
                    Update Password
                  </Button>
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* College Switch */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  College Information
                </Typography>
                <Box
                  sx={{
                    mt: 2,
                  }}
                >
                  <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2} flexWrap={'wrap'}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Current College
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <School color="primary" />
                        <Typography variant="h6" fontWeight={600}>
                          {mockUserData.college}
                        </Typography>
                      </Stack>
                    </Box>
                    <Button
                      variant="outlined"
                      color="warning"
                      onClick={handleSwitchCollege}
                      sx={{ textTransform: 'none' }}
                      size="large"
                    >
                      Switch College
                    </Button>
                  </Stack>
                  <Alert severity="warning" sx={{ mt: 1, width: '100%' }}>
                    Switching colleges will reset your mining progress and tokens
                  </Alert>
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Delete Account */}
              <Box>
                <Typography variant="h6" fontWeight={600} gutterBottom color="error">
                  Danger Zone
                </Typography>
                <Box
                  sx={{
                    p: 3,
                    mt: 2,
                    bgcolor: alpha(theme.palette.error.main, 0.05),
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                  }}
                >
                  <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2} flexWrap={'wrap'}>
                    <Box>
                      <Typography variant="body1" fontWeight={600} gutterBottom>
                        Delete Account
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Permanently delete your account and all associated data. This action cannot be undone.
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<Delete />}
                      onClick={() => setOpenDeleteAccount(true)}
                      sx={{ textTransform: 'none' }}
                      size="large"
                    >
                      Delete Account
                    </Button>
                  </Stack>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Notification Preferences */}
          <Grid size={12}>
            <Paper elevation={2} sx={{ p: { xs: 2, sm: 4 } }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <Notifications sx={{ fontSize: 32, color: 'success.main' }} />
                <Typography variant="h5" fontWeight={600}>
                  Notification Preferences
                </Typography>
              </Stack>

              <Stack spacing={2}>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.02),
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  }}
                >
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.emailMiningReminders}
                        onChange={handleNotificationChange('emailMiningReminders')}
                        color="primary"
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body1" fontWeight={600}>
                          Email Mining Reminders
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Receive daily reminders when you can mine tokens
                        </Typography>
                      </Box>
                    }
                  />
                </Box>

                <Box
                  sx={{
                    p: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.02),
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  }}
                >
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.referralSuccess}
                        onChange={handleNotificationChange('referralSuccess')}
                        color="primary"
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body1" fontWeight={600}>
                          Referral Success Notifications
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Get notified when someone signs up using your referral code
                        </Typography>
                      </Box>
                    }
                  />
                </Box>

                <Box
                  sx={{
                    p: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.02),
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  }}
                >
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.collegeAdminUpdates}
                        onChange={handleNotificationChange('collegeAdminUpdates')}
                        color="primary"
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body1" fontWeight={600}>
                          College Admin Updates
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Receive updates from your college administrators
                        </Typography>
                      </Box>
                    }
                  />
                </Box>

                <Box
                  sx={{
                    p: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.02),
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  }}
                >
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.weeklySummary}
                        onChange={handleNotificationChange('weeklySummary')}
                        color="primary"
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body1" fontWeight={600}>
                          Weekly Summary Emails
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Get a weekly summary of your mining activity and stats
                        </Typography>
                      </Box>
                    }
                  />
                </Box>
              </Stack>

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Save />}
                  onClick={() => {
                    setSuccessMessage('Notification preferences updated!');
                    setTimeout(() => setSuccessMessage(''), 3000);
                  }}
                  sx={{ textTransform: 'none' }}
                >
                  Save Preferences
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* College Switch Dialog */}
        <Dialog open={openCollegeSwitch} onClose={() => setOpenCollegeSwitch(false)}>
          <DialogTitle>Switch College?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Switching colleges will reset your mining progress, tokens, and rank. This action cannot be undone. Are you sure you want to continue?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenCollegeSwitch(false)} sx={{ textTransform: 'none' }}>
              Cancel
            </Button>
            <Button onClick={confirmSwitchCollege} color="warning" variant="contained" sx={{ textTransform: 'none' }}>
              Yes, Switch College
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Account Dialog */}
        <Dialog open={openDeleteAccount} onClose={() => setOpenDeleteAccount(false)}>
          <DialogTitle sx={{ color: 'error.main' }}>Delete Account</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ mb: 2 }}>
              This action will permanently delete your account and all associated data including:
            </DialogContentText>
            <Box component="ul" sx={{ color: 'text.secondary', pl: 2 }}>
              <li>All mined tokens</li>
              <li>Mining history and streaks</li>
              <li>Referral data</li>
              <li>Account information</li>
            </Box>
            <DialogContentText sx={{ mt: 2, mb: 2 }}>
              Type <strong>DELETE</strong> to confirm:
            </DialogContentText>
            <TextField
              fullWidth
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="Type DELETE"
              variant="outlined"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { setOpenDeleteAccount(false); setDeleteConfirmText(''); }} sx={{ textTransform: 'none' }}>
              Cancel
            </Button>
            <Button
              onClick={handleDeleteAccount}
              color="error"
              variant="contained"
              disabled={deleteConfirmText !== 'DELETE'}
              sx={{ textTransform: 'none' }}
            >
              Delete My Account
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}

export default ProfileSettings;

