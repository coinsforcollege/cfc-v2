import express from 'express';
import * as accessController from '../controllers/access.controller.js';

const router = express.Router();

router.post('/request', accessController.submitAccessRequest);

export default router;
