import { injectable } from 'inversify';
import { Repository } from 'typeorm';
import { Movie } from '../../domain/entities/Movie';
import { IMovieRepository } from '../../domain/interfaces/IMovieRepository';
import { AppDataSource } from '../database/Database';

@injectable()
export class MovieRepository implements IMovieRepository {
  private repository: Repository<Movie>;

  constructor() {
    this.repository = AppDataSource.getRepository(Movie);
  }

  async save(movie: Partial<Movie>): Promise<void> {
    await this.repository.save(movie);
  }

  async saveAll(movies: Partial<Movie>[]): Promise<void> {
    await this.repository.save(movies);
  }

  async findAllWinners(): Promise<Movie[]> {
    return this.repository.find({
      where: { winner: true },
      order: { year: 'ASC' },
    });
  }

  async findAll(): Promise<Movie[]> {
    return this.repository.find();
  }
}
