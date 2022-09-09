import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { User } from './user.schema';
import {
  PaginationDto,
  PaginationResponse,
} from '@/dtos/pagination-response.dto';
import { PaginationRequestFullDto } from '@/dtos/pagination-request.dto';
import {
  AuthApiError,
  PublicApiError,
} from '@/decorators/api-error-response.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Public } from '@/decorators/public.decorator';
import { ActiveCodeDto } from '@/modules/users/dto/active-code.dto';
import { ErrorCodeResponse } from '@/dtos/error-code-response.dto';
import {
  FORGOT_CODE_EXPIRED,
  USER_ACTIVE_CODE_EXPIRED,
  USER_ALREADY_ACTIVE,
  USER_ALREADY_BLOCKED,
} from '@/constants/error-codes.constant';
import { ResendActiveCodeDto } from '@/modules/users/dto/resend-active-code.dto';
import { IdRequestDto } from '@/dtos/id-request.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateUserProfile } from '@/modules/users/dto/update-user-profile';
import { ForgotCodeDto } from './dto/forgot-code.dto';

@ApiExtraModels(PaginationDto)
@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @AuthApiError()
  @ApiOperation({ summary: 'Fetch me' })
  @Get('me')
  async me(@Request() req) {
    return await this.usersService.me(req.user._id);
  }

  @PaginationResponse(User)
  @ApiOperation({ summary: 'User list with filter' })
  @AuthApiError()
  @Get()
  async findAll(
    @Query() queries: PaginationRequestFullDto,
  ): Promise<PaginationDto<User>> {
    const data = await this.usersService.findAll(queries);

    return data;
  }

  @ApiOkResponse({ type: User })
  @ApiOperation({ summary: 'Get a user' })
  @AuthApiError()
  @ApiOperation({ summary: 'Get a user' })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    const data = await this.usersService.findById(id);

    return data;
  }

  @ApiOkResponse({ type: User })
  @AuthApiError()
  @ApiOperation({ summary: 'Update a user profile' })
  @Patch('update-profile')
  async updateUserProfile(
    @Request() req,
    @Body() updateUserProfile: UpdateUserProfile,
  ) {
    const data = await this.usersService.updateProfile(
      req.user._id.toString(),
      updateUserProfile,
    );
    return data;
  }

  @ApiOkResponse({ type: User })
  @AuthApiError()
  @ApiOperation({ summary: 'Update a user' })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const data = await this.usersService.update(id, updateUserDto);

    return data;
  }

  @ApiCreatedResponse({ type: User })
  @ApiOperation({ summary: 'Create a user' })
  @AuthApiError()
  @Post()
  async create(@Request() req, @Body() user: CreateUserDto) {
    console.log(req.user);
    const data = await this.usersService.create(req.user, user);
    return data;
  }

  @ApiNoContentResponse()
  @AuthApiError()
  @ApiOperation({ summary: 'Change password' })
  @Post('change-my-password')
  async changePassword(
    @Request() req,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    await this.usersService.changePassword(req.user, changePasswordDto);
  }

  @ApiNoContentResponse()
  @AuthApiError()
  @ApiOperation({ summary: 'Reset password' })
  @Post(':id/reset-password')
  async resetPasswordByAdmin(
    @Param() idRequestDto: IdRequestDto,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    await this.usersService.resetPasswordByAdmin(
      idRequestDto.id,
      resetPasswordDto,
    );
  }

  @Public()
  @ErrorCodeResponse(USER_ACTIVE_CODE_EXPIRED)
  @PublicApiError()
  @ApiOperation({ summary: 'Active account with code' })
  @Post('active-code')
  async activeCode(@Body() activeCode: ActiveCodeDto) {
    const data = await this.usersService.activeUser(activeCode.code);

    return { data };
  }

  @Public()
  @ErrorCodeResponse(USER_ALREADY_BLOCKED, USER_ALREADY_ACTIVE)
  @PublicApiError()
  @ApiOperation({ summary: 'Active account with code' })
  @Post('resend-active-code')
  async resendActiveCode(@Body() resendActiveCodeDto: ResendActiveCodeDto) {
    const data = await this.usersService.resendCode(resendActiveCodeDto.email);

    return { data };
  }

  @ApiNoContentResponse()
  @ApiOperation({ summary: 'Delete a user' })
  @AuthApiError()
  @Delete(':id')
  async delete(@Param() idRequestDto: IdRequestDto) {
    await this.usersService.delete(idRequestDto.id);
  }

  @Public()
  @PublicApiError()
  @ErrorCodeResponse(FORGOT_CODE_EXPIRED)
  @ApiOperation({ summary: 'Forgot password' })
  @Post('forgot-password')
  async forgotPassword(@Body() forgotCodeDto: ForgotCodeDto) {
    const data = await this.usersService.checkForgotCode(forgotCodeDto.code);

    return { data };
  }

  @Public()
  @PublicApiError()
  @ErrorCodeResponse(FORGOT_CODE_EXPIRED)
  @ApiOperation({ summary: 'Reset password' })
  @Post('reset-password/:code')
  async resetPassword(
    @Param() forgotCodeDto: ForgotCodeDto,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    const data = await this.usersService.resetPassword(
      forgotCodeDto.code,
      resetPasswordDto,
    );

    return { data };
  }
}
