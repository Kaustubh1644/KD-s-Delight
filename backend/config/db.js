import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.ATLASDB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('DB CONNECTED');
  } catch (error) {
    console.error('DB CONNECTION FAILED:', error);
    process.exit(1); // Exit on DB failure
  }
};

export default connectDB;
