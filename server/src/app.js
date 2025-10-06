import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Load env vars
dotenv.config();

// Import routes
import authRoutes from './routes/auth.routes.js';
import collegeRoutes from './routes/college.routes.js';
import miningRoutes from './routes/mining.routes.js';
import studentRoutes from './routes/student.routes.js';
import collegeAdminRoutes from './routes/collegeAdmin.routes.js';
import platformAdminRoutes from './routes/platformAdmin.routes.js';
import ambassadorRoutes from './routes/ambassador.routes.js';

// Import middleware
import errorHandler from './middlewares/errorHandler.js';
import { requestLogger } from './utils/logger.js';

const app = express();

// Body parser (MUST be FIRST)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Security middleware (after body parser)
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

// Compression
app.use(compression());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  app.use(requestLogger); // Custom request logger for debugging
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});
app.use('/api', limiter);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/colleges', collegeRoutes);
app.use('/api/mining', miningRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/college-admin', collegeAdminRoutes);
app.use('/api/platform-admin', platformAdminRoutes);
app.use('/api/ambassador', ambassadorRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler (must be last)
app.use(errorHandler);

export default app;

