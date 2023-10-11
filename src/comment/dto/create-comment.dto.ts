import { IsBase64, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsOptional()
  text: string;

  // @IsBase64()
  @IsOptional()
  attachment: any;
}
