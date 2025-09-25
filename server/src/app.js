import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import globalErrorHandler from './middlewares/error.middlewares.js';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware =====

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000, // 15 minutes
  max: process.env.RATE_LIMIT_MAX_REQUESTS || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Compression middleware
app.use(compression());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Routes
import authRoutes from './routes/auth.routes.js';
import studentAuthRoutes from './routes/studentAuth.routes.js';
import adminAuthRoutes from './routes/adminAuth.routes.js';
import adminVerificationRoutes from './routes/adminVerification.routes.js';
import collegeRoutes from './routes/college.routes.js';

app.use('/api/v1/health', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/auth/student', studentAuthRoutes);
app.use('/api/v1/auth/admin', adminAuthRoutes);
app.use('/api/v1/admin', adminVerificationRoutes);
app.use('/api/v1/colleges', collegeRoutes);

// Error handling middleware (must be last)
app.use(globalErrorHandler);

export default app;