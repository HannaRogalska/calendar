import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  const mongoDB = process.env.MONGO_URI;
  if (!mongoDB) {
    process.exit(1);
  }
  try {
    await mongoose.connect(mongoDB);
    console.log('MongoDB connected');
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
export default connectDB;
