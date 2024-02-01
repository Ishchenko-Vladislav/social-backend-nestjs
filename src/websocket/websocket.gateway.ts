import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  ConnectedSocket,
} from '@nestjs/websockets';
import { WebsocketService } from './websocket.service';
import { CreateWebsocketDto } from './dto/create-websocket.dto';
import { UpdateWebsocketDto } from './dto/update-websocket.dto';
import { Server, Socket } from 'socket.io';
import MessageEntity from 'src/conversation/entities/message.entity';
import { OnEvent } from '@nestjs/event-emitter';
// import { InjectRedis } from '@nestjs-modules/ioredis';
// import { Redis } from 'ioredis';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';
import { ConversationService } from 'src/conversation/conversation.service';
import { ConversationEntity } from 'src/conversation/entities/conversation.entity';
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class WebsocketGateway implements OnGatewayConnection {
  constructor(
    private readonly websocketService: WebsocketService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly conversationService: ConversationService,
  ) {}

  users: Map<string, Socket> = new Map();
  keys: Map<string, any> = new Map();

  async handleConnection(client: Socket, ...args: any[]) {
    // console.log(client);
    // const o = client.handshake.headers.authorization;
    // console.log('PATYLOAD ss', o);
    // const token = client.handshake.headers.authorization;
    // if (!token) return client.disconnect();
    // const payload = await this.authService.verifyAccessJwtToken(token);
    // const user = await this.userService.findOne(payload.email);
    // console.log('PAYLOAD s', user);

    // !user && client.disconnect();
    // this.users.set(client.id, {
    //   userId: user.id,
    //   socket: client,
    // });
    // console.log('i connected', this.users);

    client.emit('connected', { status: 'good' });
    // console.log('I CONNECTED', client.id);
  }
  handleDisconnect(client: Socket) {
    // this.logger.log(`lient disconnected ${client.id}`)
    // console.log('I DISCONNECTED');
    // this.users.delete(client.id);
    const key = this.keys.get(client.id);
    this.users.delete(key);
    this.keys.delete(client.id);

    // this.users.has
  }

  @WebSocketServer()
  server: Server;

  @OnEvent('message.create')
  async handleMessageCreateEvent(message: MessageEntity) {
    // console.log('NEW MESSAGE HAHA', message);
    const conversation = await this.conversationService.conversationById(
      message.conversation.id,
    );

    conversation.users.map((user) => {
      const client = this.users.get(user.id);
      if (client) {
        client.emit('onMessage', message);
      }
    });
    // this.server.emit('onMessage', message);
    // await this.redis.set(clientId, JSON.stringify(client));
  }

  @SubscribeMessage('message.read')
  async handleReadMessage(@MessageBody() message: MessageEntity) {
    // console.log('NOW NEW READED MESSAGE', message);
    await this.websocketService.markAsRead(message.id);
    const conversation = await this.conversationService.conversationById(
      message.conversation.id,
    );

    conversation.users.map((user) => {
      const client = this.users.get(user.id);
      if (client) {
        client.emit('onread', message);
      }
    });
    // return {
    //   read: true,
    // };
    // console.log('NEW MESSAGE HAHA', message);
    // this.server.emit('onMessage', message);
  }
  @SubscribeMessage('message.room')
  async handleRoom(
    @MessageBody() clientId: string,
    @ConnectedSocket() client: Socket,
  ) {
    // console.log('NOW NEW READED MESSAGE', message);
    // await this.websocketService.markAsRead(message.id);
    // return {
    //   read: true,
    // };
    // console.log('NEW MESSAGE HAHA', message);
    // this.server.emit('onMessage', message);
  }
  @SubscribeMessage('join')
  async join(@MessageBody() userId: string, @ConnectedSocket() client: Socket) {
    // this.users.set(client.id, {
    //   userId,
    //   socket: client,
    // });
    this.users.set(userId, client);
    this.keys.set(client.id, userId);
    // console.log('this.users s', this.users, this.keys);
    // const key = JSON.stringify({
    //   userId:
    // })
    // this.redis.set(client.id,)
  }
  // @SubscribeMessage('createWebsocket')
  // create(@MessageBody() createWebsocketDto: CreateWebsocketDto) {
  //   return this.websocketService.create(createWebsocketDto);
  // }
  // @SubscribeMessage('sendMessage')
  // sendMessage(@MessageBody() message: MessageEntity) {
  //   console.log('HERE NEW MESSAGE', message.content);
  //   // return this.websocketService.create(createWebsocketDto);
  // }

  // @SubscribeMessage('findAllWebsocket')
  // findAll() {
  //   return this.websocketService.findAll();
  // }

  // @SubscribeMessage('findOneWebsocket')
  // findOne(@MessageBody() id: number) {
  //   return this.websocketService.findOne(id);
  // }

  // @SubscribeMessage('updateWebsocket')
  // update(@MessageBody() updateWebsocketDto: UpdateWebsocketDto) {
  //   return this.websocketService.update(
  //     updateWebsocketDto.id,
  //     updateWebsocketDto,
  //   );
  // }

  @SubscribeMessage('removeWebsocket')
  remove(@MessageBody() id: number) {
    return this.websocketService.remove(id);
  }
}
