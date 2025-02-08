import { Module } from '@nestjs/common';
import { drizzleProvider } from 'src/providers/drizzle.provider';
import { AuthModule } from '../auth/auth.module';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';

@Module({
  imports: [AuthModule],
  controllers: [ConversationController],
  providers: [ConversationService, drizzleProvider],
  exports: [ConversationService],
})
export class ConversationModule {}
