import jwt from 'jsonwebtoken';
import MiningSession from '../models/Mining.js';
import Wallet from '../models/Wallet.js';
import User from '../models/User.js';

// Store active connections by user ID (supports multiple devices per user)
// Structure: Map<userId, Set<socketId>>
const userConnections = new Map();
// Track users with active mining sessions
const usersWithActiveMining = new Set();
// Cache mining sessions data to avoid repeated DB queries
// Structure: Map<userId, { sessions: Array, wallets: Array, miningColleges: Array, earningRate: Object, lastFetched: Date }>
const userMiningCache = new Map();
// Store socket.io instance for room-based broadcasting
let ioInstance = null;

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
  // Store io instance for room-based broadcasting
  ioInstance = io;
  
  // Apply authentication middleware
  io.use(authenticateSocket);

  io.on('connection', (socket) => {
    console.log(`🔌 User ${socket.userId} connected to mining WebSocket (socket: ${socket.id})`);
    
    // Store user connection (support multiple devices)
    if (!userConnections.has(socket.userId)) {
      userConnections.set(socket.userId, new Set());
    }
    userConnections.get(socket.userId).add(socket.id);
    
    // Join user to their personal room for targeted updates
    socket.join(`user:${socket.userId}`);
    
    // Handle mining status requests
    socket.on('getMiningStatus', async () => {
      try {
        const miningStatus = await getMiningStatusForUser(socket.userId);
        socket.emit('miningStatus', miningStatus);
        
        // Add/remove user from active mining tracking based on active sessions
        const hasActiveSessions = miningStatus.activeSessions?.some(session => 
          session.isActive && session.remainingHours > 0
        );
        
        if (hasActiveSessions) {
          usersWithActiveMining.add(socket.userId);
        } else {
          usersWithActiveMining.delete(socket.userId);
        }
      } catch (error) {
        socket.emit('error', { message: 'Failed to fetch mining status' });
      }
    });
    
    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`🔌 User ${socket.userId} disconnected from mining WebSocket (socket: ${socket.id})`);
      
      // Remove this specific socket from user's connections
      const userSockets = userConnections.get(socket.userId);
      if (userSockets) {
        userSockets.delete(socket.id);
        
        // If user has no more connections, clean up completely
        if (userSockets.size === 0) {
          userConnections.delete(socket.userId);
          usersWithActiveMining.delete(socket.userId);
          userMiningCache.delete(socket.userId);
        }
      }
    });
  });

  // Send periodic updates every 5 seconds to users with active mining sessions
  // Using batched processing to prevent overwhelming the server
  setInterval(async () => {
    const now = Date.now();
    const usersArray = Array.from(usersWithActiveMining);

    // If no users, skip processing
    if (usersArray.length === 0) return;

    // Process users in batches to prevent overwhelming the server
    const BATCH_SIZE = 50; // Process 50 users at a time
    const BATCH_DELAY = Math.floor(5000 / Math.ceil(usersArray.length / BATCH_SIZE)); // Spread batches across 5 seconds

    for (let i = 0; i < usersArray.length; i += BATCH_SIZE) {
      const batch = usersArray.slice(i, i + BATCH_SIZE);

      // Process batch in parallel
      const batchPromises = batch.map(async (userId) => {
        const userSockets = userConnections.get(userId);
        if (userSockets && userSockets.size > 0) {
          try {
            const miningStatus = await getMiningStatusForUserOptimized(userId, now);

            // Broadcast to all devices of this user using room
            ioInstance.to(`user:${userId}`).emit('miningStatus', miningStatus);

            // Check if user still has active sessions
            const hasActiveSessions = miningStatus.activeSessions?.some(session =>
              session.isActive && session.remainingHours > 0
            );

            if (!hasActiveSessions) {
              usersWithActiveMining.delete(userId);
              userMiningCache.delete(userId);
            }
          } catch (error) {
            console.error(`Error sending periodic update to user ${userId}:`, error);
          }
        } else {
          // Clean up tracking for disconnected users
          usersWithActiveMining.delete(userId);
          userMiningCache.delete(userId);
        }
      });

      // Wait for current batch to complete before starting next batch
      await Promise.all(batchPromises);

      // Add delay between batches if there are more users (except for last batch)
      if (i + BATCH_SIZE < usersArray.length && BATCH_DELAY > 0) {
        await new Promise(resolve => setTimeout(resolve, BATCH_DELAY));
      }
    }
  }, 5000); // Update every 5 seconds
};

