import Bootcamp from "../models/Bootcamp.js";
import ErrorResponse from "../utils/errorResponse.js";

// @desc      Get all bootcamps
// @route     GET /api/v1/bootcamps
// @access    Public
export const getAllBootcamps = (req, res, next) => {
  Bootcamp.find().then((bootcamp) => {
    if (!bootcamp) {
      return res.status(400).json({ success: false });
    }

    res.status(200).json({
      success: true,
      count: bootcamp.length,
      data: bootcamp
    });
  })
    .catch(() => {
      next(error);
    });
};

// @desc      Get single bootcamp
// @route     GET /api/v1/bootcamps/:id
// @access    Public
export const getBootcamp = (req, res, next) => {
  Bootcamp.findById(req.params.id).then((bootcamp) => {
    if (!bootcamp) {
      return next(
        new ErrorResponse(`Bootcamp is not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: bootcamp
    });
  })
    .catch((error) => {
      next(error);
    });
};

// @desc      Create new bootcamp
// @route     POST /api/v1/bootcamps
// @access    Private
export const createBootcamp = (req, res, next) => {
  // // Add user to req,body
  // req.body.user = req.user.id;

  // // Check for published bootcamp
  // const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });

  // // If the user is not an admin, they can only add one bootcamp
  // if (publishedBootcamp && req.user.role !== 'admin') {
  //   return next(
  //     new ErrorResponse(
  //       `The user with ID ${req.user.id} has already published a bootcamp`,
  //       400
  //     )
  //   );
  // }

  Bootcamp.create(req.body).then((bootcamp) => {
    res.status(201).json({
      success: true,
      data: bootcamp
    });
  }).catch((error) => {
    next(error);
  });
};

// @desc      Update bootcamp
// @route     PUT /api/v1/bootcamps/:id
// @access    Private
export const updateBootcamp = (req, res, next) => {

  // // Make sure user is bootcamp owner
  // if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
  //   return next(
  //     new ErrorResponse(
  //       `User ${req.user.id} is not authorized to update this bootcamp`,
  //       401
  //     )
  //   );
  // }

  // // update slug while updating name
  // if (Object.keys(req.body).includes("name")) {
  //   req.body.slug = slugify(req.body.name, { lower: true });
  // }

  // bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
  //   new: true,
  //   runValidators: true
  // });

  Bootcamp.findByIdAndUpdate(req.params.id, req.body).then((bootcamp) => {
    if (!bootcamp) {
      return next(
        new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: bootcamp
    });
  })
    .catch((error) => {
      next(error);
    });
};

// @desc      Delete bootcamp
// @route     DELETE /api/v1/bootcamps/:id
// @access    Private
export const deleteBootcamp = (req, res, next) => {
  // const bootcamp = await Bootcamp.findById(req.params.id);

  // if (!bootcamp) {
  //   return next(
  //     new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
  //   );
  // }

  // // Make sure user is bootcamp owner
  // if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
  //   return next(
  //     new ErrorResponse(
  //       `User ${req.user.id} is not authorized to delete this bootcamp`,
  //       401
  //     )
  //   );
  // }

  Bootcamp.findByIdAndDelete(req.params.id).then((bootcamp) => {
    if (!bootcamp) {
      return next(
        new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  })
    .catch((error) => {
      next(error);
    });
};

// // @desc      Get bootcamps within a radius
// // @route     GET /api/v1/bootcamps/radius/:zipcode/:distance
// // @access    Private
// exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
//   const { zipcode, distance } = req.params;

//   // Get lat/lng from geocoder
//   const loc = await geocoder.geocode(zipcode);
//   const lat = loc[0].latitude;
//   const lng = loc[0].longitude;

//   // Calc radius using radians
//   // Divide dist by radius of Earth
//   // Earth Radius = 3,963 mi / 6,378 km
//   const radius = distance / 3963;

//   const bootcamps = await Bootcamp.find({
//     location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
//   });

//   res.status(200).json({
//     success: true,
//     count: bootcamps.length,
//     data: bootcamps
//   });
// });

// // @desc      Upload photo for bootcamp
// // @route     PUT /api/v1/bootcamps/:id/photo
// // @access    Private
// exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
//   const bootcamp = await Bootcamp.findById(req.params.id);

//   if (!bootcamp) {
//     return next(
//       new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
//     );
//   }

//   // Make sure user is bootcamp owner
//   if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
//     return next(
//       new ErrorResponse(
//         `User ${req.user.id} is not authorized to update this bootcamp`,
//         401
//       )
//     );
//   }

//   if (!req.files) {
//     return next(new ErrorResponse(`Please upload a file`, 400));
//   }

//   const file = req.files.file;

//   // Make sure the image is a photo
//   if (!file.mimetype.startsWith('image')) {
//     return next(new ErrorResponse(`Please upload an image file`, 400));
//   }

//   // Check filesize
//   if (file.size > process.env.MAX_FILE_UPLOAD) {
//     return next(
//       new ErrorResponse(
//         `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
//         400
//       )
//     );
//   }

//   // Create custom filename
//   file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

//   file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
//     if (err) {
//       console.error(err);
//       return next(new ErrorResponse(`Problem with file upload`, 500));
//     }

//     await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

//     res.status(200).json({
//       success: true,
//       data: file.name
//     });
//   });
// });
