import { Router } from 'express';
import { User } from '../models/User.js';
import { hashPassword, signToken, verifyPassword } from '../services/auth.js';

export function buildAuthRouter({ jwtSecret, jwtExpiry }) {
  const router = Router();

  router.post('/register', async (req, res, next) => {
    try {
      const { username, email, password } = req.body ?? {};
      if (!username || !email || !password || password.length < 8) {
        return res.status(400).json({ error: 'Invalid registration payload' });
      }

      const existing = await User.findOne({ $or: [{ username }, { email }] }).lean();
      if (existing) return res.status(409).json({ error: 'User already exists' });

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
      const { username, password } = req.body ?? {};
      if (!username || !password) return res.status(400).json({ error: 'Invalid login payload' });

      const user = await User.findOne({ username });
      if (!user) return res.status(401).json({ error: 'Invalid credentials' });

      const valid = await verifyPassword(password, user.passwordHash);
      if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

      const token = signToken({ sub: user.id, username: user.username, role: user.role }, jwtSecret, jwtExpiry);
      return res.json({ accessToken: token, tokenType: 'Bearer' });
    } catch (error) {
      return next(error);
    }
  });

  return router;
}
