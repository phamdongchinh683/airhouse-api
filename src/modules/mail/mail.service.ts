import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendRequestDevice(email: string) {
    return await this.mailerService.sendMail({
      from: email,
      to: process.env.MAIL_REQUEST,
      subject: 'Verify device',
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h1 style="color: blue;">Device Confirmation Request</h1>
          <p>${email} has requested device confirmation.</p>
          <p style="color: red;">Please verify the request as soon as possible.</p>
        </div>`,
    });
  }

  async sendNewPassword(newPassword: string, email: string) {
    return await this.mailerService.sendMail({
      from: process.env.MAIL_REQUEST,
      to: email,
      subject: 'Forgot Password',
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h1 style="color: red;">Don't share it with anyone!</h1>
          <p>This is new password: ${newPassword}.</p>
        </div>`,
    });
  }
}
