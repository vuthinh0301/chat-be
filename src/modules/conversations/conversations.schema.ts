import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import * as mongoose from 'mongoose';
import { User } from '@/modules/users/user.schema';

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

  @Prop()
  is_group: boolean;

  @Prop()
  name: string;

  @Prop()
  members: User[];

  @Prop()
  last_message: string;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);

ConversationSchema.set('toJSON', {
  transform: function (doc, ret, opt) {
    delete ret['__v'];
    return ret;
  },
});
