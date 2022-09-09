import { IsNotEmpty, IsEmail, Validate, IsString } from 'class-validator';
import { PickType } from '@nestjs/swagger';
import { User } from 'src/modules/users/user.schema';
import { IsUserAlreadyExist } from '../validation/is-user-already-exist';

export class CreateUserDto extends PickType(User, [
  'phone',
  'email',
  'password',
  'full_name',
  'status',
  'date_of_birth',
] as const) {
  @IsNotEmpty()
  @IsString()
  @Validate(IsUserAlreadyExist)
  phone: string;

  @IsNotEmpty()
  @IsEmail()
  @Validate(IsUserAlreadyExist)
  email: string;
}
