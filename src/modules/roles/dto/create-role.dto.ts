import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Validate } from 'class-validator';
import { IsRoleAlreadyExist } from '@/modules/roles/dto/validation/is-role-already-exist';
import { Role } from '@/modules/roles/roles.schema';

export class CreateRoleDto extends PickType(Role, [
  'display_name',
  'permissions',
  'status',
] as const) {
  @Validate(IsRoleAlreadyExist)
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;
}
