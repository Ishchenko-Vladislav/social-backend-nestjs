import { Module } from '@nestjs/common';
import { WebsocketService } from './websocket.service';
import { WebsocketGateway } from './websocket.gateway';
import { MessageService } from 'src/conversation/message.service';
import { ConversationModule } from 'src/conversation/conversation.module';
import { ConversationService } from 'src/conversation/conversation.service';
import { ConversationEntity } from 'src/conversation/entities/conversation.entity';
import MessageEntity from 'src/conversation/entities/message.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { SubscriptionEntity } from 'src/user/entities/subscription.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ConversationEntity,
      MessageEntity,
      UserEntity,
      SubscriptionEntity,
    ]),
  ],
  providers: [
    WebsocketGateway,
    WebsocketService,
    MessageService,
    ConversationService,
    AuthService,
    UserService,
    JwtService,
    ConversationService,
  ],
})
export class WebsocketModule {}
