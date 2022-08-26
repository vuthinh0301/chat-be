import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { USER_FORGOT_PASSWORD } from '@/constants/events';
import { MailService } from '@/modules/mail/mail.service';
import { UserForgotPasswordEvent } from '@/events/user/user-forgot-password.event';

@Injectable()
export class UserForgotPasswordListener {
  constructor(private mailService: MailService) {}

  @OnEvent(USER_FORGOT_PASSWORD, { async: true })
  async handleOrderCreatedEvent(payload: UserForgotPasswordEvent) {
    await this.mailService.sendUserForgotPassword(payload);
  }
}
