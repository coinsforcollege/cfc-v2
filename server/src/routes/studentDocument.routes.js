import express from 'express';
import { protect } from '../middlewares/auth.js';
import documentUpload from '../middlewares/documentUpload.js';
import {
  getFolders,
  createFolder,
  renameFolder,
  deleteFolder,
  getDocuments,
  uploadDocuments,
  getDocument,
  updateDocument,
  deleteDocument,
  moveDocuments,
  getStorageInfo
} from '../controllers/studentDocument.controller.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Storage info
router.get('/storage', getStorageInfo);

// Folder routes
router.get('/folders', getFolders);
router.post('/folders', createFolder);
router.put('/folders/:id', renameFolder);
router.delete('/folders/:id', deleteFolder);

// Document routes
router.get('/', getDocuments);
router.post('/upload', documentUpload.array('files', 10), uploadDocuments);
router.post('/move', moveDocuments);
router.get('/:id', getDocument);
router.put('/:id', updateDocument);
router.delete('/:id', deleteDocument);

export default router;
