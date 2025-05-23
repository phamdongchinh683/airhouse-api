import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ResponseData } from 'src/global/globalClass';
import { httpMessage, httpStatus } from 'src/global/globalEnum';
import { AuthGuard } from 'src/guards/auth.guard';
import { ConversationService } from './conversation.service';
import { ConversationList } from './dto/conversation-list.dto';

@ApiBearerAuth()
@ApiTags('conversation')
@UseGuards(AuthGuard)
@Controller('api/v1/conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Get()
  async getConversation(@Req() req: Request) {
    try {
      const conversations =
        await this.conversationService.getConversationsByUser(req['user'].sub);
      return new ResponseData<ConversationList[]>(
        conversations,
        httpStatus.SUCCESS,
        httpMessage.SUCCESS,
      );
    } catch (e: any) {
      return new ResponseData<string>(
        e.message,
        httpStatus.ERROR,
        httpMessage.ERROR,
      );
    }
  }
}
