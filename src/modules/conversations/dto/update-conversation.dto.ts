import { PickType } from '@nestjs/swagger';
import { Allow } from 'class-validator';
import { RequestContext } from '@/dtos/request-context';
import { Conversation } from '@/modules/conversations/conversations.schema';

export class UpdateConversationDto extends PickType(Conversation, [] as const) {
  @Allow()
  context?: RequestContext;
}
