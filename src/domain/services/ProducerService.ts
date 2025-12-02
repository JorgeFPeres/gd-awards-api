import { injectable, inject } from 'inversify';
import { IMovieRepository } from '../interfaces/IMovieRepository';
import { IProducerService, AwardsIntervalResponse } from '../interfaces/IProducerService';
import { TYPES } from '../../config/types';

@injectable()
export class ProducerService implements IProducerService {
  constructor(@inject(TYPES.MovieRepository) private movieRepository: IMovieRepository) {}

  async getAwardsInterval(): Promise<AwardsIntervalResponse> {
    const [min, max] = await Promise.all([
      this.movieRepository.findProducersWithMinInterval(),
      this.movieRepository.findProducersWithMaxInterval(),
    ]);

    return { min, max };
  }
}
