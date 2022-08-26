import { User } from '@/modules/users/user.schema';

export class UserRegisterEvent {
  user: User;
  code: string;

  constructor(user, code) {
    this.user = user;
    this.code = code;
  }
}
