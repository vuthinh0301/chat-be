import { Module } from '@nestjs/common';
import { UserForgotPasswordListener } from './user/user-forgot-password.listener';
import { UserRegisterListener } from './user/user-register.listener';
import { MessageCreateListener } from '@/listeners/message/message-create.listeners';
import { ConversationsModule } from '@/modules/conversations/conversations.module';

@Module({
  imports: [ConversationsModule],
  providers: [
    UserRegisterListener,
    UserForgotPasswordListener,
    MessageCreateListener,
  ],
})
export class ListenersModule {}
