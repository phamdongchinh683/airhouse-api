import { Module } from '@nestjs/common';
import { AuthModule } from 'src/modules/auth/auth.module';
import { ConversationService } from 'src/modules/conversation/conversation.service';
import { MessageModule } from 'src/modules/message/message.module';
import { MessageService } from 'src/modules/message/message.service';
import { drizzleProvider } from 'src/providers/drizzle.provider';
import { ChatGateWay } from './chat.gateway';

@Module({
  imports: [MessageModule, AuthModule],
  providers: [
    ChatGateWay,
    MessageService,
    drizzleProvider,
    ConversationService,
  ],
  exports: [ChatGateWay],
})
export class ChatGateWayModule {}
