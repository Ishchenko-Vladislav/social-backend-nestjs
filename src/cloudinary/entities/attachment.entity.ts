import { UserEntity } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CloudinaryFile } from '../cloudinary-response';
import { CommentEntity } from 'src/comment/entities/comment.entity';
import { PostEntity } from 'src/post/entities/post.entity';
import MessageEntity from 'src/conversation/entities/message.entity';

export type TResourceType = 'video' | 'image' | 'raw';

@Entity()
export class AttachmentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'asset_id' })
  assetId: string;

  @Column()
  bytes: number;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'public_id' })
  publicId: string;

  @Column({ name: 'resource_type' })
  resourceType: TResourceType;

  @Column({ name: 'secure_url' })
  secureUrl: string;

  @Column()
  url: string;

  @Column('json', { nullable: true, default: null })
  image: {
    width: number;
    height: number;
    format: string;
  };
  @Column('json', { nullable: true, default: null })
  video: {
    width: number;
    height: number;
    format: string;
  };

  @ManyToOne(() => CommentEntity, (comment) => comment.attachment, {
    cascade: true,
  })
  comment: CommentEntity;

  @ManyToOne(() => PostEntity, (post) => post.attachment, {
    cascade: true,
  })
  post: PostEntity;

  @ManyToOne(() => MessageEntity, (message) => message.attachment, {
    cascade: true,
  })
  message: MessageEntity;

  // @Column({ default: null, nullable: true })
  // height: number;

  // @Column({ default: null, nullable: true })
  // width: number;

  // @Column({ name: 'api_key' })
  // apiKey: string;

  // @Column()
  // etag: string;

  // @Column()
  // signature: string;
  // @Column()
  // folder: string;

  // @Column()
  // format: string;

  // @Column()
  // placeholder: false;

  // @Column({ array: true, default: [], type: 'text' })
  // tags: string[];

  // @Column()
  // type: string;

  // @Column()
  // version: number;

  // @Column()
  // version_id: string;
}
