import mongoose from 'mongoose';

const challengeAttemptSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    challengeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge', required: true, index: true },
    isCompleted: { type: Boolean, default: false },
    scoreAwarded: { type: Number, default: 0, min: 0 },
    attempts: { type: Number, default: 1, min: 1 },
    hintsUsed: { type: Number, default: 0, min: 0 },
    completedAt: { type: Date },
  },
  { timestamps: true, versionKey: false },
);

challengeAttemptSchema.index({ userId: 1, challengeId: 1 }, { unique: true });
challengeAttemptSchema.index({ userId: 1, isCompleted: 1, scoreAwarded: -1 });

export const ChallengeAttempt = mongoose.model('ChallengeAttempt', challengeAttemptSchema);
