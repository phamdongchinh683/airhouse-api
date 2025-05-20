import { Module } from '@nestjs/common';
import { drizzleProvider } from 'src/providers/drizzle.provider';
import { DeviceService } from '../device/device.service';
import { MailModule } from '../mail/mail.module';
import { AuthService } from './auth.service';

@Module({
  imports: [MailModule],
  providers: [AuthService, drizzleProvider, DeviceService],
  exports: [AuthService],
})
export class AuthModule {}
