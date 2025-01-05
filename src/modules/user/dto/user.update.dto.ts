import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class UserUpdateDto {
  @IsString()
  @Length(3, 100)
  @IsOptional()
  username?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @Length(8, 255)
  @IsOptional()
  password?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
