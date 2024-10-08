import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a course title']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  weeks: {
    type: String,
    required: [true, 'Please add number of weeks']
  },
  tuition: {
    type: Number,
    required: [true, 'Please add a tuition cost']
  },
  minimumSkill: {
    type: String,
    required: [true, 'Please add a minimum skill'],
    enum: ['beginner', 'intermediate', 'advanced']
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: true
  },
});

// static method to get avg of course tuitions
CourseSchema.statics.getAverageCost = function (bootcampId) {
  this.aggregate([
    {
      $match: { bootcamp: bootcampId }
    },
    {
      $group: {
        _id: '$bootcamp',
        averageCost: { $avg: '$tuition' }
      }
    }
  ]).then((cost) => {
    const averageCost = Math.ceil(cost[0].averageCost / 10) * 10;

    try {
      this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
        averageCost,
      }).then();
    } catch (err) {
      console.log(err);
    }
  });
};

// call getAverageCost after save
CourseSchema.post('save', function () {
  this.constructor.getAverageCost(this.bootcamp);
});

// call getAverageCost after remove
CourseSchema.pre('deleteOne', { document: true, query: false }, function () {
  this.constructor.getAverageCost(this.bootcamp);
});

// // call getAverageCost after tuition update
// CourseSchema.post("findOneAndUpdate", async function (doc) {
//   if (this.tuition != doc.tuition) {
//     await doc.constructor.getAverageCost(doc.bootcamp);
//   }
// });

export default mongoose.model('Course', CourseSchema);
