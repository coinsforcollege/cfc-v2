import express from 'express';
import { protect } from '../middlewares/auth.js';
import {
  getMyOffers,
  getRecommendedOffer,
  getOfferDetails,
  acceptOffer,
  rejectOffer
} from '../controllers/studentOffer.controller.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get offers for student
router.get('/', getMyOffers);
router.get('/recommended', getRecommendedOffer);
router.get('/:id', getOfferDetails);

// Respond to offers
router.post('/:id/accept', acceptOffer);
router.post('/:id/reject', rejectOffer);

export default router;
