import express from 'express';
import {
  getAllCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse
} from '../controllers/courses.js';

const router = express.Router({ mergeParams: true });

router.route('/').get(getAllCourses).post(addCourse);
router.route('/:id').get(getCourse).put(updateCourse).delete(deleteCourse);

export default router;
