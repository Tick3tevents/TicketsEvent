import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL!);
    console.log(`MongoDB Connected`);
  } catch (err: any) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;