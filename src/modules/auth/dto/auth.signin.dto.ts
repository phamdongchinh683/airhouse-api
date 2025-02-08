import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class AuthLoginDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'email must not be empty' })
  @IsEmail({}, { message: 'Please provide a valid email' })
  email: string;
  @ApiProperty()
  @IsString()
  @Length(9, 20, { message: 'password must be between 9 and 20 characters' })
  password: string;
}
