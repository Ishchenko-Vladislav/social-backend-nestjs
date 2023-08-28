import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Request,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Public } from 'src/constants/constants';
import { AuthenticatedRequest } from 'src/auth/types/user.request';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Post()
  // // @UsePipes(new ValidationPipe())
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.userService.create(createUserDto);
  // }
  @Post('subscribe/:recipientId')
  subscribeToUser(
    @Req() req: AuthenticatedRequest,
    @Param('recipientId') recipientId: string,
  ) {
    return this.userService.subscribeToUser(req.user.id, recipientId);
  }

  // @UseGuards(JwtAuthGuard)
  @Get('profile')
  // @Public()
  getProfile(@Request() req) {
    // return req.user;
    return this.userService.findOne(req.user.email);
  }

  @Get('all')
  getAllUser() {
    return this.userService.allUser();
  }
}
