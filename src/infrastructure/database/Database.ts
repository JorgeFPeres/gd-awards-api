import { DataSource } from 'typeorm';
import { Movie } from '../../domain/entities/Movie';

export const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: ':memory:',
  synchronize: true,
  logging: false,
  entities: [Movie],
});

export async function initializeDatabase(): Promise<DataSource> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  return AppDataSource;
}
