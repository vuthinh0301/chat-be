import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthApiError } from '@/decorators/api-error-response.decorator';
import { MessagesService } from '@/modules/messages/messages.service';
import { Message } from '@/modules/messages/message.schema';
import { CreateMessageDto } from '@/modules/messages/dto/create-message.dto';

@Controller('messages')
@ApiTags('Message')
@ApiBearerAuth()
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Post()
  @ApiOperation({ summary: 'Create Message' })
  @ApiCreatedResponse({ type: Message, description: 'Message created' })
  @AuthApiError()
  create(@Req() req, @Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.create(req.user, createMessageDto);
  }

  @Get('conversation/:id')
  @ApiOperation({ summary: 'find message by conversation id' })
  @AuthApiError()
  @ApiCreatedResponse({ type: [Message] })
  findAllMessageByConversationId(@Param('id') conversationId: string) {
    return this.messagesService.findAllMessageByConversationId(conversationId);
  }
}
