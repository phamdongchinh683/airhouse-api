import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Application Programming Interface')
  .setDescription('Air House API description')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
