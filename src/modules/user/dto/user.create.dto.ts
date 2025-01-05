import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class UserCreateDto {
  @IsString()
  @Length(3, 100)
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 255)
  password: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
