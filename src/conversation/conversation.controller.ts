import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
} from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { AuthenticatedRequest } from 'src/auth/types/user.request';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Server, Socket } from 'socket.io';
import { WebSocketServer } from '@nestjs/websockets';
import { EventEmitter2 } from '@nestjs/event-emitter';
@Controller('conversation')
export class ConversationController {
  @WebSocketServer()
  server: Server;
  constructor(
    private readonly conversationService: ConversationService,
    private readonly messageService: MessageService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Get('with/:userId')
  getConversationWith(
    @Param('userId') userId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.conversationService.getConversationWith(req.user.id, userId);
  }

  @Get('me')
  getConversation(
    @Req() req: AuthenticatedRequest,
    @Query('pageParam') pageParam: string,
  ) {
    return this.conversationService.getConversation(req.user.id, pageParam);
  }

  @Post('create/:id')
  createConversation(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.conversationService.create(req.user.id, id);
  }

  @Post('message/send/:conversationId')
  async sendMessage(
    @Req() req: AuthenticatedRequest,
    @Body() createMessageDto: CreateMessageDto,
    @Param('conversationId') conversationId: string,
  ) {
    const message = await this.messageService.sendMessage(
      req.user.id,
      createMessageDto,
      conversationId,
    );
    this.eventEmitter.emit('message.create', message);
    // this.server.emit('sendMessage', message);
    return;
  }

  @Get('message/:conversationId')
  getMessages(
    @Param('conversationId') conversationId: string,
    @Req() req: AuthenticatedRequest,
    @Query('skip') skip: string,
  ) {
    return this.messageService.getMessages(req.user.id, conversationId, skip);
  }

  @Get('all')
  getAllConversation() {
    return this.conversationService.getAll();
  }

  @Get(':conversationId')
  getConversationById(
    @Param('conversationId') conversationId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.conversationService.getConversationById(conversationId);
  }
}
