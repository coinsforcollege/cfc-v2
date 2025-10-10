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
  updateDefaultRates
} from '../controllers/platformAdmin.controller.js';
import { protect, authorize } from '../middlewares/auth.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

// All routes require authentication and platform admin role
router.use(protect, authorize('platform_admin'));

router.get('/stats', getPlatformStats);
router.put('/default-rates', updateDefaultRates);
router.get('/students', getAllStudents);
router.get('/students/:id', getStudentDetails);
router.get('/colleges', getAllColleges);
router.post('/colleges', upload.fields([
  { name: 'logoFile', maxCount: 1 },
  { name: 'coverFile', maxCount: 1 }
]), createCollege);
router.get('/colleges/:id', getCollegeDetails);
router.put('/colleges/:id', upload.fields([
  { name: 'logoFile', maxCount: 1 },
  { name: 'coverFile', maxCount: 1 }
]), updateCollege);
router.put('/colleges/:id/rates', updateCollegeRates);
router.delete('/colleges/:id', deleteCollege);

export default router;

