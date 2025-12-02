import { Movie } from '../entities/Movie';


export interface IMovieRepository {
  save(movie: Movie): void;
  saveAll(movies: Movie[]): void;
  findAllWinners(): Movie[];
  findAll(): Movie[];
}

