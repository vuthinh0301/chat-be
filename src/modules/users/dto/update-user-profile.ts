import { PartialType, PickType } from '@nestjs/swagger';
import { User } from '@/modules/users/user.schema';

export class UpdateUserProfile extends PartialType(
  PickType(User, [
    'phone',
    'full_name',
    'date_of_birth',
    'avatar',
    'gender',
  ] as const),
) {}
