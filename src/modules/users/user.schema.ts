import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UserStatus } from './enum/user.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@/modules/roles/roles.schema';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserGender } from '@/modules/users/enum/user-gender.enum';

export type UserDocument = User & Document;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    currentTime: () => Date.now(),
  },
})
export class User {
  @ApiProperty({ type: String, required: true })
  _id: string | ObjectId;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, required: true })
  @Prop({ type: String, required: true })
  phone: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, required: true })
  @Prop({ type: String, default: '' })
  full_name: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @ApiProperty({ type: String, required: true })
  @Prop({ type: String, required: true, unique: true, index: true })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, required: true })
  @Prop({ type: String, required: true })
  password: string;

  @ApiProperty({ enum: UserStatus, default: UserStatus.active })
  @IsEnum(UserStatus)
  @Prop({ required: true, enum: UserStatus, default: UserStatus.active })
  status: UserStatus;

  @IsNotEmpty()
  @ApiProperty({ type: String, required: true })
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: Role.name,
  })
  role: Role | string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ type: Number, required: false })
  @Prop({ type: Number })
  date_of_birth: number;

  @ApiProperty({ enum: UserGender, default: UserGender.male })
  @IsEnum(UserGender)
  @Prop({ enum: UserGender, default: UserGender.male })
  gender: UserGender;

  @IsString()
  @ApiProperty({ type: String })
  @Prop({ type: String, default: '' })
  avatar: string;

  @ApiProperty()
  @Prop()
  active_code: string;

  @ApiProperty()
  @Prop({ type: Number })
  active_code_expired: number;

  @ApiProperty()
  @Prop({ type: Number })
  active_at: number;

  @ApiProperty()
  @Prop()
  forgot_code: string;

  @ApiProperty()
  @Prop({ type: Number })
  forgot_code_expired: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  created_by: User | string;

  @Prop({ type: Number })
  created_at: number;

  @Prop({ type: Number })
  updated_at: number;

  @Prop({ type: Number })
  deleted_at?: number;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;

  if (this.isModified('email') || this.isNew) {
    // @ts-ignore
    user.email = user.email.toLowerCase();
  }

  if (this.isModified('password') || this.isNew) {
    const salt = await bcrypt.genSalt(10);

    // @ts-ignore
    user.password = await bcrypt.hash(user.password, salt);
  }

  return next();
});

UserSchema.set('toJSON', {
  transform: function (doc, ret, opt) {
    delete ret['password'];
    delete ret['__v'];
    return ret;
  },
});
