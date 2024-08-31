import express from 'express';
import {
  getAllCourses,
  getCourse,
  addCourse,
  updateCourse
} from '../controllers/courses.js';

const router = express.Router({ mergeParams: true });

router.route('/').get(getAllCourses).post(addCourse);
router.route('/:id').get(getCourse).put(updateCourse);

export default router;
