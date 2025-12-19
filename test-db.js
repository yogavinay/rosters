import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI not found');
  process.exit(1);
}

async function testConnection() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully!');
    await mongoose.disconnect();
    console.log('Disconnected.');
  } catch (error) {
    console.error('Connection failed:', error);
  }
}

testConnection();