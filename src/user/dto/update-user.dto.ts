import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @MinLength(2)
  displayName: string;

  avatarPath: LowAttach | null;

  bgPath: LowAttach | null;

  @IsString()
  @MinLength(3)
  userName: string;
}

export interface LowAttach {
  public_id: string | null;
  url: string | null;
}
