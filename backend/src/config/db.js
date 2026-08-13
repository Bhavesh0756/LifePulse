const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lifepulse';

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log(`[LifePulse MongoDB] Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[LifePulse MongoDB Notice]: Database connection deferred or offline (${error.message}). Set MONGODB_URI in backend/.env to connect your database instance.`);
  }
};

module.exports = connectDB;
