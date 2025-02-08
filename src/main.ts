import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import {
  awsOption,
  buildingOption,
  swaggerConfig,
} from './configs/swagger.config';
import { LoggerInterceptor } from './interceptors/logger.interceptor';
import { AwsModule } from './modules/aws/aws.module';
import { BuildingModule } from './modules/building/building.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new LoggerInterceptor());
  app.use(helmet());

  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, documentFactory, {
    explorer: true,
    swaggerOptions: {
      urls: [
        {
          name: '1. Air house API',
          url: 'api/swagger.json',
        },
        {
          name: '2. Building API',
          url: 'api/building/swagger.json',
        },
        {
          name: '3. Aws API',
          url: 'api/aws/swagger.json',
        },
      ],
    },
    jsonDocumentUrl: '/api/swagger.json',
  });

  const buildingDocument = SwaggerModule.createDocument(app, buildingOption, {
    include: [BuildingModule],
  });

  SwaggerModule.setup('api/building', app, buildingDocument, {
    jsonDocumentUrl: '/api/building/swagger.json',
  });

  const awsDocument = SwaggerModule.createDocument(app, awsOption, {
    include: [AwsModule],
  });

  SwaggerModule.setup('api/aws', app, awsDocument, {
    jsonDocumentUrl: '/api/aws/swagger.json',
  });

  await app.listen(port);
  console.log(`Swagger link: http://localhost:${port}/api`);
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();
