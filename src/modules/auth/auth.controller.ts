import { Body, Controller, Ip, Post, Req } from '@nestjs/common';
import { ResponseData } from 'src/global/globalClass';
import { httpMessage, httpStatus } from 'src/global/globalEnum';
import { AuthService } from './auth.service';
import { AuthJwtDto } from './dto/auth.jwt.dto';
import { AuthLoginDto } from './dto/auth.signin.dto';
import { AuthSignUpDto } from './dto/auth.signup.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async signIn(
    @Req() req: Request,
    @Body() data: AuthLoginDto,
    @Ip() ip: string,
  ) {
    const newData = {
      email: data.email.toLowerCase(),
      password: data.password,
    };
    try {
      const user = await this.authService.signIn(newData, req, ip);
      return new ResponseData<AuthJwtDto | string>(
        user,
        httpStatus.SUCCESS,
        httpMessage.SUCCESS,
      );
    } catch (e: any) {
      return new ResponseData<string>(
        e.message,
        httpStatus.ERROR,
        httpMessage.ERROR,
      );
    }
  }
  @Post('register')
  async signUp(@Body() data: AuthSignUpDto) {
    try {
      const user = await this.authService.register(data);
      return new ResponseData<string>(
        user,
        httpStatus.SUCCESS,
        httpMessage.SUCCESS,
      );
    } catch (e: any) {
      const unique = e.constraint.split('_')[1];
      const result = unique + ' exited';
      return new ResponseData<string>(
        result,
        httpStatus.ERROR,
        httpMessage.ERROR,
      );
    }
  }
}
