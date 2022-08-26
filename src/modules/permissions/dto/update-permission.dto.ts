import { ApiProperty, PickType } from '@nestjs/swagger';
import { Permission } from '@/modules/permissions/permissions.schema';
import { Allow, IsNotEmpty, IsString, Validate } from 'class-validator';
import { RequestContext } from '@/dtos/request-context';
import { IsPermissionAlreadyExist } from '@/modules/permissions/dto/validation/is-permission-already-exist';
import { Prop } from '@nestjs/mongoose';

export class UpdatePermissionDto extends PickType(Permission, [
  'action',
  'condition',
  'fields',
  'object',
] as const) {
  @Allow()
  context?: RequestContext;

  @Validate(IsPermissionAlreadyExist)
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;
}
