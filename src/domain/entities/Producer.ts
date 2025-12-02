import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Movie } from './Movie';

@Entity('producers')
export class Producer {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', unique: true })
  name!: string;

  @ManyToMany(() => Movie, movie => movie.producersList)
  movies!: Movie[];
}
