import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

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

  @Prop()
  conversation: string;

  @Prop()
  sender: string;

  @Prop()
  type: string; // enum

  @Prop()
  content: object;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

MessageSchema.set('toJSON', {
  transform: function (doc, ret, opt) {
    delete ret['__v'];
    return ret;
  },
});
