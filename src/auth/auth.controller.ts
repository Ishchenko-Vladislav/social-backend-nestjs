import {
  Controller,
  Get,
  Post,
  UseGuards,
  HttpStatus,
  HttpCode,
  Res,
  Req,
  Put,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Response, Request } from 'express';
import { AuthenticatedRequest } from './types/user.request';
import { UserEntity } from 'src/user/entities/user.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { Public } from 'src/constants/constants';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async login(
    @Req() req: { user: UserEntity },
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.login(req.user, response);
  }

  @Post('register')
  @Public()
  async register(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.register(createUserDto, response);
  }

  // @UseGuards(JwtAuthGuard)
  // @Post('logout')
  // async logout(
  //   @Req() req: AuthenticatedRequest,
  //   @Res({ passthrough: true }) response: Response,
  // ) {
  //   return this.authService.logout(response, req);
  // }

  @Post('v1/secret/refresh')
  @Public()
  refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
    @Body() payload: { refresh_token: string },
  ) {
    console.log('I TRY GET TOKEN', payload.refresh_token);
    return this.authService.refreshToken(payload.refresh_token, response);
  }
}
