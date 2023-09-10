import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  text: string;

  @IsOptional()
  @IsArray()
  hashtags: string[];
}
