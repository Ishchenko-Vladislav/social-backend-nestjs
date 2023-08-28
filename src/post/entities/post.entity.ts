import { CommentEntity } from 'src/comment/entities/comment.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { Base } from 'src/utils/Base';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { LikeToPostEntity } from './like.entity';

@Entity('post')
export class PostEntity extends Base {
  @Column()
  text: string;

  @ManyToOne(() => UserEntity, (user) => user.posts)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToMany(() => CommentEntity, (comment) => comment.post)
  // @JoinColumn()
  comments: CommentEntity[];

  @OneToMany(() => LikeToPostEntity, (like) => like.post)
  @JoinColumn({ name: 'likes_id' })
  likes: LikeToPostEntity[];
}
