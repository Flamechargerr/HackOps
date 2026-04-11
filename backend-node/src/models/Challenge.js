import mongoose from 'mongoose';

const challengeSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    category: {
      type: String,
      required: true,
      enum: ['password', 'terminal', 'xss', 'sql_injection', 'encryption', 'blockchain'],
    },
    difficulty: { type: String, required: true, enum: ['beginner', 'intermediate', 'advanced'] },
    points: { type: Number, required: true, min: 10, max: 1000 },
    isActive: { type: Boolean, default: true },
    tags: { type: [String], default: [] },
    learningObjective: { type: String, required: true, maxlength: 240 },
  },
  { timestamps: true, versionKey: false },
);

challengeSchema.index({ category: 1, difficulty: 1, isActive: 1 });
challengeSchema.index({ isActive: 1, points: -1 });

export const Challenge = mongoose.model('Challenge', challengeSchema);
