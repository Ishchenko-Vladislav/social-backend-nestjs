import { IsArray, IsOptional, IsString } from 'class-validator';
import { CreateDtoAttachment } from 'src/comment/dto/create-comment.dto';

export class CreatePostDto {
  @IsString()
  @IsOptional()
  text: string;

  @IsOptional()
  info: TPostInfo;

  @IsOptional()
  attachment: CreateDtoAttachment[];
}

export type TPostInfo = {
  mentions: any[];
  hashtags: any[];
};
