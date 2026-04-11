import { Router } from 'express';
import { Challenge } from '../models/Challenge.js';

export const challengesRouter = Router();

challengesRouter.get('/', async (req, res, next) => {
  try {
    const { category, difficulty, limit = 25 } = req.query;
    const query = { isActive: true };
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;

    const items = await Challenge.find(query)
      .sort({ points: -1 })
      .limit(Math.min(Number(limit) || 25, 100))
      .lean();

    return res.json(items);
  } catch (error) {
    return next(error);
  }
});
