import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .addSecurity('basic', {
    type: 'http',
    scheme: 'basic',
  })
  .setTitle('Application Programming Interface')
  .setDescription('Air House API description')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

export const buildingOption = new DocumentBuilder()
  .setTitle('Building API')
  .setDescription('CRUD Building')
  .setVersion('1.0')
  .addTag('building')
  .addBearerAuth()
  .build();

export const awsOption = new DocumentBuilder()
  .setTitle('Aws API')
  .setDescription('Upload image')
  .setVersion('1.0')
  .addTag('building')
  .addBearerAuth()
  .build();
