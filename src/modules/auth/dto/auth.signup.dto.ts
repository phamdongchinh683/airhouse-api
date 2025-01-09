import { IsEmail, IsEnum, IsString, Length, Matches } from 'class-validator';
import { Role } from 'src/global/globalEnum';

export class AuthSignUpDto {
  @IsEmail({}, { message: 'Please provide a valid email' })
  email: string;
  @IsString()
  @Length(9, 20, { message: 'password must be between 9 and 20 characters' })
  password: string;
  @IsString({ message: 'phone number must be a string' })
  @Length(10, 15, {
    message: 'phone number must be between 10 and 15 characters',
  })
  @Matches(/^\+?[0-9]*$/, {
    message: 'phone number must be a valid phone number',
  })
  phoneNumber: string;
  @IsEnum(Role, {
    message:
      'Roles must be a valid value from: user, admin, sale, project_management, ctv',
  })
  role: Role;
}
