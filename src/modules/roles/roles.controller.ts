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
import { RolesService } from '@/modules/roles/roles.service';
import { PoliciesGuard } from '@/guards/policies.guard';
import { CheckPermissions } from '@/decorators/check-policies.decorator';
import { PermissionAction } from '@/enums/permission-action.enum';
import { AuthApiError } from '@/decorators/api-error-response.decorator';
import { PaginationRequestFullDto } from '@/dtos/pagination-request.dto';
import { IdRequestDto } from '@/dtos/id-request.dto';
import { Role } from '@/modules/roles/roles.schema';
import { CreateRoleDto } from '@/modules/roles/dto/create-role.dto';
import { UpdateRoleDto } from '@/modules/roles/dto/update-role.dto';

@ApiExtraModels(PaginationDto)
@ApiBearerAuth()
@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @UseGuards(PoliciesGuard)
  @CheckPermissions([PermissionAction.Read, Role.name])
  @PaginationResponse(Role)
  @ApiOperation({ summary: 'Role list with filter' })
  @AuthApiError()
  @Get()
  async findAll(
    @Query() queries: PaginationRequestFullDto,
  ): Promise<PaginationDto<Role>> {
    const data = await this.rolesService.findAll(queries);

    return data;
  }

  @UseGuards(PoliciesGuard)
  @CheckPermissions([PermissionAction.Read, Role.name])
  @ApiOperation({ summary: 'Get detail role' })
  @AuthApiError()
  @ApiOkResponse({ type: Role })
  @Get(':id')
  async getDetail(@Param() idRequestDto: IdRequestDto): Promise<Role> {
    const data = await this.rolesService.findById(idRequestDto.id);

    return data;
  }

  @UseGuards(PoliciesGuard)
  @CheckPermissions([PermissionAction.Create, Role.name])
  @ApiOperation({ summary: 'Create role' })
  @AuthApiError()
  @ApiCreatedResponse({ type: Role })
  @Post()
  async create(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
    const data = await this.rolesService.create(createRoleDto);

    return data;
  }

  @UseGuards(PoliciesGuard)
  @CheckPermissions([PermissionAction.Update, Role.name])
  @ApiOperation({ summary: 'Update a role' })
  @AuthApiError()
  @ApiCreatedResponse({ type: Role })
  @Patch(':id')
  async update(
    @Param() idRequestDto: IdRequestDto,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<Role> {
    const data = await this.rolesService.update(idRequestDto.id, updateRoleDto);

    return data;
  }

  @UseGuards(PoliciesGuard)
  @CheckPermissions([PermissionAction.Delete, Role.name])
  @ApiOperation({ summary: 'Delete a role' })
  @AuthApiError()
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Delete success' })
  @Delete(':id')
  async delete(@Param() idRequestDto: IdRequestDto) {
    await this.rolesService.delete(idRequestDto.id);
  }
}
