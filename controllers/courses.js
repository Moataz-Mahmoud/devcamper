import Course from '../models/Course.js';
import ErrorResponse from "../utils/errorResponse.js";
import Bootcamp from '../models/Bootcamp.js';

// @desc      Get courses
// @route     GET /api/v1/bootcamps/:bootcampId/courses
// @access    Public
export const getAllCourses = (req, res, next) => {
  if (req.params.bootcampId) {
    Course.find({ bootcamp: req.params.bootcampId }).then((courses) => {
      return res.status(200).json({
        success: true,
        count: courses.length,
        data: courses
      });
    });
  } else {
    Course.find().populate({
      path: 'bootcamp',
      select: 'name description'
    }).then((courses) => {
      return res.status(200).json({
        success: true,
        count: courses.length,
        data: courses
      });
    });
  }
};

// @desc      Get single course
// @route     GET /api/v1/courses/:id
// @access    Public
export const getCourse = (req, res, next) => {
  Course.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description'
  }).then((course) => {
    if (!course) {
      return next(
        new ErrorResponse(`No course with the id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: course
    });
  }).catch((error) => { next(error); });
};

// @desc      Add course
// @route     POST /api/v1/bootcamps/:bootcampId/courses
// @access    Private
export const addCourse = (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;

  Bootcamp.findById(req.params.bootcampId).then((bootcamp) => {
    if (!bootcamp) {
      return next(
        new ErrorResponse(
          `No bootcamp with the id of ${req.params.bootcampId}`, 404)
      );
    }

    // // Make sure user is bootcamp owner
    // if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    //   return next(
    //     new ErrorResponse(
    //       `User ${req.user.id} is not authorized to add a course to bootcamp ${bootcamp._id}`,
    //       401
    //     )
    //   );
    // }

    Course.create(req.body).then((course) => {
      res.status(200).json({
        success: true,
        data: course
      });
    });
  });
};

// @desc      Update course
// @route     PUT /api/v1/courses/:id
// @access    Private
export const updateCourse = (req, res, next) => {
  Course.findById(req.params.id).then((course) => {
    if (!course) {
      return next(
        new ErrorResponse(`No course with the id of ${req.params.id}`, 404)
      );
    }
  });

  // // Make sure user is course owner
  // if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
  //   return next(
  //     new ErrorResponse(
  //       `User ${req.user.id} is not authorized to update course ${course._id}`,
  //       401
  //     )
  //   );
  // }

  Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).then((course) => {
    res.status(200).json({
      success: true,
      data: course
    });
  });

  // course.save();

};

// @desc      Delete course
// @route     DELETE /api/v1/courses/:id
// @access    Private
export const deleteCourse = async (req, res, next) => {
  Course.findById(req.params.id).then((course) => {
    if (!course) {
      return next(
        new ErrorResponse(`No course with the id of ${req.params.id}`, 404)
      );
    }

    course.deleteOne(course._id).then(() =>
      res.status(200).json({ success: true, data: {} })
    ).catch((error) => { next(error); });
  });

  // // Make sure user is course owner
  // if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
  //   return next(
  //     new ErrorResponse(
  //       `User ${req.user.id} is not authorized to delete course ${course._id}`,
  //       401
  //     )
  //   );
  // }
};
