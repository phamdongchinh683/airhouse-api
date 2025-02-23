import { IsNotEmpty } from 'class-validator';

export class AuthLogout {
  @IsNotEmpty()
  userId: string;
  @IsNotEmpty()
  token: string;
}
