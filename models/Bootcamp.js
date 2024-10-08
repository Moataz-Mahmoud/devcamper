import mongoose from 'mongoose';
import slugify from 'slugify';
import geocoder from '../utils/geocoder.js';

const BootcampSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      unique: true,
      trim: true,
      maxlength: [50, 'Name can not be more than 50 characters']
    },
    slug: String,
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [500, 'Description can not be more than 500 characters']
    },
    website: {
      type: String,
      match: [
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        'Please use a valid URL with HTTP or HTTPS'
      ]
    },
    phone: {
      type: String,
      maxlength: [20, 'Phone number can not be longer than 20 characters']
    },
    email: {
      type: String,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email'
      ]
    },
    address: {
      type: String,
      required: [true, 'Please add an address']
    },
    location: {
      // GeoJSON Point
      type: {
        type: String,
        enum: ['Point']
      },
      coordinates: {
        type: [Number],
        index: '2dsphere'
      },
      formattedAddress: String,
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String
    },
    careers: {
      // Array of strings
      type: [String],
      required: true,
      enum: [
        'Web Development',
        'Mobile Development',
        'UI/UX',
        'Data Science',
        'Business',
        'Other'
      ]
    },
    averageRating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [10, 'Rating must can not be more than 10']
    },
    averageCost: Number,
    photo: {
      type: String,
      default: 'no-photo.jpg'
    },
    housing: {
      type: Boolean,
      default: false
    },
    jobAssistance: {
      type: Boolean,
      default: false
    },
    jobGuarantee: {
      type: Boolean,
      default: false
    },
    acceptGi: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    // user: {
    //   type: mongoose.Schema.ObjectId,
    //   ref: 'User',
    //   required: true
    // }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// create bootcamp slug from the name
BootcampSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// geocode & create location field
BootcampSchema.pre('save', function (next) {
  geocoder.geocode(this.address).then((location) => {
    this.location = {
      type: 'Point',
      coordinates: [location[0].longitude, location[0].latitude],
      formattedAddress: location[0].formattedAddress,
      street: location[0].streetName,
      city: location[0].city,
      state: location[0].stateCode,
      zipcode: location[0].zipcode,
      country: location[0].countryCode
    };

    // stop saving address in DB, it's auto-generated now!
    this.address = undefined;

    next();
  });
});

// cascade delete courses when a bootcamp is deleted
BootcampSchema.pre('deleteOne', { document: true, query: false }, function (next) {
  console.log(`Courses being removed from bootcamp ${this._id}`);
  this.model('Course').deleteMany({ bootcamp: this._id }).then(() => next());
  // console.log(`Reviews being removed from bootcamp ${this._id}`);
  //  await this.model('Review').deleteMany({ bootcamp: this._id });
});

// reverse populate with virtuals
BootcampSchema.virtual('courses', {
  ref: 'Course',
  localField: '_id',
  foreignField: 'bootcamp',
  justOne: false
});

export default mongoose.model('Bootcamp', BootcampSchema);
