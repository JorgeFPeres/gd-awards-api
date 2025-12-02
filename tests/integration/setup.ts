import 'reflect-metadata';
import express, { Express } from 'express';
import { initializeDatabase, AppDataSource } from '../../src/infrastructure/database/Database';
import { router } from '../../src/infrastructure/http/routes';
import { container } from '../../src/config/container';
import { CsvLoader } from '../../src/infrastructure/csv/CsvLoader';
import { IMovieRepository } from '../../src/domain/interfaces/IMovieRepository';
import { TYPES } from '../../src/config/types';
import path from 'path';

let app: Express;

export async function setupApp(csvPath?: string): Promise<Express> {
  await initializeDatabase();

  const csvLoader = container.get<CsvLoader>(TYPES.CsvLoader);
  const movieRepository = container.get<IMovieRepository>(TYPES.MovieRepository);

  const filePath = csvPath || path.join(__dirname, '..', '..', 'data', 'movielist.csv');
  const movies = csvLoader.load(filePath);
  await movieRepository.saveAll(movies);

  app = express();
  app.use(express.json());
  app.use('/api', router);

  return app;
}

export async function teardownApp(): Promise<void> {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
}

export { app };
