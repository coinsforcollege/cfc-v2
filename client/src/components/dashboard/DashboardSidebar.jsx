import React from 'react';
import { Link, useLocation } from 'react-router';
import {
  LayoutDashboard,
  School,
  Trophy,
  Users,
  Gift,
  Megaphone,
  Settings,
  Coins,
  GraduationCap,
  Mail,
  HelpCircle
} from 'lucide-react';
import { Box, Typography, Chip, Divider } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

const DashboardSidebar = ({ stats = {} }) => {
  const { user } = useAuth();
  const location = useLocation();

  const navigationConfig = {
    student: [
      { id: 'dashboard', label: 'Overview', icon: LayoutDashboard, path: '/student/dashboard' },
      { id: 'colleges', label: 'My Colleges', icon: School, badge: stats.collegesCount, path: '/student/colleges' },
      { id: 'community', label: 'Community', icon: Users, badge: stats.referralsCount, path: '/student/referrals' },
      { id: 'ambassador', label: 'Ambassador', icon: Megaphone, path: '/student/ambassador' },
      { id: 'leaderboard', label: 'Leaderboard', icon: Trophy, path: '/student/leaderboard', disabled: true, comingSoon: true },
    ],
    college_admin: [
      { id: 'overview', label: 'Overview', icon: LayoutDashboard, path: '/college-admin/dashboard' },
      { id: 'community', label: 'Community', icon: Users, badge: stats.communityCount, path: '/college-admin/community' },
      { id: 'college', label: 'College Profile', icon: School, path: '/college-admin/college' },
      { id: 'token', label: 'Token Preferences', icon: Coins, path: '/college-admin/token' },
      { id: 'leaderboard', label: 'Leaderboard', icon: Trophy, path: '/college-admin/leaderboard' },
    ],
    platform_admin: [
      { id: 'overview', label: 'Overview', icon: LayoutDashboard, path: '/platform-admin/dashboard' },
      { id: 'students', label: 'Students', icon: GraduationCap, badge: stats.studentsCount, path: '/platform-admin/students' },
      { id: 'colleges', label: 'Colleges', icon: School, badge: stats.collegesCount, path: '/platform-admin/colleges' },
      { id: 'ambassadors', label: 'Ambassadors', icon: Megaphone, badge: stats.ambassadorsCount, path: '/platform-admin/ambassadors' },
      { id: 'subscribers', label: 'Subscribers', icon: Mail, badge: stats.subscribersCount, path: '/platform-admin/subscribers' },
    ],
  };

  const navItems = navigationConfig[user?.role] || [];

  const getRoleTitle = (role) => {
    switch (role) {
      case 'student':
        return 'Student Dashboard';
      case 'college_admin':
        return 'College Admin';
      case 'platform_admin':
        return 'Platform Admin';
      default:
        return 'Dashboard';
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
      sx={{
        width: '100%',
        maxWidth: 260,
        flexShrink: 0,
        borderRight: '1px solid #e5e7eb',
        background: '#ffffff',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          borderBottom: '1px solid #e5e7eb',
          p: 3,
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
          flexShrink: 0,
        }}
      >
        <Typography
          sx={{
            fontSize: '1.1rem',
            fontWeight: 700,
            color: '#1e293b',
            mb: 0.5,
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
          }}
        >
          {getRoleTitle(user?.role)}
        </Typography>
        <Typography
          sx={{
            fontSize: '0.85rem',
            color: '#64748b',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            wordBreak: 'break-all',
          }}
        >
          {user?.email}
        </Typography>
      </Box>

      {/* Navigation */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 2,
          '&::-webkit-scrollbar': {
            width: 6,
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f5f9',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#cbd5e1',
            borderRadius: 3,
          },
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Box
              key={item.id}
              component={item.disabled ? 'div' : Link}
              to={item.disabled ? undefined : item.path}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                px: 2,
                py: 1.5,
                mb: 0.5,
                borderRadius: 2,
                cursor: item.disabled ? 'not-allowed' : 'pointer',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                background: isActive
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : 'transparent',
                color: item.disabled ? '#94a3b8' : (isActive ? '#ffffff' : '#475569'),
                opacity: item.disabled ? 0.6 : 1,
                boxShadow: isActive ? '0 4px 12px rgba(102, 126, 234, 0.3)' : 'none',
                '&:hover': {
                  background: item.disabled
                    ? 'transparent'
                    : (isActive
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : 'rgba(102, 126, 234, 0.08)'),
                  transform: item.disabled ? 'none' : 'translateX(4px)',
                },
              }}
            >
              <Icon size={20} style={{ flexShrink: 0 }} />
              <Typography
                sx={{
                  flex: 1,
                  fontSize: '0.9rem',
                  fontWeight: isActive ? 600 : 500,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {item.label}
              </Typography>
              {item.comingSoon && (
                <Chip
                  label="Coming Soon"
                  size="small"
                  sx={{
                    height: 22,
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    background: 'rgba(100, 116, 139, 0.15)',
                    color: '#64748b',
                    '& .MuiChip-label': {
                      px: 1,
                    },
                  }}
                />
              )}
              {!item.comingSoon && item.badge !== undefined && item.badge > 0 && (
                <Chip
                  label={item.badge}
                  size="small"
                  sx={{
                    height: 22,
                    minWidth: 22,
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    background: isActive
                      ? 'rgba(255, 255, 255, 0.25)'
                      : 'rgba(102, 126, 234, 0.15)',
                    color: isActive ? '#ffffff' : '#667eea',
                    '& .MuiChip-label': {
                      px: 1,
                    },
                  }}
                />
              )}
            </Box>
          );
        })}

        <Divider sx={{ my: 2 }} />

        {/* Settings */}
        <Box
          component={Link}
          to={getSettingsPath()}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            px: 2,
            py: 1.5,
            borderRadius: 2,
            cursor: 'pointer',
            textDecoration: 'none',
            transition: 'all 0.2s ease',
            background: location.pathname === getSettingsPath()
              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              : 'transparent',
            color: location.pathname === getSettingsPath() ? '#ffffff' : '#475569',
            boxShadow: location.pathname === getSettingsPath() ? '0 4px 12px rgba(102, 126, 234, 0.3)' : 'none',
            '&:hover': {
              background: location.pathname === getSettingsPath()
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                : 'rgba(102, 126, 234, 0.08)',
              transform: 'translateX(4px)',
            },
          }}
        >
          <Settings size={20} style={{ flexShrink: 0 }} />
          <Typography
            sx={{
              flex: 1,
              fontSize: '0.9rem',
              fontWeight: location.pathname === getSettingsPath() ? 600 : 500,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            Settings
          </Typography>
        </Box>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          borderTop: '1px solid #e5e7eb',
          p: 2.5,
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            borderRadius: 2,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            p: 2.5,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'relative',
              zIndex: 1,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <HelpCircle size={18} style={{ color: 'white', flexShrink: 0 }} />
              <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: 'white' }}>
                Need Help?
              </Typography>
            </Box>
            <Typography
              sx={{
                fontSize: '0.75rem',
                color: 'rgba(255, 255, 255, 0.9)',
                mb: 2,
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
              }}
            >
              Check our documentation or contact support
            </Typography>
            <Box
              component="a"
              href="mailto:info@coinsforcollege.org"
              sx={{
                display: 'block',
                px: 2,
                py: 1,
                borderRadius: 1.5,
                background: 'rgba(255, 255, 255, 0.25)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                cursor: 'pointer',
                textAlign: 'center',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.35)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <Typography
                sx={{
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: 'white',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                Get Support
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardSidebar;
