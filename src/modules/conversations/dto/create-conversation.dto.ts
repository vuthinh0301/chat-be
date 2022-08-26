import { PickType } from '@nestjs/swagger';
import { Conversation } from '@/modules/conversations/conversations.schema';

export class CreateConversationDto extends PickType(
  Conversation,
  [] as const,
) {}
