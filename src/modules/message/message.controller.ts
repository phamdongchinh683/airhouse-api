import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ResponseData } from 'src/global/globalClass';
import { httpMessage, httpStatus } from 'src/global/globalEnum';
import { MessageHistoryDto } from './dto/message.history.dto';
import { MessageService } from './message.service';

@ApiBearerAuth()
@ApiTags('message')
@Controller('api/v1/message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get(':id')
  async getConversation(@Param('id') id: string) {
    try {
      const result = await this.messageService.getMessages(id);
      console.log(result);
      return new ResponseData<MessageHistoryDto[]>(
        result,
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
