import dotenv from 'dotenv';
import connectDB from './config/db.js';
import app from './app.js';

// Load env vars
dotenv.config();

const PORT = process.env.PORT || 4000;

// Connect to database
connectDB().then(() => {
  // Start server
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port: ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`❌ Error: ${err.message}`);
  // Close server & exit process
  process.exit(1);
});

