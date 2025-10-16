import React, { useEffect, useRef } from 'react';
import { Box, IconButton } from '@mui/material';
import { X, Bell, Award, Users, TrendingUp, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import { formatDistanceToNow } from 'date-fns';

const NotificationCard = ({ notification, onMarkAsRead, onDelete }) => {
  const cardRef = useRef(null);
  const observerRef = useRef(null);
  const navigate = useNavigate();

  // Get icon based on notification type
  const getNotificationIcon = () => {
    const { type, category } = notification;

    if (category === 'milestone') {
      return <Award size={20} color="#10b981" />;
    } else if (category === 'referral') {
      return <Users size={20} color="#8b5cf6" />;
    } else if (category === 'mining') {
      return <TrendingUp size={20} color="#f59e0b" />;
    } else if (category === 'college') {
      return <Sparkles size={20} color="#ec4899" />;
    } else if (type.includes('approved')) {
      return <CheckCircle size={20} color="#10b981" />;
    } else if (type.includes('rejected')) {
      return <AlertCircle size={20} color="#ef4444" />;
    }

    return <Bell size={20} color="#6b7280" />;
  };

  // Get priority color
  const getPriorityColor = () => {
    switch (notification.priority) {
      case 'high':
        return '#ec4899';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#6b7280';
      default:
        return '#8b5cf6';
    }
  };

  // Intersection Observer to mark as read when viewed
  useEffect(() => {
    if (!notification.isRead && cardRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
              // Mark as read when 50% of card is visible
              setTimeout(() => {
                onMarkAsRead(notification._id);
              }, 500); // Small delay to ensure user actually saw it
            }
          });
        },
        { threshold: 0.5 }
      );

      observerRef.current.observe(cardRef.current);
    }

    return () => {
      if (observerRef.current && cardRef.current) {
        observerRef.current.unobserve(cardRef.current);
      }
    };
  }, [notification._id, notification.isRead, onMarkAsRead]);

  const handleClick = () => {
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(notification._id);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.2 }}
      style={{ marginBottom: 8 }}
    >
      <Box
        onClick={handleClick}
        sx={{
          position: 'relative',
          background: notification.isRead
            ? 'rgba(255, 255, 255, 0.95)'
            : 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(236, 72, 153, 0.08) 100%)',
          backdropFilter: 'blur(10px)',
          border: notification.isRead
            ? '1px solid rgba(0, 0, 0, 0.08)'
            : `1px solid ${getPriorityColor()}40`,
          borderRadius: '12px',
          padding: 2,
          cursor: notification.actionUrl ? 'pointer' : 'default',
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateX(4px)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            background: notification.isRead
              ? 'rgba(255, 255, 255, 1)'
              : 'linear-gradient(135deg, rgba(139, 92, 246, 0.12) 0%, rgba(236, 72, 153, 0.12) 100%)',
          },
        }}
      >
        {/* Unread indicator */}
        {!notification.isRead && (
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 4,
              height: '60%',
              background: `linear-gradient(180deg, ${getPriorityColor()} 0%, ${getPriorityColor()}80 100%)`,
              borderRadius: '0 4px 4px 0',
            }}
          />
        )}

        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
          {/* Icon */}
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(139, 92, 246, 0.1)',
              flexShrink: 0,
            }}
          >
            {getNotificationIcon()}
          </Box>

          {/* Content */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box
              sx={{
                fontSize: '0.9rem',
                fontWeight: 600,
                color: '#2d3748',
                marginBottom: 0.5,
                lineHeight: 1.4,
              }}
            >
              {notification.title}
            </Box>
            <Box
              sx={{
                fontSize: '0.85rem',
                color: '#718096',
                lineHeight: 1.4,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {notification.message}
            </Box>
            <Box
              sx={{
                fontSize: '0.75rem',
                color: '#a0aec0',
                marginTop: 0.75,
              }}
            >
              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
            </Box>
          </Box>

          {/* Delete button */}
          <IconButton
            onClick={handleDelete}
            size="small"
            sx={{
              opacity: 0.5,
              transition: 'opacity 0.2s ease',
              '&:hover': {
                opacity: 1,
                background: 'rgba(239, 68, 68, 0.1)',
              },
            }}
          >
            <X size={16} />
          </IconButton>
        </Box>
      </Box>
    </motion.div>
  );
};

export default NotificationCard;
