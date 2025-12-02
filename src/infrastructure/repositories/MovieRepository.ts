import { injectable } from 'inversify';
import { Repository } from 'typeorm';
import { Movie } from '../../domain/entities/Movie';
import { Producer } from '../../domain/entities/Producer';
import { IMovieRepository, MovieWithProducerNames } from '../../domain/interfaces/IMovieRepository';
import { ProducerInterval } from '../../domain/interfaces/IProducerService';
import { AppDataSource } from '../database/Database';

@injectable()
export class MovieRepository implements IMovieRepository {
  private movieRepository: Repository<Movie>;
  private producerRepository: Repository<Producer>;

  constructor() {
    this.movieRepository = AppDataSource.getRepository(Movie);
    this.producerRepository = AppDataSource.getRepository(Producer);
  }

  async save(movie: Partial<Movie>): Promise<void> {
    await this.movieRepository.save(movie);
  }

  async saveAllWithProducers(data: MovieWithProducerNames[]): Promise<void> {
    // First, create all unique producers
    const allProducerNames = new Set<string>();
    for (const item of data) {
      for (const name of item.producerNames) {
        allProducerNames.add(name);
      }
    }

    // Create producers map
    const producersMap = new Map<string, Producer>();
    for (const name of allProducerNames) {
      let producer = await this.producerRepository.findOne({ where: { name } });
      if (!producer) {
        producer = this.producerRepository.create({ name });
        await this.producerRepository.save(producer);
      }
      producersMap.set(name, producer);
    }

    // Create movies with producer relations
    for (const item of data) {
      const movie = this.movieRepository.create({
        ...item.movie,
        producersList: item.producerNames.map(name => producersMap.get(name)!),
      });
      await this.movieRepository.save(movie);
    }
  }

  async findAllWinners(): Promise<Movie[]> {
    return this.movieRepository.find({
      where: { winner: true },
      order: { year: 'ASC' },
      relations: ['producersList'],
    });
  }

  async findAll(): Promise<Movie[]> {
    return this.movieRepository.find({
      relations: ['producersList'],
    });
  }

  async findProducersWithMinInterval(): Promise<ProducerInterval[]> {
    const query = `
      WITH producer_wins AS (
        SELECT 
          p.name AS producer,
          m.year AS win_year
        FROM producers p
        INNER JOIN movie_producers mp ON p.id = mp.producer_id
        INNER JOIN movies m ON mp.movie_id = m.id
        WHERE m.winner = 1
        ORDER BY p.name, m.year
      ),
      intervals AS (
        SELECT 
          producer,
          win_year AS followingWin,
          LAG(win_year) OVER (PARTITION BY producer ORDER BY win_year) AS previousWin,
          (win_year - LAG(win_year) OVER (PARTITION BY producer ORDER BY win_year)) AS interval
        FROM producer_wins
      )
      SELECT 
        producer,
        interval,
        previousWin,
        followingWin
      FROM intervals
      WHERE interval IS NOT NULL
        AND interval = (SELECT MIN(interval) FROM intervals WHERE interval IS NOT NULL)
      ORDER BY producer, previousWin
    `;

    const result = await AppDataSource.query(query);
    return result.map((row: any) => ({
      producer: row.producer,
      interval: row.interval,
      previousWin: row.previousWin,
      followingWin: row.followingWin,
    }));
  }

  async findProducersWithMaxInterval(): Promise<ProducerInterval[]> {
    const query = `
      WITH producer_wins AS (
        SELECT 
          p.name AS producer,
          m.year AS win_year
        FROM producers p
        INNER JOIN movie_producers mp ON p.id = mp.producer_id
        INNER JOIN movies m ON mp.movie_id = m.id
        WHERE m.winner = 1
        ORDER BY p.name, m.year
      ),
      intervals AS (
        SELECT 
          producer,
          win_year AS followingWin,
          LAG(win_year) OVER (PARTITION BY producer ORDER BY win_year) AS previousWin,
          (win_year - LAG(win_year) OVER (PARTITION BY producer ORDER BY win_year)) AS interval
        FROM producer_wins
      )
      SELECT 
        producer,
        interval,
        previousWin,
        followingWin
      FROM intervals
      WHERE interval IS NOT NULL
        AND interval = (SELECT MAX(interval) FROM intervals WHERE interval IS NOT NULL)
      ORDER BY producer, previousWin
    `;

    const result = await AppDataSource.query(query);
    return result.map((row: any) => ({
      producer: row.producer,
      interval: row.interval,
      previousWin: row.previousWin,
      followingWin: row.followingWin,
    }));
  }
}
