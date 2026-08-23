import { NextFunction, Request, Response } from 'express';

export const errorMiddleware = (err: Error & { statusCode?: number }, _req: Request, res: Response, _next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
  });
};

export default errorMiddleware;