// Get the backend server URL for images
const getBackendUrl = () => {
  return import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:4000';
};

/**
 * Get full URL for an image path
 * @param {string} imagePath - Path like '/images/logo/filename.jpg' or full URL
 * @returns {string} - Full URL to the image
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  
  // If already a full URL (starts with http), return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it's a path starting with /, prepend backend URL
  if (imagePath.startsWith('/')) {
    return `${getBackendUrl()}${imagePath}`;
  }
  
  // Otherwise return as is (shouldn't happen)
  return imagePath;
};

