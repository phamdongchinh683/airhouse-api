import { Module } from '@nestjs/common';
import { drizzleProvider } from 'src/providers/drizzle.provider';
import { DeviceService } from '../device/device.service';
import { MailModule } from '../mail/mail.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [MailModule],
  controllers: [AuthController],
  providers: [AuthService, drizzleProvider, DeviceService],
  exports: [AuthService],
})
export class AuthModule {}
