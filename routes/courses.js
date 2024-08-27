import express from 'express';
import {
  getAllCourses
} from '../controllers/courses.js';

const router = express.Router({ mergeParams: true });

router
  .route('/').get(getAllCourses);

export default router;
