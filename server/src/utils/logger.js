// Simple request logger middleware for debugging
export const requestLogger = (req, res, next) => {
  // Sanitize request body to remove sensitive data
  const sanitizeBody = (body) => {
    if (!body || typeof body !== 'object') return body;

    const sanitized = { ...body };
    const sensitiveFields = ['password', 'token', 'apiKey', 'secret', 'authorization', 'newPassword', 'oldPassword'];

    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    });

    return sanitized;
  };

  console.log('\n=== Incoming Request ===');
  console.log(`Method: ${req.method}`);
  console.log(`Path: ${req.path}`);
  console.log('Body:', JSON.stringify(sanitizeBody(req.body), null, 2));
  console.log('========================\n');
  next();
};

