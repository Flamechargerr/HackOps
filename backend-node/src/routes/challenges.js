import { Router } from 'express';
import { Challenge } from '../models/Challenge.js';

export const challengesRouter = Router();

const allowedCategories = new Set(['password', 'terminal', 'xss', 'sql_injection', 'encryption', 'blockchain']);
const allowedDifficulties = new Set(['beginner', 'intermediate', 'advanced']);

challengesRouter.get('/', async (req, res, next) => {
  try {
    const category = typeof req.query.category === 'string' ? req.query.category.trim() : '';
    const difficulty = typeof req.query.difficulty === 'string' ? req.query.difficulty.trim() : '';
    const limit = typeof req.query.limit === 'string' ? Number.parseInt(req.query.limit, 10) : 25;

    const query = { isActive: true };
    if (allowedCategories.has(category)) query.category = category;
    if (allowedDifficulties.has(difficulty)) query.difficulty = difficulty;

    const items = await Challenge.find(query)
      .sort({ points: -1 })
      .limit(Math.min(Number(limit) || 25, 100))
      .lean();

    return res.json(items);
  } catch (error) {
    return next(error);
  }
});
