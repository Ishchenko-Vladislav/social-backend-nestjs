import { UserEntity } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CloudinaryFile } from '../cloudinary-response';

@Entity()
export class AttachmentEntity implements CloudinaryFile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  api_key: string;

  @Column()
  asset_id: string;

  @Column()
  bytes: number;

  @Column()
  created_at: Date;

  @Column()
  etag: string;

  @Column()
  folder: string;

  @Column()
  format: string;

  @Column()
  height: number;

  @Column()
  placeholder: false;

  @Column()
  public_id: string;

  @Column()
  resource_type: string;

  @Column()
  secure_url: string;

  @Column()
  signature: string;

  @Column({ array: true, default: [], type: 'text' })
  tags: string[];

  @Column()
  type: string;

  @Column()
  url: string;

  @Column()
  version: number;

  @Column()
  version_id: string;

  @Column()
  width: number;
}
