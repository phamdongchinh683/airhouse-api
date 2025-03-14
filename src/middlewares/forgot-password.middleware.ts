import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AuthService } from 'src/modules/auth/auth.service';
import { responseStatus } from 'src/utils/response.util';

@Injectable()
export class ForgotPasswordMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const { email } = req.body;
    const result = await this.authService.findEmail(email);
    if (result.length === 0) {
      return responseStatus(res, 400, 'This email not exist');
    } else {
      req['email'] = email;
      next();
    }
  }
}
