import {
  Body,
  Controller,
  Ip,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { ResponseData } from 'src/global/globalClass';
import { httpMessage, httpStatus } from 'src/global/globalEnum';
import { AuthGuard } from 'src/guards/auth.guard';
import { AuthService } from './auth.service';
import { AuthJwtDto } from './dto/auth.jwt.dto';
import { AuthLoginDto } from './dto/auth.signin.dto';
import { AuthSignUpDto } from './dto/auth.signup.dto';
import { AuthUpdatePasswordDto } from './dto/auth.update-password.dto';

@ApiTags('auth')
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
  @Post('forgot-password')
  @ApiBody({
    description: 'Email address for password reset, handled by middleware.',
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          format: 'email',
          example: 'phamdongchinh789@gmail.com',
        },
      },
      required: ['email'],
    },
  })
  async forgotPassword(@Req() req: Request) {
    const email = req['email'];
    try {
      const result = await this.authService.updatePasswordByEmail(email);
      return new ResponseData<string>(
        result,
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
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Put('update-password')
  async updatePassword(
    @Req() req: Request,
    @Body() data: AuthUpdatePasswordDto,
  ) {
    try {
      const result = await this.authService.updatePassword(
        data,
        req['user'].sub,
      );
      return new ResponseData<string>(
        result,
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

  @UseGuards(AuthGuard)
  @Post('refresh-token')
  async refreshToken(@Req() req: Request) {
    try {
      const result = await this.authService.refreshToken(req['token']);
      return new ResponseData<AuthJwtDto | string>(
        result,
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
}
