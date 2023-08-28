import { UserEntity } from 'src/user/entities/user.entity';
import {
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PostEntity } from './post.entity';

@Entity()
export class LikeToPostEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.likesToPost, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @ManyToOne(() => PostEntity, (post) => post.likes, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  post: PostEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
