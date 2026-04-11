import jwt from 'jsonwebtoken';
import { sendError } from '../utils/http.js';

export function authRequired(secret) {
  return (req, res, next) => {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      return sendError(res, 401, {
        code: 'UNAUTHORIZED',
        message: 'Unauthorized',
        requestId: req.id,
      });
    }

    const token = header.slice(7);
    try {
      const payload = jwt.verify(token, secret);
      req.user = payload;
      return next();
    } catch {
      return sendError(res, 401, {
        code: 'INVALID_TOKEN',
        message: 'Invalid token',
        requestId: req.id,
      });
    }
  };
}
