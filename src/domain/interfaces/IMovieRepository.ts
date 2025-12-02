import { Movie } from '../entities/Movie';

export interface IMovieRepository {
  save(movie: Partial<Movie>): Promise<void>;
  saveAll(movies: Partial<Movie>[]): Promise<void>;
  findAllWinners(): Promise<Movie[]>;
  findAll(): Promise<Movie[]>;
}
