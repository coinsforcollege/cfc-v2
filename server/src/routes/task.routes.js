import express from 'express';
import { protect, authorize } from '../middlewares/auth.js';
import taskUpload from '../middlewares/taskUpload.js';
import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  duplicateTask
} from '../controllers/task.controller.js';

const router = express.Router();

router.use(protect);
router.use(authorize('platform_admin', 'admin'));

router.route('/')
  .post(taskUpload.array('files'), createTask)
  .get(getAllTasks);

router.route('/:id')
  .get(getTaskById)
  .put(taskUpload.array('files'), updateTask)
  .delete(deleteTask);

router.post('/:id/duplicate', duplicateTask);

export default router;
