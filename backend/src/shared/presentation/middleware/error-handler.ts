import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { AppError } from '@src/shared/domain/errors/app-error';

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      code: err.code,
      message: err.message,
      details: err.details
    });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      code: 'VALIDATION_ERROR',
      message: 'Invalid payload',
      details: err.flatten()
    });
    return;
  }

  res.status(500).json({
    code: 'INTERNAL_SERVER_ERROR',
    message: 'Unexpected error'
  });
};
