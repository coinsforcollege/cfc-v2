import jwt from 'jsonwebtoken';
import MiningSession from '../models/Mining.js';
import Wallet from '../models/Wallet.js';
import User from '../models/User.js';

// Store active connections by user ID
const userConnections = new Map();
// Track users with active mining sessions
const usersWithActiveMining = new Set();

// Authenticate WebSocket connection
const authenticateSocket = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    socket.userRole = decoded.role;
    
    next();
  } catch (error) {
    next(new Error('Authentication error: Invalid token'));
  }
};

// Setup WebSocket handlers
export const setupWebSocketHandlers = (io) => {
  // Apply authentication middleware
  io.use(authenticateSocket);

  io.on('connection', (socket) => {
    console.log(`🔌 User ${socket.userId} connected to mining WebSocket`);
    
    // Store user connection
    userConnections.set(socket.userId, socket);
    
    // Join user to their personal room for targeted updates
    socket.join(`user:${socket.userId}`);
    
    // Handle mining status requests
    socket.on('getMiningStatus', async () => {
      try {
        const miningStatus = await getMiningStatusForUser(socket.userId);
        socket.emit('miningStatus', miningStatus);
      } catch (error) {
        socket.emit('error', { message: 'Failed to fetch mining status' });
      }
    });
    
    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`🔌 User ${socket.userId} disconnected from mining WebSocket`);
      userConnections.delete(socket.userId);
    });
  });

  // Send periodic updates every 5 seconds to users with active mining sessions
  setInterval(async () => {
    // Only send updates to users who have active mining sessions
    for (const userId of usersWithActiveMining) {
      const socket = userConnections.get(userId);
      if (socket) {
        try {
          const miningStatus = await getMiningStatusForUser(userId);
          socket.emit('miningStatus', miningStatus);
          
          // Check if user still has active sessions
          const hasActiveSessions = miningStatus.activeSessions?.some(session => 
            session.isActive && session.remainingHours > 0
          );
          
          if (!hasActiveSessions) {
            usersWithActiveMining.delete(userId);
          }
        } catch (error) {
          console.error(`Error sending periodic update to user ${userId}:`, error);
        }
      }
    }
  }, 5000); // Update every 5 seconds
};

// Get mining status for a specific user
const getMiningStatusForUser = async (userId) => {
  try {
    // Get student info
    const student = await User.findById(userId)
      .populate('studentProfile.miningColleges.college', 'name country logo');

    // Get all active mining sessions
    const activeSessions = await MiningSession.find({
      student: userId,
      isActive: true
    }).populate('college', 'name country logo');

    // Get all wallets
    const wallets = await Wallet.find({ student: userId })
      .populate('college', 'name country logo');

    // Calculate current tokens for each active session
    const now = new Date();
    const sessionsWithCurrentTokens = activeSessions.map(session => {
      const miningDuration = (now - session.startTime) / (1000 * 60 * 60); // in hours
      const currentTokens = miningDuration * session.earningRate;
      const remainingTime = session.endTime - now; // in milliseconds
      const remainingHours = Math.max(0, remainingTime / (1000 * 60 * 60));

      return {
        college: session.college,
        startTime: session.startTime,
        endTime: session.endTime,
        earningRate: session.earningRate,
        currentTokens: Math.max(0, currentTokens),
        remainingHours: remainingHours,
        isActive: remainingHours > 0,
        sessionId: session._id
      };
    });

    return {
      miningColleges: student.studentProfile.miningColleges,
      activeSessions: sessionsWithCurrentTokens,
      wallets,
      earningRate: {
        base: student.studentProfile.baseEarningRate,
        referralBonus: student.studentProfile.referralBonus,
        total: student.studentProfile.baseEarningRate + student.studentProfile.referralBonus
      }
    };
  } catch (error) {
    console.error('Error getting mining status for user:', error);
    throw error;
  }
};

// Broadcast mining status update to a specific user
export const broadcastMiningUpdate = async (userId) => {
  try {
    const socket = userConnections.get(userId);
    if (socket) {
      const miningStatus = await getMiningStatusForUser(userId);
      socket.emit('miningStatus', miningStatus);
      
      // Update tracking of users with active mining
      const hasActiveSessions = miningStatus.activeSessions?.some(session => 
        session.isActive && session.remainingHours > 0
      );
      
      if (hasActiveSessions) {
        usersWithActiveMining.add(userId);
      } else {
        usersWithActiveMining.delete(userId);
      }
    }
  } catch (error) {
    console.error('Error broadcasting mining update:', error);
  }
};

// Broadcast mining status update to all connected users
export const broadcastMiningUpdateToAll = async () => {
  try {
    for (const [userId, socket] of userConnections) {
      const miningStatus = await getMiningStatusForUser(userId);
      socket.emit('miningStatus', miningStatus);
    }
  } catch (error) {
    console.error('Error broadcasting mining update to all:', error);
  }
};
