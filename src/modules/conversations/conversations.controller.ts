import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ConversationsService } from '@/modules/conversations/conversations.service';
import { AuthApiError } from '@/decorators/api-error-response.decorator';
import { Conversation } from '@/modules/conversations/conversations.schema';
import { CreateConversationDto } from '@/modules/conversations/dto/create-conversation.dto';
import { Public } from '@/decorators/public.decorator';

// @Public()
@ApiBearerAuth()
@ApiTags('Conversations')
@Controller('conversations')
export class ConversationsController {
  constructor(private conversationsService: ConversationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create Coversation' })
  @ApiCreatedResponse({
    type: Conversation,
    description: 'Conversation created',
  })
  @AuthApiError()
  create(@Body() createConversationDto: CreateConversationDto) {
    return this.conversationsService.create(createConversationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Create Coversation' })
  @ApiCreatedResponse({
    type: [Conversation],
    description: 'Conversation created',
  })
  @AuthApiError()
  findAll(@Req() req) {
    return this.conversationsService.findAll(req.user._id);
  }
}
