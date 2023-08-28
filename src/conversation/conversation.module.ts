import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationEntity } from './entities/conversation.entity';
import MessageEntity from './entities/message.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { MessageService } from './message.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConversationEntity, MessageEntity, UserEntity]),
  ],
  controllers: [ConversationController],
  providers: [ConversationService, MessageService],
})
export class ConversationModule {}
