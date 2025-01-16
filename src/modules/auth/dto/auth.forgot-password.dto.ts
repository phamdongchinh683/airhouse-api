import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class AuthForgotPassword {
  @ApiProperty()
  @IsEmail({}, { message: 'Please provide a valid email' })
  email: string;
}
