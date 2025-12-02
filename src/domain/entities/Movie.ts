import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Producer } from './Producer';

@Entity('movies')
export class Movie {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int' })
  year!: number;

  @Column({ type: 'varchar' })
  title!: string;

  @Column({ type: 'varchar' })
  studios!: string;

  @Column({ type: 'varchar' })
  producers!: string;

  @Column({ type: 'boolean', default: false })
  winner!: boolean;

  @ManyToMany(() => Producer, producer => producer.movies, { cascade: true })
  @JoinTable({
    name: 'movie_producers',
    joinColumn: { name: 'movie_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'producer_id', referencedColumnName: 'id' },
  })
  producersList!: Producer[];
}
