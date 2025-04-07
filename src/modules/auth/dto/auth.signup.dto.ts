import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, Length, Matches } from 'class-validator';
import { Role } from 'src/global/globalEnum';

export class AuthSignUpDto {
  @ApiProperty()
  @IsEmail({}, { message: 'Please provide a valid email' })
  email: string;
  @ApiProperty()
  @IsString()
  @Length(9, 20, { message: 'Password must be between 9 and 20 characters' })
  password: string;
  @ApiProperty()
  @IsString({ message: 'phone number must be a string' })
  @Length(10, 15, {
    message: 'phone number must be between 10 and 15 characters',
  })
  @Matches(/^\+?[0-9]*$/, {
    message: 'phone number must be a valid phone number',
  })
  phoneNumber: string;
  @ApiProperty({ enum: Role })
  @IsEnum(Role, {
    message:
      'Roles must be a valid value from: user, admin, sale, project_management, ctv',
  })
  role: Role;
}
