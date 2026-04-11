import mongoose from 'mongoose';

export async function connectDb(mongoUri) {
  mongoose.set('strictQuery', true);
  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 10000,
  });
}

export async function disconnectDb() {
  await mongoose.disconnect();
}
