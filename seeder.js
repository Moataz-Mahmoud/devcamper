import fs from 'fs';
import mongoose from 'mongoose';

// load the models
import Bootcamp from './models/Bootcamp.js';
import Course from './models/Course.js';

// connect to the DB
mongoose.connect(process.env.MONGO_URI, {
}).then(() => console.log(`DB connected: Ready for seeding ... `));

// read JSON files
const bootcamps = JSON.parse(
  fs.readFileSync('./_data/bootcamps.json', 'utf-8')
);

const courses = JSON.parse(
  fs.readFileSync('./_data/courses.json', 'utf-8')
);

// import into DB
const importData = () => {
  Bootcamp.create(bootcamps).then(() => {
    console.log('Bootcamps Imported...');
    process.exit();
  }).catch((error) => {
    console.error(error);
  });

  // Course.create(courses).then(() => {
  //   console.log('Courses Imported...');
  //   process.exit();
  // }).catch((error) => {
  //   console.error(error);
  // });
};

// delete data from DB
const deleteData = () => {
  // deletes everything since no specific records passed!
  Bootcamp.deleteMany().then(() => {
    console.log('Bootcamps Deleted...');
  }).catch((error) => {
    console.error(error);
  });

  Course.deleteMany().then(() => {
    console.log('Courses Deleted...');
    process.exit();
  }).catch((error) => {
    console.error(error);
  });
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
