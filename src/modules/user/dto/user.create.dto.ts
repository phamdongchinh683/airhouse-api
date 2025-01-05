import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class UserCreateDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 255)
  password: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
