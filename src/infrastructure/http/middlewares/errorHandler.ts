import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import createError from 'http-errors';

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (createError.isHttpError(error)) {
    res.status(error.statusCode).json({
      message: error.message,
      statusCode: error.statusCode,
    });
    return;
  }

  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    message: error instanceof Error ? error.message : 'An unexpected error occurred',
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
  });
}

