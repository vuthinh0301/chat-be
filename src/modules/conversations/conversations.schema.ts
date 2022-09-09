import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import * as mongoose from 'mongoose';
import { User } from '@/modules/users/user.schema';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { Message } from '@/modules/messages/message.schema';
import { Optional } from '@nestjs/common';

export type ConversationDocument = Conversation & Document;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    currentTime: () => Date.now(),
  },
})
export class Conversation {
  @ApiProperty({ type: String })
  _id: string | mongoose.Schema.Types.ObjectId;

  @ApiProperty({ type: Boolean })
  @IsNotEmpty()
  @IsBoolean()
  @Prop({ type: Boolean, default: false })
  is_group: boolean;

  @ApiProperty({ type: String })
  @IsString()
  @Optional()
  @Prop({ type: String, default: '' })
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    required: true,
  })
  members: User[] | string[];

  @ApiProperty({ type: String })
  @Optional()
  @IsNotEmpty()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Message' })
  last_message: Message | string;

  @Prop({ type: Number })
  created_at: number;

  @Prop({ type: Number })
  updated_at: number;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);

ConversationSchema.set('toJSON', {
  transform: function (doc, ret, opt) {
    delete ret['__v'];
    return ret;
  },
});
