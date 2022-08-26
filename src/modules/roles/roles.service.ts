import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, RoleDocument } from '@/modules/roles/roles.schema';
import { Permission } from '@/modules/permissions/permissions.schema';
import * as mongoose from 'mongoose';
import { ROLE_NOT_EXIST } from '@/constants/error-codes.constant';
import { PaginationRequestFullDto } from '@/dtos/pagination-request.dto';
import { PaginationDto } from '@/dtos/pagination-response.dto';
import { SortType } from '@/enums/sort.enum';
import { CreateRoleDto } from '@/modules/roles/dto/create-role.dto';
import { UpdateRoleDto } from '@/modules/roles/dto/update-role.dto';
import { UsersService } from '@/modules/users/users.service';
import {
  throwDataReferenceException,
  throwNotFound,
} from '@/utils/exception.utils';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name)
    private roleModel: Model<RoleDocument>,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
  ) {}

  async findAllPermissionOfRole(
    roleId: string | mongoose.Schema.Types.ObjectId,
  ): Promise<Permission[]> {
    const role = await this.roleModel.findOne({ _id: roleId }).populate({
      path: 'permissions',
      select: '_id name display_name object condition action',
    });

    if (role) {
      return role.permissions as Permission[];
    }

    return [];
  }

  async removeDeletedPermission(permissionId: string) {
    await this.roleModel.updateMany(
      { permissions: permissionId },
      {
        $pullAll: {
          permissions: [permissionId],
        },
      },
    );
  }

  async checkExist(name, roleId = null) {
    const filter = { name: name };

    if (roleId) {
      filter['_id'] = { $ne: roleId };
    }

    const count = await this.roleModel.countDocuments(filter);
    return count > 0;
  }

  async findAll(
    paginationRequestFullDto: PaginationRequestFullDto,
  ): Promise<PaginationDto<Role>> {
    const filter = paginationRequestFullDto.keyword
      ? {
          $or: [
            { name: { $regex: `.*${paginationRequestFullDto.keyword}.*` } },
            {
              display_name: {
                $regex: `.*${paginationRequestFullDto.keyword}.*`,
              },
            },
          ],
        }
      : {};

    const sortObj = {};
    sortObj[paginationRequestFullDto.sortBy] =
      paginationRequestFullDto.sortType === SortType.asc ? 1 : -1;

    const total = await this.roleModel.countDocuments(filter);

    const roles = await this.roleModel
      .find(filter)
      .sort(sortObj)
      .skip(paginationRequestFullDto.offset)
      .limit(paginationRequestFullDto.limit);

    return {
      total,
      results: roles,
    };
  }

  async findById(id: string): Promise<Role> {
    const role = await this.roleModel.findById(id);

    if (!role) {
      throwNotFound(ROLE_NOT_EXIST);
    }

    return role;
  }

  async findByName(name: string): Promise<Role> {
    const role = await this.roleModel.findOne({ name });

    if (!role) {
      throwNotFound(ROLE_NOT_EXIST);
    }

    return role;
  }

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const role = await this.roleModel.create(createRoleDto);

    return role;
  }

  async update(roleId: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.roleModel.findById(roleId);

    if (!role) {
      throwNotFound(ROLE_NOT_EXIST);
    }

    const result = await this.roleModel.findOneAndUpdate(
      { _id: roleId },
      updateRoleDto,
      {
        new: true,
      },
    );

    return result;
  }

  async delete(roleId: string): Promise<boolean> {
    const role = await this.roleModel.findById(roleId);

    if (!role) {
      throwNotFound(ROLE_NOT_EXIST);
    }

    const isRoleInUsed = await this.usersService.checkRoleInUsed(roleId);

    if (isRoleInUsed) {
      throwDataReferenceException();
    }

    await this.roleModel.deleteOne({ _id: roleId });

    return true;
  }
}
