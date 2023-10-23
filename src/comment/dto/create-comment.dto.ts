import { IsBase64, IsOptional, IsString } from 'class-validator';
import { TResourceType } from 'src/cloudinary/entities/attachment.entity';

export class CreateCommentDto {
  @IsString()
  @IsOptional()
  text: string;

  // @IsBase64()
  @IsOptional()
  attachment: CreateDtoAttachment[];
}

export type CreateDtoAttachment =
  | CloudinaryVideo
  | CloudinaryImage
  | CloudinaryRaw;

type CloudinaryVideo = {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: 'video';
  created_at: string;
  tags: [];
  pages: number;
  bytes: number;
  type: string;
  etag: string;
  placeholder: false;
  url: string;
  secure_url: string;
  playback_url: string;
  folder: string;
  audio: {};
  video: {
    pix_format: string;
    codec: string;
    level: number;
    profile: string;
    bit_rate: string;
    dar: string;
    time_base: string;
  };
  frame_rate: number;
  bit_rate: number;
  duration: number;
  rotation: number;
  original_filename: string;
  nb_frames: number;
  api_key: string;
};

type CloudinaryImage = {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: 'image';
  created_at: Date;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: false;
  url: string;
  secure_url: string;
  folder: string;
  original_filename: string;
  api_key: string;
};

type CloudinaryRaw = {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  resource_type: 'raw';
  created_at: string;
  tags: [];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  folder: string;
  original_filename: string;
  api_key: string;
};
