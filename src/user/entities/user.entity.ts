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
import { SubscriptionEntity } from './subscription.entity';
import { ConversationEntity } from 'src/conversation/entities/conversation.entity';
import { CommentEntity } from 'src/comment/entities/comment.entity';
import { LikeToCommentEntity } from 'src/comment/entities/like.entity';
import { LikeToPostEntity } from 'src/post/entities/like.entity';
import { BookmarkEntity } from 'src/post/entities/bookmark.entity';
import { LowAttach } from '../dto/update-user.dto';

@Entity('user')
export class UserEntity extends Base {
  @Column({ default: '', unique: true })
  email: string;

  @Column({ default: '', name: 'user_name', unique: true })
  userName: string;

  @Column({ name: 'display_name' })
  displayName: string;

  @Column({ default: '', select: false })
  password: string;

  @Column({ default: false, name: 'is_verified' })
  isVerified: boolean;

  @OneToMany(() => PostEntity, (post) => post.user)
  posts: PostEntity[];

  @Column({ name: 'avatar_path', nullable: true, default: null, type: 'json' })
  avatarPath: LowAttach;

  @Column({ name: 'bg_path', nullable: true, default: null, type: 'json' })
  bgPath: LowAttach;

  @OneToMany(
    () => SubscriptionEntity,
    (subscription) => subscription.fromUser,
    { onDelete: 'CASCADE' },
  )
  following: SubscriptionEntity[];

  @Column({ name: 'following_count', default: 0 })
  followingCount: number;

  @OneToMany(() => SubscriptionEntity, (subscription) => subscription.toUser, {
    onDelete: 'CASCADE',
  })
  followers: SubscriptionEntity[];

  @Column({ name: 'followers_count', default: 0 })
  followersCount: number;

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

  @OneToMany(() => BookmarkEntity, (mark) => mark.user)
  @JoinColumn()
  bookmarks: BookmarkEntity[];
}
