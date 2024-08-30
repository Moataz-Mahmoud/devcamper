import express from 'express';
import {
  getAllCourses,
  getCourse
} from '../controllers/courses.js';

const router = express.Router({ mergeParams: true });

router.route('/').get(getAllCourses);
router.route('/:id').get(getCourse);

export default router;
