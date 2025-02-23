import { Module } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { drizzleProvider } from 'src/providers/drizzle.provider';
import { AuthModule } from '../auth/auth.module';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';

@Module({
  imports: [AuthModule],
  controllers: [ConversationController],
  providers: [ConversationService, drizzleProvider, AuthGuard],
  exports: [ConversationService],
})
export class ConversationModule {}
