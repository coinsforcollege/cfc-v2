// Simple request logger middleware for debugging
export const requestLogger = (req, res, next) => {
  console.log('\n=== Incoming Request ===');
  console.log(`Method: ${req.method}`);
  console.log(`Path: ${req.path}`);
  console.log('Body:', JSON.stringify(req.body, null, 2));
  console.log('========================\n');
  next();
};

