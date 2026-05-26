import { ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(`[⚠️ Server Error]: ${err.stack || err}`);
  if (res.headersSent) {
    return next(err)
  }
  res.status(500).json({
    message: 'Internal server error',
  });
};
