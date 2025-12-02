import { Movie } from '../entities/Movie';
import { ProducerInterval } from './IProducerService';

export interface MovieWithProducerNames {
  movie: Partial<Movie>;
  producerNames: string[];
}

export interface IMovieRepository {
  save(movie: Partial<Movie>): Promise<void>;
  saveAllWithProducers(data: MovieWithProducerNames[]): Promise<void>;
  findAllWinners(): Promise<Movie[]>;
  findAll(): Promise<Movie[]>;
  findProducersWithMinInterval(): Promise<ProducerInterval[]>;
  findProducersWithMaxInterval(): Promise<ProducerInterval[]>;
}
