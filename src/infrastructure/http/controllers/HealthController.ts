import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export class HealthController {
  check(req: Request, res: Response): void {
    res.status(StatusCodes.OK).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
    });
  }
}
