import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { WebsocketService } from './websocket.service';
import { CreateWebsocketDto } from './dto/create-websocket.dto';
import { UpdateWebsocketDto } from './dto/update-websocket.dto';
import { Server, Socket } from 'socket.io';
import MessageEntity from 'src/conversation/entities/message.entity';
import { OnEvent } from '@nestjs/event-emitter';
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class WebsocketGateway implements OnGatewayConnection {
  handleConnection(client: any, ...args: any[]) {
    console.log(client);
  }
  @WebSocketServer()
  server: Server;
  constructor(private readonly websocketService: WebsocketService) {}

  @OnEvent('message.create')
  handleMessageCreateEvent(message: MessageEntity) {
    console.log('NEW MESSAGE HAHA', message);
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
