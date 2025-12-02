import { injectable, inject } from 'inversify';
import { IMovieRepository } from '../interfaces/IMovieRepository';
import {
  IProducerService,
  AwardsIntervalResponse,
  ProducerInterval,
} from '../interfaces/IProducerService';
import { TYPES } from '../../config/types';

@injectable()
export class ProducerService implements IProducerService {
  constructor(@inject(TYPES.MovieRepository) private movieRepository: IMovieRepository) {}

  async getAwardsInterval(): Promise<AwardsIntervalResponse> {
    const winners = await this.movieRepository.findAllWinners();

    // Group wins by producer
    const producerWins = new Map<string, number[]>();

    for (const movie of winners) {
      const producers = this.parseProducers(movie.producers);

      for (const producer of producers) {
        const wins = producerWins.get(producer) || [];
        wins.push(movie.year);
        producerWins.set(producer, wins);
      }
    }

    // Calculate intervals for producers with 2+ wins
    const allIntervals: ProducerInterval[] = [];

    for (const [producer, years] of producerWins) {
      if (years.length < 2) continue;

      // Sort years to ensure correct order
      years.sort((a, b) => a - b);

      // Calculate intervals between consecutive wins
      for (let i = 1; i < years.length; i++) {
        allIntervals.push({
          producer,
          interval: years[i] - years[i - 1],
          previousWin: years[i - 1],
          followingWin: years[i],
        });
      }
    }

    if (allIntervals.length === 0) {
      return { min: [], max: [] };
    }

    // Find min and max intervals
    const minInterval = Math.min(...allIntervals.map(i => i.interval));
    const maxInterval = Math.max(...allIntervals.map(i => i.interval));

    return {
      min: allIntervals.filter(i => i.interval === minInterval),
      max: allIntervals.filter(i => i.interval === maxInterval),
    };
  }

  private parseProducers(producersString: string): string[] {
    // Split by comma and "and"
    // "Producer A, Producer B and Producer C" -> ["Producer A", "Producer B", "Producer C"]

    return producersString
      .split(/,|\sand\s/)
      .map(p => p.trim())
      .filter(p => p.length > 0);
  }
}
