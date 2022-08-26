import { Global, Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Permission,
  PermissionSchema,
} from '@/modules/permissions/permissions.schema';
import { IsPermissionAlreadyExist } from '@/modules/permissions/dto/validation/is-permission-already-exist';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Permission.name, schema: PermissionSchema },
    ]),
  ],
  providers: [PermissionsService, IsPermissionAlreadyExist],
  controllers: [PermissionsController],
  exports: [PermissionsService],
})
export class PermissionsModule {}
