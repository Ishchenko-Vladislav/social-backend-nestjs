import { PostEntity } from 'src/post/entities/post.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { Base } from 'src/utils/Base';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { LikeToCommentEntity } from './like.entity';

@Entity('comment')
export class CommentEntity extends Base {
  @ManyToOne(() => PostEntity, (post) => post.comments, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'post_id' })
  post: PostEntity;

  @ManyToOne(() => UserEntity, (user) => user.comment)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column()
  text: string;

  @OneToMany(() => LikeToCommentEntity, (like) => like.comment)
  @JoinColumn({ name: 'likes_id' })
  likes: LikeToCommentEntity[];
}