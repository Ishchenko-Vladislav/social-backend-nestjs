import { CommentEntity } from 'src/comment/entities/comment.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { Base } from 'src/utils/Base';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { LikeToPostEntity } from './like.entity';
import { HashtagEntity } from './hashtag.entity';

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

  @ManyToMany(() => HashtagEntity, (tag) => tag.posts)
  @JoinTable()
  tags: HashtagEntity[];

  @OneToMany(() => LikeToPostEntity, (like) => like.post)
  @JoinColumn({ name: 'likes_id' })
  likes: LikeToPostEntity[];
}
