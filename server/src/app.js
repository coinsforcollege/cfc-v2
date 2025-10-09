import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env vars
dotenv.config();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import routes
import authRoutes from './routes/auth.routes.js';
import collegeRoutes from './routes/college.routes.js';
import miningRoutes from './routes/mining.routes.js';
import studentRoutes from './routes/student.routes.js';
import collegeAdminRoutes from './routes/collegeAdmin.routes.js';
import platformAdminRoutes from './routes/platformAdmin.routes.js';
import ambassadorRoutes from './routes/ambassador.routes.js';
import blogRoutes from './routes/blog.routes.js';

// Import middleware
import errorHandler from './middlewares/errorHandler.js';
import { requestLogger } from './utils/logger.js';

const app = express();

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from public directory
app.use('/images', express.static(path.join(__dirname, '../public/images')));

// ---------- CORS FIX ----------
const allowed = new Set([
  'https://coinsforcollege.org',
  'https://www.coinsforcollege.org',
  'https://cfc-v2.onrender.com',
  'http://localhost:5173',
  'http://localhost:3000'
]);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);         // allow same-origin / server-side
    return cb(null, allowed.has(origin));
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

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later'
});
app.use('/api', limiter);

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
app.use('/api/student', studentRoutes);
app.use('/api/college-admin', collegeAdminRoutes);
app.use('/api/platform-admin', platformAdminRoutes);
app.use('/api/ambassador', ambassadorRoutes);
app.use('/api/blog', blogRoutes);

// 404
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use(errorHandler);

export default app;
