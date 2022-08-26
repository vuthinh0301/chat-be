import { ApiProperty, PickType } from '@nestjs/swagger';
import { Allow, IsNotEmpty, IsString, Validate } from 'class-validator';
import { RequestContext } from '@/dtos/request-context';
import { Role } from '@/modules/roles/roles.schema';
import { IsRoleAlreadyExist } from '@/modules/roles/dto/validation/is-role-already-exist';

export class UpdateRoleDto extends PickType(Role, [
  'display_name',
  'permissions',
  'status',
] as const) {
  @Allow()
  context?: RequestContext;

  @Validate(IsRoleAlreadyExist)
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;
}
