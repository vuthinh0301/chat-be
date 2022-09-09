import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { MessagesModule } from '@/modules/messages/messages.module';
import { ConversationsModule } from '@/modules/conversations/conversations.module';

@Module({
  imports: [MessagesModule, ConversationsModule],
  providers: [ChatGateway],
})
export class ChatModule {}
