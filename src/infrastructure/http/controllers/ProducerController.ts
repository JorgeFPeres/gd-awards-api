import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { IProducerService } from '../../../domain/interfaces/IProducerService';
import { TYPES } from '../../../config/types';
import { container } from '../../../config/container';

export class ProducerController {
  private producerService: IProducerService;

  constructor() {
    this.producerService = container.get<IProducerService>(TYPES.ProducerService);
  }

  async getAwardsInterval(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.producerService.getAwardsInterval();
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
  }
}
