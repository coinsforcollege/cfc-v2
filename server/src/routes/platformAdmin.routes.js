import express from 'express';
import {
  getAllStudents,
  getAllColleges,
  createCollege,
  getStudentDetails,
  getCollegeDetails,
  updateCollege,
  deleteCollege,
  getPlatformStats,
  updateCollegeRates,
  updateDefaultRates,
  updateStudent,
  deleteStudent,
  resetStudentPassword,
  addStudentBalance,
  getAllCollegeAdmins,
  getCollegeAdminDetails,
  updateCollegeAdmin,
  deleteCollegeAdmin,
  resetCollegeAdminPassword,
  bulkImportPreview,
  bulkImportConfirm,
  bulkRemoveImages
} from '../controllers/platformAdmin.controller.js';
import { protect, authorize } from '../middlewares/auth.js';
import upload, { uploadCSV } from '../middlewares/upload.js';

const router = express.Router();

// All routes require authentication and platform admin role
router.use(protect, authorize('platform_admin'));

router.get('/stats', getPlatformStats);
router.put('/default-rates', updateDefaultRates);

// User routes
router.get('/users', getAllStudents);
router.get('/users/:id', getStudentDetails);
router.put('/users/:id', updateStudent);
router.delete('/users/:id', deleteStudent);
router.put('/users/:id/reset-password', resetStudentPassword);
router.post('/users/:id/add-balance', addStudentBalance);

// College Admin routes
router.get('/college-admins', getAllCollegeAdmins);
router.get('/college-admins/:id', getCollegeAdminDetails);
router.put('/college-admins/:id', updateCollegeAdmin);
router.delete('/college-admins/:id', deleteCollegeAdmin);
router.put('/college-admins/:id/reset-password', resetCollegeAdminPassword);

// College routes
router.get('/colleges', getAllColleges);
router.post('/colleges', upload.fields([
  { name: 'logoFile', maxCount: 1 },
  { name: 'coverFile', maxCount: 1 }
]), createCollege);
router.post('/colleges/bulk-import-preview', uploadCSV.single('csvFile'), bulkImportPreview);
router.post('/colleges/bulk-import-confirm', bulkImportConfirm);
router.put('/colleges/bulk-remove-images', bulkRemoveImages);
router.get('/colleges/:id', getCollegeDetails);
router.put('/colleges/:id', upload.fields([
  { name: 'logoFile', maxCount: 1 },
  { name: 'coverFile', maxCount: 1 }
]), updateCollege);
router.put('/colleges/:id/rates', updateCollegeRates);
router.delete('/colleges/:id', deleteCollege);

export default router;

