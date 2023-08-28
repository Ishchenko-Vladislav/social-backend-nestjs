import { Request } from 'express';
import { UserEntity } from 'src/user/entities/user.entity';
import { IJwtResponse } from './jwt.interface';

// interface IPayload {
//   email: string;
//   sub: string;
//   iat: number;
//   exp: number;
// }

export interface AuthenticatedRequest extends Request {
  user: IJwtResponse;
}