// Optimized function that uses cached data for periodic updates
const getMiningStatusForUserOptimized = async (userId, currentTime) => {
  try {
    const cached = userMiningCache.get(userId);
    
    // If cache is missing or stale (>30 seconds), refresh from DB
    if (!cached || (Date.now() - cached.lastFetched) > 30000) {
      return await getMiningStatusForUser(userId, true);
    }
    
    // Use cached session data, only recalculate time-based values
    const now = new Date(currentTime);
    const sessionsWithCurrentTokens = cached.sessions.map(session => {
      const miningDuration = (now - new Date(session.startTime)) / (1000 * 60 * 60);
      const currentTokens = miningDuration * session.earningRate;
      const remainingTime = new Date(session.endTime) - now;
      const remainingHours = Math.max(0, remainingTime / (1000 * 60 * 60));

      // Periodic logging (only log every 30 seconds to avoid spam)
      const shouldLog = Math.floor(Date.now() / 30000) !== Math.floor((Date.now() - 5000) / 30000);
      if (shouldLog && remainingHours > 0) {
        console.log(`[WS Real-time] College: ${session.college?._id || session.college}, Duration: ${miningDuration.toFixed(8)}h, Tokens: ${currentTokens.toFixed(8)}`);
      }

      return {
        college: session.college,
        startTime: session.startTime,
        endTime: session.endTime,
        earningRate: session.earningRate,
        currentTokens: Math.max(0, currentTokens),
        remainingHours: remainingHours,
        isActive: remainingHours > 0,
        sessionId: session.sessionId
      };
    });

    return {
      miningColleges: cached.miningColleges,
      activeSessions: sessionsWithCurrentTokens,
      wallets: cached.wallets
      // Note: Earning rates are now per-college, available in each session's earningRate field
    };
  } catch (error) {
    console.error('Error in optimized mining status:', error);
    // Fall back to full DB query on error
    return await getMiningStatusForUser(userId, true);
  }
};

// Get mining status for a specific user
const getMiningStatusForUser = async (userId, updateCache = true) => {
  try {
    // Get student info
    const student = await User.findById(userId)
      .populate('studentProfile.miningColleges.college', 'name country logo baseRate referralBonusRate');

    // Get all active mining sessions
    const activeSessions = await MiningSession.find({
      student: userId,
      isActive: true
    }).populate('college', 'name country logo baseRate referralBonusRate');

    // Get all wallets
    const wallets = await Wallet.find({ student: userId })
      .populate('college', 'name country logo baseRate referralBonusRate');

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

    // Filter out null colleges (deleted colleges)
    const validMiningColleges = student.studentProfile.miningColleges.filter(mc => mc.college !== null);
    const validWallets = wallets.filter(w => w.college !== null);

    const result = {
      miningColleges: validMiningColleges,
      activeSessions: sessionsWithCurrentTokens,
      wallets: validWallets
      // Note: Earning rates are now per-college, available in each session's earningRate field
    };

    // Update cache if requested
    if (updateCache) {
      userMiningCache.set(userId, {
        sessions: activeSessions.map(session => ({
          college: session.college,
          startTime: session.startTime,
          endTime: session.endTime,
          earningRate: session.earningRate,
          sessionId: session._id
        })),
        wallets: result.wallets,
        miningColleges: result.miningColleges,
        lastFetched: Date.now()
      });
    }

    return result;
  } catch (error) {
    console.error('Error getting mining status for user:', error);
    throw error;
  }
};

// Broadcast mining status update to a specific user (all their devices)
export const broadcastMiningUpdate = async (userId) => {
  try {
    // Clear cache to force fresh DB query (mining state changed)
    userMiningCache.delete(userId);
    
    const userSockets = userConnections.get(userId);
    if (userSockets && userSockets.size > 0) {
      const miningStatus = await getMiningStatusForUser(userId, true);
      
      // Broadcast to all devices of this user using room
      ioInstance.to(`user:${userId}`).emit('miningStatus', miningStatus);
      
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

// Broadcast mining status update to all connected users (all devices)
export const broadcastMiningUpdateToAll = async () => {
  try {
    for (const [userId, userSockets] of userConnections) {
      if (userSockets && userSockets.size > 0) {
        const miningStatus = await getMiningStatusForUser(userId, false);
        // Broadcast to all devices of this user using room
        ioInstance.to(`user:${userId}`).emit('miningStatus', miningStatus);
      }
    }
  } catch (error) {
    console.error('Error broadcasting mining update to all:', error);
  }
};
