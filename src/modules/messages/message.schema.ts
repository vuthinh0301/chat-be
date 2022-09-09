import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Conversation } from '@/modules/conversations/conversations.schema';
import { User } from '@/modules/users/user.schema';
import { MessageType } from '@/modules/messages/enum/message-type.enum';
import { IsEnum, IsNotEmpty } from 'class-validator';

export type MessageDocument = Message & Document;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    currentTime: () => Date.now(),
  },
})
export class Message {
  @ApiProperty({ type: String, required: true })
  _id: string | ObjectId;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true,
  })
  conversation: string | Conversation;

  @ApiProperty({ type: String })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  sender: User | string;

  @ApiProperty({ enum: MessageType, default: MessageType.text })
  @IsEnum(MessageType)
  @IsNotEmpty()
  @Prop({ required: true, enum: MessageType, default: MessageType.text })
  type: MessageType;

  @ApiProperty()
  @IsNotEmpty()
  @Prop({ type: Object })
  content: object;

  @Prop({ type: Number })
  created_at: number;

  @Prop({ type: Number })
  updated_at: number;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

MessageSchema.set('toJSON', {
  transform: function (doc, ret, opt) {
    delete ret['__v'];
    return ret;
  },
});
