import { v4 as uuid } from 'uuid';
import type { Request, Response, NextFunction } from 'express';

export function requestIdMiddleware(req: Request & { requestId?: string }, res: Response, next: NextFunction) {
  const incoming = (req.headers['x-request-id'] as string) || undefined;
  const id = incoming || uuid();
  req.requestId = id;
  res.setHeader('X-Request-Id', id);
  next();
}


