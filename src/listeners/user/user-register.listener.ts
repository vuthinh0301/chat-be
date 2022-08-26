import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { USER_REGISTER } from '@/constants/events';
import { UserRegisterEvent } from '@/events/user/user-register.event';
import { MailService } from '@/modules/mail/mail.service';

@Injectable()
export class UserRegisterListener {
  constructor(private mailService: MailService) {}

  @OnEvent(USER_REGISTER, { async: true })
  async handleUserRegisterEvent(payload: UserRegisterEvent) {
    await this.mailService.sendUserConfirmation(payload);
  }
}
