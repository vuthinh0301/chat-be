import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Conversation,
  ConversationDocument,
} from '@/modules/conversations/conversations.schema';
import { CreateConversationDto } from '@/modules/conversations/dto/create-conversation.dto';
import { PaginationDto } from '@/dtos/pagination-response.dto';
import { SortType } from '@/enums/sort.enum';
import { CONVERSATION_NOT_EXIST } from '@/constants/error-codes.constant';
import { UpdateConversationDto } from '@/modules/conversations/dto/update-conversation.dto';
import { throwNotFound } from '@/utils/exception.utils';
import { PaginationRequestConversationDto } from '@/modules/conversations/dto/pagination-request-conversation.dto';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { CONVERSATION_MODIFY } from '@/constants/events';
import { ConversationChangeEvent } from '@/events/conversation/conversation-change.event';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<ConversationDocument>,
    private eventEmitter: EventEmitter2,
  ) {}
}
