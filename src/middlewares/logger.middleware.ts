import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const body = req.body ? JSON.stringify(req.body) : 'No Body';
    console.log(` [${req.ip} [${req.method}] - ${req.baseUrl} - Body: ${body}`);
    next();
  }
}
