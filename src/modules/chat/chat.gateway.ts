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

@Injectable()
@UseGuards(SocketJwtAuthGuard)
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(@ConnectedSocket() client: Socket, ...args: any[]): any {
    console.log('handleConnection', client);
  }

  handleDisconnect(@ConnectedSocket() client: Socket): any {
    console.log('handleDisconnect');
  }

  @SubscribeMessage('message')
  sendMessage(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    console.log(data);
    client.in(data.to).emit('message');
  }
}
