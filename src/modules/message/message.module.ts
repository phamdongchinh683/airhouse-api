import { Module } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { drizzleProvider } from 'src/providers/drizzle.provider';
import { AuthModule } from '../auth/auth.module';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';

@Module({
  imports: [AuthModule],
  controllers: [MessageController],
  providers: [MessageService, drizzleProvider, AuthGuard],
  exports: [MessageService],
})
export class MessageModule {}
