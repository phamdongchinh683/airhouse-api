import { IsNotEmpty } from 'class-validator';

export class AuthPayLoad {
  @IsNotEmpty()
  sub: string;
  @IsNotEmpty()
  role: string;
}
