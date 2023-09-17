import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PostEntity } from './post.entity';

@Entity()
export class HashtagEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => PostEntity, (post) => post.tags)
  @JoinTable()
  posts: PostEntity[];

  @Column({ name: 'posts_count', default: 0 })
  postsCount: number;
}
