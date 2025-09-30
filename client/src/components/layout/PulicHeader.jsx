import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Tooltip,
  Skeleton,
  alpha
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useAuth } from '../../contexts/AuthContext';
import { useLogout } from '../../api/student/student.mutations';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Logo from '../../assets/logo.svg';

const PublicHeader = () => {
  const { user, isAuthenticated, logout, isLoading, token } = useAuth();
  console.log('line 28 public header', user);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  console.log(isAuthenticated);
  const logoutMutation = useLogout();

  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // User menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const userMenuOpen = Boolean(anchorEl);

  // How It Works menu state
  const [howItWorksAnchor, setHowItWorksAnchor] = useState(null);
  const howItWorksMenuOpen = Boolean(howItWorksAnchor);
  const [anchorEl2, setAnchorEl2] = useState(null);
  const open = Boolean(anchorEl2);

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      setAnchorEl(null);
      logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      // Still close menu and navigate even if logout API fails
      setAnchorEl(null);
      navigate('/');
    }
  };

  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDashboardClick = () => {
    switch (user?.role) {
      case 'student':
        navigate('/student');
        break;
      case 'college_admin':
        navigate('/college-admin');
        break;
      case 'platform_admin':
        navigate('/admin');
        break;
      default:
        navigate('/dashboard');
    }
    setAnchorEl(null);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navigationItems = [
    { label: 'Browse Colleges', path: '/browse-colleges' },
    { label: 'Statistics', path: '/stats' }
  ];

  const handleHowItWorksClick = (event) => {
    setHowItWorksAnchor(event.currentTarget);
  };

  const handleHowItWorksClose = () => {
    setHowItWorksAnchor(null);
  };

  return (
    <AppBar
      position="sticky"
      className='shadow-md'
      elevation={0}
      sx={(theme) => ({
        backgroundColor: alpha(theme.palette.background.default, 0.75), // semi-transparent
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)', // Safari support
        boxShadow: 'none',
      })}
    >
      <Toolbar sx={{ justifyContent: 'space-between', height: '64px' }}>
        {/* Logo */}
        <Box component={Link} to="/" sx={{
          display: 'flex',
          alignItems: 'center',
          textDecoration: 'none',
        }}>
          <img src={Logo} alt="Logo" style={{ width: '200px', height: 'auto' }} />
        </Box>

        {/* Desktop Navigation */}
        <Box sx={{ display: { xs: 'none', lg: 'flex' }, alignItems: 'center', gap: 3 }}>
          <Button
            onClick={handleHowItWorksClick}
            endIcon={<ArrowDropDownIcon />}
            sx={{
              color: 'text.secondary',
              textTransform: 'none',
              '&:hover': {
                color: 'text.primary',
              },
              backgroundColor: 'transparent',
            }}
          >
            How It Works
          </Button>
          <Menu
            anchorEl={howItWorksAnchor}
            open={howItWorksMenuOpen}
            onClose={handleHowItWorksClose}
            className='mt-2'
            slotProps={{
              paper: {
                sx: { minWidth: 220 }
              }
            }}
          >
            <MenuItem component={Link} to="/how-it-works/students" onClick={handleHowItWorksClose}>
              For Students
            </MenuItem>
            <MenuItem component={Link} to="/how-it-works/colleges" onClick={handleHowItWorksClose}>
              For Colleges
            </MenuItem>
          </Menu>
          {navigationItems.map((item) => (
            <Button
              key={item.path}
              component={Link}
              to={item.path}
              sx={{
                color: 'text.secondary',
                textTransform: 'none',
                '&:hover': {
                  color: 'text.primary',
                },
                backgroundColor: 'transparent',
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>

        {/* Desktop Auth Buttons */}
        <Box sx={{ display: { xs: 'none', lg: 'flex' }, alignItems: 'center', gap: 1 }}>
          {isLoading && token ? (
            <Skeleton variant="circular" width={32} height={32} />
          ) : isAuthenticated ? (
            <>
              <Tooltip title={user?.email || 'Account settings'}>
                <IconButton
                  size="small"
                  onClick={handleUserMenuOpen}
                >
                  <Avatar sx={{ width: 32, height: 32 }}>
                    {user?.firstName?.charAt(0).toUpperCase() || 'U'}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorEl}
                open={userMenuOpen}
                onClose={handleUserMenuClose}
                onClick={handleUserMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                slotProps={{
                  paper: {
                    sx: { minWidth: 220 }
                  }
                }}
              >
                <MenuItem onClick={handleDashboardClick}>
                  <DashboardIcon sx={{ mr: 1.5 }} /> Dashboard
                </MenuItem>
                <MenuItem>
                  <PersonIcon sx={{ mr: 1.5 }} /> Profile
                </MenuItem>
                <MenuItem>
                  <SettingsIcon sx={{ mr: 1.5 }} /> Settings
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon sx={{ mr: 1.5 }} /> Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button
                variant="outlined"
                component={Link}
                to="/auth/login"
                sx={{ textTransform: 'none' }}
              >
                Login
              </Button>

              <div>
                <Button
                  variant="contained"
                  onClick={(event) => setAnchorEl2(event.currentTarget)}
                  className='capitalize'
                  endIcon={<ArrowDropDownIcon />}
                >
                  Register
                </Button>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl2}
                  open={open}
                  onClose={() => setAnchorEl2(null)}
                  slotProps={{
                    list: {
                      'aria-labelledby': 'basic-button',
                    },
                  }}
                  className='mt-2'
                >
                  <MenuItem onClick={() => {
                    setAnchorEl2(null);
                    navigate('/auth/register/student');
                  }}>Join as Student</MenuItem>
                  <MenuItem onClick={() => {
                    setAnchorEl2(null);
                    navigate('/auth/register/admin');
                  }}>Join as College</MenuItem>
                </Menu>
              </div>
            </>
          )}
        </Box>

        {/* Mobile Menu Button */}
        <IconButton
          aria-label="menu"
          onClick={handleMobileMenuToggle}
          sx={{ display: { xs: 'flex', lg: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        {/* Mobile Drawer */}
        <Drawer
          anchor="right"
          open={mobileMenuOpen}
          onClose={handleMobileMenuToggle}
        >
          <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={handleMobileMenuToggle}
            onKeyDown={handleMobileMenuToggle}
          >
            <List>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/how-it-works/students">
                  <ListItemText primary="How It Works - Students" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/how-it-works/colleges">
                  <ListItemText primary="How It Works - Colleges" />
                </ListItemButton>
              </ListItem>
              {navigationItems.map((item) => (
                <ListItem key={item.path} disablePadding>
                  <ListItemButton component={Link} to={item.path}>
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            <Divider />
            <List>
              {isAuthenticated ? (
                <>
                  <ListItem disablePadding>
                    <ListItemButton onClick={handleDashboardClick}>
                      <ListItemText primary="Dashboard" />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemButton onClick={handleLogout}>
                      <ListItemText primary="Logout" />
                    </ListItemButton>
                  </ListItem>
                </>
              ) : (
                <>
                  <ListItem disablePadding>
                    <ListItemButton component={Link} to="/auth/login">
                      <ListItemText primary="Login" />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemButton component={Link} to="/auth/register">
                      <ListItemText primary="Sign Up" />
                    </ListItemButton>
                  </ListItem>
                </>
              )}
            </List>
          </Box>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default PublicHeader
