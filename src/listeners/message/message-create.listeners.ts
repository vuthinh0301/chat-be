import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MESSAGE_CREATE } from '@/constants/events';
import { ConversationsService } from '@/modules/conversations/conversations.service';
import { MessageCreateEvent } from '@/events/message/message-create.event';

@Injectable()
export class MessageCreateListener {
  constructor(private conversationsService: ConversationsService) {}

  @OnEvent(MESSAGE_CREATE, { async: true })
  async updateLastMessage(payload: MessageCreateEvent) {
    await this.conversationsService.updateLastMessage(payload);
  }
}
