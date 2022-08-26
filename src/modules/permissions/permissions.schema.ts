import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import * as mongoose from 'mongoose';
import { PermissionAction } from '@/enums/permission-action.enum';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export type PermissionDocument = Permission & Document;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    currentTime: () => Date.now(),
  },
})
export class Permission {
  @ApiProperty({ type: String })
  _id: string | mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  @Prop({ unique: true, index: true })
  name: string;

  @IsNotEmpty()
  @IsEnum(PermissionAction)
  @ApiProperty({ enum: PermissionAction, default: PermissionAction.Manage })
  @Prop({ enum: PermissionAction, default: PermissionAction.Manage })
  action: PermissionAction;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  @Prop()
  object: string;

  @IsOptional()
  @IsObject()
  @ApiProperty({ required: false })
  @Prop({ type: Object })
  condition: object;

  @IsOptional()
  @IsArray()
  @ApiProperty()
  @Prop({ type: [String] })
  fields: string[];

  @Prop()
  created_at: number;

  @Prop()
  updated_at: number;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);

PermissionSchema.set('toJSON', {
  transform: function (doc, ret, opt) {
    delete ret['__v'];
    return ret;
  },
});
