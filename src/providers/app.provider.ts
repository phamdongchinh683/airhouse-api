import { AuthService } from 'src/modules/auth/auth.service';
import { DeviceService } from 'src/modules/device/device.service';
import { MailService } from 'src/modules/mail/mail.service';
import { UserService } from 'src/modules/user/user.service';

export const appProviders = [
  UserService,
  AuthService,
  DeviceService,
  MailService,
];
