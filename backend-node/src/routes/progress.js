import { Router } from 'express';
import { User } from '../models/User.js';
import { sendError } from '../utils/http.js';

export const progressRouter = Router();

progressRouter.get('/me', async (req, res, next) => {
  try {
    const user = await User.findById(req.user.sub).lean();
    if (!user) {
      return sendError(res, 404, {
        code: 'USER_NOT_FOUND',
        message: 'User not found',
        requestId: req.id,
      });
    }

    return res.json({
      userId: user._id,
      username: user.username,
      progress: user.progress,
    });
  } catch (error) {
    return next(error);
  }
});
