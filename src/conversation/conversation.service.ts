import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { Repository } from 'typeorm';
import { ConversationEntity } from './entities/conversation.entity';
import MessageEntity from './entities/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(ConversationEntity)
    private readonly conversationRepository: Repository<ConversationEntity>,
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(currentUserId: string, recipientId: string) {
    const recipient = await this.userRepository.findOne({
      where: { id: recipientId },
    });

    if (!recipient) throw new BadRequestException('No such user exists');

    const conversationExist = await this.conservationExist(
      currentUserId,
      recipientId,
    );

    if (conversationExist)
      throw new BadRequestException('This chat already exists');

    const conversation = await this.conversationRepository.save({
      users: [
        {
          id: currentUserId,
        },
        {
          id: recipientId,
        },
      ],
      type: 'private',
    });
    return conversation;
  }

  async getConversation(userId: string, pageParam: string) {
    // const conversation = await this.conversationRepository
    //   .createQueryBuilder('conversation')
    //   .leftJoinAndSelect('conversation.users', 'user')
    //   .where('user.id = :creatorId', { creatorId: id })
    //   .getMany();
    const limit = 30;
    const currentPage = +pageParam;
    const skip = currentPage * limit;
    const conversation = await this.conversationRepository
      .createQueryBuilder('conversation')
      .innerJoin('conversation.users', 'user', 'user.id = :userId', {
        userId: userId,
      })
      .leftJoinAndSelect('conversation.users', 'users')
      .leftJoinAndSelect('conversation.lastMessageSent', 'lastMessageSent')
      .orderBy('conversation.updatedAt', 'DESC')
      .take(limit)
      .skip(skip)
      .getMany();

    return conversation;
  }

  async getConversationById(conversationId: string) {
    // const conversation = await this.conversationRepository
    //   .createQueryBuilder('conversation')
    //   .leftJoinAndSelect('conversation.users', 'users')
    //   .where('users.id IN (:creatorId, :recipientId)', {
    //     creatorId: currentUserId,
    //     recipientId,
    //   })
    //   .andWhere('conversation.type = :type', { type: 'private' })
    //   .having('COUNT(DISTINCT users.id) = 2')
    //   .getMany();
    const conversation = await this.conversationRepository
      .createQueryBuilder('con')
      .leftJoinAndSelect('con.users', 'users')
      .leftJoinAndSelect('con.lastMessageSent', 'lastMessageSent')
      .where('con.id = :conversationId', { conversationId })
      .getOne();
    if (!conversation)
      return new BadRequestException('this conversation does not exist');
    return conversation;
  }
  async getConversationWith(currentUserId: string, recipientId: string) {
    // const conversation = await this.conversationRepository
    //   .createQueryBuilder('conversation')
    //   .leftJoinAndSelect('conversation.users', 'users')
    //   .where('users.id IN (:creatorId, :recipientId)', {
    //     creatorId: currentUserId,
    //     recipientId,
    //   })
    //   .andWhere('conversation.type = :type', { type: 'private' })
    //   .having('COUNT(DISTINCT users.id) = 2')
    //   .getMany();
    const conversation = await this.conservationExist(
      currentUserId,
      recipientId,
    );

    if (!conversation)
      throw new BadRequestException('This chat does not exist');

    return conversation;
  }

  private async conservationExist(currentUserId: string, recipientId: string) {
    return await this.conversationRepository
      .createQueryBuilder('conversation')
      .innerJoin('conversation.users', 'user1', 'user1.id = :userId1', {
        userId1: currentUserId,
      })
      .innerJoin('conversation.users', 'user2', 'user2.id = :userId2', {
        userId2: recipientId,
      })
      .where('conversation.type = :type', { type: 'private' })
      .leftJoinAndSelect('conversation.users', 'users')
      .leftJoinAndSelect('conversation.messages', 'messages')
      .getOne();
  }

  async getAll() {
    const conv = await this.conversationRepository.find({
      relations: { users: true },
    });
    return conv;
  }
}
