const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const { User } = require('../models/User');

let io = null;

/**
 * Initialize Socket.IO Server with HTTP Server & JWT Authentication
 */
function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true,
    },
  });

  // Socket.IO Connection Authentication Handshake Middleware
  io.use(async (socket, next) => {
    try {
      let token = null;

      // Extract JWT from handshake auth token or cookie header
      if (socket.handshake.auth && socket.handshake.auth.token) {
        token = socket.handshake.auth.token;
      } else if (socket.handshake.headers.cookie) {
        const cookies = socket.handshake.headers.cookie.split(';').reduce((acc, cookie) => {
          const [key, value] = cookie.trim().split('=');
          acc[key] = value;
          return acc;
        }, {});
        token = cookies.token;
      }

      if (!token) {
        return next(new Error('Authentication token required for WebSocket connection'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-passwordHash');

      if (!user || !user.isActive) {
        return next(new Error('User account unauthorized or suspended'));
      }

      socket.user = user;
      next();
    } catch (error) {
      console.error('[Socket Auth Error]:', error.message);
      return next(new Error('Invalid socket authentication token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.user._id.toString();
    const roomName = `user_${userId}`;

    // Join user-specific notification room
    socket.join(roomName);
    console.log(`[Socket.IO] Client connected: ${socket.user.name} (${socket.user.role}) -> Joined room: ${roomName}`);

    socket.on('disconnect', () => {
      console.log(`[Socket.IO] Client disconnected: ${socket.user.name}`);
    });
  });

  return io;
}

/**
 * Get Socket.IO Instance
 */
function getIO() {
  if (!io) {
    console.warn('[Socket.IO] Warning: io instance requested before initialization.');
  }
  return io;
}

/**
 * Emit Event to Specific User Room
 */
function emitToUser(userId, event, data) {
  if (io && userId) {
    const roomName = `user_${userId.toString()}`;
    io.to(roomName).emit(event, data);
  }
}

module.exports = {
  initSocket,
  getIO,
  emitToUser,
};
