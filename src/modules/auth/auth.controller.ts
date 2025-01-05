import { Body, Controller, Post, Req } from '@nestjs/common';
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
  async signIn(@Req() req, @Body() data: AuthLoginDto) {
    const newData = {
      email: data.email,
      password: data.password,
    };
    try {
      const user = await this.authService.signIn(newData);
      return new ResponseData<AuthJwtDto>(
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
      return new ResponseData<string>(
        e.message || 'Authentication failed',
        httpStatus.ERROR,
        httpMessage.ERROR,
      );
    }
  }
}
