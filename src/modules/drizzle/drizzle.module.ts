import { Module } from '@nestjs/common';
import {
  DrizzleAsyncProvider,
  drizzleProvider,
} from 'src/providers/drizzle.provider';

@Module({
  providers: [drizzleProvider],
  exports: [DrizzleAsyncProvider],
})
export class DrizzleModule {}
