const { Notification, NOTIFICATION_TYPES } = require('../models/Notification');
const { User, ROLES } = require('../models/User');
const { emitToUser } = require('../config/socket');

const notificationService = {
  /**
   * Create a single notification, save to MongoDB, and emit real-time Socket event
   */
  async createNotification({
    recipientId,
    recipientRole,
    type,
    title,
    message,
    relatedEntityType,
    relatedEntityId,
    idempotencyKey,
  }) {
    try {
      if (!recipientId || !type || !title || !message) {
        throw new Error('Missing required notification parameters.');
      }

      // Check if duplicate notification exists if idempotencyKey is provided
      if (idempotencyKey) {
        const existing = await Notification.findOne({ recipientId, idempotencyKey });
        if (existing) {
          console.log(`[Notification Service] Duplicate event skipped for key: ${idempotencyKey}`);
          return existing;
        }
      }

      const notification = await Notification.create({
        recipientId,
        recipientRole,
        type,
        title,
        message,
        relatedEntityType,
        relatedEntityId,
        idempotencyKey,
      });

      // Fetch updated unread count for user
      const unreadCount = await Notification.countDocuments({ recipientId, isRead: false });

      // Emit real-time notification to online user
      emitToUser(recipientId, 'notification:new', {
        notification,
        unreadCount,
      });

      return notification;
    } catch (error) {
      if (error.code === 11000) {
        // Mongo duplicate key error on idempotencyKey index
        console.log(`[Notification Service] Idempotent duplicate blocked for recipient: ${recipientId}`);
        return null;
      }
      console.error('[Notification Service Error]:', error);
      throw error;
    }
  },

  /**
   * Bulk create notifications for multiple recipients (e.g. matched donors or admins)
   */
  async createNotifications(notificationsArray) {
    const results = [];
    for (const item of notificationsArray) {
      try {
        const notif = await this.createNotification(item);
        if (notif) results.push(notif);
      } catch (err) {
        console.error('[Bulk Notification Error]:', err.message);
      }
    }
    return results;
  },

  /**
   * Notify all system admins (e.g., pending hospital registration, critical request)
   */
  async notifyAdmins({ type, title, message, relatedEntityType, relatedEntityId, idempotencyKey }) {
    try {
      const admins = await User.find({ role: ROLES.ADMIN, isActive: true }).select('_id');
      const payload = admins.map((admin) => ({
        recipientId: admin._id,
        recipientRole: ROLES.ADMIN,
        type,
        title,
        message,
        relatedEntityType,
        relatedEntityId,
        idempotencyKey: idempotencyKey ? `${idempotencyKey}_admin_${admin._id}` : undefined,
      }));
      return await this.createNotifications(payload);
    } catch (error) {
      console.error('[Notify Admins Error]:', error);
    }
  },

  /**
   * Fetch paginated user notifications
   */
  async getUserNotifications(userId, { page = 1, limit = 20, unreadOnly = false }) {
    const query = { recipientId: userId };
    if (unreadOnly) query.isRead = false;

    const skip = (page - 1) * limit;

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Notification.countDocuments(query),
      Notification.countDocuments({ recipientId: userId, isRead: false }),
    ]);

    return {
      notifications,
      total,
      unreadCount,
      page: Number(page),
      pages: Math.ceil(total / limit) || 1,
    };
  },

  /**
   * Get unread notification count
   */
  async getUnreadCount(userId) {
    return await Notification.countDocuments({ recipientId: userId, isRead: false });
  },

  /**
   * Mark single notification as read (User ownership enforced)
   */
  async markAsRead(notificationId, userId) {
    const notification = await Notification.findOne({ _id: notificationId, recipientId: userId });
    if (!notification) return null;

    if (!notification.isRead) {
      notification.isRead = true;
      notification.readAt = new Date();
      await notification.save();
    }

    const unreadCount = await this.getUnreadCount(userId);

    // Real-time unread count sync
    emitToUser(userId, 'notification:read', {
      notificationId: notification._id,
      unreadCount,
    });

    return { notification, unreadCount };
  },

  /**
   * Mark all notifications for user as read
   */
  async markAllAsRead(userId) {
    await Notification.updateMany(
      { recipientId: userId, isRead: false },
      { $set: { isRead: true, readAt: new Date() } }
    );

    const unreadCount = 0;

    // Real-time unread count sync
    emitToUser(userId, 'notification:read_all', { unreadCount });

    return { unreadCount };
  },
};

module.exports = notificationService;
