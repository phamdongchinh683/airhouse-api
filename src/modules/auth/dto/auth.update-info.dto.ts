import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length, Matches } from 'class-validator';

export class AuthUpdateInfoDto {
  @ApiProperty()
  image: string;
  @ApiProperty()
  @IsEmail({}, { message: 'Please provide a valid email' })
  email: string;
  @ApiProperty()
  @IsString({ message: 'phone number must be a string' })
  @Length(10, 15, {
    message: 'phone number must be between 10 and 15 characters',
  })
  @Matches(/^\+?[0-9]*$/, {
    message: 'phone number must be a valid phone number',
  })
  phoneNumber: string;
}
