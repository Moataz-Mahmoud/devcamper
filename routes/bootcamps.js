import express from 'express';
import {
  getAllBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
} from '../controllers/bootcamps.js';

// const Bootcamp = require('../models/Bootcamp');

// Include other resource routers
// const courseRouter = require('./courses');
// const reviewRouter = require('./reviews');

const router = express.Router();

// const advancedResults = require('../middleware/advancedResults');
// const { protect, authorize } = require('../middleware/auth');

// Re-route into other resource routers
// router.use('/:bootcampId/courses', courseRouter);
// router.use('/:bootcampId/reviews', reviewRouter);

// router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

// router
//   .route('/:id/photo')
//   .put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload);

router
  .route('/')
  .get(getAllBootcamps)
  .post(createBootcamp);

router
  .route('/:id')
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

export default router;
