import React from 'react';
import { Box, IconButton, Divider, Button, CircularProgress, Popper, ClickAwayListener, Paper } from '@mui/material';
import { Check, Trash2, ChevronDown, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../../contexts/NotificationContext';
import NotificationCard from './NotificationCard';
import { useTranslation } from 'react-i18next';

const NotificationDropdown = ({ anchorEl, open, onClose }) => {
  const { t } = useTranslation();
  const {
    notifications,
    isLoading,
    hasMore,
    loadMore,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearReadNotifications
  } = useNotifications();

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const handleClearRead = async () => {
    await clearReadNotifications();
  };

  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      placement="bottom-end"
      modifiers={[
        {
          name: 'offset',
          options: {
            offset: [0, 8],
          },
        },
      ]}
      sx={{ zIndex: 10000 }}
    >
      <ClickAwayListener onClickAway={onClose}>
        <Paper
          elevation={8}
          sx={{
            width: { xs: '90vw', sm: 420 },
            maxWidth: 420,
            maxHeight: '80vh',
            borderRadius: '16px',
            overflow: 'hidden',
            background: '#ffffff',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              padding: '12px 16px',
              borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
              <Box sx={{ fontSize: '1rem', fontWeight: 700, color: '#2d3748' }}>
                {t('notifications.notifications')}
              </Box>
              <Box sx={{ fontSize: '0.8rem', color: '#718096' }}>
                {t('notifications.unreadCount', { count: notifications.filter(n => !n.isRead).length })}
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <IconButton
                onClick={handleMarkAllAsRead}
                size="small"
                disabled={notifications.filter(n => !n.isRead).length === 0}
                sx={{
                  color: '#667eea',
                  opacity: notifications.filter(n => !n.isRead).length === 0 ? 0.3 : 1,
                  '&:hover': {
                    background: 'rgba(102, 126, 234, 0.08)',
                  },
                }}
                title={t('notifications.markAllAsRead')}
              >
                <Check size={18} />
              </IconButton>
              <IconButton
                onClick={handleClearRead}
                size="small"
                disabled={notifications.filter(n => n.isRead).length === 0}
                sx={{
                  color: '#667eea',
                  opacity: notifications.filter(n => n.isRead).length === 0 ? 0.3 : 1,
                  '&:hover': {
                    background: 'rgba(102, 126, 234, 0.08)',
                  },
                }}
                title={t('notifications.clearRead')}
              >
                <Trash2 size={18} />
              </IconButton>
              <IconButton
                onClick={onClose}
                size="small"
                sx={{
                  color: '#667eea',
                  '&:hover': {
                    background: 'rgba(102, 126, 234, 0.08)',
                  },
                }}
                title={t('common.close')}
              >
                <X size={18} />
              </IconButton>
            </Box>
          </Box>

          {/* Notifications List */}
          <Box
            sx={{
              maxHeight: 'calc(80vh - 100px)',
              overflowY: 'auto',
              padding: 2,
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-track': {
                background: '#f1f1f1',
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#888',
                borderRadius: '3px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: '#555',
              },
            }}
          >
            {notifications.length === 0 && !isLoading && (
              <Box
                sx={{
                  textAlign: 'center',
                  padding: 4,
                  color: '#a0aec0',
                }}
              >
                <Box sx={{ fontSize: '2rem', marginBottom: 1 }}>🔔</Box>
                <Box sx={{ fontSize: '0.9rem', fontWeight: 600 }}>
                  {t('notifications.noNotifications')}
                </Box>
                <Box sx={{ fontSize: '0.8rem', marginTop: 0.5 }}>
                  {t('notifications.notificationsDesc')}
                </Box>
              </Box>
            )}

            <AnimatePresence>
              {notifications.map((notification) => (
                <NotificationCard
                  key={notification._id}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                  onDelete={deleteNotification}
                />
              ))}
            </AnimatePresence>

            {isLoading && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  padding: 2,
                }}
              >
                <CircularProgress size={24} />
              </Box>
            )}
          </Box>

          {/* Load More Button */}
          {hasMore && notifications.length > 0 && (
            <>
              <Divider />
              <Box sx={{ padding: 1.5, textAlign: 'center' }}>
                <Button
                  onClick={loadMore}
                  disabled={isLoading}
                  sx={{
                    width: '100%',
                    textTransform: 'none',
                    fontWeight: 600,
                    color: '#667eea',
                    '&:hover': {
                      background: 'rgba(102, 126, 234, 0.08)',
                    },
                  }}
                  endIcon={<ChevronDown size={16} />}
                >
                  {t('notifications.loadMore')}
                </Button>
              </Box>
            </>
          )}
        </Paper>
      </ClickAwayListener>
    </Popper>
  );
};

export default NotificationDropdown;
