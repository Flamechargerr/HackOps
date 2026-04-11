import { Router } from 'express';
import mongoose from 'mongoose';

export const healthRouter = Router();

healthRouter.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'hackops-node-backend',
    timestamp: new Date().toISOString(),
  });
});

healthRouter.get('/ready', (_req, res) => {
  const isReady = mongoose.connection.readyState === 1;
  if (!isReady) {
    return res.status(503).json({
      status: 'not_ready',
      service: 'hackops-node-backend',
      timestamp: new Date().toISOString(),
    });
  }

  return res.json({
    status: 'ready',
    service: 'hackops-node-backend',
    timestamp: new Date().toISOString(),
  });
});
