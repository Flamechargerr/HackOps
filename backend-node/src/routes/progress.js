import { Router } from 'express';
import { User } from '../models/User.js';

export const progressRouter = Router();

progressRouter.get('/me', async (req, res, next) => {
  try {
    const user = await User.findById(req.user.sub).lean();
    if (!user) return res.status(404).json({ error: 'User not found' });

    return res.json({
      userId: user._id,
      username: user.username,
      progress: user.progress,
    });
  } catch (error) {
    return next(error);
  }
});
