import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { UserRegisterEvent } from '@/events/user/user-register.event';
import { ConfigService } from '@nestjs/config';
import { UserForgotPasswordEvent } from '@/events/user/user-forgot-password.event';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async sendUserConfirmation(payload: UserRegisterEvent) {
    try {
      await this.mailerService.sendMail({
        to: payload.user.email,
        subject: 'Chào mừng bạn đến với EduVR! Hãy xác thực tài khoản của bạn!',
        template: __dirname + '/templates/confirmation',
        context: {
          user: payload.user,
          link:
            this.configService.get('WEB_URL') +
            '/active-account/' +
            payload.code,
        },
      });
      console.log('sendUserConfirmation success');
    } catch (e) {
      console.log('sendUserConfirmation error', e);
    }
  }

  async sendUserForgotPassword(payload: UserForgotPasswordEvent) {
    try {
      await this.mailerService.sendMail({
        to: payload.user.email,
        subject: 'Liên kết đặt lại mật khẩu của bạn',
        template: __dirname + '/templates/forgotPassword',
        context: {
          user: payload.user,
          link:
            this.configService.get('WEB_URL') +
            '/forgot-password/' +
            payload.code,
        },
      });
      console.log('sendUserForgotPassword success');
    } catch (e) {
      console.log('sendUserForgotPassword error', e);
    }
  }
}
