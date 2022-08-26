import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PermissionsService } from '@/modules/permissions/permissions.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  PaginationDto,
  PaginationResponse,
} from '@/dtos/pagination-response.dto';
import { PoliciesGuard } from '@/guards/policies.guard';
import { CheckPermissions } from '@/decorators/check-policies.decorator';
import { PermissionAction } from '@/enums/permission-action.enum';
import { AuthApiError } from '@/decorators/api-error-response.decorator';
import { PaginationRequestFullDto } from '@/dtos/pagination-request.dto';
import { Permission } from '@/modules/permissions/permissions.schema';
import { IdRequestDto } from '@/dtos/id-request.dto';
import { CreatePermissionDto } from '@/modules/permissions/dto/create-permission.dto';
import { UpdatePermissionDto } from '@/modules/permissions/dto/update-permission.dto';

@ApiExtraModels(PaginationDto)
@ApiBearerAuth()
@ApiTags('Permissions')
@Controller('permissions')
export class PermissionsController {
  constructor(private permissionsService: PermissionsService) {}

  @UseGuards(PoliciesGuard)
  @CheckPermissions([PermissionAction.Read, Permission.name])
  @PaginationResponse(Permission)
  @ApiOperation({ summary: 'Permission list with filter' })
  @AuthApiError()
  @Get()
  async findAll(
    @Query() queries: PaginationRequestFullDto,
  ): Promise<PaginationDto<Permission>> {
    const data = await this.permissionsService.findAll(queries);

    return data;
  }

  @UseGuards(PoliciesGuard)
  @CheckPermissions([PermissionAction.Read, Permission.name])
  @PaginationResponse(Permission)
  @ApiOperation({ summary: 'All permission' })
  @AuthApiError()
  @Get('/all')
  async all(): Promise<PaginationDto<Permission>> {
    const data = await this.permissionsService.listAll();

    return data;
  }

  @UseGuards(PoliciesGuard)
  @CheckPermissions([PermissionAction.Read, Permission.name])
  @ApiOperation({ summary: 'Get detail permission' })
  @AuthApiError()
  @ApiOkResponse({ type: Permission })
  @Get(':id')
  async getDetail(@Param() idRequestDto: IdRequestDto): Promise<Permission> {
    const data = await this.permissionsService.findById(idRequestDto.id);

    return data;
  }

  @UseGuards(PoliciesGuard)
  @CheckPermissions([PermissionAction.Create, Permission.name])
  @ApiOperation({ summary: 'Create permission' })
  @AuthApiError()
  @ApiCreatedResponse({ type: Permission })
  @Post()
  async create(
    @Body() createPermissionDto: CreatePermissionDto,
  ): Promise<Permission> {
    const data = await this.permissionsService.create(createPermissionDto);

    return data;
  }

  @UseGuards(PoliciesGuard)
  @CheckPermissions([PermissionAction.Update, Permission.name])
  @ApiOperation({ summary: 'Update a permission' })
  @AuthApiError()
  @ApiCreatedResponse({ type: Permission })
  @Patch(':id')
  async update(
    @Param() idRequestDto: IdRequestDto,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ): Promise<Permission> {
    const data = await this.permissionsService.update(
      idRequestDto.id,
      updatePermissionDto,
    );

    return data;
  }

  @UseGuards(PoliciesGuard)
  @CheckPermissions([PermissionAction.Delete, Permission.name])
  @ApiOperation({ summary: 'Delete a permission' })
  @AuthApiError()
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Delete success' })
  @Delete(':id')
  async delete(@Param() idRequestDto: IdRequestDto) {
    await this.permissionsService.delete(idRequestDto.id);
  }
}
