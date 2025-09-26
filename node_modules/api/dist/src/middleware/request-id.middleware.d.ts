import type { Request, Response, NextFunction } from 'express';
export declare function requestIdMiddleware(req: Request & {
    requestId?: string;
}, res: Response, next: NextFunction): void;
