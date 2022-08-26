import { IsNotEmpty, IsEmail, Validate } from 'class-validator';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsUserAlreadyExist } from './validation/is-user-already-exist';
import { User } from '@/modules/users/user.schema';

export class RegisterDto extends PickType(User, ['password']) {
  @IsNotEmpty()
  @IsEmail()
  @Validate(IsUserAlreadyExist)
  @ApiProperty()
  email: string;
}
