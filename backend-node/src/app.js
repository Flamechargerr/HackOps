import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { healthRouter } from './routes/health.js';
import { buildAuthRouter } from './routes/auth.js';
import { challengesRouter } from './routes/challenges.js';
import { progressRouter } from './routes/progress.js';
import { authRequired } from './middleware/auth.js';
import { apiRateLimit, authRateLimit } from './middleware/rateLimit.js';
import { requestContext } from './middleware/requestContext.js';
import { buildErrorBody, sendError } from './utils/http.js';
import { logger } from './utils/logger.js';

function normalizeCorsOrigins(corsOrigin) {
  if (!corsOrigin) return [];
  if (Array.isArray(corsOrigin)) return corsOrigin;
  return String(corsOrigin)
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function corsOriginChecker(allowedOrigins) {
  const allowAll = allowedOrigins.includes('*');

  return (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowAll || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  };
}

export function createApp({ jwtSecret, jwtExpiry, corsOrigin }) {
  const app = express();
  const allowedOrigins = normalizeCorsOrigins(corsOrigin);

  app.set('trust proxy', 1);
  app.use(requestContext);
  app.use(helmet());
  app.use(cors({ origin: corsOriginChecker(allowedOrigins), credentials: true }));
  app.use(express.json({ limit: '1mb' }));

  app.use('/api/health', healthRouter);
  app.use('/api/auth', authRateLimit, buildAuthRouter({ jwtSecret, jwtExpiry }));
  app.use('/api/challenges', apiRateLimit, challengesRouter);
  app.use('/api/progress', apiRateLimit, authRequired(jwtSecret), progressRouter);

  app.use((req, res) => sendError(res, 404, {
    code: 'NOT_FOUND',
    message: 'Route not found',
    requestId: req.id,
  }));

  app.use((err, req, res, _next) => {
    const status = err.name === 'ValidationError' ? 400 : 500;
    const code = status === 400 ? 'VALIDATION_ERROR' : 'INTERNAL_SERVER_ERROR';
    const message = status === 500 ? 'Internal server error' : err.message;

    logger.error('request_error', {
      requestId: req.id,
      method: req.method,
      path: req.originalUrl,
      statusCode: status,
      errorName: err.name,
      errorMessage: err.message,
    });

    res.status(status).json(buildErrorBody({
      code,
      message,
      requestId: req.id,
    }));
  });

  return app;
}
