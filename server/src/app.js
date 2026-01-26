import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import routes
import authRoutes from './routes/auth.routes.js';
import collegeRoutes from './routes/college.routes.js';
import miningRoutes from './routes/mining.routes.js';
import userRoutes from './routes/user.routes.js';
import collegeAdminRoutes from './routes/collegeAdmin.routes.js';
import platformAdminRoutes from './routes/platformAdmin.routes.js';
import ambassadorRoutes from './routes/ambassador.routes.js';
import blogRoutes from './routes/blog.routes.js';
import docsRoutes from './routes/docs.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import categoryRoutes from './routes/category.routes.js';
import taskRoutes from './routes/task.routes.js';
import studentTaskRoutes from './routes/studentTask.routes.js';
import scholarshipWalletRoutes from './routes/scholarshipWallet.routes.js';
import taskReviewRoutes from './routes/taskReview.routes.js';
import studentDocumentRoutes from './routes/studentDocument.routes.js';
import studentOfferRoutes from './routes/studentOffer.routes.js';
import studentRoutes from './routes/student.routes.js';

// Import middleware
import errorHandler from './middlewares/errorHandler.js';
import { requestLogger } from './utils/logger.js';

const app = express();

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from public directory
app.use('/images', express.static(path.join(__dirname, '../public/images')));
app.use('/documents', express.static(path.join(__dirname, '../public/documents')));
app.use('/videos', express.static(path.join(__dirname, '../public/videos')));

// ---------- CORS FIX ----------
// 1. Base default allowed list (Production)
const defaultAllowed = [
  'https://coinsforcollege.org',
  'https://www.coinsforcollege.org',
  'https://cfc-v2.onrender.com'
];

// 2. Add the configured CLIENT_URL from .env
if (process.env.CLIENT_URL) {
  defaultAllowed.push(process.env.CLIENT_URL);
}

// 3. Add any from environment variables (comma separated)
const envAllowed = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [];
const allowedOrigins = [...defaultAllowed, ...envAllowed];

app.use(cors({
  origin: (origin, cb) => {
    // 1. Allow server-to-server requests (no origin)
    if (!origin) return cb(null, true);

    // 2. DEVELOPMENT: Allow any local network request (localhost, 192.168.x.x, 10.x.x.x)
    if (process.env.NODE_ENV === 'development') {
      if (origin.startsWith('http://localhost') || 
          origin.startsWith('http://192.168.') || 
          origin.startsWith('http://10.')) {
        return cb(null, true);
      }
    }

    // 3. PRODUCTION/STRICT: Only allow trusted domains
    if (allowedOrigins.includes(origin)) {
      return cb(null, true);
    }

    return cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','HEAD','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','Origin','Accept']
}));

// Make sure caches don’t mix by origin
app.use((req, res, next) => {
  res.setHeader('Vary', 'Origin');
  next();
});
// ---------- END CORS FIX ----------

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

// Compression
app.use(compression());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  app.use(requestLogger);
}

// Rate limiting (skip in development)
if (process.env.NODE_ENV !== 'development') {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
    message: 'Too many requests from this IP, please try again later'
  });
  app.use('/api', limiter);
} else {
  // Development: more lenient rate limiting
  const devLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 1000, // 1000 requests per minute (very high for dev)
    message: 'Too many requests, slow down'
  });
  app.use('/api', devLimiter);
}

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/colleges', collegeRoutes);
app.use('/api/mining', miningRoutes);
app.use('/api/user', userRoutes);
app.use('/api/college-admin', collegeAdminRoutes);
app.use('/api/platform-admin', platformAdminRoutes);
app.use('/api/ambassador', ambassadorRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/docs', docsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/student-tasks', studentTaskRoutes);
app.use('/api/scholarship', scholarshipWalletRoutes);
app.use('/api/task-reviews', taskReviewRoutes);
app.use('/api/student-documents', studentDocumentRoutes);
app.use('/api/student-offers', studentOfferRoutes);
app.use('/api/student', studentRoutes);

// 404
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use(errorHandler);

export default app;
