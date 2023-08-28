import { UserEntity } from 'src/user/entities/user.entity';
import {
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CommentEntity } from './comment.entity';

@Entity()
export class LikeToCommentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.likesToComment, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @ManyToOne(() => CommentEntity, (comment) => comment.likes, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  comment: CommentEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
