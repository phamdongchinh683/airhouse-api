import { IsEmail, IsString, MinLength } from 'class-validator';

export class AuthLoginDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password: string;
}
