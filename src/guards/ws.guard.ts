import { CanActivate, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Observable } from 'rxjs';
import { AuthService } from 'src/modules/auth/auth.service';
import { AuthPayLoad } from 'src/modules/auth/dto/auth.payload.dto';
import { jwtConstants } from 'src/utils/constants.util';

@Injectable()
export class WsGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
  ) {}

  async canActivate(
    context: any,
  ): Promise<
    boolean | any | Promise<boolean | any> | Observable<boolean | any>
  > {
    const bearerToken =
      context.args[0].handshake.headers.authorization.split(' ')[1];
    if (!bearerToken) {
      throw new WsException('No token or invalid token');
    }
    try {
      const payload = await this.jwtService.verifyAsync(bearerToken, {
        secret: jwtConstants.secret,
      });

      const user: AuthPayLoad = await this.authService.findUserById(
        payload.sub,
      );

      if (!user) {
        throw new WsException('User not found');
      }

      context.args[0].handshake.user = user;
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
