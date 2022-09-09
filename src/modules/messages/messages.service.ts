import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message, MessageDocument } from '@/modules/messages/message.schema';
import { Model } from 'mongoose';
import { CreateMessageDto } from '@/modules/messages/dto/create-message.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MESSAGE_CREATE } from '@/constants/events';
import { MessageCreateEvent } from '@/events/message/message-create.event';
import { ConversationsService } from '@/modules/conversations/conversations.service';
import { throwNotFound } from '@/utils/exception.utils';
import { CONVERSATION_NOT_EXIST } from '@/constants/error-codes.constant';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    private eventEmitter: EventEmitter2,
    private conversationsService: ConversationsService,
  ) {}

  async create(
    user: object,
    createMessageDto: CreateMessageDto,
  ): Promise<Message> {
    console.log(createMessageDto);
    // @ts-ignore
    if (createMessageDto.content.text === '') {
    }
    const message = await this.messageModel.create({
      ...createMessageDto,
      sender: user,
    });

    if (message) {
      this.eventEmitter.emit(
        MESSAGE_CREATE,
        new MessageCreateEvent(
          message.conversation.toString(),
          // @ts-ignore
          message._id.toString(),
        ),
      );
    }

    return message;
  }

  async findAllMessageByConversationId(
    conversationId: string,
  ): Promise<Message[]> {
    const conversation =
      this.conversationsService.findConversationById(conversationId);
    if (!conversation) {
      throwNotFound(CONVERSATION_NOT_EXIST);
    }
    const messages = this.messageModel
      .find({ conversation: conversationId })
      .populate('sender', ['full_name', 'avatar'])
      .sort({ created_at: -1 })
      .limit(10);
    return messages;
  }
}
