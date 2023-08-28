import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import MessageEntity from './entities/message.entity';
import { Repository } from 'typeorm';
import { ConversationEntity } from './entities/conversation.entity';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(ConversationEntity)
    private readonly conversationRepository: Repository<ConversationEntity>,
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
  ) {}

  async sendMessage(
    currentUserId: string,
    createMessageDto: CreateMessageDto,
    conversationId: string,
  ) {
    if (!conversationId) throw new BadRequestException();

    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId, users: { id: currentUserId } },
    });

    if (!conversation) throw new BadRequestException();

    const message = await this.messageRepository.save({
      content: createMessageDto.content,
      conversation: { id: conversationId },
      user: { id: currentUserId },
    });

    conversation.lastMessageSent = message;
    await this.conversationRepository.save(conversation);
    return message;
  }

  async getMessages(id: string, conversationId: string) {
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId, users: { id } },
    });
    if (!conversation) throw new BadRequestException('You cannot access');
    // return conversation;

    const messages = await this.messageRepository.find({
      where: { conversation: { id: conversationId } },
    });
    return messages;
  }
}
