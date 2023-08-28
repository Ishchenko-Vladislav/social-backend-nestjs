import { UserEntity } from 'src/user/entities/user.entity';

export interface IJwtPayload {
  sub: string;
  email: string;
}

export type IJwtResponse = Pick<UserEntity, 'id' | 'email'>;
