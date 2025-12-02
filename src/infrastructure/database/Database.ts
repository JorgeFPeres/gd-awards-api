import { DataSource } from 'typeorm';
import { Movie } from '../../domain/entities/Movie';
import { Producer } from '../../domain/entities/Producer';

export const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: ':memory:',
  synchronize: true,
  logging: false,
  entities: [Movie, Producer],
});

export async function initializeDatabase(): Promise<DataSource> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  return AppDataSource;
}
