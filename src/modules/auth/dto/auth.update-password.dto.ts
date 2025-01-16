import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class AuthUpdatePasswordDto {
  @ApiProperty()
  @IsString()
  @Length(9, 20, { message: 'password must be between 9 and 20 characters' })
  password: string;
  @ApiProperty()
  @IsString()
  @Length(9, 20, { message: 'password must be between 9 and 20 characters' })
  newPassword: string;
}
