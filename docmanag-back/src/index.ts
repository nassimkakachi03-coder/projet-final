import { config } from 'dotenv';
config();

import mongoose from 'mongoose';
import app from './app.js';

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/drkakachi';

console.log('Attempting to connect to MongoDB...');

mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 15000 })
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch((error) => console.error('❌ Database connection error:', error.message));

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
