import express from 'express';
import {
  getAllCourses,
  getCourse,
  addCourse
} from '../controllers/courses.js';

const router = express.Router({ mergeParams: true });

router.route('/').get(getAllCourses).post(addCourse);
router.route('/:id').get(getCourse);

export default router;
