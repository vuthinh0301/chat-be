import { ApiProperty, PickType } from '@nestjs/swagger';
import { Permission } from '@/modules/permissions/permissions.schema';
import { IsNotEmpty, IsString, Validate } from 'class-validator';
import { IsPermissionAlreadyExist } from '@/modules/permissions/dto/validation/is-permission-already-exist';

export class CreatePermissionDto extends PickType(Permission, [
  'action',
  'condition',
  'fields',
  'object',
] as const) {
  @Validate(IsPermissionAlreadyExist)
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;
}
