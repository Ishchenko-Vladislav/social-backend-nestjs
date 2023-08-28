import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { AuthenticatedRequest } from 'src/auth/types/user.request';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('conversation')
export class ConversationController {
  constructor(
    private readonly conversationService: ConversationService,
    private readonly messageService: MessageService,
  ) {}

  @Get('with/:userId')
  getConversationById(
    @Param('userId') userId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.conversationService.getConversationById(req.user.id, userId);
  }

  @Get('me')
  getConversation(@Req() req: AuthenticatedRequest) {
    return this.conversationService.getConversation(req.user.id);
  }

  @Post('create/:id')
  createConversation(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.conversationService.create(req.user.id, id);
  }

  @Post('message/send/:conversationId')
  sendMessage(
    @Req() req: AuthenticatedRequest,
    @Body() createMessageDto: CreateMessageDto,
    @Param('conversationId') conversationId: string,
  ) {
    return this.messageService.sendMessage(
      req.user.id,
      createMessageDto,
      conversationId,
    );
  }

  @Get('message/:conversationId')
  getMessages(
    @Param('conversationId') conversationId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.messageService.getMessages(req.user.id, conversationId);
  }

  @Get('all')
  getAllConversation() {
    return this.conversationService.getAll();
  }
}
