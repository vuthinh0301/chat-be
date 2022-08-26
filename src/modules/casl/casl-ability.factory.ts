import { Ability } from '@casl/ability';
import { User } from '@/modules/users/user.schema';
import { PermissionAction } from '@/enums/permission-action.enum';
import { Injectable } from '@nestjs/common';
import { UsersService } from '@/modules/users/users.service';

export type PermissionObjectType = any;
export type AppAbility = Ability<[PermissionAction, PermissionObjectType]>;
interface CaslPermission {
  action: PermissionAction;
  subject: string;
}
@Injectable()
export class CaslAbilityFactory {
  constructor(private usersService: UsersService) {}

  async createForUser(user: User) {
    const permissions = await this.usersService.findAllPermissionsOfUser(
      user._id,
    );

    const caslPermissions: CaslPermission[] = permissions.map((p) => ({
      action: p.action,
      subject: p.object,
    }));

    return new Ability<[PermissionAction, PermissionObjectType]>(
      caslPermissions,
    );
  }
}
