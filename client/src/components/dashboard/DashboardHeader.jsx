import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Menu, X, Search, Bell, LogOut, Settings as SettingsIcon, Home, School, BookOpen, Map } from 'lucide-react';
import { IconButton, Avatar, Menu as MuiMenu, MenuItem, ListItemIcon, Divider, Badge, Box } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

const DashboardHeader = ({ onMenuClick, mobileMenuOpen = false, searchPlaceholder = "Search..." }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const getDashboardPath = () => {
    if (!user) return '/';
    if (user.role === 'student') return '/student/dashboard';
    if (user.role === 'college_admin') return '/college-admin/dashboard';
    if (user.role === 'platform_admin') return '/platform-admin/dashboard';
    return '/';
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'student':
        return 'Student';
      case 'college_admin':
        return 'College Admin';
      case 'platform_admin':
        return 'Platform Admin';
      default:
        return 'User';
    }
  };

  const getSettingsPath = () => {
    if (user?.role === 'student') return '/student/settings';
    if (user?.role === 'college_admin') return '/college-admin/settings';
    if (user?.role === 'platform_admin') return '/platform-admin/settings';
    return '/settings';
  };

  return (
    <Box
      component="header"
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        height: 64,
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        pointerEvents: 'auto',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '100%',
          px: { xs: 2, lg: 3 },
        }}
      >
        {/* Left: Menu button + Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Hamburger clicked, current state:', mobileMenuOpen);
              onMenuClick();
            }}
            sx={{
              display: { xs: 'flex', lg: 'none' },
              color: 'white',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </IconButton>

          <Link
            to={getDashboardPath()}
            onClick={() => {
              if (mobileMenuOpen && onMenuClick) {
                onMenuClick();
              }
            }}
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Box
              component="span"
              sx={{
                fontSize: { xs: '0.8rem', sm: '1.1rem', md: '1.3rem' },
                fontWeight: 900,
                color: 'white',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                '@media (max-width: 480px)': {
                  fontSize: '0.75rem',
                  letterSpacing: '0.3px',
                },
              }}
            >
              Coins For College
            </Box>
          </Link>
        </Box>

        {/* Center: Search bar */}
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            flex: 1,
            maxWidth: 500,
            mx: 4,
          }}
        >
          <Box
            sx={{
              position: 'relative',
              width: '100%',
            }}
          >
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#ffffff',
                zIndex: 10,
                pointerEvents: 'none',
              }}
            />
            <input
              type="search"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                height: 40,
                paddingLeft: 40,
                paddingRight: 16,
                background: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: 8,
                color: 'white',
                fontSize: '0.9rem',
                outline: 'none',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                transition: 'all 0.2s ease',
                position: 'relative',
                zIndex: 1,
              }}
              onFocus={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                e.target.style.border = '1px solid rgba(255, 255, 255, 0.5)';
              }}
              onBlur={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                e.target.style.border = '1px solid rgba(255, 255, 255, 0.3)';
              }}
            />
          </Box>
        </Box>

        {/* Right: Notifications + Profile */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Search icon for mobile */}
          <IconButton
            sx={{
              display: { xs: 'flex', md: 'none' },
              color: 'white',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <Search size={20} />
          </IconButton>

          {/* Notifications */}
          <IconButton
            sx={{
              color: 'white',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <Badge
              badgeContent={3}
              sx={{
                '& .MuiBadge-badge': {
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '0.7rem',
                  minWidth: 18,
                  height: 18,
                  boxShadow: '0 2px 8px rgba(245, 87, 108, 0.4)',
                },
              }}
            >
              <Bell size={20} />
            </Badge>
          </IconButton>

          {/* Profile */}
          <Box
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              cursor: 'pointer',
              padding: '6px 12px',
              borderRadius: 2,
              transition: 'all 0.2s ease',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <Avatar
              sx={{
                width: 36,
                height: 36,
                background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
                color: '#667eea',
                fontSize: '0.85rem',
                fontWeight: 700,
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.15)',
              }}
            >
              {getInitials(user?.name)}
            </Avatar>
            <Box sx={{ display: { xs: 'none', lg: 'block' }, textAlign: 'left' }}>
              <Box sx={{ fontSize: '0.9rem', fontWeight: 600, color: 'white', lineHeight: 1.2 }}>
                {user?.name}
              </Box>
              <Box sx={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.2 }}>
                {getRoleLabel(user?.role)}
              </Box>
            </Box>
          </Box>

          <MuiMenu
            anchorEl={anchorEl}
            open={open}
            onClose={() => setAnchorEl(null)}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 200,
                borderRadius: 2,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                '& .MuiMenuItem-root': {
                  py: 1.25,
                  px: 2,
                  fontSize: '0.9rem',
                  '&:hover': {
                    background: 'rgba(102, 126, 234, 0.08)',
                  },
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Box sx={{ fontWeight: 600, color: '#1e293b' }}>{user?.name}</Box>
              <Box sx={{ fontSize: '0.8rem', color: '#64748b' }}>{user?.email}</Box>
            </Box>
            <Divider />
            <MenuItem onClick={() => { setAnchorEl(null); navigate('/'); }}>
              <ListItemIcon>
                <Home size={18} />
              </ListItemIcon>
              Home
            </MenuItem>
            <MenuItem onClick={() => { setAnchorEl(null); navigate('/colleges'); }}>
              <ListItemIcon>
                <School size={18} />
              </ListItemIcon>
              Browse Colleges
            </MenuItem>
            <MenuItem onClick={() => { setAnchorEl(null); navigate('/blog'); }}>
              <ListItemIcon>
                <BookOpen size={18} />
              </ListItemIcon>
              Blog
            </MenuItem>
            <MenuItem onClick={() => { setAnchorEl(null); navigate('/#network-map'); }}>
              <ListItemIcon>
                <Map size={18} />
              </ListItemIcon>
              Network Map
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => { setAnchorEl(null); navigate(getSettingsPath()); }}>
              <ListItemIcon>
                <SettingsIcon size={18} />
              </ListItemIcon>
              Settings
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={() => {
                setAnchorEl(null);
                handleLogout();
              }}
              sx={{ color: '#ef4444 !important' }}
            >
              <ListItemIcon sx={{ color: '#ef4444 !important' }}>
                <LogOut size={18} />
              </ListItemIcon>
              Logout
            </MenuItem>
          </MuiMenu>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardHeader;
