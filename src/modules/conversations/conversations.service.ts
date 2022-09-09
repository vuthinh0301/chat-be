import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Conversation,
  ConversationDocument,
} from '@/modules/conversations/conversations.schema';
import { CreateConversationDto } from '@/modules/conversations/dto/create-conversation.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MessageCreateEvent } from '@/events/message/message-create.event';
import { throwNotFound } from '@/utils/exception.utils';
import {
  CONVERSATION_NOT_EXIST,
  USER_NOT_EXIST,
} from '@/constants/error-codes.constant';
@Injectable()
export class ConversationsService {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<ConversationDocument>,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(
    createConversationDto: CreateConversationDto,
  ): Promise<Conversation> {
    const conversation = await this.conversationModel.create({
      ...createConversationDto,
    });

    return conversation;
  }

  async findConversationById(id: string): Promise<Conversation> {
    const conversation = await this.conversationModel.findById(id);

    if (!conversation) {
      throwNotFound(CONVERSATION_NOT_EXIST);
    }

    return conversation;
  }

  async findAll(currentUserId: string): Promise<Conversation[]> {
    const conversations = await this.conversationModel
      .find({ members: currentUserId })
      .populate('members')
      .populate('last_message', ['content', 'created_at'])
      .sort({ updated_at: -1 });

    // const result = conversations.filter((con) =>
    //   con.members.includes(currentUserId),
    // );

    return conversations;
  }

  async updateLastMessage(payload: MessageCreateEvent) {
    const con = await this.conversationModel.findByIdAndUpdate(
      payload.conversation,
      {
        last_message: payload.last_message,
      },
      { new: true },
    );
  }
}
