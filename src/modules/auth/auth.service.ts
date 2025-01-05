import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { comparePassword, hashPassword } from 'src/utils/hash.util';
import { UserService } from '../user/user.service';
import { AuthJwtDto } from './dto/auth.jwt.dto';
import { AuthLoginDto } from './dto/auth.signin.dto';
import { AuthSignUpDto } from './dto/auth.signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(data: AuthLoginDto): Promise<AuthJwtDto> {
    const user = await this.userService.findByEmail(data.email);

    const compare = await comparePassword(data.password, user.password);
    if (!user || !compare) {
      throw new UnauthorizedException('Username or password is incorrect');
    }
    const payload = { sub: user.id, roles: user.roles };
    return {
      token: this.jwtService.sign(payload),
    };
  }
  async register(data: AuthSignUpDto): Promise<string> {
    const password = await hashPassword(data.password);
    const newUser = {
      password: password,
      email: data.email,
      roles: data.roles,
    };
    const result = await this.userService.create(newUser);
    if (result) {
      return 'success';
    }
    return 'error';
  }
}
