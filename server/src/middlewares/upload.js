import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure upload directories exist
const logoDir = path.join(__dirname, '../../public/images/logo');
const coverDir = path.join(__dirname, '../../public/images/cover');
const avatarDir = path.join(__dirname, '../../public/images/user-avatar');

if (!fs.existsSync(logoDir)) {
  fs.mkdirSync(logoDir, { recursive: true });
}
if (!fs.existsSync(coverDir)) {
  fs.mkdirSync(coverDir, { recursive: true });
}
if (!fs.existsSync(avatarDir)) {
  fs.mkdirSync(avatarDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Route to correct folder based on field name
    if (file.fieldname === 'coverFile') {
      cb(null, coverDir);
    } else {
      cb(null, logoDir); // default to logo
    }
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp-randomstring-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    // Sanitize filename
    const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    cb(null, `${sanitizedName}-${uniqueSuffix}${ext}`);
  }
});

// File filter - only images
const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, WebP, and SVG images are allowed.'), false);
  }
};

// Create multer upload instance for images
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  }
});

// Configure CSV file storage
const csvStorage = multer.memoryStorage(); // Store in memory for parsing

// CSV file filter
const csvFileFilter = (req, file, cb) => {
  const allowedMimes = ['text/csv', 'application/vnd.ms-excel', 'text/plain'];
  const allowedExtensions = ['.csv'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedMimes.includes(file.mimetype) || allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only CSV files are allowed.'), false);
  }
};

// Create multer upload instance for CSV files
export const uploadCSV = multer({
  storage: csvStorage,
  fileFilter: csvFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max file size for CSV
  }
});

// Profile picture storage - uses userId as filename
const profilePictureStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, avatarDir);
  },
  filename: (req, file, cb) => {
    // Use userId as filename to ensure one profile picture per user
    const userId = req.user.id || req.user._id;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${userId}${ext}`);
  }
});

// Profile picture file filter - includes HEIC support
const profilePictureFileFilter = (req, file, cb) => {
  const allowedMimes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/heic',
    'image/heif'
  ];

  // Also check extension for HEIC files (sometimes mimetype is not set correctly)
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExtensions = ['.jpeg', '.jpg', '.png', '.webp', '.heic', '.heif'];

  if (allowedMimes.includes(file.mimetype) || allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, WebP, and HEIC images are allowed.'), false);
  }
};

// Create multer upload instance for profile pictures
export const uploadProfilePicture = multer({
  storage: profilePictureStorage,
  fileFilter: profilePictureFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  }
});

// Helper to delete old profile picture (excluding the newly uploaded extension)
export const deleteOldProfilePicture = async (userId, excludeExt = null) => {
  const extensions = ['.jpeg', '.jpg', '.png', '.webp', '.heic', '.heif'];
  for (const ext of extensions) {
    // Skip the extension of the newly uploaded file
    if (excludeExt && ext.toLowerCase() === excludeExt.toLowerCase()) {
      continue;
    }
    const filePath = path.join(avatarDir, `${userId}${ext}`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};

export default upload;

