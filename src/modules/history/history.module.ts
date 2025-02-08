import { Module } from '@nestjs/common';
import { drizzleProvider } from 'src/providers/drizzle.provider';
import { HistoryService } from './history.service';

@Module({
  providers: [HistoryService, drizzleProvider],
  exports: [HistoryService],
})
export class HistoryModule {}
