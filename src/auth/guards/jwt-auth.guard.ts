import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from 'src/user/entities/user.entity';
import { IJwtResponse } from '../types/jwt.interface';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
  handleRequest<IJwtResponse>(
    err: any,
    user: IJwtResponse,
    info: any,
    context: ExecutionContext,
  ) {
    // console.log('HERE INFO', user);
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user as IJwtResponse;
  }
}
