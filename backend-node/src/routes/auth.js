import { Router } from 'express';
import { User } from '../models/User.js';
import { hashPassword, signToken, verifyPassword } from '../services/auth.js';
import { authRequired } from '../middleware/auth.js';
import { sendError } from '../utils/http.js';
import { validateLoginPayload, validateRegisterPayload } from '../utils/validation.js';

function toProfileDto(user) {
  return {
    id: String(user._id),
    username: user.username,
    email: user.email,
    role: user.role,
    created_at: user.createdAt,
    is_active: true,
    profile: {
      display_name: user.username,
      bio: '',
      avatar_url: '',
      total_score: user.progress?.totalScore ?? 0,
      challenges_completed: user.progress?.challengesCompleted ?? 0,
      badges_earned: user.progress?.badges?.length ?? 0,
      joined_challenges: [],
    },
  };
}

export function buildAuthRouter({ jwtSecret, jwtExpiry }) {
  const router = Router();

  router.post('/register', async (req, res, next) => {
    try {
      const payload = validateRegisterPayload(req.body);
      if (!payload.valid) {
        return sendError(res, 400, {
          code: 'INVALID_REGISTRATION_PAYLOAD',
          message: 'Invalid registration payload',
          requestId: req.id,
        });
      }

      const { username, email, password } = payload.value;

      const existing = await User.findOne({ $or: [{ username }, { email }] }).lean();
      if (existing) {
        return sendError(res, 409, {
          code: 'USER_EXISTS',
          message: 'User already exists',
          requestId: req.id,
        });
      }

      const passwordHash = await hashPassword(password);
      const user = await User.create({ username, email, passwordHash });

      return res.status(201).json({
        id: user.id,
        username: user.username,
        email: user.email,
      });
    } catch (error) {
      return next(error);
    }
  });

  router.post('/login', async (req, res, next) => {
    try {
      const payload = validateLoginPayload(req.body);
      if (!payload.valid) {
        return sendError(res, 400, {
          code: 'INVALID_LOGIN_PAYLOAD',
          message: 'Invalid login payload',
          requestId: req.id,
        });
      }

      const { username, password } = payload.value;
      const user = await User.findOne({ username });
      if (!user) {
        return sendError(res, 401, {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid credentials',
          requestId: req.id,
        });
      }

      const valid = await verifyPassword(password, user.passwordHash);
      if (!valid) {
        return sendError(res, 401, {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid credentials',
          requestId: req.id,
        });
      }

      const token = signToken({ sub: user.id, username: user.username, role: user.role }, jwtSecret, jwtExpiry);
      return res.json({ accessToken: token, tokenType: 'Bearer', expiresIn: jwtExpiry });
    } catch (error) {
      return next(error);
    }
  });

  router.get('/me', authRequired(jwtSecret), async (req, res, next) => {
    try {
      const user = await User.findById(req.user.sub).lean();
      if (!user) {
        return sendError(res, 404, {
          code: 'USER_NOT_FOUND',
          message: 'User not found',
          requestId: req.id,
        });
      }

      return res.json(toProfileDto(user));
    } catch (error) {
      return next(error);
    }
  });

  return router;
}
