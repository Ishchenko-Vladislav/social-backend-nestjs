import { PostEntity } from 'src/post/entities/post.entity';
import { Base } from 'src/utils/Base';
import {
  Entity,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SubscriptionEntity } from './follower.entity';
import { ConversationEntity } from 'src/conversation/entities/conversation.entity';
import { CommentEntity } from 'src/comment/entities/comment.entity';
import { LikeToCommentEntity } from 'src/comment/entities/like.entity';
import { LikeToPostEntity } from 'src/post/entities/like.entity';

@Entity('user')
export class UserEntity extends Base {
  @Column({ default: '', unique: true })
  email: string;

  @Column({ default: '', name: 'user_name' })
  userName: string;

  @Column({ name: 'display_name', unique: true })
  displayName: string;

  @Column({ default: '', select: false })
  password: string;

  @Column({ default: false, name: 'is_verified' })
  isVerified: boolean;

  @OneToMany(() => PostEntity, (post) => post.user)
  posts: PostEntity[];

  @Column({ name: 'avatar_path', nullable: true })
  avatarPath: string;

  @OneToMany(
    () => SubscriptionEntity,
    (subscription) => subscription.following,
    { onDelete: 'CASCADE' },
  )
  following: SubscriptionEntity[];

  @OneToMany(
    () => SubscriptionEntity,
    (subscription) => subscription.follower,
    { onDelete: 'CASCADE' },
  )
  followers: SubscriptionEntity[];

  @ManyToMany(() => ConversationEntity, (conversation) => conversation.users, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  conversation: ConversationEntity[];

  @OneToMany(() => LikeToPostEntity, (like) => like.user, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'likes_to_post' })
  likesToPost: LikeToPostEntity[];

  @OneToMany(() => LikeToCommentEntity, (like) => like.user, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'likes_to_comment' })
  likesToComment: LikeToCommentEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.user, {
    onDelete: 'CASCADE',
  })
  comment: CommentEntity[];
}
