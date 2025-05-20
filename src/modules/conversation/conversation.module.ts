import { Module } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { drizzleProvider } from 'src/providers/drizzle.provider';
import { AuthService } from '../auth/auth.service';
import { DeviceModule } from '../device/device.module';
import { MailModule } from '../mail/mail.module';
import { ConversationService } from './conversation.service';

@Module({
  imports: [DeviceModule, MailModule],
  providers: [ConversationService, drizzleProvider, AuthGuard, AuthService],
  exports: [ConversationService],
})
export class ConversationModule {}
