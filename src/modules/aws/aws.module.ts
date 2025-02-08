import { Module } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { drizzleProvider } from 'src/providers/drizzle.provider';
import { AuthModule } from '../auth/auth.module';
import { AwsController } from './aws.controller';
import { AwsService } from './aws.service';

@Module({
  imports: [AuthModule],
  controllers: [AwsController],
  providers: [AwsService, drizzleProvider, AuthGuard, RolesGuard],
  exports: [AwsService],
})
export class AwsModule {}
