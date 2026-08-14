const notificationService = require('../services/notificationService');
const { sendError, sendSuccess } = require('../utils/apiError');

/**
 * @desc    Get Authenticated User Notifications (Paginated & Filtered)
 * @route   GET /api/notifications
 * @access  Private (DONOR, HOSPITAL, ADMIN)
 */
const getUserNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20, unreadOnly } = req.query;
    const isUnreadOnly = unreadOnly === 'true' || unreadOnly === true;

    const data = await notificationService.getUserNotifications(req.user._id, {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      unreadOnly: isUnreadOnly,
    });

    return sendSuccess(res, 200, 'User notifications retrieved successfully', data);
  } catch (error) {
    console.error('[Get Notifications Error]:', error);
    return sendError(res, 500, 'Failed to fetch user notifications.', 'SERVER_ERROR');
  }
};

/**
 * @desc    Get Unread Notification Count
 * @route   GET /api/notifications/unread-count
 * @access  Private (DONOR, HOSPITAL, ADMIN)
 */
const getUnreadCount = async (req, res) => {
  try {
    const unreadCount = await notificationService.getUnreadCount(req.user._id);
    return sendSuccess(res, 200, 'Unread notification count retrieved', { unreadCount });
  } catch (error) {
    console.error('[Get Unread Count Error]:', error);
    return sendError(res, 500, 'Failed to fetch unread notification count.', 'SERVER_ERROR');
  }
};

/**
 * @desc    Mark Single Notification as Read (User Ownership Protection)
 * @route   PATCH /api/notifications/:id/read
 * @access  Private (DONOR, HOSPITAL, ADMIN)
 */
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await notificationService.markAsRead(id, req.user._id);

    if (!result) {
      return sendError(res, 404, 'Notification not found or access forbidden.', 'NOT_FOUND');
    }

    return sendSuccess(res, 200, 'Notification marked as read', result);
  } catch (error) {
    console.error('[Mark Read Error]:', error);
    return sendError(res, 500, 'Failed to mark notification as read.', 'SERVER_ERROR');
  }
};

/**
 * @desc    Mark All User Notifications as Read
 * @route   PATCH /api/notifications/read-all
 * @access  Private (DONOR, HOSPITAL, ADMIN)
 */
const markAllAsRead = async (req, res) => {
  try {
    const result = await notificationService.markAllAsRead(req.user._id);
    return sendSuccess(res, 200, 'All notifications marked as read', result);
  } catch (error) {
    console.error('[Mark All Read Error]:', error);
    return sendError(res, 500, 'Failed to mark all notifications as read.', 'SERVER_ERROR');
  }
};

module.exports = {
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
};
