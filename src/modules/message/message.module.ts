import { Module } from '@nestjs/common';
import { drizzleProvider } from 'src/providers/drizzle.provider';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';

@Module({
  controllers: [MessageController],
  providers: [MessageService, drizzleProvider],
  exports: [MessageService],
})
export class MessageModule {}
