import express from 'express';
import morgan from 'morgan';
import connectToDB from './config/db.js';
import errorHandler from './middleware/error.js';

connectToDB();

// route files
import bootcamps from './routes/bootcamps.js';

const app = express();

// body parser
app.use(express.json());

// dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// mount routers
app.use('/api/v1/bootcamps', bootcamps);

app.use(errorHandler);

const port = process.env.PORT || 8000;
const server = app.listen(
  port,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${port}`
  )
);

// handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  // close server & exit process
  server.close(() => process.exit(1));
});