import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';
import { LoggerInterceptor } from './interceptors/logger.interceptor';
dotenv.config({ debug: false });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new LoggerInterceptor());

  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();
