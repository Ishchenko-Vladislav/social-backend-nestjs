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

    const msg = await this.messageRepository
      .createQueryBuilder('msg')
      .leftJoinAndSelect('msg.attachment', 'attach')
      .leftJoinAndSelect('msg.user', 'user')
      .leftJoinAndSelect('msg.conversation', 'conversation')
      .where('msg.id = :messageId', {
        messageId: message.id,
      })
      .getOne();
    return msg;
  }

  async getMessages(userId: string, conversationId: string, skip: string) {
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId, users: { id: userId } },
    });
    if (!conversation) throw new BadRequestException('You cannot access');
    // return conversation;
    const limit = 20;
    // const currentPage = +pageParam;
    // const skip = currentPage * limit;

    const messages = await this.messageRepository
      .createQueryBuilder('msg')
      .leftJoinAndSelect('msg.attachment', 'attach')
      .leftJoinAndSelect('msg.user', 'user')
      .leftJoinAndSelect('msg.conversation', 'conversation')
      .where('conversation.id = :conversationId', {
        conversationId: conversationId,
      })
      .orderBy('msg.createdAt', 'DESC')
      .take(limit)
      .skip(+skip)
      .getMany();
    // const messages = await this.messageRepository.find({
    //   where: { conversation: { id: conversationId } },
    //   relations: {
    //     attachment: true,
    //     user: true,
    //   },

    // });
    return messages;
  }
}
