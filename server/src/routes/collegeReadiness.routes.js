import express from 'express';
import {
  checkBasicData,
  updateBasicData,
  getFormOptions,
  searchColleges,
  generateChecklist,
  getChecklist,
  getChecklistHistory,
  updateChecklistItem,
  linkDocumentToItem,
  regenerateChecklist
} from '../controllers/collegeReadiness.controller.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

// All routes require student authentication
router.use(protect, authorize('student'));

// Check if user has required basic data (grade, country, desiredCollegeCountries)
router.get('/check-basic-data', checkBasicData);

// Update basic profile data if missing
router.put('/basic-data', updateBasicData);

// Get form options (fields of study, tiers, common languages)
router.get('/form-options', getFormOptions);

// Search colleges for preferred colleges selection
router.get('/search-colleges', searchColleges);

// Generate checklist via AI
router.post('/generate', generateChecklist);

// Get user's active checklist
router.get('/checklist', getChecklist);

// Get checklist history
router.get('/history', getChecklistHistory);

// Update a checklist item (mark complete, add notes)
router.put('/checklist/:checklistId/items/:sectionId/:itemId', updateChecklistItem);

// Link a document to a checklist item
router.post('/checklist/:checklistId/items/:sectionId/:itemId/link-document', linkDocumentToItem);

// Regenerate checklist (rate limited to once per week)
router.post('/regenerate', regenerateChecklist);

export default router;
