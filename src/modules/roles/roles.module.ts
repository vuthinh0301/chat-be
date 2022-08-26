import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from '@/modules/roles/roles.schema';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { IsRoleAlreadyExist } from '@/modules/roles/dto/validation/is-role-already-exist';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
  ],
  providers: [RolesService, IsRoleAlreadyExist],
  exports: [RolesService],
  controllers: [RolesController],
})
export class RolesModule {}
