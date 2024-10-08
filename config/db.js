import mongoose from 'mongoose';

const connectToDB = () => {
  mongoose.connect(process.env.MONGO_URI, {
  }).then(connection => console.log(`MongoDB Connected: ${connection.connection.host}`));
};

export default connectToDB;
