import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema(
  {
    totalScore: { type: Number, default: 0, min: 0 },
    challengesCompleted: { type: Number, default: 0, min: 0 },
    badges: { type: [String], default: [] },
    streakDays: { type: Number, default: 0, min: 0 },
    lastCompletedAt: { type: Date },
  },
  { _id: false },
);

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 32 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    progress: { type: progressSchema, default: () => ({}) },
  },
  { timestamps: true, versionKey: false },
);

userSchema.index({ 'progress.totalScore': -1, 'progress.challengesCompleted': -1 });

export const User = mongoose.model('User', userSchema);
