import 'reflect-metadata';
import express from 'express';
import path from 'path';
import { initializeDatabase } from './infrastructure/database/Database';
import { router } from './infrastructure/http/routes';
import { errorHandler } from './infrastructure/http/middlewares/errorHandler';
import { container } from './config/container';
import { CsvLoader } from './infrastructure/csv/CsvLoader';
import { IMovieRepository } from './domain/interfaces/IMovieRepository';
import { TYPES } from './config/types';

const PORT = process.env.PORT || 3001;

async function bootstrap(): Promise<void> {
  // 1. Initialize database
  await initializeDatabase();
  console.log('Database initialized');

  // 2. Load CSV data
  const csvLoader = container.get<CsvLoader>(TYPES.CsvLoader);
  const movieRepository = container.get<IMovieRepository>(TYPES.MovieRepository);

  const csvPath = process.env.CSV_PATH || path.join(__dirname, '..', 'data', 'movielist.csv');
  const movies = csvLoader.load(csvPath);
  await movieRepository.saveAll(movies);
  console.log(`Loaded ${movies.length} movies from CSV`);

  // 3. Setup Express
  const app = express();
  app.use(express.json());
  app.use('/api', router);
  app.use(errorHandler);

  // 4. Start server
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

bootstrap().catch(error => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
