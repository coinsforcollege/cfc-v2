import express from 'express';
import {
  getDashboard,
  selectCollege,
  updateCollegeDetails,
  updateTokenPreferences,
  addCollegeImages,
  viewCommunity,
  getLeaderboard,
  getStudents,
  getStudentDetails,
  getStudentPointsHistory,
  getStudentDocuments,
  getAcceptedStudents,
  getLetterTemplate,
  createOffer,
  getOffers,
  getOfferDetails,
  updateOffer,
  deleteOffer,
  getOfferResponses
} from '../controllers/collegeAdmin.controller.js';
import { protect, authorize } from '../middlewares/auth.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

// All routes require authentication and college admin role
router.use(protect, authorize('college_admin'));

router.post('/select-college', upload.single('logoFile'), selectCollege);
router.get('/dashboard', getDashboard);
router.put('/college/details', upload.fields([
  { name: 'logoFile', maxCount: 1 },
  { name: 'coverFile', maxCount: 1 }
]), updateCollegeDetails);
router.put('/college/token-preferences', updateTokenPreferences);
router.post('/college/images', addCollegeImages);
router.get('/community', viewCommunity);
router.get('/leaderboard', getLeaderboard);

// Student browsing routes
router.get('/students', getStudents);
router.get('/students/:id', getStudentDetails);
router.get('/students/:id/points-history', getStudentPointsHistory);
router.get('/students/:id/documents', getStudentDocuments);

// Accepted students route
router.get('/accepted-students', getAcceptedStudents);

// Offer management routes
router.get('/offers/letter-template', getLetterTemplate);
router.get('/offers', getOffers);
router.post('/offers', createOffer);
router.get('/offers/:id', getOfferDetails);
router.put('/offers/:id', updateOffer);
router.delete('/offers/:id', deleteOffer);
router.get('/offers/:id/responses', getOfferResponses);

export default router;

