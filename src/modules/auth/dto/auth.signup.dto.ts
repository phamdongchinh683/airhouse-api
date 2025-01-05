import { IsArray, IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { Role } from 'src/global/globalEnum';

export class AuthSignUpDto {
  @IsEmail({}, { message: 'Please provide a valid email' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password: string;

  @IsArray()
  @IsEnum(Role, {
    each: true,
    message: 'Roles must be valid admin or user values.',
  })
  roles: Role[];
}
