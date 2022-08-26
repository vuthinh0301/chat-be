import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '@/dtos/pagination-response.dto';
import { ConversationsService } from '@/modules/conversations/conversations.service';

@ApiExtraModels(PaginationDto)
@ApiBearerAuth()
@ApiTags('Conversations')
@Controller('conversations')
export class ConversationsController {
  constructor(private conversationsService: ConversationsService) {}
}
