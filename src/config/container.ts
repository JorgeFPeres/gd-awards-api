import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from './types';

import { MovieRepository } from '../infrastructure/repositories/MovieRepository';
import { ProducerService } from '../domain/services/ProducerService';
import { CsvLoader } from '../infrastructure/csv/CsvLoader';

import { IMovieRepository } from '../domain/interfaces/IMovieRepository';
import { IProducerService } from '../domain/interfaces/IProducerService';

const container = new Container();

// Repositories
container.bind<IMovieRepository>(TYPES.MovieRepository).to(MovieRepository).inSingletonScope();

// Services
container.bind<IProducerService>(TYPES.ProducerService).to(ProducerService).inSingletonScope();

// Infrastructure
container.bind<CsvLoader>(TYPES.CsvLoader).to(CsvLoader).inSingletonScope();

export { container };
