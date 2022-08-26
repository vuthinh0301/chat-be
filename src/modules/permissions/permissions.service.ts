import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Permission,
  PermissionDocument,
} from '@/modules/permissions/permissions.schema';
import { PaginationRequestFullDto } from '@/dtos/pagination-request.dto';
import { PaginationDto } from '@/dtos/pagination-response.dto';
import { SortType } from '@/enums/sort.enum';
import { PERMISSION_NOT_EXIST } from '@/constants/error-codes.constant';
import { CreatePermissionDto } from '@/modules/permissions/dto/create-permission.dto';
import { UpdatePermissionDto } from '@/modules/permissions/dto/update-permission.dto';
import { RolesService } from '@/modules/roles/roles.service';
import { throwNotFound } from '@/utils/exception.utils';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permission.name)
    private permissionModel: Model<PermissionDocument>,
    private rolesService: RolesService,
  ) {}

  async checkExist(name, permissionId = null) {
    const filter = { name: name };

    if (permissionId) {
      filter['_id'] = { $ne: permissionId };
    }

    const count = await this.permissionModel.countDocuments(filter);
    return count > 0;
  }

  async listAll(): Promise<PaginationDto<Permission>> {
    const total = await this.permissionModel.countDocuments();

    const permissions = await this.permissionModel.find().sort({ name: 1 });

    return {
      total,
      results: permissions,
    };
  }

  async findAll(
    paginationRequestFullDto: PaginationRequestFullDto,
  ): Promise<PaginationDto<Permission>> {
    const filter = paginationRequestFullDto.keyword
      ? {
          name: {
            $regex: `.*${paginationRequestFullDto.keyword}.*`,
            $options: 'i',
          },
        }
      : {};

    const sortObj = {};
    sortObj[paginationRequestFullDto.sortBy] =
      paginationRequestFullDto.sortType === SortType.asc ? 1 : -1;

    const total = await this.permissionModel.countDocuments(filter);

    const permissions = await this.permissionModel
      .find(filter)
      .sort(sortObj)
      .skip(paginationRequestFullDto.offset)
      .limit(paginationRequestFullDto.limit);

    return {
      total,
      results: permissions,
    };
  }

  async findById(id: string): Promise<Permission> {
    const permission = await this.permissionModel.findById(id);

    if (!permission) {
      throwNotFound(PERMISSION_NOT_EXIST);
    }

    return permission;
  }

  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    const permission = await this.permissionModel.create(createPermissionDto);

    return permission;
  }

  async update(
    permissionId: string,
    updatePermissionDto: UpdatePermissionDto,
  ): Promise<Permission> {
    const permission = await this.permissionModel.findById(permissionId);

    if (!permission) {
      throwNotFound(PERMISSION_NOT_EXIST);
    }

    const result = await this.permissionModel.findOneAndUpdate(
      { _id: permissionId },
      updatePermissionDto,
      {
        new: true,
      },
    );

    return result;
  }

  async delete(permissionId: string): Promise<boolean> {
    const permission = await this.permissionModel.findById(permissionId);

    if (!permission) {
      throwNotFound(PERMISSION_NOT_EXIST);
    }

    await this.permissionModel.deleteOne({ _id: permissionId });

    await this.rolesService.removeDeletedPermission(permissionId);

    return true;
  }
}
