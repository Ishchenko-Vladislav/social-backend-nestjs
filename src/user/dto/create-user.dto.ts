import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  displayName: string;

  @IsEmail()
  email: string;

  @MinLength(6, { message: 'password must be more then 6' })
  password: string;
}
