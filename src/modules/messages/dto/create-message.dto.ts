import { PickType } from '@nestjs/swagger';
import { Message } from '@/modules/messages/message.schema';

export class CreateMessageDto extends PickType(Message, [
  'conversation',
  'type',
  'content',
] as const) {}
