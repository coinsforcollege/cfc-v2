// MUST be first import to load env vars before other modules
import 'dotenv/config';

import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import app from './app.js';
import { setupWebSocketHandlers } from './websocket/miningSocket.js';
import { cleanupExpiredSessions } from './jobs/cleanupExpiredSessions.js';
import { sendMinerStoppedEmails } from './jobs/sendMinerStoppedEmails.js';
import { sendInactivityReminders } from './jobs/sendInactivityReminders.js';

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

  // Start miner stopped emails job - runs every hour
  const MINER_STOPPED_EMAIL_INTERVAL = 60 * 60 * 1000; // 1 hour
  console.log(`📧 Starting miner stopped emails job - runs every hour`);

  // Run immediately on startup (5 minutes after server starts to avoid load spike)
  setTimeout(() => {
    sendMinerStoppedEmails().catch(err => {
      console.error('Error in initial miner stopped emails job:', err);
    });
  }, 5 * 60 * 1000);

  // Schedule periodic miner stopped emails
  setInterval(() => {
    sendMinerStoppedEmails().catch(err => {
      console.error('Error in miner stopped emails job:', err);
    });
  }, MINER_STOPPED_EMAIL_INTERVAL);

  // Start inactivity reminders job - runs every 6 hours
  const INACTIVITY_REMINDER_INTERVAL = 6 * 60 * 60 * 1000; // 6 hours
  console.log(`📧 Starting inactivity reminders job - runs every 6 hours`);

  // Run immediately on startup (10 minutes after server starts)
  setTimeout(() => {
    sendInactivityReminders().catch(err => {
      console.error('Error in initial inactivity reminders job:', err);
    });
  }, 10 * 60 * 1000);

  // Schedule periodic inactivity reminders
  setInterval(() => {
    sendInactivityReminders().catch(err => {
      console.error('Error in inactivity reminders job:', err);
    });
  }, INACTIVITY_REMINDER_INTERVAL);

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

