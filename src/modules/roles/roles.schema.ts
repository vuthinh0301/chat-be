import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import * as mongoose from 'mongoose';
import { Permission } from '../permissions/permissions.schema';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export type RoleDocument = Role & Document;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    currentTime: () => Date.now(),
  },
})
export class Role {
  @ApiProperty()
  _id: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  @Prop({ required: true, index: true, unique: true })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  @Prop()
  display_name: string;

  @IsOptional()
  @IsArray()
  @ApiProperty()
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }],
  })
  permissions: Permission[] | string[];

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({ default: true, type: Boolean })
  @Prop({ default: true, type: Boolean })
  status: boolean;
}

export const RoleSchema = SchemaFactory.createForClass(Role);

RoleSchema.set('toJSON', {
  transform: function (doc, ret, opt) {
    delete ret['__v'];
    return ret;
  },
});
