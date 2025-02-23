import { Module } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { drizzleProvider } from 'src/providers/drizzle.provider';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';

@Module({
  controllers: [ConversationController],
  providers: [ConversationService, drizzleProvider, AuthGuard],
  exports: [ConversationService],
})
export class ConversationModule {}
