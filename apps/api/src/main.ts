import cookieParser from 'cookie-parser';
import { SwaggerModule } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, HttpStatus } from '@nestjs/common';
import { AppModule } from './app.module';
import { EnvService } from './config/env/env.service';
import { SWAGGER_OPTIONS, swaggerDocumentOptions } from './swagger';
import { BaseException } from './exception/base.exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(EnvService);

  const apiPrefix = configService.get('API_PREFIX');
  const port = configService.get('PORT');

  app.setGlobalPrefix(apiPrefix);
  app.enableCors({ credentials: true });
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: errors => {
        const messages = errors.map(error => {
          return Object.values(error.constraints || {}).join(', ');
        });

        return new BaseException({
          code: 'VALIDATION_ERROR',
          message: messages[0] || 'Validation failed',
          statusCode: HttpStatus.BAD_REQUEST,
          details: messages,
        });
      },
    })
  );

  const document = SwaggerModule.createDocument(app, swaggerDocumentOptions);
  SwaggerModule.setup(SWAGGER_OPTIONS.PATH, app, document);

  await app.listen(port);
}
bootstrap();
