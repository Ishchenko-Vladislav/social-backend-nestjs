import { Injectable } from '@nestjs/common';
import { CreateWebsocketDto } from './dto/create-websocket.dto';
import { UpdateWebsocketDto } from './dto/update-websocket.dto';
import { MessageService } from 'src/conversation/message.service';

@Injectable()
export class WebsocketService {
  constructor(private messageService: MessageService) {}

  async markAsRead(messageId: string) {
    return await this.messageService.markAsReadMessage(messageId);
  }
  create(createWebsocketDto: CreateWebsocketDto) {
    return 'This action adds a new websocket';
  }

  findAll() {
    return `This action returns all websocket`;
  }

  findOne(id: number) {
    return `This action returns a #${id} websocket`;
  }

  update(id: number, updateWebsocketDto: UpdateWebsocketDto) {
    return `This action updates a #${id} websocket`;
  }

  remove(id: number) {
    return `This action removes a #${id} websocket`;
  }
}
