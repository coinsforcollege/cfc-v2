import Folder from '../models/Folder.js';
import Document from '../models/Document.js';
import User from '../models/User.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Constants
const MAX_STORAGE_BYTES = 1 * 1024 * 1024 * 1024; // 1GB in bytes

// Helper to get file type from mimetype
const getFileType = (mimetype) => {
  if (mimetype.startsWith('image/')) return 'image';
  if (mimetype.startsWith('video/')) return 'video';
  return 'document';
};

// Helper to build folder path
const buildFolderPath = async (parentId, folderName) => {
  if (!parentId) {
    return `/${folderName}`;
  }
  const parent = await Folder.findById(parentId);
  if (!parent) {
    return `/${folderName}`;
  }
  return `${parent.path}/${folderName}`;
};

// ==================== FOLDER ENDPOINTS ====================

// Get all folders for the user
export const getFolders = async (req, res) => {
  try {
    const userId = req.user._id;

    const folders = await Folder.find({ user: userId })
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      data: folders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create a new folder
export const createFolder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, parentId } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Folder name is required'
      });
    }

    // Validate parent folder if provided
    if (parentId) {
      const parentFolder = await Folder.findOne({ _id: parentId, user: userId });
      if (!parentFolder) {
        return res.status(404).json({
          success: false,
          message: 'Parent folder not found'
        });
      }
    }

    // Build the path
    const folderPath = await buildFolderPath(parentId, name.trim());

    const folder = new Folder({
      user: userId,
      name: name.trim(),
      parent: parentId || null,
      path: folderPath
    });

    await folder.save();

    res.status(201).json({
      success: true,
      message: 'Folder created successfully',
      data: folder
    });
  } catch (error) {
    // Handle duplicate folder name error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A folder with this name already exists in this location'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Rename a folder
export const renameFolder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'New folder name is required'
      });
    }

    const folder = await Folder.findOne({ _id: id, user: userId });
    if (!folder) {
      return res.status(404).json({
        success: false,
        message: 'Folder not found'
      });
    }

    const oldPath = folder.path;
    const newPath = await buildFolderPath(folder.parent, name.trim());

    folder.name = name.trim();
    folder.path = newPath;
    await folder.save();

    // Update paths of all child folders
    const childFolders = await Folder.find({
      user: userId,
      path: { $regex: `^${oldPath}/` }
    });

    for (const child of childFolders) {
      child.path = child.path.replace(oldPath, newPath);
      await child.save();
    }

    res.status(200).json({
      success: true,
      message: 'Folder renamed successfully',
      data: folder
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A folder with this name already exists in this location'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete a folder and all its contents
export const deleteFolder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const folder = await Folder.findOne({ _id: id, user: userId });
    if (!folder) {
      return res.status(404).json({
        success: false,
        message: 'Folder not found'
      });
    }

    // Get all child folders (including nested)
    const childFolders = await Folder.find({
      user: userId,
      path: { $regex: `^${folder.path}/` }
    });
    const allFolderIds = [folder._id, ...childFolders.map(f => f._id)];

    // Get all documents in these folders
    const documentsToDelete = await Document.find({
      user: userId,
      folder: { $in: allFolderIds }
    });

    // Calculate storage to free
    let storageFreed = 0;

    // Delete physical files
    for (const doc of documentsToDelete) {
      storageFreed += doc.size;
      const filePath = path.join(__dirname, '../../public', doc.url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Delete documents from database
    await Document.deleteMany({
      user: userId,
      folder: { $in: allFolderIds }
    });

    // Delete all folders
    await Folder.deleteMany({
      _id: { $in: allFolderIds }
    });

    // Update user's storage
    if (storageFreed > 0) {
      await User.findByIdAndUpdate(userId, {
        $inc: { 'userProfile.storageUsed': -storageFreed }
      });
    }

    res.status(200).json({
      success: true,
      message: 'Folder and contents deleted successfully',
      data: {
        foldersDeleted: allFolderIds.length,
        documentsDeleted: documentsToDelete.length,
        storageFreed
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ==================== DOCUMENT ENDPOINTS ====================

// Get documents (optionally in a folder)
export const getDocuments = async (req, res) => {
  try {
    const userId = req.user._id;
    const { folderId, page = 1, limit = 50, all } = req.query;

    const query = { user: userId };

    // If all=true, get all documents (for search)
    // If folderId is provided, get documents in that folder
    // If folderId is 'root' or not provided, get documents in root (folder: null)
    if (all === 'true') {
      // Don't filter by folder - get all documents
    } else if (folderId && folderId !== 'root') {
      // Verify folder belongs to user
      const folder = await Folder.findOne({ _id: folderId, user: userId });
      if (!folder) {
        return res.status(404).json({
          success: false,
          message: 'Folder not found'
        });
      }
      query.folder = folderId;
    } else {
      query.folder = null;
    }

    const documents = await Document.find(query)
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    const total = await Document.countDocuments(query);

    // Get folders - all folders when searching, otherwise in current location
    const folderQuery = { user: userId };
    if (all !== 'true') {
      folderQuery.parent = folderId && folderId !== 'root' ? folderId : null;
    }
    const folders = await Folder.find(folderQuery).sort({ name: 1 });

    // Get user's storage info
    const user = await User.findById(userId).select('userProfile.storageUsed');
    const storageUsed = user?.userProfile?.storageUsed || 0;

    res.status(200).json({
      success: true,
      data: {
        folders,
        documents,
        storage: {
          used: storageUsed,
          total: MAX_STORAGE_BYTES,
          percentage: Math.round((storageUsed / MAX_STORAGE_BYTES) * 100)
        }
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Upload documents
export const uploadDocuments = async (req, res) => {
  try {
    const userId = req.user._id;
    const { folderId } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    // Validate folder if provided
    if (folderId) {
      const folder = await Folder.findOne({ _id: folderId, user: userId });
      if (!folder) {
        return res.status(404).json({
          success: false,
          message: 'Folder not found'
        });
      }
    }

    // Check storage limit
    const user = await User.findById(userId).select('userProfile.storageUsed');
    const currentStorage = user?.userProfile?.storageUsed || 0;
    const totalNewSize = req.files.reduce((sum, file) => sum + file.size, 0);

    if (currentStorage + totalNewSize > MAX_STORAGE_BYTES) {
      // Delete uploaded files
      for (const file of req.files) {
        const filePath = file.path;
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      return res.status(400).json({
        success: false,
        message: 'Storage limit exceeded. You have 1GB of storage.',
        data: {
          currentUsed: currentStorage,
          attempted: totalNewSize,
          limit: MAX_STORAGE_BYTES
        }
      });
    }

    // Create document records
    const documents = [];
    for (const file of req.files) {
      let relativePath = '';
      if (file.mimetype.startsWith('image/')) {
        relativePath = `/images/student-docs/${file.filename}`;
      } else if (file.mimetype.startsWith('video/')) {
        relativePath = `/videos/student-docs/${file.filename}`;
      } else {
        relativePath = `/documents/student-docs/${file.filename}`;
      }

      const doc = new Document({
        user: userId,
        folder: folderId || null,
        name: file.originalname,
        url: relativePath,
        fileType: getFileType(file.mimetype),
        mimeType: file.mimetype,
        size: file.size,
        source: 'upload',
        isPublic: true
      });

      await doc.save();
      documents.push(doc);
    }

    // Update user's storage
    await User.findByIdAndUpdate(userId, {
      $inc: { 'userProfile.storageUsed': totalNewSize }
    });

    res.status(201).json({
      success: true,
      message: `${documents.length} file(s) uploaded successfully`,
      data: documents
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single document
export const getDocument = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const document = await Document.findOne({ _id: id, user: userId })
      .populate('folder', 'name path');

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    res.status(200).json({
      success: true,
      data: document
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update document (rename, move, toggle visibility)
export const updateDocument = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const { name, folderId, isPublic } = req.body;

    const document = await Document.findOne({ _id: id, user: userId });
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Update name if provided
    if (name !== undefined) {
      document.name = name.trim();
    }

    // Update folder if provided
    if (folderId !== undefined) {
      if (folderId === null || folderId === 'root') {
        document.folder = null;
      } else {
        const folder = await Folder.findOne({ _id: folderId, user: userId });
        if (!folder) {
          return res.status(404).json({
            success: false,
            message: 'Destination folder not found'
          });
        }
        document.folder = folderId;
      }
    }

    // Update visibility if provided
    if (isPublic !== undefined) {
      document.isPublic = isPublic;
    }

    await document.save();

    res.status(200).json({
      success: true,
      message: 'Document updated successfully',
      data: document
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete document
export const deleteDocument = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const document = await Document.findOne({ _id: id, user: userId });
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Delete physical file
    const filePath = path.join(__dirname, '../../public', document.url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Update user's storage
    await User.findByIdAndUpdate(userId, {
      $inc: { 'userProfile.storageUsed': -document.size }
    });

    // Delete document record
    await Document.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Document deleted successfully',
      data: { storageFreed: document.size }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Bulk move documents to a folder
export const moveDocuments = async (req, res) => {
  try {
    const userId = req.user._id;
    const { documentIds, folderId } = req.body;

    if (!documentIds || !Array.isArray(documentIds) || documentIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Document IDs array is required'
      });
    }

    // Validate destination folder if provided
    if (folderId && folderId !== 'root') {
      const folder = await Folder.findOne({ _id: folderId, user: userId });
      if (!folder) {
        return res.status(404).json({
          success: false,
          message: 'Destination folder not found'
        });
      }
    }

    const destinationFolder = folderId && folderId !== 'root' ? folderId : null;

    // Update all documents
    const result = await Document.updateMany(
      { _id: { $in: documentIds }, user: userId },
      { $set: { folder: destinationFolder } }
    );

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} document(s) moved successfully`,
      data: { movedCount: result.modifiedCount }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get storage info
export const getStorageInfo = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select('userProfile.storageUsed');
    const storageUsed = user?.userProfile?.storageUsed || 0;

    const documentCount = await Document.countDocuments({ user: userId });
    const folderCount = await Folder.countDocuments({ user: userId });

    res.status(200).json({
      success: true,
      data: {
        used: storageUsed,
        total: MAX_STORAGE_BYTES,
        percentage: Math.round((storageUsed / MAX_STORAGE_BYTES) * 100),
        documentCount,
        folderCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
