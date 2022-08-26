import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { RolesService } from '@/modules/roles/roles.service';

@ValidatorConstraint({ name: 'isRoleAlreadyExist', async: false })
@Injectable()
export class IsRoleAlreadyExist implements ValidatorConstraintInterface {
  constructor(private readonly rolesService: RolesService) {}

  async validate(text: string, validationArguments: ValidationArguments) {
    // @ts-ignore
    const id = validationArguments.object.context?.params?.id;

    const result = await this.rolesService.checkExist(text, id);
    return !result;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Role already exists!';
  }
}
