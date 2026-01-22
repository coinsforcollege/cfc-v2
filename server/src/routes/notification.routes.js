import express from 'express';
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearReadNotifications,
  registerPushTokenHandler,
  removePushTokenHandler
} from '../controllers/notification.controller.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get notifications (paginated with filters)
router.get('/', getNotifications);

// Get unread count
router.get('/unread-count', getUnreadCount);

// Push token management
router.post('/push-token', registerPushTokenHandler);
router.delete('/push-token', removePushTokenHandler);

// Mark all as read
router.put('/mark-all-read', markAllAsRead);

// Clear all read notifications
router.delete('/clear-read', clearReadNotifications);

// Mark single notification as read
router.put('/:id/read', markAsRead);

// Delete single notification
router.delete('/:id', deleteNotification);

export default router;
