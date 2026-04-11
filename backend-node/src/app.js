import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { healthRouter } from './routes/health.js';
import { buildAuthRouter } from './routes/auth.js';
import { challengesRouter } from './routes/challenges.js';
import { progressRouter } from './routes/progress.js';
import { authRequired } from './middleware/auth.js';
import { apiRateLimit, authRateLimit } from './middleware/rateLimit.js';

export function createApp({ jwtSecret, jwtExpiry, corsOrigin }) {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: corsOrigin }));
  app.use(express.json({ limit: '1mb' }));

  app.use('/api/health', healthRouter);
  app.use('/api/auth', authRateLimit, buildAuthRouter({ jwtSecret, jwtExpiry }));
  app.use('/api/challenges', apiRateLimit, challengesRouter);
  app.use('/api/progress', apiRateLimit, authRequired(jwtSecret), progressRouter);

  app.use((err, _req, res, _next) => {
    const status = err.name === 'ValidationError' ? 400 : 500;
    const message = status === 500 ? 'Internal server error' : err.message;
    res.status(status).json({ error: message });
  });

  return app;
}
