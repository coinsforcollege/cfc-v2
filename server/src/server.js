// MUST be first import to load env vars before other modules
import 'dotenv/config';

import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import app from './app.js';
import { setupWebSocketHandlers } from './websocket/miningSocket.js';
import { cleanupExpiredSessions } from './jobs/cleanupExpiredSessions.js';

// Verify env loaded
console.log('🔍 ENV CHECK:', {
  ZEPTOMAIL_API_KEY: !!process.env.ZEPTOMAIL_API_KEY,
  MONGODB_URI: !!process.env.MONGODB_URI,
  allZeptoKeys: Object.keys(process.env).filter(k => k.includes('ZEPTO'))
});

const PORT = process.env.PORT || 4000;

// Create HTTP server
const server = createServer(app);

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: [
      'https://coinsforcollege.org',
      'https://www.coinsforcollege.org',
      'https://cfc-v2.onrender.com',
      'http://localhost:5173',
      'http://192.168.0.195:5173',
      'http://192.168.0.16:5173',
      'http://localhost:3000'
    ],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Connect to database
connectDB().then(() => {
  // Setup WebSocket handlers
  setupWebSocketHandlers(io);

  // Start cleanup job - runs every 5 minutes
  const CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes
  console.log(`🧹 Starting cleanup job - runs every 5 minutes`);

  // Run cleanup immediately on startup
  cleanupExpiredSessions().catch(err => {
    console.error('Error in initial cleanup job:', err);
  });

  // Schedule periodic cleanup
  setInterval(() => {
    cleanupExpiredSessions().catch(err => {
      console.error('Error in cleanup job:', err);
    });
  }, CLEANUP_INTERVAL);

  // Start server
  server.listen(PORT, () => {
    console.log(`🚀 Server is running on port: ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔌 WebSocket server is ready`);
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`❌ Error: ${err.message}`);
  // Close server & exit process
  process.exit(1);
});

