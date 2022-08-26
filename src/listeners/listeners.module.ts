import { Module } from '@nestjs/common';
import { UserForgotPasswordListener } from './user/user-forgot-password.listener';
import { UserRegisterListener } from './user/user-register.listener';

@Module({
  imports: [],
  providers: [UserRegisterListener, UserForgotPasswordListener],
})
export class ListenersModule {}
