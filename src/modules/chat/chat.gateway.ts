import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, UseGuards } from '@nestjs/common';
import { SocketJwtAuthGuard } from '@/modules/auth/socket-jwt-auth.guard';
import { MessagesService } from '@/modules/messages/messages.service';
import { ConversationsService } from '@/modules/conversations/conversations.service';

@Injectable()
@UseGuards(SocketJwtAuthGuard)
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private messagesService: MessagesService,
    private conversationsService: ConversationsService,
  ) {}
  @WebSocketServer()
  server: Server;

  handleConnection(@ConnectedSocket() client: Socket, ...args: any[]): any {
    // console.log('handleConnection', client);
    // const conversations = this.conversationsService.findAll();
    console.log('handleConnection');
  }

  handleDisconnect(@ConnectedSocket() client: Socket): any {
    console.log('handleDisconnect');
  }

  @SubscribeMessage('message')
  async sendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    const createMessage = (({ conversation, type, content }) => ({
      conversation,
      type,
      content,
    }))(data);
    const message = await this.messagesService.create(
      data.user._id,
      createMessage,
    );
    client.to(createMessage.conversation).emit('message', message);
    // client.in(createMessage.conversation).emit('message');
  }

  @SubscribeMessage('join')
  async joinRoom(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    client.join(data.conversation);
  }
}
