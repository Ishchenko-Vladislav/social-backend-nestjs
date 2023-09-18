import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/user/entities/user.entity';
import { IJwtPayload } from './types/jwt.interface';
import { Response, Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOneSelect(email, [
      'id',
      'email',
      'isVerified',
      'password',
      'userName',
    ]);
    if (!user)
      throw new BadRequestException("User with this email don't exist");
    const matchPassword = await compare(password, user.password);

    if (!matchPassword) throw new BadRequestException('Password incorrect');
    const { password: pass, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login(user: UserEntity, response: Response) {
    const payload: IJwtPayload = { email: user.email, sub: user.id };
    const tokens = await this.getNewTokens(payload);
    // await this.setRefreshTokenToCookie(response, tokens.refresh_token);
    return tokens;
  }
  async register(createUserDto: CreateUserDto, response: Response) {
    const user = await this.userService.create(createUserDto);
    const payload: IJwtPayload = { email: user.email, sub: user.id };
    const tokens = await this.getNewTokens(payload);
    // await this.setRefreshTokenToCookie(response, tokens.refresh_token);

    return tokens;
    // const payload: IJwtPayload = { email: user.email, sub: user.id };
    // const tokens = await this.getNewTokens(payload);
    // await this.setRefreshTokenToCookie(response, tokens.refresh_token);
    // return {
    //   user,
    //   access_token: tokens.access_token,
    // };
  }

  async refreshToken(token: string, response: Response) {
    if (!token) throw new UnauthorizedException('token is missing');
    // if(!token) {
    //   console.log(response.)
    // }
    const decoded = await this.verifyRefreshJwtToken(token);
    const payload = { email: decoded.email, sub: decoded.sub };

    const isExist = await this.userService.findOne(payload.email);
    if (!isExist) return new UnauthorizedException();
    const tokens = await this.getNewTokens(payload);
    // await this.setRefreshTokenToCookie(response, tokens.refresh_token);
    // console.log('again refresh');
    return tokens;
  }

  async status(email: string) {
    if (!email) return { status: false };
    const user = await this.userService.findOne(email);
    if (!user) return { status: false };
    return { status: true, id: user.id, userName: user.userName };
  }

  private async verifyRefreshJwtToken(token: string): Promise<IJwtPayload> {
    try {
      const decoded = await this.jwtService.verifyAsync(token, {
        secret: await this.configService.get('JWT_REFRESH_SECRET'),
      });
      return decoded;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  private async getNewTokens(payload: IJwtPayload) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: await this.configService.get('JWT_SECRET'),
        expiresIn: '1h',
      }),
      this.jwtService.signAsync(payload, {
        secret: await this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    ]);
    return {
      access_token: at,
      refresh_token: rt,
    };
  }
}
