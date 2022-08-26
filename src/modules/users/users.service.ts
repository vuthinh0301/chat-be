import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User, UserDocument } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import {
  DELETED,
  ERROR_CODES,
  FORGOT_CODE_EXPIRED,
  FORGOT_CODE_NOT_EXIST,
  USER_ACTIVE_CODE_EXPIRED,
  USER_ALREADY_ACTIVE,
  USER_ALREADY_BLOCKED,
  USER_NOT_EXIST,
  WRONG_CURRENT_PASSWORD,
  WRONG_USER_OR_PASSWORD,
} from '@/constants/error-codes.constant';
import { UserStatus } from './enum/user.enum';
import { RegisterDto } from '../auth/dto/register.dto';
import { PaginationRequestFullDto } from '@/dtos/pagination-request.dto';
import { SortType } from '@/enums/sort.enum';
import { PaginationDto } from '@/dtos/pagination-response.dto';
import { Permission } from '@/modules/permissions/permissions.schema';
import { RolesService } from '@/modules/roles/roles.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import * as moment from 'moment';
import { LEARNER } from '@/constants/roles';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { USER_FORGOT_PASSWORD, USER_REGISTER } from '@/constants/events';
import { UserRegisterEvent } from '@/events/user/user-register.event';
import { UserForgotPasswordEvent } from '@/events/user/user-forgot-password.event';
import { throwBadRequest, throwNotFound } from '@/utils/exception.utils';
import { v4 as uuid } from 'uuid';
import * as pick from 'lodash.pick';
import { UpdateUserProfile } from '@/modules/users/dto/update-user-profile';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(forwardRef(() => RolesService))
    private rolesService: RolesService,
    private eventEmitter: EventEmitter2,
  ) {}

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id);

    if (!user) {
      throwNotFound(USER_NOT_EXIST);
    }

    return user;
  }

  async findByEmail(email: string) {
    const user = this.userModel.findOne({ email });

    if (!user) {
      throwNotFound(USER_NOT_EXIST);
    }

    return user;
  }

  async attempt(email: string, password: string) {
    const user = await this.userModel.findOne({ email });

    let result = {
      status: USER_NOT_EXIST,
      canReturnToken: false,
      user: null,
    };

    if (user) {
      if (user.deleted_at) {
        result = { canReturnToken: false, user, status: 'DELETED' };
      } else {
        const matchPassword = await this.comparePassword(
          password,
          user.password,
        );

        if (matchPassword) {
          if (user.status === UserStatus.active) {
            result = { canReturnToken: true, user, status: user.status };
          } else {
            result = { canReturnToken: false, user, status: user.status };
          }
        } else {
          result = {
            canReturnToken: false,
            user,
            status: WRONG_USER_OR_PASSWORD,
          };
        }
      }
    }

    return result;
  }

  async comparePassword(plainPass: string, password: string): Promise<boolean> {
    return await bcrypt.compare(plainPass, password);
  }

  async checkExist(
    key: string,
    value: string,
    userId = null,
  ): Promise<boolean> {
    const filter = {};
    filter[key] = value;

    if (userId) {
      filter['_id'] = { $ne: userId };
    }

    const user = await this.userModel.findOne(filter);

    return !!user;
  }

  async register(user: RegisterDto): Promise<User> {
    const leanerRole = await this.rolesService.findByName(LEARNER);
    const code = uuid();

    const newUser = await this.userModel.create({
      ...user,
      full_name: '',
      status: UserStatus.inactive,
      active_code: code,
      active_code_expired: moment().add(24, 'hours').valueOf(),
      role: leanerRole._id,
    });

    if (newUser) {
      this.eventEmitter.emit(
        USER_REGISTER,
        new UserRegisterEvent(newUser, code),
      );
    }

    return pick(newUser, ['_id', 'email', 'full_name', 'status']);
  }

  async activeUser(code) {
    const user = await this.userModel.findOne({ active_code: code });

    if (!user) {
      throwNotFound(USER_NOT_EXIST);
    }

    if (user.active_code_expired < moment().valueOf()) {
      throwBadRequest(USER_ACTIVE_CODE_EXPIRED);
    }

    user.active_code = null;
    user.active_code_expired = null;
    user.status = UserStatus.active;
    user.active_at = moment().valueOf();
    await user.save();

    return true;
  }

  async resendCode(email) {
    const user = await this.findByEmail(email.toLowerCase());

    if (user.status === UserStatus.active) {
      throwBadRequest(USER_ALREADY_ACTIVE);
    }

    if (user.status === UserStatus.blocked) {
      throwBadRequest(USER_ALREADY_BLOCKED);
    }

    const code = uuid();
    user.active_code = code;
    user.active_code_expired = moment().add(24, 'hours').valueOf();
    await user.save();

    return true;
  }

  async findAll(
    paginationRequestFullDto: PaginationRequestFullDto,
  ): Promise<PaginationDto<User>> {
    const filter = paginationRequestFullDto.keyword
      ? {
          email: {
            $regex: `.*${paginationRequestFullDto.keyword}.*`,
            $options: 'i',
          },
          deleted_at: {
            $exists: false,
          },
        }
      : {
          deleted_at: {
            $exists: false,
          },
        };

    const sortObj = {};
    sortObj[paginationRequestFullDto.sortBy] =
      paginationRequestFullDto.sortType === SortType.asc ? 1 : -1;

    const total = await this.userModel.countDocuments(filter);

    const users = await this.userModel
      .find(filter)
      .populate({
        path: 'role',
        select: '_id name display_name',
      })
      .sort(sortObj)
      .skip(paginationRequestFullDto.offset)
      .limit(paginationRequestFullDto.limit);

    return {
      total,
      results: users,
    };
  }

  async findAllPermissionsOfUser(
    userId: string | mongoose.Schema.Types.ObjectId,
  ): Promise<Permission[]> {
    const user = await this.userModel.findById(userId);

    if (user) {
      const permissions = await this.rolesService.findAllPermissionOfRole(
        user.role as string,
      );

      return permissions;
    }

    return [];
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException({
        message: USER_NOT_EXIST,
      });
    }

    for (const key in updateUserDto) {
      user[key] = updateUserDto[key];
    }

    await user.save();

    return user;
  }

  async updateProfile(
    id: string,
    updateUserProfile: UpdateUserProfile,
  ): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throwNotFound(USER_NOT_EXIST);
    }
    for (const key in updateUserProfile) {
      user[key] = updateUserProfile[key];
    }

    await user.save();

    return user;
  }

  async create(currentUser: User, user: CreateUserDto) {
    const newUser = await this.userModel.create({
      ...user,
      created_by: currentUser._id,
    });

    return newUser;
  }

  async changePassword(
    currentUser: User,
    changePasswordDto: ChangePasswordDto,
  ) {
    const user = await this.userModel.findById(currentUser._id);

    const matchPassword = await this.comparePassword(
      changePasswordDto.currentPassword,
      user.password,
    );
    if (!matchPassword) {
      throw new BadRequestException({
        code: WRONG_CURRENT_PASSWORD,
        message: ERROR_CODES.get(WRONG_CURRENT_PASSWORD),
      });
    }

    user.password = changePasswordDto.newPassword;
    await user.save();
  }

  async resetPasswordByAdmin(
    userId: string,
    resetPasswordDto: ResetPasswordDto,
  ) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException(USER_NOT_EXIST);
    }

    user.password = resetPasswordDto.new_password;
    await user.save();
  }

  async me(userId) {
    const user = await this.userModel.findById(userId).populate({
      path: 'role',
      select: '_id name',
      populate: {
        path: 'permissions',
        select: '-created_at -updated_at',
      },
    });

    return user;
  }

  async checkRoleInUsed(roleId): Promise<boolean> {
    const user = await this.userModel.findOne({ role: roleId });
    return !!user;
  }

  async delete(userId: string): Promise<boolean> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException(USER_NOT_EXIST);
    }

    user.deleted_at = Date.now();

    await user.save();

    return true;
  }

  async forgotPassword(email: string) {
    const filter = {
      email,
      status: UserStatus.active,
      deleted_at: {
        $exists: false,
      },
    };

    const code = uuid();
    const user = await this.userModel.findOne(filter);

    if (!user) {
      throw new NotFoundException(USER_NOT_EXIST);
    }
    user.forgot_code = code;
    user.forgot_code_expired = moment().add(24, 'hours').valueOf();

    await user.save();

    this.eventEmitter.emit(
      USER_FORGOT_PASSWORD,
      new UserForgotPasswordEvent(user, code),
    );
  }

  async checkForgotCode(code: string) {
    const user = await this.userModel.findOne({
      forgot_code: code,
    });

    if (!user) {
      throwNotFound(FORGOT_CODE_NOT_EXIST);
    }

    if (user.forgot_code_expired < moment().valueOf()) {
      throwBadRequest(FORGOT_CODE_EXPIRED);
    }

    return true;
  }

  async resetPassword(code: string, resetPasswordDto: ResetPasswordDto) {
    const user = await this.userModel.findOne({
      forgot_code: code,
    });

    if (!user) {
      throwNotFound(FORGOT_CODE_NOT_EXIST);
    }

    if (user.forgot_code_expired < moment().valueOf()) {
      throwBadRequest(FORGOT_CODE_EXPIRED);
    }

    user.forgot_code = null;
    user.forgot_code_expired = null;
    user.password = resetPasswordDto.new_password;

    await user.save();

    return true;
  }
}
