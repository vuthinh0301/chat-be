import { User } from '@/modules/users/user.schema';

export class UserForgotPasswordEvent {
  user: User;
  code: string;

  constructor(user, code) {
    this.user = user;
    this.code = code;
  }
}
