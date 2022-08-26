import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { PermissionsService } from '@/modules/permissions/permissions.service';

@ValidatorConstraint({ name: 'isPermissionAlreadyExist', async: false })
@Injectable()
export class IsPermissionAlreadyExist implements ValidatorConstraintInterface {
  constructor(private readonly permissionsService: PermissionsService) {}

  async validate(text: string, validationArguments: ValidationArguments) {
    // @ts-ignore
    const id = validationArguments.object.context?.params?.id;

    const result = await this.permissionsService.checkExist(text, id);
    return !result;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Permission already exists!';
  }
}
