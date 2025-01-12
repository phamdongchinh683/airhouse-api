import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendRequestDevice(user) {
    await this.mailerService.sendMail({
      to: 'phamdongchinh789@gmail.com',
      subject: 'Welcome to Nice App! Confirm your Email',
      html: `<p>Hello ${user},</p><p>Welcome to Nice App! Please confirm your email.</p>`,
    });
  }
}
